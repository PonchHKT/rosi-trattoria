import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/effect-coverflow";
import "./swipergallery.scss";

const SwiperGallery: React.FC = () => {
  const initialSlide = 0;

  return (
    <div className="gallery-container">
      <div className="gallery-wrapper">
        <Swiper
          initialSlide={initialSlide}
          modules={[Autoplay, EffectCoverflow]}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          navigation={false}
          effect="coverflow"
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          loop={true}
          centeredSlides={true}
          slidesPerView={1}
          spaceBetween={20}
          className="my-swiper"
          lazyPreloadPrevNext={2}
          touchRatio={1}
          simulateTouch={true}
          allowTouchMove={true}
          resistance={true}
          resistanceRatio={0.85}
          // Optimisations mobiles importantes
          watchSlidesProgress={true}
          watchOverflow={true}
          freeMode={false}
          breakpoints={{
            // Mobile très petit (jusqu'à 400px)
            0: {
              slidesPerView: 1.2, // Montre légèrement les slides adjacentes
              spaceBetween: 10,
              centeredSlides: true,
              effect: "slide", // Désactive coverflow sur mobile
              coverflowEffect: {
                rotate: 0,
                stretch: 0,
                depth: 0,
                modifier: 1,
                slideShadows: false,
              },
            },
            // Mobile (401px à 640px)
            401: {
              slidesPerView: 1.3, // Montre un peu plus les slides adjacentes
              spaceBetween: 15,
              centeredSlides: true,
              effect: "slide", // Désactive coverflow sur mobile
              coverflowEffect: {
                rotate: 0,
                stretch: 0,
                depth: 0,
                modifier: 1,
                slideShadows: false,
              },
            },
            // Tablette portrait (641px à 768px)
            641: {
              slidesPerView: 1.8,
              spaceBetween: 20,
              centeredSlides: true,
              effect: "coverflow", // Active coverflow sur tablette
              coverflowEffect: {
                rotate: 40,
                stretch: 0,
                depth: 80,
                modifier: 1,
                slideShadows: true,
              },
            },
            // Desktop (769px et plus)
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
            },
          }}
        >
          {[...Array(11).keys()].map((i) => (
            <SwiperSlide key={i}>
              <div className="swiper-slide-overlay" />
              <img
                src={`/images/swiper/${i + 1}.jpg`}
                alt={`Slide ${i + 1} of the gallery`}
                className="swiper-image"
                loading="lazy"
                // Optimisations images mobiles
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, 33vw"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default SwiperGallery;
