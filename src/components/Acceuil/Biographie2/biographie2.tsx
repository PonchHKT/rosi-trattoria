import React from "react";
import "./biographie2.scss";

const Biographie2: React.FC = () => {
  return (
    <div className="bio2-biographie">
      <div className="bio2-biographie__content">
        <section className="bio2-biographie__section">
          <h2 className="bio2-biographie__subtitle">
            Les raisons pour venir dans notre restaurant
          </h2>
          <p className="bio2-biographie__text">
            Notre restaurant propose de la{" "}
            <strong>pizza napolitaine traditionnelle et authentique</strong>{" "}
            avec des produits de grande qualité. Nos pizzas sont cuites dans un
            four en dôme importé de Gênes, et la charcuterie finement découpée
            avec une trancheuse professionnelle à jambon manuelle.
          </p>
          <div className="bio2-biographie__highlight">
            Notre charcuterie <strong>Rovagnati</strong> située à Milan est
            l'une des plus prestigieuses d'Italie depuis 1943 et tranchée à la
            minute.
          </div>
          <p className="bio2-biographie__text">
            Notre pizzaïolo <strong>Pascal</strong>, passionné de pizza,
            maîtrise toutes les techniques de préparation de pâtes faites maison
            au levain naturel. De plus, nous utilisons uniquement des produits
            bio provenant directement d'Italie.
          </p>
          <blockquote className="bio2-biographie__quote">
            Nous utilisons les meilleurs produits bio d'Italie pour vous
            satisfaire
          </blockquote>
        </section>
      </div>
    </div>
  );
};

export default Biographie2;
