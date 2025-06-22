#!/usr/bin/env node

import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { prerender } from "./prerender-ionos.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("🏗️ Démarrage du build pour IONOS...");

async function buildForIONOS() {
  try {
    // 1. Build TypeScript et Vite
    console.log("📦 Compilation TypeScript et build Vite...");
    execSync("tsc -b && vite build", {
      stdio: "inherit",
      cwd: join(__dirname, ".."),
    });

    // 2. Exécuter le pre-rendering pour IONOS
    console.log("🎨 Exécution du pre-rendering pour IONOS...");
    await prerender();

    console.log("✅ Build IONOS terminé avec succès !");
    console.log("📋 Prochaines étapes :");
    console.log("   1. Le domaine rosi-trattoria.com est déjà configuré ✅");
    console.log(
      "   2. Uploadez le contenu du dossier dist/ sur votre hébergement IONOS"
    );
    console.log(
      "   3. Assurez-vous que le fichier .htaccess est bien transféré"
    );
  } catch (error) {
    console.error("❌ Erreur durant le build:", error.message);
    process.exit(1);
  }
}

buildForIONOS();
