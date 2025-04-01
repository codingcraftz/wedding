"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDrag } from "@use-gesture/react";

const images = Array.from({ length: 20 }, (_, i) => `/gallery/gallery_${i + 1}.jpeg`);

export default function GalleryGrid() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [dragX, setDragX] = useState(0);

  const visibleImages = isExpanded ? images : images.slice(0, 6);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const openModal = (src) => setActiveImage(src);
  const closeModal = () => setActiveImage(null);

  const navigate = (direction) => {
    if (!activeImage) return;
    const index = images.indexOf(activeImage);
    const nextIndex = (index + direction + images.length) % images.length;
    setActiveImage(images[nextIndex]);
  };

  const bind = useDrag(({ down, movement: [mx], direction: [dx], velocity }) => {
    setDragX(mx);
    if (!down && velocity > 0.2) {
      if (dx > 0) navigate(-1);
      else navigate(1);
    }
  });

  return (
    <section className="w-full px-4 py-12">
      <div className="text-center mb-6">
        <p className="uppercase text-sm text-gray-400 tracking-widest">Gallery</p>
        <h2 className="text-xl font-semibold">우리가 함께 한 모든 순간</h2>
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
                onClick={() => openModal(src)}
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

      <Dialog open={!!activeImage} onOpenChange={(open) => !open && closeModal()}>
        <DialogTrigger asChild>{/* no trigger */}</DialogTrigger>
        <DialogContent className="max-w-[90vw] bg-black/90 p-0 border-none">
          <DialogTitle className="sr-only">갤러리 이미지 보기</DialogTitle>
          <motion.div
            {...bind()}
            style={{ x: dragX }}
            className="relative w-full max-w-2xl mx-auto cursor-grab active:cursor-grabbing"
          >
            <Image
              src={activeImage || images[0]}
              alt="확대 이미지"
              width={800}
              height={800}
              className="w-full h-auto rounded-xl object-contain"
            />
            <DialogClose className="absolute top-4 right-4 text-white">
              <X className="w-6 h-6" />
            </DialogClose>
            <button
              onClick={() => navigate(-1)}
              className="absolute top-1/2 left-2 -translate-y-1/2 text-white"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => navigate(1)}
              className="absolute top-1/2 right-2 -translate-y-1/2 text-white"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
