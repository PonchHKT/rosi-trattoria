import React from "react";
import AnimatedSection from "../AnimatedSection/AnimatedSection";
import "./biographie2.scss";

const Biographie2: React.FC = () => {
  return (
    <div className="bio2-biographie">
      <div className="bio2-biographie__content">
        {/* Section principale avec animation de conteneur */}
        <AnimatedSection
          animationType="fade-in-scale"
          delay={100}
          threshold={0.05}
          className="bio2-biographie__section"
          rootMargin="0px 0px -100px 0px"
        >
          {/* Titre avec animation depuis la gauche */}
          <AnimatedSection
            animationType="fade-in-left"
            delay={300}
            threshold={0.1}
          >
            <h2 className="bio2-biographie__subtitle">
              Les raisons pour venir dans notre restaurant
            </h2>
          </AnimatedSection>

          {/* Premier paragraphe depuis la droite */}
          <AnimatedSection
            animationType="fade-in-right"
            delay={500}
            threshold={0.1}
          >
            <p className="bio2-biographie__text">
              Notre restaurant propose de la pizza napolitaine traditionnelle et
              authentique avec des produits de grande qualité.
              <br /> Nos pizzas sont cuites dans un four en dôme importé de
              Gênes, et la charcuterie finement découpée avec une trancheuse
              professionnelle à jambon manuelle.
            </p>
          </AnimatedSection>

          {/* Highlight avec animation de scale */}

          <div className="bio2-biographie__highlight">
            Notre charcuterie{" "}
            <span className="bio2-biographie__rovagnati">
              <span className="rov">Rov</span>
              <span className="agn">agn</span>
              <span className="ati">ati</span>
            </span>{" "}
            située à Milan est l'une des plus prestigieuses d'Italie depuis 1943
            et tranchée à la minute.
          </div>

          {/* Deuxième paragraphe avec Pascal depuis la gauche */}

          <p className="bio2-biographie__text">
            Notre pizzaïolo <strong>Pascal </strong>
            passionné de pizza, maîtrise toutes les techniques de préparation de
            pâtes faites maison au levain naturel.
            <br /> De plus, nous utilisons uniquement des produits bio provenant
            directement d'Italie.
          </p>

          {/* Citation finale avec animation de scale */}

          <blockquote className="bio2-biographie__quote">
            Nous utilisons les meilleurs produits bio d'Italie pour vous
            satisfaire
          </blockquote>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Biographie2;
