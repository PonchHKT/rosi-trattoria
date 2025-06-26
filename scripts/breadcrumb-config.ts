// Types pour la configuration des breadcrumbs
interface BreadcrumbItem {
  position: number;
  name: string;
  url: string;
}

interface BreadcrumbConfig {
  breadcrumbs: BreadcrumbItem[];
}

interface BreadcrumbJsonLd {
  "@context": string;
  "@type": string;
  itemListElement: Array<{
    "@type": string;
    position: number;
    name: string;
    item: string;
  }>;
}

// Type pour les clés de configuration (les chemins disponibles)
type BreadcrumbPath = "/" | "/nos-valeurs/" | "/carte/" | "/recrutement/" | "/contact/";

export const BREADCRUMB_CONFIG: Record<BreadcrumbPath, BreadcrumbConfig> = {
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
export function generateBreadcrumbJsonLd(path: string): BreadcrumbJsonLd | null {
  const config = BREADCRUMB_CONFIG[path as BreadcrumbPath];
  if (!config || !config.breadcrumbs) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: config.breadcrumbs.map((breadcrumb: BreadcrumbItem) => ({
      "@type": "ListItem",
      position: breadcrumb.position,
      name: breadcrumb.name,
      item: breadcrumb.url,
    })),
  };
}

// Pour le prerender (CommonJS)
export function generateBreadcrumbJsonLdString(path: string): string | null {
  const jsonLd = generateBreadcrumbJsonLd(path);
  return jsonLd ? JSON.stringify(jsonLd) : null;
}