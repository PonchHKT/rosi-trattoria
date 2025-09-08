import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { Users, Utensils, Award } from "lucide-react";
import "./biographie1.scss";
const Biographie1 = () => {
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState({});
    const [imageErrors, setImageErrors] = useState({});
    const imageUrls = [
        "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/interieur-1.jpg",
        "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/interieur-2.jpg",
    ];
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                // Preload images when section is visible
                imageUrls.forEach((url, index) => {
                    const img = new Image();
                    img.src = url;
                    img.decoding = "async";
                    img.loading = "lazy";
                    img.onload = () => {
                        setImagesLoaded((prev) => ({ ...prev, [index]: true }));
                        setImageErrors((prev) => ({ ...prev, [index]: false }));
                    };
                    img.onerror = () => {
                        setImageErrors((prev) => ({ ...prev, [index]: true }));
                        setImagesLoaded((prev) => ({ ...prev, [index]: true }));
                    };
                });
            }
        }, { rootMargin: "100px", threshold: 0.1 });
        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }
        return () => observer.disconnect();
    }, [imageUrls]);
    return (_jsx("section", { className: `biographie ${isVisible ? "is-visible" : ""}`, ref: sectionRef, "aria-labelledby": "biographie-main-title", children: _jsxs("div", { className: "biographie__container", children: [_jsx("header", { className: "biographie__header", children: _jsxs("div", { className: "biographie__title-wrapper", children: [_jsxs("hgroup", { className: "biographie__title", children: [_jsx("h1", { className: "biographie__title-main", children: ["LA", "PASSION", "ET", "L'EXIGENCE"].map((word, index) => (_jsx("span", { className: `biographie__title-word ${[1, 3].includes(index)
                                                ? "biographie__title-word--accent"
                                                : ""} ${isVisible ? "is-visible" : ""}`, style: { transitionDelay: `${index * 0.1}s` }, children: word }, index))) }), _jsx("p", { className: "biographie__title-accent", children: ["MÈNENT", "À ", "L'EXCELLENCE"].map((word, index) => (_jsx("span", { className: `biographie__title-accent-word ${index === 2
                                                ? "biographie__title-accent-word--highlight"
                                                : ""} ${isVisible ? "is-visible" : ""}`, style: { transitionDelay: `${(index + 4) * 0.1}s` }, children: word }, index))) })] }), _jsxs("div", { className: `biographie__title-badge ${isVisible ? "is-visible" : ""}`, children: [_jsx(Award, { className: "biographie__title-badge-icon" }), _jsx("span", { className: "biographie__title-badge-text", children: "Depuis 2020" })] })] }) }), _jsxs("div", { className: "biographie__section-header", children: [_jsxs("div", { className: "biographie__subtitle-container", children: [_jsx("div", { className: `biographie__decorative-line biographie__decorative-line--left ${isVisible ? "is-visible" : ""}` }), _jsx("div", { className: `biographie__pizza-icon ${isVisible ? "is-visible" : ""}`, children: _jsxs("svg", { className: `biographie__flag-svg ${isVisible ? "is-visible" : ""}`, viewBox: "0 0 900 600", xmlns: "http://www.w3.org/2000/svg", "aria-label": "Drapeau italien", children: [_jsx("rect", { width: "300", height: "600", fill: "#009246" }), _jsx("rect", { x: "300", width: "300", height: "600", fill: "#FFFFFF" }), _jsx("rect", { x: "600", width: "300", height: "600", fill: "#CE2B38" })] }) }), _jsx("div", { className: `biographie__decorative-line biographie__decorative-line--right ${isVisible ? "is-visible" : ""}` })] }), _jsxs("h2", { className: `biographie__subtitle ${isVisible ? "is-visible" : ""}`, children: ["Le plaisir de manger ", _jsx("span", { className: "text-blue", children: "Italien" }), " dans un cadre ", _jsx("span", { className: "text-pink", children: "atypique" })] })] }), _jsx("div", { className: "biographie__description", children: _jsx("div", { className: "biographie__text-container", children: [
                            "Nous vous servons de délicieuses pizzas Napolitaines dans un cadre élégant et chaleureux.",
                            "La décoration Street Art procure un sentiment de dépaysement total. Spacieux mais intime, le cadre est parfait pour passer des moments de détente et de tranquillité.",
                        ].map((text, index) => (_jsx("p", { className: `biographie__text ${isVisible ? "is-visible" : ""}`, style: { transitionDelay: `${(index + 6) * 0.1}s` }, children: text
                                .split(/(délicieuses pizzas Napolitaines|cadre élégant et chaleureux|décoration Street Art)/)
                                .map((part, i) => part.match(/délicieuses pizzas Napolitaines|cadre élégant et chaleureux|décoration Street Art/) ? (_jsx("strong", { className: "biographie__text-highlight", children: part }, i)) : (part)) }, index))) }) }), _jsx("div", { className: "biographie__images", children: imageUrls.map((url, index) => (_jsxs("figure", { className: `biographie__image-container ${imagesLoaded[index] ? "loaded" : ""} ${imageErrors[index] ? "error" : ""} ${isVisible ? "is-visible" : ""}`, style: { transitionDelay: `${(index + 8) * 0.1}s` }, children: [!imagesLoaded[index] && (_jsxs("div", { className: "biographie__image-placeholder", children: [_jsx("div", { className: "biographie__image-skeleton" }), _jsx("p", { className: "biographie__loading-text", children: "Chargement..." })] })), imageErrors[index] ? (_jsxs("div", { className: "biographie__image-error", children: [_jsx("div", { className: "biographie__error-icon", children: "\uD83D\uDCF7" }), _jsx("p", { className: "biographie__error-text", children: "Image temporairement indisponible" })] })) : (_jsx("img", { src: url, alt: `Intérieur du restaurant Rosi Trattoria - ${index === 0 ? "vue d'ensemble" : "ambiance chaleureuse"}`, className: "biographie__image", decoding: "async", loading: "lazy", width: "600", height: "400" })), _jsx("figcaption", { className: "sr-only", children: index === 0
                                    ? "Vue d'ensemble de notre salle avec décoration Street Art unique"
                                    : "Ambiance chaleureuse et intime de notre restaurant italien" })] }, index))) }), _jsx("div", { className: "biographie__quote-section", children: _jsxs("div", { className: "biographie__quote-container", children: [_jsxs("blockquote", { className: `biographie__quote ${isVisible ? "is-visible" : ""}`, cite: "https://www.rosi-trattoria.com", style: { transitionDelay: "1s" }, children: [_jsx("span", { className: "biographie__quote-mark biographie__quote-mark--open", children: "\"" }), "Toutes nos", " ", _jsx("strong", { className: "biographie__quote-highlight", children: "pizzas sont pr\u00E9par\u00E9es \u00E0 la main" }), " ", "avec des ingr\u00E9dients frais, pour un go\u00FBt unique \u00E0 savourer sur place ou \u00E0 ", _jsx("em", { children: "emporter" }), ".", _jsx("span", { className: "biographie__quote-mark biographie__quote-mark--close", children: "\"" })] }), _jsx("div", { className: "biographie__quote-decoration", children: [1, 2, 3].map((_, index) => (_jsx("div", { className: `biographie__quote-dot ${isVisible ? "is-visible" : ""}`, style: { transitionDelay: `${(index + 10) * 0.1}s` } }, index))) })] }) }), _jsx("div", { className: "biographie__capacity-section", children: [
                        {
                            number: 50,
                            label: "places à l'intérieur",
                            desc: "Idéal pour repas d'affaires ou privés dans un cadre intime.",
                            icon: Users,
                            type: "outdoor",
                        },
                        {
                            number: 100,
                            label: "places en terrasse",
                            desc: "Profitez de l'extérieur quand le temps le permet.",
                            icon: Utensils,
                            type: "indoor",
                        },
                    ].map((card, index) => (_jsxs("article", { className: `biographie__capacity-card biographie__capacity-card--${card.type} ${isVisible ? "is-visible" : ""}`, style: { transitionDelay: `${(index + 12) * 0.1}s` }, children: [_jsx("div", { className: "biographie__capacity-icon", children: _jsx(card.icon, { size: 32 }) }), _jsxs("div", { className: "biographie__capacity-content", children: [_jsx("h4", { className: "biographie__capacity-number", children: card.number }), _jsx("span", { className: "biographie__capacity-label", children: card.label }), _jsx("p", { className: "biographie__capacity-desc", children: card.desc
                                            .split(/(repas d'affaires|cadre intime)/)
                                            .map((part, i) => part.match(/repas d'affaires|cadre intime/) ? (_jsx("strong", { children: part }, i)) : (part)) })] })] }, index))) }), _jsx("div", { className: "biographie__cta", children: _jsxs("div", { className: "biographie__cta-container", children: [_jsx("a", { href: "https://bookings.zenchef.com/results?rid=356394&fullscreen=1", target: "_blank", rel: "noopener noreferrer", "aria-label": "R\u00E9server une table chez Rosi Trattoria", children: _jsx("button", { className: `biographie__cta-button ${isVisible ? "is-visible" : ""}`, type: "button", style: { transitionDelay: "1.4s" }, children: _jsx("span", { className: "biographie__cta-button-text", children: "R\u00E9servez votre table" }) }) }), _jsx("p", { className: `biographie__cta-subtitle ${isVisible ? "is-visible" : ""}`, style: { transitionDelay: "1.5s" }, children: "R\u00E9servation en ligne \u2022 Confirmation imm\u00E9diate" })] }) })] }) }));
};
export default Biographie1;
