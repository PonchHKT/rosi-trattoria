import React, { useEffect, useRef } from "react";
import "./biographie2.scss";

// Composant AnimatedSection intégré
interface AnimatedSectionProps {
  children: React.ReactNode;
  animationType: string;
  delay?: number;
  threshold?: number;
  className?: string;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  animationType,
  delay = 0,
  threshold = 0.1,
  className = "",
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("visible");
            }, delay);
          }
        });
      },
      { threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [delay, threshold]);

  return (
    <div ref={elementRef} className={`${animationType} ${className}`}>
      {children}
    </div>
  );
};

const Biographie2: React.FC = () => {
  return (
    <section className="restaurant-bio" aria-labelledby="bio-main-title">
      {/* Header en pleine largeur avec background du four à dôme */}
      <AnimatedSection animationType="fade-in-up" delay={0}>
        <header className="bio-header" role="banner">
          {/* Fade noir du bas */}
          <div className="bio-header-fade-bottom" aria-hidden="true"></div>

          <div className="bio-header-content">
            <h2 id="bio-main-title" className="bio-title" itemProp="name">
              Les raisons pour venir dans notre restaurant
            </h2>
            <p className="bio-subtitle" itemProp="description">
              Découvrez l'authenticité italienne au cœur de notre établissement
            </p>
          </div>
        </header>
      </AnimatedSection>

      <div className="bio-content" role="main">
        {/* Section principale avec texte et image charcuterie */}
        <AnimatedSection
          animationType="fade-in-left"
          delay={200}
          className="bio-section"
        >
          <article
            className="bio-text"
            itemScope
            itemType="https://schema.org/Article"
          >
            <h3 className="sr-only">Notre Pizza Napolitaine et Charcuterie</h3>
            <p itemProp="articleBody">
              Notre restaurant propose de la{" "}
              <strong>pizza napolitaine traditionnelle et authentique</strong>{" "}
              avec des produits de grande qualité. Nos pizzas sont cuites dans
              un <strong>four en dôme importé de Gênes</strong>, et la
              charcuterie finement découpée avec une{" "}
              <strong>trancheuse professionnelle à jambon manuelle</strong>.
            </p>

            <div
              className="bio-highlight"
              itemScope
              itemType="https://schema.org/Organization"
              role="complementary"
              aria-label="Information sur notre charcuterie Rovagnati"
            >
              <p>
                Notre charcuterie <strong itemProp="name">Rovagnati</strong>{" "}
                située à <span itemProp="address">Milan</span> est l'une des
                plus prestigieuses d'Italie depuis{" "}
                <time dateTime="1943" itemProp="foundingDate">
                  1943
                </time>{" "}
                et <strong>tranchée à la minute</strong>.
              </p>
            </div>
          </article>

          <figure className="bio-image-container">
            <img
              src="https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/nouveaute-la-famille-des-jambons-crus-rovagnati-selargie.jpg"
              alt="Charcuterie italienne Rovagnati tranchée finement, jambon cru de Milan depuis 1943"
              className="bio-image"
              loading="lazy"
              width="600"
              height="400"
              itemProp="image"
            />
            <figcaption className="sr-only">
              Charcuterie Rovagnati de Milan, tranchée à la minute dans notre
              restaurant
            </figcaption>
          </figure>
        </AnimatedSection>

        {/* Section Pascal avec image pizza - Pascal à gauche, image à droite */}
        <AnimatedSection
          animationType="fade-in-right"
          delay={400}
          className="bio-section bio-section--pascal"
        >
          <article
            className="bio-text"
            itemScope
            itemType="https://schema.org/Person"
            role="article"
            aria-labelledby="pascal-title"
          >
            <h3 id="pascal-title" className="sr-only">
              Pascal, Notre Pizzaïolo Expert
            </h3>
            <p>
              Notre pizzaïolo{" "}
              <strong className="bio-pascal" itemProp="name">
                Pascal
              </strong>
              ,{" "}
              <span itemProp="description">
                passionné de pizza, maîtrise toutes les techniques de
                préparation de pâtes faites maison au levain naturel
              </span>
              . De plus, nous utilisons uniquement des{" "}
              <strong>produits bio provenant directement d'Italie</strong>.
            </p>
            <meta itemProp="jobTitle" content="Pizzaïolo expert" />
            <meta itemProp="worksFor" content="Rosi Trattoria" />
          </article>

          <figure className="bio-image-container">
            <img
              src="https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/pascal_bio.jpg"
              alt="Pascal, pizzaïolo expert de Rosi Trattoria, préparant une pizza napolitaine au levain naturel"
              className="bio-image bio-image--pascal"
              loading="lazy"
              width="600"
              height="400"
              itemProp="image"
            />
            <figcaption className="sr-only">
              Pascal, notre pizzaïolo passionné, préparant une pizza avec sa
              pâte au levain naturel
            </figcaption>
          </figure>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default Biographie2;
