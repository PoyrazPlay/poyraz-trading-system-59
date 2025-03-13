
import React, { useState, useEffect } from 'react';
import HomeLayout from '@/components/layout/HomeLayout';
import { useToast } from '@/hooks/use-toast';

interface Trade {
  id: string;
  Symbol: string;
  Type: string;
  'Open Price': string | number;
  'Close Price': string | number;
  'Total Invested Value': string | number;
  PNL: string | number;
  'MAX PNL': string | number;
  'MIN PNL': string | number;
  'Total Profit': string | number;
  'Open Time': string;
  'Close Time': string;
  Duration: string;
}

const TodaysTrade = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTradesData();
  }, []);

  const fetchTradesData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/todays_trades');
      const data = await response.json();
      
      // Transform the data to match the expected format
      const formattedTrades = Object.entries(data).map(([id, trade]) => ({ 
        id, 
        ...trade as Omit<Trade, 'id'> 
      }));
      
      setTrades(formattedTrades);
      toast({
        title: "Data Updated",
        description: `Loaded ${formattedTrades.length} trades for today`,
      });
    } catch (error) {
      console.error('Error fetching trades data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch today's trades. Using demo data.",
        variant: "destructive",
      });
      
      // Mock data for demo if API fails
      const mockTrades = generateMockTradesData();
      setTrades(mockTrades);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate mock data for demo purposes
  const generateMockTradesData = (): Trade[] => {
    const mockData: Trade[] = [];
    const symbols = ["NIFTY", "BANKNIFTY", "RELIANCE", "TCS", "INFY"];
    const types = ["BUY", "SELL"];
    
    for (let i = 1; i <= 5; i++) {
      const openPrice = Math.floor(Math.random() * 10000) + 1000;
      const closePrice = openPrice + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 500);
      const investedValue = Math.floor(openPrice * (Math.random() * 10 + 1));
      const pnl = ((closePrice - openPrice) / openPrice * 100).toFixed(2);
      const maxPnl = (parseFloat(pnl) + Math.random() * 5).toFixed(2);
      const minPnl = (parseFloat(pnl) - Math.random() * 5).toFixed(2);
      const totalProfit = (investedValue * parseFloat(pnl) / 100).toFixed(2);
      
      // Generate times a few hours apart
      const today = new Date();
      const openTime = new Date(today);
      openTime.setHours(9 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 60), 0);
      
      const closeTime = new Date(openTime);
      closeTime.setHours(closeTime.getHours() + Math.floor(Math.random() * 3) + 1, Math.floor(Math.random() * 60), 0);
      
      // Calculate duration
      const durationMs = closeTime.getTime() - openTime.getTime();
      const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
      const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
      
      mockData.push({
        id: i.toString(),
        Symbol: symbols[Math.floor(Math.random() * symbols.length)],
        Type: types[Math.floor(Math.random() * types.length)],
        'Open Price': openPrice,
        'Close Price': closePrice,
        'Total Invested Value': investedValue,
        PNL: pnl + '%',
        'MAX PNL': maxPnl + '%',
        'MIN PNL': minPnl + '%',
        'Total Profit': totalProfit,
        'Open Time': openTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        'Close Time': closeTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        Duration: `${durationHours}h ${durationMinutes}m`
      });
    }
    
    return mockData;
  };

  return (
    <HomeLayout title="Today's Trades">
      <div className="card-glass rounded-xl p-6 w-full max-w-7xl">
        {isLoading ? (
          <div className="py-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-2 text-muted-foreground">Loading trades data...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 px-2 text-left font-medium">ID</th>
                  <th className="py-3 px-2 text-left font-medium">Symbol</th>
                  <th className="py-3 px-2 text-left font-medium">Type</th>
                  <th className="py-3 px-2 text-left font-medium">Open Price</th>
                  <th className="py-3 px-2 text-left font-medium">Close Price</th>
                  <th className="py-3 px-2 text-left font-medium">Invested Value</th>
                  <th className="py-3 px-2 text-left font-medium">PNL</th>
                  <th className="py-3 px-2 text-left font-medium">MAX PNL</th>
                  <th className="py-3 px-2 text-left font-medium">MIN PNL</th>
                  <th className="py-3 px-2 text-left font-medium">Total Profit</th>
                  <th className="py-3 px-2 text-left font-medium">Open Time</th>
                  <th className="py-3 px-2 text-left font-medium">Close Time</th>
                  <th className="py-3 px-2 text-left font-medium">Duration</th>
                </tr>
              </thead>
              <tbody>
                {trades.length > 0 ? (
                  trades.map((trade) => (
                    <tr key={trade.id} className="border-b border-border/40 hover:bg-muted/30">
                      <td className="py-3 px-2">{trade.id}</td>
                      <td className="py-3 px-2">{trade.Symbol}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          trade.Type === 'CE' ? 'bg-green-100 text-green-800' : 
                          trade.Type === 'PE' ? 'bg-red-100 text-red-800' :
                          trade.Type === 'BUY' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {trade.Type}
                        </span>
                      </td>
                      <td className="py-3 px-2">{trade['Open Price']}</td>
                      <td className="py-3 px-2">{trade['Close Price']}</td>
                      <td className="py-3 px-2">{trade['Total Invested Value']}</td>
                      <td className="py-3 px-2">
                        <span className={`font-medium ${
                          String(trade.PNL).includes('-') ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {trade.PNL}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-green-600">{trade['MAX PNL']}</td>
                      <td className="py-3 px-2 text-red-600">{trade['MIN PNL']}</td>
                      <td className="py-3 px-2">
                        <span className={`font-medium ${
                          String(trade['Total Profit']).startsWith('-') ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {trade['Total Profit']}
                        </span>
                      </td>
                      <td className="py-3 px-2">{trade['Open Time']}</td>
                      <td className="py-3 px-2">{trade['Close Time']}</td>
                      <td className="py-3 px-2">{trade.Duration}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={13} className="py-8 text-center text-muted-foreground">
                      No trades data available for today
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </HomeLayout>
  );
};

export default TodaysTrade;
