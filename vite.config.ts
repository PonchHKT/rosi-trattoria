import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/', // IMPORTANT : la base doit être '/' pour que les chemins soient relatifs à la racine du domaine
  plugins: [react()],
  
  // Configuration pour le développement
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json']
  },
  
  // Configuration du serveur de développement
  server: {
    fs: {
      allow: ['..']
    },
    // Force le rechargement des modules
    hmr: {
      overlay: true
    }
  },
  
  // Optimisation des dépendances
  optimizeDeps: {
    include: ['pdfjs-dist'],
    // Force la re-optimisation au redémarrage
    force: true
  },
  
  // Configuration de build
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          pdfjs: ['pdfjs-dist']
        }
      }
    },
    // Nettoyer le dossier de sortie avant chaque build
    emptyOutDir: true
  },
  
  assetsInclude: ['**/*.worker.js', '**/*.worker.min.js']
})