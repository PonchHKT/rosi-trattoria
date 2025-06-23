import React from "react";
import RecrutementDisplay from "../components/Recrutement/RecrutementDisplay/recrutementdisplay";

const Recrutement: React.FC = () => {
  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "JobPosting",
            title: "Chef de Cuisine",
            description:
              "Rejoignez Rosi Trattoria à Brive-la-Gaillarde en tant que chef de cuisine pour préparer des plats italiens authentiques avec des ingrédients bio et locaux.",
            hiringOrganization: {
              "@type": "Organization",
              name: "Rosi Trattoria",
              sameAs: "https://www.rosi-trattoria.com",
            },
            jobLocation: {
              "@type": "Place",
              address: {
                "@type": "PostalAddress",
                streetAddress: "11 Promenade des Tilleuls",
                addressLocality: "Brive-la-Gaillarde",
                postalCode: "19100",
                addressRegion: "Nouvelle-Aquitaine",
                addressCountry: "FR",
              },
            },
            employmentType: "FULL_TIME",
            datePosted: "2025-06-23",
            validThrough: "2025-12-31",
            baseSalary: {
              "@type": "MonetaryAmount",
              currency: "EUR",
              value: {
                "@type": "QuantitativeValue",
                minValue: 25000,
                maxValue: 35000,
                unitText: "YEAR",
              },
            },
            applicationContact: {
              "@type": "ContactPoint",
              email: "rosi.trattoria@gmail.com",
              contactType: "Recruitment",
            },
          },
          {
            "@type": "JobPosting",
            title: "Serveur/Serveuse",
            description:
              "Rejoignez notre équipe de service à Rosi Trattoria pour offrir une expérience chaleureuse et authentique à nos clients à Brive-la-Gaillarde.",
            hiringOrganization: {
              "@type": "Organization",
              name: "Rosi Trattoria",
              sameAs: "https://www.rosi-trattoria.com",
            },
            jobLocation: {
              "@type": "Place",
              address: {
                "@type": "PostalAddress",
                streetAddress: "11 Promenade des Tilleuls",
                addressLocality: "Brive-la-Gaillarde",
                postalCode: "19100",
                addressRegion: "Nouvelle-Aquitaine",
                addressCountry: "FR",
              },
            },
            employmentType: "FULL_TIME",
            datePosted: "2025-06-23",
            validThrough: "2025-12-31",
            baseSalary: {
              "@type": "MonetaryAmount",
              currency: "EUR",
              value: {
                "@type": "QuantitativeValue",
                minValue: 20000,
                maxValue: 28000,
                unitText: "YEAR",
              },
            },
            applicationContact: {
              "@type": "ContactPoint",
              email: "rosi.trattoria@gmail.com",
              contactType: "Recruitment",
            },
          },
        ])}
      </script>

      <RecrutementDisplay />
    </>
  );
};

export default Recrutement;
