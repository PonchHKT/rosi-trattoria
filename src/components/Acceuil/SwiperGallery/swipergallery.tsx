import React, { useRef, useCallback, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/effect-coverflow";
import "./swipergallery.scss";

const SwiperGallery: React.FC = () => {
  const swiperRef = useRef<SwiperType | null>(null);

  // Mémorise les slides pour éviter les re-renders
  const slides = useMemo(
    () =>
      [...Array(11).keys()].map((i) => ({
        id: i,
        src: `/images/swiper/${i + 1}.jpg`,
        alt: `Slide ${i + 1} of the gallery`,
      })),
    []
  );

  // Génère un index aléatoire pour la slide initiale
  const randomInitialSlide = useMemo(() => {
    return Math.floor(Math.random() * slides.length);
  }, [slides.length]);

  // Configuration mémorisée pour éviter les re-créations
  const swiperConfig = useMemo(
    () => ({
      initialSlide: randomInitialSlide, // ✨ Utilise l'index aléatoire
      modules: [Autoplay, EffectCoverflow],
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
        waitForTransition: false, // Améliore les performances
      },
      navigation: false,
      effect: "coverflow" as const,
      coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      },
      loop: true,
      centeredSlides: true,
      slidesPerView: 1,
      spaceBetween: 20,
      className: "my-swiper",

      // Optimisations critiques pour les performances
      lazy: {
        loadPrevNext: true,
        loadPrevNextAmount: 2,
        loadOnTransitionStart: true,
      },
      preloadImages: false, // Désactive le préchargement automatique
      updateOnImagesReady: false, // N'attend pas que toutes les images soient chargées
      watchSlidesProgress: true,
      watchOverflow: true,

      // Optimisations touch/mobile
      touchRatio: 1,
      simulateTouch: true,
      allowTouchMove: true,
      resistance: true,
      resistanceRatio: 0.85,

      // Performance optimizations
      roundLengths: true, // Arrondit les longueurs pour éviter les problèmes de rendu
      preventInteractionOnTransition: false,

      breakpoints: {
        0: {
          slidesPerView: 1.2,
          spaceBetween: 10,
          centeredSlides: true,
          effect: "slide" as const,
          coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 0,
            modifier: 1,
            slideShadows: false,
          },
          // Désactive l'autoplay sur très petits écrans pour économiser la batterie
          autoplay: false,
        },
        401: {
          slidesPerView: 1.3,
          spaceBetween: 15,
          centeredSlides: true,
          effect: "slide" as const,
          coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 0,
            modifier: 1,
            slideShadows: false,
          },
          autoplay: {
            delay: 5000, // Plus lent sur mobile
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
            waitForTransition: false,
          },
        },
        641: {
          slidesPerView: 1.8,
          spaceBetween: 20,
          centeredSlides: true,
          effect: "coverflow" as const,
          coverflowEffect: {
            rotate: 40,
            stretch: 0,
            depth: 80,
            modifier: 1,
            slideShadows: true,
          },
          autoplay: {
            delay: 4500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
            waitForTransition: false,
          },
        },
        769: {
          slidesPerView: 3,
          spaceBetween: 30,
          centeredSlides: true,
          effect: "coverflow" as const,
          coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          },
          autoplay: {
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
            waitForTransition: false,
          },
        },
      },
    }),
    [randomInitialSlide] // ✨ Ajoute randomInitialSlide comme dépendance
  );

  // Callback optimisé pour l'initialisation du swiper
  const onSwiper = useCallback((swiper: SwiperType) => {
    swiperRef.current = swiper;
  }, []);

  // Callback pour gérer les erreurs d'images
  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      img.style.display = "none";
      console.warn(`Impossible de charger l'image: ${img.src}`);
    },
    []
  );

  // Callback pour optimiser le chargement des images
  const handleImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      img.style.opacity = "1";
    },
    []
  );

  // Fonction pour naviguer vers une slide spécifique
  const handleSlideClick = useCallback((slideIndex: number) => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(slideIndex);
    }
  }, []);

  return (
    <div className="gallery-container">
      <div className="gallery-wrapper">
        <Swiper {...swiperConfig} onSwiper={onSwiper}>
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="swiper-slide-overlay" />
              <img
                src={slide.src}
                alt={slide.alt}
                className="swiper-image"
                loading="lazy"
                decoding="async" // Améliore les performances de décodage
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, 33vw"
                style={{
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                  cursor: "pointer", // Indique que l'image est cliquable
                }}
                onLoad={handleImageLoad}
                onError={handleImageError}
                onClick={() => handleSlideClick(slide.id)}
                // Préchargement conditionnel pour les premières images
                {...(slide.id < 3 && { fetchPriority: "high" as const })}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default React.memo(SwiperGallery);
