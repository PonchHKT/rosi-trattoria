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
        // Fallback: Attempt to play on user interaction
        const handleUserInteraction = () => {
          video
            .play()
            .catch((err) =>
              console.error("User interaction play failed:", err)
            );
        };
        document.addEventListener("touchstart", handleUserInteraction, {
          once: true,
        });
        return () => {
          document.removeEventListener("touchstart", handleUserInteraction);
        };
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
        src="https://res.cloudinary.com/dc5jx2yo7/video/upload/q_auto,f_mp4/v1749570162/egp8n38xx3wmpyg42jnx.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/video-poster.jpg"
        aria-hidden="true"
      >
        <source
          src="https://res.cloudinary.com/dc5jx2yo7/video/upload/q_auto,f_mp4/v1749570162/egp8n38xx3wmpyg42jnx.mp4"
          type="video/mp4"
        />
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
