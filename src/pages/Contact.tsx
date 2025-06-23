import React from "react";
import { Helmet } from "react-helmet-async";
import ContactDisplay from "../components/Contact/ContactDisplay/contactdisplay";

// Composant SEO optimisé pour la page Contact
const ContactPageSEO = () => (
  <Helmet>
    {/* Titre optimisé avec mots-clés locaux et intention */}
    <title>
      Contact - Restaurant Italien Rosi Trattoria Brive-la-Gaillarde | 05 44 31
      44 47
    </title>

    {/* Meta description enrichie avec call-to-action */}
    <meta
      name="description"
      content="Contactez Rosi Trattoria à Brive-la-Gaillarde pour vos réservations et renseignements. ☎️ 05 44 31 44 47 📍 11 Promenade des Tilleuls. Restaurant italien authentique - Formulaire contact, événements privés."
    />

    {/* Mots-clés optimisés avec longue traîne */}
    <meta
      name="keywords"
      content="contact Rosi Trattoria Brive, réservation restaurant italien Brive-la-Gaillarde, 05 44 31 44 47, 11 Promenade Tilleuls, restaurant italien contact, formulaire réservation Brive, candidature restaurant, événement privé restaurant italien, contact trattoria corrèze"
    />

    {/* Open Graph optimisé */}
    <meta
      property="og:title"
      content="Contact & Réservation - Rosi Trattoria | Restaurant Italien Authentique Brive"
    />
    <meta
      property="og:description"
      content="Réservez votre table ou contactez-nous ! Restaurant italien authentique au cœur de Brive-la-Gaillarde. ☎️ 05 44 31 44 47 - Réponse rapide garantie !"
    />
    <meta
      property="og:image"
      content="https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/meta-rosi.png"
    />
    <meta
      property="og:image:alt"
      content="Contact Rosi Trattoria - Restaurant italien Brive-la-Gaillarde"
    />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.rosi-trattoria.com/contact" />
    <meta property="og:locale" content="fr_FR" />
    <meta property="og:site_name" content="Rosi Trattoria" />

    {/* Twitter Card optimisé */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@RosiTrattoria" />
    <meta
      name="twitter:title"
      content="Contact Rosi Trattoria - Réservation Restaurant Italien Brive"
    />
    <meta
      name="twitter:description"
      content="📞 05 44 31 44 47 | 📍 11 Prom. des Tilleuls, Brive | Formulaire contact & réservation en ligne. Authenticité 100% Italiana !"
    />
    <meta
      name="twitter:image"
      content="https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/meta-rosi.png"
    />

    {/* Schema.org ContactPage - RÉFÉRENCE le Restaurant principal */}
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "@id": "https://www.rosi-trattoria.com/contact",
        name: "Contact - Rosi Trattoria",
        description:
          "Page de contact pour réservations, renseignements et candidatures",
        url: "https://www.rosi-trattoria.com/contact",
        inLanguage: "fr-FR",
        isPartOf: {
          "@type": "WebSite",
          "@id": "https://www.rosi-trattoria.com/#website",
        },
        // RÉFÉRENCE SIMPLIFIÉE
        mainEntity: {
          "@id": "https://www.rosi-trattoria.com/#restaurant",
        },
      })}
    </script>

    {/* Schema.org WebForm pour le formulaire de contact */}
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebForm",
        name: "Formulaire de Contact Rosi Trattoria",
        description:
          "Formulaire en ligne pour contacter Rosi Trattoria : réservations, renseignements, candidatures, événements privés",
        url: "https://www.rosi-trattoria.com/contact",
        inLanguage: "fr-FR",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nous vous répondrons dans les plus brefs délais, généralement sous 2 heures en période d'ouverture",
        },
        potentialAction: {
          "@type": "SubmitAction",
          name: "Envoyer le message",
          description: "Envoyer votre demande de contact ou réservation",
        },
        provider: {
          "@id": "https://www.rosi-trattoria.com/#restaurant",
        },
      })}
    </script>

    {/* Schema.org BreadcrumbList */}
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
            name: "Contact",
            item: "https://www.rosi-trattoria.com/contact",
          },
        ],
      })}
    </script>

    {/* FAQ Schema enrichi */}
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Comment réserver une table chez Rosi Trattoria ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Vous pouvez réserver par téléphone au 05 44 31 44 47 (recommandé pour une réponse immédiate) ou en utilisant notre formulaire de contact en ligne. Nous vous confirmerons votre réservation rapidement. Réservation conseillée, surtout le week-end.",
            },
          },
          {
            "@type": "Question",
            name: "Quels sont vos horaires d'ouverture ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Nous sommes ouverts du mardi au jeudi de 12h-14h30 et 19h-22h, vendredi-samedi de 12h-14h30 et 19h-22h30, dimanche de 12h-15h. Fermé le lundi. Contactez-nous au 05 44 31 44 47 pour confirmer selon la saison.",
            },
          },
          {
            "@type": "Question",
            name: "Où êtes-vous situés exactement ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Rosi Trattoria se trouve au 11 Promenade des Tilleuls, 19100 Brive-la-Gaillarde, en plein centre-ville. Parking public à proximité. Une carte interactive est disponible sur notre page contact.",
            },
          },
          {
            "@type": "Question",
            name: "Comment postuler pour un emploi chez Rosi Trattoria ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Utilisez notre formulaire de contact en joignant votre CV et lettre de motivation, ou envoyez directement à rosi.trattoria@gmail.com. Nous recrutons régulièrement serveurs, cuisiniers et personnel de salle.",
            },
          },
          {
            "@type": "Question",
            name: "Proposez-vous des services pour groupes et événements privés ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Oui, nous accueillons les groupes (jusqu'à 40 personnes), anniversaires, repas d'entreprise et événements privés. Menus personnalisés disponibles. Contactez-nous pour discuter de vos besoins spécifiques.",
            },
          },
          {
            "@type": "Question",
            name: "Quels moyens de paiement acceptez-vous ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Nous acceptons les espèces, cartes bancaires (Visa, Mastercard), cartes sans contact et paiements mobiles. Tickets restaurant acceptés le midi.",
            },
          },
          {
            "@type": "Question",
            name: "Avez-vous des options végétariennes et sans gluten ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Oui, nous proposons plusieurs plats végétariens et des options sans gluten (pâtes, pizzas). Informez-nous de vos allergies ou régimes spéciaux lors de la réservation.",
            },
          },
        ],
      })}
    </script>

    {/* Canonical et meta tags SEO */}
    <link rel="canonical" href="https://www.rosi-trattoria.com/contact" />
    <meta
      name="robots"
      content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    />
    <meta name="author" content="Rosi Trattoria" />
    <meta name="publisher" content="Rosi Trattoria" />
    <meta name="copyright" content="© 2025 Rosi Trattoria" />

    {/* Meta tags géolocalisés optimisés */}
    <meta name="geo.region" content="FR-19" />
    <meta name="geo.placename" content="Brive-la-Gaillarde" />
    <meta name="geo.position" content="45.1632151;1.532797" />
    <meta name="ICBM" content="45.1632151, 1.532797" />
    <meta
      name="location"
      content="Brive-la-Gaillarde, Corrèze, Nouvelle-Aquitaine, France"
    />

    {/* Meta tags business enrichis */}
    <meta name="business-phone" content="+33544314447" />
    <meta name="business-email" content="rosi.trattoria@gmail.com" />
    <meta
      name="business-hours"
      content="Mar-Jeu: 12h-14h30, 19h-22h | Ven-Sam: 12h-14h30, 19h-22h30 | Dim: 12h-15h"
    />
    <meta name="business-type" content="Restaurant Italien" />
    <meta
      name="business-category"
      content="Restaurant, Trattoria, Cuisine Italienne"
    />

    {/* Meta tags réservation et contact */}
    <meta name="reservation-phone" content="05 44 31 44 47" />
    <meta name="contact-form" content="available" />
    <meta name="accepts-reservations" content="yes" />
    <meta name="cuisine-type" content="Italian, Pizza, Mediterranean" />
    <meta name="price-range" content="€€" />

    {/* Meta tags pour les réseaux sociaux locaux */}
    <meta name="locality" content="Brive-la-Gaillarde" />
    <meta name="region" content="Corrèze" />
    <meta name="country" content="France" />

    {/* Structured data pour la recherche locale */}
    <meta name="format-detection" content="telephone=yes" />
    <meta name="theme-color" content="#d4af37" />

    {/* Liens alternatifs pour le SEO international */}
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

    {/* Preconnect et DNS prefetch pour optimiser les performances */}
    <link
      rel="preconnect"
      href="https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev"
    />
    <link rel="preconnect" href="https://www.google.com" />
    <link rel="preconnect" href="https://maps.googleapis.com" />
    <link rel="dns-prefetch" href="https://www.google-analytics.com" />

    {/* REMOVED: Preload line that was causing the warning */}
  </Helmet>
);

const Contact: React.FC = () => {
  return (
    <>
      <ContactPageSEO />
      <ContactDisplay />
    </>
  );
};

export default Contact;
