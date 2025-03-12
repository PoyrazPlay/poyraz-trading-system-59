
import React from 'react';
import HomeLayout from '@/components/layout/HomeLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CandlestickChart, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import LightweightChart from '@/components/charts/LightweightChart';
import yahooFinance from 'yahoo-finance2';

// Chart data interface - matching the one in LightweightChart.tsx
interface ChartData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

const fetchYahooData = async (): Promise<ChartData[]> => {
  try {
    const result = await yahooFinance.historical('^NSEI', {
      period1: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
      period2: new Date(),
      interval: '1d',
    });

    return result.map(bar => ({
      time: Math.floor(new Date(bar.date).getTime() / 1000), // Convert to seconds
      open: Number(bar.open),
      high: Number(bar.high),
      low: Number(bar.low),
      close: Number(bar.close),
    }));
  } catch (error) {
    console.error('Failed to fetch Yahoo Finance data:', error);
    throw new Error('Failed to fetch market data');
  }
};

const OHLCAnalysis: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['yahooFinanceData'],
    queryFn: fetchYahooData,
    refetchInterval: 300000, // Refresh every 5 minutes
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to load market data. Please try again later.",
          variant: "destructive",
        });
      }
    }
  });

  if (isLoading) {
    return (
      <HomeLayout title="OHLC Analysis" subtitle="Loading market data...">
        <div className="flex items-center justify-center h-64 w-full">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-t-4 border-primary rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Loading market data...</p>
          </div>
        </div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout 
      title="OHLC Analysis" 
      subtitle="Real-time NIFTY market data from Yahoo Finance"
    >
      <Card className="w-full max-w-7xl mb-6 card-hover">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <CandlestickChart className="h-5 w-5" />
            NIFTY Price Chart
          </CardTitle>
          <CardDescription>
            Interactive chart powered by TradingView Lightweight Charts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data && <LightweightChart data={data} />}
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
