#!/usr/bin/env node

import { spawn, execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { prerender } from "./prerender.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("🏗️  Démarrage du build complet...");

// Fonction pour attendre qu'un processus soit disponible
function waitForProcess(process, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Timeout: le processus n'a pas démarré à temps"));
    }, timeout);

    process.stdout.on("data", (data) => {
      const output = data.toString();
      console.log("📟", output.trim());

      // Vérifier si le serveur est prêt
      if (
        output.includes("Local:") ||
        output.includes("http://localhost:4173")
      ) {
        clearTimeout(timer);
        console.log("✅ Serveur de preview prêt !");
        resolve();
      }
    });

    process.stderr.on("data", (data) => {
      console.error("🔴", data.toString().trim());
    });

    process.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
  });
}

async function buildAndPrerender() {
  let serverProcess = null;

  try {
    // 1. Build TypeScript et Vite
    console.log("📦 Compilation TypeScript et build Vite...");
    execSync("tsc -b && vite build", {
      stdio: "inherit",
      cwd: join(__dirname, ".."),
    });

    // 2. Démarrer le serveur de preview en arrière-plan
    console.log("🖥️  Démarrage du serveur de preview...");
    serverProcess = spawn("npm", ["run", "preview"], {
      cwd: join(__dirname, ".."),
      stdio: ["pipe", "pipe", "pipe"],
      shell: true,
    });

    // Attendre que le serveur soit prêt
    await waitForProcess(serverProcess);

    // Attendre un peu plus pour être sûr
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // 3. Exécuter le pre-rendering
    console.log("🎨 Exécution du pre-rendering...");
    await prerender();

    console.log("✅ Build complet terminé avec succès !");
  } catch (error) {
    console.error("❌ Erreur durant le build:", error.message);
    process.exit(1);
  } finally {
    // Nettoyer le processus serveur
    if (serverProcess) {
      console.log("🧹 Nettoyage du serveur...");
      serverProcess.kill("SIGTERM");

      // Forcer l'arrêt si nécessaire
      setTimeout(() => {
        if (!serverProcess.killed) {
          serverProcess.kill("SIGKILL");
        }
      }, 2000);
    }
  }
}

buildAndPrerender();
