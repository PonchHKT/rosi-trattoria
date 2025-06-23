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
    <meta
      property="og:image"
      content="https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/meta-rosi.png"
    />
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
    <meta
      name="twitter:image"
      content="https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/meta-rosi.png"
    />

    {/* Schema.org PRINCIPAL du Restaurant - SEULE DÉFINITION COMPLÈTE */}
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Restaurant",
        "@id": "https://www.rosi-trattoria.com/#restaurant",
        name: "Rosi Trattoria",
        alternateName: "Rosi Trattoria Brive",
        description:
          "Restaurant italien authentique à Brive-la-Gaillarde - Spécialités italiennes traditionnelles, pizzas artisanales napolitaines bio, pâtes fraîches maison",
        slogan: "Fraîcheur • Qualité • Authenticité - 100% Italiano",
        foundingDate: "2023",
        address: {
          "@type": "PostalAddress",
          streetAddress: "11 Promenade des Tilleuls",
          addressLocality: "Brive-la-Gaillarde",
          postalCode: "19100",
          addressRegion: "Nouvelle-Aquitaine",
          addressCountry: "FR",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 45.1632151,
          longitude: 1.532797,
        },
        telephone: "+33544314447",
        email: "rosi.trattoria@gmail.com",
        url: "https://www.rosi-trattoria.com",
        image: [
          "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/meta-rosi.png",
          "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/pizza-rosi-trattoria.jpg",
          "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/carpaccio-de-bresaola.jpg",
        ],

        logo: "https://www.rosi-trattoria.com/images/logo/rositrattorialogo.png",
        priceRange: "€€",
        servesCuisine: ["Italian", "Pizza", "Mediterranean", "European"],
        acceptsReservations: true,
        hasMenu: "https://www.rosi-trattoria.com/carte",
        paymentAccepted: [
          "Cash",
          "Credit Card",
          "Debit Card",
          "Contactless Payment",
        ],
        currenciesAccepted: "EUR",
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Tuesday", "Wednesday", "Thursday"],
            opens: "12:00",
            closes: "14:30",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Tuesday", "Wednesday", "Thursday"],
            opens: "19:00",
            closes: "22:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Friday", "Saturday"],
            opens: "12:00",
            closes: "14:30",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Friday", "Saturday"],
            opens: "19:00",
            closes: "22:30",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Sunday",
            opens: "12:00",
            closes: "15:00",
          },
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          reviewCount: "127",
          bestRating: "5",
          worstRating: "1",
        },
        review: [
          {
            "@type": "Review",
            author: {
              "@type": "Person",
              name: "Marie Dubois",
            },
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
              bestRating: "5",
            },
            reviewBody:
              "Excellent restaurant italien ! Les pâtes sont faites maison et les ingrédients de qualité. Service impeccable.",
            datePublished: "2024-03-15",
          },
        ],
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: "+33544314447",
            contactType: "reservations",
            availableLanguage: ["French", "Italian"],
            description: "Réservations de table",
          },
          {
            "@type": "ContactPoint",
            email: "rosi.trattoria@gmail.com",
            contactType: "customer service",
            description: "Contact général, événements privés",
            availableLanguage: ["French", "Italian"],
          },
        ],
      })}
    </script>

    {/* Schema.org WebSite pour la recherche interne */}
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://www.rosi-trattoria.com/#website",
        name: "Rosi Trattoria",
        url: "https://www.rosi-trattoria.com",
        description:
          "Site officiel du restaurant italien Rosi Trattoria à Brive-la-Gaillarde",
        inLanguage: "fr-FR",
        publisher: {
          "@id": "https://www.rosi-trattoria.com/#restaurant",
        },
        potentialAction: {
          "@type": "SearchAction",
          target:
            "https://www.rosi-trattoria.com/recherche?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
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

    {/* Autres meta tags utiles */}
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="author" content="Rosi Trattoria" />
    <meta name="geo.region" content="FR-19" />
    <meta name="geo.placename" content="Brive-la-Gaillarde" />
    <meta name="geo.position" content="45.1632151;1.532797" />
    <meta name="ICBM" content="45.1632151, 1.532797" />
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
        {/* Route 404 - doit être la dernière */}
        <Route path="*" element={<Page404 />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
