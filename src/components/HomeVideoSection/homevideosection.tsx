import React, { useEffect, useRef } from "react";
import "./homevideosection.scss";

const HomeVideoSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force play on iOS after component mounts
    const tryPlay = async () => {
      try {
        await video.play();
      } catch (error) {
        console.log("Autoplay failed:", error);
        // Fallback: show a play button or poster image
      }
    };

    // Add event listeners for better iOS compatibility
    video.addEventListener("loadedmetadata", tryPlay);
    video.addEventListener("canplay", tryPlay);

    return () => {
      video.removeEventListener("loadedmetadata", tryPlay);
      video.removeEventListener("canplay", tryPlay);
    };
  }, []);

  return (
    <section className="home-video-section">
      {/* Vidéo de fond */}
      <video
        ref={videoRef}
        className="background-video"
        src="/video/videoacceuil.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        controls={false}
        webkit-playsinline="true"
        x-webkit-airplay="allow"
        poster="/images/video-poster.jpg" // Add a poster image as fallback
        aria-hidden="true"
      >
        {/* Fallback for browsers that don't support video */}
        <source src="/video/videoacceuil.mp4" type="video/mp4" />
        <source src="/video/videoacceuil.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>

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
