#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  distDir: path.join(__dirname, "../dist"),
  baseUrl: "https://www.rosi-trattoria.com",
};

// Mapping des anciennes URLs vers les nouvelles
const REDIRECTS = {
  // Supprimez "index.html": "/"
  "carte.html": "/carte/",
  "nosvaleurs.html": "/nos-valeurs/",
  "recrutement.html": "/recrutement/",
  "contact.html": "/contact/",
};

// Fonction pour générer le HTML de redirection
function generateRedirectHTML(oldFile, newPath) {
  const newUrl = `${CONFIG.baseUrl}${newPath}`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redirection - Rosi Trattoria</title>
    
    <!-- Redirection immédiate -->
    <meta http-equiv="refresh" content="0; url=${newUrl}">
    <link rel="canonical" href="${newUrl}">
    
    <!-- Meta robots pour éviter l'indexation -->
    <meta name="robots" content="noindex, nofollow">
    
    <!-- Script de redirection JavaScript (fallback) -->
    <script>
        window.location.replace("${newUrl}");
    </script>
    
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
            background-color: #f9f9f9;
        }
        .redirect-message {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #d4342c;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        a {
            color: #d4342c;
            text-decoration: none;
            font-weight: bold;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="redirect-message">
        <h1>🍕 Redirection en cours...</h1>
        <div class="spinner"></div>
        <p>Vous êtes automatiquement redirigé vers notre nouvelle page.</p>
        <p>Si la redirection ne fonctionne pas, <a href="${newUrl}">cliquez ici</a>.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        
        <h2>🔄 Page déplacée</h2>
        <p>Cette page a été déplacée vers :</p>
        <p><strong><a href="${newUrl}">${newUrl}</a></strong></p>
        
        <p style="margin-top: 30px; font-size: 14px; color: #666;">
            Rosi Trattoria - Pizzeria Italienne Bio à Brive-la-Gaillarde
        </p>
    </div>
</body>
</html>`;
}

// Fonction principale pour créer les fichiers de redirection
async function createRedirectFiles() {
  console.log("🔧 Création des fichiers de redirection HTML...");

  try {
    // Créer le dossier dist s'il n'existe pas
    if (!fs.existsSync(CONFIG.distDir)) {
      fs.mkdirSync(CONFIG.distDir, { recursive: true });
    }

    // Créer chaque fichier de redirection
    for (const [oldFile, newPath] of Object.entries(REDIRECTS)) {
      const htmlContent = generateRedirectHTML(oldFile, newPath);
      const filePath = path.join(CONFIG.distDir, oldFile);

      fs.writeFileSync(filePath, htmlContent, "utf8");
      console.log(`✅ Fichier de redirection créé: ${oldFile} → ${newPath}`);
    }

    console.log(
      "🎉 Tous les fichiers de redirection ont été créés avec succès !"
    );
    console.log("");
    console.log("📋 Récapitulatif des redirections :");
    for (const [oldFile, newPath] of Object.entries(REDIRECTS)) {
      console.log(
        `   ${CONFIG.baseUrl}/${oldFile} → ${CONFIG.baseUrl}${newPath}`
      );
    }
  } catch (error) {
    console.error(
      "❌ Erreur lors de la création des fichiers de redirection:",
      error
    );
    process.exit(1);
  }
}

// Mettre à jour votre script de prerender principal
function updatePrerenderScript() {
  console.log("");
  console.log(
    "💡 N'oubliez pas d'ajouter ceci à votre script de prerender principal :"
  );
  console.log("");
  console.log(`// Ajouter après la génération des autres fichiers
    // Créer les fichiers de redirection HTML
    for (const [oldFile, newPath] of Object.entries(REDIRECTS)) {
      const htmlContent = generateRedirectHTML(oldFile, newPath);
      const filePath = path.join(CONFIG.distDir, oldFile);
      fs.writeFileSync(filePath, htmlContent, "utf8");
      console.log(\`🔄 Redirection créée: \${oldFile} → \${newPath}\`);
    }`);
}

// Exécuter le script
if (import.meta.url === `file://${process.argv[1]}`) {
  createRedirectFiles().then(() => {
    updatePrerenderScript();
  });
}

// Exporter les fonctions pour utilisation dans d'autres scripts
export { createRedirectFiles, generateRedirectHTML, REDIRECTS };
