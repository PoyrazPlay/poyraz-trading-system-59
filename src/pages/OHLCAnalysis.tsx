
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import HomeLayout from '@/components/layout/HomeLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  ComposedChart,
  Bar,
  Line,
  Legend
} from 'recharts';
import { CandlestickChart, Clock, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

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

// Custom tooltip for chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Card className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-md border border-gray-200 dark:border-gray-700">
        <div className="font-medium">{data.date}</div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-1 text-sm">
          <div>Open: <span className="font-medium">{data.open.toFixed(2)}</span></div>
          <div>High: <span className="font-medium">{data.high.toFixed(2)}</span></div>
          <div>Low: <span className="font-medium">{data.low.toFixed(2)}</span></div>
          <div>Close: <span className="font-medium">{data.close.toFixed(2)}</span></div>
        </div>
        <div className="mt-1 text-sm">
          <div>ATR: <span className="font-medium">{data.atr.toFixed(2)}</span></div>
          <div>Volatility: <span className="font-medium">{data.volatility_b.toFixed(4)}</span></div>
        </div>
      </Card>
    );
  }
  return null;
};

const OHLCAnalysis: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['ohlcData'],
    queryFn: fetchOHLCData,
    refetchInterval: 300000, // Refresh every 5 minutes
    onError: () => {
      toast.error("Failed to load OHLC data. Using demo data instead.");
    }
  });

  const ohlcData = data || demoData;

  // Format data for the chart
  const chartData = ohlcData.map(item => ({
    ...item,
    // Format date for display
    displayDate: item.date.split(' ')[1],
    // Calculate candle body height
    candleBody: Math.abs(item.close - item.open),
    // Determine if candle is bullish or bearish
    isBullish: item.close > item.open,
  }));

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
      subtitle="5-minute candlestick chart with technical indicators"
    >
      {/* Chart Card */}
      <Card className="w-full max-w-7xl mb-6 card-hover">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <CandlestickChart className="h-5 w-5" />
            5-Minute OHLC Chart
          </CardTitle>
          <CardDescription>
            Candlestick chart with price and technical indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="displayDate" />
                <YAxis 
                  yAxisId="price" 
                  domain={['dataMin', 'dataMax']} 
                  allowDecimals={false}
                  orientation="right"
                />
                <YAxis 
                  yAxisId="indicator" 
                  domain={[0, 'dataMax']} 
                  orientation="left"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  name="OHLC Candle"
                  dataKey="candleBody"
                  fill="transparent"
                  stroke="#8884d8"
                  yAxisId="price"
                  shape={(props) => {
                    const { x, y, width, height, isBullish } = props;
                    const fill = props.payload.isBullish ? '#10b981' : '#ef4444';
                    
                    // Access payload data
                    const { high, low, open, close } = props.payload;
                    
                    // Calculate positions
                    const xCenter = x + width / 2;
                    const candleTop = Math.min(
                      props.yAxis.scale(open),
                      props.yAxis.scale(close)
                    );
                    const candleBottom = Math.max(
                      props.yAxis.scale(open),
                      props.yAxis.scale(close)
                    );
                    const wickTop = props.yAxis.scale(low);
                    const wickBottom = props.yAxis.scale(high);
                    
                    return (
                      <g>
                        {/* Candle body */}
                        <rect
                          x={x}
                          y={candleTop}
                          width={width}
                          height={Math.max(1, candleBottom - candleTop)}
                          fill={fill}
                          stroke={fill}
                        />
                        {/* Wick */}
                        <line
                          x1={xCenter}
                          y1={wickBottom}
                          x2={xCenter}
                          y2={wickTop}
                          stroke={fill}
                          strokeWidth={1}
                        />
                      </g>
                    );
                  }}
                />
                <Line
                  name="ATR"
                  type="monotone"
                  dataKey="atr"
                  stroke="#82ca9d"
                  dot={false}
                  yAxisId="indicator"
                />
                <Line
                  name="Volatility"
                  type="monotone"
                  dataKey="volatility_b"
                  stroke="#8884d8"
                  dot={false}
                  yAxisId="indicator"
                />
                <Line
                  name="ADX"
                  type="monotone"
                  dataKey="trend_adx"
                  stroke="#ffc658"
                  dot={false}
                  yAxisId="indicator"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <p className="text-sm text-muted-foreground">
            Data updates automatically every 5 minutes. Chart displays OHLC data with ATR, Volatility, and ADX indicators.
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
                  <th className="py-3 px-2 text-right font-medium">ATR</th>
                  <th className="py-3 px-2 text-center font-medium">HA Color</th>
                  <th className="py-3 px-2 text-right font-medium">Volatility</th>
                  <th className="py-3 px-2 text-right font-medium">ADX</th>
                  <th className="py-3 px-2 text-right font-medium">ADX+</th>
                  <th className="py-3 px-2 text-right font-medium">ADX-</th>
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
                    <td className="py-2 px-2 text-right">{row.atr.toFixed(2)}</td>
                    <td className="py-2 px-2 text-center">
                      <span className={`inline-block w-6 h-6 rounded-full ${row.ha_color === 'red' ? 'bg-red-500' : 'bg-green-500'}`}></span>
                    </td>
                    <td className="py-2 px-2 text-right">{row.volatility_b.toFixed(6)}</td>
                    <td className="py-2 px-2 text-right">{row.trend_adx}</td>
                    <td className="py-2 px-2 text-right">{row.trend_adx_pos}</td>
                    <td className="py-2 px-2 text-right">{row.trend_adx_neg}</td>
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
