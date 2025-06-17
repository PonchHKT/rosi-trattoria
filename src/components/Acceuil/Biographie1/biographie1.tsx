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

          <AnimatedSection animationType="fade-in-left" delay={2500}>
            <p className="biographie__intro">
              Découvrez une expérience culinaire unique dans un cadre chaleureux
              et moderne, où la tradition italienne rencontre l'élégance
              contemporaine.
            </p>
          </AnimatedSection>
        </div>
      </AnimatedSection>

      <div className="biographie__content">
        <AnimatedSection
          animationType="bio-slide-right"
          delay={150}
          threshold={0.2}
        >
          <section className="biographie__section">
            <AnimatedSection animationType="fade-in-left" delay={50}>
              <h2 className="biographie__subtitle">
                Le plaisir de manger Italien dans un cadre atypique
              </h2>
            </AnimatedSection>

            <AnimatedSection animationType="fade-in-right" delay={100}>
              <p className="biographie__text">
                Nous vous servons de délicieuses pizzas Napolitaines dans un
                cadre élégant et chaleureux. <br />
                La décoration Street Art procure un sentiment de dépaysement
                total. Spacieux mais intime, le cadre est parfait pour passer
                des moments de détente et de tranquillité.
              </p>
            </AnimatedSection>

            <AnimatedSection
              animationType="card-animate"
              delay={400}
              threshold={0.3}
            >
              <div className="biographie__capacity">
                <AnimatedSection animationType="title-animate" delay={100}>
                  <h3 className="biographie__capacity-title">
                    Capacité d'accueil
                  </h3>
                </AnimatedSection>

                <div className="biographie__capacity-grid">
                  <AnimatedSection
                    animationType="bio-flip-left"
                    delay={100}
                    staggerDelay={1}
                  >
                    <div className="biographie__capacity-item">
                      <span className="biographie__capacity-icon indoor"></span>
                      <p>
                        <strong>50 places</strong> à l'intérieur
                      </p>
                      <p className="biographie__capacity-desc">
                        Idéal pour repas d'affaires ou privés dans un cadre
                        intime.
                      </p>
                    </div>
                  </AnimatedSection>

                  <AnimatedSection
                    animationType="bio-flip-right"
                    delay={150}
                    staggerDelay={2}
                  >
                    <div className="biographie__capacity-item">
                      <span className="biographie__capacity-icon outdoor"></span>
                      <p>
                        <strong>100 places</strong> en terrasse
                      </p>
                      <p className="biographie__capacity-desc">
                        Profitez de l'extérieur quand le temps le permet.
                      </p>
                    </div>
                  </AnimatedSection>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animationType="fade-in-left" delay={100}>
              <p className="biographie__text">
                Nous proposons des pizzas délicieuses aux saveurs originales.
                Vous pouvez les apprécier sur place ou les emporter.
              </p>
            </AnimatedSection>

            <AnimatedSection
              animationType="fade-in-right"
              delay={200}
              threshold={0.4}
            >
              <blockquote className="biographie__quote">
                Nous vous accueillons dans un cadre chaleureux pour déguster de
                délicieuses pizzas Italiennes
              </blockquote>
            </AnimatedSection>
          </section>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Biographie1;
