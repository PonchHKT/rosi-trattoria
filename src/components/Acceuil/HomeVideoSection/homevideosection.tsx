import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ReactGA from "react-ga4";
import ComingSoonModal from "../ComingSoonModal/ComingSoonModal";
import "./homevideosection.scss";

const HomeVideoSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasTrackedVideoStart, setHasTrackedVideoStart] = useState(false);
  const [hasTrackedVideoView, setHasTrackedVideoView] = useState(false);
  const navigate = useNavigate();

  // Configuration Cloudinary
  const CLOUDINARY_CONFIG = {
    cloudName: "dc5jx2yo7",
    publicId: "nlqz6yqlcffaf4h5mudk",
  };

  // Génération des URLs Cloudinary optimisées
  const getCloudinaryVideoUrl = useCallback(
    (format: string = "mp4", quality: string = "auto") => {
      const width = isMobile ? "1080" : "1920";
      const height = isMobile ? "607" : "1080";

      const transformations = [
        "f_" + format,
        "q_" + quality,
        `w_${width}`,
        `h_${height}`,
        "c_fill",
        "g_center",
        "e_brightness:30",
        "fl_immutable_cache",
      ];

      return `https://res.cloudinary.com/${
        CLOUDINARY_CONFIG.cloudName
      }/video/upload/${transformations.join(",")}/${
        CLOUDINARY_CONFIG.publicId
      }.${format}`;
    },
    [isMobile]
  );

  const getCloudinaryPosterUrl = useCallback(() => {
    const width = isMobile ? "1080" : "1920";
    const height = isMobile ? "607" : "1080";

    const transformations = [
      "f_jpg",
      "q_auto:good",
      `w_${width}`,
      `h_${height}`,
      "c_fill",
      "g_center",
      "e_brightness:30",
      "fl_immutable_cache",
      "so_0", // Extract frame at 0 seconds
    ];

    return `https://res.cloudinary.com/${
      CLOUDINARY_CONFIG.cloudName
    }/video/upload/${transformations.join(",")}/${
      CLOUDINARY_CONFIG.publicId
    }.jpg`;
  }, [isMobile]);

  // Optimisation : Vérification mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();

    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(checkMobile);
      resizeObserver.observe(document.body);
      return () => resizeObserver.disconnect();
    } else {
      window.addEventListener("resize", checkMobile, { passive: true });
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);

  // Optimisation : Intersection Observer pour le lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);

          if (!hasTrackedVideoView) {
            ReactGA.event({
              action: "view_hero_section",
              category: "engagement",
              label: "hero_video_section_viewed",
            });
            setHasTrackedVideoView(true);
          }

          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    const currentElement = document.querySelector(".home-video-section");
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => observer.disconnect();
  }, [hasTrackedVideoView]);

  // Optimisation : Chargement conditionnel de la vidéo
  useEffect(() => {
    if (isIntersecting) {
      const delay = isMobile ? 0 : 200;
      const timer = setTimeout(() => setShouldLoadVideo(true), delay);
      return () => clearTimeout(timer);
    }
  }, [isIntersecting, isMobile]);

  // Optimisation : Gestion de la vidéo
  const handleVideoLoad = useCallback(() => {
    setIsVideoLoaded(true);

    ReactGA.event({
      action: "video_loaded",
      category: "media",
      label: "hero_video_loaded_successfully",
    });
  }, []);

  const handleVideoError = useCallback(() => {
    console.warn("Erreur de chargement vidéo");

    ReactGA.event({
      action: "video_error",
      category: "media",
      label: "hero_video_load_failed",
    });
  }, []);

  const handleVideoPlay = useCallback(() => {
    if (!hasTrackedVideoStart) {
      ReactGA.event({
        action: "video_start",
        category: "media",
        label: "hero_video_started_playing",
      });
      setHasTrackedVideoStart(true);
    }
  }, [hasTrackedVideoStart]);

  useEffect(() => {
    if (!shouldLoadVideo) return;

    const video = videoRef.current;
    if (!video) return;

    const tryPlay = async () => {
      try {
        const prefersReducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;
        if (prefersReducedMotion) return;

        await video.play();
      } catch (error) {
        const handleUserClick = () => {
          video.play().catch(() => {});
        };
        document.addEventListener("click", handleUserClick, { once: true });
      }
    };

    video.addEventListener("loadeddata", handleVideoLoad);
    video.addEventListener("error", handleVideoError);
    video.addEventListener("canplaythrough", tryPlay);
    video.addEventListener("play", handleVideoPlay);

    return () => {
      video.removeEventListener("loadeddata", handleVideoLoad);
      video.removeEventListener("error", handleVideoError);
      video.removeEventListener("canplaythrough", tryPlay);
      video.removeEventListener("play", handleVideoPlay);
    };
  }, [shouldLoadVideo, handleVideoLoad, handleVideoError, handleVideoPlay]);

  const handleDistributorClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setIsModalOpen(true);

      ReactGA.event({
        action: "click_distributor_button",
        category: "engagement",
        label: "distributor_modal_opened",
      });
    },
    []
  );

  const handleCarteClick = useCallback(() => {
    ReactGA.event({
      action: "click_carte_button",
      category: "navigation",
      label: "navigate_to_carte",
    });

    navigate("/carte");
  }, [navigate]);

  const handleReservationClick = useCallback(() => {
    ReactGA.event({
      action: "click_reservation_button",
      category: "conversion",
      label: "external_reservation_zenchef",
    });
  }, []);

  const handleClickCollectClick = useCallback(() => {
    ReactGA.event({
      action: "click_collect_button",
      category: "conversion",
      label: "external_click_collect",
    });

    window.open(
      "https://carte.rosi-trattoria.com/menu",
      "_blank",
      "noopener,noreferrer"
    );
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);

    ReactGA.event({
      action: "close_distributor_modal",
      category: "engagement",
      label: "distributor_modal_closed",
    });
  }, []);

  // Track scroll past hero section
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector(".home-video-section");
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        const isScrolledPast = rect.bottom < 0;

        if (isScrolledPast) {
          ReactGA.event({
            action: "scroll_past_hero",
            category: "engagement",
            label: "user_scrolled_past_hero_section",
          });

          window.removeEventListener("scroll", handleScroll);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="home-video-section">
      {/* Arrière-plan temporaire pendant le chargement vidéo */}
      <div
        className="video-placeholder"
        style={{
          backgroundImage: `url(${getCloudinaryPosterUrl()})`,
          opacity: isVideoLoaded ? 0 : 1,
        }}
      />

      {shouldLoadVideo && (
        <video
          ref={videoRef}
          className={`background-video ${isVideoLoaded ? "loaded" : "loading"}`}
          autoPlay
          muted
          loop
          playsInline
          preload={isMobile ? "metadata" : "none"}
          poster={getCloudinaryPosterUrl()}
          aria-label="Vidéo de présentation du restaurant Rosi Trattoria"
        >
          <source
            src={getCloudinaryVideoUrl(
              "mp4",
              isMobile ? "auto:low" : "auto:good"
            )}
            type="video/mp4"
          />
          <source
            src={getCloudinaryVideoUrl(
              "webm",
              isMobile ? "auto:low" : "auto:good"
            )}
            type="video/webm"
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
        <h1 className="slogan">
          {isMobile ? (
            <>
              Du bon, du bio, de la joie,
              <br />
              c'est Rosi !
            </>
          ) : (
            "Du bon, du bio, de la joie, c'est Rosi !"
          )}
        </h1>

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
            onClick={handleReservationClick}
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

      <ComingSoonModal isOpen={isModalOpen} onClose={closeModal} />

      <style>{`
        .rotating-pizza {
          animation: rotate 10s linear infinite;
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .rotating-pizza {
            animation: none;
          }
          .background-video.loaded {
            transition: none;
          }
          .video-placeholder {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
};

export default HomeVideoSection;
