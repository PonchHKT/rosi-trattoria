import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import emailjs from "@emailjs/browser";
import ReCAPTCHA from "react-google-recaptcha";
import ReactGA from "react-ga4";
import "./contactdisplay.scss";
const ContactDisplay = () => {
    const [formData, setFormData] = useState({
        nom: "",
        email: "",
        telephone: "",
        message: "",
    });
    const [envoiEnCours, setEnvoiEnCours] = useState(false);
    const [messageStatut, setMessageStatut] = useState("");
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const [recaptchaError, setRecaptchaError] = useState("");
    // États pour la protection anti-spam (cachés à l'utilisateur)
    const [dernierEnvoi, setDernierEnvoi] = useState(0);
    const [nombreEnvois, setNombreEnvois] = useState(0);
    const [honeypot, setHoneypot] = useState("");
    const [tempsDebutFormulaire, setTempsDebutFormulaire] = useState(0);
    const formRef = useRef(null);
    const recaptchaRef = useRef(null);
    // Configuration anti-spam - 30 minutes entre chaque envoi (caché)
    const DELAI_MINIMUM = 1800000; // 30 minutes
    const LIMITE_ENVOIS_HEURE = 1;
    const TEMPS_MIN_REMPLISSAGE = 10000; // 10 secondes
    // Configuration reCAPTCHA
    const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY ||
        "6Lci8WkrAAAAANN_t2CvAUffkWLACJl73-PfAKCD";
    useEffect(() => {
        // Google Analytics
        ReactGA.send({
            hitType: "pageview",
            page: "/contact",
            title: "Contact - Rosi Trattoria",
        });
        // Récupérer les données de limitation depuis localStorage
        try {
            const dernierEnvoiStocke = localStorage.getItem("dernierEnvoiContact");
            const envoissStockes = localStorage.getItem("envoissContact");
            if (dernierEnvoiStocke) {
                setDernierEnvoi(parseInt(dernierEnvoiStocke));
            }
            if (envoissStockes) {
                const envois = JSON.parse(envoissStockes);
                const maintenant = Date.now();
                const envoisDernieres30Min = envois.filter((timestamp) => maintenant - timestamp < DELAI_MINIMUM);
                setNombreEnvois(envoisDernieres30Min.length);
                localStorage.setItem("envoissContact", JSON.stringify(envoisDernieres30Min));
            }
        }
        catch (error) {
            console.warn("Erreur lors de la lecture du localStorage:", error);
        }
        setTempsDebutFormulaire(Date.now());
    }, [dernierEnvoi]);
    const gererChangementInput = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        ReactGA.event({
            action: "form_interact",
            category: "Contact Form",
            label: e.target.name,
        });
    };
    const gererRecaptcha = (token) => {
        setRecaptchaToken(token);
        setRecaptchaError("");
        if (token) {
            ReactGA.event({
                action: "recaptcha_completed",
                category: "Contact Form",
                label: "reCAPTCHA Success",
            });
        }
    };
    const gererErreurRecaptcha = () => {
        setRecaptchaError("Erreur lors du chargement du reCAPTCHA. Veuillez recharger la page.");
        setRecaptchaToken(null);
        ReactGA.event({
            action: "recaptcha_error",
            category: "Contact Form",
            label: "reCAPTCHA Error",
        });
    };
    const gererExpirationRecaptcha = () => {
        setRecaptchaToken(null);
        setRecaptchaError("Le reCAPTCHA a expiré. Veuillez le refaire.");
        ReactGA.event({
            action: "recaptcha_expired",
            category: "Contact Form",
            label: "reCAPTCHA Expired",
        });
    };
    const gererHoneypot = (e) => {
        setHoneypot(e.target.value);
    };
    const validerAntiSpam = () => {
        const maintenant = Date.now();
        // Vérifier le honeypot
        if (honeypot.length > 0) {
            ReactGA.event({
                action: "spam_detected",
                category: "Contact Form",
                label: "Honeypot Triggered",
            });
            return {
                valide: false,
                message: "Une erreur s'est produite. Veuillez réessayer.",
            };
        }
        // Temps minimum de remplissage
        if (maintenant - tempsDebutFormulaire < TEMPS_MIN_REMPLISSAGE) {
            return {
                valide: false,
                message: "Veuillez prendre le temps de remplir correctement le formulaire.",
            };
        }
        // Délai entre envois (caché)
        if (maintenant - dernierEnvoi < DELAI_MINIMUM) {
            return {
                valide: false,
                message: "Veuillez patienter avant d'envoyer un nouveau message.",
            };
        }
        // Limite d'envois (caché)
        if (nombreEnvois >= LIMITE_ENVOIS_HEURE) {
            return {
                valide: false,
                message: "Trop de messages envoyés. Veuillez réessayer plus tard.",
            };
        }
        // Vérifications spam
        const messageWords = formData.message.toLowerCase().split(" ");
        const spamKeywords = [
            "viagra",
            "casino",
            "loan",
            "credit",
            "money",
            "bitcoin",
            "crypto",
        ];
        const hasSpamKeywords = spamKeywords.some((keyword) => messageWords.some((word) => word.includes(keyword)));
        if (hasSpamKeywords) {
            ReactGA.event({
                action: "spam_detected",
                category: "Contact Form",
                label: "Spam Keywords",
            });
            return {
                valide: false,
                message: "Contenu détecté comme potentiellement indésirable.",
            };
        }
        // Répétition excessive
        const hasExcessiveRepetition = /(.)\1{4,}/.test(formData.message);
        if (hasExcessiveRepetition) {
            return { valide: false, message: "Format de message non valide." };
        }
        // Message trop court
        if (formData.message.trim().length < 10) {
            return {
                valide: false,
                message: "Veuillez écrire un message plus détaillé.",
            };
        }
        return { valide: true, message: "" };
    };
    const envoyerEmail = async (e) => {
        e.preventDefault();
        ReactGA.event({
            action: "form_submit_attempt",
            category: "Contact Form",
            label: "Form Submission Started",
        });
        // Vérification reCAPTCHA
        if (!recaptchaToken) {
            setMessageStatut("Veuillez compléter le reCAPTCHA.");
            ReactGA.event({
                action: "form_submit_failed",
                category: "Contact Form",
                label: "Missing reCAPTCHA",
            });
            return;
        }
        // Vérifications anti-spam
        const validationAntiSpam = validerAntiSpam();
        if (!validationAntiSpam.valide) {
            setMessageStatut(validationAntiSpam.message);
            ReactGA.event({
                action: "form_submit_failed",
                category: "Contact Form",
                label: "Anti-spam Validation Failed",
            });
            return;
        }
        setEnvoiEnCours(true);
        setMessageStatut("");
        try {
            const templateParams = {
                from_name: formData.nom,
                from_email: formData.email,
                phone: formData.telephone,
                message: formData.message,
                "g-recaptcha-response": recaptchaToken,
                timestamp: new Date().toISOString(),
            };
            await emailjs.send("service_21e0t58", "template_p6yid04", templateParams, "d0C2DCxhev8b3vXks");
            // Mise à jour anti-spam
            const maintenant = Date.now();
            setDernierEnvoi(maintenant);
            try {
                localStorage.setItem("dernierEnvoiContact", maintenant.toString());
                const envoissStockes = localStorage.getItem("envoissContact");
                const envois = envoissStockes ? JSON.parse(envoissStockes) : [];
                envois.push(maintenant);
                localStorage.setItem("envoissContact", JSON.stringify(envois));
                setNombreEnvois(envois.length);
            }
            catch (error) {
                console.warn("Erreur localStorage:", error);
            }
            setMessageStatut("Message envoyé avec succès ! Nous vous répondrons rapidement.");
            setFormData({ nom: "", email: "", telephone: "", message: "" });
            setRecaptchaToken(null);
            if (formRef.current) {
                formRef.current.reset();
            }
            if (recaptchaRef.current) {
                recaptchaRef.current.reset();
            }
            setTempsDebutFormulaire(Date.now());
            ReactGA.event({
                action: "form_submit_success",
                category: "Contact Form",
                label: "Message Sent Successfully",
                value: 1,
            });
            ReactGA.event({
                action: "contact_conversion",
                category: "Conversions",
                label: "Contact Form Submission",
                value: 1,
            });
        }
        catch (error) {
            setMessageStatut("Erreur lors de l'envoi. Veuillez réessayer.");
            console.error("Erreur EmailJS:", error);
            ReactGA.event({
                action: "form_submit_error",
                category: "Contact Form",
                label: "EmailJS Error",
            });
        }
        finally {
            setEnvoiEnCours(false);
        }
    };
    // Vérifier si on peut envoyer (logique anti-spam cachée)
    const maintenant = Date.now();
    const peutEnvoyer = recaptchaToken &&
        maintenant - dernierEnvoi >= DELAI_MINIMUM &&
        nombreEnvois < LIMITE_ENVOIS_HEURE;
    return (_jsx("main", { className: "contact-container", role: "main", children: _jsxs("div", { className: "contact-content", children: [_jsxs("header", { className: "restaurant-info", itemScope: true, itemType: "https://schema.org/Restaurant", children: [_jsx("div", { className: "logo-container", children: _jsx("img", { src: "/images/logo/rositrattorialogo.png", alt: "Logo du restaurant italien Rosi Trattoria \u00E0 Brive-la-Gaillarde", className: "restaurant-logo", itemProp: "logo", width: "150", height: "150", loading: "eager" }) }), _jsxs("div", { className: "restaurant-slogan", children: [_jsx("p", { itemProp: "slogan", children: "FRAICHEUR \u2022 QUALIT\u00C9 \u2022 AUTHENTICIT\u00C9" }), _jsx("span", { itemProp: "servesCuisine", content: "Italian", children: "100% ITALIANO" })] }), _jsxs("div", { style: { display: "none" }, itemScope: true, itemType: "https://schema.org/Restaurant", children: [_jsx("span", { itemProp: "name", children: "Rosi Trattoria" }), _jsx("span", { itemProp: "servesCuisine", children: "Italian" }), _jsxs("div", { itemProp: "address", itemScope: true, itemType: "https://schema.org/PostalAddress", children: [_jsx("span", { itemProp: "streetAddress", children: "11 Promenade des Tilleuls" }), _jsx("span", { itemProp: "addressLocality", children: "Brive-la-Gaillarde" }), _jsx("span", { itemProp: "postalCode", children: "19100" }), _jsx("span", { itemProp: "addressCountry", children: "FR" })] }), _jsx("span", { itemProp: "telephone", children: "05 44 31 44 47" }), _jsx("span", { itemProp: "email", children: "rosi.trattoria@gmail.com" })] })] }), _jsx("section", { className: "form-section", "aria-labelledby": "contact-form-title", children: _jsxs("div", { className: "form-container", children: [_jsx("h1", { id: "contact-form-title", className: "form-title", children: "Envoyez-nous un message" }), _jsx("p", { className: "form-description", children: "Nous vous r\u00E9pondrons dans les plus brefs d\u00E9lais" }), _jsx("div", { className: "reservation-notice", role: "alert", children: _jsxs("div", { className: "notice-content", children: [_jsx("span", { className: "notice-icon", children: "\u2139\uFE0F" }), _jsxs("div", { className: "notice-text", children: [_jsx("strong", { children: "Pour vos r\u00E9servations :" }), _jsxs("p", { children: ["Utilisez notre", " ", _jsx("a", { href: "https://bookings.zenchef.com/results?rid=356394&fullscreen=1", target: "_blank", rel: "noopener noreferrer", className: "reservation-link", onClick: () => {
                                                                ReactGA.event({
                                                                    action: "reservation_link_click",
                                                                    category: "Reservations",
                                                                    label: "ZenChef Link Clicked",
                                                                });
                                                            }, children: "syst\u00E8me de r\u00E9servation en ligne" }), " ", "ou appelez-nous au", " ", _jsx("a", { href: "tel:+33544314447", className: "reservation-link", onClick: () => {
                                                                ReactGA.event({
                                                                    action: "phone_click_reservation",
                                                                    category: "Reservations",
                                                                    label: "Phone Number Clicked for Reservation",
                                                                });
                                                            }, children: "05 44 31 44 47" })] }), _jsx("small", { children: "Ce formulaire est uniquement pour vos questions g\u00E9n\u00E9rales." })] })] }) }), _jsxs("form", { ref: formRef, onSubmit: envoyerEmail, className: "contact-form", role: "form", "aria-label": "Formulaire de contact restaurant Rosi Trattoria", noValidate: true, children: [_jsx("input", { type: "text", name: "website", value: honeypot, onChange: gererHoneypot, style: {
                                            position: "absolute",
                                            left: "-9999px",
                                            width: "1px",
                                            height: "1px",
                                            opacity: 0,
                                            pointerEvents: "none",
                                        }, tabIndex: -1, autoComplete: "off", "aria-hidden": "true" }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "input-group", children: [_jsx("input", { type: "text", id: "nom", name: "nom", value: formData.nom, onChange: gererChangementInput, required: true, placeholder: " ", "aria-describedby": "nom-help", autoComplete: "name" }), _jsx("label", { htmlFor: "nom", children: "Nom complet *" }), _jsx("div", { id: "nom-help", className: "sr-only", children: "Saisissez votre nom complet" })] }), _jsxs("div", { className: "input-group", children: [_jsx("input", { type: "email", id: "email", name: "email", value: formData.email, onChange: gererChangementInput, required: true, placeholder: " ", "aria-describedby": "email-help", autoComplete: "email" }), _jsx("label", { htmlFor: "email", children: "Email *" }), _jsx("div", { id: "email-help", className: "sr-only", children: "Votre adresse email pour vous r\u00E9pondre" })] })] }), _jsxs("div", { className: "input-group", children: [_jsx("input", { type: "tel", id: "telephone", name: "telephone", value: formData.telephone, onChange: gererChangementInput, placeholder: " ", "aria-describedby": "tel-help", autoComplete: "tel" }), _jsx("label", { htmlFor: "telephone", children: "T\u00E9l\u00E9phone" }), _jsx("div", { id: "tel-help", className: "sr-only", children: "Num\u00E9ro de t\u00E9l\u00E9phone optionnel" })] }), _jsxs("div", { className: "input-group", children: [_jsx("textarea", { id: "message", name: "message", value: formData.message, onChange: gererChangementInput, required: true, rows: 5, placeholder: " ", "aria-describedby": "message-help" }), _jsx("label", { htmlFor: "message", children: "Message *" }), _jsx("div", { id: "message-help", className: "sr-only", children: "Votre message ou question (minimum 10 caract\u00E8res)" })] }), _jsxs("div", { className: "recaptcha-container", role: "group", "aria-label": "V\u00E9rification de s\u00E9curit\u00E9", children: [_jsx(ReCAPTCHA, { ref: recaptchaRef, sitekey: RECAPTCHA_SITE_KEY, onChange: gererRecaptcha, onErrored: gererErreurRecaptcha, onExpired: gererExpirationRecaptcha, theme: "dark", hl: "fr", "aria-label": "Captcha de v\u00E9rification anti-spam" }), recaptchaError && (_jsx("div", { className: "recaptcha-error", role: "alert", children: recaptchaError }))] }), _jsx("button", { type: "submit", disabled: envoiEnCours || !peutEnvoyer, className: `submit-button ${envoiEnCours ? "loading" : ""} ${!peutEnvoyer ? "disabled" : ""}`, "aria-describedby": "submit-help", children: envoiEnCours ? "Envoi en cours..." : "Envoyer le message" }), _jsx("div", { id: "submit-help", className: "sr-only", children: "Envoyer votre message \u00E0 Rosi Trattoria" }), messageStatut && (_jsx("div", { className: `status-message ${messageStatut.includes("succès") ? "success" : "error"}`, role: "alert", "aria-live": "polite", children: messageStatut }))] })] }) }), _jsxs("section", { className: "map-section", "aria-labelledby": "location-title", children: [_jsx("h2", { id: "location-title", className: "sr-only", children: "Localisation et informations de contact" }), _jsx("div", { role: "application", "aria-label": "Carte interactive de localisation Rosi Trattoria", children: _jsx("iframe", { src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2885.1497959411446!2d1.530847!3d45.1632151!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47fb23c72d5c6f01%3A0xdd18d96369f9f106!2sRosi%20Trattoria!5e0!3m2!1sfr!2sfr!4v1640995200000!5m2!1sfr!2sfr", width: "100%", height: "300", style: { border: 0 }, allowFullScreen: true, loading: "lazy", referrerPolicy: "no-referrer-when-downgrade", title: "Carte de localisation de Rosi Trattoria \u00E0 Brive-la-Gaillarde", "aria-label": "Carte Google Maps montrant l'emplacement de Rosi Trattoria" }) }), _jsxs("address", { className: "contact-details", itemScope: true, itemType: "https://schema.org/Restaurant", children: [_jsx("h3", { className: "sr-only", children: "Coordonn\u00E9es de contact" }), _jsxs("div", { className: "contact-item", itemProp: "address", itemScope: true, itemType: "https://schema.org/PostalAddress", children: [_jsx("svg", { className: "contact-icon", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", focusable: "false", children: _jsx("path", { d: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z", fill: "currentColor" }) }), _jsxs("div", { className: "contact-text", children: [_jsx("span", { itemProp: "streetAddress", children: "11 Prom. des Tilleuls" }), _jsxs("span", { children: [_jsx("span", { itemProp: "postalCode", children: "19100" }), " ", _jsx("span", { itemProp: "addressLocality", children: "Brive-la-Gaillarde" })] }), _jsx("meta", { itemProp: "addressCountry", content: "FR" })] })] }), _jsxs("div", { className: "contact-item", children: [_jsx("svg", { className: "contact-icon", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", focusable: "false", children: _jsx("path", { d: "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z", fill: "currentColor" }) }), _jsx("div", { className: "contact-text", children: _jsx("a", { href: "tel:+33544314447", itemProp: "telephone", "aria-label": "Appeler Rosi Trattoria", onClick: () => {
                                                    ReactGA.event({
                                                        action: "phone_click",
                                                        category: "Contact",
                                                        label: "Phone Number Clicked",
                                                    });
                                                }, children: "05 44 31 44 47" }) })] }), _jsxs("div", { className: "contact-item", children: [_jsx("svg", { className: "contact-icon", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", focusable: "false", children: _jsx("path", { d: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z", fill: "currentColor" }) }), _jsx("div", { className: "contact-text", children: _jsx("a", { href: "mailto:rosi.trattoria@gmail.com", itemProp: "email", "aria-label": "Envoyer un email \u00E0 Rosi Trattoria", onClick: () => {
                                                    ReactGA.event({
                                                        action: "email_click",
                                                        category: "Contact",
                                                        label: "Email Address Clicked",
                                                    });
                                                }, children: "rosi.trattoria@gmail.com" }) })] }), _jsx("meta", { itemProp: "name", content: "Rosi Trattoria" }), _jsx("meta", { itemProp: "servesCuisine", content: "Italian" }), _jsx("meta", { itemProp: "priceRange", content: "\u20AC\u20AC" }), _jsxs("div", { itemProp: "geo", itemScope: true, itemType: "https://schema.org/GeoCoordinates", children: [_jsx("meta", { itemProp: "latitude", content: "45.1632151" }), _jsx("meta", { itemProp: "longitude", content: "1.532797" })] })] })] })] }) }));
};
export default ContactDisplay;
