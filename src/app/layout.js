import localFont from "next/font/local";
import "./globals.css";
import AudioPlayer from "@/components/AudioPlayer";

// SUIT 폰트 로컬 파일로 정의
const suit = localFont({
  src: [
    {
      path: "../fonts/SUIT-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/SUIT-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/SUIT-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/SUIT-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-suit",
  display: "swap",
});

export const metadata = {
  title: "손승호 ❤️ 고유미 결혼합니다.",
  description: "25. 5. 31(토) 1:20PM",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body
        id="root"
        className={`${suit.variable} font-sans antialiased bg-background overflow-x-hidden`}
      >
        <div className="overflow-x-hidden w-full">
          {children}
          <AudioPlayer />
        </div>
      </body>
    </html>
  );
}
