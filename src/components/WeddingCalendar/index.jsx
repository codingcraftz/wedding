"use client";

import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { differenceInSeconds } from "date-fns";
import { WEDDING_DATE } from "@/lib/constants";

export default function WeddingCalendar() {
  const weddingDate = new Date(WEDDING_DATE);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

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
    <div>
      <section className="w-full px-8 text-center">
        <div className="text-center mb-6">
          <p className="uppercase text-xs text-gray-400 tracking-widest py-4">WEDDING DATE</p>
          <h2 className="text-base font-semibold">
            {year}년 {month}월 {date}일 {dayText}요일 오후 1시 20분
          </h2>
        </div>

        {/* 달력 */}
        <div className="grid grid-cols-7 gap-2 text-base mt-6">
          {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
            <div key={i} className="text-[#111111] font-medium">
              {d}
            </div>
          ))}

          {calendar.map((week, i) => (
            <React.Fragment key={i}>
              {week.map((day, j) => (
                <div
                  key={j}
                  className={`aspect-square flex items-center justify-center text-sm rounded-full transition-all ${
                    day === date ? "bg-[#ee7685] text-white relative" : "text-[#111111]"
                  }`}
                >
                  {day === date ? (
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3 fill-white text-white" />
                      {day}
                    </div>
                  ) : (
                    day || ""
                  )}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* 카운트다운 박스 */}
      <div
        className="overflow-hidden relative text-white"
        style={{
          backgroundImage: "url('/flowers.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="backdrop-brightness-[0.5] py-10 flex justify-center items-center gap-6">
          <CountdownBox label="일" value={timeLeft.days} showColon />
          <CountdownBox label="시간" value={timeLeft.hours} showColon />
          <CountdownBox label="분" value={timeLeft.minutes} showColon />
          <CountdownBox label="초" value={timeLeft.seconds} showColon={false} />
        </div>
      </div>

      {/* 설명 텍스트 */}
      <p className="mt-6 text-sm text-gray-800 text-center">
        <span className="font-medium text-[#ee7685]">손삼익</span> ❤️{" "}
        <span className="font-medium text-[#ee7685]">고유미</span> 님의 결혼식이{" "}
        <span className="font-semibold text-black">{timeLeft.days}</span>일 남았습니다.
      </p>
    </div>
  );
}

function CountdownBox({ label, value, showColon }) {
  return (
    <div className="relative inline-block text-center">
      <div className="bg-black/50 w-16 h-16 rounded-lg flex items-center justify-center text-white text-3xl font-semibold relative">
        {String(value).padStart(2, "0")}
        {showColon && (
          <span className="absolute right-[-13px] top-1/2 -translate-y-5 text-2xl font-semibold">
            :
          </span>
        )}
      </div>
      <div className="text-xs mt-1 text-white">{label}</div>
    </div>
  );
}
