import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

type OrderType = "limit" | "market";

const OrderPanel = () => {
  const [orderType, setOrderType] = useState<OrderType>("limit");
  const [tpEnabled, setTpEnabled] = useState(false);
  const [slEnabled, setSlEnabled] = useState(false);

  return (
    <div className="w-[320px] h-full flex flex-col border-l border-border shadow-md bg-card">
      {/* Order Panel Content (Scrollable) */}
      <div className="flex-grow p-4 space-y-5 overflow-y-auto custom-scrollbar">
        {/* 1. Tabs (Limit, Market) and Leverage */}
        <div className="flex justify-between items-center border-b border-border text-muted-foreground font-medium text-sm pt-1 pb-2">
          <div className="flex">
            <div
              className={`py-1 mr-4 cursor-pointer transition duration-150 ${
                orderType === "limit"
                  ? "text-foreground border-b-2 border-foreground"
                  : "hover:text-foreground"
              }`}
              onClick={() => setOrderType("limit")}
            >
              Limit
            </div>
            <div
              className={`py-1 mr-4 cursor-pointer transition duration-150 ${
                orderType === "market"
                  ? "text-foreground border-b-2 border-foreground"
                  : "hover:text-foreground"
              }`}
              onClick={() => setOrderType("market")}
            >
              Market
            </div>
          </div>
          <div className="text-xs font-semibold text-foreground">Leverage: 10x</div>
        </div>

        {/* 2. Limit Price Input */}
        {orderType === "limit" && (
          <div>
            <span className="text-light-text text-xs block mb-1">Limit Price (USD)</span>
            <Input
              type="text"
              placeholder="0.00"
              className="w-full text-lg font-medium"
            />
          </div>
        )}

        {/* 3. Amount Input */}
        <div>
          <span className="text-light-text text-xs block mb-1">Amount</span>
          <div className="relative">
            <Input
              type="text"
              defaultValue="0.00"
              className="w-full pr-16 text-lg font-medium"
            />
            <div className="absolute right-0 top-0 h-full flex items-center space-x-2 pr-3 text-sm font-semibold">
              <span className="text-foreground cursor-pointer">BTC</span>
              <span className="text-muted-foreground cursor-pointer border-l border-border pl-2">
                USD
              </span>
            </div>
          </div>
        </div>

        {/* 4. Percentage Buttons */}
        <div className="grid grid-cols-5 gap-1.5 mb-4">
          {["10%", "25%", "50%", "75%", "100%"].map((percentage) => (
            <Button
              key={percentage}
              variant="secondary"
              size="sm"
              className="text-xs py-1.5"
            >
              {percentage}
            </Button>
          ))}
        </div>

        {/* 5. Take Profit / Stop Loss */}
        <div className="space-y-3">
          {/* Take Profit Toggle */}
          <div>
            <label className="flex items-center text-foreground cursor-pointer mb-2">
              <Checkbox
                checked={tpEnabled}
                onCheckedChange={(checked) => setTpEnabled(checked as boolean)}
                className="mr-2"
              />
              <span className="text-sm font-medium">Take Profit</span>
            </label>
            {tpEnabled && (
              <div>
                <Input
                  type="text"
                  placeholder="0.00"
                  className="w-full text-sm font-medium"
                />
              </div>
            )}
          </div>

          {/* Stop Loss Toggle */}
          <div>
            <label className="flex items-center text-foreground cursor-pointer mb-2">
              <Checkbox
                checked={slEnabled}
                onCheckedChange={(checked) => setSlEnabled(checked as boolean)}
                className="mr-2"
              />
              <span className="text-sm font-medium">Stop Loss</span>
            </label>
            {slEnabled && (
              <div>
                <Input
                  type="text"
                  placeholder="0.00"
                  className="w-full text-sm font-medium"
                />
              </div>
            )}
          </div>
        </div>

        {/* 6. Buy / Sell Buttons */}
        <div className="flex space-x-3 pt-2 pb-3">
          <Button className="flex-1 bg-trading-blue hover:bg-trading-blue/90 text-white font-bold shadow-md">
            Buy
          </Button>
          <Button className="flex-1 bg-trading-red hover:bg-trading-red/90 text-white font-bold shadow-md">
            Sell
          </Button>
        </div>

        {/* 7. Account Details (First Block) */}
        <div className="text-sm space-y-1.5 pt-3 border-t border-border">
          <div className="flex justify-between text-light-text">
            <span>Value</span>
            <span className="text-foreground">- / -</span>
          </div>
          <div className="flex justify-between text-light-text">
            <span>Cost</span>
            <span className="text-foreground">- / -</span>
          </div>
          <div className="flex justify-between text-light-text">
            <span>Est. Liquidation Price</span>
            <span className="text-foreground">-</span>
          </div>
        </div>

        {/* 8. Trading Account Balance */}
        <div className="flex justify-between items-center pt-2">
          <span className="text-sm font-semibold text-foreground">Trading Account</span>
          <span className="text-sm font-bold text-primary">$18,224.34</span>
        </div>
        <div className="flex justify-end pt-0">
          <Button variant="secondary" size="sm" className="text-xs font-semibold">
            Deposit
          </Button>
        </div>

        {/* 9. Account Details (Second Block) */}
        <div className="text-sm space-y-1.5 pt-2">
          <div className="flex justify-between text-light-text">
            <span>Equity</span>
            <span className="text-foreground">$18,224.34</span>
          </div>
          <div className="flex justify-between text-light-text">
            <span>Available Balance</span>
            <span className="text-foreground">$18,224.34</span>
          </div>
          <div className="flex justify-between text-light-text">
            <span>Margin Health</span>
            <span className="text-foreground">$0</span>
          </div>
          <div className="flex justify-between text-light-text">
            <span>Maintenance Margin</span>
            <span className="text-foreground">$0</span>
          </div>
          <div className="flex justify-between text-light-text">
            <span>Total Account Leverage</span>
            <span className="text-foreground">14x</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPanel;
