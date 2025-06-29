import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { UtensilsCrossed, ShoppingBag, ChevronDown, Download, } from "lucide-react";
import ReactGA from "react-ga4";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "./selector.scss";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
const GA4_EVENTS = {
    DROPDOWN_OPEN: "carte_dropdown_open",
    MENU_SELECT: "carte_menu_select",
    PDF_DISPLAY: "carte_pdf_display",
    PDF_DOWNLOAD: "carte_pdf_download",
    PDF_ERROR: "carte_pdf_error",
};
const Selector = ({ onMenuSelect, className, showPdf = true, onPdfToggle, selectedMenu: parentSelectedMenu, pageName = "Unknown Page", }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageWidth, setPageWidth] = useState(800);
    const [selectedMenu, setSelectedMenu] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [pdfLoaded, setPdfLoaded] = useState(false);
    const [internalShowPdf, setInternalShowPdf] = useState(showPdf);
    const [loadingOffset, setLoadingOffset] = useState(false);
    const lastDropdownTime = useRef(0);
    const dropdownDebounceMs = 1000; // 1 second debounce
    const containerRef = useRef(null);
    const dropdownRef = useRef(null);
    const loadingTimeoutRef = useRef(null);
    const isMobile = () => window.innerWidth < 768;
    const getLoadingDelay = () => {
        return isMobile() ? 7000 : 9000;
    };
    const handleMenuLoad = (menuType) => {
        const startTime = Date.now();
        ReactGA.event(GA4_EVENTS.MENU_SELECT, {
            page_name: pageName,
            menu_type: menuType === "sur_place" ? "dine_in" : "takeaway",
        });
        setNumPages(null);
        setPdfLoaded(false);
        setInternalShowPdf(true);
        setIsLoading(true);
        setLoadingOffset(true);
        if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
        }
        if (onMenuSelect) {
            onMenuSelect(menuType);
        }
        if (onPdfToggle) {
            onPdfToggle(true);
        }
        if (menuType === "a_emporter") {
            setIsLoading(false);
            setLoadingOffset(false);
        }
        else {
            const loadingDelay = getLoadingDelay();
            loadingTimeoutRef.current = setTimeout(() => {
                const loadTime = Date.now() - startTime;
                setIsLoading(false);
                setLoadingOffset(false);
            }, loadingDelay);
        }
    };
    const handleMenuSelect = (menuType) => {
        setSelectedMenu(menuType);
        setDropdownOpen(false);
        handleMenuLoad(menuType);
    };
    const handleDropdownToggle = () => {
        const now = Date.now();
        if (now - lastDropdownTime.current < dropdownDebounceMs) {
            return;
        }
        lastDropdownTime.current = now;
        if (!dropdownOpen) {
            ReactGA.event(GA4_EVENTS.DROPDOWN_OPEN, {
                page_name: pageName,
            });
        }
        setDropdownOpen(!dropdownOpen);
    };
    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setPageWidth(containerRef.current.offsetWidth - 40);
            }
        };
        updateWidth();
        window.addEventListener("resize", updateWidth, { passive: true });
        return () => window.removeEventListener("resize", updateWidth);
    }, []);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current &&
                !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    useEffect(() => {
        if (parentSelectedMenu !== undefined &&
            parentSelectedMenu !== selectedMenu) {
            setSelectedMenu(parentSelectedMenu);
            if (parentSelectedMenu) {
                handleMenuLoad(parentSelectedMenu);
            }
            else {
                setNumPages(null);
                setPdfLoaded(false);
                setInternalShowPdf(false);
                setIsLoading(false);
                setLoadingOffset(false);
                if (loadingTimeoutRef.current) {
                    clearTimeout(loadingTimeoutRef.current);
                }
            }
        }
    }, [parentSelectedMenu]);
    useEffect(() => {
        setInternalShowPdf(showPdf);
        if (!showPdf) {
            setNumPages(null);
            setPdfLoaded(false);
            setIsLoading(false);
            setLoadingOffset(false);
            if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
            }
        }
    }, [showPdf]);
    useEffect(() => {
        if (pdfLoaded && !isLoading && internalShowPdf && selectedMenu) {
            ReactGA.event(GA4_EVENTS.PDF_DISPLAY, {
                page_name: pageName,
                menu_type: selectedMenu === "sur_place" ? "dine_in" : "takeaway",
                num_pages: numPages || 0,
            });
        }
    }, [pdfLoaded, isLoading, internalShowPdf, selectedMenu, numPages, pageName]);
    useEffect(() => {
        return () => {
            if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
            }
        };
    }, []);
    const getPdfFile = () => {
        if (selectedMenu === "sur_place")
            return "/carterositrattoria.pdf";
        if (selectedMenu === "a_emporter")
            return "/carterositrattoriaemporter.pdf";
        return null;
    };
    const handleDownloadPdf = () => {
        ReactGA.event(GA4_EVENTS.PDF_DOWNLOAD, {
            page_name: pageName,
            menu_type: selectedMenu === "sur_place" ? "dine_in" : "takeaway",
        });
        const pdfFile = getPdfFile();
        if (pdfFile) {
            const link = document.createElement("a");
            link.href = pdfFile;
            link.download =
                selectedMenu === "sur_place"
                    ? "Carte-Restaurant-Sur-Place.pdf"
                    : "Carte-Restaurant-A-Emporter.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
    const getMenuOptions = () => [
        {
            value: "sur_place",
            label: "Carte sur place",
            description: "Ambiance conviviale et service à table",
            icon: UtensilsCrossed,
        },
        {
            value: "a_emporter",
            label: "Carte à emporter",
            description: "À savourer où vous voulez",
            icon: ShoppingBag,
            hasDiscount: true,
        },
    ];
    const getSelectedMenuInfo = () => {
        return getMenuOptions().find((option) => option.value === selectedMenu);
    };
    const handleDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setPdfLoaded(true);
    };
    const handleDocumentError = (error) => {
        ReactGA.event(GA4_EVENTS.PDF_ERROR, {
            page_name: pageName,
            menu_type: selectedMenu === "sur_place" ? "dine_in" : "takeaway",
            error_message: error.message,
        });
        console.error("PDF loading error:", error);
    };
    const renderPages = () => {
        if (!numPages)
            return null;
        const mobile = isMobile();
        return (_jsx("div", { className: "pdf-page-grid", children: Array.from({ length: numPages }, (_, i) => (_jsx("div", { className: "pdf-page-container", "data-page": i + 1, children: _jsx(Page, { pageNumber: i + 1, width: pageWidth, renderTextLayer: !mobile, renderAnnotationLayer: false, renderMode: "canvas", className: "pdf-page", loading: _jsx("div", { className: "page-loading", children: "Chargement..." }) }) }, i + 1))) }));
    };
    const selectedMenuInfo = getSelectedMenuInfo();
    return (_jsxs("div", { className: `selector-container ${className || ""}`, ref: containerRef, children: [_jsxs("div", { className: "selector-header", children: [_jsx(UtensilsCrossed, { className: "header-icon", size: 24 }), _jsx("h2", { children: "Notre Carte" })] }), _jsxs("div", { className: "selector-content", children: [selectedMenu && isLoading && (_jsx("div", { className: "document-loading", children: _jsxs("div", { className: "loading-content", children: [_jsx("div", { className: "loading-spinner" }), _jsxs("span", { className: "loading-announcement", children: ["Chargement en cours...", _jsx("br", {}), _jsx("small", { children: "Nous optimisons la qualit\u00E9 du fichier, merci de patienter un instant" })] })] }) })), selectedMenu && !isLoading && internalShowPdf && (_jsx("div", { className: "download-section", children: _jsxs("span", { className: "download-link", onClick: handleDownloadPdf, children: [_jsx(Download, { className: "download-icon", size: 18 }), _jsx("span", { children: "T\u00E9l\u00E9charger en PDF" })] }) })), _jsxs("div", { className: "dropdown-container", ref: dropdownRef, children: [_jsxs("div", { className: `dropdown-trigger ${selectedMenu ? "selected" : ""}`, onClick: handleDropdownToggle, children: [_jsx("div", { className: "dropdown-trigger-content", children: selectedMenu && selectedMenuInfo ? (_jsxs(_Fragment, { children: [_jsx(selectedMenuInfo.icon, { className: "service-icon", size: 20 }), _jsxs("div", { className: "service-info", children: [_jsx("span", { className: "service-label", children: selectedMenuInfo.label }), _jsx("span", { className: "service-description", children: selectedMenuInfo.description })] }), selectedMenuInfo.hasDiscount && (_jsx("span", { className: "discount-badge", children: "Tarifs r\u00E9duits" }))] })) : (_jsx(_Fragment, { children: _jsx("div", { className: "service-info", children: _jsx("span", { className: "service-label", children: "Choisissez une carte" }) }) })) }), _jsx(ChevronDown, { className: `dropdown-arrow ${dropdownOpen ? "open" : ""}`, size: 20 })] }), _jsx("div", { className: `dropdown-menu ${dropdownOpen ? "open" : ""}`, children: getMenuOptions().map((option) => (_jsxs("div", { className: "dropdown-option", onClick: () => handleMenuSelect(option.value), children: [_jsx(option.icon, { className: "service-icon", size: 20 }), _jsxs("div", { className: "service-info", children: [_jsx("span", { className: "service-label", children: option.label }), _jsx("span", { className: "service-description", children: option.description })] }), option.hasDiscount && (_jsx("span", { className: "discount-badge", children: "Tarifs r\u00E9duits" }))] }, option.value))) })] })] }), selectedMenu && internalShowPdf && (_jsx("div", { className: `pdf-section ${loadingOffset ? "loading-offset" : ""}`, children: _jsx(Document, { file: getPdfFile(), onLoadSuccess: handleDocumentLoadSuccess, onLoadError: handleDocumentError, loading: null, children: renderPages() }, `${selectedMenu}-${Date.now()}`) })), numPages && pdfLoaded && !isMobile() && internalShowPdf && (_jsxs("div", { className: "page-indicator", children: [numPages, " page", numPages > 1 ? "s" : ""] }))] }));
};
export default Selector;
