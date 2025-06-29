import React, { memo } from "react";
import { Home, Wheat, Leaf, Sparkles } from "lucide-react";
import "./nosvaleurscomponent.scss";
import Swipergallery from "../../Acceuil/SwiperGallery/swipergallery";

// Types
interface SectionData {
  title: string;
  text: string;
  note?: string;
  highlight?: boolean;
}

interface FeatureCardData {
  image: string;
  alt: string;
  title: string;
  text: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

// Données des sections avec contenu SEO optimisé
const sectionsData: SectionData[] = [
  {
    title: "Pâte au Levain Naturel d'Exception",
    text: "Chaque matin, Pascal pétrit une pâte unique au levain naturel, maturée 48 heures selon les techniques authentiques de John Bergh, double champion du monde. Avec la farine biologique Molino Marino Felice et notre levain maison, elle offre une texture aérienne et une digestibilité optimale pour des pizzas napolitaines d'exception.",
    note: "Chuttt !!! Elle respire...",
    highlight: true,
  },
  {
    title: "Tomates San Marzano Authentiques",
    text: "Nos tomates San Marzano, cultivées exclusivement dans le sol volcanique fertile entre Naples et Salerne, apportent cette saveur sucrée et acidulée caractéristique qui fait la renommée de la pizza napolitaine authentique.",
  },
  {
    title: "Boissons Artisanales Italiennes Bio",
    text: "Sélectionnées auprès des meilleurs producteurs artisanaux d'Italie, nos boissons biologiques et naturelles accompagnent parfaitement vos pizzas. Chinotto, limonades siciliennes et vins bio italiens. Salute !",
  },
  {
    title: "Charcuterie Rovagnati de Milan",
    text: "Tranchée à la minute sur notre trancheuse traditionnelle italienne, la charcuterie premium Rovagnati de Milan évoque l'authenticité des meilleures osterias lombardes. Prosciutto, mortadelle et coppa d'exception.",
  },
  {
    title: "Accueil Chaleureux à l'Italienne",
    text: "Dès que vous franchissez notre porte, embarquez pour un véritable voyage culinaire en Italie. Notre équipe passionnée vous accueille comme en famille, car votre plaisir gastronomique est notre priorité absolue.",
  },
  {
    title: "Légumes Frais de Producteurs Locaux",
    text: "Nos légumes bio, livrés quotidiennement par des producteurs locaux de Corrèze, sont préparés frais chaque jour par notre pizzaïolo Pascal pour garantir une qualité nutritionnelle et gustative optimale.",
  },
  {
    title: "Engagement Qualité et Hygiène",
    text: "Gwen et Pascal s'engagent personnellement à maintenir une qualité constante et une hygiène irréprochable, dignes de la réputation d'excellence de Rosi Trattoria, restaurant italien authentique à Brive-la-Gaillarde.",
  },
];

// Données des cartes avec contenu SEO enrichi
const featureCardsData: FeatureCardData[] = [
  {
    image: "/images/fait-maison.webp",
    alt: "Pizzas artisanales faites maison par Pascal à Rosi Trattoria",
    title: "100% Fait Maison Artisanal",
    text: "Tout est préparé quotidiennement sur place avec un savoir-faire artisanal italien authentique. Nos pizzas napolitaines au goût unique sont le fruit d'une passion transmise par les maîtres pizzaïolos italiens.",
    icon: Home,
  },
  {
    image: "/images/levain-naturel.jpg",
    alt: "Pâte à pizza au levain naturel maturée 48h selon John Bergh",
    title: "Levain Naturel Traditionnel",
    text: "Notre pâte signature, élaborée avec un levain naturel vivant et de la farine biologique premium, garantit des pizzas napolitaines délicieuses et parfaitement digestes, selon la tradition authentique.",
    icon: Wheat,
  },
  {
    image: "/images/local-biologique.jpg",
    alt: "Ingrédients bio et locaux utilisés chez Rosi Trattoria Brive",
    title: "Local & Agriculture Biologique",
    text: "En privilégiant les circuits courts et l'agriculture biologique, nous offrons une cuisine saine et responsable tout en soutenant activement les producteurs locaux de Corrèze et du Limousin.",
    icon: Leaf,
  },
];

const NosValeursComponent: React.FC = () => {
  return (
    <section
      className="nos-valeurs"
      aria-label="Nos valeurs et savoir-faire chez Rosi Trattoria"
    >
      <div className="nos-valeurs__content">
        {/* Feature Cards - Nos savoir-faire */}
        <section
          className="nos-valeurs__feature-cards"
          aria-labelledby="savoir-faire-title"
        >
          <h2 id="savoir-faire-title" className="nos-valeurs__features-title">
            Nos Savoir-Faire Authentiques
          </h2>
          <div className="nos-valeurs__cards-grid">
            {featureCardsData.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <article key={index} className="nos-valeurs__feature-card">
                  <div className="nos-valeurs__card-header">
                    <IconComponent
                      className="nos-valeurs__card-icon"
                      size={32}
                      aria-hidden="true"
                    />
                    <img
                      src={card.image}
                      alt={card.alt}
                      className="nos-valeurs__feature-image"
                      loading="lazy"
                      width="300"
                      height="200"
                    />
                  </div>
                  <div className="nos-valeurs__card-content">
                    <h3 className="nos-valeurs__feature-title">{card.title}</h3>
                    <p className="nos-valeurs__feature-text">{card.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <article className="nos-valeurs__hero" role="banner">
          <div className="nos-valeurs__pascal-showcase">
            <div className="nos-valeurs__pascal-name-container">
              <div className="nos-valeurs__pascal-title">
                <span>Maître Pizzaïolo</span>
              </div>
              <h1 id="pascal-title" className="nos-valeurs__pascal-name">
                Pascal Bellemain
              </h1>
            </div>
            <div className="nos-valeurs__pascal-image-container">
              <img
                src="/images/pascal.jpg"
                alt="Pascal Bellemain, maître pizzaïolo de Rosi Trattoria formé par John Bergh, champion du monde de pizza napolitaine"
                className="nos-valeurs__pascal-image"
                loading="eager"
                width="400"
                height="300"
              />
              <div className="nos-valeurs__image-overlay"></div>
            </div>
          </div>

          <div className="nos-valeurs__intro-text">
            <p className="nos-valeurs__intro-highlight">
              <strong>
                Pascal a suivi une formation d'excellence à l'école de John
                Bergh, double champion du monde de pizza napolitaine
              </strong>
              , afin de vous offrir une expérience gastronomique italienne
              authentique et éthique à Brive-la-Gaillarde.
            </p>

            <blockquote className="nos-valeurs__intro-body" cite="Pascal">
              <p>
                <strong>"</strong>Chez Rosi Trattoria, c'est pâte au levain
                naturel maison pour une meilleure digestion. Je favorise au
                maximum les petits producteurs locaux de Corrèze et utilise
                majoritairement des produits issus de l'agriculture biologique
                dans la confection de nos pizzas napolitaines authentiques, et
                tout cela pour votre plus grand plaisir gastronomique.
                <strong>"</strong>
              </p>
            </blockquote>
          </div>
        </article>

        {/* Quote inspirante */}
        <aside className="nos-valeurs__quote" role="complementary">
          <Sparkles
            className="nos-valeurs__quote-icon"
            size={32}
            aria-hidden="true"
          />
          <blockquote>
            Chez Rosi Trattoria, chaque pizza napolitaine raconte une histoire
            d'amour entre tradition italienne millénaire et passion artisanale
            contemporaine.
          </blockquote>
        </aside>

        {/* Sections principales - Nos engagements */}
        <section
          className="nos-valeurs__main-block"
          aria-labelledby="engagements-title"
        >
          <h2 id="engagements-title" className="nos-valeurs__main-title">
            Nos Engagements Qualité & Authenticité
          </h2>
          <div className="nos-valeurs__sections-flex">
            {sectionsData.map((section, index) => (
              <article
                key={index}
                className={`nos-valeurs__section ${
                  section.highlight ? "nos-valeurs__section--highlight" : ""
                }`}
              >
                <h3 className="nos-valeurs__section-title">{section.title}</h3>
                <p className="nos-valeurs__section-text">{section.text}</p>
                {section.note && (
                  <p className="nos-valeurs__section-note" role="note">
                    {section.note}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>

      <Swipergallery pageName="Nos Valeurs" />
    </section>
  );
};

export default memo(NosValeursComponent);
