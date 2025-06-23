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
    <meta
      property="og:image"
      content="https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/meta-rosi.png"
    />
    <meta
      property="og:image:alt"
      content="Carte des pizzas napolitaines bio - Rosi Trattoria Brive-la-Gaillarde"
    />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.rosi-trattoria.com/carte" />
    <meta property="og:locale" content="fr_FR" />
    <meta property="og:site_name" content="Rosi Trattoria" />

    {/* Twitter Card */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@RosiTrattoria" />
    <meta
      name="twitter:title"
      content="Carte des Pizzas - Rosi Trattoria Brive"
    />
    <meta
      name="twitter:description"
      content="Découvrez nos pizzas napolitaines bio faites maison. Pâte au levain, produits italiens premium."
    />
    <meta
      name="twitter:image"
      content="https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/meta-rosi.png"
    />

    {/* Schema.org Menu SEUL - Référence le Restaurant défini dans App.js */}
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Menu",
        "@id": "https://www.rosi-trattoria.com/carte#menu",
        name: "Carte Rosi Trattoria",
        description:
          "Menu de pizzas napolitaines artisanales bio avec produits italiens d'exception",
        url: "https://www.rosi-trattoria.com/carte",
        inLanguage: "fr-FR",
        // RÉFÉRENCE SIMPLIFIÉE - supprime les redéfinitions
        provider: {
          "@id": "https://www.rosi-trattoria.com/#restaurant",
        },
        hasMenuSection: [
          {
            "@type": "MenuSection",
            name: "Pizzas Napolitaines",
            description:
              "Pizzas authentiques cuites au four en dôme, pâte au levain naturel 48h, produits bio italiens",
            hasMenuItem: [
              {
                "@type": "MenuItem",
                name: "Pizza Margherita",
                description:
                  "Tomate San Marzano, mozzarella di bufala, basilic frais",
                offers: {
                  "@type": "Offer",
                  price: "14.50",
                  priceCurrency: "EUR",
                },
              },
              {
                "@type": "MenuItem",
                name: "Pizza Marinara",
                description:
                  "Tomate San Marzano, ail, origan, huile d'olive extra vierge",
                offers: {
                  "@type": "Offer",
                  price: "12.50",
                  priceCurrency: "EUR",
                },
              },
            ],
          },
        ],
      })}
    </script>

    {/* Balises canoniques */}
    <link rel="canonical" href="https://www.rosi-trattoria.com/carte" />

    {/* Autres meta tags */}
    <meta
      name="robots"
      content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    />
    <meta name="author" content="Rosi Trattoria" />
    <meta name="publisher" content="Rosi Trattoria" />
    <meta name="copyright" content="© 2025 Rosi Trattoria" />

    {/* Meta tags géolocalisés */}
    <meta name="geo.region" content="FR-19" />
    <meta name="geo.placename" content="Brive-la-Gaillarde" />
    <meta name="geo.position" content="45.1632151;1.532797" />
    <meta name="ICBM" content="45.1632151, 1.532797" />

    {/* Meta tags business pour la carte */}
    <meta name="business-type" content="Restaurant Italien" />
    <meta name="cuisine-type" content="Italian, Pizza, Napoletana" />
    <meta name="price-range" content="€€" />
    <meta name="menu-type" content="Pizza, Bio, Artisanal" />

    {/* Breadcrumb Schema */}
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
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
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Quels sont les horaires de Rosi Trattoria ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Mardi à jeudi : 12h-14h30 et 19h-22h. Vendredi et samedi : 12h-14h30 et 19h-22h30. Dimanche : 12h-15h. Fermé le lundi.",
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
          {
            "@type": "Question",
            name: "Acceptez-vous les réservations ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Oui, les réservations sont fortement recommandées, surtout le week-end. Appelez-nous au 05 44 31 44 47 ou utilisez notre formulaire de contact.",
            },
          },
          {
            "@type": "Question",
            name: "Quels sont vos prix de pizzas ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Nos pizzas vont de 12,50€ (Marinara) à partir de 14,50€ (Margherita). Des tarifs préférentiels sont appliqués pour les commandes à emporter. Consultez notre carte complète pour tous les prix.",
            },
          },
          {
            "@type": "Question",
            name: "Utilisez-vous des ingrédients authentiques italiens ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Absolument ! Nous importons nos ingrédients directement d'Italie : tomates San Marzano, mozzarella di bufala, huile d'olive extra vierge. Notre pâte est préparée au levain naturel selon la tradition napolitaine.",
            },
          },
        ],
      })}
    </script>

    {/* Liens alternatifs pour le SEO international */}
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

    {/* Preconnect et DNS prefetch pour optimiser les performances */}
    <link
      rel="preconnect"
      href="https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev"
    />
    <link
      rel="dns-prefetch"
      href="https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev"
    />

    {/* REMOVED: Preload line that was causing the warning */}

    <meta name="format-detection" content="telephone=yes" />
    <meta name="theme-color" content="#d4af37" />
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
