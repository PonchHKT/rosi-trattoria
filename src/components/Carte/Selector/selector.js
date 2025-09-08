import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { UtensilsCrossed, ShoppingBag, ChevronDown, Download, Calendar, } from "lucide-react";
import ReactGA from "react-ga4";
import "./selector.scss";
const GA4_EVENTS = {
    DROPDOWN_OPEN: "carte_dropdown_open",
    MENU_SELECT: "carte_menu_select",
    PDF_DISPLAY: "carte_pdf_display",
    PDF_DOWNLOAD: "carte_pdf_download",
    PDF_ERROR: "carte_pdf_error",
    BACK_TO_HOURS: "carte_back_to_hours",
};
const Selector = ({ onMenuSelect, className, showPdf = true, onPdfToggle, selectedMenu: parentSelectedMenu, pageName = "Unknown Page", onBackToHours, }) => {
    const [selectedMenu, setSelectedMenu] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [internalShowPdf, setInternalShowPdf] = useState(showPdf);
    const [loadingOffset, setLoadingOffset] = useState(false);
    const [imageLoadErrors, setImageLoadErrors] = useState(new Set());
    const lastDropdownTime = useRef(0);
    const dropdownDebounceMs = 1000;
    const containerRef = useRef(null);
    const dropdownRef = useRef(null);
    const loadingTimeoutRef = useRef(null);
    const isMobile = () => window.innerWidth < 768;
    const getMenuImages = (menuType) => {
        if (menuType === "sur_place") {
            return Array.from({ length: 11 }, (_, i) => `https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/cartesurplace/surplacepage${i + 1}.jpg`);
        }
        else if (menuType === "a_emporter") {
            return Array.from({ length: 2 }, (_, i) => `https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/carteaemporter/emporterpage${i + 1}.jpg`);
        }
        return [];
    };
    const getTotalPages = (menuType) => {
        return menuType === "sur_place" ? 11 : 2;
    };
    const handleBackToHours = () => {
        setSelectedMenu("");
        setInternalShowPdf(false);
        setImagesLoaded(false);
        setIsLoading(false);
        setLoadingOffset(false);
        setDropdownOpen(false); // Close dropdown when going back to hours
        if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
        }
        ReactGA.event(GA4_EVENTS.BACK_TO_HOURS, {
            page_name: pageName,
            previous_menu: selectedMenu,
        });
        if (onBackToHours) {
            onBackToHours();
        }
        if (onPdfToggle) {
            onPdfToggle(false);
        }
        if (onMenuSelect) {
            onMenuSelect("");
        }
    };
    const handleMenuLoad = (menuType) => {
        const startTime = Date.now();
        ReactGA.event(GA4_EVENTS.MENU_SELECT, {
            page_name: pageName,
            menu_type: menuType === "sur_place" ? "dine_in" : "takeaway",
        });
        setImagesLoaded(false);
        setInternalShowPdf(true);
        setIsLoading(true);
        setLoadingOffset(true);
        setImageLoadErrors(new Set());
        if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
        }
        if (onMenuSelect) {
            onMenuSelect(menuType);
        }
        if (onPdfToggle) {
            onPdfToggle(true);
        }
        // Précharger les images
        const images = getMenuImages(menuType);
        let loadedCount = 0;
        const totalImages = images.length;
        const checkAllLoaded = () => {
            if (loadedCount === totalImages) {
                setIsLoading(false);
                setLoadingOffset(false);
                setImagesLoaded(true);
            }
        };
        images.forEach((src, index) => {
            const img = new Image();
            img.onload = () => {
                loadedCount++;
                checkAllLoaded();
            };
            img.onerror = () => {
                setImageLoadErrors((prev) => new Set(prev).add(src));
                loadedCount++;
                checkAllLoaded();
            };
            img.src = src;
        });
        // Timeout de sécurité
        const loadingDelay = isMobile() ? 3000 : 2000;
        loadingTimeoutRef.current = setTimeout(() => {
            setIsLoading(false);
            setLoadingOffset(false);
            setImagesLoaded(true);
        }, loadingDelay);
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
                setImagesLoaded(false);
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
            setImagesLoaded(false);
            setIsLoading(false);
            setLoadingOffset(false);
            if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
            }
        }
    }, [showPdf]);
    useEffect(() => {
        if (imagesLoaded && !isLoading && internalShowPdf && selectedMenu) {
            ReactGA.event(GA4_EVENTS.PDF_DISPLAY, {
                page_name: pageName,
                menu_type: selectedMenu === "sur_place" ? "dine_in" : "takeaway",
                num_pages: getTotalPages(selectedMenu),
            });
        }
    }, [imagesLoaded, isLoading, internalShowPdf, selectedMenu, pageName]);
    useEffect(() => {
        return () => {
            if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
            }
        };
    }, []);
    const getPdfFile = () => {
        if (selectedMenu === "sur_place") {
            return "/carterositrattoria.pdf";
        }
        else if (selectedMenu === "a_emporter") {
            return "/carterositrattoriaemporter.pdf";
        }
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
    const renderAllMenuPages = () => {
        if (!selectedMenu || !imagesLoaded)
            return null;
        const images = getMenuImages(selectedMenu);
        return (_jsx("div", { className: "menu-pages-container", children: images.map((imageSrc, index) => {
                if (imageLoadErrors.has(imageSrc)) {
                    return (_jsx("div", { className: "menu-page-error", children: _jsxs("p", { children: ["Erreur lors du chargement de la page ", index + 1] }) }, index));
                }
                return (_jsx("div", { className: `menu-page-wrapper ${selectedMenu === "a_emporter" ? "takeaway-menu" : ""}`, children: _jsx("img", { src: imageSrc, alt: `Menu page ${index + 1}`, className: "menu-page-image", loading: "lazy" }) }, index));
            }) }));
    };
    const selectedMenuInfo = getSelectedMenuInfo();
    return (_jsxs("div", { className: `selector-container ${className || ""}`, ref: containerRef, children: [_jsxs("div", { className: "selector-content", children: [selectedMenu && isLoading && (_jsx("div", { className: "document-loading", children: _jsxs("div", { className: "loading-content", children: [_jsx("div", { className: "loading-spinner" }), _jsxs("span", { className: "loading-announcement", children: ["Chargement du menu en cours...", _jsx("br", {}), _jsx("small", { children: "Nous pr\u00E9parons votre carte, merci de patienter un instant" })] })] }) })), _jsxs("div", { className: "dropdown-container", ref: dropdownRef, children: [_jsxs("div", { className: `dropdown-trigger ${selectedMenu ? "selected" : ""}`, onClick: handleDropdownToggle, children: [_jsx("div", { className: "dropdown-trigger-content", children: selectedMenu && selectedMenuInfo ? (_jsxs(_Fragment, { children: [_jsx(selectedMenuInfo.icon, { className: "service-icon", size: 20 }), _jsxs("div", { className: "service-info", children: [_jsx("span", { className: "service-label", children: selectedMenuInfo.label }), _jsx("span", { className: "service-description", children: selectedMenuInfo.description })] }), selectedMenuInfo.hasDiscount && (_jsx("span", { className: "discount-badge", children: "Tarifs r\u00E9duits" }))] })) : (_jsx(_Fragment, { children: _jsx("div", { className: "service-info", children: _jsx("span", { className: "service-label", children: "S\u00E9lectionnez une carte" }) }) })) }), _jsx(ChevronDown, { className: `dropdown-arrow ${dropdownOpen ? "open" : ""}`, size: 20 })] }), _jsxs("div", { className: `dropdown-menu ${dropdownOpen ? "open" : ""}`, children: [getMenuOptions().map((option) => (_jsxs("div", { className: "dropdown-option", onClick: () => handleMenuSelect(option.value), children: [_jsx(option.icon, { className: "service-icon", size: 20 }), _jsxs("div", { className: "service-info", children: [_jsx("span", { className: "service-label", children: option.label }), _jsx("span", { className: "service-description", children: option.description })] }), option.hasDiscount && (_jsx("span", { className: "discount-badge", children: "Tarifs r\u00E9duits" }))] }, option.value))), selectedMenu && (_jsxs("div", { className: "dropdown-option show-hours-option", onClick: handleBackToHours, children: [_jsx(Calendar, { className: "service-icon", size: 20 }), _jsxs("div", { className: "service-info", children: [_jsx("span", { className: "service-label", children: "Afficher les horaires" }), _jsx("span", { className: "service-description", children: "Voir nos heures d'ouverture" })] })] }))] })] }), selectedMenu && !isLoading && internalShowPdf && (_jsx("div", { className: "download-section", children: _jsxs("button", { className: "download-button", onClick: handleDownloadPdf, children: [_jsx(Download, { className: "download-icon", size: 18 }), _jsx("span", { children: "T\u00E9l\u00E9charger" })] }) }))] }), selectedMenu && internalShowPdf && (_jsx("div", { className: `menu-section ${loadingOffset ? "loading-offset" : ""}`, children: renderAllMenuPages() }))] }));
};
export default Selector;
