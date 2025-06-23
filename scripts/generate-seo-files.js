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
  baseUrl: "https://www.rosi-trattoria.com",
};

// Route type definition (for TypeScript or JSDoc)
const routes = [
  {
    path: "/", // Root path already has trailing slash
    priority: 1.0,
    changefreq: "daily",
    lastmod: new Date().toISOString().split("T")[0], // Dynamic date
  },
  {
    path: "/carte/",
    priority: 0.9,
    changefreq: "weekly",
    lastmod: "2025-06-23", // Static date for less frequent updates
  },
  {
    path: "/nos-valeurs/",
    priority: 0.8,
    changefreq: "monthly",
    lastmod: "2025-06-23",
  },
  {
    path: "/recrutement/",
    priority: 0.7,
    changefreq: "weekly",
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    path: "/contact/",
    priority: 0.6,
    changefreq: "monthly",
    lastmod: "2025-06-23",
  },
];

// Generate sitemap XML with consistent indentation
function generateSitemap() {
  const urls = routes
    .map((route) => {
      return `  <url>
    <loc>${CONFIG.baseUrl}${route.path}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

// Generate robots.txt
function generateRobotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: ${CONFIG.baseUrl}/sitemap.xml

# Disallow non-critical paths (optional)
Disallow: /dist/
Disallow: /assets/`;
}

// Main function
async function generateSeoFiles() {
  console.log("🔧 Generating SEO files...");

  try {
    // Generate sitemap
    const sitemap = generateSitemap();
    await writeFile(path.join(CONFIG.distDir, "sitemap.xml"), sitemap, "utf8");
    console.log("🗺️  Sitemap generated: sitemap.xml");

    // Generate robots.txt
    const robotsTxt = generateRobotsTxt();
    await writeFile(path.join(CONFIG.distDir, "robots.txt"), robotsTxt, "utf8");
    console.log("🤖 Robots.txt generated");

    console.log("✅ SEO files generated successfully!");
  } catch (error) {
    console.error("❌ Error generating SEO files:", error);
    process.exit(1);
  }
}

generateSeoFiles();
