import React, { useEffect, useRef } from "react";
import "./homevideosection.scss";

const HomeVideoSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = async () => {
      try {
        await video.play();
      } catch (error) {
        console.error("Autoplay failed:", error);
      }
    };

    video.addEventListener("loadedmetadata", tryPlay);
    video.addEventListener("canplay", tryPlay);

    return () => {
      video.removeEventListener("loadedmetadata", tryPlay);
      video.removeEventListener("canplay", tryPlay);
    };
  }, []);

  return (
    <section className="home-video-section">
      <video
        ref={videoRef}
        className="background-video"
        src="/video/videoacceuil.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/images/video-poster.jpg"
        aria-hidden="true"
      >
        <source src="/video/videoacceuil.mp4" type="video/mp4" />
        {/* Remove webm if you don’t have a webm version */}
        Your browser does not support the video tag.
      </video>

      <div className="logo-container">
        <img
          src="/images/logo/rositrattorialogo.png"
          alt="Logo Rosi Trattoria"
          className="logo"
        />
      </div>

      <div className="content">
        <h1 className="slogan">
          Du bon, du bio, de la joie, <br />
          c'est Rosie Trattoria !
        </h1>
        <p className="description">
          Savourez l'authenticité italienne avec des produits frais et de
          saison.
        </p>
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
