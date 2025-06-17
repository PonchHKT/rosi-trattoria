// components/Acceuil/Biographie1/biographie1.tsx
import React, { useState } from "react";
import AnimatedSection from "../AnimatedSection/AnimatedSection";
import { Typewriter } from "../TypeWriter/typewriter";
import "./biographie1.scss";

const Biographie1: React.FC = () => {
  const [showAccent, setShowAccent] = useState(false);

  return (
    <div className="biographie">
      <AnimatedSection animationType="fade-in-scale" delay={200}>
        <div className="biographie__hero">
          <div className="biographie__title">
            <Typewriter
              text="LA PASSION ET L'EXIGENCE"
              speed={60}
              delay={400}
              onComplete={() => setShowAccent(true)}
              className="biographie__title-main"
            />
            {showAccent && (
              <span className="biographie__title-accent">
                <Typewriter
                  text="MÈNENT À L'EXCELLENCE"
                  speed={60}
                  delay={300}
                />
              </span>
            )}
          </div>

          <p className="biographie__intro">
            Découvrez une expérience culinaire unique dans un cadre chaleureux
            et moderne, où la tradition italienne rencontre l'élégance
            contemporaine.
          </p>
        </div>
      </AnimatedSection>

      <div className="biographie__content">
        <section className="biographie__section">
          <h2 className="biographie__subtitle">
            Le plaisir de manger Italien dans un cadre atypique
          </h2>

          <p className="biographie__text">
            Nous vous servons de délicieuses pizzas Napolitaines dans un cadre
            élégant et chaleureux. <br />
            La décoration Street Art procure un sentiment de dépaysement total.
            Spacieux mais intime, le cadre est parfait pour passer des moments
            de détente et de tranquillité.
          </p>

          <div className="biographie__capacity">
            <h3 className="biographie__capacity-title">Capacité d'accueil</h3>

            <div className="biographie__capacity-grid">
              <div className="biographie__capacity-item">
                <span className="biographie__capacity-icon indoor"></span>
                <p>
                  <strong>50 places</strong> à l'intérieur
                </p>
                <p className="biographie__capacity-desc">
                  Idéal pour repas d'affaires ou privés dans un cadre intime.
                </p>
              </div>

              <div className="biographie__capacity-item">
                <span className="biographie__capacity-icon outdoor"></span>
                <p>
                  <strong>100 places</strong> en terrasse
                </p>
                <p className="biographie__capacity-desc">
                  Profitez de l'extérieur quand le temps le permet.
                </p>
              </div>
            </div>
          </div>

          <AnimatedSection animationType="fade-in-left" delay={100}>
            <p className="biographie__text">
              Nous proposons des pizzas délicieuses aux saveurs originales. Vous
              pouvez les apprécier sur place ou les emporter.
            </p>
          </AnimatedSection>

          <blockquote className="biographie__quote">
            Nous vous accueillons dans un cadre chaleureux pour déguster de
            délicieuses pizzas Italiennes
          </blockquote>
        </section>
      </div>
    </div>
  );
};

export default Biographie1;
