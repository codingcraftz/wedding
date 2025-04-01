"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const images = Array.from({ length: 20 }, (_, i) => `/gallery/gallery_${i + 1}.jpeg`);

export default function GalleryGrid() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    initial: activeIndex ?? 0,
    slideChanged: (s) => setActiveIndex(s.track.details.rel),
  });

  const visibleImages = isExpanded ? images : images.slice(0, 6);

  const toggleExpand = () => setIsExpanded((prev) => !prev);
  const openModal = (index) => setActiveIndex(index);
  const closeModal = () => setActiveIndex(null);

  return (
    <section className="w-full px-4">
      <div className="text-center mb-6">
        <p className="uppercase text-4xl tracking-widest py-4">📷</p>
        <p className="text-sm text-gray-700 leading-relaxed pb-4 font-semibold">
          우리가 함께 한 모든 순간
        </p>
      </div>

      <motion.div
        layout
        animate={{ height: "auto" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <motion.div
          layout
          className="grid grid-cols-3 gap-3 max-w-md mx-auto"
          transition={{ layout: { duration: 0.6, ease: "easeInOut" } }}
        >
          <AnimatePresence initial={false}>
            {visibleImages.map((src, i) => (
              <motion.div
                key={src}
                layout
                initial={{ opacity: 0, y: isExpanded ? -10 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: isExpanded ? 10 : -10 }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className="aspect-square overflow-hidden rounded-lg shadow-sm cursor-pointer"
                onClick={() => openModal(i)}
              >
                <Image
                  src={src}
                  alt={`갤러리 이미지 ${i + 1}`}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 }}
        className="mt-8 flex justify-center"
      >
        <button
          onClick={toggleExpand}
          className="px-6 py-2 border border-gray-400 text-sm rounded-full hover:bg-gray-100 transition-colors"
        >
          {isExpanded ? "사진 접기" : "사진 더 보기"}
        </button>
      </motion.div>

      <Dialog open={activeIndex !== null} onOpenChange={(open) => !open && closeModal()}>
        <DialogTrigger asChild>{/* 트리거 안 씀 */}</DialogTrigger>
        <DialogContent className="max-w-screen max-h-screen w-screen h-screen p-0 border-0 bg-transparent">
          <DialogTitle className="sr-only">갤러리 이미지 보기</DialogTitle>
          <DialogClose className="absolute right-4 top-4 z-10 rounded-full bg-black/20 p-2 text-white hover:bg-black/40 backdrop-blur-sm transition-colors">
            <X className="h-5 w-5" />
            <span className="sr-only">닫기</span>
          </DialogClose>
          <div ref={sliderRef} className="keen-slider w-full h-full">
            {images.map((src, i) => (
              <div key={src} className="keen-slider__slide flex items-center justify-center">
                <Image
                  src={src}
                  alt={`갤러리 이미지 ${i + 1}`}
                  width={1200}
                  height={1200}
                  className="w-full h-full object-contain"
                  priority={i === activeIndex}
                />
              </div>
            ))}
          </div>
          {/* 이미지 번호 표시 */}
          {activeIndex !== null && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/20 backdrop-blur-sm">
              <p className="text-white text-sm font-medium">
                {activeIndex + 1} / {images.length}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
