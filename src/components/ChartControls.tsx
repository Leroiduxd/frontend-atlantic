import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";

interface Asset {
  id: number;
  name: string;
  symbol: string;
}

interface ChartControlsProps {
  selectedAsset: Asset;
  onAssetChange: (asset: Asset) => void;
  selectedTimeframe: string;
  onTimeframeChange: (timeframe: string) => void;
  priceChange: number;
  priceChangePercent: number;
  currentPrice: number;
}

const TIMEFRAMES = [
  { value: "60", label: "1m" },
  { value: "300", label: "5m" },
  { value: "900", label: "15m" },
  { value: "3600", label: "1h" },
  { value: "14400", label: "4h" },
  { value: "86400", label: "1D" },
];

const ASSETS: Asset[] = [
  { id: 0, name: "Bitcoin", symbol: "BTC/USD" },
  { id: 1, name: "Ethereum", symbol: "ETH/USD" },
  { id: 2, name: "Solana", symbol: "SOL/USD" },
];

export const ChartControls = ({
  selectedAsset,
  onAssetChange,
  selectedTimeframe,
  onTimeframeChange,
  priceChange,
  priceChangePercent,
  currentPrice,
}: ChartControlsProps) => {
  const formatPrice = (value: number) => {
    if (value === 0) return "0.00";
    const integerPart = Math.floor(Math.abs(value)).toString().length;
    if (integerPart === 1) return value.toFixed(5);
    if (integerPart === 2) return value.toFixed(3);
    return value.toFixed(2);
  };

  const isPositive = priceChange >= 0;

  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 bg-chart-bg border-t border-border flex items-center justify-between px-4 gap-4">
      {/* Asset Selector */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="gap-2 font-semibold text-base hover:bg-accent"
          >
            {selectedAsset.symbol}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2" align="start">
          <div className="space-y-1">
            {ASSETS.map((asset) => (
              <Button
                key={asset.id}
                variant={selectedAsset.id === asset.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => onAssetChange(asset)}
              >
                <div className="flex flex-col items-start">
                  <span className="font-semibold">{asset.symbol}</span>
                  <span className="text-xs text-muted-foreground">{asset.name}</span>
                </div>
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Price Info */}
      <div className="flex items-center gap-3">
        <span className="font-semibold text-base">{formatPrice(currentPrice)}</span>
        <span
          className={`text-sm font-medium ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}
        >
          {isPositive ? "+" : ""}
          {formatPrice(priceChange)} ({isPositive ? "+" : ""}
          {priceChangePercent.toFixed(2)}%)
        </span>
      </div>

      {/* Timeframe Selector */}
      <div className="flex items-center gap-1 bg-muted rounded-md p-1">
        {TIMEFRAMES.map((tf) => (
          <Button
            key={tf.value}
            variant={selectedTimeframe === tf.value ? "secondary" : "ghost"}
            size="sm"
            className="h-7 px-3 text-xs"
            onClick={() => onTimeframeChange(tf.value)}
          >
            {tf.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
