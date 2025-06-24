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

const NosValeursSEO = () => (
  <Helmet>
    <title>Nos Valeurs | Cuisine Italienne Bio – Rosi Trattoria Corrèze</title>
    <meta
      name="description"
      content="Découvrez les valeurs de Rosi Trattoria à Brive-la-Gaillarde : authenticité italienne, pâte au levain naturel, produits bio et locaux, et savoir-faire artisanal."
    />
    <meta name="robots" content="index, follow" />
    <meta
      property="og:title"
      content="Rosi Trattoria – Nos Valeurs : Authenticité & Qualité à Brive"
    />
    <meta
      property="og:description"
      content="Rosi Trattoria s'engage pour une cuisine italienne authentique avec pâte au levain naturel et produits bio locaux à Brive-la-Gaillarde."
    />
    <meta
      property="og:image"
      content="https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/meta-rosi.png"
    />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:type" content="website" />
    <meta
      property="og:url"
      content="https://www.rosi-trattoria.com/nos-valeurs"
    />
    <meta property="og:site_name" content="Rosi Trattoria" />
    <meta property="og:locale" content="fr_FR" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta
      name="twitter:title"
      content="Rosi Trattoria – Nos Valeurs : Authenticité & Qualité à Brive"
    />
    <meta
      name="twitter:description"
      content="Rosi Trattoria s'engage pour une cuisine italienne authentique avec pâte au levain naturel et produits bio locaux à Brive-la-Gaillarde."
    />
    <meta
      name="twitter:image"
      content="https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/meta-rosi.png"
    />
    <link rel="canonical" href="https://www.rosi-trattoria.com/nos-valeurs" />
    <link
      rel="alternate"
      hrefLang="fr"
      href="https://www.rosi-trattoria.com/nos-valeurs"
    />
    <link
      rel="alternate"
      hrefLang="fr-FR"
      href="https://www.rosi-trattoria.com/nos-valeurs"
    />
    <link
      rel="alternate"
      hrefLang="x-default"
      href="https://www.rosi-trattoria.com/nos-valeurs"
    />
    <meta name="author" content="Rosi Trattoria" />
    <meta name="geo.region" content="FR-19" />
    <meta name="geo.placename" content="Brive-la-Gaillarde" />
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Nos Valeurs - Rosi Trattoria",
        description:
          "Découvrez les valeurs de Rosi Trattoria : authenticité italienne, pâte au levain naturel, produits bio et locaux à Brive-la-Gaillarde.",
        url: "https://www.rosi-trattoria.com/nos-valeurs",
        isPartOf: {
          "@type": "WebSite",
          name: "Rosi Trattoria",
          url: "https://www.rosi-trattoria.com/",
        },
      })}
    </script>
  </Helmet>
);

const CarteSEO = () => (
  <Helmet>
    <title>Menu | Pizzas Napolitaines Bio – Rosi Trattoria Brive</title>
    <meta
      name="description"
      content="Découvrez la carte de Rosi Trattoria à Brive-la-Gaillarde : pizzas napolitaines bio, pâtes fraîches maison et spécialités italiennes authentiques."
    />
    <meta name="robots" content="index, follow" />
    <meta
      property="og:title"
      content="Rosi Trattoria – Carte des Plats Italiens à Brive"
    />
    <meta
      property="og:description"
      content="Explorez notre carte : pizzas napolitaines bio, pâtes fraîches maison et spécialités italiennes à Brive-la-Gaillarde."
    />
    <meta
      property="og:image"
      content="https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/meta-rosi.png"
    />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.rosi-trattoria.com/carte" />
    <meta property="og:site_name" content="Rosi Trattoria" />
    <meta property="og:locale" content="fr_FR" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta
      name="twitter:title"
      content="Rosi Trattoria – Carte des Plats Italiens à Brive"
    />
    <meta
      name="twitter:description"
      content="Explorez notre carte : pizzas napolitaines bio, pâtes fraîches maison et spécialités italiennes à Brive-la-Gaillarde."
    />
    <meta
      name="twitter:image"
      content="https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/meta-rosi.png"
    />
    <link rel="canonical" href="https://www.rosi-trattoria.com/carte" />
    <link
      rel="alternate"
      hrefLang="fr"
      href="https://www.rosi-trattoria.com/carte"
    />
    <link
      rel="alternate"
      hrefLang="fr-FR"
      href="https://www.rosi-trattoria.com/carte"
    />
    <link
      rel="alternate"
      hrefLang="x-default"
      href="https://www.rosi-trattoria.com/carte"
    />
    <meta name="author" content="Rosi Trattoria" />
    <meta name="geo.region" content="FR-19" />
    <meta name="geo.placename" content="Brive-la-Gaillarde" />
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Carte - Rosi Trattoria",
        description:
          "Découvrez la carte de Rosi Trattoria : pizzas napolitaines bio, pâtes fraîches maison et spécialités italiennes à Brive-la-Gaillarde.",
        url: "https://www.rosi-trattoria.com/carte",
        isPartOf: {
          "@type": "WebSite",
          name: "Rosi Trattoria",
          url: "https://www.rosi-trattoria.com/",
        },
      })}
    </script>
  </Helmet>
);

const RecrutementSEO = () => (
  <Helmet>
    <title>Emplois | Rosi Trattoria – Cuisine Italienne en Corrèze</title>
    <meta
      name="description"
      content="Rejoignez l'équipe passionnée de Rosi Trattoria à Brive-la-Gaillarde ! Postes disponibles : chef de cuisine, serveur, pizzaïolo, barman. Envoyez CV et lettre de motivation."
    />
    <meta name="robots" content="index, follow" />
    <meta
      property="og:title"
      content="Rosi Trattoria – Rejoignez Notre Équipe à Brive"
    />
    <meta
      property="og:description"
      content="Passionné de cuisine italienne ? Rejoignez Rosi Trattoria à Brive-la-Gaillarde pour une aventure culinaire authentique. Postes en cuisine et service disponibles."
    />
    <meta
      property="og:image"
      content="https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/meta-rosi.png"
    />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:type" content="website" />
    <meta
      property="og:url"
      content="https://www.rosi-trattoria.com/recrutement"
    />
    <meta property="og:site_name" content="Rosi Trattoria" />
    <meta property="og:locale" content="fr_FR" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta
      name="twitter:title"
      content="Rosi Trattoria – Rejoignez Notre Équipe à Brive"
    />
    <meta
      name="twitter:description"
      content="Passionné de cuisine italienne ? Rejoignez Rosi Trattoria à Brive-la-Gaillarde pour une aventure culinaire authentique. Postes en cuisine et service disponibles."
    />
    <meta
      name="twitter:image"
      content="https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/meta-rosi.png"
    />
    <link rel="canonical" href="https://www.rosi-trattoria.com/recrutement" />
    <link
      rel="alternate"
      hrefLang="fr"
      href="https://www.rosi-trattoria.com/recrutement"
    />
    <link
      rel="alternate"
      hrefLang="fr-FR"
      href="https://www.rosi-trattoria.com/recrutement"
    />
    <link
      rel="alternate"
      hrefLang="x-default"
      href="https://www.rosi-trattoria.com/recrutement"
    />
    <meta name="author" content="Rosi Trattoria" />
    <meta name="geo.region" content="FR-19" />
    <meta name="geo.placename" content="Brive-la-Gaillarde" />
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Recrutement - Rosi Trattoria",
        description:
          "Rejoignez l'équipe de Rosi Trattoria à Brive-la-Gaillarde. Postes disponibles : chef de cuisine, serveur, pizzaïolo, barman.",
        url: "https://www.rosi-trattoria.com/recrutement",
        isPartOf: {
          "@type": "WebSite",
          name: "Rosi Trattoria",
          url: "https://www.rosi-trattoria.com/",
        },
      })}
    </script>
  </Helmet>
);

const ContactSEO = () => (
  <Helmet>
    <title>Contact | Événements & Infos – Rosi Trattoria Brive</title>
    <meta
      name="description"
      content="Contactez Rosi Trattoria à Brive-la-Gaillarde pour réserver une table ou poser vos questions. Restaurant italien bio, local et fait maison."
    />
    <meta name="robots" content="index, follow" />
    <meta
      property="og:title"
      content="Rosi Trattoria – Contactez-Nous à Brive"
    />
    <meta
      property="og:description"
      content="Réservez votre table ou contactez Rosi Trattoria pour une expérience italienne authentique à Brive-la-Gaillarde."
    />
    <meta
      property="og:image"
      content="https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/meta-rosi.png"
    />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.rosi-trattoria.com/contact" />
    <meta property="og:site_name" content="Rosi Trattoria" />
    <meta property="og:locale" content="fr_FR" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta
      name="twitter:title"
      content="Rosi Trattoria – Contactez-Nous à Brive"
    />
    <meta
      name="twitter:description"
      content="Réservez votre table ou contactez Rosi Trattoria pour une expérience italienne authentique à Brive-la-Gaillarde."
    />
    <meta
      name="twitter:image"
      content="https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/meta-rosi.png"
    />
    <link rel="canonical" href="https://www.rosi-trattoria.com/contact" />
    <link
      rel="alternate"
      hrefLang="fr"
      href="https://www.rosi-trattoria.com/contact"
    />
    <link
      rel="alternate"
      hrefLang="fr-FR"
      href="https://www.rosi-trattoria.com/contact"
    />
    <link
      rel="alternate"
      hrefLang="x-default"
      href="https://www.rosi-trattoria.com/contact"
    />
    <meta name="author" content="Rosi Trattoria" />
    <meta name="geo.region" content="FR-19" />
    <meta name="geo.placename" content="Brive-la-Gaillarde" />
    <meta name="geo.position" content="45.1632151;1.532797" />
    <meta name="ICBM" content="45.1632151, 1.532797" />
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Contact - Rosi Trattoria",
        description:
          "Contactez Rosi Trattoria à Brive-la-Gaillarde pour réserver une table ou poser vos questions.",
        url: "https://www.rosi-trattoria.com/contact",
        isPartOf: {
          "@type": "WebSite",
          name: "Rosi Trattoria",
          url: "https://www.rosi-trattoria.com/",
        },
      })}
    </script>
  </Helmet>
);

function App(): React.JSX.Element {
  const location = useLocation();
  const [cookiesAccepted, setCookiesAccepted] = useState<boolean>(false);

  // Initialisation Google Analytics seulement si les cookies sont acceptés
  useEffect(() => {
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (cookieConsent === "true") {
      setCookiesAccepted(true);
      // Initialiser Google Analytics si pas déjà fait
      if (!ReactGA.isInitialized) {
        ReactGA.initialize("YOUR_GA_MEASUREMENT_ID"); // Remplacez par votre ID GA4
      }
    }
  }, []);

  // Gestion du scroll au top + Google Analytics tracking conditionnel
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

      // Au cas où il y aurait un container avec overflow
      const appElement = document.querySelector(".App") as HTMLElement;
      if (appElement) {
        appElement.scrollTop = 0;
      }
    }, 100);

    // Google Analytics - Tracking des changements de page seulement si autorisé
    if (cookiesAccepted && ReactGA.isInitialized) {
      ReactGA.send({
        hitType: "pageview",
        page: location.pathname,
        title: document.title,
      });
    }

    return () => clearTimeout(timer);
  }, [location.pathname, cookiesAccepted]);

  // Fonction appelée quand l'utilisateur accepte les cookies
  const handleAcceptCookies = () => {
    setCookiesAccepted(true);
    localStorage.setItem("cookieConsent", "true");

    // Initialiser Google Analytics
    if (!ReactGA.isInitialized) {
      ReactGA.initialize("YOUR_GA_MEASUREMENT_ID"); // Remplacez par votre ID GA4
    }

    // Tracker la page actuelle
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname,
      title: document.title,
    });
  };

  // Fonction appelée quand l'utilisateur refuse les cookies
  const handleDeclineCookies = () => {
    setCookiesAccepted(false);
    localStorage.setItem("cookieConsent", "false");
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
              <NosValeursSEO />
              <NosValeurs />
            </>
          }
        />
        <Route
          path="/carte"
          element={
            <>
              <CarteSEO />
              <Carte />
            </>
          }
        />
        <Route
          path="/recrutement"
          element={
            <>
              <RecrutementSEO />
              <Recrutement />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <ContactSEO />
              <Contact />
            </>
          }
        />
        <Route path="*" element={<Page404 />} />
      </Routes>
      <Footer />

      <CookieConsent
        location="bottom"
        buttonText="Accepter"
        declineButtonText="Refuser"
        enableDeclineButton
        onAccept={handleAcceptCookies}
        onDecline={handleDeclineCookies}
        buttonWrapperClasses="cookie-buttons-wrapper"
        expires={365}
        cookieName="rosi-trattoria-cookie-consent"
        sameSite="strict"
        buttonClasses="cookie-accept-button"
        declineButtonClasses="cookie-decline-button"
      >
        <div className="cookie-message-wrapper">
          <div className="cookie-content-section">
            <div className="cookie-title">🍕 Gestion des cookies</div>
            <p className="cookie-description">
              Ce site utilise des cookies pour améliorer votre navigation et
              analyser notre audience via Google Analytics. Ces données nous
              permettent d'optimiser nos services et votre expérience
              utilisateur.
            </p>
          </div>
        </div>
      </CookieConsent>
    </div>
  );
}

export default App;
