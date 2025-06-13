import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "./swipergallery.scss"; // Ensure you have a CSS file for custom styles

const SwiperGallery: React.FC = () => {
  const initialSlide = useMemo(() => Math.floor(Math.random() * 11), []);

  return (
    <Swiper
      initialSlide={initialSlide}
      modules={[Autoplay, Navigation, EffectFade]}
      autoplay={{ delay: 3001, disableOnInteraction: false }}
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
  );
};

export default SwiperGallery;
