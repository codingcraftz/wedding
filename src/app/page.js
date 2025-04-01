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
      <div className="bg-[#fdf1f2] w-full">
        <Gallery />
      </div>

      <div className="w-full bg-[#fdf1f2] py-12">
        <WeddingCalendar />
      </div>

      <div className="w-full py-12 bg-white">
        <NavigationAndAddress />
      </div>

      <div className="w-full bg-[#fdf1f2] py-12">
        <Account />
      </div>

      <div className="bg-white w-full py-12">
        <Guestbook />
      </div>
      <ShareButtons />
    </main>
  );
}
