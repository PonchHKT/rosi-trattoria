import React from "react";
import { Utensils, ChefHat } from "lucide-react";
import "./recrutementdisplay.scss";

const RecrutementDisplay: React.FC = () => {
  return (
    <div className="recruitment">
      <section className="hero">
        <div className="hero__content">
          <h1 className="hero__title">
            L'IMAGE DU ROSI-TRATTORIA
            <span className="hero__highlight">C'EST VOUS !</span>
          </h1>
          <div className="container">
            <p className="hero__subtitle">
              Vous êtes passionné, responsable et enthousiaste, on vous adore
              déjà !
            </p>
          </div>
        </div>
      </section>

      <section className="philosophy">
        <div className="philosophy__content">
          <h2 className="philosophy__title">UNE ÉQUIPE, UN BUT COMMUN !</h2>
          <div className="container">
            <p className="philosophy__text">
              Il s'agit de travailler ensemble pour la plus grande satisfaction
              de nos clients. <br />
              <strong className="philosophy__motto">
                UN SEUL MOT D'ORDRE :
              </strong>{" "}
              FAIRE PASSER À NOS CLIENTS UN EXCELLENT MOMENT !
            </p>
          </div>
        </div>

        <div className="philosophy__team-photo">
          <div className="container">
            <div className="team-photo-frame">
              <div className="team-photo-frame__inner">
                <img
                  src="/images/rosi-team.jpg"
                  alt="L'équipe Rosi Trattoria"
                  className="team-photo-frame__image"
                />
                <div className="team-photo-frame__overlay">
                  <div className="team-photo-frame__gradient"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="positions">
        <div className="positions__header">
          <h2 className="section-title">Opportunités de Carrière</h2>
        </div>
        <div className="container">
          <div className="positions__grid">
            <div className="position-card">
              <div className="position-card__header">
                <div className="position-card__icon position-card__icon--service">
                  <Utensils size={24} />
                </div>
                <h3 className="position-card__title">Service & Accueil</h3>
              </div>

              <div className="position-card__content">
                <div className="position-card__section">
                  <h4 className="position-card__subtitle">
                    Postes Disponibles
                  </h4>
                  <ul className="position-card__list">
                    <li>Directeur de Salle</li>
                    <li>Maître d'Hôtel</li>
                    <li>Chef de Rang</li>
                    <li>Serveur Qualifié</li>
                    <li>Commis de Salle</li>
                    <li>Barman Mixologue</li>
                  </ul>
                </div>

                <div className="position-card__section">
                  <h4 className="position-card__subtitle">Profil Recherché</h4>
                  <ul className="position-card__skills">
                    <li>Excellence relationnelle</li>
                    <li>Gestion du stress</li>
                    <li>Mémoire et organisation</li>
                    <li>Présentation soignée</li>
                    <li>Adaptabilité</li>
                    <li>Langues étrangères (plus)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="position-card">
              <div className="position-card__header">
                <div className="position-card__icon position-card__icon--kitchen">
                  <ChefHat size={24} />
                </div>
                <h3 className="position-card__title">Cuisine & Production</h3>
              </div>

              <div className="position-card__content">
                <div className="position-card__section">
                  <h4 className="position-card__subtitle">
                    Postes Disponibles
                  </h4>
                  <ul className="position-card__list">
                    <li>Chef de Cuisine</li>
                    <li>Second de Cuisine</li>
                    <li>Chef de Partie</li>
                    <li>Commis de Cuisine</li>
                    <li>Pizzaolo</li>
                    <li>Plongeur</li>
                  </ul>
                </div>

                <div className="position-card__section">
                  <h4 className="position-card__subtitle">Profil Recherché</h4>
                  <ul className="position-card__skills">
                    <li>Créativité culinaire</li>
                    <li>Techniques maîtrisées</li>
                    <li>Organisation méthodique</li>
                    <li>Résistance physique</li>
                    <li>Esprit d'équipe</li>
                    <li>Passion des produits</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="team">
        <div className="container">
          <div className="team__grid">
            <div className="team__member">
              <div className="team__avatar team__avatar--pascal">
                <img
                  src="/images/pascal.jpg"
                  alt="Pascal - Pizzaolo Expert"
                  className="team__photo"
                />
              </div>
              <div className="team__info">
                <h3 className="team__name">Pascal</h3>
                <p className="team__role">Pizzaolo</p>
                <p className="team__bio">
                  Après 30 ans passés dans une grande chaine de restauration
                  Française, je décide de vous faire partager ma passion suite à
                  une belle rencontre improbable. Je croise sur ma route John
                  Bergh (double champions du monde), il m'enseigne ses plus
                  grands secrets de la pate Napolitaine au levain Naturel et
                  100% Bio… Une pizza, éthique & gastronomique
                </p>
              </div>
            </div>

            <div className="team__member team__member--reverse">
              <div className="team__info">
                <h3 className="team__name">Gwen</h3>
                <p className="team__role">Directrice de Salle</p>
                <p className="team__bio">
                  J'ai commencé à travailler dans la restauration en tant que
                  serveuse il y a 20 ans. Aujourd'hui un nouveau projet Rosi
                  Trattoria en plein cœur de notre belle ville de Brive la
                  Gaillarde. Ce qui me plait dans mon métier c'est le contact
                  avec les clients, le plaisir de recevoir, le moment du service
                  est dédié aux clients.
                </p>
              </div>
              <div className="team__avatar team__avatar--gwen">
                <img
                  src="/images/gwen.jpg"
                  alt="Gwen - Directrice de Salle"
                  className="team__photo"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <div className="cta__content">
            <h2 className="cta__title">Candidature</h2>
            <p className="cta__subtitle">
              Envoyez votre candidature (CV + lettre de motivation) en précisant
              le poste souhaité
            </p>
            <a
              href="mailto:rosi.trattoriarecrutement@gmail.com"
              className="cta__button"
            >
              Postuler Maintenant
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RecrutementDisplay;
