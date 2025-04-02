"use client";

import { useState, useEffect, useMemo } from "react";
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

const titleVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const thumbnailVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, delay: 0.2 },
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
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: false, rootMargin: "5% 0px" });
  const [loadedImages, setLoadedImages] = useState([]);
  const [error, setError] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    initial: activeIndex ?? 0,
    slideChanged: (s) => {
      try {
        if (s && s.track && s.track.details) {
          setActiveIndex(s.track.details.rel);
        }
      } catch (err) {
        console.error("슬라이더 변경 오류:", err);
      }
    },
  });

  useEffect(() => {
    controls.start(inView ? "visible" : "hidden");
  }, [controls, inView]);

  const visibleImages = useMemo(() => {
    try {
      if (!images || !Array.isArray(images)) return [];
      return isExpanded ? images : images.slice(0, 6);
    } catch (err) {
      console.error("이미지 처리 오류:", err);
      return images ? images.slice(0, 6) : [];
    }
  }, [isExpanded, images]);

  const toggleExpand = () => {
    try {
      setIsExpanded((prev) => !prev);
    } catch (err) {
      console.error("확장 토글 오류:", err);
      setIsExpanded(false);
    }
  };

  const openModal = (index) => {
    try {
      if (index >= 0 && index < images.length) {
        setActiveIndex(index);
      }
    } catch (err) {
      console.error("모달 열기 오류:", err);
    }
  };

  const closeModal = () => setActiveIndex(null);

  const handleImageLoad = (src) => {
    setLoadedImages((prev) => [...prev, src]);
  };

  const handleImageError = (src) => {
    console.error(`이미지 로드 실패: ${src}`);
    setError(true);
  };

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
        className="relative overflow-hidden"
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
                  onLoadingComplete={() => handleImageLoad(src)}
                  onError={() => handleImageError(src)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        <AnimatePresence>
          {!isExpanded && (
            <motion.div
              key="fade"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="pointer-events-none absolute bottom-0 left-0 w-full h-14 bg-gradient-to-t from-[#f1d7ef] to-transparent z-10"
            />
          )}
        </AnimatePresence>
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
          className="w-48 py-2 border bg-white border-gray-400 text-sm font-semibold text-gray-700 rounded-none transition-colors"
        >
          {isExpanded ? "사진 접기" : "사진 더 보기"}
        </motion.button>
      </motion.div>

      <Dialog open={activeIndex !== null} onOpenChange={(open) => !open && closeModal()}>
        <DialogTrigger asChild />
        <DialogContent asChild>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-screen max-h-screen w-screen h-screen p-0 border-0 bg-black/70 backdrop-blur-sm relative"
          >
            <DialogTitle className="sr-only">갤러리 이미지 보기</DialogTitle>
            <DialogClose className="absolute right-4 top-4 z-10 rounded-full bg-black/30 p-2 text-white hover:bg-black/50 transition-colors">
              <X className="h-5 w-5" />
              <span className="sr-only">닫기</span>
            </DialogClose>

            <div ref={sliderRef} className="keen-slider w-full h-full">
              {images.map((src, i) => (
                <motion.div
                  key={src}
                  className="keen-slider__slide flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
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

            {activeIndex !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/30"
              >
                <p className="text-white text-sm font-medium">
                  {activeIndex + 1} / {images.length}
                </p>
              </motion.div>
            )}
          </motion.div>
        </DialogContent>
      </Dialog>
    </motion.section>
  );
}
