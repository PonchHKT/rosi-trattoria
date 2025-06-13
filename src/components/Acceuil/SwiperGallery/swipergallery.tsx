import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/effect-coverflow";
import "./swipergallery.scss";

const SwiperGallery: React.FC = () => {
  const initialSlide = useMemo(() => Math.floor(Math.random() * 11), []);

  return (
    <div className="gallery-container">
      <div className="gallery-wrapper">
        {/* Animated border lines */}
        <div className="animatedBorder1"></div>
        <div className="animatedBorder2"></div>
        <div className="animatedBorder3"></div>
        <div className="animatedBorder4"></div>

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
          slidesPerView={3}
          spaceBetween={30}
          className="my-swiper"
          lazyPreloadPrevNext={2}
          touchRatio={1}
          simulateTouch={true}
          allowTouchMove={true}
          resistance={true}
          resistanceRatio={0.85}
        >
          {[...Array(11).keys()].map((i) => (
            <SwiperSlide key={i}>
              <div className="swiper-slide-overlay" />
              <img
                src={`/images/swiper/${i + 1}.jpg`}
                alt={`Slide ${i + 1} of the gallery`}
                className="swiper-image"
                loading="lazy"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default SwiperGallery;
