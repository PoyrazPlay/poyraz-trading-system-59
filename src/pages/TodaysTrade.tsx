import React, { useState, useEffect } from 'react';
import HomeLayout from '@/components/layout/HomeLayout';
import { useToast } from '@/hooks/use-toast';
import { ChevronDown, ChevronUp, CircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import apiClient from '@/utils/apiService';

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
  'Exit Condition'?: string;
  TradeData?: TradeDataPoint[];
}

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

const TodaysTrade = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedTrades, setExpandedTrades] = useState<{[key: string]: boolean}>({});

  const { toast } = useToast();

  useEffect(() => {
    fetchTradesData();
  }, []);

  const toggleTradeDetails = (tradeId: string) => {
    setExpandedTrades(prev => ({
      ...prev,
      [tradeId]: !prev[tradeId]
    }));
  };

  const fetchTradesData = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/todays_trades');
      
      const formattedTrades = Object.entries(response.data).map(([id, trade]) => ({ 
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
      
      const mockTrades = generateMockTradesData();
      setTrades(mockTrades);
    } finally {
      setIsLoading(false);
    }
  };

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
      
      const today = new Date();
      const openTime = new Date(today);
      openTime.setHours(9 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 60), 0);
      
      const closeTime = new Date(openTime);
      closeTime.setHours(closeTime.getHours() + Math.floor(Math.random() * 3) + 1, Math.floor(Math.random() * 60), 0);
      
      const durationMs = closeTime.getTime() - openTime.getTime();
      const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
      const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
      
      const tradeData: TradeDataPoint[] = [];
      const colorOptions = ["GGRRRRRRRR", "GGGRRRRRR", "GGGGGRRRRR", "RRRRRGGGGG"];
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
      
      mockData.push({
        id: i.toString(),
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
        'Exit Condition': Math.random() > 0.5 ? "OHLC_PriceAction" : "StopLoss",
        TradeData: tradeData
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>ID</TableHead>
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
                {trades.length > 0 ? (
                  trades.map((trade) => (
                    <React.Fragment key={trade.id}>
                      <TableRow className="hover:bg-muted/30">
                        <TableCell>
                          {trade.TradeData && trade.TradeData.length > 0 && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => toggleTradeDetails(trade.id)}
                              aria-label={expandedTrades[trade.id] ? "Hide details" : "Show details"}
                            >
                              {expandedTrades[trade.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>{trade.id}</TableCell>
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
                        <TableCell>{trade['Open Price']}</TableCell>
                        <TableCell>{trade['Close Price']}</TableCell>
                        <TableCell>{trade['Total Invested Value']}</TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            String(trade.PNL).includes('-') ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {trade.PNL}
                          </span>
                        </TableCell>
                        <TableCell className="text-green-600">{trade['MAX PNL']}</TableCell>
                        <TableCell className="text-red-600">{trade['MIN PNL']}</TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            String(trade['Total Profit']).startsWith('-') ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {trade['Total Profit']}
                          </span>
                        </TableCell>
                        <TableCell>{trade['Open Time']}</TableCell>
                        <TableCell>{trade['Close Time']}</TableCell>
                        <TableCell>{trade.Duration}</TableCell>
                        <TableCell>{trade['Exit Condition'] || 'N/A'}</TableCell>
                      </TableRow>
                      
                      {trade.TradeData && trade.TradeData.length > 0 && expandedTrades[trade.id] && (
                        <TableRow>
                          <TableCell colSpan={15} className="p-0 border-b-0">
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={15} className="py-8 text-center text-muted-foreground">
                      No trades data available for today
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </HomeLayout>
  );
};

export default TodaysTrade;
