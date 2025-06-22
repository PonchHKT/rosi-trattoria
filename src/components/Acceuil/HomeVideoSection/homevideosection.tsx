import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ComingSoonModal from "../ComingSoonModal/ComingSoonModal";
import "./homevideosection.scss";

const HomeVideoSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShouldLoadVideo(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!shouldLoadVideo) return;
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => setIsVideoLoaded(true);

    const tryPlay = async () => {
      try {
        await video.play();
      } catch {
        const handleUserInteraction = () => {
          video.play().catch(console.error);
        };
        document.addEventListener("touchstart", handleUserInteraction, {
          once: true,
        });
        return () => {
          document.removeEventListener("touchstart", handleUserInteraction);
        };
      }
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("loadedmetadata", tryPlay);
    video.addEventListener("canplay", tryPlay);

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("loadedmetadata", tryPlay);
      video.removeEventListener("canplay", tryPlay);
    };
  }, [shouldLoadVideo]);

  const handleDistributorClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleCarteClick = () => navigate("/carte");

  const handleClickCollectClick = () => {
    window.open(
      "https://carte.rosi-trattoria.com/menu",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <section className="home-video-section">
      <div className="hero-background" />

      {shouldLoadVideo && (
        <video
          ref={videoRef}
          className={`background-video ${isVideoLoaded ? "loaded" : "loading"}`}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          aria-label="Vidéo de présentation du restaurant Rosi Trattoria"
        >
          <source
            src="https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Vid%C3%A9o%20Rosi/homevideo.mp4"
            type="video/mp4"
          />
          <p>
            Découvrez l'ambiance chaleureuse de Rosi Trattoria, votre restaurant
            italien bio situé à Brive-la-Gaillarde. Une cuisine authentique dans
            un cadre convivial.
          </p>
        </video>
      )}

      <div className="logo-container">
        <img
          src="/images/logo/rositrattorialogo.png"
          alt="Rosi Trattoria - Restaurant italien bio à Brive-la-Gaillarde"
          className="logo"
          width="200"
          height="100"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </div>

      <div className="content">
        <h1 className="slogan">Du bon, du bio, de la joie, c'est Rosi !</h1>

        <address className="address-container">
          <svg
            className="location-icon"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
              fill="currentColor"
            />
          </svg>
          <span className="address-text">
            11 Prom. des Tilleuls{isMobile ? <br /> : ","} 19100
            Brive-la-Gaillarde
          </span>
        </address>

        <nav
          className="buttons"
          role="navigation"
          aria-label="Actions principales du restaurant"
        >
          <a
            href="https://bookings.zenchef.com/results?rid=356394&fullscreen=1"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Réserver une table chez Rosi Trattoria (nouvelle fenêtre)"
          >
            <button className="primary-button">Réserver</button>
          </a>
          <button
            className="secondary-button"
            onClick={handleCarteClick}
            aria-label="Consulter la carte des plats et boissons"
          >
            Voir la carte
          </button>
          <button
            className="distributor-button"
            onClick={handleDistributorClick}
            aria-label="Accéder au distributeur automatique de pizzas"
          >
            Distributeur
            <img
              src="/images/logo/pizza.png"
              alt=""
              className="distributor-icon rotating-pizza"
              style={{
                width: "24px",
                height: "24px",
                objectFit: "contain",
              }}
              aria-hidden="true"
              loading="lazy"
              decoding="async"
            />
          </button>
          <button
            className="white-button"
            onClick={handleClickCollectClick}
            aria-label="Commander en Click & Collect (nouvelle fenêtre)"
          >
            Click & Collect
          </button>
        </nav>
      </div>

      <ComingSoonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <style>{`
        .rotating-pizza {
          animation: rotate 10s linear infinite;
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .hero-background {
          position: absolute;
          top: -100px;
          height: calc(100% + 200px);
          left: 0;
          width: 100%;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          filter: brightness(50%) contrast(1.1);
          z-index: 1;
          transform: translateZ(0);
        }
        .background-video.loading {
          opacity: 0;
        }
        .background-video.loaded {
          opacity: 1;
          transition: opacity 0.8s ease-in-out;
          z-index: 2;
        }
      `}</style>
    </section>
  );
};

export default HomeVideoSection;
