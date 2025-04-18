"use client";

import { useEffect, useRef, useState } from "react";

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  animation = "fade-up", // 기본 애니메이션 유형
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    // 페이지 로드 시 강제로 모든 요소를 숨김 상태로 시작
    setIsVisible(false);

    // 약간의 지연 후 애니메이션 처리 진행
    const initTimer = setTimeout(() => {
      setIsInitialized(true);

      if (!ref.current) return;

      // 현재 요소가 화면에 보이는지 확인 (15% 이상 보여야 함)
      const checkVisibility = () => {
        if (!ref.current) return false;

        const rect = ref.current.getBoundingClientRect();
        const elementHeight = rect.height;
        const visibleHeight = Math.min(window.innerHeight - rect.top, elementHeight);

        // 요소의 15% 이상이 화면에 보이는 경우
        return visibleHeight > 0 && visibleHeight / elementHeight > 0.15;
      };

      // 초기 로드 시 화면에 충분히 보이는 요소는 지연 후 애니메이션 적용
      if (checkVisibility()) {
        // 요소별 지연 적용
        setTimeout(() => {
          setIsVisible(true);
        }, delay);
        return;
      }

      // 화면에 충분히 보이지 않는 요소는 IntersectionObserver로 모니터링
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        },
        {
          root: null,
          rootMargin: "0px", // 화면에 정확히 들어왔을 때만 감지
          threshold: 0.15, // 15% 이상 보일 때 트리거
        }
      );

      observer.observe(ref.current);

      return () => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      };
    }, 100); // 초기화를 위한 짧은 지연

    return () => {
      clearTimeout(initTimer);
    };
  }, [delay]);

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
      className={`${className} bg-background ${animationClass} ${isVisible ? visibleClass : ""} ${
        isInitialized ? "" : "opacity-0"
      } w-full`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
