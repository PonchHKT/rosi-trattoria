import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ReactGA from "react-ga4";
import ComingSoonModal from "../ComingSoonModal/ComingSoonModal";
import "./homevideosection.scss";
// Événements GA4 optimisés avec convention snake_case
const GA4_EVENTS = {
    // Événements d'engagement utilisateur
    VIDEO_ENGAGEMENT: "accueil_video_engagement",
    PAGE_SCROLL_PAST_HERO: "accueil_section_scroll_past",
    // Actions utilisateur significatives
    RESERVATION_CLICK: "accueil_reservation_click",
    MENU_VIEW_CLICK: "accueil_menu_view_click",
    DISTRIBUTOR_MODAL_OPEN: "accueil_distributor_modal_open",
    CLICK_COLLECT_REDIRECT: "accueil_click_collect_redirect",
    // Erreurs techniques critiques
    VIDEO_LOAD_ERROR: "accueil_video_error",
};
const HomeVideoSection = ({ pageName = "Accueil", }) => {
    const videoRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isIntersecting, setIsIntersecting] = useState(false);
    // États pour tracking optimisé
    const [hasTrackedVideoEngagement, setHasTrackedVideoEngagement] = useState(false);
    const [hasTrackedScrollPast, setHasTrackedScrollPast] = useState(false);
    const engagementTimerRef = useRef(null);
    const navigate = useNavigate();
    // Configuration Cloudinary (inchangée)
    const CLOUDINARY_CONFIG = {
        cloudName: "dc5jx2yo7",
        publicId: "nlqz6yqlcffaf4h5mudk",
    };
    const getCloudinaryVideoUrl = useCallback((format = "mp4", quality = "auto") => {
        const width = isMobile ? "1080" : "1920";
        const height = isMobile ? "607" : "1080";
        const transformations = [
            "f_" + format,
            "q_" + quality,
            `w_${width}`,
            `h_${height}`,
            "c_fill",
            "g_center",
            "e_brightness:15",
            "fl_immutable_cache",
        ];
        return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/video/upload/${transformations.join(",")}/${CLOUDINARY_CONFIG.publicId}.${format}`;
    }, [isMobile]);
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
            "so_0",
        ];
        return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/video/upload/${transformations.join(",")}/${CLOUDINARY_CONFIG.publicId}.jpg`;
    }, [isMobile]);
    // Détection mobile optimisée
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        if (window.ResizeObserver) {
            const resizeObserver = new ResizeObserver(checkMobile);
            resizeObserver.observe(document.body);
            return () => resizeObserver.disconnect();
        }
        else {
            window.addEventListener("resize", checkMobile, { passive: true });
            return () => window.removeEventListener("resize", checkMobile);
        }
    }, []);
    // Intersection Observer pour engagement vidéo
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsIntersecting(true);
                // Démarrer timer d'engagement - tracking après 3 secondes de visibilité
                if (!hasTrackedVideoEngagement) {
                    engagementTimerRef.current = setTimeout(() => {
                        ReactGA.event(GA4_EVENTS.VIDEO_ENGAGEMENT, {
                            page_name: pageName,
                            device_type: isMobile ? "mobile" : "desktop",
                            engagement_duration: 3000, // 3 secondes
                        });
                        setHasTrackedVideoEngagement(true);
                    }, 3000);
                }
                observer.disconnect();
            }
        }, {
            threshold: 0.5, // 50% de la vidéo visible
            rootMargin: "0px",
        });
        const currentElement = document.querySelector(".home-video-section");
        if (currentElement) {
            observer.observe(currentElement);
        }
        return () => {
            observer.disconnect();
            if (engagementTimerRef.current) {
                clearTimeout(engagementTimerRef.current);
            }
        };
    }, [hasTrackedVideoEngagement, pageName, isMobile]);
    // Chargement conditionnel de la vidéo
    useEffect(() => {
        if (isIntersecting) {
            const delay = isMobile ? 0 : 200;
            const timer = setTimeout(() => setShouldLoadVideo(true), delay);
            return () => clearTimeout(timer);
        }
    }, [isIntersecting, isMobile]);
    // Gestion des événements vidéo optimisée
    const handleVideoLoad = useCallback(() => {
        setIsVideoLoaded(true);
        // Supprimé : tracking automatique du chargement (pas de valeur business)
    }, []);
    const handleVideoError = useCallback(() => {
        console.warn("Erreur de chargement vidéo");
        // Tracking uniquement des erreurs critiques
        ReactGA.event(GA4_EVENTS.VIDEO_LOAD_ERROR, {
            page_name: pageName,
            device_type: isMobile ? "mobile" : "desktop",
            error_type: "video_load_failed",
        });
    }, [pageName, isMobile]);
    // Supprimé : handleVideoPlay (redondant avec l'engagement timer)
    useEffect(() => {
        if (!shouldLoadVideo)
            return;
        const video = videoRef.current;
        if (!video)
            return;
        const tryPlay = async () => {
            try {
                const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                if (prefersReducedMotion)
                    return;
                await video.play();
            }
            catch (error) {
                const handleUserClick = () => {
                    video.play().catch(() => { });
                };
                document.addEventListener("click", handleUserClick, { once: true });
            }
        };
        video.addEventListener("loadeddata", handleVideoLoad);
        video.addEventListener("error", handleVideoError);
        video.addEventListener("canplaythrough", tryPlay);
        return () => {
            video.removeEventListener("loadeddata", handleVideoLoad);
            video.removeEventListener("error", handleVideoError);
            video.removeEventListener("canplaythrough", tryPlay);
        };
    }, [shouldLoadVideo, handleVideoLoad, handleVideoError]);
    // Actions utilisateur avec tracking optimisé
    const handleDistributorClick = useCallback((e) => {
        e.preventDefault();
        setIsModalOpen(true);
        ReactGA.event(GA4_EVENTS.DISTRIBUTOR_MODAL_OPEN, {
            page_name: pageName,
            button_location: "hero_section",
            user_type: "potential_customer",
        });
    }, [pageName]);
    const handleCarteClick = useCallback(() => {
        ReactGA.event(GA4_EVENTS.MENU_VIEW_CLICK, {
            page_name: pageName,
            destination: "menu_page",
            click_location: "hero_section",
        });
        navigate("/carte");
    }, [navigate, pageName]);
    const handleReservationClick = useCallback(() => {
        ReactGA.event(GA4_EVENTS.RESERVATION_CLICK, {
            page_name: pageName,
            reservation_platform: "zenchef",
            click_location: "hero_section",
            button_type: "primary_cta",
        });
    }, [pageName]);
    const handleClickCollectClick = useCallback(() => {
        ReactGA.event(GA4_EVENTS.CLICK_COLLECT_REDIRECT, {
            page_name: pageName,
            service_type: "click_collect",
            destination_url: "carte.rosi-trattoria.com",
            click_location: "hero_section",
        });
        window.open("https://carte.rosi-trattoria.com/menu", "_blank", "noopener,noreferrer");
    }, [pageName]);
    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        // Supprimé : tracking de fermeture modal (pas de valeur business significative)
    }, []);
    // Tracking scroll optimisé avec debounce
    useEffect(() => {
        let scrollTimeout;
        const handleScroll = () => {
            if (hasTrackedScrollPast)
                return;
            // Debounce pour éviter les multiples déclenchements
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const heroSection = document.querySelector(".home-video-section");
                if (heroSection) {
                    const rect = heroSection.getBoundingClientRect();
                    const isScrolledPast = rect.bottom < window.innerHeight * 0.2; // 20% de la section visible
                    if (isScrolledPast) {
                        ReactGA.event(GA4_EVENTS.PAGE_SCROLL_PAST_HERO, {
                            page_name: pageName,
                            scroll_depth: "hero_section_passed",
                            device_type: isMobile ? "mobile" : "desktop",
                        });
                        setHasTrackedScrollPast(true);
                        window.removeEventListener("scroll", handleScroll);
                    }
                }
            }, 150); // Debounce de 150ms
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
            clearTimeout(scrollTimeout);
        };
    }, [pageName, isMobile, hasTrackedScrollPast]);
    return (_jsxs("section", { className: "home-video-section", children: [_jsx("div", { className: "video-placeholder", style: {
                    backgroundImage: `url(${getCloudinaryPosterUrl()})`,
                    opacity: isVideoLoaded ? 0 : 1,
                } }), shouldLoadVideo && (_jsxs("video", { ref: videoRef, className: `background-video ${isVideoLoaded ? "loaded" : "loading"}`, autoPlay: true, muted: true, loop: true, playsInline: true, preload: isMobile ? "metadata" : "none", poster: getCloudinaryPosterUrl(), "aria-label": "Vid\u00E9o de pr\u00E9sentation du restaurant Rosi Trattoria", children: [_jsx("source", { src: getCloudinaryVideoUrl("mp4", isMobile ? "auto:low" : "auto:good"), type: "video/mp4" }), _jsx("source", { src: getCloudinaryVideoUrl("webm", isMobile ? "auto:low" : "auto:good"), type: "video/webm" }), _jsx("p", { children: "D\u00E9couvrez l'ambiance chaleureuse de Rosi Trattoria, votre restaurant italien bio situ\u00E9 \u00E0 Brive-la-Gaillarde. Une cuisine authentique dans un cadre convivial." })] })), _jsx("div", { className: "logo-container", children: _jsx("img", { src: "/images/logo/rositrattorialogo.png", alt: "Rosi Trattoria - Restaurant italien bio \u00E0 Brive-la-Gaillarde", className: "logo", width: "200", height: "100", loading: "eager", fetchPriority: "high", decoding: "async" }) }), _jsxs("div", { className: "content", children: [_jsx("h1", { className: "slogan", children: isMobile ? (_jsxs(_Fragment, { children: ["Du bon, du bio, de la joie,", _jsx("br", {}), "c'est Rosi !"] })) : ("Du bon, du bio, de la joie, c'est Rosi !") }), _jsxs("address", { className: "address-container", children: [_jsx("svg", { className: "location-icon", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", children: _jsx("path", { d: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z", fill: "currentColor" }) }), _jsxs("span", { className: "address-text", children: ["11 Prom. des Tilleuls", isMobile ? _jsx("br", {}) : ",", " 19100 Brive-la-Gaillarde"] })] }), _jsxs("nav", { className: "buttons", role: "navigation", "aria-label": "Actions principales du restaurant", children: [_jsx("a", { href: "https://bookings.zenchef.com/results?rid=356394&fullscreen=1", target: "_blank", rel: "noopener noreferrer", "aria-label": "R\u00E9server une table chez Rosi Trattoria (nouvelle fen\u00EAtre)", onClick: handleReservationClick, children: _jsx("button", { className: "primary-button", children: "R\u00E9server" }) }), _jsx("button", { className: "secondary-button", onClick: handleCarteClick, "aria-label": "Consulter la carte des plats et boissons", children: "Voir la carte" }), _jsxs("button", { className: "distributor-button", onClick: handleDistributorClick, "aria-label": "Acc\u00E9der au distributeur automatique de pizzas", children: ["Distributeur", _jsx("img", { src: "/images/logo/pizza.png", alt: "", className: "distributor-icon rotating-pizza", style: {
                                            width: "24px",
                                            height: "24px",
                                            objectFit: "contain",
                                        }, "aria-hidden": "true", loading: "lazy", decoding: "async" })] }), _jsx("button", { className: "white-button", onClick: handleClickCollectClick, "aria-label": "Commander en Click & Collect (nouvelle fen\u00EAtre)", children: "Click & Collect" })] })] }), _jsx(ComingSoonModal, { isOpen: isModalOpen, onClose: closeModal }), _jsx("style", { children: `
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
      ` })] }));
};
export default HomeVideoSection;
