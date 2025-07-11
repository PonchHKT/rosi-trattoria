#!/usr/bin/env node

import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateRedirectHTML, REDIRECTS } from "./generate-seo-files.js";

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
  "/recrutement/": {
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

// Liste des vidéos
const VIDEOS = [
  {
    title: "Présentation de Rosi Trattoria",
    url: "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Vid%C3%A9o%20Rosi/rosipresentation.mp4",
    thumbnail:
      "https://www.rosi-trattoria.com/images/thumbnails/presentation-rosi-trattoria.png",
    description:
      "Découvrez Rosi Trattoria, une pizzeria italienne authentique à Brive-la-Gaillarde, avec des pizzas napolitaines bio et locales.",
    duration: "PT1M30S",
    uploadDate: "2025-06-23",
  },
  {
    title: "La focaccia chez Rosi",
    url: "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Vid%C3%A9o%20Rosi/rosifocaccia.mp4",
    thumbnail:
      "https://www.rosi-trattoria.com/images/thumbnails/la-forracia-chez-rosi.png",
    description:
      "Apprenez comment Rosi Trattoria prépare sa focaccia artisanale avec des ingrédients bio et locaux.",
    duration: "PT1M45S",
    uploadDate: "2025-06-23",
  },
  {
    title: "Les pâtes fraiche de Rosi",
    url: "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Vid%C3%A9o%20Rosi/rosipatefraiche.mp4",
    thumbnail:
      "https://www.rosi-trattoria.com/images/thumbnails/pates-fraiche-rosi.png",
    description:
      "Découvrez la préparation des pâtes fraîches chez Rosi Trattoria, un savoir-faire italien authentique.",
    duration: "PT2M0S",
    uploadDate: "2025-06-23",
  },
  {
    title: "Les secrets de la pâte Rosi",
    url: "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Vid%C3%A9o%20Rosi/rosisecretspates.mp4",
    thumbnail:
      "https://www.rosi-trattoria.com/images/thumbnails/secrets-de-la-pate-rosi.png",
    description:
      "Les secrets de la pâte à pizza parfaite de Rosi Trattoria, levée pendant 48 heures.",
    duration: "PT1M50S",
    uploadDate: "2025-06-23",
  },
  {
    title: "La téglia et Focaccia de Rosi",
    url: "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Vid%C3%A9o%20Rosi/rositegliafoccacia.mp4",
    thumbnail:
      "https://www.rosi-trattoria.com/images/thumbnails/teglia-et-foraccia-de-rosi.png",
    description:
      "Découvrez la téglia et la focaccia uniques de Rosi Trattoria, préparées avec soin.",
    duration: "PT1M40S",
    uploadDate: "2025-06-23",
  },
  {
    title: "Capri c'est fini",
    url: "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Vid%C3%A9o%20Rosi/rosicapri.mp4",
    thumbnail:
      "https://www.rosi-trattoria.com/images/thumbnails/rosi-capri.png",
    description:
      "Un voyage culinaire inspiré de Capri avec les saveurs de Rosi Trattoria.",
    duration: "PT1M55S",
    uploadDate: "2025-06-23",
  },
  {
    title: "Les Tiramisu de Rosi",
    url: "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Vid%C3%A9o%20Rosi/rositiramistu.mp4",
    thumbnail:
      "https://www.rosi-trattoria.com/images/thumbnails/tiramisu-de-rosi.png",
    description:
      "Découvrez le tiramisu authentique préparé par Rosi Trattoria, un dessert italien classique.",
    duration: "PT1M20S",
    uploadDate: "2025-06-23",
  },
  {
    title: "Les cocktails de Rosi",
    url: "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Vid%C3%A9o%20Rosi/rosicocktail.mp4",
    thumbnail:
      "https://www.rosi-trattoria.com/images/thumbnails/les-cocktails-rosi.png",
    description:
      "Découvrez les cocktails signature de Rosi Trattoria, parfaits pour accompagner votre repas.",
    duration: "PT1M25S",
    uploadDate: "2025-06-23",
  },
];

// Configuration des routes
const routes = [
  {
    path: "/",
    canonical: "/",
    directory: "",
    title:
      "Rosi Trattoria – Pizzeria Italienne Bio, Locale & Fait Maison à Brive-la-Gaillarde",
    description:
      "Rosi Trattoria est une pizzeria italienne à Brive-la-Gaillarde. Pizzas napolitaines bio, locales, faites maison au feu de bois. Produits frais, ambiance chaleureuse.",
    keywords:
      "pizzeria Brive, pizza napolitaine bio, restaurant italien fait maison, trattoria Brive-la-Gaillarde",
    priority: 1.0,
    changefreq: "weekly",
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    path: "/nos-valeurs/",
    canonical: "/nos-valeurs/",
    directory: "nos-valeurs",
    title: "Nos Valeurs - Bio, Local & Artisanal | Rosi Trattoria",
    description:
      "Découvrez les valeurs de Rosi Trattoria : engagement pour le bio, produits locaux, artisanat italien authentique et respect de l'environnement.",
    keywords:
      "valeurs restaurant bio, cuisine italienne artisanale, produits locaux Brive",
    priority: 0.8,
    changefreq: "monthly",
    lastmod: "2025-01-15",
  },
  {
    path: "/carte/",
    canonical: "/carte/",
    directory: "carte",
    title: "Notre Carte - Pizzas Napolitaines Bio | Rosi Trattoria Brive",
    description:
      "Découvrez notre carte de pizzas napolitaines artisanales, faites maison avec des produits bio et locaux. Pâtes levées 48h, cuisson au feu de bois.",
    keywords:
      "carte pizzas napolitaines, menu restaurant italien Brive, pizza bio fait maison",
    priority: 0.9,
    changefreq: "weekly",
    lastmod: "2025-01-15",
  },
  {
    path: "/recrutement/",
    canonical: "/recrutement/",
    directory: "recrutement",
    title: "Recrutement - Rejoignez l'équipe Rosi Trattoria Brive",
    description:
      "Rosi Trattoria recrute ! Rejoignez notre équipe passionnée dans notre pizzeria italienne à Brive-la-Gaillarde. Postes disponibles en cuisine et service.",
    keywords:
      "emploi pizzeria Brive, recrutement restaurant italien, job cuisine service",
    priority: 0.7,
    changefreq: "weekly",
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    path: "/contact/",
    canonical: "/contact/",
    directory: "contact",
    title: "Contact & Réservation - Rosi Trattoria Brive-la-Gaillarde",
    description:
      "Contactez Rosi Trattoria pour vos réservations. Adresse, horaires, téléphone. Pizzeria italienne au 11 Prom. des Tilleuls, Brive-la-Gaillarde.",
    keywords:
      "contact pizzeria Brive, réservation restaurant italien, adresse Rosi Trattoria",
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
  title: "Page non trouvée - Erreur 404 | Rosi Trattoria",
  description:
    "La page que vous cherchez n'existe pas ou a été déplacée. Retournez à l'accueil de Rosi Trattoria, votre pizzeria italienne à Brive-la-Gaillarde.",
  keywords: "erreur 404, page non trouvée, pizzeria Brive",
  priority: 0.1,
  changefreq: "yearly",
  lastmod: "2025-01-15",
};

// Génération du .htaccess
function generateHtaccess() {
  return `# Configuration simplifiée pour Rosi Trattoria
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]

# Force www
RewriteCond %{HTTP_HOST} ^rosi-trattoria\.com$ [NC]
RewriteRule ^(.*)$ https://www.rosi-trattoria.com/$1 [R=301,L]

# Redirection SPA - toutes les routes vers index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/sitemap\.xml$
RewriteCond %{REQUEST_URI} !^/robots\.txt$
RewriteRule . /index.html [L]

# Headers de cache basiques
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

  const redirectUrls = Object.keys(REDIRECTS)
    .map((oldFile) => {
      return `  <url>
    <loc>${CONFIG.baseUrl}/${oldFile}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.1</priority>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${mainUrls}
${redirectUrls}
</urlset>`;
}

// Génération du robots.txt
function generateRobotsTxt() {
  return `User-agent: *
Allow: /

# Sitemap principal
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

# Bloquer les dossiers techniques
Disallow: /assets/
Disallow: /static/
Disallow: /*.json$`;
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
    thumbnailUrl: video.thumbnail,
    contentUrl: video.url,
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

// Injection des meta tags SEO
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

  // Meta robots
  const metaRobots = document.createElement("meta");
  metaRobots.setAttribute("name", "robots");
  metaRobots.setAttribute(
    "content",
    "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
  );
  head.appendChild(metaRobots);

  // Meta googlebot
  const metaGooglebot = document.createElement("meta");
  metaGooglebot.setAttribute("name", "googlebot");
  metaGooglebot.setAttribute("content", "index, follow");
  head.appendChild(metaGooglebot);

  // Open Graph
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

  // Twitter Card
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

  // Alternate hreflang
  const hreflangFr = document.createElement("link");
  hreflangFr.setAttribute("rel", "alternate");
  hreflangFr.setAttribute("hreflang", "fr");
  hreflangFr.setAttribute("href", `${CONFIG.baseUrl}${route.canonical}`);
  head.appendChild(hreflangFr);

  const hreflangFrFR = document.createElement("link");
  hreflangFrFR.setAttribute("rel", "alternate");
  hreflangFrFR.setAttribute("hreflang", "fr-FR");
  hreflangFrFR.setAttribute("href", `${CONFIG.baseUrl}${route.canonical}`);
  head.appendChild(hreflangFrFR);

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

  // Geo meta tags
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
      telephone: "+33544314447",
      url: CONFIG.baseUrl,
      openingHours: [
        "Tu-Th 12:00-14:00,19:00-21:30",
        "Fr-Sa 12:00-14:00,19:00-22:30",
      ],
      servesCuisine: "Italian",
      description: route.description,
      priceRange: "€€",
      image: `${CONFIG.baseUrl}/images/logo/og-image.jpg`,
      hasMenu: `${CONFIG.baseUrl}/carte/`,
      acceptsReservations: true,
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
        title: "Chef de Cuisine",
        description:
          "Rejoignez Rosi Trattoria à Brive-la-Gaillarde en tant que chef de cuisine pour préparer des plats italiens authentiques avec des ingrédients bio et locaux.",
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
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: "Serveur/Serveuse",
        description:
          "Rejoignez notre équipe de service à Rosi Trattoria pour offrir une expérience chaleureuse et authentique à nos clients à Brive-la-Gaillarde.",
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

  return dom.serialize();
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
    const sitemap = generateSitemap();
    fs.writeFileSync(path.join(CONFIG.distDir, "sitemap.xml"), sitemap, "utf8");
    console.log("🗺️ Sitemap optimisé généré");

    // Générer robots.txt
    const robotsTxt = generateRobotsTxt();
    fs.writeFileSync(
      path.join(CONFIG.distDir, "robots.txt"),
      robotsTxt,
      "utf8"
    );
    console.log("🤖 Robots.txt généré");

    // Générer .htaccess
    const htaccess = generateHtaccess();
    fs.writeFileSync(path.join(CONFIG.distDir, ".htaccess"), htaccess, "utf8");
    console.log("⚙️ .htaccess simplifié généré");

    // Générer les redirections HTML
    console.log("🔄 Génération des fichiers de redirection HTML...");
    for (const [oldFile, newPath] of Object.entries(REDIRECTS)) {
      const htmlContent = generateRedirectHTML(oldFile, newPath);
      const filePath = path.join(CONFIG.distDir, oldFile);
      fs.writeFileSync(filePath, htmlContent, "utf8");
      console.log(`✅ Redirection créée: ${oldFile} → ${newPath}`);
    }

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
