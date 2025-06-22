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
import { useEffect } from "react";
import SwiperGallery from "./components/Acceuil/SwiperGallery/swipergallery";
import ReviewWidget from "./components/Acceuil/ReviewWidget/reviewwidget";
import { Helmet } from "react-helmet-async";
import React from "react";

const HomePageSEO = () => (
  <Helmet>
    <title>
      Rosi Trattoria – Pizzeria Italienne Bio, Locale & Fait Maison à Brive
    </title>
    <meta
      name="description"
      content="Rosi Trattoria est une pizzeria italienne à Brive-la-Gaillarde. Pizzas napolitaines bio, locales, faites maison au feu de bois. Produits frais, ambiance chaleureuse."
    />
    <meta
      name="keywords"
      content="pizzeria Brive, pizza napolitaine bio, restaurant italien fait maison, trattoria Brive-la-Gaillarde, pizza locale, pâte levée, cuisine italienne artisanale"
    />

    {/* Open Graph / Réseaux sociaux */}
    <meta
      property="og:title"
      content="Rosi Trattoria – Pizzeria Italienne Bio & Fait Maison à Brive"
    />
    <meta
      property="og:description"
      content="Pizzas napolitaines faites maison, produits bio et locaux. Rosi Trattoria à Brive-la-Gaillarde vous invite à savourer l'Italie authentique."
    />
    <meta property="og:image" content="/images/logo/og-image.jpg" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.rosi-trattoria.com/" />

    {/* Twitter Card */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta
      name="twitter:title"
      content="Rosi Trattoria – Pizzeria Bio & Fait Maison à Brive"
    />
    <meta
      name="twitter:description"
      content="Découvrez Rosi Trattoria : pizzas artisanales napolitaines, bio, locales et faites maison à Brive-la-Gaillarde."
    />
    <meta name="twitter:image" content="/images/logo/og-image.jpg" />

    {/* Schema.org pour SEO local */}
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "http://schema.org",
        "@type": "Restaurant",
        name: "Rosi Trattoria",
        address: {
          "@type": "PostalAddress",
          streetAddress: "11 Prom. des Tilleuls",
          addressLocality: "Brive-la-Gaillarde",
          postalCode: "19100",
          addressCountry: "FR",
        },
        telephone: "+33544314447",
        url: "https://www.rosi-trattoria.com/",
        openingHours: [
          "Tu-Th 12:00-14:00,19:00-21:30",
          "Fr-Sa 12:00-14:00,19:00-22:30",
        ],
        servesCuisine: "Italian",
        description:
          "Rosi Trattoria propose des pizzas napolitaines artisanales, faites maison avec des produits bio et locaux, dans un cadre chaleureux à Brive-la-Gaillarde.",
        priceRange: "€€",
        image: "/images/logo/og-image.jpg",
        hasMenu: "https://www.rosi-trattoria.com/carte",
        acceptsReservations: true,
      })}
    </script>

    {/* Balises canoniques */}
    <link rel="canonical" href="https://www.rosi-trattoria.com/" />

    {/* Hreflang pour le multilangue si nécessaire */}
    <link
      rel="alternate"
      hrefLang="fr"
      href="https://www.rosi-trattoria.com/"
    />

    {/* Autres meta tags utiles */}
    <meta name="robots" content="index, follow" />
    <meta name="author" content="Rosi Trattoria" />
    <meta name="geo.region" content="FR-19" />
    <meta name="geo.placename" content="Brive-la-Gaillarde" />
    <meta name="geo.position" content="45.1598;1.5334" />
    <meta name="ICBM" content="45.1598, 1.5334" />
  </Helmet>
);

function App(): React.JSX.Element {
  const location = useLocation();

  // Solution robuste pour le scroll au top
  useEffect(() => {
    // Méthode 1: Scroll immédiat sur tous les éléments possibles
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Méthode 2: Forcer après le rendu des composants
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

    return () => clearTimeout(timer);
  }, [location.pathname]);

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
        <Route path="/nos-valeurs" element={<NosValeurs />} />
        <Route path="/carte" element={<Carte />} />
        <Route path="/recrutement" element={<Recrutement />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
