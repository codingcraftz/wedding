import Image from "next/image";
import MainContent from "@/components/MainContent";
import WeddingCalendar from "@/components/WeddingCalendar";
import NavigationAndAddress from "@/components/Map";
import Gallery from "@/components/Gallery";
import Account from "@/components/Account";
import Guestbook from "@/components/Guestbook";
import ShareButtons from "@/components/ShareButtons";
import AnimatedSection from "@/components/AnimatedSection";

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen bg-white overflow-x-hidden w-full">
      <MainContent />

      <AnimatedSection animation="fade-up" delay={50}>
        <div className="bg-white w-full pb-12">
          <Gallery />
        </div>
      </AnimatedSection>

      <AnimatedSection animation="fade-up" delay={50}>
        <div className="w-full bg-[#fdf1f2] py-12">
          <WeddingCalendar />
        </div>
      </AnimatedSection>

      <AnimatedSection animation="fade-up" delay={50}>
        <div className="w-full py-12 bg-white">
          <NavigationAndAddress />
        </div>
      </AnimatedSection>

      <AnimatedSection animation="fade-up" delay={50}>
        <div className="w-full bg-[#fdf1f2] py-12">
          <Account />
        </div>
      </AnimatedSection>

      <AnimatedSection animation="fade-in bg-[]" delay={50}>
        <div className="bg-white w-full py-12">
          <Guestbook />
        </div>
      </AnimatedSection>
      <ShareButtons />
    </main>
  );
}
