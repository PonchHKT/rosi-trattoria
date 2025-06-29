import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, Menu, Phone } from "lucide-react";
import ReactGA from "react-ga4";
import "./navbar.scss";
// Configuration des événements GA4 pour Navbar
const GA4_EVENTS = {
    MENU_TOGGLE: "navbar_menu_toggle",
    LINK_CLICK: "navbar_link_click",
    PHONE_CLICK: "navbar_phone_click",
};
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const lastToggleTime = useRef(0);
    const toggleDebounceMs = 1000; // 1 second debounce for menu toggle
    const toggleNavbar = () => {
        const now = Date.now();
        // Debounce to prevent spamming toggle events
        if (now - lastToggleTime.current < toggleDebounceMs) {
            return;
        }
        lastToggleTime.current = now;
        setIsOpen((prev) => !prev);
        // Track only menu open event
        if (!isOpen) {
            ReactGA.event(GA4_EVENTS.MENU_TOGGLE, {
                page_name: location.pathname,
                menu_state: "open",
            });
        }
    };
    const handleLinkClick = (linkLabel, linkPath) => {
        setIsOpen(false);
        // Track navigation link clicks with detailed parameters
        ReactGA.event(GA4_EVENTS.LINK_CLICK, {
            page_name: location.pathname,
            link_label: linkLabel,
            link_path: linkPath,
        });
    };
    const handlePhoneCall = () => {
        // Track phone call clicks
        ReactGA.event(GA4_EVENTS.PHONE_CLICK, {
            page_name: location.pathname,
            phone_number: "0544314447",
        });
        window.location.href = "tel:0544314447";
    };
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
    // Fonction pour vérifier si le lien est actif (exclut la page d'accueil)
    const isActiveLink = (path) => {
        if (path === "/") {
            return false;
        }
        return location.pathname === path;
    };
    return (_jsx("header", { role: "banner", children: _jsx("nav", { className: "navbar", role: "navigation", "aria-label": "Navigation principale du restaurant Rosi Trattoria", children: _jsxs("div", { className: "navbar__container", children: [_jsx("div", { className: "navbar__left-section", children: _jsxs("div", { className: "navbar__brand-container", children: [_jsx(Link, { to: "/", className: "navbar__brand-link", title: "Rosi Trattoria \u2013 Pizzeria Italienne Bio, Locale & Fait Maison", "aria-label": "Retour \u00E0 l'accueil du restaurant Rosi Trattoria", onClick: () => handleLinkClick("Accueil", "/"), children: _jsxs("h1", { className: "navbar__brand", children: [_jsx("span", { className: "navbar__brand-rosi", children: "Rosi" }), _jsx("span", { className: "navbar__brand-trattoria", children: "Trattoria" })] }) }), _jsxs("div", { className: "navbar__flag-bar", "aria-hidden": "true", children: [_jsx("div", { className: "navbar__flag--green" }), _jsx("div", { className: "navbar__flag--white" }), _jsx("div", { className: "navbar__flag--red" })] })] }) }), _jsxs("div", { className: "navbar__right-section", children: [_jsx("ul", { className: `navbar__links ${isOpen ? "navbar__links--open" : ""}`, role: "menubar", "aria-label": "Menu de navigation", children: navItems.map((item, index) => (_jsx("li", { className: "navbar__item", role: "none", children: _jsx(Link, { to: item.path, className: `navbar__link ${isActiveLink(item.path) ? "navbar__link--active" : ""}`, onClick: () => handleLinkClick(item.label, item.path), title: item.title, role: "menuitem", "aria-current": isActiveLink(item.path) ? "page" : undefined, children: item.label }) }, index))) }), _jsxs("div", { className: "navbar__mobile-controls", children: [_jsxs("button", { className: "navbar__phone-button", onClick: handlePhoneCall, "aria-label": "Appeler le restaurant Rosi Trattoria au 05 44 31 44 47", title: "T\u00E9l\u00E9phoner pour r\u00E9server une table", type: "button", children: [_jsx(Phone, { size: 20, "aria-hidden": "true" }), _jsx("span", { className: "sr-only", children: "05 44 31 44 47" })] }), _jsxs("button", { className: "navbar__toggle", onClick: toggleNavbar, "aria-label": isOpen
                                            ? "Fermer le menu de navigation"
                                            : "Ouvrir le menu de navigation", "aria-expanded": isOpen, "aria-controls": "navbar-menu", type: "button", children: [isOpen ? (_jsx(X, { size: 22, "aria-hidden": "true" })) : (_jsx(Menu, { size: 22, "aria-hidden": "true" })), _jsx("span", { className: "sr-only", children: isOpen ? "Fermer le menu" : "Ouvrir le menu" })] })] })] })] }) }) }));
};
export default Navbar;
