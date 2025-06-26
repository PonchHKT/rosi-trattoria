import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { Users, Utensils } from "lucide-react";
import AnimatedSection from "../AnimatedSection/AnimatedSection";
import "./biographie1.scss";
const Biographie1 = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [hasBeenTriggered, setHasBeenTriggered] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const sectionRef = useRef(null);
    const imageUrls = [
        "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/interieur-1.jpg",
        "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/interieur-2.jpg",
    ];
    const checkIsMobile = () => window.innerWidth <= 768;
    const resetAnimation = () => {
        setIsVisible(false);
        setHasBeenTriggered(false);
    };
    const startAnimation = () => {
        if (!hasBeenTriggered) {
            setIsVisible(true);
            setHasBeenTriggered(true);
        }
    };
    useEffect(() => {
        const handleResize = () => setIsMobile(checkIsMobile());
        setIsMobile(checkIsMobile());
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    useEffect(() => {
        const preloadImages = () => {
            let loadedCount = 0;
            imageUrls.forEach((url) => {
                const img = new Image();
                img.onload = () => {
                    loadedCount++;
                    setImagesLoaded(loadedCount);
                    console.log(`Image loaded: ${url}`);
                };
                img.onerror = () => {
                    loadedCount++;
                    setImagesLoaded(loadedCount);
                    console.error(`Failed to load image: ${url}`);
                };
                img.src = url;
            });
        };
        preloadImages();
    }, []);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                startAnimation();
            }
            else if (hasBeenTriggered) {
                resetAnimation();
            }
        }, {
            root: null,
            rootMargin: "0px",
            threshold: 0.2,
        });
        if (sectionRef.current)
            observer.observe(sectionRef.current);
        return () => {
            if (sectionRef.current)
                observer.unobserve(sectionRef.current);
        };
    }, [hasBeenTriggered]);
    return (_jsxs("section", { className: `biographie ${isMobile ? "biographie--mobile" : ""}`, ref: sectionRef, "aria-labelledby": "biographie-main-title", role: "main", children: [_jsxs("div", { className: "biographie__container", children: [_jsx(AnimatedSection, { animationType: "fade-in-scale", delay: 100, children: _jsx("header", { className: "biographie__header", role: "banner", children: _jsxs("hgroup", { className: `biographie__title ${isVisible ? "visible" : ""}`, children: [_jsx("h1", { id: "biographie-main-title", className: "biographie__title-main", children: "LA PASSION ET L'EXIGENCE" }), _jsx("p", { className: "biographie__title-accent", role: "doc-subtitle", children: "M\u00C8NENT \u00C0 L'EXCELLENCE" })] }) }) }), _jsx(AnimatedSection, { animationType: "fade-in-scale", delay: 150, children: _jsxs("div", { className: "biographie__section-header", children: [_jsxs("div", { className: "biographie__subtitle-container", "aria-hidden": "true", children: [_jsx("div", { className: "biographie__decorative-line" }), _jsx("div", { className: "biographie__pizza-icon", children: "\uD83C\uDF55" }), _jsx("div", { className: "biographie__decorative-line" })] }), _jsxs("h2", { className: "biographie__subtitle", children: ["Le plaisir de manger ", _jsx("span", { className: "text-blue", children: "Italien" }), " ", "dans un cadre ", _jsx("span", { className: "text-pink", children: "atypique" })] })] }) }), _jsx(AnimatedSection, { animationType: "fade-in-scale", delay: 200, children: _jsx("div", { className: "biographie__description", children: _jsxs("p", { className: "biographie__text", children: ["Nous vous servons de", " ", _jsx("strong", { children: "d\u00E9licieuses pizzas Napolitaines" }), " dans un", " ", _jsx("strong", { children: "cadre \u00E9l\u00E9gant et chaleureux" }), ".", _jsx("br", {}), "La ", _jsx("strong", { children: "d\u00E9coration Street Art" }), " procure un sentiment de d\u00E9paysement total. ", _jsx("em", { children: "Spacieux mais intime" }), ", le cadre est parfait pour passer des moments de d\u00E9tente et de tranquillit\u00E9."] }) }) }), _jsx(AnimatedSection, { animationType: "fade-in-scale", delay: 300, children: _jsxs("div", { className: "biographie__capacity-section", role: "region", "aria-labelledby": "capacity-title", children: [_jsx("h3", { id: "capacity-title", className: "sr-only", children: "Capacit\u00E9 d'accueil du restaurant" }), _jsxs("article", { className: "biographie__capacity-card biographie__capacity-card--indoor", children: [_jsx("div", { className: "biographie__capacity-icon", "aria-hidden": "true", children: _jsx(Users, { size: 40 }) }), _jsx("h4", { className: "biographie__capacity-number", children: "50 places \u00E0 l'int\u00E9rieur" }), _jsxs("p", { className: "biographie__capacity-desc", children: ["Id\u00E9al pour ", _jsx("strong", { children: "repas d'affaires" }), " ou priv\u00E9s dans un", " ", _jsx("strong", { children: "cadre intime" }), "."] })] }), _jsxs("article", { className: "biographie__capacity-card biographie__capacity-card--outdoor", children: [_jsx("div", { className: "biographie__capacity-icon", "aria-hidden": "true", children: _jsx(Utensils, { size: 40 }) }), _jsx("h4", { className: "biographie__capacity-number", children: "100 places en terrasse" }), _jsx("p", { className: "biographie__capacity-desc", children: "Profitez de l'ext\u00E9rieur quand le temps le permet." })] })] }) }), _jsx(AnimatedSection, { animationType: "fade-in-scale", delay: 400, children: _jsx("div", { className: "biographie__images", role: "img", "aria-label": "Photos de l'int\u00E9rieur du restaurant", children: imageUrls.map((url, index) => (_jsxs("figure", { className: `biographie__image-container ${imagesLoaded > index ? "loaded" : ""}`, children: [imagesLoaded <= index && (_jsx("div", { className: "biographie__image-placeholder", "aria-hidden": "true", children: _jsx("div", { className: "biographie__image-skeleton" }) })), _jsx("img", { src: url, alt: `Intérieur du restaurant Rosi Trattoria avec décoration Street Art ${index === 0 ? "- vue d'ensemble" : "- ambiance chaleureuse"}`, className: "biographie__image", decoding: "async", loading: "lazy", width: "600", height: "400" }), _jsx("figcaption", { className: "sr-only", children: index === 0
                                            ? "Vue d'ensemble de notre salle avec décoration Street Art unique"
                                            : "Ambiance chaleureuse et intime de notre restaurant italien" })] }, index))) }) }), _jsx(AnimatedSection, { animationType: "fade-in-scale", delay: 500, children: _jsx("div", { className: "biographie__quote-section", children: _jsxs("blockquote", { className: "biographie__quote", cite: "https://www.rosi-trattoria.com", children: ["Nous proposons des", " ", _jsx("strong", { children: "pizzas d\u00E9licieuses aux saveurs originales" }), ". Vous pouvez les appr\u00E9cier ", _jsx("em", { children: "sur place" }), " ou les ", _jsx("em", { children: "emporter" }), "."] }) }) }), _jsx(AnimatedSection, { animationType: "fade-in-scale", delay: 600, children: _jsx("div", { className: "biographie__cta", children: _jsx("a", { href: "https://bookings.zenchef.com/results?rid=356394&fullscreen=1", target: "_blank", rel: "noopener noreferrer", "aria-label": "R\u00E9server une table chez Rosi Trattoria - Ouverture dans un nouvel onglet", title: "R\u00E9servation en ligne via ZenChef", children: _jsx("button", { className: "biographie__cta-button", type: "button", children: "Je r\u00E9serve !" }) }) }) })] }), _jsx("div", { className: "biographie__bottom-fade", "aria-hidden": "true" })] }));
};
export default Biographie1;
