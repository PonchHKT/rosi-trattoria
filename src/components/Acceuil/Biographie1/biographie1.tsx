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
    <div className="biographie" ref={sectionRef}>
      <AnimatedSection animationType="fade-in-scale" delay={100}>
        <div className="biographie__hero">
          <div className={`biographie__title ${isVisible ? "visible" : ""}`}>
            <span className="biographie__title-main">
              LA PASSION ET L'EXIGENCE
            </span>
            <span className="biographie__title-accent">
              MÈNENT À L'EXCELLENCE
            </span>
          </div>

          <AnimatedSection animationType="fade-in-scale" delay={200}>
            <p className="biographie__intro">
              Découvrez une expérience culinaire unique dans un cadre chaleureux
              et moderne, où la tradition italienne rencontre l'élégance
              contemporaine.
            </p>
          </AnimatedSection>
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
                <div className="biographie__capacity-icon">
                  <Armchair size={32} color="#ff69b4" />
                </div>
                <p>
                  <strong>50 places</strong> à l'intérieur
                </p>
                <p className="biographie__capacity-desc">
                  Idéal pour repas d'affaires ou privés dans un cadre intime.
                </p>
              </div>

              <div className="biographie__capacity-item">
                <div className="biographie__capacity-icon">
                  <Armchair size={32} color="#ff69b4" />
                </div>
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
