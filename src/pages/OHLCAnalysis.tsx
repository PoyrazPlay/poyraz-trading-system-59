import React from 'react';
import HomeLayout from '@/components/layout/HomeLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CandlestickChart, Clock, BarChart3 } from 'lucide-react';
import TradingViewWidget from '@/components/charts/TradingViewWidget';

// Define OHLC data type
interface OHLCData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  atr: number;
  ha_color: string;
  volatility_b: number;
  trend_adx: number;
  trend_adx_pos: number;
  trend_adx_neg: number;
}

// Demo data for testing
const demoData: OHLCData[] = [
  { date: "28-02-2025 09:35", open: 22279.35, high: 22285.8, low: 22249.1, close: 22266.5, volume: 1, atr: 62.12, ha_color: "red", volatility_b: 0, trend_adx: 0, trend_adx_pos: 0, trend_adx_neg: 0 },
  { date: "28-02-2025 09:40", open: 22266.95, high: 22287.65, low: 22252.4, close: 22261.7, volume: 1, atr: 56.746, ha_color: "red", volatility_b: 0.043119, trend_adx: 0, trend_adx_pos: 0, trend_adx_neg: 0 },
  { date: "28-02-2025 09:45", open: 22261.15, high: 22281.25, low: 22255.4, close: 22259.65, volume: 1, atr: 50.5668, ha_color: "red", volatility_b: 0.051578, trend_adx: 0, trend_adx_pos: 0, trend_adx_neg: 0 },
  { date: "28-02-2025 09:50", open: 22258.85, high: 22282.3, low: 22258.85, close: 22272.6, volume: 1, atr: 45.14344, ha_color: "red", volatility_b: 0.089589, trend_adx: 0, trend_adx_pos: 0, trend_adx_neg: 0 },
  { date: "28-02-2025 09:55", open: 22272.8, high: 22276.05, low: 22233.6, close: 22235.35, volume: 1, atr: 44.60475, ha_color: "red", volatility_b: 0.228456, trend_adx: 0, trend_adx_pos: 0, trend_adx_neg: 0 },
  { date: "28-02-2025 10:00", open: 22235.4, high: 22247.45, low: 22224.1, close: 22238, volume: 1, atr: 40.3538, ha_color: "red", volatility_b: 0.252181, trend_adx: 0, trend_adx_pos: 0, trend_adx_neg: 0 }
];

// Function to fetch OHLC data
const fetchOHLCData = async (): Promise<OHLCData[]> => {
  const response = await fetch('http://localhost:5000/ohlc_data');
  if (!response.ok) {
    throw new Error('Failed to fetch OHLC data');
  }
  return response.json();
};

// Custom component for rendering candlesticks
const Candle = (props: any) => {
  const { x, y, width, height, low, high, open, close } = props;
  
  // Calculate the body start and end positions
  const bodyY = Math.min(open, close);
  const bodyHeight = Math.abs(close - open);
  
  // Determine if bullish or bearish
  const isBullish = close > open;
  const fill = isBullish ? '#10b981' : '#ef4444';
  
  // The center of the candle for drawing the wicks
  const centerX = x + width / 2;
  
  return (
    <g>
      {/* Draw the high/low line (the wick) */}
      <line 
        x1={centerX} 
        x2={centerX} 
        y1={y} 
        y2={y + height} 
        stroke={fill} 
        strokeWidth={1} 
      />
      
      {/* Draw the body */}
      <rect 
        x={x} 
        y={y + (isBullish ? height - bodyHeight : 0)} 
        width={width} 
        height={bodyHeight || 1} // Ensure at least 1px height
        fill={fill} 
      />
    </g>
  );
};

const OHLCAnalysis: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['ohlcData'],
    queryFn: fetchOHLCData,
    refetchInterval: 300000, // Refresh every 5 minutes
    meta: {
      onError: () => {
        toast.error("Failed to load OHLC data. Using demo data instead.");
      }
    }
  });

  const ohlcData = data || demoData;

  // Custom renderer for candlesticks
  const renderCandlestick = (props: any) => {
    const { x, y, width, height, index, payload } = props;
    const data = payload;
    
    return (
      <Candle
        key={`candle-${index}`}
        x={x - width / 2}
        y={y}
        width={width * 0.8}
        height={height}
        open={data.open}
        close={data.close}
        high={data.high}
        low={data.low}
      />
    );
  };

  // Process data for chart
  const chartData = ohlcData.map((item, index) => {
    const bullish = item.close > item.open;
    
    return {
      ...item,
      index,
      displayDate: item.date.split(' ')[1], // Extract only time part
      // Scale values for visualization
      highLowRange: item.high - item.low, // Used for y-axis domain calculation
      // For custom candlestick rendering
      candleStartY: bullish ? item.open : item.close,
      candleEndY: bullish ? item.close : item.open,
    };
  });

  // Calculate domain for y-axis
  const yMin = Math.min(...chartData.map(d => d.low)) * 0.9998;
  const yMax = Math.max(...chartData.map(d => d.high)) * 1.0002;

  if (isLoading) {
    return (
      <HomeLayout title="OHLC Analysis" subtitle="Loading market data...">
        <div className="flex items-center justify-center h-64 w-full">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-t-4 border-primary rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Loading OHLC data...</p>
          </div>
        </div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout 
      title="OHLC Analysis" 
      subtitle="Real-time market data powered by TradingView"
    >
      {/* Chart Card */}
      <Card className="w-full max-w-7xl mb-6 card-hover">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <CandlestickChart className="h-5 w-5" />
            NIFTY Price Chart
          </CardTitle>
          <CardDescription>
            Interactive TradingView chart with advanced analysis tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TradingViewWidget />
        </CardContent>
        <CardFooter className="border-t pt-4">
          <p className="text-sm text-muted-foreground">
            Powered by TradingView. Data updates in real-time.
          </p>
        </CardFooter>
      </Card>

      {/* OHLC Data Table */}
      <Card className="w-full max-w-7xl card-hover">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            OHLC Time Series Data
          </CardTitle>
          <CardDescription>
            Detailed OHLC and indicator values for each time period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-2 text-left font-medium">Timestamp</th>
                  <th className="py-3 px-2 text-right font-medium">Open</th>
                  <th className="py-3 px-2 text-right font-medium">High</th>
                  <th className="py-3 px-2 text-right font-medium">Low</th>
                  <th className="py-3 px-2 text-right font-medium">Close</th>
                  <th className="py-3 px-2 text-right font-medium">Volume</th>
                </tr>
              </thead>
              <tbody>
                {ohlcData.map((row, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="py-2 px-2 font-medium">{row.date}</td>
                    <td className="py-2 px-2 text-right">{row.open.toFixed(2)}</td>
                    <td className="py-2 px-2 text-right">{row.high.toFixed(2)}</td>
                    <td className="py-2 px-2 text-right">{row.low.toFixed(2)}</td>
                    <td className="py-2 px-2 text-right">{row.close.toFixed(2)}</td>
                    <td className="py-2 px-2 text-right">{row.volume}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Last update: {new Date().toLocaleTimeString()}
          </p>
        </CardFooter>
      </Card>
    </HomeLayout>
  );
};

export default OHLCAnalysis;
