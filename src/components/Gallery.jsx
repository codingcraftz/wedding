"use client";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";

const images = Array.from({ length: 20 }, (_, i) => `/gallery/gallery_${i + 1}.jpeg`);

export default function GalleryCarousel() {
  const [sliderRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 1.2,
      spacing: 12,
    },
    mode: "free-snap",
  });

  return (
    <section className="px-4 py-8">
      <h2 className="text-xl font-semibold mb-4 text-center">📸 갤러리</h2>

      <div ref={sliderRef} className="keen-slider">
        {images.map((src, idx) => (
          <div key={idx} className="keen-slider__slide">
            <Image
              src={src}
              alt={`갤러리 이미지 ${idx + 1}`}
              width={300}
              height={300}
              className="rounded-xl w-full h-auto object-cover aspect-[3/4]"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
