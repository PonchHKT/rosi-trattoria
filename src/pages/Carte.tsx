import React from "react";
import { Helmet } from "react-helmet-async";
import MenuDisplay from "../components/Carte/MenuDisplay/menudisplay";

// Composant SEO pour la page Carte
const CartePageSEO = () => (
  <Helmet>
    <title>Notre Carte - Pizzas Napolitaines Bio | Rosi Trattoria Brive</title>
    <meta
      name="description"
      content="Découvrez notre carte de pizzas napolitaines artisanales bio à Brive-la-Gaillarde. Pâte au levain naturel, produits italiens d'exception. Sur place ou à emporter."
    />
    <meta
      name="keywords"
      content="carte pizza Brive, menu pizzeria napolitaine, pizza bio Brive-la-Gaillarde, tarifs pizza artisanale, carte restaurant italien, pizza à emporter Brive"
    />

    {/* Open Graph */}
    <meta
      property="og:title"
      content="Carte des Pizzas Bio - Rosi Trattoria Brive"
    />
    <meta
      property="og:description"
      content="Pizzas napolitaines authentiques, pâte au levain naturel, produits bio italiens. Consultez notre carte complète sur place et à emporter."
    />
    <meta property="og:image" content="/images/carte/carte-preview.jpg" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.rosi-trattoria.com/carte" />

    {/* Twitter Card */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta
      name="twitter:title"
      content="Carte des Pizzas - Rosi Trattoria Brive"
    />
    <meta
      name="twitter:description"
      content="Découvrez nos pizzas napolitaines bio faites maison. Pâte au levain, produits italiens premium."
    />
    <meta name="twitter:image" content="/images/carte/carte-preview.jpg" />

    {/* Schema.org pour menu de restaurant */}
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "http://schema.org",
        "@type": "Menu",
        name: "Carte Rosi Trattoria",
        description:
          "Menu de pizzas napolitaines artisanales bio avec produits italiens d'exception",
        provider: {
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
        },
        hasMenuSection: [
          {
            "@type": "MenuSection",
            name: "Pizzas Napolitaines",
            description:
              "Pizzas authentiques cuites au four en dôme, pâte au levain naturel",
          },
          {
            "@type": "MenuSection",
            name: "Service sur place",
            description:
              "Ambiance conviviale et service à table dans notre cadre Street Art",
          },
          {
            "@type": "MenuSection",
            name: "Service à emporter",
            description:
              "Tarifs réduits pour vos pizzas à savourer où vous voulez",
          },
        ],
        inLanguage: "fr-FR",
      })}
    </script>

    {/* Balises canoniques */}
    <link rel="canonical" href="https://www.rosi-trattoria.com/carte" />

    {/* Autres meta tags */}
    <meta name="robots" content="index, follow" />
    <meta name="author" content="Rosi Trattoria" />

    {/* Breadcrumb Schema */}
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "http://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Accueil",
            item: "https://www.rosi-trattoria.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Carte",
            item: "https://www.rosi-trattoria.com/carte",
          },
        ],
      })}
    </script>

    {/* FAQ Schema pour les questions courantes sur la carte */}
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "http://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Quels sont les horaires de Rosi Trattoria ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Mardi à jeudi : 12h-14h et 19h-21h30. Vendredi et samedi : 12h-14h et 19h-22h30. Fermé dimanche et lundi (sauf en août où nous sommes ouverts le lundi).",
            },
          },
          {
            "@type": "Question",
            name: "Proposez-vous des pizzas à emporter ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Oui, nous proposons toutes nos pizzas à emporter avec des tarifs réduits. Consultez notre carte dédiée pour les prix à emporter.",
            },
          },
          {
            "@type": "Question",
            name: "Vos pizzas sont-elles bio ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Oui, nous utilisons uniquement des produits bio provenant directement d'Italie. Notre pâte est faite au levain naturel et nos ingrédients sont de première qualité.",
            },
          },
        ],
      })}
    </script>
  </Helmet>
);

const Carte: React.FC = () => {
  return (
    <>
      <CartePageSEO />
      <MenuDisplay />
    </>
  );
};

export default Carte;
