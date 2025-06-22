import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./styles/page404.scss";

declare const gtag: (...args: any[]) => void;

const Page404: React.FC = () => {
  // Analytics pour tracker les 404
  useEffect(() => {
    // Exemple avec Google Analytics
    if (typeof gtag !== "undefined") {
      gtag("event", "page_view", {
        page_title: "404 - Page non trouvée",
        page_location: window.location.href,
        custom_map: { custom_parameter_1: "error_404" },
      });
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>404 - Page non trouvée | Rosi-Trattoria</title>
        <meta
          name="description"
          content="La page que vous recherchez n'existe pas. Retournez à l'accueil ou explorez nos autres pages."
        />
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:title" content="404 - Page non trouvée" />
        <meta
          property="og:description"
          content="Cette page n'existe pas ou n'est plus disponible."
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`${window.location.origin}/404`} />
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
