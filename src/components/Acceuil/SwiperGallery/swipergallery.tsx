import React, { useRef, useCallback, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/effect-coverflow";
import "./swipergallery.scss";

type Slide = {
  id: number;
  src: string;
  alt: string;
  title: string;
};

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

  const slides = useMemo(() => {
    const baseUrl =
      "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/";

    const slidesData: Array<{ filename: string; alt: string; title: string }> =
      [
        {
          filename: "brie-de-meaux-fourrer.jpg",
          alt: "Brie de Meaux fourré - fromage italien artisanal Rosi Trattoria Brive",
          title: "Brie de Meaux fourré - Spécialité fromagère italienne",
        },
        {
          filename: "carpaccio-de-bresaola.jpg",
          alt: "Carpaccio de bresaola - charcuterie italienne traditionnelle Rosi Trattoria",
          title: "Carpaccio de bresaola - Antipasti italien authentique",
        },
        {
          filename: "creme-bruler-cafe-tiramitsu.jpg",
          alt: "Crème brûlée café tiramisu - dessert italien maison Rosi Trattoria Brive",
          title: "Crème brûlée café tiramisu - Dolce italien fait maison",
        },
        {
          filename: "devanture-rosi-trattoria.JPG",
          alt: "Devanture Rosi Trattoria restaurant italien Brive-la-Gaillarde pizzeria",
          title: "Façade du restaurant Rosi Trattoria à Brive-la-Gaillarde",
        },
        {
          filename: "four-au-feu-de-bois.JPG",
          alt: "Four à bois traditionnel pizza napolitaine Rosi Trattoria cuisson artisanale",
          title: "Four à feu de bois pour pizzas napolitaines authentiques",
        },
        {
          filename: "four-de-competition.jpg",
          alt: "Four de compétition pizza napolitaine professionnel Rosi Trattoria",
          title: "Four de compétition pour pizzas napolitaines d'exception",
        },
        {
          filename: "four-en-dome-importer-de-genes.jpg",
          alt: "Four en dôme importé de Gênes pizza italienne authentique Rosi Trattoria",
          title: "Four en dôme traditionnel importé directement de Gênes",
        },
        {
          filename: "girafe-rosi-trattoria.jpg",
          alt: "Décoration girafe restaurant Rosi Trattoria ambiance chaleureuse Brive",
          title: "Décoration unique de la girafe - Ambiance Rosi Trattoria",
        },
        {
          filename: "interieur-rosi-trattoria.jpg",
          alt: "Intérieur restaurant italien Rosi Trattoria Brive décoration authentique",
          title: "Intérieur chaleureux du restaurant Rosi Trattoria",
        },
        {
          filename: "mini-teglia.jpg",
          alt: "Mini teglia pizza carrée italienne Rosi Trattoria spécialité romaine",
          title: "Mini teglia - Pizza carrée à la romaine",
        },
        {
          filename: "pain-perdu-caramel-et.jpg",
          alt: "Pain perdu caramel dessert italien maison Rosi Trattoria Brive",
          title: "Pain perdu au caramel - Dessert italien revisité",
        },
        {
          filename:
            "panna-cotta-au-coulis-de-fruits-rouges-facile-et-pas-chere.jpeg",
          alt: "Panna cotta coulis fruits rouges dessert italien traditionnel Rosi Trattoria",
          title: "Panna cotta aux fruits rouges - Dolce italien classique",
        },
        {
          filename: "pasta-al-carbonara.jpg",
          alt: "Pâtes carbonara italiennes authentiques Rosi Trattoria Brive recette traditionnelle",
          title: "Pasta alla carbonara - Recette traditionnelle romaine",
        },
        {
          filename: "pasta-du-chef.jpg",
          alt: "Pâtes du chef spécialité italienne Rosi Trattoria création culinaire",
          title: "Pasta du chef - Création culinaire italienne signature",
        },
        {
          filename: "pasta-fraiche-creme-de.jpg",
          alt: "Pâtes fraîches crème spécialité italienne maison Rosi Trattoria Brive",
          title: "Pâtes fraîches à la crème - Spécialité maison",
        },
        {
          filename: "pate-fraiche-maison-manzoni.jpg",
          alt: "Pâtes fraîches maison Manzoni restaurant italien Rosi Trattoria artisanal",
          title: "Pâtes fraîches Manzoni - Fabrication artisanale maison",
        },
        {
          filename: "pates-fraiche-maison.jpg",
          alt: "Pâtes fraîches maison italiennes artisanales Rosi Trattoria Brive",
          title: "Pâtes fraîches maison - Savoir-faire italien traditionnel",
        },
        {
          filename: "pizza-du-jour.jpg",
          alt: "Pizza du jour spécialité napolitaine Rosi Trattoria Brive création quotidienne",
          title: "Pizza du jour - Création quotidienne napolitaine",
        },
        {
          filename: "pizza-du-menu-saumon-frais.jpg",
          alt: "Pizza saumon frais napolitaine Rosi Trattoria Brive produits locaux",
          title: "Pizza au saumon frais - Napolitaine aux produits frais",
        },
        {
          filename: "pizza-jambon.jpg",
          alt: "Pizza jambon napolitaine traditionnelle Rosi Trattoria Brive four à bois",
          title: "Pizza au jambon - Napolitaine cuite au feu de bois",
        },
        {
          filename: "pizza-pour-les-championnats.jpg",
          alt: "Pizza championnat compétition napolitaine Rosi Trattoria excellence culinaire",
          title: "Pizza de compétition - Excellence napolitaine primée",
        },
        {
          filename: "pizza-rosi-trattoria.jpg",
          alt: "Pizza signature Rosi Trattoria napolitaine artisanale Brive-la-Gaillarde",
          title: "Pizza signature Rosi Trattoria - Napolitaine d'exception",
        },
        {
          filename: "planche-de-chacuterie.jpg",
          alt: "Planche charcuterie italienne antipasti Rosi Trattoria Brive produits authentiques",
          title: "Planche de charcuterie italienne - Antipasti traditionnels",
        },
        {
          filename: "salade-burrata-et-saumon.jpg",
          alt: "Salade burrata saumon italien frais Rosi Trattoria Brive mozzarella artisanale",
          title: "Salade burrata et saumon - Fraîcheur italienne premium",
        },
        {
          filename: "salle-de-restaurant.jpg",
          alt: "Salle restaurant italien Rosi Trattoria Brive ambiance conviviale pizzeria",
          title: "Salle de restaurant - Ambiance conviviale à l'italienne",
        },
      ];

    const slidesArray = slidesData.map((slide, index) => ({
      id: index,
      src: baseUrl + slide.filename,
      alt: slide.alt,
      title: slide.title,
    }));

    return shuffleArray(slidesArray);
  }, []);

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
                title={slide.title}
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
