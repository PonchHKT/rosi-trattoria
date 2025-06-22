import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

// Configuration corrigée
const CONFIG = {
  baseUrl: "http://localhost:4173",
  distDir: path.join(__dirname, "../dist"),
  timeout: 30000,
  waitTime: 2000,
  retries: 2,
  maxConcurrency: 2, // Réduire pour Vercel
};

// Routes avec métadonnées pour le SEO
const routes = [
  {
    path: "/",
    priority: 1.0,
    changefreq: "daily",
  },
  {
    path: "/carte",
    priority: 0.9,
    changefreq: "weekly",
  },
  {
    path: "/nos-valeurs",
    priority: 0.8,
    changefreq: "monthly",
  },
  {
    path: "/recrutement",
    priority: 0.7,
    changefreq: "weekly",
  },
  {
    path: "/contact",
    priority: 0.6,
    changefreq: "monthly",
  },
];

// Optimisations SEO pour le HTML
function optimizeHtml(html, route) {
  let optimizedHtml = html;

  // Supprimer les scripts de développement et les sourcemaps
  optimizedHtml = optimizedHtml.replace(
    /<script[^>]*src="[^"]*\.map"[^>]*><\/script>/gi,
    ""
  );

  // Ajouter des balises meta pour le cache
  const cacheMetaTags = `
    <meta http-equiv="Cache-Control" content="public, max-age=31536000">
    <meta name="robots" content="index, follow">
    <meta name="googlebot" content="index, follow">
  `;

  optimizedHtml = optimizedHtml.replace(/<\/head>/i, `${cacheMetaTags}</head>`);

  // Minifier le HTML (suppression des espaces superflus)
  optimizedHtml = optimizedHtml
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .trim();

  // Ajouter des données structurées pour le SEO si c'est la page d'accueil
  if (route.path === "/") {
    const structuredData = `
      <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "Restaurant",
        "name": "Rosi Trattoria",
        "url": "https://rosi-trattoria.vercel.app",
        "description": "Restaurant italien authentique proposant des spécialités traditionnelles dans une ambiance chaleureuse",
        "servesCuisine": "Italian",
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "France"
        },
        "sameAs": []
      }
      </script>
    `;
    optimizedHtml = optimizedHtml.replace(
      /<\/body>/i,
      `${structuredData}</body>`
    );
  }

  return optimizedHtml;
}

// Fonction pour vérifier si le serveur est disponible
async function waitForServer(url, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        console.log("✅ Serveur disponible");
        return true;
      }
    } catch (error) {
      console.log(`⏳ Attente du serveur (${i + 1}/${maxAttempts})...`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw new Error("Le serveur n'est pas disponible après 30 secondes");
}

// Fonction pour traiter une route avec retry
async function processRoute(browser, route, attempt = 1) {
  let page = null;

  try {
    console.log(`📄 Pre-rendering: ${route.path} (tentative ${attempt})`);

    page = await browser.newPage();

    // Configuration de la viewport pour le SEO mobile
    await page.setViewport({ width: 1200, height: 800 });

    // Aller à la page avec des options optimisées
    await page.goto(`${CONFIG.baseUrl}${route.path}`, {
      waitUntil: "networkidle0", // Attendre que le réseau soit inactif
      timeout: CONFIG.timeout,
    });

    // Attendre que React soit monté
    await page.waitForSelector("body", { timeout: 10000 });

    // Attendre que les éléments SEO soient chargés (avec fallback)
    try {
      await page.waitForFunction(
        () => {
          const meta = document.head.querySelector('meta[name="description"]');
          return (
            meta &&
            meta.getAttribute("content") &&
            meta.getAttribute("content").length > 0
          );
        },
        { timeout: 8000 }
      );
    } catch (e) {
      console.log(
        `⚠️  Meta description non trouvée pour ${route.path}, continuation...`
      );
    }

    // Temps d'attente supplémentaire pour s'assurer que tout est chargé
    await new Promise((resolve) => setTimeout(resolve, CONFIG.waitTime));

    // Récupérer le HTML complet
    const html = await page.content();

    // Optimiser le HTML pour le SEO
    const optimizedHtml = optimizeHtml(html, route);

    // Créer le chemin de fichier
    const routePath = route.path === "/" ? "/index" : route.path;
    const dirPath = path.join(CONFIG.distDir, routePath);
    const filePath =
      route.path === "/"
        ? path.join(CONFIG.distDir, "index.html")
        : path.join(dirPath, "index.html");

    // Créer le répertoire si nécessaire
    if (route.path !== "/") {
      await mkdir(dirPath, { recursive: true });
    }

    // Écrire le fichier HTML pre-rendu
    await writeFile(filePath, optimizedHtml, "utf8");

    console.log(`✅ Pre-rendu sauvé: ${filePath}`);

    // Fermer la page proprement
    if (page && !page.isClosed()) {
      await page.close();
    }

    return { success: true, route: route.path, filePath };
  } catch (error) {
    console.error(
      `❌ Erreur pour ${route.path} (tentative ${attempt}):`,
      error.message
    );

    // Fermer la page en cas d'erreur
    if (page && !page.isClosed()) {
      try {
        await page.close();
      } catch (closeError) {
        console.log(
          `⚠️  Erreur lors de la fermeture de page: ${closeError.message}`
        );
      }
    }

    if (attempt < CONFIG.retries) {
      console.log(`🔄 Nouvelle tentative pour ${route.path}...`);
      // Attendre un peu avant de réessayer
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return processRoute(browser, route, attempt + 1);
    }

    return { success: false, route: route.path, error: error.message };
  }
}

// Fonction pour traiter les routes par lot
async function processBatch(browser, routeBatch) {
  const promises = routeBatch.map((route) => processRoute(browser, route));
  return Promise.all(promises);
}

// Générer un sitemap XML
function generateSitemap(results) {
  const baseUrl = "https://rosi-trattoria.vercel.app";

  const urls = results
    .filter((result) => result.success)
    .map((result) => {
      const route = routes.find((r) => r.path === result.route);
      return `
  <url>
    <loc>${baseUrl}${route.path === "/" ? "" : route.path}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
    })
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return sitemap;
}

// Générer un robots.txt
function generateRobotsTxt() {
  const baseUrl = "https://rosi-trattoria.vercel.app";

  return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml

# Allow all search engines to crawl
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /`;
}

// Fonction principale
async function prerender() {
  console.log("🚀 Démarrage du pre-rendering optimisé...");

  const startTime = Date.now();

  // Vérifier que le serveur est disponible
  try {
    await waitForServer(CONFIG.baseUrl);
  } catch (error) {
    console.error("❌ Erreur:", error.message);
    process.exit(1);
  }

  // Lancer Puppeteer avec des options optimisées pour Vercel
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--single-process",
      "--no-zygote",
      "--disable-extensions",
      "--disable-background-timer-throttling",
      "--disable-backgrounding-occluded-windows",
      "--disable-renderer-backgrounding",
      "--memory-pressure-off",
      "--max_old_space_size=4096",
    ],
    executablePath:
      process.env.PUPPETEER_EXECUTABLE_PATH ||
      process.env.GOOGLE_CHROME_BIN ||
      undefined,
  });

  const results = [];

  try {
    // Traiter les routes par lots pour éviter la surcharge
    for (let i = 0; i < routes.length; i += CONFIG.maxConcurrency) {
      const batch = routes.slice(i, i + CONFIG.maxConcurrency);
      console.log(
        `📦 Processing batch ${Math.floor(i / CONFIG.maxConcurrency) + 1}...`
      );

      const batchResults = await processBatch(browser, batch);
      results.push(...batchResults);
    }

    // Générer le sitemap
    const sitemap = generateSitemap(results);
    await writeFile(path.join(CONFIG.distDir, "sitemap.xml"), sitemap, "utf8");
    console.log("🗺️  Sitemap généré: sitemap.xml");

    // Générer robots.txt
    const robotsTxt = generateRobotsTxt();
    await writeFile(path.join(CONFIG.distDir, "robots.txt"), robotsTxt, "utf8");
    console.log("🤖 Robots.txt généré");

    // Statistiques finales
    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log("\n📊 Statistiques:");
    console.log(`   ✅ Réussis: ${successful}`);
    console.log(`   ❌ Échecs: ${failed}`);
    console.log(`   ⏱️  Durée: ${duration}s`);
    console.log("\n🎉 Pre-rendering terminé !");

    // Afficher les erreurs s'il y en a
    const errors = results.filter((r) => !r.success);
    if (errors.length > 0) {
      console.log("\n❌ Échecs détaillés:");
      errors.forEach((error) => {
        console.log(`   ${error.route}: ${error.error}`);
      });
    }
  } finally {
    await browser.close();
  }
}

// Gestion des erreurs globales
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Erreur non gérée:", reason);
  process.exit(1);
});

// Exporter la fonction pour l'utiliser dans d'autres scripts
export { prerender };

// Exécuter seulement si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  prerender().catch((error) => {
    console.error("❌ Erreur fatale:", error);
    process.exit(1);
  });
}
