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

      <AnimatedSection animation="fade-up" delay={100}>
        <div className="bg-white py-12 w-full">
          <Gallery />
        </div>
      </AnimatedSection>

      <AnimatedSection animation="fade-up" delay={200}>
        <div className="py-6 w-full">
          <WeddingCalendar />
        </div>
      </AnimatedSection>

      <AnimatedSection animation="fade-up" delay={300}>
        <NavigationAndAddress />
      </AnimatedSection>

      <AnimatedSection animation="fade-up" delay={400}>
        <div className="py-12 w-full">
          <Account />
        </div>
      </AnimatedSection>

      <AnimatedSection animation="fade-in" delay={500}>
        <div className="bg-white py-12 w-full">
          <Guestbook />
        </div>
      </AnimatedSection>
      <ShareButtons />
    </main>
  );
}
