import "./App.css";
import Biographie1 from "./components/Acceuil/Biographie1/biographie1";
import Biographie2 from "./components/Acceuil/Biographie2/biographie2";
import Footer from "./components/Acceuil/Footer/footer";
import HomeSectionVideo from "./components/Acceuil/HomeVideoSection/homevideosection";
import Navbar from "./components/Acceuil/Navbar/navbar";
import VideoPlayer from "./components/Acceuil/VideoPlayer/videoplayer";
import { Routes, Route, useLocation } from "react-router-dom";
import NosValeurs from "./pages/NosValeurs";
import Carte from "./pages/Carte";
import Recrutement from "./pages/Recrutement";
import Contact from "./pages/Contact";
import Page404 from "./pages/Page404";
import { useEffect, useState } from "react";
import SwiperGallery from "./components/Acceuil/SwiperGallery/swipergallery";
import ReviewWidget from "./components/Acceuil/ReviewWidget/reviewwidget";
import { Helmet } from "react-helmet-async";
import React from "react";
import ReactGA from "react-ga4";
import CookieConsent from "react-cookie-consent";
import "./index.css";

// Vos composants SEO restent identiques...
const HomePageSEO = () => (
  <Helmet>
    <title>Rosi Trattoria | Pizzas Bio & Italien Authentique – Brive</title>
    <meta
      name="description"
      content="Rosi Trattoria est une pizzeria italienne à Brive-la-Gaillarde. Pizzas napolitaines bio, locales, faites maison au feu de bois. Produits frais, ambiance chaleureuse."
    />
    <meta name="robots" content="index, follow" />
    <meta
      property="og:title"
      content="Rosi Trattoria – Pizzeria Italienne Bio & Fait Maison à Brive"
    />
    <meta
      property="og:description"
      content="Pizzas napolitaines faites maison, produits bio et locaux. Rosi Trattoria à Brive-la-Gaillarde vous invite à savourer l'Italie authentique."
    />
    <meta
      property="og:image"
      content="https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/meta-rosi.png"
    />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.rosi-trattoria.com/" />
    <meta property="og:site_name" content="Rosi Trattoria" />
    <meta property="og:locale" content="fr_FR" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta
      name="twitter:title"
      content="Rosi Trattoria – Pizzeria Bio & Fait Maison à Brive"
    />
    <meta
      name="twitter:description"
      content="Découvrez Rosi Trattoria : pizzas artisanales napolitaines, bio, locales et faites maison à Brive-la-Gaillarde."
    />
    <meta
      name="twitter:image"
      content="https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/meta-rosi.png"
    />
    <link rel="canonical" href="https://www.rosi-trattoria.com/" />
    <link
      rel="alternate"
      hrefLang="fr"
      href="https://www.rosi-trattoria.com/"
    />
    <link
      rel="alternate"
      hrefLang="fr-FR"
      href="https://www.rosi-trattoria.com/"
    />
    <link
      rel="alternate"
      hrefLang="x-default"
      href="https://www.rosi-trattoria.com/"
    />
    <meta name="author" content="Rosi Trattoria" />
    <meta name="geo.region" content="FR-19" />
    <meta name="geo.placename" content="Brive-la-Gaillarde" />
    <meta name="geo.position" content="45.1632151;1.532797" />
    <meta name="ICBM" content="45.1632151, 1.532797" />
  </Helmet>
);

// Configuration Google Analytics
const GA_MEASUREMENT_ID = "G-ZTDV0576N7";
const COOKIE_CONSENT_KEY = "rosi-trattoria-cookie-consent";
const COOKIE_PREFERENCES_KEY = "rosi-trattoria-cookie-preferences";

// Types pour les préférences de cookies
interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  performance: boolean;
  marketing: boolean;
}

// Props pour le composant Modal
interface CookieSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  preferences: CookiePreferences;
  setPreferences: React.Dispatch<React.SetStateAction<CookiePreferences>>;
}

// Composant Modal pour les paramètres de cookies
const CookieSettingsModal: React.FC<CookieSettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  preferences,
  setPreferences,
}) => {
  if (!isOpen) return null;

  const handleTogglePreference = (key: keyof CookiePreferences) => {
    setPreferences((prev: CookiePreferences) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="cookie-settings-modal">
      <div className="cookie-settings-content">
        <h2 className="cookie-settings-title">🍪 Paramètres des Cookies</h2>

        <div className="cookie-category">
          <h3>
            Cookies Essentiels
            <label className="cookie-toggle">
              <input type="checkbox" checked={true} disabled />
              <span className="cookie-slider"></span>
            </label>
          </h3>
          <p>
            Ces cookies sont nécessaires au bon fonctionnement du site. Ils ne
            peuvent pas être désactivés.
          </p>
        </div>

        <div className="cookie-category">
          <h3>
            Cookies Analytiques
            <label className="cookie-toggle">
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={() => handleTogglePreference("analytics")}
              />
              <span className="cookie-slider"></span>
            </label>
          </h3>
          <p>
            Ces cookies nous aident à comprendre comment vous utilisez notre
            site pour l'améliorer.
          </p>
        </div>

        <div className="cookie-category">
          <h3>
            Cookies de Performance
            <label className="cookie-toggle">
              <input
                type="checkbox"
                checked={preferences.performance}
                onChange={() => handleTogglePreference("performance")}
              />
              <span className="cookie-slider"></span>
            </label>
          </h3>
          <p>
            Ces cookies nous permettent d'optimiser les performances et la
            rapidité du site.
          </p>
        </div>

        <div className="cookie-category">
          <h3>
            Cookies Marketing
            <label className="cookie-toggle">
              <input
                type="checkbox"
                checked={preferences.marketing}
                onChange={() => handleTogglePreference("marketing")}
              />
              <span className="cookie-slider"></span>
            </label>
          </h3>
          <p>
            Ces cookies nous aident à vous proposer du contenu publicitaire
            pertinent.
          </p>
        </div>

        <div className="cookie-settings-buttons">
          <button className="cookie-save-button" onClick={onSave}>
            Sauvegarder mes préférences
          </button>
          <button className="cookie-cancel-button" onClick={onClose}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

function App(): React.JSX.Element {
  const location = useLocation();
  const [cookiesAccepted, setCookiesAccepted] = useState<boolean | null>(null);
  const [showCookieBanner, setShowCookieBanner] = useState<boolean>(false);
  const [showCookieSettings, setShowCookieSettings] = useState<boolean>(false);
  const [cookiePreferences, setCookiePreferences] = useState<CookiePreferences>(
    {
      essential: true, // toujours true
      analytics: false,
      performance: false,
      marketing: false,
    }
  );

  // Vérification du consentement au chargement
  useEffect(() => {
    const cookieConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);

    if (savedPreferences) {
      setCookiePreferences(JSON.parse(savedPreferences) as CookiePreferences);
    }

    if (cookieConsent === null) {
      // Aucun choix fait, afficher la bannière
      setShowCookieBanner(true);
      setCookiesAccepted(null);
    } else if (cookieConsent === "true") {
      setCookiesAccepted(true);
      setShowCookieBanner(false);
      initializeGoogleAnalytics();
    } else {
      setCookiesAccepted(false);
      setShowCookieBanner(false);
    }
  }, []);

  // Fonction d'initialisation Google Analytics
  const initializeGoogleAnalytics = () => {
    if (!ReactGA.isInitialized && cookiePreferences.analytics) {
      ReactGA.initialize(GA_MEASUREMENT_ID, {
        gtagOptions: {
          anonymize_ip: true,
          allow_google_signals: false,
        },
      });
    }
  };

  // Gestion du scroll et tracking des pages
  useEffect(() => {
    // Scroll vers le haut
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Forcer après le rendu des composants
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto" as ScrollBehavior,
      });

      const appElement = document.querySelector(".App") as HTMLElement;
      if (appElement) {
        appElement.scrollTop = 0;
      }
    }, 100);

    // Google Analytics - Tracking des changements de page
    if (
      cookiesAccepted === true &&
      ReactGA.isInitialized &&
      cookiePreferences.analytics
    ) {
      ReactGA.send({
        hitType: "pageview",
        page: location.pathname,
        title: document.title,
      });
    }

    return () => clearTimeout(timer);
  }, [location.pathname, cookiesAccepted, cookiePreferences.analytics]);

  // Fonction d'acceptation de tous les cookies
  const handleAcceptAllCookies = () => {
    const allAcceptedPreferences: CookiePreferences = {
      essential: true,
      analytics: true,
      performance: true,
      marketing: true,
    };

    setCookiesAccepted(true);
    setShowCookieBanner(false);
    setCookiePreferences(allAcceptedPreferences);
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    localStorage.setItem(
      COOKIE_PREFERENCES_KEY,
      JSON.stringify(allAcceptedPreferences)
    );

    // Initialiser Google Analytics
    initializeGoogleAnalytics();

    // Tracker la page actuelle
    setTimeout(() => {
      if (ReactGA.isInitialized) {
        ReactGA.send({
          hitType: "pageview",
          page: location.pathname,
          title: document.title,
        });
      }
    }, 100);
  };

  // Fonction d'ouverture des paramètres
  const handleOpenSettings = () => {
    setShowCookieSettings(true);
  };

  // Fonction de sauvegarde des préférences
  const handleSavePreferences = () => {
    setCookiesAccepted(true);
    setShowCookieBanner(false);
    setShowCookieSettings(false);
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    localStorage.setItem(
      COOKIE_PREFERENCES_KEY,
      JSON.stringify(cookiePreferences)
    );

    // Initialiser Google Analytics si activé
    if (cookiePreferences.analytics) {
      initializeGoogleAnalytics();
    } else {
      // Nettoyer les cookies GA si désactivés
      cleanupGoogleAnalyticsCookies();
    }
  };

  // Fonction de nettoyage des cookies Google Analytics
  const cleanupGoogleAnalyticsCookies = () => {
    document.cookie = "_ga=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "_ga_" +
      GA_MEASUREMENT_ID.slice(2) +
      "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "_gid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HomePageSEO />
              <HomeSectionVideo />
              <Biographie1 />
              <VideoPlayer />
              <Biographie2 />
              <SwiperGallery />
              <ReviewWidget />
            </>
          }
        />
        <Route
          path="/nos-valeurs"
          element={
            <>
              <NosValeurs />
            </>
          }
        />
        <Route
          path="/carte"
          element={
            <>
              <Carte />
            </>
          }
        />
        <Route
          path="/recrutement"
          element={
            <>
              <Recrutement />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <Contact />
            </>
          }
        />
        <Route path="*" element={<Page404 />} />
      </Routes>
      <Footer />

      {/* Bannière de consentement aux cookies */}
      {showCookieBanner && (
        <CookieConsent
          location="bottom"
          buttonText="ACCEPTER"
          declineButtonText="Paramètres"
          enableDeclineButton
          onAccept={handleAcceptAllCookies}
          onDecline={handleOpenSettings}
          cookieName={COOKIE_CONSENT_KEY}
          expires={365}
          sameSite="strict"
          buttonClasses="cookie-accept-button"
          declineButtonClasses="cookie-decline-button"
          buttonWrapperClasses="cookie-buttons-wrapper"
          flipButtons={true} // Inverse l'ordre des boutons : Accepter à droite
          style={{
            background: "rgba(0, 0, 0, 0.95)",
            color: "white",
            fontSize: "14px",
            padding: "20px",
          }}
          buttonStyle={{
            background: "#28a745",
            color: "white",
            fontSize: "16px",
            borderRadius: "8px",
            border: "none",
            padding: "12px 24px",
            cursor: "pointer",
            fontWeight: "600",
          }}
          declineButtonStyle={{
            background: "linear-gradient(45deg, #75b9f9, rgb(236, 0, 140))",
            color: "white",
            fontSize: "14px",
            borderRadius: "8px",
            border: "none",
            padding: "10px 20px",
            cursor: "pointer",
            marginLeft: "10px",
          }}
        >
          <div className="cookie-message-wrapper">
            <div className="cookie-content-section">
              <div className="cookie-title">
                🍕 Une meilleure expérience vous attend !
              </div>
              <p className="cookie-description">
                Nous utilisons des cookies, notamment avec Google Analytics,
                pour améliorer votre expérience sur notre site.
              </p>
            </div>
          </div>
        </CookieConsent>
      )}

      {/* Modal des paramètres de cookies */}
      <CookieSettingsModal
        isOpen={showCookieSettings}
        onClose={() => setShowCookieSettings(false)}
        onSave={handleSavePreferences}
        preferences={cookiePreferences}
        setPreferences={setCookiePreferences}
      />
    </div>
  );
}

export default App;
