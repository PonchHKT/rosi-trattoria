import React from "react";
import AnimatedSection from "../AnimatedSection/AnimatedSection";
import "./biographie2.scss";

const Biographie2: React.FC = () => {
  return (
    <section
      className="bio2-biographie"
      aria-labelledby="restaurant-reasons-title"
    >
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
            <header>
              <h2
                id="restaurant-reasons-title"
                className="bio2-biographie__subtitle"
              >
                Les raisons pour venir dans notre restaurant
              </h2>
            </header>
          </AnimatedSection>

          <article className="bio2-biographie__content-article">
            {/* Premier paragraphe depuis la droite */}
            <AnimatedSection
              animationType="fade-in-right"
              delay={500}
              threshold={0.1}
            >
              <section
                className="bio2-biographie__pizza-section"
                aria-labelledby="pizza-quality"
              >
                <h3 className="sr-only" id="pizza-quality">
                  Qualité de nos pizzas
                </h3>
                <p className="bio2-biographie__text">
                  Notre restaurant propose de la pizza napolitaine
                  traditionnelle et authentique avec des produits de grande
                  qualité.
                  <br /> Nos pizzas sont cuites dans un four en dôme importé de
                  Gênes, et la charcuterie finement découpée avec une trancheuse
                  professionnelle à jambon manuelle.
                </p>
              </section>
            </AnimatedSection>

            {/* Highlight avec animation de scale */}
            <section
              className="bio2-biographie__charcuterie-section"
              aria-labelledby="charcuterie-quality"
            >
              <h3 className="sr-only" id="charcuterie-quality">
                Notre charcuterie premium
              </h3>
              <div className="bio2-biographie__highlight">
                Notre charcuterie{" "}
                <span
                  className="bio2-biographie__rovagnati"
                  aria-label="Rovagnati, charcuterie milanaise"
                >
                  <span className="rov">Rov</span>
                  <span className="agn">agn</span>
                  <span className="ati">ati</span>
                </span>{" "}
                située à Milan est l'une des plus prestigieuses d'Italie depuis
                1943 et tranchée à la minute.
              </div>
            </section>

            {/* Deuxième paragraphe avec Pascal depuis la gauche */}
            <section
              className="bio2-biographie__chef-section"
              aria-labelledby="chef-expertise"
            >
              <h3 className="sr-only" id="chef-expertise">
                Expertise de notre pizzaïolo
              </h3>
              <p className="bio2-biographie__text">
                Notre pizzaïolo <strong>Pascal</strong> passionné de pizza,
                maîtrise toutes les techniques de préparation de pâtes faites
                maison au levain naturel.
                <br /> De plus, nous utilisons uniquement des produits bio
                provenant directement d'Italie.
              </p>
            </section>

            {/* Citation finale avec animation de scale */}
            <footer className="bio2-biographie__footer">
              <blockquote className="bio2-biographie__quote" cite="">
                <p>
                  Nous utilisons les meilleurs produits bio d'Italie pour vous
                  satisfaire
                </p>
              </blockquote>
            </footer>
          </article>
        </AnimatedSection>
      </div>

      {/* Styles pour masquer visuellement mais garder pour lecteurs d'écran */}
      <style>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </section>
  );
};

export default Biographie2;
