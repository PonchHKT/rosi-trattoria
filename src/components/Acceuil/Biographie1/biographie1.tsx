import React, { useState, useEffect, useRef } from "react";
import { Users, Utensils } from "lucide-react";
import AnimatedSection from "../AnimatedSection/AnimatedSection";
import "./biographie1.scss";

const Biographie1: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenTriggered, setHasBeenTriggered] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const imageUrls = [
    "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/interieur-1.jpg",
    "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/interieur-2.jpg",
  ];

  const checkIsMobile = () => window.innerWidth <= 768;

  const resetAnimation = () => {
    setIsVisible(false);
    setHasBeenTriggered(false);
  };

  const startAnimation = () => {
    if (!hasBeenTriggered) {
      setIsVisible(true);
      setHasBeenTriggered(true);
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(checkIsMobile());
    setIsMobile(checkIsMobile());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const preloadImages = () => {
      let loadedCount = 0;
      imageUrls.forEach((url) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          setImagesLoaded(loadedCount);
          console.log(`Image loaded: ${url}`);
        };
        img.onerror = () => {
          loadedCount++;
          setImagesLoaded(loadedCount);
          console.error(`Failed to load image: ${url}`);
        };
        img.src = url;
      });
    };

    preloadImages();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
        } else if (hasBeenTriggered) {
          resetAnimation();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.2,
      }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, [hasBeenTriggered]);

  return (
    <section
      className={`biographie ${isMobile ? "biographie--mobile" : ""}`}
      ref={sectionRef}
      aria-labelledby="biographie-main-title"
      role="main"
    >
      <div className="biographie__container">
        <AnimatedSection animationType="fade-in-scale" delay={100}>
          <header className="biographie__header" role="banner">
            <hgroup
              className={`biographie__title ${isVisible ? "visible" : ""}`}
            >
              <h1 id="biographie-main-title" className="biographie__title-main">
                LA PASSION ET L'EXIGENCE
              </h1>
              <p className="biographie__title-accent" role="doc-subtitle">
                MÈNENT À L'EXCELLENCE
              </p>
            </hgroup>
          </header>
        </AnimatedSection>

        <AnimatedSection animationType="fade-in-scale" delay={150}>
          <div className="biographie__section-header">
            <div className="biographie__subtitle-container" aria-hidden="true">
              <div className="biographie__decorative-line"></div>
              <div className="biographie__pizza-icon">🍕</div>
              <div className="biographie__decorative-line"></div>
            </div>
            <h2 className="biographie__subtitle">
              Le plaisir de manger <span className="text-blue">Italien</span>{" "}
              dans un cadre <span className="text-pink">atypique</span>
            </h2>
          </div>
        </AnimatedSection>

        <AnimatedSection animationType="fade-in-scale" delay={200}>
          <div className="biographie__description">
            <p className="biographie__text">
              Nous vous servons de{" "}
              <strong>délicieuses pizzas Napolitaines</strong> dans un{" "}
              <strong>cadre élégant et chaleureux</strong>.
              <br />
              La <strong>décoration Street Art</strong> procure un sentiment de
              dépaysement total. <em>Spacieux mais intime</em>, le cadre est
              parfait pour passer des moments de détente et de tranquillité.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection animationType="fade-in-scale" delay={300}>
          <div
            className="biographie__capacity-section"
            role="region"
            aria-labelledby="capacity-title"
          >
            <h3 id="capacity-title" className="sr-only">
              Capacité d'accueil du restaurant
            </h3>

            <article className="biographie__capacity-card biographie__capacity-card--indoor">
              <div className="biographie__capacity-icon" aria-hidden="true">
                <Users size={40} />
              </div>
              <h4 className="biographie__capacity-number">
                50 places à l'intérieur
              </h4>
              <p className="biographie__capacity-desc">
                Idéal pour <strong>repas d'affaires</strong> ou privés dans un{" "}
                <strong>cadre intime</strong>.
              </p>
            </article>

            <article className="biographie__capacity-card biographie__capacity-card--outdoor">
              <div className="biographie__capacity-icon" aria-hidden="true">
                <Utensils size={40} />
              </div>
              <h4 className="biographie__capacity-number">
                100 places en terrasse
              </h4>
              <p className="biographie__capacity-desc">
                Profitez de l'extérieur quand le temps le permet.
              </p>
            </article>
          </div>
        </AnimatedSection>

        <AnimatedSection animationType="fade-in-scale" delay={400}>
          <div
            className="biographie__images"
            role="img"
            aria-label="Photos de l'intérieur du restaurant"
          >
            {imageUrls.map((url, index) => (
              <figure
                key={index}
                className={`biographie__image-container ${
                  imagesLoaded > index ? "loaded" : ""
                }`}
              >
                {imagesLoaded <= index && (
                  <div
                    className="biographie__image-placeholder"
                    aria-hidden="true"
                  >
                    <div className="biographie__image-skeleton"></div>
                  </div>
                )}
                <img
                  src={url}
                  alt={`Intérieur du restaurant Rosi Trattoria avec décoration Street Art ${
                    index === 0 ? "- vue d'ensemble" : "- ambiance chaleureuse"
                  }`}
                  className="biographie__image"
                  decoding="async"
                  loading="lazy"
                  width="600"
                  height="400"
                />
                <figcaption className="sr-only">
                  {index === 0
                    ? "Vue d'ensemble de notre salle avec décoration Street Art unique"
                    : "Ambiance chaleureuse et intime de notre restaurant italien"}
                </figcaption>
              </figure>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection animationType="fade-in-scale" delay={500}>
          <div className="biographie__quote-section">
            <blockquote
              className="biographie__quote"
              cite="https://www.rosi-trattoria.com"
            >
              Nous proposons des{" "}
              <strong>pizzas délicieuses aux saveurs originales</strong>. Vous
              pouvez les apprécier <em>sur place</em> ou les <em>emporter</em>.
            </blockquote>
          </div>
        </AnimatedSection>

        <AnimatedSection animationType="fade-in-scale" delay={600}>
          <div className="biographie__cta">
            <a
              href="https://bookings.zenchef.com/results?rid=356394&fullscreen=1"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Réserver une table chez Rosi Trattoria - Ouverture dans un nouvel onglet"
              title="Réservation en ligne via ZenChef"
            >
              <button className="biographie__cta-button" type="button">
                Je réserve !
              </button>
            </a>
          </div>
        </AnimatedSection>
      </div>
      <div className="biographie__bottom-fade" aria-hidden="true"></div>
    </section>
  );
};

export default Biographie1;
