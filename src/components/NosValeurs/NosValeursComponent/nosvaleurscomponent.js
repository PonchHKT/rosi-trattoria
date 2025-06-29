import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo } from "react";
import { Home, Wheat, Leaf, Sparkles } from "lucide-react";
import "./nosvaleurscomponent.scss";
import Swipergallery from "../../Acceuil/SwiperGallery/swipergallery";
// Données des sections avec contenu SEO optimisé
const sectionsData = [
    {
        title: "Pâte au Levain Naturel d'Exception",
        text: "Chaque matin, Pascal pétrit une pâte unique au levain naturel, maturée 48 heures selon les techniques authentiques de John Bergh, double champion du monde. Avec la farine biologique Molino Marino Felice et notre levain maison, elle offre une texture aérienne et une digestibilité optimale pour des pizzas napolitaines d'exception.",
        note: "Chuttt !!! Elle respire...",
        highlight: true,
    },
    {
        title: "Tomates San Marzano Authentiques",
        text: "Nos tomates San Marzano, cultivées exclusivement dans le sol volcanique fertile entre Naples et Salerne, apportent cette saveur sucrée et acidulée caractéristique qui fait la renommée de la pizza napolitaine authentique.",
    },
    {
        title: "Boissons Artisanales Italiennes Bio",
        text: "Sélectionnées auprès des meilleurs producteurs artisanaux d'Italie, nos boissons biologiques et naturelles accompagnent parfaitement vos pizzas. Chinotto, limonades siciliennes et vins bio italiens. Salute !",
    },
    {
        title: "Charcuterie Rovagnati de Milan",
        text: "Tranchée à la minute sur notre trancheuse traditionnelle italienne, la charcuterie premium Rovagnati de Milan évoque l'authenticité des meilleures osterias lombardes. Prosciutto, mortadelle et coppa d'exception.",
    },
    {
        title: "Accueil Chaleureux à l'Italienne",
        text: "Dès que vous franchissez notre porte, embarquez pour un véritable voyage culinaire en Italie. Notre équipe passionnée vous accueille comme en famille, car votre plaisir gastronomique est notre priorité absolue.",
    },
    {
        title: "Légumes Frais de Producteurs Locaux",
        text: "Nos légumes bio, livrés quotidiennement par des producteurs locaux de Corrèze, sont préparés frais chaque jour par notre pizzaïolo Pascal pour garantir une qualité nutritionnelle et gustative optimale.",
    },
    {
        title: "Engagement Qualité et Hygiène",
        text: "Gwen et Pascal s'engagent personnellement à maintenir une qualité constante et une hygiène irréprochable, dignes de la réputation d'excellence de Rosi Trattoria, restaurant italien authentique à Brive-la-Gaillarde.",
    },
];
// Données des cartes avec contenu SEO enrichi
const featureCardsData = [
    {
        image: "/images/fait-maison.webp",
        alt: "Pizzas artisanales faites maison par Pascal à Rosi Trattoria",
        title: "100% Fait Maison Artisanal",
        text: "Tout est préparé quotidiennement sur place avec un savoir-faire artisanal italien authentique. Nos pizzas napolitaines au goût unique sont le fruit d'une passion transmise par les maîtres pizzaïolos italiens.",
        icon: Home,
    },
    {
        image: "/images/levain-naturel.jpg",
        alt: "Pâte à pizza au levain naturel maturée 48h selon John Bergh",
        title: "Levain Naturel Traditionnel",
        text: "Notre pâte signature, élaborée avec un levain naturel vivant et de la farine biologique premium, garantit des pizzas napolitaines délicieuses et parfaitement digestes, selon la tradition authentique.",
        icon: Wheat,
    },
    {
        image: "/images/local-biologique.jpg",
        alt: "Ingrédients bio et locaux utilisés chez Rosi Trattoria Brive",
        title: "Local & Agriculture Biologique",
        text: "En privilégiant les circuits courts et l'agriculture biologique, nous offrons une cuisine saine et responsable tout en soutenant activement les producteurs locaux de Corrèze et du Limousin.",
        icon: Leaf,
    },
];
const NosValeursComponent = () => {
    return (_jsxs("section", { className: "nos-valeurs", "aria-label": "Nos valeurs et savoir-faire chez Rosi Trattoria", children: [_jsxs("div", { className: "nos-valeurs__content", children: [_jsxs("section", { className: "nos-valeurs__feature-cards", "aria-labelledby": "savoir-faire-title", children: [_jsx("h2", { id: "savoir-faire-title", className: "nos-valeurs__features-title", children: "Nos Savoir-Faire Authentiques" }), _jsx("div", { className: "nos-valeurs__cards-grid", children: featureCardsData.map((card, index) => {
                                    const IconComponent = card.icon;
                                    return (_jsxs("article", { className: "nos-valeurs__feature-card", children: [_jsxs("div", { className: "nos-valeurs__card-header", children: [_jsx(IconComponent, { className: "nos-valeurs__card-icon", size: 32, "aria-hidden": "true" }), _jsx("img", { src: card.image, alt: card.alt, className: "nos-valeurs__feature-image", loading: "lazy", width: "300", height: "200" })] }), _jsxs("div", { className: "nos-valeurs__card-content", children: [_jsx("h3", { className: "nos-valeurs__feature-title", children: card.title }), _jsx("p", { className: "nos-valeurs__feature-text", children: card.text })] })] }, index));
                                }) })] }), _jsxs("article", { className: "nos-valeurs__hero", role: "banner", children: [_jsxs("div", { className: "nos-valeurs__pascal-showcase", children: [_jsxs("div", { className: "nos-valeurs__pascal-name-container", children: [_jsx("div", { className: "nos-valeurs__pascal-title", children: _jsx("span", { children: "Ma\u00EEtre Pizza\u00EFolo" }) }), _jsx("h1", { id: "pascal-title", className: "nos-valeurs__pascal-name", children: "Pascal Bellemain" })] }), _jsxs("div", { className: "nos-valeurs__pascal-image-container", children: [_jsx("img", { src: "/images/pascal.jpg", alt: "Pascal Bellemain, ma\u00EEtre pizza\u00EFolo de Rosi Trattoria form\u00E9 par John Bergh, champion du monde de pizza napolitaine", className: "nos-valeurs__pascal-image", loading: "eager", width: "400", height: "300" }), _jsx("div", { className: "nos-valeurs__image-overlay" })] })] }), _jsxs("div", { className: "nos-valeurs__intro-text", children: [_jsxs("p", { className: "nos-valeurs__intro-highlight", children: [_jsx("strong", { children: "Pascal a suivi une formation d'excellence \u00E0 l'\u00E9cole de John Bergh, double champion du monde de pizza napolitaine" }), ", afin de vous offrir une exp\u00E9rience gastronomique italienne authentique et \u00E9thique \u00E0 Brive-la-Gaillarde."] }), _jsx("blockquote", { className: "nos-valeurs__intro-body", cite: "Pascal", children: _jsxs("p", { children: [_jsx("strong", { children: "\"" }), "Chez Rosi Trattoria, c'est p\u00E2te au levain naturel maison pour une meilleure digestion. Je favorise au maximum les petits producteurs locaux de Corr\u00E8ze et utilise majoritairement des produits issus de l'agriculture biologique dans la confection de nos pizzas napolitaines authentiques, et tout cela pour votre plus grand plaisir gastronomique.", _jsx("strong", { children: "\"" })] }) })] })] }), _jsxs("aside", { className: "nos-valeurs__quote", role: "complementary", children: [_jsx(Sparkles, { className: "nos-valeurs__quote-icon", size: 32, "aria-hidden": "true" }), _jsx("blockquote", { children: "Chez Rosi Trattoria, chaque pizza napolitaine raconte une histoire d'amour entre tradition italienne mill\u00E9naire et passion artisanale contemporaine." })] }), _jsxs("section", { className: "nos-valeurs__main-block", "aria-labelledby": "engagements-title", children: [_jsx("h2", { id: "engagements-title", className: "nos-valeurs__main-title", children: "Nos Engagements Qualit\u00E9 & Authenticit\u00E9" }), _jsx("div", { className: "nos-valeurs__sections-flex", children: sectionsData.map((section, index) => (_jsxs("article", { className: `nos-valeurs__section ${section.highlight ? "nos-valeurs__section--highlight" : ""}`, children: [_jsx("h3", { className: "nos-valeurs__section-title", children: section.title }), _jsx("p", { className: "nos-valeurs__section-text", children: section.text }), section.note && (_jsx("p", { className: "nos-valeurs__section-note", role: "note", children: section.note }))] }, index))) })] })] }), _jsx(Swipergallery, { pageName: "Nos Valeurs" })] }));
};
export default memo(NosValeursComponent);
