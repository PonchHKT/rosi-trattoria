#!/usr/bin/env node

import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("🏗️  Démarrage du build complet...");

try {
  // 1. Build TypeScript et Vite
  console.log("📦 Compilation TypeScript et build Vite...");
  execSync("tsc -b && vite build", {
    stdio: "inherit",
    cwd: join(__dirname, ".."),
  });

  // 2. Démarrer le serveur de preview en arrière-plan
  console.log("🖥️  Démarrage du serveur de preview...");
  const serverProcess = execSync("npm run preview &", {
    stdio: "pipe",
    cwd: join(__dirname, ".."),
  });

  // Attendre que le serveur soit prêt
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // 3. Exécuter le pre-rendering
  console.log("🎨 Exécution du pre-rendering...");
  execSync("node scripts/prerender.js", {
    stdio: "inherit",
    cwd: join(__dirname, ".."),
  });

  console.log("✅ Build complet terminé avec succès !");
} catch (error) {
  console.error("❌ Erreur durant le build:", error.message);
  process.exit(1);
}
