import OrderPanel from "./OrderPanel";

const TradingSection = () => {
  return (
    <section id="trading" className="snap-section flex h-screen w-full">
      {/* Chart Area (Full Bleed) */}
      <div className="bg-chart-bg flex-grow h-full flex items-center justify-center italic text-xl text-light-text">
        Chart Area (Full Height, Full Width minus 320px)
      </div>

      {/* Order Panel */}
      <OrderPanel />
    </section>
  );
};

export default TradingSection;
