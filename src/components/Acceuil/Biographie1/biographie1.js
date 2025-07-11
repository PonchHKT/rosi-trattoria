import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef, useCallback, useMemo, } from "react";
import { Users, Utensils, Award } from "lucide-react";
import AnimatedSection from "../AnimatedSection/AnimatedSection";
import "./biographie1.scss";
const Biographie1 = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [hasBeenTriggered, setHasBeenTriggered] = useState(false);
    const [titleAnimationPlayed, setTitleAnimationPlayed] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState({});
    const [imageErrors, setImageErrors] = useState({});
    const [isMobile, setIsMobile] = useState(false);
    const sectionRef = useRef(null);
    const observerRef = useRef(null);
    const imageTimeoutsRef = useRef({});
    // Mémoïsation des URLs d'images
    const imageUrls = useMemo(() => [
        "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/interieur-1.jpg",
        "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/interieur-2.jpg",
    ], []);
    // Fonction de vérification mobile optimisée
    const checkIsMobile = useCallback(() => window.innerWidth <= 768, []);
    // Throttle pour les events de resize
    const throttle = useCallback((func, limit) => {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    }, []);
    // Reset optimisé
    const resetAnimation = useCallback(() => {
        setIsVisible(false);
        setHasBeenTriggered(false);
    }, []);
    // Start animation optimisé
    const startAnimation = useCallback(() => {
        if (!hasBeenTriggered) {
            setIsVisible(true);
            setHasBeenTriggered(true);
            if (!titleAnimationPlayed) {
                setTitleAnimationPlayed(true);
            }
        }
    }, [hasBeenTriggered, titleAnimationPlayed]);
    // Gestion du resize avec throttle
    useEffect(() => {
        const throttledResize = throttle(() => setIsMobile(checkIsMobile()), 100);
        setIsMobile(checkIsMobile());
        window.addEventListener("resize", throttledResize);
        return () => window.removeEventListener("resize", throttledResize);
    }, [checkIsMobile, throttle]);
    // Système de préchargement d'images amélioré avec timeout et fallback
    useEffect(() => {
        const preloadImages = () => {
            imageUrls.forEach((url, index) => {
                // Timeout plus long pour éviter les faux positifs
                imageTimeoutsRef.current[index] = setTimeout(() => {
                    // Ne pas logger comme erreur, juste marquer comme chargé
                    setImagesLoaded((prev) => ({ ...prev, [index]: true }));
                    // Ne pas marquer comme erreur, laisser l'image se charger normalement
                }, 15000); // 15 secondes au lieu de 8
                const img = new Image();
                img.onload = () => {
                    if (imageTimeoutsRef.current[index]) {
                        clearTimeout(imageTimeoutsRef.current[index]);
                        delete imageTimeoutsRef.current[index];
                    }
                    setImagesLoaded((prev) => ({ ...prev, [index]: true }));
                    setImageErrors((prev) => ({ ...prev, [index]: false }));
                };
                img.onerror = () => {
                    console.error(`Erreur de chargement pour l'image ${index}:`, url);
                    if (imageTimeoutsRef.current[index]) {
                        clearTimeout(imageTimeoutsRef.current[index]);
                        delete imageTimeoutsRef.current[index];
                    }
                    setImageErrors((prev) => ({ ...prev, [index]: true }));
                    setImagesLoaded((prev) => ({ ...prev, [index]: true }));
                };
                // Optimisations de chargement
                img.decoding = "async";
                img.loading = "lazy";
                img.crossOrigin = "anonymous";
                // Ajouter un cache buster si nécessaire
                const cacheBuster = Date.now();
                img.src = `${url}?t=${cacheBuster}`;
            });
        };
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                preloadImages();
                observer.disconnect();
            }
        }, { rootMargin: "200px" });
        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }
        return () => {
            observer.disconnect();
            Object.values(imageTimeoutsRef.current).forEach((timeout) => {
                clearTimeout(timeout);
            });
            imageTimeoutsRef.current = {};
        };
    }, [imageUrls]);
    // IntersectionObserver optimisé
    useEffect(() => {
        if (observerRef.current) {
            observerRef.current.disconnect();
        }
        observerRef.current = new IntersectionObserver(([entry]) => {
            const scheduleUpdate = (callback) => {
                if (window.requestIdleCallback) {
                    window.requestIdleCallback(callback, { timeout: 100 });
                }
                else {
                    requestAnimationFrame(callback);
                }
            };
            if (entry.isIntersecting) {
                scheduleUpdate(startAnimation);
            }
            else if (hasBeenTriggered) {
                scheduleUpdate(resetAnimation);
            }
        }, {
            root: null,
            rootMargin: "0px",
            threshold: 0.2,
        });
        if (sectionRef.current) {
            observerRef.current.observe(sectionRef.current);
        }
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [hasBeenTriggered, startAnimation, resetAnimation]);
    return (_jsxs("section", { className: `biographie ${isMobile ? "biographie--mobile" : ""}`, ref: sectionRef, "aria-labelledby": "biographie-main-title", role: "main", children: [_jsxs("div", { className: "biographie__container", children: [_jsx(AnimatedSection, { animationType: "fade-in-scale", delay: 100, children: _jsx("header", { className: "biographie__header", role: "banner", children: _jsxs("div", { className: "biographie__title-wrapper", children: [_jsxs("div", { className: "biographie__title-decorative", children: [_jsx("div", { className: "biographie__title-ornament biographie__title-ornament--left" }), _jsx("div", { className: "biographie__title-ornament biographie__title-ornament--right" })] }), _jsxs("hgroup", { className: `biographie__title ${titleAnimationPlayed
                                            ? "visible permanent"
                                            : isVisible
                                                ? "visible"
                                                : ""}`, children: [_jsxs("h1", { id: "biographie-main-title", className: "biographie__title-main", children: [_jsx("span", { className: "biographie__title-word", children: "LA" }), _jsx("span", { className: "biographie__title-word biographie__title-word--accent", children: "PASSION" }), _jsx("span", { className: "biographie__title-word", children: "ET" }), _jsx("span", { className: "biographie__title-word biographie__title-word--accent", children: "L' EXIGENCE" })] }), _jsxs("p", { className: "biographie__title-accent", role: "doc-subtitle", children: [_jsx("span", { className: "biographie__title-accent-word", children: "M\u00C8NENT" }), _jsx("span", { className: "biographie__title-accent-word", children: "\u00C0 L'" }), _jsx("span", { className: "biographie__title-accent-word biographie__title-accent-word--highlight", children: "EXCELLENCE" })] })] })] }) }) }), _jsx(AnimatedSection, { animationType: "fade-in-scale", delay: 150, children: _jsxs("div", { className: "biographie__section-header", children: [_jsxs("div", { className: "biographie__title-badge", children: [_jsx(Award, { className: "biographie__title-badge-icon" }), _jsx("span", { className: "biographie__title-badge-text", children: "Depuis 2020" })] }), _jsxs("div", { className: "biographie__subtitle-container", children: [_jsx("div", { className: "biographie__decorative-line biographie__decorative-line--left" }), _jsx("div", { className: "biographie__pizza-icon", children: _jsxs("svg", { className: "biographie__flag-svg", viewBox: "0 0 900 600", xmlns: "http://www.w3.org/2000/svg", "aria-label": "Drapeau italien", children: [_jsx("rect", { width: "300", height: "600", fill: "#009246" }), _jsx("rect", { x: "300", width: "300", height: "600", fill: "#FFFFFF" }), _jsx("rect", { x: "600", width: "300", height: "600", fill: "#CE2B38" })] }) }), _jsx("div", { className: "biographie__decorative-line biographie__decorative-line--right" })] }), _jsxs("h2", { className: "biographie__subtitle", children: ["Le plaisir de manger ", _jsx("span", { className: "text-blue", children: "Italien" }), " ", "dans un cadre ", _jsx("span", { className: "text-pink", children: "atypique" })] })] }) }), _jsx(AnimatedSection, { animationType: "fade-in-scale", delay: 200, children: _jsx("div", { className: "biographie__description", children: _jsxs("div", { className: "biographie__text-container", children: [_jsxs("p", { className: "biographie__text", children: ["Nous vous servons de", " ", _jsx("strong", { className: "biographie__text-highlight", children: "d\u00E9licieuses pizzas Napolitaines" }), " ", "dans un", " ", _jsx("strong", { className: "biographie__text-highlight", children: "cadre \u00E9l\u00E9gant et chaleureux" }), "."] }), _jsxs("p", { className: "biographie__text", children: ["La", " ", _jsx("strong", { className: "biographie__text-highlight", children: "d\u00E9coration Street Art" }), " ", "procure un sentiment de d\u00E9paysement total.", " ", _jsx("em", { children: "Spacieux mais intime" }), ", le cadre est parfait pour passer des moments de d\u00E9tente et de tranquillit\u00E9."] })] }) }) }), _jsx(AnimatedSection, { animationType: "fade-in-scale", delay: 300, children: _jsx("div", { className: "biographie__images", role: "img", "aria-label": "Photos de l'int\u00E9rieur du restaurant", children: imageUrls.map((url, index) => (_jsxs("figure", { className: `biographie__image-container ${imagesLoaded[index] ? "loaded" : ""} ${imageErrors[index] ? "error" : ""}`, children: [!imagesLoaded[index] && (_jsxs("div", { className: "biographie__image-placeholder", children: [_jsx("div", { className: "biographie__image-skeleton" }), _jsx("p", { className: "biographie__loading-text", children: "Chargement..." })] })), imageErrors[index] ? (_jsxs("div", { className: "biographie__image-error", children: [_jsx("div", { className: "biographie__error-icon", children: "\uD83D\uDCF7" }), _jsx("p", { className: "biographie__error-text", children: "Image temporairement indisponible" })] })) : (_jsx("img", { src: url, alt: `Intérieur du restaurant Rosi Trattoria avec décoration Street Art ${index === 0
                                            ? "- vue d'ensemble"
                                            : "- ambiance chaleureuse"}`, className: "biographie__image", decoding: "async", loading: "lazy", width: "600", height: "400", onLoad: () => {
                                            setImagesLoaded((prev) => ({ ...prev, [index]: true }));
                                            setImageErrors((prev) => ({ ...prev, [index]: false }));
                                        }, onError: () => {
                                            console.error(`Erreur finale pour l'image ${index}`);
                                            setImageErrors((prev) => ({ ...prev, [index]: true }));
                                            setImagesLoaded((prev) => ({ ...prev, [index]: true }));
                                        } })), _jsx("figcaption", { className: "sr-only", children: index === 0
                                            ? "Vue d'ensemble de notre salle avec décoration Street Art unique"
                                            : "Ambiance chaleureuse et intime de notre restaurant italien" })] }, index))) }) }), _jsx(AnimatedSection, { animationType: "fade-in-scale", delay: 500, children: _jsx("div", { className: "biographie__quote-section", children: _jsxs("div", { className: "biographie__quote-container", children: [_jsxs("blockquote", { className: "biographie__quote", cite: "https://www.rosi-trattoria.com", children: [_jsx("span", { className: "biographie__quote-mark biographie__quote-mark--open", children: "\"" }), "Toutes nos", " ", _jsx("strong", { className: "biographie__quote-highlight", children: "pizzas sont pr\u00E9par\u00E9es \u00E0 la main" }), " ", "avec des ingr\u00E9dients frais, pour un go\u00FBt unique \u00E0 savourer sur place ou \u00E0 ", _jsx("em", { children: "emporter" }), ".", _jsx("span", { className: "biographie__quote-mark biographie__quote-mark--close", children: "\"" })] }), _jsxs("div", { className: "biographie__quote-decoration", children: [_jsx("div", { className: "biographie__quote-dot" }), _jsx("div", { className: "biographie__quote-dot" }), _jsx("div", { className: "biographie__quote-dot" })] })] }) }) }), _jsx(AnimatedSection, { animationType: "fade-in-scale", delay: 400, children: _jsxs("div", { className: "biographie__capacity-section", role: "region", "aria-labelledby": "capacity-title", children: [_jsx("h3", { id: "capacity-title", className: "sr-only", children: "Capacit\u00E9 d'accueil du restaurant" }), _jsxs("article", { className: "biographie__capacity-card biographie__capacity-card--outdoor", children: [_jsxs("div", { className: "biographie__capacity-icon", children: [_jsx(Users, { size: 32 }), _jsx("div", { className: "biographie__capacity-icon-bg" })] }), _jsxs("div", { className: "biographie__capacity-content", children: [_jsx("h4", { className: "biographie__capacity-number", children: "50" }), _jsx("span", { className: "biographie__capacity-label", children: "places \u00E0 l'int\u00E9rieur" }), _jsxs("p", { className: "biographie__capacity-desc", children: ["Id\u00E9al pour ", _jsx("strong", { children: "repas d'affaires" }), " ou priv\u00E9s dans un", " ", _jsx("strong", { children: "cadre intime" }), "."] })] })] }), _jsxs("article", { className: "biographie__capacity-card biographie__capacity-card--indoor", children: [_jsxs("div", { className: "biographie__capacity-icon", children: [_jsx(Utensils, { size: 32 }), _jsx("div", { className: "biographie__capacity-icon-bg" })] }), _jsxs("div", { className: "biographie__capacity-content", children: [_jsx("h4", { className: "biographie__capacity-number", children: "100" }), _jsx("span", { className: "biographie__capacity-label", children: "places en terrasse" }), _jsx("p", { className: "biographie__capacity-desc", children: "Profitez de l'ext\u00E9rieur quand le temps le permet." })] })] })] }) }), _jsx(AnimatedSection, { animationType: "fade-in-scale", delay: 600, children: _jsx("div", { className: "biographie__cta", children: _jsxs("div", { className: "biographie__cta-container", children: [_jsx("a", { href: "https://bookings.zenchef.com/results?rid=356394&fullscreen=1", target: "_blank", rel: "noopener noreferrer", "aria-label": "R\u00E9server une table chez Rosi Trattoria - Ouverture dans un nouvel onglet", title: "R\u00E9servation en ligne via ZenChef", children: _jsxs("button", { className: "biographie__cta-button", type: "button", children: [_jsx("span", { className: "biographie__cta-button-text", children: "R\u00E9servez votre table" }), _jsx("div", { className: "biographie__cta-button-shine" })] }) }), _jsx("p", { className: "biographie__cta-subtitle", children: "R\u00E9servation en ligne \u2022 Confirmation imm\u00E9diate" })] }) }) })] }), _jsx("div", { className: "biographie__bottom-fade", "aria-hidden": "true" })] }));
};
export default Biographie1;
