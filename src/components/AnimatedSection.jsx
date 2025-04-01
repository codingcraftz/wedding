"use client";

import { useEffect, useRef, useState } from "react";

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  animation = "fade-up", // 기본 애니메이션 유형
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // 요소가 화면에 보이면 isVisible을 true로 설정
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: "0px 0px 20% 0px", // 뷰포트 하단 위로 30% 일찍 트리거
        threshold: 0, // 혹은 0.01
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  // 애니메이션 종류에 따른 클래스 설정
  const animationClass =
    animation === "fade-up"
      ? "opacity-0 translate-y-10 transition-all duration-700 ease-out"
      : animation === "fade-in"
      ? "opacity-0 transition-opacity duration-700 ease-out"
      : animation === "slide-left"
      ? "opacity-0 translate-x-10 transition-all duration-700 ease-out"
      : animation === "slide-right"
      ? "opacity-0 -translate-x-10 transition-all duration-700 ease-out"
      : "opacity-0 transition-opacity duration-700 ease-out";

  // 보이게 될 때 적용할 클래스
  const visibleClass =
    animation === "fade-up"
      ? "opacity-100 translate-y-0"
      : animation === "fade-in"
      ? "opacity-100"
      : animation === "slide-left"
      ? "opacity-100 translate-x-0"
      : animation === "slide-right"
      ? "opacity-100 translate-x-0"
      : "opacity-100";

  return (
    <div
      ref={ref}
      className={`${className} ${animationClass} ${isVisible ? visibleClass : ""} w-full`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
