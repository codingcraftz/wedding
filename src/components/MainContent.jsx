"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";

const images = [
  { src: "/main_1.png" },
  { src: "/main_2.png", paddingTop: "pt-6 bg-white" },
  { src: "/main_3.png", paddingTop: "", marginBottom: "pb-16" },
  { src: "/main_4.png", paddingTop: "pt-6", marginBottom: "pb-16" },
  { src: "/main_5.png", paddingTop: "pt-6", marginBottom: "pb-16" },
  { src: "/main_6.png", paddingTop: "pt-6", marginBottom: "pb-16" },
];

// 각 이미지에 적용될 애니메이션 변형 옵션들
const imageAnimations = [
  {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  },
  {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  },
  {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" } },
  },
  {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeIn" } },
  },
  {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: "easeOut" } },
  },
  {
    hidden: { opacity: 0, y: 30, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeInOut" } },
  },
];

export default function MainContent() {
  return (
    <div className="bg-background">
      {images.map((img, idx) => {
        const { src, paddingTop = "", paddingBottom = "", marginTop = "", marginBottom = "" } = img;
        const sectionSpacing = `${paddingTop} ${paddingBottom} ${marginTop} ${marginBottom}`.trim();

        // 각 이미지마다 다른 애니메이션 적용
        const animation = imageAnimations[idx % imageAnimations.length];

        // intersection observer 사용 - 더 일찍 감지되도록 설정 조정
        const [ref, inView] = useInView({
          threshold: 0.1,
          triggerOnce: false,
          rootMargin: "5% 0px",
        });

        return (
          <section
            key={src}
            className={`flex items-center justify-center ${sectionSpacing} bg-background`}
          >
            <motion.div
              ref={ref}
              variants={animation}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="w-full flex justify-center"
            >
              <Image
                src={src}
                alt={`청첩장 이미지 ${idx + 1}`}
                width={500}
                height={0}
                className="w-full max-w-md h-auto"
              />
            </motion.div>
          </section>
        );
      })}
    </div>
  );
}
