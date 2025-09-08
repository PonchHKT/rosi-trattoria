#!/usr/bin/env node

import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration unifiée
const CONFIG = {
  distDir: path.join(__dirname, "../dist"),
  baseUrl: "https://www.rosi-trattoria.com",
};

// Configuration des breadcrumbs
const BREADCRUMB_CONFIG = {
  "/": {
    breadcrumbs: [
      { position: 1, name: "Accueil", url: "https://www.rosi-trattoria.com/" },
    ],
  },
  "/nos-valeurs/": {
    breadcrumbs: [
      { position: 1, name: "Accueil", url: "https://www.rosi-trattoria.com/" },
      {
        position: 2,
        name: "Nos Valeurs",
        url: "https://www.rosi-trattoria.com/nos-valeurs/",
      },
    ],
  },
  "/carte/": {
    breadcrumbs: [
      { position: 1, name: "Accueil", url: "https://www.rosi-trattoria.com/" },
      {
        position: 2,
        name: "Notre Carte",
        url: "https://www.rosi-trattoria.com/carte/",
      },
    ],
  },
  "/recrut recruitment/": {
    breadcrumbs: [
      { position: 1, name: "Accueil", url: "https://www.rosi-trattoria.com/" },
      {
        position: 2,
        name: "Recrutement",
        url: "https://www.rosi-trattoria.com/recrutement/",
      },
    ],
  },
  "/contact/": {
    breadcrumbs: [
      { position: 1, name: "Accueil", url: "https://www.rosi-trattoria.com/" },
      {
        position: 2,
        name: "Contact",
        url: "https://www.rosi-trattoria.com/contact/",
      },
    ],
  },
};

// Liste des vidéos avec descriptions optimisées pour SEO
const VIDEOS = [
  {
    title: "Présentation de Rosi Trattoria",
    url: "https://pub-c0cb6a1e942a4d729260f30324399ae.r2.dev/Vid%C3%A9o%20Rosi/rosipresentation.mp4",
    thumbnail: {
      url: "https://www.rosi-trattoria.com/images/thumbnails/presentation-rosi-trattoria.png",
      alt: "Présentation de Rosi Trattoria, pizzeria à Brive-la-Gaillarde",
    },
    description:
      "Découvrez Rosi Trattoria, la meilleure pizzeria à Brive-la-Gaillarde. Pizzas napolitaines bio, cuites au feu de bois, avec des ingrédients locaux près de vous.",
    duration: "PT1M30S",
    uploadDate: "2025-06-23",
  },
  {
    title: "La focaccia chez Rosi",
    url: "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Vid%C3%A9o%20Rosi/rosifocaccia.mp4",
    thumbnail: {
      url: "https://www.rosi-trattoria.com/images/thumbnails/la-forracia-chez-rosi.png",
      alt: "Focaccia artisanale chez Rosi Trattoria, Brive-la-Gaillarde",
    },
    description:
      "Savourez la focaccia artisanale de Rosi Trattoria à Brive-la-Gaillarde, préparée avec des ingrédients bio et locaux pour une expérience italienne authentique.",
    duration: "PT1M45S",
    uploadDate: "2025-06-23",
  },
  {
    title: "Les pâtes fraîches de Rosi",
    url: "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Vid%C3%A9o%20Rosi/rosipatefraiche.mp4",
    thumbnail: {
      url: "https://www.rosi-trattoria.com/images/thumbnails/pates-fraiche-rosi.png",
      alt: "Pâtes fraîches artisanales chez Rosi Trattoria, Brive",
    },
    description:
      "Découvrez les pâtes fraîches artisanales de Rosi Trattoria, restaurant italien à Brive-la-G gailarde, élaborées avec des produits bio locaux.",
    duration: "PT2M0S",
    uploadDate: "2025-06-23",
  },
  {
    title: "Les secrets de la pâte Rosi",
    url: "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Vid%C3%A9o%20Rosi/rosisecretspates.mp4",
    thumbnail: {
      url: "https://www.rosi-trattoria.com/images/thumbnails/secrets-de-la-pate-rosi.png",
      alt: "Secrets de la pâte à pizza parfaite chez Rosi Trattoria",
    },
    description:
      "Les secrets de la pâte à pizza parfaite de Rosi Trattoria à Brive, levée 48h pour la meilleure pizza napolitaine bio près de chez vous.",
    duration: "PT1M50S",
    uploadDate: "2025-06-23",
  },
  {
    title: "La téglia et focaccia de Rosi",
    url: "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Vid%C3%A9o%20Rosi/rositegliafoccacia.mp4",
    thumbnail: {
      url: "https://www.rosi-trattoria.com/images/thumbnails/teglia-et-foraccia-de-rosi.png",
      alt: "Téglia et focaccia uniques chez Rosi Trattoria, Brive",
    },
    description:
      "Découvrez la téglia et focaccia uniques de Rosi Trattoria, pizzeria à Brive-la-Gaillarde, avec des ingrédients bio et une cuisson au feu de bois.",
    duration: "PT1M40S",
    uploadDate: "2025-06-23",
  },
  {
    title: "Capri c'est fini",
    url: "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Vid%C3%A9o%20Rosi/rosicapri.mp4",
    thumbnail: {
      url: "https://www.rosi-trattoria.com/images/thumbnails/rosi-capri.png",
      alt: "Saveurs de Capri chez Rosi Trattoria, pizzeria à Brive",
    },
    description:
      "Voyagez à Capri avec les saveurs authentiques de Rosi Trattoria, pizzeria à Brive-la-Gaillarde. Pizzas bio et locales, réservez maintenant !",
    duration: "PT1M55S",
    uploadDate: "2025-06-23",
  },
  {
    title: "Les tiramisus de Rosi",
    url: "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Vid%C3%A9o%20Rosi/rositiramistu.mp4",
    thumbnail: {
      url: "https://www.rosi-trattoria.com/images/thumbnails/tiramisu-de-rosi.png",
      alt: "Tiramisu authentique chez Rosi Trattoria, Brive",
    },
    description:
      "Savourez le tiramisu authentique de Rosi Trattoria, restaurant italien à Brive-la-Gaillarde. Venez découvrir nos desserts bio !",
    duration: "PT1M20S",
    uploadDate: "2025-06-23",
  },
  {
    title: "Les cocktails de Rosi",
    url: "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Vid%C3%A9o%20Rosi/rosicocktail.mp4",
    thumbnail: {
      url: "https://www.rosi-trattoria.com/images/thumbnails/les-cocktails-rosi.png",
      alt: "Cocktails signature chez Rosi Trattoria, Brive",
    },
    description:
      "Découvrez les cocktails signature de Rosi Trattoria, pizzeria à Brive-la-Gaillarde. Parfaits pour accompagner vos pizzas bio, venez vite !",
    duration: "PT1M25S",
    uploadDate: "2025-06-23",
  },
];

// Configuration des routes avec optimisations SEO
const routes = [
  {
    path: "/",
    canonical: "/",
    directory: "",
    title: "Pizzeria Brive - Rosi Trattoria | Pizza Bio & Feu de Bois",
    description:
      "Meilleure pizzeria à Brive ! Pizzas napolitaines bio, cuites au feu de bois avec pâte levée 48h. Réservez chez Rosi Trattoria !",
    keywords:
      "pizza brive, pizzeria brive, restaurant italien brive, pizza napolitaine brive-la-gaillarde, meilleure pizza brive, pizza bio brive, trattoria brive, pizzeria près de moi, pizza feu de bois brive",
    priority: 1.0,
    changefreq: "weekly",
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    path: "/nos-valeurs/",
    canonical: "/nos-valeurs/",
    directory: "nos-valeurs",
    title: "Nos Valeurs | Rosi Trattoria - Pizzeria Bio à Brive",
    description:
      "Découvrez les valeurs de Rosi Trattoria, pizzeria bio à Brive. Produits locaux, pâte levée 48h, cuisine italienne authentique. Visitez-nous !",
    keywords:
      "restaurant italien brive, pizzeria bio brive, trattoria brive, pizza napolitaine brive-la-gaillarde, cuisine artisanale brive, produits locaux brive",
    priority: 0.8,
    changefreq: "monthly",
    lastmod: "2025-01-15",
  },
  {
    path: "/carte/",
    canonical: "/carte/",
    directory: "carte",
    title: "Carte Pizzas Bio | Rosi Trattoria - Pizzeria Brive",
    description:
      "Découvrez les pizzas napolitaines bio de Rosi Trattoria à Brive. Pâte levée 48h, feu de bois, ingrédients locaux. Consultez notre carte !",
    keywords:
      "pizza brive, pizzeria brive, carte pizza napolitaine, restaurant italien brive, pizza bio brive, meilleure pizza brive, menu trattoria brive",
    priority: 0.9,
    changefreq: "weekly",
    lastmod: "2025-01-15",
  },
  {
    path: "/recrutement/",
    canonical: "/recrutement/",
    directory: "recrutement",
    title: "Recrutement Pizzeria Brive | Rosi Trattoria",
    description:
      "Rejoignez Rosi Trattoria, pizzeria à Brive ! Postes en cuisine et service pour une expérience italienne authentique. Postulez maintenant !",
    keywords:
      "emploi pizzeria brive, recrutement restaurant italien brive, job pizzeria brive-la-gaillarde, travail trattoria brive",
    priority: 0.7,
    changefreq: "weekly",
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    path: "/contact/",
    canonical: "/contact/",
    directory: "contact",
    title: "Contact Pizzeria Brive | Rosi Trattoria",
    description:
      "Réservez chez Rosi Trattoria, pizzeria à Brive, 11 Prom. des Tilleuls. Pizzas bio, feu de bois. Appelez-nous pour votre table !",
    keywords:
      "pizzeria brive, contact pizzeria brive, réservation restaurant italien brive, pizza brive, trattoria brive, pizzeria près de moi",
    priority: 0.6,
    changefreq: "monthly",
    lastmod: "2025-01-15",
  },
];

// Configuration spéciale pour la page 404
const page404Config = {
  path: "/404/",
  canonical: "/404/",
  directory: "404",
  title: "404 - Pizzeria Brive | Rosi Trattoria",
  description:
    "Page introuvable ? Retrouvez les meilleures pizzas bio de Brive chez Rosi Trattoria. Visitez notre pizzeria au 11 Prom. des Tilleuls !",
  keywords: "pizzeria brive, pizza brive, restaurant italien brive",
  priority: 0.1,
  changefreq: "yearly",
  lastmod: "2025-01-15",
};

// Génération du .htaccess avec optimisations pour IONOS
function generateHtaccess() {
  return `# Configuration optimisée pour Rosi Trattoria sur IONOS
RewriteEngine On

# Force HTTPS pour sécurité et SEO
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]

# Force www pour uniformité des URLs
RewriteCond %{HTTP_HOST} ^rosi-trattoria\.com$ [NC]
RewriteRule ^(.*)$ https://www.rosi-trattoria.com/$1 [R=301,L]

# Bloquer l'indexation des fichiers HTML non désirés
RewriteCond %{REQUEST_URI} \.html$ [NC]
RewriteRule ^(.*)$ - [R=404,L]

# Redirection SPA - toutes les routes vers index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/sitemap\.xml$
RewriteCond %{REQUEST_URI} !^/robots\.txt$
RewriteRule . /index.html [L]

# Gestion des erreurs 404
ErrorDocument 404 /404/index.html

# Headers de cache optimisés pour performance
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/html "access plus 1 hour"
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Compression Gzip pour performance
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/javascript
</IfModule>`;
}

// Génération du sitemap
function generateSitemap() {
  const mainUrls = routes
    .map((route) => {
      return `  <url>
    <loc>${CONFIG.baseUrl}${route.canonical}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${mainUrls}
</urlset>`;
}

// Génération du robots.txt optimisé
function generateRobotsTxt() {
  return `User-agent: *
Allow: /

# Sitemap principal pour exploration
Sitemap: ${CONFIG.baseUrl}/sitemap.xml

# Optimisations spécifiques pour les moteurs de recherche
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: facebookexternalhit
Allow: /

# Bloquer les dossiers techniques et fichiers inutiles
Disallow: /assets/
Disallow: /static/
Disallow: /*.json$
Disallow: /*.html$`;
}

// Génération du JSON-LD des breadcrumbs
function generateBreadcrumbJsonLd(path) {
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

// Génération du JSON-LD des VideoObject
function generateVideoJsonLd() {
  return VIDEOS.map((video) => ({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description,
    thumbnailUrl: video.thumbnail.url,
    contentUrl: video.url,
    embedUrl: video.url,
    uploadDate: video.uploadDate,
    duration: video.duration,
    publisher: {
      "@type": "Organization",
      name: "Rosi Trattoria",
      logo: {
        "@type": "ImageObject",
        url: `${CONFIG.baseUrl}/images/logo/og-image.jpg`,
      },
    },
    isFamilyFriendly: true,
    inLanguage: "fr-FR",
  }));
}

// Injection des meta tags SEO avec optimisations
function injectSEOMeta(html, route) {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const head = document.head;

  // Supprimer les meta tags existants
  const existingMetas = head.querySelectorAll(
    'meta[name="description"], meta[name="keywords"], title, link[rel="canonical"], script[type="application/ld+json"]'
  );
  existingMetas.forEach((meta) => meta.remove());

  // Title
  const title = document.createElement("title");
  title.textContent = route.title;
  head.insertBefore(title, head.firstChild);

  // Meta description
  const metaDescription = document.createElement("meta");
  metaDescription.setAttribute("name", "description");
  metaDescription.setAttribute("content", route.description);
  head.appendChild(metaDescription);

  // Meta keywords
  const metaKeywords = document.createElement("meta");
  metaKeywords.setAttribute("name", "keywords");
  metaKeywords.setAttribute("content", route.keywords);
  head.appendChild(metaKeywords);

  // Meta robots optimisé
  const metaRobots = document.createElement("meta");
  metaRobots.setAttribute("name", "robots");
  metaRobots.setAttribute(
    "content",
    route.path === "/404/"
      ? "noindex, nofollow"
      : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:15"
  );
  head.appendChild(metaRobots);

  // Meta googlebot
  const metaGooglebot = document.createElement("meta");
  metaGooglebot.setAttribute("name", "googlebot");
  metaGooglebot.setAttribute(
    "content",
    route.path === "/404/" ? "noindex" : "index, follow"
  );
  head.appendChild(metaGooglebot);

  // Open Graph optimisé
  const ogTitle = document.createElement("meta");
  ogTitle.setAttribute("property", "og:title");
  ogTitle.setAttribute("content", route.title);
  head.appendChild(ogTitle);

  const ogDescription = document.createElement("meta");
  ogDescription.setAttribute("property", "og:description");
  ogDescription.setAttribute("content", route.description);
  head.appendChild(ogDescription);

  const ogUrl = document.createElement("meta");
  ogUrl.setAttribute("property", "og:url");
  ogUrl.setAttribute("content", `${CONFIG.baseUrl}${route.canonical}`);
  head.appendChild(ogUrl);

  const ogImage = document.createElement("meta");
  ogImage.setAttribute("property", "og:image");
  ogImage.setAttribute("content", `${CONFIG.baseUrl}/images/logo/og-image.jpg`);
  head.appendChild(ogImage);

  const ogType = document.createElement("meta");
  ogType.setAttribute("property", "og:type");
  ogType.setAttribute("content", "website");
  head.appendChild(ogType);

  const ogSiteName = document.createElement("meta");
  ogSiteName.setAttribute("property", "og:site_name");
  ogSiteName.setAttribute("content", "Rosi Trattoria");
  head.appendChild(ogSiteName);

  const ogLocale = document.createElement("meta");
  ogLocale.setAttribute("property", "og:locale");
  ogLocale.setAttribute("content", "fr_FR");
  head.appendChild(ogLocale);

  // Twitter Card optimisé
  const twitterCard = document.createElement("meta");
  twitterCard.setAttribute("name", "twitter:card");
  twitterCard.setAttribute("content", "summary_large_image");
  head.appendChild(twitterCard);

  const twitterTitle = document.createElement("meta");
  twitterTitle.setAttribute("name", "twitter:title");
  twitterTitle.setAttribute("content", route.title);
  head.appendChild(twitterTitle);

  const twitterDescription = document.createElement("meta");
  twitterDescription.setAttribute("name", "twitter:description");
  twitterDescription.setAttribute("content", route.description);
  head.appendChild(twitterDescription);

  const twitterImage = document.createElement("meta");
  twitterImage.setAttribute("name", "twitter:image");
  twitterImage.setAttribute(
    "content",
    `${CONFIG.baseUrl}/images/logo/og-image.jpg`
  );
  head.appendChild(twitterImage);

  // Canonical URL
  const canonical = document.createElement("link");
  canonical.setAttribute("rel", "canonical");
  canonical.setAttribute("href", `${CONFIG.baseUrl}${route.canonical}`);
  head.appendChild(canonical);

  // Alternate hreflang optimisé
  const hreflangFr = document.createElement("link");
  hreflangFr.setAttribute("rel", "alternate");
  hreflangFr.setAttribute("hreflang", "fr-FR");
  hreflangFr.setAttribute("href", `${CONFIG.baseUrl}${route.canonical}`);
  head.appendChild(hreflangFr);

  const hreflangDefault = document.createElement("link");
  hreflangDefault.setAttribute("rel", "alternate");
  hreflangDefault.setAttribute("hreflang", "x-default");
  hreflangDefault.setAttribute("href", `${CONFIG.baseUrl}${route.canonical}`);
  head.appendChild(hreflangDefault);

  // Meta author
  const metaAuthor = document.createElement("meta");
  metaAuthor.setAttribute("name", "author");
  metaAuthor.setAttribute("content", "Rosi Trattoria");
  head.appendChild(metaAuthor);

  // Geo meta tags optimisés
  const geoRegion = document.createElement("meta");
  geoRegion.setAttribute("name", "geo.region");
  geoRegion.setAttribute("content", "FR-19");
  head.appendChild(geoRegion);

  const geoPlacename = document.createElement("meta");
  geoPlacename.setAttribute("name", "geo.placename");
  geoPlacename.setAttribute("content", "Brive-la-Gaillarde");
  head.appendChild(geoPlacename);

  const geoPosition = document.createElement("meta");
  geoPosition.setAttribute("name", "geo.position");
  geoPosition.setAttribute("content", "45.1632151;1.532797");
  head.appendChild(geoPosition);

  const icbm = document.createElement("meta");
  icbm.setAttribute("name", "ICBM");
  icbm.setAttribute("content", "45.1632151, 1.532797");
  head.appendChild(icbm);

  // Breadcrumbs JSON-LD
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(route.path);
  if (breadcrumbJsonLd) {
    const breadcrumbScript = document.createElement("script");
    breadcrumbScript.setAttribute("type", "application/ld+json");
    breadcrumbScript.textContent = JSON.stringify(breadcrumbJsonLd);
    head.appendChild(breadcrumbScript);
  }

  // Schema.org pour la page d'accueil
  if (route.path === "/") {
    const restaurantScript = document.createElement("script");
    restaurantScript.setAttribute("type", "application/ld+json");
    restaurantScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Restaurant",
      name: "Rosi Trattoria",
      address: {
        "@type": "PostalAddress",
        streetAddress: "11 Prom. des Tilleuls",
        addressLocality: "Brive-la-Gaillarde",
        postalCode: "19100",
        addressCountry: "FR",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 45.1632151,
        longitude: 1.532797,
      },
      telephone: "+33544314447",
      url: CONFIG.baseUrl,
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Tuesday", "Wednesday", "Thursday"],
          opens: "12:00",
          closes: "14:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Tuesday", "Wednesday", "Thursday"],
          opens: "19:00",
          closes: "21:30",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Friday", "Saturday"],
          opens: "12:00",
          closes: "14:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Friday", "Saturday"],
          opens: "19:00",
          closes: "22:30",
        },
      ],
      servesCuisine: ["Italian", "Pizza"],
      description:
        "Rosi Trattoria, pizzeria à Brive-la-Gaillarde, propose des pizzas napolitaines bio cuites au feu de bois avec une pâte levée 48h et des ingrédients locaux.",
      priceRange: "€€",
      image: `${CONFIG.baseUrl}/images/logo/og-image.jpg`,
      hasMenu: `${CONFIG.baseUrl}/carte/`,
      acceptsReservations: true,
      menuItem: [
        {
          "@type": "MenuItem",
          name: "Pizza Margherita Bio",
          description:
            "Pizza napolitaine bio avec pâte levée 48h, sauce tomate artisanale et mozzarella fior di latte, cuite au feu de bois.",
        },
        {
          "@type": "MenuItem",
          name: "Focaccia Artisanal",
          description:
            "Focaccia bio préparée avec des ingrédients locaux, cuite au feu de bois à Rosi Trattoria, Brive-la-Gaillarde.",
        },
      ],
      keywords:
        "pizza brive, pizzeria brive, restaurant italien brive, pizza napolitaine brive-la-gaillarde, meilleure pizza brive",
    });
    head.appendChild(restaurantScript);

    // Schema.org pour les vidéos sur la page d'accueil
    const videoJsonLd = generateVideoJsonLd();
    videoJsonLd.forEach((videoSchema) => {
      const videoScript = document.createElement("script");
      videoScript.setAttribute("type", "application/ld+json");
      videoScript.textContent = JSON.stringify(videoSchema);
      head.appendChild(videoScript);
    });
  }

  // Schema.org pour la page Recrutement
  if (route.path === "/recrutement/") {
    const jobPostingsScript = document.createElement("script");
    jobPostingsScript.setAttribute("type", "application/ld+json");
    jobPostingsScript.textContent = JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: "Chef de Cuisine - Pizzeria Brive",
        description:
          "Rejoignez Rosi Trattoria, pizzeria à Brive-la-Gaillarde, comme chef de cuisine. Préparez des pizzas napolitaines bio cuites au feu de bois avec des ingrédients locaux.",
        hiringOrganization: {
          "@type": "Organization",
          name: "Rosi Trattoria",
          sameAs: "https://www.rosi-trattoria.com",
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            streetAddress: "11 Promenade des Tilleuls",
            addressLocality: "Brive-la-Gaillarde",
            postalCode: "19100",
            addressRegion: "Nouvelle-Aquitaine",
            addressCountry: "FR",
          },
        },
        employmentType: "FULL_TIME",
        datePosted: "2025-06-23",
        validThrough: "2025-12-31",
        baseSalary: {
          "@type": "MonetaryAmount",
          currency: "EUR",
          value: {
            "@type": "QuantitativeValue",
            minValue: 25000,
            maxValue: 35000,
            unitText: "YEAR",
          },
        },
        applicationContact: {
          "@type": "ContactPoint",
          email: "rosi.trattoria@gmail.com",
          contactType: "Recruitment",
        },
      },
      {
        "@type": "JobPosting",
        title: "Serveur/Serveuse - Pizzeria Brive",
        description:
          "Rejoignez Rosi Trattoria, pizzeria à Brive-la-Gaillarde, pour offrir une expérience italienne authentique. Service chaleureux pour nos pizzas bio.",
        hiringOrganization: {
          "@type": "Organization",
          name: "Rosi Trattoria",
          sameAs: "https://www.rosi-trattoria.com",
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            streetAddress: "11 Promenade des Tilleuls",
            addressLocality: "Brive-la-Gaillarde",
            postalCode: "19100",
            addressRegion: "Nouvelle-Aquitaine",
            addressCountry: "FR",
          },
        },
        employmentType: "FULL_TIME",
        datePosted: "2025-06-23",
        validThrough: "2025-12-31",
        baseSalary: {
          "@type": "MonetaryAmount",
          currency: "EUR",
          value: {
            "@type": "QuantitativeValue",
            minValue: 20000,
            maxValue: 28000,
            unitText: "YEAR",
          },
        },
        applicationContact: {
          "@type": "ContactPoint",
          email: "rosi.trattoria@gmail.com",
          contactType: "Recruitment",
        },
      },
    ]);
    head.appendChild(jobPostingsScript);
  }

  // Ajouter lazy-loading pour les images et vidéos
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    if (!img.hasAttribute("loading")) {
      img.setAttribute("loading", "lazy");
    }
    if (!img.hasAttribute("alt")) {
      img.setAttribute("alt", "Image de Rosi Trattoria, pizzeria à Brive");
    }
  });

  return dom.serialize();
}

// Fonction pour valider l'accessibilité des fichiers
function validateFileAccess(filePath, fileName) {
  try {
    fs.accessSync(filePath, fs.constants.R_OK);
    console.log(`✅ ${fileName} est accessible`);
    // Définir les permissions à 644
    fs.chmodSync(filePath, "0644");
    console.log(`✅ Permissions de ${fileName} définies à 644`);
  } catch (error) {
    console.error(`❌ Erreur d'accès à ${fileName}:`, error.message);
    throw error;
  }
}

// Fonction de test pour vérifier la génération
function testGeneration() {
  console.log("=== TEST .HTACCESS ===");
  console.log(generateHtaccess());
  console.log("\n=== TEST SITEMAP ===");
  console.log(generateSitemap());
  console.log("\n=== TEST ROBOTS.TXT ===");
  console.log(generateRobotsTxt());
}

// Fonction principale de prerender
async function prerenderForIONOS() {
  console.log("🚀 Démarrage du prerender optimisé pour IONOS...");

  try {
    // Vérifier l'existence du dossier dist
    if (!fs.existsSync(CONFIG.distDir)) {
      fs.mkdirSync(CONFIG.distDir, { recursive: true });
      console.log(`📁 Dossier ${CONFIG.distDir} créé`);
    }

    // Lire le fichier HTML de base
    const indexPath = path.join(CONFIG.distDir, "index.html");
    if (!fs.existsSync(indexPath)) {
      throw new Error(`Fichier index.html non trouvé à ${indexPath}`);
    }
    const baseHtml = fs.readFileSync(indexPath, "utf8");

    // Générer les pages principales avec SEO optimisé
    for (const route of routes) {
      console.log(`📄 Génération de la page: ${route.path}`);
      const optimizedHtml = injectSEOMeta(baseHtml, route);

      // Créer la structure de fichiers
      if (route.directory) {
        const routeDir = path.join(CONFIG.distDir, route.directory);
        fs.mkdirSync(routeDir, { recursive: true });
        const filePath = path.join(routeDir, "index.html");
        fs.writeFileSync(filePath, optimizedHtml, "utf8");
        console.log(`✅ Page générée: ${filePath}`);
      } else {
        fs.writeFileSync(indexPath, optimizedHtml, "utf8");
        console.log(`✅ Page d'accueil optimisée: ${indexPath}`);
      }
    }

    // Générer la page 404
    console.log(`📄 Génération de la page 404: ${page404Config.path}`);
    const html404 = injectSEOMeta(baseHtml, page404Config);
    const dir404 = path.join(CONFIG.distDir, page404Config.directory);
    fs.mkdirSync(dir404, { recursive: true });
    const filePath404 = path.join(dir404, "index.html");
    fs.writeFileSync(filePath404, html404, "utf8");
    console.log(`✅ Page 404 générée: ${filePath404}`);

    // Générer le sitemap
    const sitemapPath = path.join(CONFIG.distDir, "sitemap.xml");
    const sitemap = generateSitemap();
    fs.writeFileSync(sitemapPath, sitemap, "utf8");
    console.log("🗺️ Sitemap optimisé généré");
    validateFileAccess(sitemapPath, "sitemap.xml");

    // Générer robots.txt
    const robotsPath = path.join(CONFIG.distDir, "robots.txt");
    const robotsTxt = generateRobotsTxt();
    fs.writeFileSync(robotsPath, robotsTxt, "utf8");
    console.log("🤖 Robots.txt généré");
    validateFileAccess(robotsPath, "robots.txt");

    // Générer .htaccess
    const htaccessPath = path.join(CONFIG.distDir, ".htaccess");
    const htaccess = generateHtaccess();
    fs.writeFileSync(htaccessPath, htaccess, "utf8");
    console.log("⚙️ .htaccess optimisé généré");
    validateFileAccess(htaccessPath, ".htaccess");

    console.log("🎉 Prerender optimisé terminé avec succès !");
    console.log("\n📊 Résumé des pages générées:");
    routes.forEach((route) => {
      console.log(
        `   • ${CONFIG.baseUrl}${route.canonical} (priorité: ${route.priority})`
      );
    });
    console.log(
      `   • ${CONFIG.baseUrl}${page404Config.canonical} (page 404 - non indexée)`
    );

    // Recommandation pour le serveur dynamique (optionnel)
    console.log(
      "\n⚠️ Recommandation: Si robots.txt reste inaccessible, configurez une route dynamique:"
    );
    console.log(`
    app.get('/robots.txt', (req, res) => {
      res.type('text/plain');
      res.send(generateRobotsTxt());
    });
    `);
  } catch (error) {
    console.error("❌ Erreur lors du prerender:", error.message);
    process.exit(1);
  }
}

// Exporter et exécuter
export { prerenderForIONOS as prerender };

if (import.meta.url === `file://${process.argv[1]}`) {
  prerenderForIONOS().catch((error) => {
    console.error("❌ Erreur fatale:", error);
    process.exit(1);
  });
}
