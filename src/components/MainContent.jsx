"use client";

import Section from "@/components/Section";
import Image from "next/image";

const images = [
  { src: "/main_1.png" },
  { src: "/main_2.png", paddingTop: "pt-6 bg-white" },
  { src: "/main_3.png", paddingTop: "bg-white", marginBottom: "pb-16 bg-white" },
  { src: "/main_4.png", paddingTop: "pt-6 bg-white", marginBottom: "pb-16 bg-white" },
  { src: "/main_5.png", paddingTop: "pt-6 bg-white", marginBottom: "pb-16" },
  { src: "/main_6.png", paadingTop: "pt-6", marginBottom: "pb-24 " },
];

export default function MainContent() {
  return (
    <div className="bg-background">
      {images.map((img, idx) => {
        const { src, paddingTop = "", paddingBottom = "", marginTop = "", marginBottom = "" } = img;

        const sectionSpacing = `${paddingTop} ${paddingBottom} ${marginTop} ${marginBottom}`.trim();

        return (
          <section key={src} className={`flex items-center justify-center ${sectionSpacing}`}>
            <Section delay={idx * 0.1}>
              <Image
                src={src}
                alt={`청첩장 이미지 ${idx + 1}`}
                width={500}
                height={0}
                className="w-full max-w-md h-auto"
              />
            </Section>
          </section>
        );
      })}
    </div>
  );
}
