import Image from "next/image";
import MainContent from "@/components/MainContent";
import WeddingCalendar from "@/components/WeddingCalendar";
import NavigationAndAddress from "@/components/Map";
import Gallery from "@/components/Gallery";
import Account from "@/components/Account";
import Guestbook from "@/components/Guestbook";

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen bg-white overflow-x-hidden w-full">
      <MainContent />
      <div className="bg-white py-12">
        <Gallery />
      </div>
      <div className="bg-[#181818] py-18 px-12">
        <WeddingCalendar />
      </div>
      <NavigationAndAddress />
      <Account />
      <div className="bg-white py-12">
        <Guestbook />
      </div>
    </main>
  );
}
