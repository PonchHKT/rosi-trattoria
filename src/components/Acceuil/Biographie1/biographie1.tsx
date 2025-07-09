import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Users, Utensils, Award, Heart } from "lucide-react";
import AnimatedSection from "../AnimatedSection/AnimatedSection";
import "./biographie1.scss";

const Biographie1: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenTriggered, setHasBeenTriggered] = useState(false);
  const [titleAnimationPlayed, setTitleAnimationPlayed] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const imageTimeoutsRef = useRef<{ [key: number]: NodeJS.Timeout }>({});

  // Mémoïsation des URLs d'images
  const imageUrls = useMemo(
    () => [
      "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/interieur-1.jpg",
      "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/interieur-2.jpg",
    ],
    []
  );

  // Fonction de vérification mobile optimisée
  const checkIsMobile = useCallback(() => window.innerWidth <= 768, []);

  // Throttle pour les events de resize
  const throttle = useCallback((func: Function, limit: number) => {
    let inThrottle: boolean;
    return function (this: any, ...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }, []);

  // Reset optimisé
  const resetAnimation = useCallback(() => {
    setIsVisible(false);
    setHasBeenTriggered(false);
  }, []);

  // Start animation optimisé
  const startAnimation = useCallback(() => {
    if (!hasBeenTriggered) {
      setIsVisible(true);
      setHasBeenTriggered(true);
      if (!titleAnimationPlayed) {
        setTitleAnimationPlayed(true);
      }
    }
  }, [hasBeenTriggered, titleAnimationPlayed]);

  // Gestion du resize avec throttle
  useEffect(() => {
    const throttledResize = throttle(() => setIsMobile(checkIsMobile()), 100);
    setIsMobile(checkIsMobile());
    window.addEventListener("resize", throttledResize);
    return () => window.removeEventListener("resize", throttledResize);
  }, [checkIsMobile, throttle]);

  // Système de préchargement d'images amélioré avec timeout et fallback
  useEffect(() => {
    const preloadImages = () => {
      imageUrls.forEach((url, index) => {
        imageTimeoutsRef.current[index] = setTimeout(() => {
          console.warn(`Image ${index} timeout - affichage forcé`);
          setImagesLoaded((prev) => ({ ...prev, [index]: true }));
        }, 8000);

        const img = new Image();

        img.onload = () => {
          if (imageTimeoutsRef.current[index]) {
            clearTimeout(imageTimeoutsRef.current[index]);
            delete imageTimeoutsRef.current[index];
          }

          setImagesLoaded((prev) => ({ ...prev, [index]: true }));
          setImageErrors((prev) => ({ ...prev, [index]: false }));
        };

        img.onerror = () => {
          console.error(`Erreur de chargement pour l'image ${index}:`, url);

          if (imageTimeoutsRef.current[index]) {
            clearTimeout(imageTimeoutsRef.current[index]);
            delete imageTimeoutsRef.current[index];
          }

          setImageErrors((prev) => ({ ...prev, [index]: true }));
          setImagesLoaded((prev) => ({ ...prev, [index]: true }));
        };

        img.decoding = "async";
        img.loading = "lazy";
        img.crossOrigin = "anonymous";
        img.src = url;
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          preloadImages();
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
      Object.values(imageTimeoutsRef.current).forEach((timeout) => {
        clearTimeout(timeout);
      });
      imageTimeoutsRef.current = {};
    };
  }, [imageUrls]);

  // IntersectionObserver optimisé
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        const scheduleUpdate = (callback: () => void) => {
          if (window.requestIdleCallback) {
            window.requestIdleCallback(callback, { timeout: 100 });
          } else {
            requestAnimationFrame(callback);
          }
        };

        if (entry.isIntersecting) {
          scheduleUpdate(startAnimation);
        } else if (hasBeenTriggered) {
          scheduleUpdate(resetAnimation);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.2,
      }
    );

    if (sectionRef.current) {
      observerRef.current.observe(sectionRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasBeenTriggered, startAnimation, resetAnimation]);

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
            <div className="biographie__title-wrapper">
              <div className="biographie__title-decorative">
                <div className="biographie__title-ornament biographie__title-ornament--left"></div>
                <div className="biographie__title-ornament biographie__title-ornament--right"></div>
              </div>

              <hgroup
                className={`biographie__title ${
                  titleAnimationPlayed
                    ? "visible permanent"
                    : isVisible
                    ? "visible"
                    : ""
                }`}
              >
                <h1
                  id="biographie-main-title"
                  className="biographie__title-main"
                >
                  <span className="biographie__title-word">LA</span>
                  <span className="biographie__title-word biographie__title-word--accent">
                    PASSION
                  </span>
                  <span className="biographie__title-word">ET</span>
                  <span className="biographie__title-word">L'</span>
                  <span className="biographie__title-word biographie__title-word--accent">
                    EXIGENCE
                  </span>
                </h1>
                <p className="biographie__title-accent" role="doc-subtitle">
                  <span className="biographie__title-accent-word">MÈNENT</span>
                  <span className="biographie__title-accent-word">À</span>
                  <span className="biographie__title-accent-word biographie__title-accent-word--highlight">
                    L'EXCELLENCE
                  </span>
                </p>
              </hgroup>
              <div className="biographie__title-badge">
                <Award className="biographie__title-badge-icon" />
                <span className="biographie__title-badge-text">
                  Depuis 2020
                </span>
              </div>
            </div>
          </header>
        </AnimatedSection>

        <AnimatedSection animationType="fade-in-scale" delay={150}>
          <div className="biographie__section-header">
            <div className="biographie__subtitle-container">
              <div className="biographie__decorative-line biographie__decorative-line--left"></div>
              <div className="biographie__pizza-icon">
                <span className="biographie__pizza-emoji">🍕</span>
                <div className="biographie__pizza-glow"></div>
              </div>
              <div className="biographie__decorative-line biographie__decorative-line--right"></div>
            </div>
            <h2 className="biographie__subtitle">
              Le plaisir de manger <span className="text-blue">Italien</span>{" "}
              dans un cadre <span className="text-pink">atypique</span>
            </h2>
          </div>
        </AnimatedSection>

        <AnimatedSection animationType="fade-in-scale" delay={200}>
          <div className="biographie__description">
            <div className="biographie__text-container">
              <p className="biographie__text">
                Nous vous servons de{" "}
                <strong className="biographie__text-highlight">
                  délicieuses pizzas Napolitaines
                </strong>{" "}
                dans un{" "}
                <strong className="biographie__text-highlight">
                  cadre élégant et chaleureux
                </strong>
                .
              </p>
              <p className="biographie__text">
                La{" "}
                <strong className="biographie__text-highlight">
                  décoration Street Art
                </strong>{" "}
                procure un sentiment de dépaysement total.{" "}
                <em>Spacieux mais intime</em>, le cadre est parfait pour passer
                des moments de détente et de tranquillité.
              </p>
            </div>
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
              <div className="biographie__capacity-icon">
                <Users size={32} />
                <div className="biographie__capacity-icon-bg"></div>
              </div>
              <div className="biographie__capacity-content">
                <h4 className="biographie__capacity-number">50</h4>
                <span className="biographie__capacity-label">
                  places à l'intérieur
                </span>
                <p className="biographie__capacity-desc">
                  Idéal pour <strong>repas d'affaires</strong> ou privés dans un{" "}
                  <strong>cadre intime</strong>.
                </p>
              </div>
            </article>

            <article className="biographie__capacity-card biographie__capacity-card--outdoor">
              <div className="biographie__capacity-icon">
                <Utensils size={32} />
                <div className="biographie__capacity-icon-bg"></div>
              </div>
              <div className="biographie__capacity-content">
                <h4 className="biographie__capacity-number">100</h4>
                <span className="biographie__capacity-label">
                  places en terrasse
                </span>
                <p className="biographie__capacity-desc">
                  Profitez de l'extérieur quand le temps le permet.
                </p>
              </div>
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
                  imagesLoaded[index] ? "loaded" : ""
                } ${imageErrors[index] ? "error" : ""}`}
              >
                <div className="biographie__image-overlay">
                  <div className="biographie__image-overlay-content">
                    <Heart className="biographie__image-overlay-icon" />
                    <span className="biographie__image-overlay-text">
                      {index === 0 ? "Atmosphère unique" : "Cadre chaleureux"}
                    </span>
                  </div>
                </div>

                {!imagesLoaded[index] && (
                  <div className="biographie__image-placeholder">
                    <div className="biographie__image-skeleton"></div>
                    <p className="biographie__loading-text">Chargement...</p>
                  </div>
                )}

                {imageErrors[index] ? (
                  <div className="biographie__image-error">
                    <div className="biographie__error-icon">📷</div>
                    <p className="biographie__error-text">
                      Image temporairement indisponible
                    </p>
                  </div>
                ) : (
                  <img
                    src={url}
                    alt={`Intérieur du restaurant Rosi Trattoria avec décoration Street Art ${
                      index === 0
                        ? "- vue d'ensemble"
                        : "- ambiance chaleureuse"
                    }`}
                    className="biographie__image"
                    decoding="async"
                    loading="lazy"
                    width="600"
                    height="400"
                    onLoad={() => {
                      setImagesLoaded((prev) => ({ ...prev, [index]: true }));
                      setImageErrors((prev) => ({ ...prev, [index]: false }));
                    }}
                    onError={() => {
                      console.error(`Erreur finale pour l'image ${index}`);
                      setImageErrors((prev) => ({ ...prev, [index]: true }));
                      setImagesLoaded((prev) => ({ ...prev, [index]: true }));
                    }}
                  />
                )}

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
            <div className="biographie__quote-container">
              <blockquote
                className="biographie__quote"
                cite="https://www.rosi-trattoria.com"
              >
                <span className="biographie__quote-mark biographie__quote-mark--open">
                  "
                </span>
                Nous proposons des{" "}
                <strong className="biographie__quote-highlight">
                  pizzas délicieuses aux saveurs originales
                </strong>
                . Vous pouvez les apprécier <em>sur place</em> ou les{" "}
                <em>emporter</em>.
                <span className="biographie__quote-mark biographie__quote-mark--close">
                  "
                </span>
              </blockquote>
              <div className="biographie__quote-decoration">
                <div className="biographie__quote-dot"></div>
                <div className="biographie__quote-dot"></div>
                <div className="biographie__quote-dot"></div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection animationType="fade-in-scale" delay={600}>
          <div className="biographie__cta">
            <div className="biographie__cta-container">
              <a
                href="https://bookings.zenchef.com/results?rid=356394&fullscreen=1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Réserver une table chez Rosi Trattoria - Ouverture dans un nouvel onglet"
                title="Réservation en ligne via ZenChef"
              >
                <button className="biographie__cta-button" type="button">
                  <span className="biographie__cta-button-text">
                    Je réserve !
                  </span>
                  <div className="biographie__cta-button-shine"></div>
                </button>
              </a>
              <p className="biographie__cta-subtitle">
                Réservation en ligne • Confirmation immédiate
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
      <div className="biographie__bottom-fade" aria-hidden="true"></div>
    </section>
  );
};

export default Biographie1;
