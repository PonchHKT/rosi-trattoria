import React from "react";
import { Helmet } from "react-helmet-async";
import RecrutementDisplay from "../components/Recrutement/RecrutementDisplay/recrutementdisplay";

// Composant SEO pour la page Recrutement
const RecrutementPageSEO = () => (
  <Helmet>
    <title>
      Recrutement - Rejoignez l'Équipe Rosi Trattoria | Emploi Restaurant Brive
    </title>
    <meta
      name="description"
      content="Rejoignez l'équipe passionnée de Rosi Trattoria à Brive-la-Gaillarde ! Postes disponibles : Chef de cuisine, Serveur, Pizzaïolo, Barman. Candidature CV + lettre de motivation."
    />
    <meta
      name="keywords"
      content="emploi restaurant Brive, recrutement pizzeria, chef de cuisine Brive, serveur restaurant italien, pizzaïolo emploi, barman Brive-la-Gaillarde, offres emploi restauration, équipe Rosi Trattoria"
    />

    {/* Open Graph */}
    <meta
      property="og:title"
      content="Recrutement - Rejoignez Notre Équipe Passionnée | Rosi Trattoria"
    />
    <meta
      property="og:description"
      content="L'image du Rosi-Trattoria c'est vous ! Rejoignez Pascal et Gwen dans une aventure culinaire authentique. Postes en cuisine et service disponibles."
    />
    <meta property="og:image" content="/images/meta-rosi.png" />
    <meta property="og:type" content="website" />
    <meta
      property="og:url"
      content="https://www.rosi-trattoria.com/recrutement"
    />

    {/* Twitter Card */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta
      name="twitter:title"
      content="Recrutement Rosi Trattoria - Rejoignez l'Équipe !"
    />
    <meta
      name="twitter:description"
      content="Passionné, responsable et enthousiaste ? Rejoignez notre équipe ! Postes en cuisine et service disponibles à Brive-la-Gaillarde."
    />
    <meta name="twitter:image" content="/images/meta-rosi.png" />

    {/* Schema.org pour les offres d'emploi */}
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "http://schema.org",
        "@type": "JobPosting",
        title: "Équipe Service & Cuisine - Rosi Trattoria",
        description:
          "Rejoignez l'équipe passionnée de Rosi Trattoria à Brive-la-Gaillarde. Nous recherchons des profils motivés pour nos postes en cuisine et service.",
        identifier: "ROSI-TEAM-2025",
        datePosted: "2025-06-01",
        validThrough: "2026-06-01",
        employmentType: ["FULL_TIME", "PART_TIME"],
        hiringOrganization: {
          "@type": "Restaurant",
          name: "Rosi Trattoria",
          sameAs: "https://www.rosi-trattoria.com",
          logo: "/images/meta-rosi.png",
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            streetAddress: "11 Prom. des Tilleuls",
            addressLocality: "Brive-la-Gaillarde",
            addressRegion: "Nouvelle-Aquitaine",
            postalCode: "19100",
            addressCountry: "FR",
          },
        },
        baseSalary: {
          "@type": "MonetaryAmount",
          currency: "EUR",
          value: {
            "@type": "QuantitativeValue",
            minValue: 1800,
            maxValue: 3500,
            unitText: "MONTH",
          },
        },
        qualifications:
          "Passion, responsabilité, enthousiasme, excellent relationnel, résistance au stress",
        responsibilities:
          "Assurer la plus grande satisfaction de nos clients, travailler en équipe, maintenir la qualité de service",
        skills:
          "Service client, travail d'équipe, résistance au stress, créativité culinaire selon le poste",
      })}
    </script>

    {/* Schema.org spécifique pour les postes de cuisine */}
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "http://schema.org",
        "@type": "JobPosting",
        title: "Chef de Cuisine & Équipe Cuisine - Rosi Trattoria",
        description:
          "Rejoignez notre brigade de cuisine dirigée par Pascal, pizzaïolo formé par John Bergh. Postes disponibles : Chef de Cuisine, Second, Chef de Partie, Commis, Plongeur.",
        identifier: "ROSI-CUISINE-2024",
        datePosted: "2024-01-01",
        validThrough: "2024-12-31",
        employmentType: ["FULL_TIME", "PART_TIME"],
        hiringOrganization: {
          "@type": "Restaurant",
          name: "Rosi Trattoria",
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Brive-la-Gaillarde",
            postalCode: "19100",
            addressCountry: "FR",
          },
        },
        qualifications:
          "Créativité, adaptabilité, organisation, résistance au stress, maîtrise des techniques de cuisine, esprit d'équipe",
        occupationalCategory: "Cuisine et Production Culinaire",
      })}
    </script>

    {/* Schema.org spécifique pour les postes de service */}
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "http://schema.org",
        "@type": "JobPosting",
        title: "Service & Accueil - Rosi Trattoria",
        description:
          "Rejoignez l'équipe de Gwen, Directrice de Salle avec 20 ans d'expérience. Postes disponibles : Directeur de Salle, Maître d'Hôtel, Chef de Rang, Serveur, Commis, Barman.",
        identifier: "ROSI-SERVICE-2024",
        datePosted: "2024-01-01",
        validThrough: "2024-12-31",
        employmentType: ["FULL_TIME", "PART_TIME"],
        hiringOrganization: {
          "@type": "Restaurant",
          name: "Rosi Trattoria",
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Brive-la-Gaillarde",
            postalCode: "19100",
            addressCountry: "FR",
          },
        },
        qualifications:
          "Excellent relationnel, résistance au stress, mémoire et organisation, souriant, curieux, pratique de langues étrangères",
        occupationalCategory: "Service et Accueil Restaurant",
      })}
    </script>

    {/* Schema.org pour l'équipe */}
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "http://schema.org",
        "@type": "Organization",
        name: "Équipe Rosi Trattoria",
        description:
          "Une équipe passionnée menée par Pascal (Pizzaïolo expert) et Gwen (Directrice de Salle avec 20 ans d'expérience)",
        member: [
          {
            "@type": "Person",
            name: "Pascal",
            jobTitle: "Pizzaïolo Expert",
            description:
              "30 ans d'expérience en restauration, formé par John Bergh (double champion du monde)",
            image: "/images/meta-rosi.png",
          },
          {
            "@type": "Person",
            name: "Gwen",
            jobTitle: "Directrice de Salle",
            description:
              "20 ans d'expérience dans la restauration, passionnée par l'accueil client",
            image: "/images/meta-rosi.png",
          },
        ],
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
            name: "Recrutement",
            item: "https://www.rosi-trattoria.com/recrutement",
          },
        ],
      })}
    </script>

    {/* FAQ Schema sur le recrutement */}
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "http://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Quels postes sont disponibles chez Rosi Trattoria ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Nous recrutons pour la cuisine (Chef, Second, Chef de Partie, Commis, Plongeur) et le service (Directeur de Salle, Maître d'Hôtel, Chef de Rang, Serveur, Commis de Salle, Barman).",
            },
          },
          {
            "@type": "Question",
            name: "Quel profil recherchez-vous ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Nous cherchons des personnes passionnées, responsables et enthousiastes. Pour le service : excellent relationnel, résistance au stress, organisation. Pour la cuisine : créativité, adaptabilité, maîtrise des techniques culinaires.",
            },
          },
          {
            "@type": "Question",
            name: "Comment postuler chez Rosi Trattoria ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Envoyez votre candidature (CV + lettre de motivation) en précisant le poste souhaité via notre page contact ou directement au restaurant.",
            },
          },
          {
            "@type": "Question",
            name: "Quelle est la philosophie de l'équipe ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Notre mot d'ordre : faire passer à nos clients un excellent moment ! Nous travaillons ensemble pour la plus grande satisfaction de nos clients.",
            },
          },
        ],
      })}
    </script>

    {/* Article Schema pour le contenu recrutement */}
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "http://schema.org",
        "@type": "Article",
        headline:
          "Rejoignez l'Équipe Rosi Trattoria - L'Image du Restaurant C'est Vous !",
        description:
          "Découvrez les opportunités de carrière chez Rosi Trattoria à Brive-la-Gaillarde. Une équipe passionnée menée par Pascal et Gwen vous attend.",
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
        mainEntityOfPage: "https://www.rosi-trattoria.com/recrutement",
      })}
    </script>

    {/* Canonical et autres meta tags */}
    <link rel="canonical" href="https://www.rosi-trattoria.com/recrutement" />
    <meta name="robots" content="index, follow" />
    <meta name="author" content="Rosi Trattoria" />

    {/* Meta tags pour le local SEO */}
    <meta name="geo.region" content="FR-19" />
    <meta name="geo.placename" content="Brive-la-Gaillarde" />

    {/* Meta tags spécifiques emploi */}
    <meta name="employment-type" content="full-time, part-time" />
    <meta name="job-category" content="restaurant, hospitality, food-service" />
  </Helmet>
);

const Recrutement: React.FC = () => {
  return (
    <>
      <RecrutementPageSEO />
      <RecrutementDisplay />
    </>
  );
};

export default Recrutement;
