"use client";

import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { differenceInSeconds } from "date-fns";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { WEDDING_DATE } from "@/lib/constants";

// 애니메이션 변형(variants) 정의
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.15,
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const calendarVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: 0.2,
    },
  },
};

const countdownVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.3,
    },
  },
};

const dayBoxVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      delay: i * 0.08,
    },
  }),
  highlight: {
    scale: [1, 1.1, 1],
    backgroundColor: ["#ee7685", "#f1919e", "#ee7685"],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "mirror",
    },
  },
};

export default function WeddingCalendar() {
  const weddingDate = new Date(WEDDING_DATE);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false,
    rootMargin: "-10% 0px",
  });

  function getTimeLeft() {
    const diff = differenceInSeconds(weddingDate, new Date());
    const days = Math.floor(diff / (60 * 60 * 24));
    const hours = Math.floor((diff % (60 * 60 * 24)) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;
    return { days, hours, minutes, seconds };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const generateCalendar = () => {
    const firstDay = new Date(weddingDate.getFullYear(), weddingDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(
      weddingDate.getFullYear(),
      weddingDate.getMonth() + 1,
      0
    ).getDate();
    const calendar = [];
    let day = 1;

    for (let week = 0; week < 6; week++) {
      const row = [];
      for (let weekday = 0; weekday < 7; weekday++) {
        if (week === 0 && weekday < firstDay) {
          row.push(null);
        } else if (day > daysInMonth) {
          row.push(null);
        } else {
          row.push(day);
          day++;
        }
      }
      calendar.push(row);
    }
    return calendar;
  };

  const calendar = generateCalendar();
  const year = weddingDate.getFullYear();
  const month = weddingDate.getMonth() + 1;
  const date = weddingDate.getDate();
  const dayText = ["일", "월", "화", "수", "목", "금", "토"][weddingDate.getDay()];

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <motion.section variants={containerVariants} className="w-full px-8 text-center">
        <motion.div variants={titleVariants} className="text-center mb-6">
          <motion.p
            variants={titleVariants}
            className="uppercase text-xs text-gray-400 tracking-widest py-4"
          >
            WEDDING DATE
          </motion.p>
          <motion.h2 variants={titleVariants} className="text-base font-semibold">
            {year}년 {month}월 {date}일 {dayText}요일 오후 1시 20분
          </motion.h2>
        </motion.div>

        {/* 달력 */}
        <motion.div variants={calendarVariants} className="grid grid-cols-7 gap-1 text-sm mt-6">
          {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
            <motion.div key={i} variants={titleVariants} className="text-[#111111]">
              {d}
            </motion.div>
          ))}

          {calendar.map((week, i) => (
            <React.Fragment key={i}>
              {week.map((day, j) => (
                <motion.div
                  key={j}
                  custom={i * 7 + j}
                  variants={dayBoxVariants}
                  animate={day === date ? "highlight" : "visible"}
                  className={`aspect-square flex items-center justify-center text-sm rounded-full transition-all ${
                    day === date ? "bg-[#ee7685] text-white relative" : "text-[#111111]"
                  }`}
                >
                  {day === date ? (
                    <div className="flex items-center gap-1">
                      <motion.div
                        animate={{
                          scale: [1, 1.3, 1],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: "mirror",
                        }}
                      >
                        <Heart className="w-3 h-3 fill-white text-white" />
                      </motion.div>
                      {day}
                    </div>
                  ) : (
                    day || ""
                  )}
                </motion.div>
              ))}
            </React.Fragment>
          ))}
        </motion.div>
      </motion.section>

      {/* 카운트다운 박스 */}
      <motion.div
        variants={countdownVariants}
        className="overflow-hidden relative text-white"
        style={{
          backgroundImage: "url('/flowers.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="backdrop-brightness-[0.5] py-10 flex justify-center items-center gap-6">
          <CountdownBox label="일" value={timeLeft.days} showColon index={0} />
          <CountdownBox label="시간" value={timeLeft.hours} showColon index={1} />
          <CountdownBox label="분" value={timeLeft.minutes} showColon index={2} />
          <CountdownBox label="초" value={timeLeft.seconds} showColon={false} index={3} />
        </div>
      </motion.div>

      {/* 설명 텍스트 */}
      <motion.p variants={titleVariants} className="py-4 text-sm text-gray-800 text-center">
        <span className="font-medium text-[#ee7685]">손승호</span> ❤️{" "}
        <span className="font-medium text-[#ee7685]">고유미</span> 님의 결혼식이{" "}
        <motion.span
          animate={{
            scale: [1, 1.05, 1],
            color: ["#000", "#ee7685", "#000"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "mirror",
          }}
          className="font-semibold"
        >
          {timeLeft.days}
        </motion.span>
        일 남았습니다.
      </motion.p>
    </motion.div>
  );
}

function CountdownBox({ label, value, showColon, index }) {
  return (
    <motion.div
      custom={index}
      variants={dayBoxVariants}
      className="relative inline-block text-center"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-black/50 w-16 h-16 rounded-lg flex items-center justify-center text-white text-3xl font-semibold relative"
      >
        {String(value).padStart(2, "0")}
        {showColon && (
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute right-[-13px] top-1/2 -translate-y-5 text-2xl font-semibold"
          >
            :
          </motion.span>
        )}
      </motion.div>
      <div className="text-xs mt-1 text-white">{label}</div>
    </motion.div>
  );
}
