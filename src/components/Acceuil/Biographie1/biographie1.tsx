import React, { useEffect, useRef, useState } from "react";
import { Users, Utensils, Award } from "lucide-react";
import "./biographie1.scss";

const Biographie1: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>(
    {}
  );

  const imageUrls = [
    "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/interieur-1.jpg",
    "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/interieur-2.jpg",
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Preload images when section is visible
          imageUrls.forEach((url, index) => {
            const img = new Image();
            img.src = url;
            img.decoding = "async";
            img.loading = "lazy";
            img.onload = () => {
              setImagesLoaded((prev) => ({ ...prev, [index]: true }));
              setImageErrors((prev) => ({ ...prev, [index]: false }));
            };
            img.onerror = () => {
              setImageErrors((prev) => ({ ...prev, [index]: true }));
              setImagesLoaded((prev) => ({ ...prev, [index]: true }));
            };
          });
        }
      },
      { rootMargin: "100px", threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [imageUrls]);

  return (
    <section
      className={`biographie ${isVisible ? "is-visible" : ""}`}
      ref={sectionRef}
      aria-labelledby="biographie-main-title"
    >
      <div className="biographie__container">
        <header className="biographie__header">
          <div className="biographie__title-wrapper">
            <hgroup className="biographie__title">
              <h1 className="biographie__title-main">
                {["LA", "PASSION", "ET", "L'EXIGENCE"].map((word, index) => (
                  <span
                    key={index}
                    className={`biographie__title-word ${
                      [1, 3].includes(index)
                        ? "biographie__title-word--accent"
                        : ""
                    } ${isVisible ? "is-visible" : ""}`}
                    style={{ transitionDelay: `${index * 0.1}s` }}
                  >
                    {word}
                  </span>
                ))}
              </h1>
              <p className="biographie__title-accent">
                {["MÈNENT", "À ", "L'EXCELLENCE"].map((word, index) => (
                  <span
                    key={index}
                    className={`biographie__title-accent-word ${
                      index === 2
                        ? "biographie__title-accent-word--highlight"
                        : ""
                    } ${isVisible ? "is-visible" : ""}`}
                    style={{ transitionDelay: `${(index + 4) * 0.1}s` }}
                  >
                    {word}
                  </span>
                ))}
              </p>
            </hgroup>
            <div
              className={`biographie__title-badge ${
                isVisible ? "is-visible" : ""
              }`}
            >
              <Award className="biographie__title-badge-icon" />
              <span className="biographie__title-badge-text">Depuis 2020</span>
            </div>
          </div>
        </header>

        <div className="biographie__section-header">
          <div className="biographie__subtitle-container">
            <div
              className={`biographie__decorative-line biographie__decorative-line--left ${
                isVisible ? "is-visible" : ""
              }`}
            />
            <div
              className={`biographie__pizza-icon ${
                isVisible ? "is-visible" : ""
              }`}
            >
              <svg
                className={`biographie__flag-svg ${
                  isVisible ? "is-visible" : ""
                }`}
                viewBox="0 0 900 600"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Drapeau italien"
              >
                <rect width="300" height="600" fill="#009246" />
                <rect x="300" width="300" height="600" fill="#FFFFFF" />
                <rect x="600" width="300" height="600" fill="#CE2B38" />
              </svg>
            </div>
            <div
              className={`biographie__decorative-line biographie__decorative-line--right ${
                isVisible ? "is-visible" : ""
              }`}
            />
          </div>
          <h2
            className={`biographie__subtitle ${isVisible ? "is-visible" : ""}`}
          >
            Le plaisir de manger <span className="text-blue">Italien</span> dans
            un cadre <span className="text-pink">atypique</span>
          </h2>
        </div>

        <div className="biographie__description">
          <div className="biographie__text-container">
            {[
              "Nous vous servons de délicieuses pizzas Napolitaines dans un cadre élégant et chaleureux.",
              "La décoration Street Art procure un sentiment de dépaysement total. Spacieux mais intime, le cadre est parfait pour passer des moments de détente et de tranquillité.",
            ].map((text, index) => (
              <p
                key={index}
                className={`biographie__text ${isVisible ? "is-visible" : ""}`}
                style={{ transitionDelay: `${(index + 6) * 0.1}s` }}
              >
                {text
                  .split(
                    /(délicieuses pizzas Napolitaines|cadre élégant et chaleureux|décoration Street Art)/
                  )
                  .map((part, i) =>
                    part.match(
                      /délicieuses pizzas Napolitaines|cadre élégant et chaleureux|décoration Street Art/
                    ) ? (
                      <strong key={i} className="biographie__text-highlight">
                        {part}
                      </strong>
                    ) : (
                      part
                    )
                  )}
              </p>
            ))}
          </div>
        </div>

        <div className="biographie__images">
          {imageUrls.map((url, index) => (
            <figure
              key={index}
              className={`biographie__image-container ${
                imagesLoaded[index] ? "loaded" : ""
              } ${imageErrors[index] ? "error" : ""} ${
                isVisible ? "is-visible" : ""
              }`}
              style={{ transitionDelay: `${(index + 8) * 0.1}s` }}
            >
              {!imagesLoaded[index] && (
                <div className="biographie__image-placeholder">
                  <div className="biographie__image-skeleton" />
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
                  alt={`Intérieur du restaurant Rosi Trattoria - ${
                    index === 0 ? "vue d'ensemble" : "ambiance chaleureuse"
                  }`}
                  className="biographie__image"
                  decoding="async"
                  loading="lazy"
                  width="600"
                  height="400"
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

        <div className="biographie__quote-section">
          <div className="biographie__quote-container">
            <blockquote
              className={`biographie__quote ${isVisible ? "is-visible" : ""}`}
              cite="https://www.rosi-trattoria.com"
              style={{ transitionDelay: "1s" }}
            >
              <span className="biographie__quote-mark biographie__quote-mark--open">
                "
              </span>
              Toutes nos{" "}
              <strong className="biographie__quote-highlight">
                pizzas sont préparées à la main
              </strong>{" "}
              avec des ingrédients frais, pour un goût unique à savourer sur
              place ou à <em>emporter</em>.
              <span className="biographie__quote-mark biographie__quote-mark--close">
                "
              </span>
            </blockquote>
            <div className="biographie__quote-decoration">
              {[1, 2, 3].map((_, index) => (
                <div
                  key={index}
                  className={`biographie__quote-dot ${
                    isVisible ? "is-visible" : ""
                  }`}
                  style={{ transitionDelay: `${(index + 10) * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="biographie__capacity-section">
          {[
            {
              number: 50,
              label: "places à l'intérieur",
              desc: "Idéal pour repas d'affaires ou privés dans un cadre intime.",
              icon: Users,
              type: "outdoor",
            },
            {
              number: 100,
              label: "places en terrasse",
              desc: "Profitez de l'extérieur quand le temps le permet.",
              icon: Utensils,
              type: "indoor",
            },
          ].map((card, index) => (
            <article
              key={index}
              className={`biographie__capacity-card biographie__capacity-card--${
                card.type
              } ${isVisible ? "is-visible" : ""}`}
              style={{ transitionDelay: `${(index + 12) * 0.1}s` }}
            >
              <div className="biographie__capacity-icon">
                <card.icon size={32} />
              </div>
              <div className="biographie__capacity-content">
                <h4 className="biographie__capacity-number">{card.number}</h4>
                <span className="biographie__capacity-label">{card.label}</span>
                <p className="biographie__capacity-desc">
                  {card.desc
                    .split(/(repas d'affaires|cadre intime)/)
                    .map((part, i) =>
                      part.match(/repas d'affaires|cadre intime/) ? (
                        <strong key={i}>{part}</strong>
                      ) : (
                        part
                      )
                    )}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="biographie__cta">
          <div className="biographie__cta-container">
            <a
              href="https://bookings.zenchef.com/results?rid=356394&fullscreen=1"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Réserver une table chez Rosi Trattoria"
            >
              <button
                className={`biographie__cta-button ${
                  isVisible ? "is-visible" : ""
                }`}
                type="button"
                style={{ transitionDelay: "1.4s" }}
              >
                <span className="biographie__cta-button-text">
                  Réservez votre table
                </span>
              </button>
            </a>
            <p
              className={`biographie__cta-subtitle ${
                isVisible ? "is-visible" : ""
              }`}
              style={{ transitionDelay: "1.5s" }}
            >
              Réservation en ligne • Confirmation immédiate
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Biographie1;
