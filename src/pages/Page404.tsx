import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./styles/page404.scss";

declare const gtag: (...args: any[]) => void;

const Page404: React.FC = () => {
  // Analytics pour tracker les 404
  useEffect(() => {
    if (typeof gtag !== "undefined") {
      gtag("event", "page_view", {
        page_title: "404 - Page Non Trouvée",
        page_location: window.location.href,
        custom_map: { custom_parameter_1: "error_404" },
      });
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Rosi Trattoria – Page Non Trouvée</title>
        <meta
          name="description"
          content="Page introuvable sur le site de Rosi Trattoria. Retournez à notre pizzeria italienne bio à Brive-la-Gaillarde."
        />
        <meta name="robots" content="noindex, follow" />
        <meta property="og:title" content="Rosi Trattoria – Page Non Trouvée" />
        <meta
          property="og:description"
          content="La page que vous recherchez n'existe pas. Retournez à l'accueil de Rosi Trattoria à Brive-la-Gaillarde."
        />
        <meta
          property="og:image"
          content="https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/meta-rosi.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="website" />
        {/* Removed problematic og:url for 404 pages */}
        <meta property="og:site_name" content="Rosi Trattoria" />
        <meta property="og:locale" content="fr_FR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Rosi Trattoria – Page Non Trouvée"
        />
        <meta
          name="twitter:description"
          content="La page que vous recherchez n'existe pas. Retournez à l'accueil de Rosi Trattoria à Brive-la-Gaillarde."
        />
        <meta
          name="twitter:image"
          content="https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/meta-rosi.png"
        />
        {/* No canonical URL for 404 pages - this is correct SEO practice */}
      </Helmet>

      <main className="error-container" role="main">
        <article className="error-content">
          <header className="error-visual">
            <div className="error-icon" aria-hidden="true">
              <span>?</span>
            </div>
            <div className="error-number" aria-hidden="true">
              404
            </div>
          </header>

          <section className="error-text">
            <h1 className="error-title">Page non trouvée</h1>
            <p className="error-description">
              La page que vous recherchez n'existe pas ou n'est plus disponible.
            </p>
            <div className="error-suggestions">
              <p>Quelques suggestions :</p>
              <ul>
                <li>Vérifiez l'URL dans la barre d'adresse</li>
                <li>Retournez à la page d'accueil</li>
                <li>Utilisez le bouton retour de votre navigateur</li>
              </ul>
            </div>
          </section>

          <nav className="error-actions" aria-label="Navigation d'erreur">
            <Link
              to="/"
              className="back-home-btn"
              aria-label="Retourner à la page d'accueil"
            >
              Accueil
            </Link>
            <button
              onClick={() => window.history.back()}
              className="back-btn"
              aria-label="Revenir à la page précédente"
            >
              Retour
            </button>
          </nav>

          <section className="popular-links">
            <h2>Pages populaires :</h2>
            <ul>
              <li>
                <Link to="/">Accueil</Link>
              </li>
              <li>
                <Link to="/carte">Carte</Link>
              </li>
              <li>
                <Link to="/nos-valeurs">Nos Valeurs</Link>
              </li>
            </ul>
          </section>

          <footer className="error-footer">
            <div className="error-code">Erreur HTTP 404</div>
          </footer>
        </article>
      </main>
    </>
  );
};

export default Page404;
