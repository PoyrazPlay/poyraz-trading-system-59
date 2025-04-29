import React, { useState, useEffect } from 'react';
import HomeLayout from '@/components/layout/HomeLayout';
import { useToast } from '@/hooks/use-toast';
import { ChevronDown, ChevronUp, CircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import apiClient from '@/utils/apiService';
import BackendSelector from '@/components/BackendSelector';
import { RefreshCw } from 'lucide-react';

interface TradeDataPoint {
  Timestamp: string;
  ColorString: string;
  PNL: string;
  'MAX PNL': string;
  'MIN PNL': string;
  LTP_OPT: string;
  SL: string;
}

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
  'Exit Condition'?: string;
  TradeData?: TradeDataPoint[];
}

interface TradeData {
  [key: string]: Trade;
}

// OHLC Color Indicator Component (reused from TodaysTrade page)
const OHLCColorIndicator = ({ colorString }: { colorString?: string }) => {
  if (!colorString) return null;
  
  return (
    <div className="flex items-center space-x-1">
      {colorString.split('').map((color, index) => (
        <CircleIcon 
          key={index} 
          className={`h-3 w-3 ${color === 'G' ? 'text-emerald-500 fill-emerald-500' : 'text-rose-500 fill-rose-500'}`}
          aria-label={color === 'G' ? 'Green' : 'Red'}
        />
      ))}
    </div>
  );
};

const HistTrades = () => {
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [tradeData, setTradeData] = useState<TradeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedTrades, setExpandedTrades] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchAvailableDates();
  }, []);

  const toggleTradeDetails = (tradeId: string) => {
    setExpandedTrades(prev => ({
      ...prev,
      [tradeId]: !prev[tradeId]
    }));
  };

  const fetchAvailableDates = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/available_hist_trade_dates');
      
      if (response.data && Array.isArray(response.data.dates)) {
        setDates(response.data.dates);
        if (response.data.dates.length > 0) {
          setSelectedDate(response.data.dates[0]);
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
      const response = await apiClient.get(`/hist_trade_data`, {
        params: { date }
      });
      setTradeData(response.data);
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
    const exitConditions = ["OHLC_PriceAction", "StopLoss", "TargetReached", "ManualExit"];
    const colorOptions = ["GGRRRRRRRR", "GGGRRRRRR", "GGGGGRRRRR", "RRRRRGGGGG"];
    
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
      
      // Generate mock trade data points with updated parameter names
      const tradeData: TradeDataPoint[] = [];
      const randomColorString = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      
      let currentTime = new Date(openTime);
      for (let j = 0; j < 5; j++) {
        currentTime.setMinutes(currentTime.getMinutes() + 5);
        const currentPnl = (parseFloat(pnl) * (j + 1) / 5).toFixed(2);
        
        tradeData.push({
          Timestamp: currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}),
          ColorString: randomColorString,
          'PNL': currentPnl,
          'MAX PNL': (parseFloat(currentPnl) + 1).toFixed(2),
          'MIN PNL': (parseFloat(currentPnl) - 1).toFixed(2),
          'LTP_OPT': (openPrice + j * 5).toString(),
          'SL': (-3000).toString(),
        });
      }
      
      mockData[i.toString()] = {
        Symbol: symbols[Math.floor(Math.random() * symbols.length)] + (Math.floor(Math.random() * 1000)) + (Math.random() > 0.5 ? "CE" : "PE"),
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
        Duration: `${durationHours}h ${durationMinutes}m`,
        'Exit Condition': exitConditions[Math.floor(Math.random() * exitConditions.length)],
        TradeData: tradeData
      };
    }
    
    return mockData;
  };

  return (
    <HomeLayout title="Historical Trades">
      <div className="card-glass rounded-xl p-6 w-full max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
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
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchAvailableDates()}
              disabled={isLoading}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              Refresh
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="py-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-2 text-muted-foreground">Loading trade data...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {tradeData && Object.keys(tradeData).length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Open Price</TableHead>
                    <TableHead>Close Price</TableHead>
                    <TableHead>Invested Value</TableHead>
                    <TableHead>PNL</TableHead>
                    <TableHead>MAX PNL</TableHead>
                    <TableHead>MIN PNL</TableHead>
                    <TableHead>Total Profit</TableHead>
                    <TableHead>Open Time</TableHead>
                    <TableHead>Close Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Exit Condition</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(tradeData).map(([key, trade]) => (
                    <React.Fragment key={key}>
                      <TableRow className="hover:bg-muted/30">
                        <TableCell>
                          {trade.TradeData && trade.TradeData.length > 0 && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => toggleTradeDetails(key)}
                              aria-label={expandedTrades[key] ? "Hide details" : "Show details"}
                            >
                              {expandedTrades[key] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>{trade.Symbol}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            trade.Type === 'CE' ? 'bg-green-100 text-green-800' : 
                            trade.Type === 'PE' ? 'bg-red-100 text-red-800' :
                            trade.Type === 'BUY' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {trade.Type}
                          </span>
                        </TableCell>
                        <TableCell>{trade["Open Price"]}</TableCell>
                        <TableCell>{trade["Close Price"]}</TableCell>
                        <TableCell>{trade["Total Invested Value"]}</TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            String(trade.PNL).includes('-') ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {trade.PNL}
                          </span>
                        </TableCell>
                        <TableCell className="text-green-600">{trade["MAX PNL"]}</TableCell>
                        <TableCell className="text-red-600">{trade["MIN PNL"]}</TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            String(trade["Total Profit"]).startsWith('-') ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {trade["Total Profit"]}
                          </span>
                        </TableCell>
                        <TableCell>{trade["Open Time"]}</TableCell>
                        <TableCell>{trade["Close Time"]}</TableCell>
                        <TableCell>{trade.Duration}</TableCell>
                        <TableCell>{trade["Exit Condition"] || 'N/A'}</TableCell>
                      </TableRow>
                      
                      {trade.TradeData && trade.TradeData.length > 0 && expandedTrades[key] && (
                        <TableRow>
                          <TableCell colSpan={14} className="p-0 border-b-0">
                            <div className="bg-muted/40 p-4 rounded-md m-2">
                              <h4 className="text-sm font-medium mb-3">Trade Details</h4>
                              <ScrollArea className="h-[300px]">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Timestamp</TableHead>
                                      <TableHead>OHLC Colors</TableHead>
                                      <TableHead>PNL</TableHead>
                                      <TableHead>MAX PNL</TableHead>
                                      <TableHead>MIN PNL</TableHead>
                                      <TableHead>LTP Option</TableHead>
                                      <TableHead>Stop Loss</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {trade.TradeData.map((dataPoint, index) => (
                                      <TableRow key={index} className="hover:bg-muted/30">
                                        <TableCell>{dataPoint.Timestamp}</TableCell>
                                        <TableCell>
                                          <OHLCColorIndicator colorString={dataPoint.ColorString} />
                                        </TableCell>
                                        <TableCell className={dataPoint['PNL'].includes('-') ? 'text-red-600' : 'text-green-600'}>
                                          {dataPoint['PNL']}
                                        </TableCell>
                                        <TableCell className="text-green-600">{dataPoint['MAX PNL']}</TableCell>
                                        <TableCell className="text-red-600">{dataPoint['MIN PNL']}</TableCell>
                                        <TableCell>{dataPoint.LTP_OPT}</TableCell>
                                        <TableCell className="text-red-600">{dataPoint.SL}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </ScrollArea>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
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
