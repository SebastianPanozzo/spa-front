import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/effect-coverflow';

// CSS para quitar sombras del efecto coverflow
const sliderStyles = `
  .swiper-slide-shadow-left,
  .swiper-slide-shadow-right {
    display: none !important;
  }
`;

const Slider = ({ context }) => {
  const { items, Component, onItemClick, showReserveButton = false } = context;

  return (
    <div className="slider-container" style={{ padding: '20px 0' }}>
      {/* Inyectamos estilos directamente */}
      <style>{sliderStyles}</style>

      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          800: {
            slidesPerView: 2,
          },
          1200: {
            slidesPerView: 3,
          },
        }}
        navigation
        pagination={{
          clickable: true,
          dynamicBullets: true
        }}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={true}
      >
        {items.map((item, idx) => (
          <SwiperSlide key={`slide-${idx}`}>
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ height: '50vh', width: '100%' }}
            >
              <Component
                context={item}
                onClick={onItemClick}
                showReserveButton={showReserveButton}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slider;
