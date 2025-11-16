// TradingSection.tsx (MODIFIÉ)
import { useState, useMemo } from "react";
import OrderPanel from "./OrderPanel";
import { LightweightChart } from "./LightweightChart";
import { ChartControls, Asset } from "./ChartControls";
import { useChartData } from "@/hooks/useChartData";
import { usePositions } from "@/hooks/usePositions";
import { useWebSocket } from "@/hooks/useWebSocket";
import { ChartToolbar } from "./ChartToolbar"; 

// 🛑 NOUVELLE INTERFACE POUR PASSER LA PAIRE À CHARTTOOLBAR
interface ChartToolbarProps {
  selectedPair: string | undefined;
}

const TradingSection = () => {
  const { data: wsData } = useWebSocket();
  
  const [selectedAsset, setSelectedAsset] = useState<Asset>({
    id: 0, 
    name: "Bitcoin",
    symbol: "BTC/USD",
    pair: "btc_usdt", // 🛑 C'est cette valeur qui doit être passée
  });
  const [selectedTimeframe, setSelectedTimeframe] = useState("300");

  const { data } = useChartData(selectedAsset.id, selectedTimeframe);
  const { positions } = usePositions();

  const currentWsPrice = useMemo(() => {
    if (!selectedAsset.pair || !wsData[selectedAsset.pair]) return null;
    
    const pairData = wsData[selectedAsset.pair];
    if (pairData.instruments && pairData.instruments.length > 0) {
      return parseFloat(pairData.instruments[0].currentPrice);
    }
    return null;
  }, [wsData, selectedAsset.pair]);

  const { priceChange, priceChangePercent, aggregatedCurrentPrice } = useMemo(() => {
    const currentPriceUsed = currentWsPrice || 
                            (data.length > 0 ? parseFloat(data[data.length - 1].close) : 0);

    if (data.length < 2 || currentPriceUsed === 0) {
      return { priceChange: 0, priceChangePercent: 0, aggregatedCurrentPrice: currentPriceUsed };
    }

    const firstPrice = parseFloat(data[0].open);
    
    const change = currentPriceUsed - firstPrice;
    const changePercent = (change / firstPrice) * 100;

    return {
      priceChange: change,
      priceChangePercent: changePercent,
      aggregatedCurrentPrice: currentPriceUsed,
    };
  }, [data, currentWsPrice]);
  
  const finalCurrentPrice = currentWsPrice || aggregatedCurrentPrice;

  // 🛑 Hauteur du graphique
  const chartHeightStyle = { 
    height: 'calc(100% - 220px)', // 220px (Toolbar) + 48px (Controls h-12)
  };


  return (
    <section id="trading" className="snap-section flex h-screen w-full">
      {/* Chart Area (Full Bleed) */}
      <div className="bg-chart-bg flex-grow h-full relative">
        <div style={{ ...chartHeightStyle, position: 'absolute' as 'absolute', top: 0, left: 0, right: 0 }}>
            <LightweightChart data={data} positions={positions} />
        </div>
        
        {/* 🛑 PASSAGE DE LA PAIRE SÉLECTIONNÉE */}
        <ChartToolbar selectedPair={selectedAsset.pair} /> 
        
        <ChartControls
          selectedAsset={selectedAsset}
          onAssetChange={setSelectedAsset} 
          selectedTimeframe={selectedTimeframe}
          onTimeframeChange={setSelectedTimeframe}
          priceChange={priceChange}
          priceChangePercent={priceChangePercent}
          currentPrice={aggregatedCurrentPrice} 
        />
      </div>

      {/* Order Panel */}
      <OrderPanel 
        selectedAsset={selectedAsset} 
        currentPrice={finalCurrentPrice}
      />
    </section>
  );
}; 

export default TradingSection;