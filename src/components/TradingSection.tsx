import { useState, useMemo } from "react";
import OrderPanel from "./OrderPanel";
import { LightweightChart } from "./LightweightChart";
import { ChartControls } from "./ChartControls";
import { useChartData } from "@/hooks/useChartData";
import { usePositions } from "@/hooks/usePositions";

interface Asset {
  id: number;
  name: string;
  symbol: string;
}

const TradingSection = () => {
  const [selectedAsset, setSelectedAsset] = useState<Asset>({
    id: 0,
    name: "Bitcoin",
    symbol: "BTC/USD",
  });
  const [selectedTimeframe, setSelectedTimeframe] = useState("300");

  const { data } = useChartData(selectedAsset.id, selectedTimeframe);
  const { positions } = usePositions();

  // Calculate price change
  const { priceChange, priceChangePercent, currentPrice } = useMemo(() => {
    if (data.length < 2) {
      return { priceChange: 0, priceChangePercent: 0, currentPrice: 0 };
    }

    const firstPrice = parseFloat(data[0].open);
    const lastPrice = parseFloat(data[data.length - 1].close);
    const change = lastPrice - firstPrice;
    const changePercent = (change / firstPrice) * 100;

    return {
      priceChange: change,
      priceChangePercent: changePercent,
      currentPrice: lastPrice,
    };
  }, [data]);

  return (
    <section id="trading" className="snap-section flex h-screen w-full">
      {/* Chart Area (Full Bleed) */}
      <div className="bg-chart-bg flex-grow h-full relative">
        <LightweightChart data={data} positions={positions} />
        <ChartControls
          selectedAsset={selectedAsset}
          onAssetChange={setSelectedAsset}
          selectedTimeframe={selectedTimeframe}
          onTimeframeChange={setSelectedTimeframe}
          priceChange={priceChange}
          priceChangePercent={priceChangePercent}
          currentPrice={currentPrice}
        />
      </div>

      {/* Order Panel */}
      <OrderPanel />
    </section>
  );
};

export default TradingSection;
