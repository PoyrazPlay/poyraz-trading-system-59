import { useEffect, useState } from 'react';
import { ArrowDownIcon, ArrowUpIcon, BarChart3Icon, ChevronsUpDownIcon, TimerIcon, ActivityIcon, CircleIcon, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import HomeLayout from '@/components/layout/HomeLayout';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import apiClient from '@/utils/apiService';

interface LiveTradeData {
  market_open: boolean;
  trade_status: string;
  index_price: number;
  "Current Time"?: string;
  symbol?: string;
  type?: string;
  ltp?: number;
  entry_price?: number;
  total_invested_value?: number;
  lots?: number;
  lot_size?: number;
  total_pnl?: number;
  max_pnl?: number;
  min_pnl?: number;
  stop_loss?: number;
  index_opening?: number;
  index_closing?: number;
  trade_opening_time?: string;
  trade_closing_time?: string;
  ohlc_colorString?: string;
}

const demoTradeData: LiveTradeData = {
  market_open: true,
  trade_status: "Active",
  index_price: 22145.35,
  "Current Time": "2023-11-02 14:35:22",
  symbol: "NIFTY 22NOV 22100 CE",
  type: "CE",
  ltp: 245.50,
  entry_price: 210.75,
  total_invested_value: 210750,
  lots: 5,
  lot_size: 50,
  total_pnl: 8687.50,
  max_pnl: 12250.00,
  min_pnl: -2175.00,
  stop_loss: 190.00,
  index_opening: 22034.75,
  index_closing: 0,
  trade_opening_time: "2023-11-02 09:30:15",
  trade_closing_time: "",
  ohlc_colorString: "GGRRRRRRRG"
};

const OHLCColorIndicator = ({ colorString }: { colorString?: string }) => {
  if (!colorString) return null;
  
  return (
    <div className="flex flex-col space-y-2">
      <h3 className="text-sm font-medium">OHLC Trend</h3>
      <div className="flex items-center space-x-1">
        {colorString.split('').map((color, index) => (
          <CircleIcon 
            key={index} 
            className={`h-4 w-4 ${color === 'G' ? 'text-emerald-500 fill-emerald-500' : 'text-rose-500 fill-rose-500'}`}
            aria-label={color === 'G' ? 'Green' : 'Red'}
          />
        ))}
      </div>
      <div className="text-xs text-muted-foreground">
        <span className="inline-flex items-center mr-2">
          <CircleIcon className="h-3 w-3 mr-1 text-emerald-500 fill-emerald-500" /> Green (Bullish)
        </span>
        <span className="inline-flex items-center">
          <CircleIcon className="h-3 w-3 mr-1 text-rose-500 fill-rose-500" /> Red (Bearish)
        </span>
      </div>
    </div>
  );
};

const LiveTrade = () => {
  const [tradeData, setTradeData] = useState<LiveTradeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/live_trade');
      
      setTradeData(response.data);
      toast.success("Live trade data updated");
    } catch (error) {
      console.error('Error fetching live trade data:', error);
      setError("Could not fetch live trade data. Using demo data instead.");
      setTradeData(demoTradeData); // Use demo data on error
      toast.error("Failed to fetch live data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Set up polling for real-time updates
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  if (loading && !tradeData) {
    return (
      <HomeLayout title="Live Trading">
        <div className="flex items-center justify-center h-64 w-full">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-t-4 border-primary rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Loading trade data...</p>
          </div>
        </div>
      </HomeLayout>
    );
  }

  const data = tradeData || demoTradeData;
  
  const getPnlColor = (pnl: number | undefined) => {
    if (!pnl) return "text-muted-foreground";
    return pnl >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400";
  };

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return "N/A";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <HomeLayout 
      title="Live Trading" 
      subtitle="Real-time market data and active trades"
      action={
        <Button
          onClick={() => {
            toast.info("Refreshing live trade data...");
            fetchData();
          }}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
      }
    >
      {error && (
        <Alert variant="destructive" className="mb-6 max-w-5xl mx-auto">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-7xl mb-6">
        <Card className={`${data.market_open ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-rose-50 dark:bg-rose-900/20'} transition-all card-hover`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full animate-pulse ${data.market_open ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
              Market Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${data.market_open ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {data.market_open ? 'OPEN' : 'CLOSED'}
            </p>
          </CardContent>
        </Card>

        <Card className={`${data.trade_status === 'Active' ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''} transition-all card-hover`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ActivityIcon className="h-4 w-4" />
              Trade Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${data.trade_status === 'Active' ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
              {data.trade_status}
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3Icon className="h-4 w-4" />
              Index Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold">{data.index_price?.toLocaleString()}</p>
              <div className="flex items-center text-xs font-medium text-emerald-600">
                <ArrowUpIcon className="h-3 w-3 mr-1" />
                0.76%
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Last updated: {data["Current Time"] || "N/A"}
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ChevronsUpDownIcon className="h-4 w-4" />
              PnL Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <p className={`text-2xl font-bold ${getPnlColor(data.total_pnl)}`}>
                {formatCurrency(data.total_pnl)}
              </p>
              {(data.total_pnl || 0) > 0 ? (
                <div className="flex items-center text-xs font-medium text-emerald-600">
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                  {((data.total_pnl || 0) / (data.total_invested_value || 1) * 100).toFixed(2)}%
                </div>
              ) : (
                <div className="flex items-center text-xs font-medium text-rose-600">
                  <ArrowDownIcon className="h-3 w-3 mr-1" />
                  {Math.abs(((data.total_pnl || 0) / (data.total_invested_value || 1) * 100)).toFixed(2)}%
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-muted-foreground">
              <div>Max: <span className={getPnlColor(data.max_pnl)}>{formatCurrency(data.max_pnl)}</span></div>
              <div>Min: <span className={getPnlColor(data.min_pnl)}>{formatCurrency(data.min_pnl)}</span></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="w-full max-w-7xl card-hover">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <TimerIcon className="h-5 w-5" />
            Active Trade Details
          </CardTitle>
          <CardDescription>
            Current position and real-time trade metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Symbol</h3>
                  <p className="text-xl font-semibold">{data.symbol || "N/A"}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Type</h3>
                    <p className="font-medium">{data.type || "N/A"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Position Size</h3>
                    <p className="font-medium">{data.lots || 0} Lots ({data.lot_size || 0} units)</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Current Price</h3>
                    <p className="text-xl font-semibold">{data.ltp?.toLocaleString() || "N/A"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Entry Price</h3>
                    <p className="text-xl font-semibold">{data.entry_price?.toLocaleString() || "N/A"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Stop Loss</h3>
                    <p className="font-medium text-rose-600">{data.stop_loss?.toLocaleString() || "N/A"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Invested Value</h3>
                    <p className="font-medium">{formatCurrency(data.total_invested_value)}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card rounded-lg p-4 border shadow-sm">
                <OHLCColorIndicator colorString={data.ohlc_colorString} />
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Trade Times</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Opening Time</p>
                    <p className="font-medium">{data.trade_opening_time || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Closing Time</p>
                    <p className="font-medium">{data.trade_closing_time || "Active"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Current Time</p>
                    <p className="font-medium">{data["Current Time"] || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Index Values</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Index Opening</p>
                    <p className="font-medium">{data.index_opening?.toLocaleString() || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Index Closing</p>
                    <p className="font-medium">{data.index_closing ? data.index_closing.toLocaleString() : "Active"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Current Index</p>
                    <p className="font-medium">{data.index_price?.toLocaleString() || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <p className="text-sm text-muted-foreground">
            Data refreshes automatically every 30 seconds. Last update: {data["Current Time"] || "N/A"}
          </p>
        </CardFooter>
      </Card>
    </HomeLayout>
  );
};

export default LiveTrade;
