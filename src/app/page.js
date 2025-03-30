import Gallery from "@/components/Gallery";
import MainContent from "@/components/MainContent";
import WeddingCalendar from "@/components/WeddingCalendar";

export default function Home() {
  return (
    <main className="bg-background w-full">
      <MainContent />
      <Gallery />
      <div className="bg-black py-24">
        <WeddingCalendar />
      </div>
    </main>
  );
}
