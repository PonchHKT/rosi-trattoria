import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import ComingSoonModal from "../ComingSoonModal/ComingSoonModal";
import "./homevideosection.scss";

const HomeVideoSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = async () => {
      try {
        await video.play();
      } catch (error) {
        console.error("Autoplay failed:", error);
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

  const handleDistributorClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  // Handle navigation to Carte page
  const handleCarteClick = () => {
    navigate("/carte");
  };

  return (
    <section className="home-video-section">
      <video
        ref={videoRef}
        className="background-video"
        src="https://res.cloudinary.com/dc5jx2yo7/video/upload/v1749596047/meh8p1qhmgcrzark75wr.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/video-poster.jpg"
        aria-hidden="true"
      >
        <source
          src="https://res.cloudinary.com/dc5jx2yo7/video/upload/v1749596047/meh8p1qhmgcrzark75wr.mp4"
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
          c'est Rosi Trattoria !
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
          <button
            className="secondary-button"
            onClick={handleCarteClick} // Add onClick handler
          >
            Voir la carte
          </button>
          <button
            className="distributor-button"
            onClick={handleDistributorClick}
          >
            <svg
              className="distributor-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V6H20V18ZM6 8H8V10H6V8ZM6 12H8V14H6V12ZM6 16H8V18H6V16ZM10 8H14V10H10V8ZM10 12H14V14H10V12ZM10 16H14V18H10V16ZM16 8H18V10H16V8ZM16 12H18V14H16V12Z"
                fill="currentColor"
              />
            </svg>
            Distributeur
          </button>

          <a
            href="https://carte.rosi-trattoria.com/menu"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="white-button">Click & Collect</button>
          </a>
        </div>
      </div>

      <ComingSoonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default HomeVideoSection;
