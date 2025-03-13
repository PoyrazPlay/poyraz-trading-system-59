
import React, { useState, useEffect } from 'react';
import HomeLayout from '@/components/layout/HomeLayout';
import { useToast } from '@/hooks/use-toast';

interface Trade {
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

interface TradeData {
  [key: string]: Trade;
}

const HistTrades = () => {
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [tradeData, setTradeData] = useState<TradeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAvailableDates();
  }, []);

  const fetchAvailableDates = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://54.221.81.212:5000:5000/available_hist_trade_dates');
      const data = await response.json();
      
      if (data && Array.isArray(data.dates)) {
        setDates(data.dates);
        if (data.dates.length > 0) {
          setSelectedDate(data.dates[0]);
        }
      } else {
        throw new Error("Invalid data format for dates");
      }
    } catch (error) {
      console.error('Error fetching available dates:', error);
      toast({
        title: "Error",
        description: "Failed to fetch available dates. Using demo data.",
        variant: "destructive",
      });
      
      // Demo dates if API fails
      const demoDates = generateDemoDates();
      setDates(demoDates);
      if (demoDates.length > 0) {
        setSelectedDate(demoDates[0]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchTradeData(selectedDate);
    }
  }, [selectedDate]);

  const fetchTradeData = async (date: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://54.221.81.212:5000:5000/hist_trade_data?date=${date}`);
      const data = await response.json();
      setTradeData(data);
      toast({
        title: "Data Loaded",
        description: `Loaded trade data for ${date}`,
      });
    } catch (error) {
      console.error('Error fetching historical trade data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch trade data. Using demo data.",
        variant: "destructive",
      });
      
      // Set mock data if API fails
      setTradeData(generateMockTradeData());
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDate(e.target.value);
  };

  // Generate mock dates for demo if API fails
  const generateDemoDates = (): string[] => {
    const today = new Date();
    const dates: string[] = [];
    
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i - 1); // Past few days
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  // Generate mock trade data for demo purposes
  const generateMockTradeData = (): TradeData => {
    const mockData: TradeData = {};
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
      
      mockData[i.toString()] = {
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
      };
    }
    
    return mockData;
  };

  return (
    <HomeLayout title="Historical Trades">
      <div className="card-glass rounded-xl p-6 w-full max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <label htmlFor="date-select" className="text-sm font-medium">
            Select Date:
          </label>
          <select 
            id="date-select" 
            value={selectedDate} 
            onChange={handleDateChange}
            className="bg-background border border-input px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          >
            <option value="">--Select a date--</option>
            {dates.map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="py-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-2 text-muted-foreground">Loading trade data...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {tradeData && Object.keys(tradeData).length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
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
                  {Object.entries(tradeData).map(([key, trade]) => (
                    <tr key={key} className="border-b border-border/40 hover:bg-muted/30">
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
                      <td className="py-3 px-2">{trade["Open Price"]}</td>
                      <td className="py-3 px-2">{trade["Close Price"]}</td>
                      <td className="py-3 px-2">{trade["Total Invested Value"]}</td>
                      <td className="py-3 px-2">
                        <span className={`font-medium ${
                          String(trade.PNL).includes('-') ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {trade.PNL}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-green-600">{trade["MAX PNL"]}</td>
                      <td className="py-3 px-2 text-red-600">{trade["MIN PNL"]}</td>
                      <td className="py-3 px-2">
                        <span className={`font-medium ${
                          String(trade["Total Profit"]).startsWith('-') ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {trade["Total Profit"]}
                        </span>
                      </td>
                      <td className="py-3 px-2">{trade["Open Time"]}</td>
                      <td className="py-3 px-2">{trade["Close Time"]}</td>
                      <td className="py-3 px-2">{trade.Duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                {selectedDate ? 
                  'No trade data available for selected date' : 
                  'Please select a date to view historical trade data'
                }
              </div>
            )}
          </div>
        )}
      </div>
    </HomeLayout>
  );
};

export default HistTrades;
