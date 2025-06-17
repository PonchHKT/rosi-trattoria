import React, { useEffect, useRef, useState } from "react";
import "./biographie2.scss";

const Biographie2: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div className="bio2-biographie" ref={sectionRef}>
      <div className="bio2-biographie__content">
        <section
          className={`bio2-biographie__section ${isVisible ? "visible" : ""}`}
        >
          <h2
            className={`bio2-biographie__subtitle ${
              isVisible ? "visible" : ""
            }`}
          >
            Les raisons pour venir dans notre restaurant
          </h2>

          <p className={`bio2-biographie__text ${isVisible ? "visible" : ""}`}>
            Notre restaurant propose de la pizza napolitaine traditionnelle et
            authentique avec des produits de grande qualité.
            <br /> Nos pizzas sont cuites dans un four en dôme importé de Gênes,
            et la charcuterie finement découpée avec une trancheuse
            professionnelle à jambon manuelle.
          </p>

          <div
            className={`bio2-biographie__highlight ${
              isVisible ? "visible" : ""
            }`}
          >
            Notre charcuterie{" "}
            <span className="bio2-biographie__rovagnati">
              <span className="rov">Rov</span>
              <span className="agn">agn</span>
              <span className="ati">ati</span>
            </span>{" "}
            située à Milan est l'une des plus prestigieuses d'Italie depuis 1943
            et tranchée à la minute.
          </div>

          <p className={`bio2-biographie__text ${isVisible ? "visible" : ""}`}>
            Notre pizzaïolo{" "}
            <span className="bio2-biographie__pascal-text">Pascal</span>,
            passionné de pizza, maîtrise toutes les techniques de préparation de
            pâtes faites maison au levain naturel.
            <br /> De plus, nous utilisons uniquement des produits bio provenant
            directement d'Italie.
          </p>

          <blockquote
            className={`bio2-biographie__quote ${isVisible ? "visible" : ""}`}
          >
            Nous utilisons les meilleurs produits bio d'Italie pour vous
            satisfaire
          </blockquote>
        </section>
      </div>
    </div>
  );
};

export default Biographie2;
