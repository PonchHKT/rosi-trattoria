import React, { memo } from "react";
import { Trophy, Home, Wheat, Leaf, Sparkles } from "lucide-react";
import "./nosvaleurscomponent.scss";

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

// Données des sections
const sectionsData: SectionData[] = [
  {
    title: "Une Pâte d'Exception",
    text: "Chaque matin, Pascal pétrit une pâte unique, maturée 48h selon les secrets de John Bergh. Avec la farine BIO Molino Marino Felice et notre levain naturel, elle offre une texture légère et une digestibilité optimale.",
    note: "Chuttt !!! Elle respire",
    highlight: true,
  },
  {
    title: "Sauce Tomate Authentique",
    text: "Nos tomates San Marzano, cultivées dans le sol volcanique entre Naples et Salerne, apportent une saveur juteuse et authentique à chaque pizza.",
  },
  {
    title: "Boissons Artisanales",
    text: "Naturelles et saines, nos boissons artisanales sont sélectionnées auprès des meilleurs producteurs italiens. À votre santé !",
  },
  {
    title: "Charcuterie d'Excellence",
    text: "Tranchée minute sur notre trancheuse traditionnelle, la charcuterie Rovagnati de Milan évoque l'authenticité des osterias italiennes.",
  },
  {
    title: "Accueil Chaleureux",
    text: "En franchissant notre porte, embarquez pour un voyage en Italie. Votre plaisir est notre priorité.",
  },
  {
    title: "Fraîcheur Garantie",
    text: "Nos légumes, livrés quotidiennement par un producteur régional, sont cuisinés frais par notre pizzaïolo pour une qualité optimale.",
  },
  {
    title: "Engagement d'Excellence",
    text: "Gwen et Pascal s'engagent à offrir une qualité constante et une hygiène irréprochable, digne de la réputation de Rosi Trattoria.",
  },
];

// Données des cartes
const featureCardsData: FeatureCardData[] = [
  {
    image: "/images/fait-maison.webp",
    alt: "Fait Maison",
    title: "Fait Maison",
    text: "Tout est préparé sur place avec un savoir-faire artisanal, pour des pizzas au goût unique qui font la différence.",
    icon: Home,
  },
  {
    image: "/images/levain-naturel.jpg",
    alt: "Levain Naturel",
    title: "Levain Naturel",
    text: "Notre pâte, élaborée avec un levain naturel et une farine biologique, garantit une pizza délicieuse et digeste.",
    icon: Wheat,
  },
  {
    image: "/images/local-biologique.jpg",
    alt: "Local et Biologique",
    title: "Local & Biologique",
    text: "En favorisant le local et le bio, nous offrons une alimentation saine tout en soutenant les producteurs régionaux.",
    icon: Leaf,
  },
];

const NosValeursComponent: React.FC = () => {
  return (
    <section
      className="nos-valeurs"
      aria-label="Nos valeurs chez Rosi Trattoria"
    >
      <div className="nos-valeurs__content">
        {/* Hero Section avec mise en avant de Pascal */}
        <article className="nos-valeurs__hero" role="banner">
          <div className="nos-valeurs__pascal-showcase">
            <div className="nos-valeurs__pascal-image-container">
              <img
                src="/images/pascal.jpg"
                alt="Pascal Bellemain, notre pizzaïolo expert formé par John Bergh"
                className="nos-valeurs__pascal-image"
                loading="eager"
              />
              <div className="nos-valeurs__image-overlay"></div>
            </div>
            <div className="nos-valeurs__pascal-name-container">
              <div className="nos-valeurs__pascal-title">
                <span>Maître Pizzaïolo</span>
              </div>
              <h3 className="nos-valeurs__pascal-name">Pascal Bellemain</h3>
            </div>
          </div>

          <div className="nos-valeurs__formation-highlight">
            <div className="nos-valeurs__formation-badge">
              <Trophy size={32} className="nos-valeurs__formation-icon" />
              <div className="nos-valeurs__formation-text">
                <span className="nos-valeurs__formation-title">
                  Formation d'Excellence
                </span>
                <span className="nos-valeurs__formation-subtitle">
                  Formé par John Bergh - Double Champion du Monde
                </span>
              </div>
            </div>
          </div>

          <div className="nos-valeurs__intro-text">
            <p className="nos-valeurs__intro-highlight">
              PASCAL A SUIVI UNE FORMATION À L'ÉCOLE DE JOHN BERGH, DOUBLE
              CHAMPION DU MONDE, AFIN DE VOUS OFFRIR UNE PIZZA ÉTHIQUE ET
              GASTRONOMIQUE.
            </p>
            <p className="nos-valeurs__intro-body">
              <strong>"</strong>Chez nous, c'est pâte au levain naturel maison
              pour une meilleure digestion. Je favorise au maximum les petits
              producteurs locaux et utilise majoritairement des produits issus
              de l'agriculture biologique dans la confection de nos pizzas et
              tout cela pour votre plus grand plaisir.<strong>"</strong>
            </p>
          </div>
        </article>

        {/* Feature Cards */}
        <div
          className="nos-valeurs__feature-cards"
          role="region"
          aria-label="Nos valeurs fondamentales"
        >
          <h2 className="nos-valeurs__features-title">
            Nos Valeurs Fondamentales
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
                    />
                    <img
                      src={card.image}
                      alt={card.alt}
                      className="nos-valeurs__feature-image"
                      loading="lazy"
                    />
                  </div>
                  <div className="nos-valeurs__card-content">
                    <h4 className="nos-valeurs__feature-title">{card.title}</h4>
                    <p className="nos-valeurs__feature-text">{card.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Quote */}
        <blockquote className="nos-valeurs__quote" role="complementary">
          <Sparkles className="nos-valeurs__quote-icon" size={32} />
          Chez Rosi Trattoria, chaque pizza raconte une histoire d'amour entre
          tradition et passion.
        </blockquote>

        {/* Main Sections */}
        <div className="nos-valeurs__main-block" role="main">
          <h2 className="nos-valeurs__main-title">Nos Engagements Qualité</h2>
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
                  <p className="nos-valeurs__section-note">{section.note}</p>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(NosValeursComponent);
