"use client";

import React from "react";
import { Noto_Serif_KR, Gamja_Flower } from "next/font/google";
import "./CalendarStyles.css";
import { WEDDING_DATE } from "@/lib/constants";

// 나눔명조 폰트 (우아하고 전통적인 청첩장 느낌)
const notoSerif = Noto_Serif_KR({
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
});

// 감자꽃 폰트 (캘린더 날짜에 귀여운 느낌)
const gamjaFlower = Gamja_Flower({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

export default function WeddingCalendar() {
  const weddingDate = new Date(WEDDING_DATE); // 결혼식 날짜

  // 날짜 생성 로직
  const generateCalendar = () => {
    const firstDay = new Date(weddingDate.getFullYear(), weddingDate.getMonth(), 1).getDay(); // 첫째 날의 요일
    const daysInMonth = new Date(
      weddingDate.getFullYear(),
      weddingDate.getMonth() + 1,
      0
    ).getDate(); // 월의 총 일수

    const calendar = [];
    let day = 1;

    for (let week = 0; week < 6; week++) {
      const row = [];
      for (let weekday = 0; weekday < 7; weekday++) {
        if (week === 0 && weekday < firstDay) {
          row.push(null); // 공백 추가
        } else if (day > daysInMonth) {
          row.push(null); // 남은 공백 추가
        } else {
          row.push(day); // 날짜 추가
          day++;
        }
      }
      calendar.push(row);
    }
    return calendar;
  };

  const calendar = generateCalendar();

  // 날짜 포맷
  const year = weddingDate.getFullYear();
  const month = String(weddingDate.getMonth() + 1).padStart(2, "0");
  const day = String(weddingDate.getDate()).padStart(2, "0");

  // 요일 계산
  const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const weekday = weekdays[weddingDate.getDay()];

  // 최종 포맷
  const formattedDate = `${year}.${month}.${day} ${weekday}`;

  return (
    <div
      className={`text-[#ee7685] flex flex-col items-center justify-center ${gamjaFlower.className}`}
    >
      {/* 헤더에 동적으로 날짜 표시 */}
      <h2 className="text-2xl">{formattedDate}</h2>
      <p className="mb-4 italic">1:20PM</p>
      <div className="w-96 rounded-lg p-4">
        {/* 달력 헤더 */}
        <div className="grid grid-cols-7 text-center font-semibold mb-4">
          <div>SUN</div>
          <div>MON</div>
          <div>TUE</div>
          <div>WED</div>
          <div>THU</div>
          <div>FRI</div>
          <div>SAT</div>
        </div>
        {/* 달력 내용 */}
        <div className={`grid grid-cols-7 text-center ${gamjaFlower.className}`}>
          {calendar.map((week, weekIndex) => (
            <React.Fragment key={weekIndex}>
              {week.map((dayValue, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`py-2 text-lg ${
                    dayValue === weddingDate.getDate()
                      ? "bg-[#ee7685] text-[#181818] font-bold rounded-full"
                      : "text-[#ee7685]"
                  }`}
                >
                  {dayValue || ""}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
