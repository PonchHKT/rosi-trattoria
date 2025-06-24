// components/Acceuil/Biographie1/biographie1.tsx
import React, { useState, useEffect, useRef } from "react";
import { Armchair } from "lucide-react";
import AnimatedSection from "../AnimatedSection/AnimatedSection";
import "./biographie1.scss";

const Biographie1: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenTriggered, setHasBeenTriggered] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fonction pour réinitialiser l'animation
  const resetAnimation = () => {
    setIsVisible(false);
    setHasBeenTriggered(false);
  };

  // Fonction pour démarrer l'animation
  const startAnimation = () => {
    if (!hasBeenTriggered) {
      setIsVisible(true);
      setHasBeenTriggered(true);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Nettoyer le timeout précédent si il existe
        if (resetTimeoutRef.current) {
          clearTimeout(resetTimeoutRef.current);
          resetTimeoutRef.current = null;
        }

        if (entry.isIntersecting) {
          // Élément visible
          startAnimation();
        } else if (hasBeenTriggered) {
          // Élément invisible après avoir été déclenché
          // Attendre un délai avant de réinitialiser pour éviter les clignotements
          resetTimeoutRef.current = setTimeout(() => {
            // Vérifier à nouveau si l'élément est toujours invisible
            if (sectionRef.current) {
              const rect = sectionRef.current.getBoundingClientRect();
              const isStillInvisible =
                rect.bottom < 0 || rect.top > window.innerHeight;

              if (isStillInvisible) {
                resetAnimation();
              }
            }
          }, 1500); // Délai plus long pour éviter les réinitialisations intempestives
        }
      },
      {
        root: null,
        rootMargin: "-10% 0px -10% 0px", // Marges pour déclencher l'animation plus tôt/tard
        threshold: [0, 0.1, 0.5], // Plusieurs seuils pour une détection plus précise
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasBeenTriggered]);

  // Gestion de la visibilité de la page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && hasBeenTriggered) {
        // Page redevient visible - vérifier si on doit réinitialiser
        setTimeout(() => {
          if (sectionRef.current) {
            const rect = sectionRef.current.getBoundingClientRect();
            const isInView = rect.top < window.innerHeight && rect.bottom > 0;

            if (!isInView) {
              resetAnimation();
            }
          }
        }, 100);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [hasBeenTriggered]);

  // Gestion du scroll pour une réinitialisation plus précise
  useEffect(() => {
    const handleScroll = () => {
      if (!hasBeenTriggered || !sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const isCompletelyOutOfView =
        rect.bottom < -200 || rect.top > window.innerHeight + 200;

      if (isCompletelyOutOfView) {
        // Nettoyer le timeout si il existe
        if (resetTimeoutRef.current) {
          clearTimeout(resetTimeoutRef.current);
        }

        resetTimeoutRef.current = setTimeout(() => {
          resetAnimation();
        }, 2000); // Délai plus long pour le scroll
      }
    };

    const throttledHandleScroll = throttle(handleScroll, 100);
    window.addEventListener("scroll", throttledHandleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
    };
  }, [hasBeenTriggered]);

  return (
    <section
      className="biographie"
      ref={sectionRef}
      aria-labelledby="restaurant-experience-title"
    >
      <AnimatedSection animationType="fade-in-scale" delay={100}>
        <header className="biographie__hero">
          <hgroup className={`biographie__title ${isVisible ? "visible" : ""}`}>
            <h2
              id="restaurant-experience-title"
              className="biographie__title-main"
            >
              LA PASSION ET L'EXIGENCE
            </h2>
            <p className="biographie__title-accent">MÈNENT À L'EXCELLENCE</p>
          </hgroup>

          <AnimatedSection animationType="fade-in-scale" delay={200}>
            <p className="biographie__intro">
              Découvrez une expérience culinaire unique dans un cadre chaleureux
              et moderne, où la tradition italienne rencontre l'élégance
              contemporaine.
            </p>
          </AnimatedSection>
        </header>
      </AnimatedSection>

      <div className="biographie__content">
        <article className="biographie__section">
          <header>
            <h3 className="biographie__subtitle">
              Le plaisir de manger Italien dans un cadre atypique
            </h3>
          </header>

          <div className="biographie__description">
            <p className="biographie__text">
              Nous vous servons de délicieuses pizzas Napolitaines dans un cadre
              élégant et chaleureux. <br />
              La décoration Street Art procure un sentiment de dépaysement
              total. Spacieux mais intime, le cadre est parfait pour passer des
              moments de détente et de tranquillité.
            </p>
          </div>

          <section
            className="biographie__capacity"
            aria-labelledby="capacity-title"
          >
            <h4 id="capacity-title" className="biographie__capacity-title">
              Capacité d'accueil
            </h4>

            <div
              className="biographie__capacity-grid"
              role="list"
              aria-label="Espaces disponibles au restaurant"
            >
              <div className="biographie__capacity-item" role="listitem">
                <div className="biographie__capacity-icon" aria-hidden="true">
                  <Armchair size={32} color="#ff69b4" />
                </div>
                <p>
                  <strong>50 places</strong> à l'intérieur
                </p>
                <p className="biographie__capacity-desc">
                  Idéal pour repas d'affaires ou privés dans un cadre intime.
                </p>
              </div>

              <div className="biographie__capacity-item" role="listitem">
                <div className="biographie__capacity-icon" aria-hidden="true">
                  <Armchair size={32} color="#75b9f9" />
                </div>
                <p>
                  <strong>100 places</strong> en terrasse
                </p>
                <p className="biographie__capacity-desc">
                  Profitez de l'extérieur quand le temps le permet.
                </p>
              </div>
            </div>
          </section>

          <div className="biographie__additional-info">
            <p className="biographie__text">
              Nous proposons des pizzas délicieuses aux saveurs originales. Vous
              pouvez les apprécier sur place ou les emporter.
            </p>

            <blockquote className="biographie__quote" cite="">
              <p>
                Nous vous accueillons dans un cadre chaleureux pour déguster de
                délicieuses pizzas Italiennes
              </p>
            </blockquote>
          </div>
        </article>
      </div>
    </section>
  );
};

// Fonction utilitaire pour throttle
function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): T {
  let inThrottle: boolean;
  return function (this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  } as T;
}

export default Biographie1;
