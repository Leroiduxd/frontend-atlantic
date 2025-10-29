import { useState } from "react";
import { Button } from "@/components/ui/button";

type TabType = "openPositions" | "pendingOrders" | "closedPositions" | "cancelledOrders";

const PositionsSection = () => {
  const [activeTab, setActiveTab] = useState<TabType>("openPositions");

  const tabConfig = [
    { id: "openPositions" as const, label: "Open Positions (2)" },
    { id: "pendingOrders" as const, label: "Pending Orders (3)" },
    { id: "closedPositions" as const, label: "Closed Positions (14)" },
    { id: "cancelledOrders" as const, label: "Cancelled Orders (5)" },
  ];

  return (
    <section id="positions" className="snap-section flex flex-col justify-start p-0 h-screen w-full">
      {/* Tabs Navigation */}
      <div className="flex justify-start space-x-0 border-b border-border flex-shrink-0 bg-background">
        <div className="flex space-x-2 pl-0 pb-0 bg-transparent">
          {tabConfig.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 rounded-none text-sm font-semibold transition duration-200 border-b-2 ${
                activeTab === tab.id
                  ? "bg-active-tab text-foreground border-foreground"
                  : "text-muted-foreground hover:bg-hover-bg border-transparent"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs Content */}
      <div className="flex-grow p-0 overflow-hidden bg-background">
        <div className="p-2 border-b border-border flex justify-between items-start space-x-4">
          <div className="min-h-6 text-xs text-light-text italic flex-grow text-right">
            Gestion des Positions
          </div>
        </div>

        {/* Open Positions */}
        {activeTab === "openPositions" && (
          <div className="h-full overflow-y-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="sticky top-0 bg-background border-b border-border">
                <tr>
                  <th className="pl-4 pr-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-light-text">
                    Pair
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-light-text">
                    Open Time
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-light-text">
                    Side / Lev.
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-light-text">
                    Margin
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-light-text">
                    Current Price
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-light-text">
                    P&L (ROE)
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-light-text">
                    TP/SL
                  </th>
                  <th className="pr-4 pl-3 py-2 text-right text-xs font-medium uppercase tracking-wider text-light-text">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-hover-bg transition duration-100">
                  <td className="pl-4 pr-3 py-2 whitespace-nowrap text-sm font-semibold">
                    BTC/USD
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-light-text">
                    2025-10-28 14:30
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                    <span className="text-trading-blue font-bold">LONG</span> / 5x
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">$500.00</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">65,120.50</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-bold text-trading-blue">
                    +25.50 (+5.1%)
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-light-text">
                    TP: N/A
                    <br />
                    SL: 64,500.00
                  </td>
                  <td className="pr-4 pl-3 py-2 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button className="text-trading-blue hover:text-trading-blue/80 text-xs">
                      Edit TP/SL
                    </button>
                    <Button
                      size="sm"
                      className="bg-trading-red/10 text-trading-red hover:bg-trading-red/20 text-xs font-semibold"
                    >
                      Close
                    </Button>
                  </td>
                </tr>
                <tr className="hover:bg-hover-bg transition duration-100">
                  <td className="pl-4 pr-3 py-2 whitespace-nowrap text-sm font-semibold">
                    ETH/USD
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-light-text">
                    2025-10-27 09:15
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                    <span className="text-trading-red font-bold">SHORT</span> / 10x
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">$200.00</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">3,520.10</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-bold text-trading-red">
                    -12.80 (-6.4%)
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-light-text">
                    TP: 3,400.00
                    <br />
                    SL: N/A
                  </td>
                  <td className="pr-4 pl-3 py-2 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button className="text-trading-blue hover:text-trading-blue/80 text-xs">
                      Edit TP/SL
                    </button>
                    <Button
                      size="sm"
                      className="bg-trading-red/10 text-trading-red hover:bg-trading-red/20 text-xs font-semibold"
                    >
                      Close
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Pending Orders */}
        {activeTab === "pendingOrders" && (
          <div className="h-full overflow-y-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="sticky top-0 bg-background border-b border-border">
                <tr>
                  <th className="pl-4 pr-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-light-text">
                    Pair
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-light-text">
                    Created
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-light-text">
                    Type / Side
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-light-text">
                    Limit Price
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-light-text">
                    Amount
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-light-text">
                    TP/SL
                  </th>
                  <th className="pr-4 pl-3 py-2 text-right text-xs font-medium uppercase tracking-wider text-light-text">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-hover-bg transition duration-100">
                  <td className="pl-4 pr-3 py-2 whitespace-nowrap text-sm font-semibold">
                    BTC/USD
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-light-text">
                    2025-10-29 08:00
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                    Limit / <span className="text-trading-blue font-bold">LONG</span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">64,000.00</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">$300.00</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-light-text">
                    TP: 66,000
                    <br />
                    SL: 63,500
                  </td>
                  <td className="pr-4 pl-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="text-xs font-semibold"
                    >
                      Cancel
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Closed Positions */}
        {activeTab === "closedPositions" && (
          <div className="h-full overflow-y-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="sticky top-0 bg-background border-b border-border">
                <tr>
                  <th className="pl-4 pr-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-light-text">
                    Pair
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-light-text">
                    Open Time
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-light-text">
                    Close Time
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-light-text">
                    Side / Lev.
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-light-text">
                    P&L Net
                  </th>
                  <th className="pr-4 pl-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-light-text">
                    Margin
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-hover-bg transition duration-100">
                  <td className="pl-4 pr-3 py-2 whitespace-nowrap text-sm font-semibold">
                    EUR/USD
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-light-text">
                    2025-10-25 10:00
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-light-text">
                    2025-10-26 18:00
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">Long / 2x</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-bold text-trading-blue">
                    +45.20 (+9.0%)
                  </td>
                  <td className="pr-4 pl-3 py-2 whitespace-nowrap text-sm">$500.00</td>
                </tr>
                <tr className="hover:bg-hover-bg transition duration-100">
                  <td className="pl-4 pr-3 py-2 whitespace-nowrap text-sm font-semibold">
                    XAU/USD
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-light-text">
                    2025-10-24 07:00
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-light-text">
                    2025-10-24 11:30
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">Short / 5x</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-bold text-trading-red">
                    -15.00 (-3.0%)
                  </td>
                  <td className="pr-4 pl-3 py-2 whitespace-nowrap text-sm">$500.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Cancelled Orders */}
        {activeTab === "cancelledOrders" && (
          <div className="h-full overflow-y-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="sticky top-0 bg-background border-b border-border">
                <tr>
                  <th className="pl-4 pr-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-light-text">
                    Pair
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-light-text">
                    Created
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-light-text">
                    Cancelled
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-light-text">
                    Type / Side
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-light-text">
                    Price
                  </th>
                  <th className="pr-4 pl-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-light-text">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-hover-bg transition duration-100">
                  <td className="pl-4 pr-3 py-2 whitespace-nowrap text-sm font-semibold">
                    BTC/USD
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-light-text">
                    2025-10-27 10:00
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-light-text">
                    2025-10-27 10:05
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                    Limit / <span className="text-trading-blue font-bold">LONG</span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">62,500.00</td>
                  <td className="pr-4 pl-3 py-2 whitespace-nowrap text-sm">$100.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default PositionsSection;
