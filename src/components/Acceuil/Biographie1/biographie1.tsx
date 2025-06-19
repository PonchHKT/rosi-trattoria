// components/Acceuil/Biographie1/biographie1.tsx
import React, { useState, useEffect, useRef } from "react";
import AnimatedSection from "../AnimatedSection/AnimatedSection";
import { Typewriter } from "../TypeWriter/typewriter";
import "./biographie1.scss";

const Biographie1: React.FC = () => {
  const [showAccent, setShowAccent] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenTriggered, setHasBeenTriggered] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasBeenTriggered) {
          setIsVisible(true);
          setHasBeenTriggered(true);
        } else if (!entry.isIntersecting && hasBeenTriggered) {
          // Réinitialiser les états quand le composant sort de la vue
          // avec un délai pour éviter les réinitialisations intempestives
          setTimeout(() => {
            if (!entry.isIntersecting) {
              setShowAccent(false);
              setShowIntro(false);
              setIsVisible(false);
              setHasBeenTriggered(false);
            }
          }, 1000);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasBeenTriggered]);

  // Alternative : Reset basé sur le focus/blur de la page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page devient invisible
        return;
      } else {
        // Page redevient visible - reset si nécessaire
        if (hasBeenTriggered && !isVisible) {
          setShowAccent(false);
          setShowIntro(false);
          setIsVisible(false);
          setHasBeenTriggered(false);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [hasBeenTriggered, isVisible]);

  return (
    <div className="biographie" ref={sectionRef}>
      <AnimatedSection animationType="fade-in-scale" delay={200}>
        <div className="biographie__hero">
          <div className="biographie__title">
            {isVisible && (
              <Typewriter
                text="LA PASSION ET L'EXIGENCE"
                speed={90}
                delay={600}
                onComplete={() => setShowAccent(true)}
                className="biographie__title-main"
                key={`main-${hasBeenTriggered}`} // Force re-render
              />
            )}
            {showAccent && (
              <span className="biographie__title-accent">
                <Typewriter
                  text="MÈNENT À L'EXCELLENCE"
                  speed={80}
                  delay={500}
                  onComplete={() => setShowIntro(true)}
                  key={`accent-${hasBeenTriggered}`} // Force re-render
                />
              </span>
            )}
          </div>
          {showIntro && (
            <AnimatedSection animationType="fade-in-scale" delay={800}>
              <p className="biographie__intro">
                Découvrez une expérience culinaire unique dans un cadre
                chaleureux et moderne, où la tradition italienne rencontre
                l'élégance contemporaine.
              </p>
            </AnimatedSection>
          )}
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

          <p className="biographie__text">
            Nous proposons des pizzas délicieuses aux saveurs originales. Vous
            pouvez les apprécier sur place ou les emporter.
          </p>

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
