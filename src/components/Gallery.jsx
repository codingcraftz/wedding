"use client";
import { useState, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

// 이미지 경로 배열 (20개의 이미지)
const images = Array.from({ length: 20 }, (_, i) => `/gallery/gallery_${i + 1}.jpeg`);

export default function GalleryCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [totalImages] = useState(images.length);
  const [showArrows, setShowArrows] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    loop: true,
    slides: {
      perView: 1,
      spacing: 10,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: {
          perView: 1.5,
          spacing: 15,
        },
      },
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  // 모바일에서 터치 동작 처리를 위해 useEffect에서 터치 이벤트 리스너 추가
  useEffect(() => {
    if (instanceRef.current) {
      const instance = instanceRef.current;

      // 터치 시작 시 화살표 표시
      const handleTouchStart = () => {
        setShowArrows(true);
        // 5초 후 화살표 숨기기
        setTimeout(() => {
          setShowArrows(false);
        }, 5000);
      };

      // DOM에 이벤트 리스너 추가
      document.addEventListener("touchstart", handleTouchStart);

      return () => {
        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        document.removeEventListener("touchstart", handleTouchStart);
      };
    }
  }, [instanceRef]);

  // 이미지 로드 처리 함수
  const handleImageLoad = () => {
    setImagesLoaded((prev) => prev + 1);
  };

  return (
    <section className="py-12 relative">
      <div className="max-w-md mx-auto px-2">
        <h2 className="text-xl font-semibold mb-6 text-center text-[#ee7685] border-2 border-[#ee7685] rounded-full py-2 px-6 inline-block mx-auto">
          갤러리
        </h2>

        {/* 로딩 표시 */}
        {imagesLoaded < totalImages / 2 && (
          <div className="text-center py-4 text-gray-500">
            이미지 로딩 중... ({imagesLoaded}/{totalImages})
          </div>
        )}

        <div className="relative overflow-hidden">
          {/* 슬라이더 컨테이너 */}
          <div
            ref={sliderRef}
            className="keen-slider h-[350px] md:h-[500px] rounded-xl overflow-hidden"
          >
            {images.map((src, idx) => (
              <div
                key={idx}
                className="keen-slider__slide relative flex items-center justify-center overflow-hidden"
              >
                {/* 이미지 컨테이너에 고정된 높이 적용 */}
                <div className="w-full h-full relative">
                  <Image
                    src={src}
                    alt={`갤러리 이미지 ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover rounded-xl"
                    priority={idx < 5} // 처음 5개 이미지는 우선 로드
                    onLoad={handleImageLoad}
                    loading={idx < 5 ? "eager" : "lazy"}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* 이전/다음 버튼 (화살표) */}
          {loaded && instanceRef.current && (
            <>
              <button
                onClick={() => instanceRef.current?.prev()}
                className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md z-10 transition-opacity ${
                  showArrows || imagesLoaded < totalImages ? "opacity-60" : "opacity-0"
                } hover:opacity-100`}
                aria-label="이전 이미지"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>

              <button
                onClick={() => instanceRef.current?.next()}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md z-10 transition-opacity ${
                  showArrows || imagesLoaded < totalImages ? "opacity-60" : "opacity-0"
                } hover:opacity-100`}
                aria-label="다음 이미지"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </>
          )}
        </div>

        {/* 현재 슬라이드 번호 표시 */}
        {loaded && instanceRef.current && (
          <div className="flex justify-center mt-4">
            <div className="text-sm text-gray-500">
              {currentSlide + 1} / {instanceRef.current.track.details.slides.length}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
