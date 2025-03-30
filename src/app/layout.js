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
  title: "모바일 청첩장",
  description: "결혼식에 초대합니다",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body
        id="root"
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background`}
      >
        {children}
        <AudioPlayer />
      </body>
    </html>
  );
}
