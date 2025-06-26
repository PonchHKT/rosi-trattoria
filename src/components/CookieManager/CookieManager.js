import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import "./CookieManager.scss";
const GA_MEASUREMENT_ID = "G-ZTDV0576N7";
const CookieManager = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    useEffect(() => {
        // Vérifier si l'utilisateur a déjà fait un choix
        const cookieConsent = localStorage.getItem("cookieConsent");
        if (!cookieConsent) {
            setIsVisible(true);
            // Bloquer le scroll quand la bannière est visible
            document.body.style.overflow = "hidden";
            // Délai pour déclencher l'animation après le rendu
            setTimeout(() => setIsAnimating(true), 100);
        }
        else if (cookieConsent === "accepted") {
            initializeGoogleAnalytics();
        }
        // Cleanup function pour rétablir le scroll si le composant est démonté
        return () => {
            document.body.style.overflow = "";
        };
    }, []);
    const initializeGoogleAnalytics = () => {
        // Configuration Google Analytics avec respect de la vie privée
        const script1 = document.createElement("script");
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        document.head.appendChild(script1);
        const script2 = document.createElement("script");
        script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      
      // Configuration respectueuse de la vie privée
      gtag('config', '${GA_MEASUREMENT_ID}', {
        'anonymize_ip': true,
        'allow_google_signals': false,
        'allow_ad_personalization_signals': false,
        'cookie_expires': 63072000, // 2 ans maximum selon RGPD
        'cookie_update': true,
        'cookie_flags': 'SameSite=Strict;Secure'
      });
    `;
        document.head.appendChild(script2);
    };
    const handleAccept = () => {
        localStorage.setItem("cookieConsent", "accepted");
        localStorage.setItem("cookieConsentTimestamp", Date.now().toString());
        initializeGoogleAnalytics();
        // Débloquer le scroll
        document.body.style.overflow = "";
        setIsAnimating(false);
        setTimeout(() => setIsVisible(false), 300);
    };
    const handleRefuse = () => {
        localStorage.setItem("cookieConsent", "refused");
        localStorage.setItem("cookieConsentTimestamp", Date.now().toString());
        // Débloquer le scroll
        document.body.style.overflow = "";
        // Supprimer tous les cookies Google Analytics existants
        const cookiesToDelete = [
            "_ga",
            "_ga_" + GA_MEASUREMENT_ID.split("-")[1],
            "_gid",
            "_gat",
        ];
        cookiesToDelete.forEach((cookieName) => {
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`;
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        });
        setIsAnimating(false);
        setTimeout(() => setIsVisible(false), 300);
    };
    // Vérifier si le consentement a expiré (13 mois selon CNIL)
    useEffect(() => {
        const consentTimestamp = localStorage.getItem("cookieConsentTimestamp");
        if (consentTimestamp) {
            const consentDate = new Date(parseInt(consentTimestamp));
            const expirationDate = new Date(consentDate.getTime() + 13 * 30 * 24 * 60 * 60 * 1000); // 13 mois
            if (new Date() > expirationDate) {
                // Le consentement a expiré, redemander
                localStorage.removeItem("cookieConsent");
                localStorage.removeItem("cookieConsentTimestamp");
                setIsVisible(true);
                document.body.style.overflow = "hidden";
                setTimeout(() => setIsAnimating(true), 100);
            }
        }
    }, []);
    if (!isVisible)
        return null;
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "cookie-manager__overlay" }), _jsxs("div", { className: `cookie-manager ${isAnimating ? "cookie-manager--visible" : ""}`, role: "dialog", "aria-modal": "true", "aria-labelledby": "cookie-title", "aria-describedby": "cookie-description", children: [_jsxs("div", { className: "cookie-manager__content", children: [_jsx("h3", { className: "cookie-manager__title", children: "Votre exp\u00E9rience, notre priorit\u00E9 \uD83D\uDE80" }), _jsx("p", { className: "cookie-manager__text", children: "Nous utilisons Google Analytics pour mesurer l'audience de notre site avec des donn\u00E9es anonymis\u00E9es. Ces cookies nous aident \u00E0 am\u00E9liorer votre exp\u00E9rience. Vous pouvez refuser sans impact sur votre navigation." }), _jsx("a", { href: "https://carte.rosi-trattoria.com/info/privacy-policy", className: "cookie-manager__link", children: "En savoir plus" })] }), _jsxs("div", { className: "cookie-manager__actions", children: [_jsx("button", { className: "cookie-manager__btn cookie-manager__btn--refuse", onClick: handleRefuse, "aria-label": "Refuser les cookies analytiques", children: "JE REFUSE" }), _jsx("button", { className: "cookie-manager__btn cookie-manager__btn--accept", onClick: handleAccept, "aria-label": "Accepter les cookies analytiques", children: "J'ACCEPTE" })] })] })] }));
};
export default CookieManager;
