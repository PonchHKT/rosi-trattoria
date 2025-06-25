// components/Acceuil/Biographie1/biographie1.tsx
import React, { useState, useEffect, useRef } from "react";
import { Users, Utensils } from "lucide-react";
import AnimatedSection from "../AnimatedSection/AnimatedSection";
import "./biographie1.scss";

const Biographie1: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenTriggered, setHasBeenTriggered] = useState(false);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // URLs des images optimisées
  const imageUrls = [
    "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/interieur-1.jpg",
    "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/interieur-2.jpg",
  ];

  // Fonction pour détecter si on est sur mobile
  const checkIsMobile = () => {
    return window.innerWidth <= 768;
  };

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

  // Détection mobile au montage et au redimensionnement
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(checkIsMobile());
    };

    // Vérification initiale
    setIsMobile(checkIsMobile());

    // Écoute des changements de taille d'écran
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Préchargement intelligent des images - CORRIGÉ
  useEffect(() => {
    const preloadImages = () => {
      // Choisir l'URL de fond selon la taille d'écran
      const backgroundUrl = isMobile
        ? "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/marble-background-mobile.jpg"
        : "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/marble-background-optimized.webp";

      const fallbackUrl =
        "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/marble-background.jpg";

      // Précharger l'image de fond avec timeout plus court sur mobile
      const bgImg = new Image();
      bgImg.onload = () => {
        // Délai plus court sur mobile pour affichage plus rapide
        const delay = isMobile ? 200 : 500;
        setTimeout(() => setBackgroundLoaded(true), delay);
      };
      bgImg.onerror = () => {
        // Fallback vers l'image originale
        const fallbackImg = new Image();
        fallbackImg.onload = () => {
          const delay = isMobile ? 100 : 300;
          setTimeout(() => setBackgroundLoaded(true), delay);
        };
        fallbackImg.onerror = () => {
          // Si même le fallback échoue, on active quand même
          setBackgroundLoaded(true);
        };
        fallbackImg.src = fallbackUrl;
      };
      bgImg.src = backgroundUrl;

      // Précharger les images du restaurant
      let loadedCount = 0;
      imageUrls.forEach((url) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          setImagesLoaded(loadedCount);
        };
        img.onerror = () => {
          // Même en cas d'erreur, on compte l'image comme "traitée"
          loadedCount++;
          setImagesLoaded(loadedCount);
        };
        img.src = url;
      });
    };

    // Vérifier la qualité de connexion
    if ("connection" in navigator) {
      const connection = (navigator as any).connection;
      if (
        connection.effectiveType === "slow-2g" ||
        connection.effectiveType === "2g" ||
        isMobile
      ) {
        // Pour les connexions lentes et mobile, timeout plus court
        const timeout = setTimeout(() => {
          setBackgroundLoaded(true);
          setImagesLoaded(imageUrls.length);
        }, 2000);

        preloadImages();

        return () => clearTimeout(timeout);
      } else {
        preloadImages();
      }
    } else {
      preloadImages();
    }

    // Timeout de sécurité réduit sur mobile
    const timeout = setTimeout(
      () => {
        setBackgroundLoaded(true);
        setImagesLoaded(imageUrls.length);
      },
      isMobile ? 3000 : 5000
    );

    return () => clearTimeout(timeout);
  }, [isMobile]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (resetTimeoutRef.current) {
          clearTimeout(resetTimeoutRef.current);
          resetTimeoutRef.current = null;
        }

        if (entry.isIntersecting) {
          startAnimation();
        } else if (hasBeenTriggered) {
          resetTimeoutRef.current = setTimeout(() => {
            if (sectionRef.current) {
              const rect = sectionRef.current.getBoundingClientRect();
              const isStillInvisible =
                rect.bottom < 0 || rect.top > window.innerHeight;

              if (isStillInvisible) {
                resetAnimation();
              }
            }
          }, 1500);
        }
      },
      {
        root: null,
        rootMargin: "-10% 0px -10% 0px",
        threshold: [0, 0.1, 0.5],
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

  return (
    <section
      className={`biographie ${backgroundLoaded ? "biographie--loaded" : ""} ${
        isMobile ? "biographie--mobile" : ""
      }`}
      ref={sectionRef}
    >
      <div className="biographie__container">
        {/* Header Section */}
        <AnimatedSection animationType="fade-in-scale" delay={100}>
          <header className="biographie__header">
            <hgroup
              className={`biographie__title ${isVisible ? "visible" : ""}`}
            >
              <h1 className="biographie__title-main">
                LA PASSION ET L'EXIGENCE
              </h1>
              <p className="biographie__title-accent">MÈNENT À L'EXCELLENCE</p>
            </hgroup>
          </header>
        </AnimatedSection>

        {/* Subtitle Section with decorative elements */}
        <AnimatedSection animationType="fade-in-scale" delay={150}>
          <div className="biographie__section-header">
            <div className="biographie__subtitle-container">
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

        {/* Description */}
        <AnimatedSection animationType="fade-in-scale" delay={200}>
          <div className="biographie__description">
            <p className="biographie__text">
              Nous vous servons de délicieuses pizzas Napolitaines dans un cadre
              élégant et chaleureux.
              <br />
              La décoration Street Art procure un sentiment de dépaysement
              total. Spacieux mais intime, le cadre est parfait pour passer des
              moments de détente et de tranquillité.
            </p>
          </div>
        </AnimatedSection>

        {/* Capacity Cards */}
        <AnimatedSection animationType="fade-in-scale" delay={300}>
          <div className="biographie__capacity-section">
            <div className="biographie__capacity-card biographie__capacity-card--indoor">
              <div className="biographie__capacity-icon">
                <Users size={40} />
              </div>
              <h4 className="biographie__capacity-number">
                50 places à l'intérieur
              </h4>
              <p className="biographie__capacity-desc">
                Idéal pour repas d'affaires ou privés dans un cadre intime.
              </p>
            </div>

            <div className="biographie__capacity-card biographie__capacity-card--outdoor">
              <div className="biographie__capacity-icon">
                <Utensils size={40} />
              </div>
              <h4 className="biographie__capacity-number">
                100 places en terrasse
              </h4>
              <p className="biographie__capacity-desc">
                Profitez de l'extérieur quand le temps le permet.
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Restaurant Images - CORRIGÉ */}
        <AnimatedSection animationType="fade-in-scale" delay={400}>
          <div className="biographie__images">
            <div
              className={`biographie__image-container ${
                imagesLoaded >= 1 ? "loaded" : ""
              }`}
            >
              {imagesLoaded < 1 && (
                <div className="biographie__image-placeholder">
                  <div className="biographie__image-skeleton"></div>
                </div>
              )}
              <img
                src={imageUrls[0]}
                alt="Intérieur du restaurant avec décoration street art"
                className="biographie__image"
                decoding="async"
                fetchPriority="high"
                loading="lazy"
              />
            </div>
            <div
              className={`biographie__image-container ${
                imagesLoaded >= 2 ? "loaded" : ""
              }`}
            >
              {imagesLoaded < 2 && (
                <div className="biographie__image-placeholder">
                  <div className="biographie__image-skeleton"></div>
                </div>
              )}
              <img
                src={imageUrls[1]}
                alt="Ambiance chaleureuse du restaurant"
                className="biographie__image"
                decoding="async"
                fetchPriority="high"
                loading="lazy"
              />
            </div>
          </div>
        </AnimatedSection>

        {/* Quote Section */}
        <AnimatedSection animationType="fade-in-scale" delay={500}>
          <div className="biographie__quote-section">
            <blockquote className="biographie__quote">
              Nous proposons des pizzas délicieuses aux saveurs originales. Vous
              pouvez les apprécier sur place ou les emporter.
            </blockquote>
          </div>
        </AnimatedSection>

        {/* CTA Button */}
        <AnimatedSection animationType="fade-in-scale" delay={600}>
          <div className="biographie__cta">
            <a
              href="https://bookings.zenchef.com/results?rid=356394&fullscreen=1"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Réserver une table chez Rosi Trattoria (nouvelle fenêtre)"
            >
              <button className="biographie__cta-button">Je réserve !</button>
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default Biographie1;
