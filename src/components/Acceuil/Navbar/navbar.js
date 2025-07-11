import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, Phone } from "lucide-react";
import ReactGA from "react-ga4";
import "./navbar.scss";
// Configuration des événements GA4 pour Navbar
const GA4_EVENTS = {
    MENU_TOGGLE: "navbar_menu_toggle",
    LINK_CLICK: "navbar_link_click",
    PHONE_CLICK: "navbar_phone_click",
    MENU_CLOSE: "navbar_menu_close",
    RESERVATION_CLICK: "navbar_reservation_click",
};
// Composant LoadingBar
const LoadingBar = ({ isLoading = false, progress = 0, autoProgress = false, duration = 1500, color = "pink", }) => {
    const [currentProgress, setCurrentProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        if (isLoading) {
            setIsVisible(true);
            setCurrentProgress(0);
            if (autoProgress) {
                // Animation automatique avec progression plus fluide
                const startTime = Date.now();
                const interval = setInterval(() => {
                    const elapsed = Date.now() - startTime;
                    const progressPercent = Math.min((elapsed / duration) * 100, 100);
                    setCurrentProgress(progressPercent);
                    if (progressPercent >= 100) {
                        clearInterval(interval);
                        setTimeout(() => {
                            setIsVisible(false);
                            setCurrentProgress(0);
                        }, 200);
                    }
                }, 16); // ~60fps
                return () => clearInterval(interval);
            }
            else {
                // Progression manuelle
                setCurrentProgress(progress);
            }
        }
        else {
            // Terminer immédiatement si isLoading devient false
            setCurrentProgress(100);
            setTimeout(() => {
                setIsVisible(false);
                setCurrentProgress(0);
            }, 200);
        }
    }, [isLoading, progress, autoProgress, duration]);
    const getColorClass = () => {
        switch (color) {
            case "green":
                return "loading-bar--green";
            case "blue":
                return "loading-bar--blue";
            default:
                return "loading-bar--pink";
        }
    };
    return (_jsx("div", { className: `loading-bar ${!isVisible ? "loading-bar--hidden" : ""} ${getColorClass()}`, children: _jsx("div", { className: "loading-bar__progress", style: { width: `${Math.min(currentProgress, 100)}%` } }) }));
};
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const lastToggleTime = useRef(0);
    const toggleDebounceMs = 300;
    // Fermer le menu si on change de page
    useEffect(() => {
        if (isOpen) {
            setIsOpen(false);
        }
    }, [location.pathname]);
    // Empêcher le scroll du body quand le menu est ouvert
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            setIsAnimating(true);
        }
        else {
            document.body.style.overflow = "";
            if (isAnimating) {
                const timer = setTimeout(() => setIsAnimating(false), 400);
                return () => clearTimeout(timer);
            }
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen, isAnimating]);
    // Déclencher le loading bar lors des changements de page
    useEffect(() => {
        setIsLoading(true);
        // Simuler un délai de chargement de page
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, [location.pathname]);
    const toggleNavbar = () => {
        const now = Date.now();
        if (now - lastToggleTime.current < toggleDebounceMs) {
            return;
        }
        lastToggleTime.current = now;
        setIsOpen((prev) => !prev);
        // Track menu events
        ReactGA.event(GA4_EVENTS.MENU_TOGGLE, {
            page_name: location.pathname,
            menu_state: isOpen ? "close" : "open",
        });
    };
    const closeMenu = () => {
        setIsOpen(false);
        ReactGA.event(GA4_EVENTS.MENU_CLOSE, {
            page_name: location.pathname,
        });
    };
    const handleLinkClick = (linkLabel, linkPath) => {
        setIsOpen(false);
        setIsLoading(true);
        ReactGA.event(GA4_EVENTS.LINK_CLICK, {
            page_name: location.pathname,
            link_label: linkLabel,
            link_path: linkPath,
        });
    };
    const handleReservationClick = () => {
        setIsOpen(false);
        ReactGA.event(GA4_EVENTS.RESERVATION_CLICK, {
            page_name: location.pathname,
            external_url: "https://bookings.zenchef.com/results?rid=356394&fullscreen=1",
        });
    };
    const handlePhoneCall = () => {
        ReactGA.event(GA4_EVENTS.PHONE_CLICK, {
            page_name: location.pathname,
            phone_number: "0544314447",
        });
        window.location.href = "tel:0544314447";
    };
    // Fermer le menu si on clique sur l'overlay
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            closeMenu();
        }
    };
    // Gestion des touches clavier
    const handleKeyDown = (e) => {
        if (e.key === "Escape" && isOpen) {
            closeMenu();
        }
    };
    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);
    const navItems = [
        {
            label: "Accueil",
            path: "/",
            title: "Accueil - Rosi Trattoria",
        },
        {
            label: "Carte",
            path: "/carte",
            title: "Notre carte - Disponible à emporter ou à déguster sur place",
        },
        {
            label: "Nos valeurs",
            path: "/nos-valeurs",
            title: "Nos valeurs - Authenticité et Tradition Italienne",
        },
        {
            label: "Recrutement",
            path: "/recrutement",
            title: "Recrutement - Rejoignez l'équipe de Rosi Trattoria",
        },
        {
            label: "Contact",
            path: "/contact",
            title: "Nous contacter - Renseignez-nous vos questions ou demandes",
        },
    ];
    const isActiveLink = (path) => {
        // Ne jamais afficher "Accueil" comme actif
        if (path === "/") {
            return false;
        }
        return location.pathname === path;
    };
    return (_jsxs(_Fragment, { children: [_jsxs("header", { role: "banner", className: "navbar-header", children: [_jsx("nav", { className: "navbar", role: "navigation", "aria-label": "Navigation principale du restaurant Rosi Trattoria", children: _jsxs("div", { className: "navbar__container", children: [_jsx("div", { className: "navbar__brand-section", children: _jsxs("div", { className: "navbar__brand-container", children: [_jsx(Link, { to: "/", className: "navbar__brand-link", title: "Rosi Trattoria \u2013 Pizzeria Italienne Bio, Locale & Fait Maison", "aria-label": "Retour \u00E0 l'accueil du restaurant Rosi Trattoria", onClick: () => handleLinkClick("Accueil", "/"), children: _jsxs("h1", { className: "navbar__brand", children: [_jsx("span", { className: "navbar__brand-rosi", children: "Rosi" }), _jsx("span", { className: "navbar__brand-trattoria", children: "Trattoria" })] }) }), _jsxs("div", { className: "navbar__flag-bar", "aria-hidden": "true", children: [_jsx("div", { className: "navbar__flag--green" }), _jsx("div", { className: "navbar__flag--white" }), _jsx("div", { className: "navbar__flag--red" })] })] }) }), _jsx("div", { className: "navbar__desktop-nav", children: _jsx("ul", { className: "navbar__nav-list", role: "menubar", children: navItems.map((item, index) => (_jsx("li", { className: "navbar__nav-item", role: "none", children: _jsx(Link, { to: item.path, className: `navbar__nav-link ${isActiveLink(item.path)
                                                    ? "navbar__nav-link--active"
                                                    : ""}`, onClick: () => handleLinkClick(item.label, item.path), title: item.title, role: "menuitem", "aria-current": isActiveLink(item.path) ? "page" : undefined, children: item.label }) }, index))) }) }), _jsxs("div", { className: "navbar__mobile-controls", children: [_jsx("button", { className: "navbar__phone-btn", onClick: handlePhoneCall, "aria-label": "Appeler le restaurant Rosi Trattoria au 05 44 31 44 47", title: "T\u00E9l\u00E9phoner pour r\u00E9server une table", type: "button", children: _jsx(Phone, { size: 18, "aria-hidden": "true" }) }), _jsxs("button", { className: `navbar__burger ${isOpen ? "navbar__burger--open" : ""}`, onClick: toggleNavbar, "aria-label": isOpen
                                                ? "Fermer le menu de navigation"
                                                : "Ouvrir le menu de navigation", "aria-expanded": isOpen, "aria-controls": "navbar-mobile-menu", type: "button", children: [_jsx("span", { className: "navbar__burger-line" }), _jsx("span", { className: "navbar__burger-line" }), _jsx("span", { className: "navbar__burger-line" })] })] })] }) }), _jsx(LoadingBar, { isLoading: isLoading, autoProgress: true, duration: 1200, color: "pink" })] }), _jsx("div", { className: `navbar__overlay ${isOpen ? "navbar__overlay--open" : ""}`, onClick: handleOverlayClick, "aria-hidden": "true" }), _jsxs("div", { id: "navbar-mobile-menu", className: `navbar__mobile-menu ${isOpen ? "navbar__mobile-menu--open" : ""} ${isAnimating ? "navbar__mobile-menu--animating" : ""}`, role: "dialog", "aria-modal": "true", "aria-labelledby": "mobile-menu-title", children: [_jsxs("div", { className: "navbar__mobile-header", children: [_jsx("h2", { id: "mobile-menu-title", className: "navbar__mobile-title", children: "Bio, Locale & Fait Maison" }), _jsx("button", { className: "navbar__close-btn", onClick: closeMenu, "aria-label": "Fermer le menu", type: "button", children: _jsx(X, { size: 24, "aria-hidden": "true" }) })] }), _jsx("nav", { className: "navbar__mobile-nav", role: "navigation", children: _jsxs("ul", { className: "navbar__mobile-list", role: "menubar", children: [navItems.map((item, index) => (_jsx("li", { className: "navbar__mobile-item", role: "none", style: { "--item-index": index }, children: _jsxs(Link, { to: item.path, className: `navbar__mobile-link ${isActiveLink(item.path) ? "navbar__mobile-link--active" : ""} ${item.path === "/carte" ? "navbar__mobile-link--carte" : ""}`, onClick: () => handleLinkClick(item.label, item.path), title: item.title, role: "menuitem", "aria-current": isActiveLink(item.path) ? "page" : undefined, tabIndex: isOpen ? 0 : -1, style: item.path === "/carte"
                                            ? { backgroundColor: "var(--primary-pink)" }
                                            : {}, children: [_jsx("span", { className: "navbar__mobile-link-text", children: item.label }), _jsx("span", { className: "navbar__mobile-link-line" })] }) }, index))), _jsx("li", { className: "navbar__mobile-item", role: "none", style: { "--item-index": navItems.length }, children: _jsxs("a", { href: "https://bookings.zenchef.com/results?rid=356394&fullscreen=1", className: "navbar__mobile-link navbar__mobile-link--reservation", onClick: handleReservationClick, title: "R\u00E9server une table en ligne", role: "menuitem", tabIndex: isOpen ? 0 : -1, target: "_blank", rel: "noopener noreferrer", style: { backgroundColor: "#ffd506" }, children: [_jsx("span", { className: "navbar__mobile-link-text", children: "R\u00E9servation" }), _jsx("span", { className: "navbar__mobile-link-line" })] }) })] }) })] })] }));
};
export default Navbar;
