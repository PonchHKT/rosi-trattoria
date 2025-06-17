import React, { useRef, useCallback, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/effect-coverflow";
import "./swipergallery.scss";

// Fonction pour mélanger un tableau// Définir un type pour les slides
type Slide = {
  id: number;
  src: string;
  alt: string;
};

// Fonction pour mélanger un tableau
const shuffleArray = (array: Slide[]): Slide[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const SwiperGallery: React.FC = () => {
  const swiperRef = useRef<SwiperType | null>(null);

  // Génère et mélange les slides
  const slides = useMemo(() => {
    const slidesArray = [...Array(40).keys()].map((i) => ({
      id: i,
      src: `/images/swiper/${i + 1}.jpg`,
      alt: `Slide ${i + 1} of the gallery`,
    }));
    return shuffleArray(slidesArray);
  }, []);

  // Le reste de votre code reste inchangé
  const randomInitialSlide = useMemo(() => {
    return Math.floor(Math.random() * slides.length);
  }, [slides.length]);

  const swiperConfig = useMemo(
    () => ({
      initialSlide: randomInitialSlide,
      modules: [Autoplay, EffectCoverflow],
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
        waitForTransition: false,
      },
      navigation: false,
      effect: "coverflow",
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
      lazy: {
        loadPrevNext: true,
        loadPrevNextAmount: 2,
        loadOnTransitionStart: true,
      },
      preloadImages: false,
      updateOnImagesReady: false,
      watchSlidesProgress: true,
      watchOverflow: true,
      touchRatio: 1,
      simulateTouch: true,
      allowTouchMove: true,
      resistance: true,
      resistanceRatio: 0.85,
      roundLengths: true,
      preventInteractionOnTransition: false,
      breakpoints: {
        0: {
          slidesPerView: 1.2,
          spaceBetween: 10,
          centeredSlides: true,
          effect: "slide",
          coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 0,
            modifier: 1,
            slideShadows: false,
          },
          autoplay: false,
        },
        401: {
          slidesPerView: 1.3,
          spaceBetween: 15,
          centeredSlides: true,
          effect: "slide",
          coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 0,
            modifier: 1,
            slideShadows: false,
          },
          autoplay: {
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
            waitForTransition: false,
          },
        },
        641: {
          slidesPerView: 1.8,
          spaceBetween: 20,
          centeredSlides: true,
          effect: "coverflow",
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
          effect: "coverflow",
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
    [randomInitialSlide]
  );

  const onSwiper = useCallback((swiper: SwiperType) => {
    swiperRef.current = swiper;
  }, []);

  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      img.style.display = "none";
      console.warn(`Impossible de charger l'image: ${img.src}`);
    },
    []
  );

  const handleImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      img.style.opacity = "1";
    },
    []
  );

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
                decoding="async"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, 33vw"
                style={{
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                  cursor: "pointer",
                }}
                onLoad={handleImageLoad}
                onError={handleImageError}
                onClick={() => handleSlideClick(slide.id)}
                {...(slide.id < 3 && { fetchPriority: "high" })}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default React.memo(SwiperGallery);
