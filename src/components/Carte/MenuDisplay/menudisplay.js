import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Clock, Calendar, UtensilsCrossed, ShoppingBag, ChevronDown, Download, Menu, } from "lucide-react";
import ReactGA from "react-ga4";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "./menudisplay.scss";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
const MenuDisplay = () => {
    const [numPages, setNumPages] = useState(null);
    const [pageWidth, setPageWidth] = useState(800);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedMenu, setSelectedMenu] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [pdfLoaded, setPdfLoaded] = useState(false);
    const [showPdf, setShowPdf] = useState(false);
    const containerRef = useRef(null);
    const dropdownRef = useRef(null);
    const loadingTimeoutRef = useRef(null);
    const hasTrackedView = useRef(false);
    // Fonction pour détecter si on est en août
    const isAugustMonth = () => {
        const currentMonth = new Date().getMonth(); // 0 = janvier, 7 = août
        return currentMonth === 7;
    };
    const isMobile = () => window.innerWidth < 768;
    const getLoadingDelay = () => {
        return isMobile() ? 7000 : 9000;
    };
    // Track component view - seulement une fois
    useEffect(() => {
        if (!hasTrackedView.current) {
            ReactGA.event({
                category: "Component View",
                action: "View",
                label: "Menu Display Page",
                value: 1,
            });
            hasTrackedView.current = true;
        }
    }, []);
    // Track dropdown opening
    const trackDropdownOpen = () => {
        ReactGA.event({
            category: "Menu Interaction",
            action: "Dropdown Open",
            label: "Menu Selection Dropdown",
        });
    };
    // Track menu selection
    const trackMenuSelection = (menuType) => {
        ReactGA.event({
            category: "Menu Selection",
            action: "Select Menu Type",
            label: menuType === "sur_place" ? "Carte Sur Place" : "Carte À Emporter",
        });
    };
    // Track PDF loading start
    const trackPdfLoadingStart = (menuType) => {
        ReactGA.event({
            category: "PDF Loading",
            action: "Start Loading",
            label: menuType === "sur_place"
                ? "Carte Sur Place PDF"
                : "Carte À Emporter PDF",
        });
    };
    // Track PDF loading success
    const trackPdfLoadingSuccess = (menuType, loadTime) => {
        ReactGA.event({
            category: "PDF Loading",
            action: "Loading Success",
            label: menuType === "sur_place"
                ? "Carte Sur Place PDF"
                : "Carte À Emporter PDF",
            value: Math.round(loadTime / 1000), // temps en secondes
        });
    };
    // Track PDF download
    const trackPdfDownload = (menuType) => {
        ReactGA.event({
            category: "PDF Download",
            action: "Download PDF",
            label: menuType === "sur_place"
                ? "Carte Sur Place PDF"
                : "Carte À Emporter PDF",
        });
    };
    // Track page visibility (scroll into view)
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                ReactGA.event({
                    category: "Component Visibility",
                    action: "Scroll Into View",
                    label: "Menu Display Section",
                });
            }
        }, { threshold: 0.3 });
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }
        return () => observer.disconnect();
    }, []);
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
    const handleMenuSelect = (menuType) => {
        const startTime = Date.now();
        // Track menu selection
        trackMenuSelection(menuType);
        setSelectedMenu(menuType);
        setDropdownOpen(false);
        setNumPages(null);
        setCurrentPage(1);
        setPdfLoaded(false);
        setShowPdf(false);
        // Pas de chargement pour la carte à emporter
        if (menuType === "a_emporter") {
            setIsLoading(false);
            setShowPdf(true);
            // Track immediate display
            ReactGA.event({
                category: "PDF Display",
                action: "Immediate Display",
                label: "Carte À Emporter PDF",
            });
        }
        else {
            // Track loading start
            trackPdfLoadingStart(menuType);
            // Chargement uniquement pour la carte sur place
            setIsLoading(true);
            const loadingDelay = getLoadingDelay();
            loadingTimeoutRef.current = setTimeout(() => {
                const loadTime = Date.now() - startTime;
                trackPdfLoadingSuccess(menuType, loadTime);
                setIsLoading(false);
                setShowPdf(true);
            }, loadingDelay);
        }
    };
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
        // Track download
        trackPdfDownload(selectedMenu);
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
        // Track PDF render success
        ReactGA.event({
            category: "PDF Render",
            action: "Render Success",
            label: selectedMenu === "sur_place"
                ? "Carte Sur Place PDF"
                : "Carte À Emporter PDF",
            value: numPages,
        });
    };
    const handleDocumentError = (error) => {
        // Track PDF loading errors
        ReactGA.event({
            category: "PDF Loading",
            action: "Loading Error",
            label: selectedMenu === "sur_place"
                ? "Carte Sur Place PDF"
                : "Carte À Emporter PDF",
        });
        console.error("PDF loading error:", error);
    };
    const renderPages = () => {
        if (!numPages)
            return null;
        const mobile = isMobile();
        return (_jsx("div", { className: "pdf-page-grid", children: Array.from({ length: numPages }, (_, i) => (_jsx("div", { className: "pdf-page-container", "data-page": i + 1, children: _jsx(Page, { pageNumber: i + 1, width: pageWidth, renderTextLayer: !mobile, renderAnnotationLayer: false, renderMode: "canvas", className: "pdf-page", loading: _jsx("div", { className: "page-loading", children: "Chargement..." }), onLoadSuccess: () => {
                        // Track individual page render (optionnel)
                        if (i === 0) {
                            // Seulement pour la première page
                            ReactGA.event({
                                category: "PDF Page",
                                action: "First Page Rendered",
                                label: selectedMenu === "sur_place"
                                    ? "Carte Sur Place"
                                    : "Carte À Emporter",
                            });
                        }
                    } }) }, i + 1))) }));
    };
    // Fonction pour obtenir les horaires selon le mois
    const getHoursItems = () => {
        const isAugust = isAugustMonth();
        if (isAugust) {
            // Track August hours display
            ReactGA.event({
                category: "Hours Display",
                action: "Display August Hours",
                label: "Summer Schedule",
            });
            // Horaires d'août avec lundi ouvert
            return [
                {
                    days: "Lun - Mar - Mer - Jeu",
                    hours: "12h-14h / 19h-21h30",
                    closed: false,
                },
                {
                    days: "Ven - Sam",
                    hours: "12h-14h / 19h-22h30",
                    closed: false,
                },
                {
                    days: "Dim",
                    hours: "Fermé",
                    closed: true,
                },
            ];
        }
        else {
            // Horaires normaux
            return [
                {
                    days: "Mar - Mer - Jeu",
                    hours: "12h-14h / 19h-21h30",
                    closed: false,
                },
                {
                    days: "Ven - Sam",
                    hours: "12h-14h / 19h-22h30",
                    closed: false,
                },
                {
                    days: "Lun - Dim",
                    hours: "Fermé",
                    closed: true,
                },
            ];
        }
    };
    const selectedMenuInfo = getSelectedMenuInfo();
    return (_jsxs("div", { className: "menu-container", ref: containerRef, children: [_jsxs("div", { className: "hours-section", children: [_jsxs("div", { className: "hours-header", children: [_jsx(Calendar, { className: "calendar-icon", size: 20 }), _jsx(Clock, { className: "clock-icon", size: 20 }), _jsx("h2", { children: "Nos horaires" }), isAugustMonth() && (_jsx("span", { className: "august-notice", children: "\uD83C\uDF1E Horaires d'\u00E9t\u00E9" }))] }), _jsx("div", { className: "hours-list", children: getHoursItems().map((item, index) => (_jsxs("div", { className: `hours-item ${item.closed ? "closed" : ""}`, children: [_jsx("span", { children: item.days }), _jsx("span", { children: item.hours })] }, index))) }), selectedMenu && isLoading && (_jsx("div", { className: "document-loading", children: _jsxs("div", { className: "loading-content", children: [_jsx("div", { className: "loading-spinner" }), _jsxs("span", { className: "loading-announcement", children: ["Chargement en cours...", _jsx("br", {}), _jsx("small", { children: "Nous optimisons la qualit\u00E9 du fichier, merci de patienter un instant" })] })] }) })), _jsxs("div", { className: "menu-selection", children: [_jsx("h3", { className: "service-title" }), selectedMenu && (_jsx("div", { className: "download-section", children: _jsxs("span", { className: "download-link", onClick: handleDownloadPdf, children: [_jsx(Download, { className: "download-icon", size: 18 }), _jsx("span", { children: "T\u00E9l\u00E9charger la carte" })] }) })), _jsx("div", { className: `payment-methods-image ${selectedMenu ? "hidden" : ""}`, children: _jsx("img", { src: "/images/logo/methode-paiement.png", alt: "M\u00E9thodes de paiement accept\u00E9es" }) }), _jsxs("div", { className: "dropdown-container", ref: dropdownRef, children: [_jsxs("div", { className: `dropdown-trigger ${selectedMenu ? "selected" : ""}`, onClick: () => {
                                            if (!dropdownOpen) {
                                                trackDropdownOpen();
                                            }
                                            setDropdownOpen(!dropdownOpen);
                                        }, children: [_jsx("div", { className: "dropdown-trigger-content", children: selectedMenu && selectedMenuInfo ? (_jsxs(_Fragment, { children: [_jsx(selectedMenuInfo.icon, { className: "service-icon", size: 20 }), _jsxs("div", { className: "service-info", children: [_jsx("span", { className: "service-label", children: selectedMenuInfo.label }), _jsx("span", { className: "service-description", children: selectedMenuInfo.description })] }), selectedMenuInfo.hasDiscount && (_jsx("span", { className: "discount-badge", children: "Tarifs r\u00E9duits" }))] })) : (_jsxs(_Fragment, { children: [_jsx(Menu, { className: "service-icon", size: 20 }), _jsxs("div", { className: "service-info", children: [_jsx("span", { className: "service-label", children: "S\u00E9lectionner une carte" }), _jsx("span", { className: "service-description", children: "Choisir le type de service" })] })] })) }), _jsx(ChevronDown, { className: `dropdown-arrow ${dropdownOpen ? "open" : ""}`, size: 20 })] }), _jsx("div", { className: `dropdown-menu ${dropdownOpen ? "open" : ""}`, children: getMenuOptions().map((option) => (_jsxs("div", { className: "dropdown-option", onClick: () => handleMenuSelect(option.value), children: [_jsx(option.icon, { className: "service-icon", size: 20 }), _jsxs("div", { className: "service-info", children: [_jsx("span", { className: "service-label", children: option.label }), _jsx("span", { className: "service-description", children: option.description })] }), option.hasDiscount && (_jsx("span", { className: "discount-badge", children: "Tarifs r\u00E9duits" }))] }, option.value))) })] })] })] }), selectedMenu && (_jsx("div", { className: "pdf-section", children: _jsx("div", { style: {
                        position: "relative",
                        transform: showPdf ? "translateY(0)" : "translateY(100vh)",
                        transition: "transform 0.5s ease-in-out",
                    }, children: _jsx(Document, { file: getPdfFile(), onLoadSuccess: handleDocumentLoadSuccess, onLoadError: handleDocumentError, loading: null, children: renderPages() }) }) })), numPages && pdfLoaded && !isMobile() && (_jsxs("div", { className: "page-indicator", children: ["Page ", currentPage, " / ", numPages] }))] }));
};
export default MenuDisplay;
