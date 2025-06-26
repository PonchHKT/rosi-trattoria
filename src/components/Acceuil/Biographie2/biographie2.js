import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import "./biographie2.scss";
const AnimatedSection = ({ children, animationType, delay = 0, threshold = 0.1, className = "", }) => {
    const elementRef = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add("visible");
                    }, delay);
                }
            });
        }, { threshold });
        if (elementRef.current) {
            observer.observe(elementRef.current);
        }
        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, [delay, threshold]);
    return (_jsx("div", { ref: elementRef, className: `${animationType} ${className}`, children: children }));
};
const Biographie2 = () => {
    return (_jsxs("section", { className: "restaurant-bio", "aria-labelledby": "bio-main-title", children: [_jsx(AnimatedSection, { animationType: "fade-in-up", delay: 0, children: _jsxs("header", { className: "bio-header", role: "banner", children: [_jsx("div", { className: "bio-header-fade-bottom", "aria-hidden": "true" }), _jsxs("div", { className: "bio-header-content", children: [_jsx("h2", { id: "bio-main-title", className: "bio-title", itemProp: "name", children: "Les raisons pour venir dans notre restaurant" }), _jsx("p", { className: "bio-subtitle", itemProp: "description", children: "D\u00E9couvrez l'authenticit\u00E9 italienne au c\u0153ur de notre \u00E9tablissement" })] })] }) }), _jsxs("div", { className: "bio-content", role: "main", children: [_jsxs(AnimatedSection, { animationType: "fade-in-left", delay: 200, className: "bio-section", children: [_jsxs("article", { className: "bio-text", itemScope: true, itemType: "https://schema.org/Article", children: [_jsx("h3", { className: "sr-only", children: "Notre Pizza Napolitaine et Charcuterie" }), _jsxs("p", { itemProp: "articleBody", children: ["Notre restaurant propose de la", " ", _jsx("strong", { children: "pizza napolitaine traditionnelle et authentique" }), " ", "avec des produits de grande qualit\u00E9. Nos pizzas sont cuites dans un ", _jsx("strong", { children: "four en d\u00F4me import\u00E9 de G\u00EAnes" }), ", et la charcuterie finement d\u00E9coup\u00E9e avec une", " ", _jsx("strong", { children: "trancheuse professionnelle \u00E0 jambon manuelle" }), "."] }), _jsx("div", { className: "bio-highlight", itemScope: true, itemType: "https://schema.org/Organization", role: "complementary", "aria-label": "Information sur notre charcuterie Rovagnati", children: _jsxs("p", { children: ["Notre charcuterie ", _jsx("strong", { itemProp: "name", children: "Rovagnati" }), " ", "situ\u00E9e \u00E0 ", _jsx("span", { itemProp: "address", children: "Milan" }), " est l'une des plus prestigieuses d'Italie depuis", " ", _jsx("time", { dateTime: "1943", itemProp: "foundingDate", children: "1943" }), " ", "et ", _jsx("strong", { children: "tranch\u00E9e \u00E0 la minute" }), "."] }) })] }), _jsxs("figure", { className: "bio-image-container", children: [_jsx("img", { src: "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/nouveaute-la-famille-des-jambons-crus-rovagnati-selargie.jpg", alt: "Charcuterie italienne Rovagnati tranch\u00E9e finement, jambon cru de Milan depuis 1943", className: "bio-image", loading: "lazy", width: "600", height: "400", itemProp: "image" }), _jsx("figcaption", { className: "sr-only", children: "Charcuterie Rovagnati de Milan, tranch\u00E9e \u00E0 la minute dans notre restaurant" })] })] }), _jsxs(AnimatedSection, { animationType: "fade-in-right", delay: 400, className: "bio-section bio-section--pascal", children: [_jsxs("article", { className: "bio-text", itemScope: true, itemType: "https://schema.org/Person", role: "article", "aria-labelledby": "pascal-title", children: [_jsx("h3", { id: "pascal-title", className: "sr-only", children: "Pascal, Notre Pizza\u00EFolo Expert" }), _jsxs("p", { children: ["Notre pizza\u00EFolo", " ", _jsx("strong", { className: "bio-pascal", itemProp: "name", children: "Pascal" }), ",", " ", _jsx("span", { itemProp: "description", children: "passionn\u00E9 de pizza, ma\u00EEtrise toutes les techniques de pr\u00E9paration de p\u00E2tes faites maison au levain naturel" }), ". De plus, nous utilisons uniquement des", " ", _jsx("strong", { children: "produits bio provenant directement d'Italie" }), "."] }), _jsx("meta", { itemProp: "jobTitle", content: "Pizza\u00EFolo expert" }), _jsx("meta", { itemProp: "worksFor", content: "Rosi Trattoria" })] }), _jsxs("figure", { className: "bio-image-container", children: [_jsx("img", { src: "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/pascal_bio.jpg", alt: "Pascal, pizza\u00EFolo expert de Rosi Trattoria, pr\u00E9parant une pizza napolitaine au levain naturel", className: "bio-image bio-image--pascal", loading: "lazy", width: "600", height: "400", itemProp: "image" }), _jsx("figcaption", { className: "sr-only", children: "Pascal, notre pizza\u00EFolo passionn\u00E9, pr\u00E9parant une pizza avec sa p\u00E2te au levain naturel" })] })] })] })] }));
};
export default Biographie2;
