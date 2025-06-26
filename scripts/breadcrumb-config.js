export const BREADCRUMB_CONFIG = {
    "/": {
        breadcrumbs: [
            {
                position: 1,
                name: "Accueil",
                url: "https://www.rosi-trattoria.com/",
            },
        ],
    },
    "/nos-valeurs/": {
        breadcrumbs: [
            {
                position: 1,
                name: "Accueil",
                url: "https://www.rosi-trattoria.com/",
            },
            {
                position: 2,
                name: "Nos Valeurs",
                url: "https://www.rosi-trattoria.com/nos-valeurs/",
            },
        ],
    },
    "/carte/": {
        breadcrumbs: [
            {
                position: 1,
                name: "Accueil",
                url: "https://www.rosi-trattoria.com/",
            },
            {
                position: 2,
                name: "Notre Carte",
                url: "https://www.rosi-trattoria.com/carte/",
            },
        ],
    },
    "/recrutement/": {
        breadcrumbs: [
            {
                position: 1,
                name: "Accueil",
                url: "https://www.rosi-trattoria.com/",
            },
            {
                position: 2,
                name: "Recrutement",
                url: "https://www.rosi-trattoria.com/recrutement/",
            },
        ],
    },
    "/contact/": {
        breadcrumbs: [
            {
                position: 1,
                name: "Accueil",
                url: "https://www.rosi-trattoria.com/",
            },
            {
                position: 2,
                name: "Contact",
                url: "https://www.rosi-trattoria.com/contact/",
            },
        ],
    },
};
// Fonction utilitaire pour générer le JSON-LD des breadcrumbs
export function generateBreadcrumbJsonLd(path) {
    const config = BREADCRUMB_CONFIG[path];
    if (!config || !config.breadcrumbs) {
        return null;
    }
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: config.breadcrumbs.map((breadcrumb) => ({
            "@type": "ListItem",
            position: breadcrumb.position,
            name: breadcrumb.name,
            item: breadcrumb.url,
        })),
    };
}
// Pour le prerender (CommonJS)
export function generateBreadcrumbJsonLdString(path) {
    const jsonLd = generateBreadcrumbJsonLd(path);
    return jsonLd ? JSON.stringify(jsonLd) : null;
}
