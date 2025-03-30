import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AudioPlayer from "@/components/AudioPlayer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "손승호 ❤️ 고유미 결혼합니다.",
  description: "25. 5. 31(토) 2:10PM",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body
        id="root"
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background overflow-x-hidden`}
      >
        <div className="overflow-x-hidden w-full">
          {children}
          <AudioPlayer />
        </div>
      </body>
    </html>
  );
}
