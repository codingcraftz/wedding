"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
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

// 갤러리 섹션 애니메이션
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

// 제목 애니메이션 - 빠르게 표시되도록 수정
const titleVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
      delay: 0, // 지연 없이 즉시 표시
    },
  },
};

// 이미지 썸네일 애니메이션 (스태거 효과용) - 제목 다음에 표시
const thumbnailVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      delay: 0.2, // 제목이 먼저 표시되도록 지연
    },
  },
  hover: {
    scale: 1.05,
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.2 },
  },
};

export default function GalleryGrid() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false,
    rootMargin: "5% 0px",
  });

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    initial: activeIndex ?? 0,
    slideChanged: (s) => setActiveIndex(s.track.details.rel),
  });

  // 스크롤에 따른 애니메이션 제어
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  const visibleImages = isExpanded ? images : images.slice(0, 6);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const openModal = (index) => setActiveIndex(index);
  const closeModal = () => setActiveIndex(null);

  // 확장/축소 버튼 애니메이션
  const buttonVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.3, duration: 0.4 },
    },
    hover: {
      scale: 1.05,
      backgroundColor: "rgb(243, 244, 246)",
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.section
      ref={ref}
      variants={sectionVariants}
      initial="hidden"
      animate={controls}
      className="w-full px-4 py-8"
    >
      {/* 제목 부분 - 별도 애니메이션 적용 */}
      <motion.div
        variants={titleVariants}
        initial="hidden"
        animate="visible"
        className="text-center mb-8"
      >
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="uppercase text-5xl tracking-widest py-4"
        >
          📷
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-sm text-gray-700 leading-relaxed pb-4 font-semibold"
        >
          우리가 함께 한 모든 순간
        </motion.p>
      </motion.div>

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
                variants={thumbnailVariants}
                whileHover="hover"
                initial="hidden"
                animate="visible"
                exit={{
                  opacity: 0,
                  scale: 0.8,
                  y: isExpanded ? 10 : -10,
                  transition: { duration: 0.3 },
                }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.05 }}
                className="aspect-square overflow-hidden rounded-lg shadow-sm cursor-pointer"
                onClick={() => openModal(i)}
              >
                <Image
                  src={src}
                  alt={`갤러리 이미지 ${i + 1}`}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-300"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <motion.div
        initial="initial"
        animate="animate"
        variants={buttonVariants}
        className="mt-8 flex justify-center"
      >
        <motion.button
          whileHover="hover"
          whileTap={{ scale: 0.98 }}
          variants={buttonVariants}
          onClick={toggleExpand}
          className="px-6 py-2 border bg-white border-gray-400 text-sm rounded-full transition-colors"
        >
          {isExpanded ? "사진 접기" : "사진 더 보기"}
        </motion.button>
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
              <motion.div
                key={src}
                className="keen-slider__slide flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={src}
                  alt={`갤러리 이미지 ${i + 1}`}
                  width={1200}
                  height={1200}
                  className="w-full h-full object-contain"
                  priority={i === activeIndex}
                />
              </motion.div>
            ))}
          </div>
          {/* 이미지 번호 표시 */}
          {activeIndex !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/20 backdrop-blur-sm"
            >
              <p className="text-white text-sm font-medium">
                {activeIndex + 1} / {images.length}
              </p>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </motion.section>
  );
}
