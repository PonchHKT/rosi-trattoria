import React from "react";
import { Helmet } from "react-helmet-async";
import ContactDisplay from "../components/Contact/ContactDisplay/contactdisplay";

// Composant SEO pour la page Contact
const ContactPageSEO = () => (
  <Helmet>
    <title>
      Contact - Renseignements & Candidatures | Rosi Trattoria Brive
    </title>
    <meta
      name="description"
      content="Contactez Rosi Trattoria à Brive-la-Gaillarde. Réservation, renseignements, candidatures. ☎️ 05 44 31 44 47 📍 11 Prom. des Tilleuls, 19100 Brive. Formulaire en ligne."
    />
    <meta
      name="keywords"
      content="contact Rosi Trattoria, réservation restaurant Brive, restaurant italien Brive contact, 05 44 31 44 47, 11 Promenade Tilleuls, candidature restaurant, formulaire contact"
    />
    {/* Open Graph */}
    <meta
      property="og:title"
      content="Contact & Réservation - Rosi Trattoria Brive-la-Gaillarde"
    />
    <meta
      property="og:description"
      content="Contactez-nous pour vos réservations, renseignements ou candidatures. Restaurant italien authentique au cœur de Brive-la-Gaillarde. Réponse rapide garantie !"
    />
    <meta property="og:image" content="/images/meta-rosi.png" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.rosi-trattoria.com/contact" />
    {/* Twitter Card */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta
      name="twitter:title"
      content="Contact Rosi Trattoria - Réservation & Infos"
    />
    <meta
      name="twitter:description"
      content="📞 05 44 31 44 47 | 📍 11 Prom. des Tilleuls, Brive | Formulaire en ligne disponible. Fraîcheur • Qualité • Authenticité 100% Italiano !"
    />
    <meta name="twitter:image" content="/images/meta-rosi.png" />
    {/* Schema.org pour les coordonnées de contact */}
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "http://schema.org",
        "@type": "ContactPage",
        name: "Contact - Rosi Trattoria",
        description:
          "Page de contact pour réservations, renseignements et candidatures au restaurant italien Rosi Trattoria à Brive-la-Gaillarde",
        mainEntity: {
          "@type": "Restaurant",
          name: "Rosi Trattoria",
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
            latitude: "45.1632151",
            longitude: "1.532797",
          },
          telephone: "+33544314447",
          email: "rosi.trattoria@gmail.com",
          url: "https://www.rosi-trattoria.com",
          contactPoint: [
            {
              "@type": "ContactPoint",
              telephone: "+33544314447",
              contactType: "customer service",
              availableLanguage: ["French", "Italian"],
              description: "Réservations, renseignements généraux",
            },
            {
              "@type": "ContactPoint",
              email: "rosi.trattoria@gmail.com",
              contactType: "customer service",
              description: "Contact général, candidatures, demandes spéciales",
            },
          ],
        },
      })}
    </script>
    {/* Schema.org spécifique pour les horaires et services */}
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "http://schema.org",
        "@type": "LocalBusiness",
        name: "Rosi Trattoria",
        description:
          "Restaurant italien authentique - Fraîcheur, Qualité, Authenticité 100% Italiano",
        address: {
          "@type": "PostalAddress",
          streetAddress: "11 Promenade des Tilleuls",
          addressLocality: "Brive-la-Gaillarde",
          postalCode: "19100",
          addressCountry: "FR",
        },
        telephone: "+33544314447",
        email: "rosi.trattoria@gmail.com",
        priceRange: "€€",
        servesCuisine: ["Italian", "Pizza", "Mediterranean"],
        acceptsReservations: true,
        hasMap:
          "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d11252.717959411446!2d1.532797!3d45.1632151",
        paymentAccepted: ["Cash", "Credit Card"],
        currenciesAccepted: "EUR",
      })}
    </script>
    {/* Schema.org pour le formulaire de contact */}
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "http://schema.org",
        "@type": "WebForm",
        name: "Formulaire de Contact Rosi Trattoria",
        description:
          "Formulaire en ligne pour contacter Rosi Trattoria : réservations, renseignements, candidatures",
        url: "https://www.rosi-trattoria.com/contact",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nous vous répondrons dans les plus brefs délais",
        },
        potentialAction: {
          "@type": "SubmitAction",
          name: "Envoyer le message",
        },
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
            name: "Contact",
            item: "https://www.rosi-trattoria.com/contact",
          },
        ],
      })}
    </script>
    {/* FAQ Schema sur les modalités de contact */}
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "http://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Comment réserver une table chez Rosi Trattoria ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Vous pouvez réserver par téléphone au 05 44 31 44 47 ou en utilisant notre formulaire de contact en ligne. Nous vous confirmerons votre réservation rapidement.",
            },
          },
          {
            "@type": "Question",
            name: "Quels sont vos horaires d'ouverture ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Nous sommes ouverts du mardi au dimanche. Contactez-nous au 05 44 31 44 47 pour connaître nos horaires détaillés selon la saison.",
            },
          },
          {
            "@type": "Question",
            name: "Où êtes-vous situés exactement ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Rosi Trattoria se trouve au 11 Promenade des Tilleuls, 19100 Brive-la-Gaillarde. Une carte interactive est disponible sur notre page contact.",
            },
          },
          {
            "@type": "Question",
            name: "Comment postuler pour un emploi ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Utilisez notre formulaire de contact en joignant votre CV et lettre de motivation, ou consultez notre page recrutement pour plus d'informations sur les postes disponibles.",
            },
          },
          {
            "@type": "Question",
            name: "Proposez-vous des services de groupe ou événements ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Oui, nous accueillons les groupes et événements privés. Contactez-nous via le formulaire ou par téléphone pour discuter de vos besoins spécifiques.",
            },
          },
        ],
      })}
    </script>
    // Fixed Organization Schema (around line 210-230)
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "http://schema.org",
        "@type": "Organization",
        name: "Rosi Trattoria",
        slogan: "Fraîcheur • Qualité • Authenticité - 100% Italiano",
        logo: "/images/meta-rosi.png",
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+33544314447",
          email: "rosi.trattoria@gmail.com",
          contactType: "customer service", // Fixed: Added quotes and corrected property name
          areaServed: "Brive-la-Gaillarde", // Fixed: Added quotes
          availableLanguage: "French",
        },
        address: {
          "@type": "PostalAddress",
          streetAddress: "11 Promenade des Tilleuls",
          addressLocality: "Brive-la-Gaillarde",
          postalCode: "19100",
          addressCountry: "FR",
        },
        foundingDate: "2023",
        numberOfEmployees: "10-20",
      })}
    </script>
    {/* Article Schema pour le contenu de contact */}
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "http://schema.org",
        "@type": "Article",
        headline:
          "Contactez Rosi Trattoria - Restaurant Italien Authentique à Brive",
        description:
          "Toutes les informations pour contacter Rosi Trattoria : téléphone, adresse, formulaire en ligne. Réservations et renseignements facilités.",
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
        image: "/images/meta-rosi.pngg",
        datePublished: "2024-01-01",
        dateModified: "2024-12-01",
        mainEntityOfPage: "https://www.rosi-trattoria.com/contact",
      })}
    </script>
    {/* Canonical et autres meta tags */}
    <link rel="canonical" href="https://www.rosi-trattoria.com/contact" />
    <meta name="robots" content="index, follow" />
    <meta name="author" content="Rosi Trattoria" />
    {/* Meta tags pour le local SEO */}
    <meta name="geo.region" content="FR-19" />
    <meta name="geo.placename" content="Brive-la-Gaillarde" />
    <meta name="geo.position" content="45.1632151;1.532797" />
    <meta name="ICBM" content="45.1632151, 1.532797" />
    {/* Meta tags spécifiques contact/business */}
    <meta name="business-phone" content="+33544314447" />
    <meta name="business-email" content="rosi.trattoria@gmail.com" />
    <meta name="business-hours" content="Mardi-Dimanche" />
    {/* Meta tags pour les réservations */}
    <meta name="reservation-phone" content="05 44 31 44 47" />
    <meta name="contact-form" content="available" />
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
