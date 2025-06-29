import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { MapPin, Phone, Mail, Facebook, Instagram, Clock, Star, } from "lucide-react";
import ReactGA from "react-ga4";
import "./footer.scss";
const Footer = () => {
    const [emailCopied, setEmailCopied] = useState(false);
    // Détection du mois d'août
    const isAugust = () => {
        const forceAugustSchedule = false; // Temporary flag to force August schedule
        if (forceAugustSchedule) {
            return true; // Force August schedule
        }
        const currentMonth = new Date().getMonth();
        return currentMonth === 7; // Août = index 7 (0-indexed)
    };
    // Fonction pour tracker les événements GA
    const trackEvent = (action, label, value) => {
        ReactGA.event({
            category: "Footer",
            action: action,
            label: label,
            value: value,
        });
    };
    // Fonction pour copier l'email avec tracking
    const copyEmailToClipboard = async (e) => {
        e.preventDefault();
        const email = "rosi.trattoria@gmail.com";
        try {
            await navigator.clipboard.writeText(email);
            setEmailCopied(true);
            // Track l'événement de copie d'email
            trackEvent("Email Copy", "Footer Email Copied");
            // Masquer la notification après 3 secondes
            setTimeout(() => {
                setEmailCopied(false);
            }, 3000);
        }
        catch (err) {
            console.error("Erreur lors de la copie de l'email:", err);
            // Fallback pour les navigateurs plus anciens
            const textArea = document.createElement("textarea");
            textArea.value = email;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            setEmailCopied(true);
            trackEvent("Email Copy", "Footer Email Copied (Fallback)");
            setTimeout(() => {
                setEmailCopied(false);
            }, 3000);
        }
    };
    // Handler pour les liens sociaux
    const handleSocialClick = (platform) => {
        trackEvent("Social Media Click", `Footer ${platform}`);
    };
    // Handler pour les liens de contact
    const handleContactClick = (contactType) => {
        trackEvent("Contact Click", `Footer ${contactType}`);
    };
    // Handler pour les liens de navigation
    const handleNavClick = (page) => {
        trackEvent("Navigation Click", `Footer Nav - ${page}`);
    };
    // Handler pour les liens légaux
    const handleLegalClick = (linkType) => {
        trackEvent("Legal Link Click", `Footer ${linkType}`);
    };
    return (_jsxs("footer", { className: "footer", role: "contentinfo", children: [_jsx("div", { className: "footer__top-border", "aria-hidden": "true" }), _jsxs("div", { className: "footer__container", children: [_jsxs("div", { className: "footer__grid", children: [_jsxs("div", { className: "footer__brand", children: [_jsxs("div", { className: "footer__brand-content", children: [_jsx("img", { src: "/images/logo/rositrattorialogo.png", alt: "Logo Rosi Trattoria - Restaurant italien authentique \u00E0 Brive-la-Gaillarde", className: "footer__logo", width: "120", height: "80" }), _jsxs("div", { className: "footer__rating", role: "img", "aria-label": "5 \u00E9toiles sur 5", children: [_jsx(Star, { className: "footer__star", "aria-hidden": "true" }), _jsx(Star, { className: "footer__star", "aria-hidden": "true" }), _jsx(Star, { className: "footer__star", "aria-hidden": "true" }), _jsx(Star, { className: "footer__star", "aria-hidden": "true" }), _jsx(Star, { className: "footer__star", "aria-hidden": "true" })] })] }), _jsx("h2", { className: "footer__slogan", children: "Rosi Trattoria" }), _jsx("p", { className: "footer__description", children: "Une exp\u00E9rience culinaire authentique o\u00F9 chaque plat raconte l'histoire de la tradition italienne avec une touche de modernit\u00E9." }), _jsxs("div", { className: "footer__social", children: [_jsx("h3", { className: "footer__social-title", children: "Suivez-nous" }), _jsxs("div", { className: "footer__social-buttons", children: [_jsx("a", { href: "https://www.facebook.com/ROSI.TRATTORIA/", target: "_blank", rel: "noopener noreferrer", className: "footer__social-btn footer__social-btn--facebook", "aria-label": "Suivez Rosi Trattoria sur Facebook", title: "Page Facebook du restaurant Rosi Trattoria", onClick: () => handleSocialClick("Facebook"), children: _jsx(Facebook, { "aria-hidden": "true" }) }), _jsx("a", { href: "https://www.instagram.com/rosi.trattoria/", target: "_blank", rel: "noopener noreferrer", className: "footer__social-btn footer__social-btn--instagram", "aria-label": "Suivez Rosi Trattoria sur Instagram", title: "Compte Instagram du restaurant Rosi Trattoria", onClick: () => handleSocialClick("Instagram"), children: _jsx(Instagram, { "aria-hidden": "true" }) })] })] })] }), _jsxs("address", { className: "footer__contact", children: [_jsx("h3", { className: "footer__section-title", children: "Contact & Informations" }), _jsxs("div", { className: "footer__contact-list", children: [_jsxs("div", { className: "footer__contact-item", children: [_jsx("div", { className: "footer__contact-icon footer__contact-icon--location", children: _jsx(MapPin, { "aria-hidden": "true" }) }), _jsx("div", { className: "footer__contact-details", children: _jsxs("a", { href: "https://maps.google.com/?q=11asteroid:11+Prom.+des+Tilleuls,+19100+Brive-la-Gaillarde", target: "_blank", rel: "noopener noreferrer", title: "Localiser Rosi Trattoria sur Google Maps", "aria-label": "Adresse du restaurant : 11 Promenade des Tilleuls, Brive-la-Gaillarde", onClick: () => handleContactClick("Address"), children: [_jsx("span", { itemProp: "streetAddress", children: "11 Prom. des Tilleuls" }), _jsx("br", {}), _jsx("span", { itemProp: "postalCode", children: "19100" }), " ", _jsx("span", { itemProp: "addressLocality", children: "Brive-la-Gaillarde" })] }) })] }), _jsxs("div", { className: "footer__contact-item", children: [_jsx("div", { className: "footer__contact-icon footer__contact-icon--phone", children: _jsx(Phone, { "aria-hidden": "true" }) }), _jsx("div", { className: "footer__contact-details", children: _jsx("a", { href: "tel:0544314447", title: "Appeler pour r\u00E9server une table au restaurant Rosi Trattoria", "aria-label": "T\u00E9l\u00E9phone : 05 44 31 44 47", itemProp: "telephone", onClick: () => handleContactClick("Phone"), children: "05 44 31 44 47" }) })] }), _jsxs("div", { className: "footer__contact-item", children: [_jsx("div", { className: "footer__contact-icon footer__contact-icon--email", children: _jsx(Mail, { "aria-hidden": "true" }) }), _jsx("div", { className: "footer__contact-details", children: _jsxs("div", { className: "footer__email-container", children: [_jsx("a", { href: "#", onClick: copyEmailToClipboard, className: "footer__email-link", title: "Cliquer pour copier l'adresse email du restaurant", "aria-label": "Email : rosi.trattoria@gmail.com - Cliquer pour copier", children: _jsx("span", { itemProp: "email", children: "rosi.trattoria@gmail.com" }) }), emailCopied && (_jsx("div", { className: "footer__email-notification", role: "status", "aria-live": "polite", children: _jsx("span", { children: "Copi\u00E9 dans le presse-papiers" }) }))] }) })] }), _jsxs("div", { className: "footer__contact-item", children: [_jsx("div", { className: "footer__contact-icon footer__contact-icon--hours", children: _jsx(Clock, { "aria-hidden": "true" }) }), _jsx("div", { className: "footer__contact-details", children: _jsx("div", { className: "footer__hours-list", itemProp: "openingHours", children: isAugust() ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "footer__hours-item", children: [_jsx("span", { className: "footer__hours-day", children: "Lundi-Jeudi" }), _jsx("span", { className: "footer__hours-time", children: "12h00-13h30 / 18h30-21h30" })] }), _jsxs("div", { className: "footer__hours-item", children: [_jsx("span", { className: "footer__hours-day", children: "Vendredi-Samedi" }), _jsx("span", { className: "footer__hours-time", children: "12h00-13h30 / 18h30-22h00" })] }), _jsxs("div", { className: "footer__hours-item", children: [_jsx("span", { className: "footer__hours-day", children: "Dimanche" }), _jsx("span", { className: "footer__hours-closed", children: "Ferm\u00E9" })] })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "footer__hours-item", children: [_jsx("span", { className: "footer__hours-day", children: "Mardi-Jeudi" }), _jsx("span", { className: "footer__hours-time", children: "12h00-14h00 / 18h30-21h30" })] }), _jsxs("div", { className: "footer__hours-item", children: [_jsx("span", { className: "footer__hours-day", children: "Vendredi-Samedi" }), _jsx("span", { className: "footer__hours-time", children: "12h00-14h00 / 18h30-22h30" })] }), _jsxs("div", { className: "footer__hours-item", children: [_jsx("span", { className: "footer__hours-day", children: "Lundi, Dimanche" }), _jsx("span", { className: "footer__hours-closed", children: "Ferm\u00E9" })] })] })) }) })] })] })] }), _jsxs("div", { className: "footer__navigation", children: [_jsx("h3", { className: "footer__section-title", children: "Navigation" }), _jsxs("nav", { className: "footer__nav-links", "aria-label": "Navigation secondaire", children: [_jsx("a", { href: "/", className: "footer__nav-link", title: "Retour \u00E0 l'accueil du restaurant Rosi Trattoria", onClick: () => handleNavClick("Accueil"), children: "Accueil" }), _jsx("a", { href: "/nos-valeurs", className: "footer__nav-link", title: "D\u00E9couvrez nos valeurs et nos engagements qualit\u00E9", onClick: () => handleNavClick("Nos valeurs"), children: "Nos valeurs" }), _jsx("a", { href: "/carte", className: "footer__nav-link", title: "Consultez notre carte de sp\u00E9cialit\u00E9s italiennes", onClick: () => handleNavClick("Carte"), children: "Carte" }), _jsx("a", { href: "/recrutement", className: "footer__nav-link", title: "Rejoignez l'\u00E9quipe du restaurant Rosi Trattoria", onClick: () => handleNavClick("Recrutement"), children: "Recrutement" }), _jsx("a", { href: "/contact", className: "footer__nav-link", title: "Contactez-nous pour des renseignements", onClick: () => handleNavClick("Contact"), children: "Contact" })] })] })] }), _jsx("div", { className: "footer__bottom", children: _jsxs("div", { className: "footer__bottom-content", children: [_jsxs("p", { className: "footer__copyright", children: ["\u00A9 ", new Date().getFullYear(), " Rosi Trattoria - Restaurant italien \u00E0 Brive-la-Gaillarde. Tous droits r\u00E9serv\u00E9s."] }), _jsxs("nav", { className: "footer__legal-links", "aria-label": "Liens l\u00E9gaux", children: [_jsx("a", { href: "https://carte.rosi-trattoria.com/info/legal-notice", className: "footer__legal-link", target: "_blank", rel: "noopener noreferrer", title: "Consulter les mentions l\u00E9gales", onClick: () => handleLegalClick("Mentions légales"), children: "Mentions l\u00E9gales" }), _jsx("a", { href: "https://carte.rosi-trattoria.com/info/terms", className: "footer__legal-link", target: "_blank", rel: "noopener noreferrer", title: "Conditions g\u00E9n\u00E9rales de vente", onClick: () => handleLegalClick("CGV"), children: "CGV" }), _jsx("a", { href: "https://carte.rosi-trattoria.com/info/privacy-policy", className: "footer__legal-link", target: "_blank", rel: "noopener noreferrer", title: "Politique de confidentialit\u00E9 et gestion des cookies", onClick: () => handleLegalClick("Gestion des cookies"), children: "Gestion des cookies" })] })] }) })] })] }));
};
export default Footer;
