import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes à pre-render
const routes = ["/", "/carte", "/nos-valeurs", "/recrutement", "/contact"];

// Configuration
const baseUrl = "http://localhost:4173"; // URL du preview Vite
const distDir = path.resolve(__dirname, "../dist");

async function prerender() {
  console.log("🚀 Démarrage du pre-rendering...");

  const browser = await puppeteer.launch({ headless: true });

  for (const route of routes) {
    try {
      console.log(`📄 Pre-rendering: ${route}`);

      const page = await browser.newPage();

      // Attendre que la page soit complètement chargée
      await page.goto(`${baseUrl}${route}`, {
        waitUntil: "networkidle0",
        timeout: 10000,
      });

      // Attendre que React soit monté et React Helmet appliqué
      await page.waitForSelector("body", { timeout: 5000 });
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Récupérer le HTML complet
      const html = await page.content();

      // Créer le répertoire si nécessaire
      const routePath = route === "/" ? "/index" : route;
      const dirPath = path.join(distDir, routePath);

      if (route !== "/") {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      const filePath =
        route === "/"
          ? path.join(distDir, "index.html")
          : path.join(dirPath, "index.html");

      // Écrire le fichier HTML pre-rendu
      fs.writeFileSync(filePath, html);

      console.log(`✅ Pre-rendu sauvé: ${filePath}`);

      await page.close();
    } catch (error) {
      console.error(`❌ Erreur pour ${route}:`, error.message);
    }
  }

  await browser.close();
  console.log("🎉 Pre-rendering terminé !");
}

prerender().catch(console.error);
