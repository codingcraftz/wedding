import Gallery from "@/components/Gallery";
import MainContent from "@/components/MainContent";
import NavigationAndAddress from "@/components/Map";
import WeddingCalendar from "@/components/WeddingCalendar";

export default function Home() {
  return (
    <main className="bg-background w-full">
      <MainContent />
      <Gallery />
      <div className="bg-[#181818] py-24 px-12">
        <WeddingCalendar />
      </div>
      <NavigationAndAddress />
    </main>
  );
}
