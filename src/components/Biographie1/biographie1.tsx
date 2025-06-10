import React from "react";
import "./biographie1.scss";

const Biographie1: React.FC = () => {
  return (
    <div className="biographie">
      <div className="biographie__hero">
        <h1 className="biographie__title">
          LA PASSION ET L'EXIGENCE
          <span className="biographie__title-accent">
            MÈNENT À L'EXCELLENCE
          </span>
        </h1>
        <p className="biographie__intro">
          Découvrez une expérience culinaire unique dans un cadre chaleureux et
          moderne, où la tradition italienne rencontre l'élégance contemporaine.
        </p>
      </div>

      <div className="biographie__content">
        <section className="biographie__section">
          <h2 className="biographie__subtitle">
            Le plaisir de manger Italien dans un cadre atypique
          </h2>
          <p className="biographie__text">
            Nous vous servons de délicieuses pizzas Napolitaines dans un cadre
            élégant et chaleureux. La décoration Street Art procure un sentiment
            de dépaysement total. Spacieux mais intime, le cadre est parfait
            pour passer des moments de détente et de tranquillité.
          </p>
          <div className="biographie__highlight">
            Capacité d'accueil de <strong>50 places</strong>, idéal pour
            l'organisation de repas d'affaires ou privés.
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
