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
        <div className="address-container">
          <svg
            className="location-icon"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
              fill="currentColor"
            />
          </svg>
          <span className="address-text">
            11 Prom. des Tilleuls, 19100 Brive-la-Gaillarde
          </span>
        </div>
        <div className="buttons">
          <a
            href="https://bookings.zenchef.com/results?rid=356394&fullscreen=1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="primary-button">Réserver</button>
          </a>
          <button className="secondary-button">Voir le menu</button>
          <a
            href="https://carte.rosi-trattoria.com/menu"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="white-button">Click & Collect</button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HomeVideoSection;
