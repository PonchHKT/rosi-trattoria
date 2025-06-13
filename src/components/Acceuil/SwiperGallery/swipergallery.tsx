import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
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
          modules={[Autoplay, Navigation, EffectFade]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          navigation
          effect="fade"
          fadeEffect={{ crossFade: true }}
          className="my-swiper"
          lazyPreloadPrevNext={1}
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
