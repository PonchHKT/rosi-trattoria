import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration adaptée pour IONOS
const CONFIG = {
  distDir: path.join(__dirname, "../dist"),
  baseUrl: "https://www.rosi-trattoria.com",
};

// Routes avec métadonnées SEO (identiques à votre config Vercel)
const routes = [
  {
    path: "/",
    title:
      "Rosi Trattoria – Pizzeria Italienne Bio, Locale & Fait Maison à Brive-la-Gaillarde",
    description:
      "Rosi Trattoria est une pizzeria italienne à Brive-la-Gaillarde. Pizzas napolitaines bio, locales, faites maison au feu de bois. Produits frais, ambiance chaleureuse.",
    keywords:
      "pizzeria Brive, pizza napolitaine bio, restaurant italien fait maison, trattoria Brive-la-Gaillarde",
    priority: 1.0,
    changefreq: "daily",
  },
  {
    path: "/carte",
    title: "Notre Carte - Pizzas Napolitaines Bio | Rosi Trattoria Brive",
    description:
      "Découvrez notre carte de pizzas napolitaines artisanales, faites maison avec des produits bio et locaux. Pâtes levées 48h, cuisson au feu de bois.",
    keywords:
      "carte pizzas napolitaines, menu restaurant italien Brive, pizza bio fait maison",
    priority: 0.9,
    changefreq: "weekly",
  },
  {
    path: "/nos-valeurs",
    title: "Nos Valeurs - Bio, Local & Artisanal | Rosi Trattoria",
    description:
      "Découvrez les valeurs de Rosi Trattoria : engagement pour le bio, produits locaux, artisanat italien authentique et respect de l'environnement.",
    keywords:
      "valeurs restaurant bio, cuisine italienne artisanale, produits locaux Brive",
    priority: 0.8,
    changefreq: "monthly",
  },
  {
    path: "/recrutement",
    title: "Recrutement - Rejoignez l'équipe Rosi Trattoria Brive",
    description:
      "Rosi Trattoria recrute ! Rejoignez notre équipe passionnée dans notre pizzeria italienne à Brive-la-Gaillarde. Postes disponibles en cuisine et service.",
    keywords:
      "emploi pizzeria Brive, recrutement restaurant italien, job cuisine service",
    priority: 0.7,
    changefreq: "weekly",
  },
  {
    path: "/contact",
    title: "Contact & Réservation - Rosi Trattoria Brive-la-Gaillarde",
    description:
      "Contactez Rosi Trattoria pour vos réservations. Adresse, horaires, téléphone. Pizzeria italienne au 11 Prom. des Tilleuls, Brive-la-Gaillarde.",
    keywords:
      "contact pizzeria Brive, réservation restaurant italien, adresse Rosi Trattoria",
    priority: 0.6,
    changefreq: "monthly",
  },
];

// Fonction pour injecter les meta tags SEO (identique)
function injectSEOMeta(html, route) {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const head = document.head;

  // Supprimer les meta tags existants pour éviter les doublons
  const existingMetas = head.querySelectorAll(
    'meta[name="description"], meta[name="keywords"], title'
  );
  existingMetas.forEach((meta) => meta.remove());

  // Créer et injecter les nouveaux meta tags
  const title = document.createElement("title");
  title.textContent = route.title;
  head.insertBefore(title, head.firstChild);

  const metaDescription = document.createElement("meta");
  metaDescription.setAttribute("name", "description");
  metaDescription.setAttribute("content", route.description);
  head.appendChild(metaDescription);

  const metaKeywords = document.createElement("meta");
  metaKeywords.setAttribute("name", "keywords");
  metaKeywords.setAttribute("content", route.keywords);
  head.appendChild(metaKeywords);

  // Open Graph tags
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
  ogUrl.setAttribute("content", `${CONFIG.baseUrl}${route.path}`);
  head.appendChild(ogUrl);

  const ogImage = document.createElement("meta");
  ogImage.setAttribute("property", "og:image");
  ogImage.setAttribute("content", `${CONFIG.baseUrl}/images/logo/og-image.jpg`);
  head.appendChild(ogImage);

  // Canonical URL
  const canonical = document.createElement("link");
  canonical.setAttribute("rel", "canonical");
  canonical.setAttribute("href", `${CONFIG.baseUrl}${route.path}`);
  head.appendChild(canonical);

  // Schema.org pour la page d'accueil
  if (route.path === "/") {
    const script = document.createElement("script");
    script.setAttribute("type", "application/ld+json");
    script.textContent = JSON.stringify({
      "@context": "http://schema.org",
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
      hasMenu: `${CONFIG.baseUrl}/carte`,
      acceptsReservations: true,
    });
    head.appendChild(script);
  }

  return dom.serialize();
}

// Fonction pour générer le sitemap
function generateSitemap(routes) {
  const urls = routes
    .map(
      (route) => `
  <url>
    <loc>${CONFIG.baseUrl}${route.path === "/" ? "" : route.path}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

// Fonction pour générer robots.txt
function generateRobotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: ${CONFIG.baseUrl}/sitemap.xml

# Optimisations pour les moteurs de recherche
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: facebookexternalhit
Allow: /`;
}

// Fonction pour générer .htaccess pour IONOS
function generateHtaccess() {
  return `# Configuration pour SPA React sur IONOS
RewriteEngine On

# Gestion du routage côté client
RewriteBase /
RewriteRule ^index\\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Optimisations de cache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType font/woff "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

# Compression GZIP
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Sécurité
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>`;
}

// Fonction principale de prerender pour IONOS
async function prerenderForIONOS() {
  console.log("🚀 Démarrage du prerender optimisé pour IONOS...");

  try {
    // Lire le fichier HTML de base
    const indexPath = path.join(CONFIG.distDir, "index.html");
    const baseHtml = fs.readFileSync(indexPath, "utf8");

    // Générer les pages avec SEO injecté
    for (const route of routes) {
      console.log(`📄 Génération de la page: ${route.path}`);

      // Injecter les meta tags SEO
      const optimizedHtml = injectSEOMeta(baseHtml, route);

      // Créer le répertoire si nécessaire
      if (route.path !== "/") {
        const routeDir = path.join(CONFIG.distDir, route.path);
        if (!fs.existsSync(routeDir)) {
          fs.mkdirSync(routeDir, { recursive: true });
        }

        // Écrire le fichier HTML
        const filePath = path.join(routeDir, "index.html");
        fs.writeFileSync(filePath, optimizedHtml, "utf8");
        console.log(`✅ Page générée: ${filePath}`);
      } else {
        // Remplacer l'index.html de base
        fs.writeFileSync(indexPath, optimizedHtml, "utf8");
        console.log(`✅ Page d'accueil optimisée: ${indexPath}`);
      }
    }

    // Générer le sitemap
    const sitemap = generateSitemap(routes);
    fs.writeFileSync(path.join(CONFIG.distDir, "sitemap.xml"), sitemap, "utf8");
    console.log("🗺️ Sitemap généré");

    // Générer robots.txt
    const robotsTxt = generateRobotsTxt();
    fs.writeFileSync(
      path.join(CONFIG.distDir, "robots.txt"),
      robotsTxt,
      "utf8"
    );
    console.log("🤖 Robots.txt généré");

    // Générer .htaccess pour IONOS
    const htaccess = generateHtaccess();
    fs.writeFileSync(path.join(CONFIG.distDir, ".htaccess"), htaccess, "utf8");
    console.log("⚙️ .htaccess généré pour IONOS");

    console.log("🎉 Prerender IONOS terminé avec succès !");
    console.log(`📊 ${routes.length} pages générées avec succès`);
    console.log(`📂 Tous les fichiers sont prêts dans: ${CONFIG.distDir}`);
    console.log(
      "🚀 Vous pouvez maintenant uploader le contenu du dossier dist/ sur IONOS"
    );
  } catch (error) {
    console.error("❌ Erreur lors du prerender:", error.message);

    // Génération des fichiers SEO de base en cas d'erreur
    console.log("⚠️ Continuité avec génération SEO basique...");

    try {
      const sitemap = generateSitemap(routes);
      fs.writeFileSync(
        path.join(CONFIG.distDir, "sitemap.xml"),
        sitemap,
        "utf8"
      );

      const robotsTxt = generateRobotsTxt();
      fs.writeFileSync(
        path.join(CONFIG.distDir, "robots.txt"),
        robotsTxt,
        "utf8"
      );

      const htaccess = generateHtaccess();
      fs.writeFileSync(
        path.join(CONFIG.distDir, ".htaccess"),
        htaccess,
        "utf8"
      );

      console.log("✅ Fichiers SEO basiques générés");
    } catch (fallbackError) {
      console.error("❌ Erreur critique:", fallbackError.message);
    }
  }
}

// Exporter la fonction pour réutilisation
export { prerenderForIONOS as prerender };

// Exécuter le prerender si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  prerenderForIONOS().catch((error) => {
    console.error("❌ Erreur fatale:", error);
    process.exit(1);
  });
}
