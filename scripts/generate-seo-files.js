#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const writeFile = promisify(fs.writeFile);

// Configuration
const CONFIG = {
  distDir: path.join(__dirname, "../dist"),
  baseUrl: "https://rosi-trattoria.vercel.app",
};

// Routes
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

// Générer un sitemap XML
function generateSitemap() {
  const urls = routes
    .map((route) => {
      return `
  <url>
    <loc>${CONFIG.baseUrl}${route.path === "/" ? "" : route.path}</loc>
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
  return `User-agent: *
Allow: /

Sitemap: ${CONFIG.baseUrl}/sitemap.xml

# Allow all search engines to crawl
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /`;
}

// Fonction principale
async function generateSeoFiles() {
  console.log("🔧 Génération des fichiers SEO...");

  try {
    // Générer le sitemap
    const sitemap = generateSitemap();
    await writeFile(path.join(CONFIG.distDir, "sitemap.xml"), sitemap, "utf8");
    console.log("🗺️  Sitemap généré: sitemap.xml");

    // Générer robots.txt
    const robotsTxt = generateRobotsTxt();
    await writeFile(path.join(CONFIG.distDir, "robots.txt"), robotsTxt, "utf8");
    console.log("🤖 Robots.txt généré");

    console.log("✅ Fichiers SEO générés avec succès !");
  } catch (error) {
    console.error("❌ Erreur lors de la génération des fichiers SEO:", error);
    process.exit(1);
  }
}

generateSeoFiles();
