import React from "react";
import "./homevideosection.scss";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const HomeVideoSection: React.FC = () => {
  return (
    <section className="home-video-section">
      {/* Vidéo de fond */}
      <video
        className="background-video"
        src="/video/videoacceuil.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />

      {/* Logo en haut à droite */}
      <div className="logo-container">
        <img
          src="/images/logo/rositrattorialogo.png"
          alt="Logo Rosi Trattoria"
          className="logo"
        />
      </div>

      {/* Contenu principal */}
      <div className="content">
        {/* Slogan */}
        <h1 className="slogan">
          Du bon, du bio, de la joie, <br />
          c'est Rosie Trattoria !
        </h1>

        {/* Description */}
        <p className="description">
          Savourez l'authenticité italienne avec des produits frais et de
          saison.
        </p>

        {/* Boutons */}
        <div className="buttons">
          <button className="primary-button">Réserver</button>
          <button className="secondary-button">Voir le menu</button>
          <button className="white-button">Click and Collect</button>
        </div>
      </div>
    </section>
  );
};

export default HomeVideoSection;
