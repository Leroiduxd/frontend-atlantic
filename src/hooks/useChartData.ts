import { useState, useEffect } from 'react';

interface ChartData {
  time: string;
  timestamp: string;
  open: string;
  high: string;
  low: string;
  close: string;
}

export const useChartData = (pair: number = 0, interval: string = "300") => {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://backend.brokex.trade/history?pair=${pair}&interval=${interval}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 30000);

    return () => clearInterval(intervalId);
  }, [pair, interval]);

  return { data, loading };
};
