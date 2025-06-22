import React from "react";
import { Helmet } from "react-helmet-async";
import NosValeursComponent from "../components/NosValeurs/NosValeursComponent/nosvaleurscomponent";

// Composant SEO pour la page Nos Valeurs
const NosValeursPageSEO = () => (
  <Helmet>
    <title>
      Nos Valeurs - Authenticité & Tradition Italienne | Rosi Trattoria Brive
    </title>
    <meta
      name="description"
      content="Découvrez les valeurs de Rosi Trattoria : Pascal Bellemain, pizzaïolo formé par John Bergh, pâte au levain naturel, produits bio locaux et passion italienne à Brive-la-Gaillarde."
    />
    <meta
      name="keywords"
      content="Pascal Bellemain pizzaïolo, John Bergh formation, valeurs restaurant italien Brive, pâte levain naturel, produits bio locaux, authenticité italienne, savoir-faire artisanal"
    />

    {/* Open Graph */}
    <meta
      property="og:title"
      content="Nos Valeurs - Passion & Authenticité Italienne | Rosi Trattoria"
    />
    <meta
      property="og:description"
      content="Pascal Bellemain, notre pizzaïolo formé par le champion du monde John Bergh, vous offre une pizza éthique avec pâte au levain naturel et produits bio locaux."
    />
    <meta property="og:image" content="/images/meta-rosi.png" />
    <meta property="og:type" content="website" />
    <meta
      property="og:url"
      content="https://www.rosi-trattoria.com/nos-valeurs"
    />

    {/* Twitter Card */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta
      name="twitter:title"
      content="Nos Valeurs - Pascal Bellemain, Maître Pizzaïolo"
    />
    <meta
      name="twitter:description"
      content="Formation John Bergh, pâte au levain naturel, produits bio locaux. Découvrez l'authenticité italienne chez Rosi Trattoria."
    />
    <meta name="twitter:image" content="/images/meta-rosi.png" />

    {/* Schema.org pour la page About/Valeurs */}
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "http://schema.org",
        "@type": "AboutPage",
        name: "Nos Valeurs - Rosi Trattoria",
        description:
          "Les valeurs et l'engagement qualité de Rosi Trattoria : authenticité italienne, savoir-faire artisanal et produits d'exception",
        mainEntity: {
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
          foundingDate: "2023",
          slogan: "La passion et l'exigence mènent à l'excellence",
          values: [
            "Authenticité italienne",
            "Produits bio et locaux",
            "Savoir-faire artisanal",
            "Pâte au levain naturel",
            "Accueil chaleureux",
          ],
        },
      })}
    </script>

    {/* Schema.org pour Pascal Bellemain */}
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "http://schema.org",
        "@type": "Person",
        name: "Pascal Bellemain",
        jobTitle: "Maître Pizzaïolo",
        worksFor: {
          "@type": "Restaurant",
          name: "Rosi Trattoria",
        },
        description:
          "Pizzaïolo expert formé par John Bergh, double champion du monde de pizza napolitaine",
        knowsAbout: [
          "Pizza napolitaine authentique",
          "Pâte au levain naturel",
          "Produits bio italiens",
          "Techniques artisanales",
        ],
        image: "/images/meta-rosi.png",
      })}
    </script>

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
            name: "Nos Valeurs",
            item: "https://www.rosi-trattoria.com/nos-valeurs",
          },
        ],
      })}
    </script>

    {/* FAQ Schema sur les valeurs et savoir-faire */}
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "http://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Qui est Pascal Bellemain ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Pascal Bellemain est notre maître pizzaïolo formé par John Bergh, double champion du monde de pizza napolitaine. Il maîtrise toutes les techniques de préparation de pâtes faites maison au levain naturel.",
            },
          },
          {
            "@type": "Question",
            name: "Qu'est-ce qui rend vos pizzas uniques ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Nos pizzas sont uniques grâce à notre pâte au levain naturel maturée 48h, nos tomates San Marzano, notre charcuterie Rovagnati tranchée minute et nos produits bio locaux.",
            },
          },
          {
            "@type": "Question",
            name: "Utilisez-vous des produits locaux ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Oui, nous favorisons les petits producteurs locaux et utilisons majoritairement des produits bio. Nos légumes sont livrés quotidiennement par un producteur régional.",
            },
          },
          {
            "@type": "Question",
            name: "Qu'est-ce que la formation John Bergh ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "John Bergh est double champion du monde de pizza napolitaine. Pascal a suivi sa formation pour maîtriser les techniques authentiques de la pizza éthique et gastronomique.",
            },
          },
        ],
      })}
    </script>

    {/* Article Schema pour le contenu éditorial */}
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "http://schema.org",
        "@type": "Article",
        headline:
          "Nos Valeurs : L'Authenticité Italienne au Cœur de Notre Savoir-Faire",
        description:
          "Découvrez l'engagement qualité de Rosi Trattoria, de la formation de notre pizzaïolo Pascal Bellemain aux produits bio locaux.",
        author: {
          "@type": "Organization",
          name: "Rosi Trattoria",
        },
        publisher: {
          "@type": "Organization",
          name: "Rosi Trattoria",
          logo: {
            "@type": "ImageObject",
            url: "/images/meta-rosi.png",
          },
        },
        image: "/images/meta-rosi.png",
        datePublished: "2024-01-01",
        dateModified: "2024-12-01",
        mainEntityOfPage: "https://www.rosi-trattoria.com/nos-valeurs",
      })}
    </script>

    {/* Canonical et autres meta tags */}
    <link rel="canonical" href="https://www.rosi-trattoria.com/nos-valeurs" />
    <meta name="robots" content="index, follow" />
    <meta name="author" content="Rosi Trattoria" />

    {/* Meta tags pour le local SEO */}
    <meta name="geo.region" content="FR-19" />
    <meta name="geo.placename" content="Brive-la-Gaillarde" />
  </Helmet>
);

const NosValeurs: React.FC = () => {
  return (
    <>
      <NosValeursPageSEO />
      <NosValeursComponent />
    </>
  );
};

export default NosValeurs;
