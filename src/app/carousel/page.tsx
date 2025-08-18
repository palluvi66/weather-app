"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import Image from "next/image";

const images = ["https://imengine.public.prod.cmg.infomaker.io/?uuid=84860344-c8d8-51ee-b191-943a4ff8b68d&function=cropresize&type=preview&source=false&q=75&crop_w=0.99999&crop_h=0.9997&x=0&y=0&width=1200&height=675", "https://i.pinimg.com/736x/6b/b9/a6/6bb9a6f5899cb5e4340b1925b44aae29.jpg", "https://dailytrust.com/wp-content/uploads/2023/05/rain.jpg"];

export default function CarouselComponent() {
  return (
    <Swiper 

      modules={[Autoplay]}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop={true}
      className="w-full h-full "
    >
      {images.map((src, index) => (
        <SwiperSlide key={index}>
          <Image 
            src={src}
            alt={`Slide ${index}`}
            fill
            className="object-cover "
            priority
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
