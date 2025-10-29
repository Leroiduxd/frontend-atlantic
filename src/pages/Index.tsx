import Sidebar from "@/components/Sidebar";
import TradingSection from "@/components/TradingSection";
import PositionsSection from "@/components/PositionsSection";

const Index = () => {
  return (
    <div className="antialiased bg-background">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area with Scroll Snap */}
      <main className="ml-[60px] w-[calc(100%-60px)] h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth">
        {/* Section 1: Trading Interface */}
        <TradingSection />

        {/* Section 2: Positions Management */}
        <PositionsSection />
      </main>
    </div>
  );
};

export default Index;
