
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HomeLayout from '@/components/layout/HomeLayout';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface OptionData {
  Indexltp: number;
  change_in_opn_interest: number;
  change_in_total_buy_quan: number;
  change_in_total_sell_quan: number;
  change_in_trade_volume: number;
  ltp: number;
  opn_interest: number;
  option_position: string;
  option_type: string;
  symbol: string;
  token: string;
  total_buy_quan: number;
  total_sell_quan: number;
  trade_volume: number;
}

interface TimeEntry {
  CE: OptionData;
  PE: OptionData;
  timestamp: string;
}

const StrikeDetail = () => {
  const { symbol, expiry, strikePrice } = useParams();
  const [timeData, setTimeData] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStrikeData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://54.221.81.212:5000/option_chain_by_strike_price`, {
          params: { 
            symbol, 
            expiry, 
            strike_price: strikePrice 
          }
        });
        
        console.log("Strike data response:", response.data);
        
        if (response.data && typeof response.data === 'object') {
          // Transform the data into an array format with timestamps
          const transformedData: TimeEntry[] = Object.entries(response.data)
            .map(([timestamp, data]: [string, any]) => ({
              timestamp,
              CE: data.CE,
              PE: data.PE
            }))
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); // Sort by most recent
          
          setTimeData(transformedData);
          setUsingFallbackData(false);
          
          toast({
            title: "Data Loaded",
            description: `Loaded data for ${symbol} ${expiry} ${strikePrice}`,
          });
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (error) {
        console.error("Error fetching strike price data:", error);
        setError("Failed to load option data for this strike price. Using fallback data.");
        
        // Generate mock data for demonstration
        const mockData = generateMockStrikeData();
        setTimeData(mockData);
        setUsingFallbackData(true);
        
        toast({
          title: "Using fallback data",
          description: "API connection failed. Using fallback data instead.",
          variant: "destructive",
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchStrikeData();
  }, [symbol, expiry, strikePrice]);

  const generateMockStrikeData = (): TimeEntry[] => {
    const mockTimeEntries: TimeEntry[] = [];
    const currentDate = new Date();
    const strikeNum = parseInt(strikePrice || "0");
    
    // Generate data entries for the last 10 time intervals (30 min each)
    for (let i = 0; i < 10; i++) {
      const timeStamp = new Date(currentDate);
      timeStamp.setMinutes(currentDate.getMinutes() - (i * 30));
      
      const indexValue = strikeNum + Math.floor(Math.random() * 200) - 100;
      
      const ceOptionPosition = strikeNum < indexValue ? "ITM" : "OTM";
      const peOptionPosition = strikeNum > indexValue ? "ITM" : "OTM";
      
      const ceLtp = ceOptionPosition === "ITM" 
        ? Math.max(10, Math.round((indexValue - strikeNum + Math.random() * 50) * 100) / 100)
        : Math.max(5, Math.round((Math.random() * 30) * 100) / 100);

      const peLtp = peOptionPosition === "ITM" 
        ? Math.max(10, Math.round((strikeNum - indexValue + Math.random() * 50) * 100) / 100)
        : Math.max(5, Math.round((Math.random() * 30) * 100) / 100);
      
      // Previous values to calculate changes
      const prevCeOpenInterest = Math.floor(Math.random() * 500000) + 50000;
      const prevPeOpenInterest = Math.floor(Math.random() * 500000) + 50000;
      const prevCeBuyQuan = Math.floor(Math.random() * 50000) + 5000;
      const prevPeBuyQuan = Math.floor(Math.random() * 50000) + 5000;
      const prevCeSellQuan = Math.floor(Math.random() * 50000) + 5000;
      const prevPeSellQuan = Math.floor(Math.random() * 50000) + 5000;
      const prevCeVolume = Math.floor(Math.random() * 100000) + 10000;
      const prevPeVolume = Math.floor(Math.random() * 100000) + 10000;

      // Current values 
      const ceOpenInterest = prevCeOpenInterest + Math.floor(Math.random() * 20000) - 10000;
      const peOpenInterest = prevPeOpenInterest + Math.floor(Math.random() * 20000) - 10000;
      const ceBuyQuan = prevCeBuyQuan + Math.floor(Math.random() * 10000) - 5000;
      const peBuyQuan = prevPeBuyQuan + Math.floor(Math.random() * 10000) - 5000;
      const ceSellQuan = prevCeSellQuan + Math.floor(Math.random() * 10000) - 5000;
      const peSellQuan = prevPeSellQuan + Math.floor(Math.random() * 10000) - 5000;
      const ceVolume = prevCeVolume + Math.floor(Math.random() * 5000) - 2500;
      const peVolume = prevPeVolume + Math.floor(Math.random() * 5000) - 2500;

      mockTimeEntries.push({
        timestamp: timeStamp.toISOString().replace('T', ' ').slice(0, 19),
        CE: {
          Indexltp: indexValue,
          change_in_opn_interest: ceOpenInterest - prevCeOpenInterest,
          change_in_total_buy_quan: ceBuyQuan - prevCeBuyQuan,
          change_in_total_sell_quan: ceSellQuan - prevCeSellQuan,
          change_in_trade_volume: ceVolume - prevCeVolume,
          ltp: ceLtp,
          opn_interest: ceOpenInterest,
          option_position: ceOptionPosition,
          option_type: "CE",
          symbol: `${symbol}${expiry}${strikePrice}CE`,
          token: "45426",
          total_buy_quan: ceBuyQuan,
          total_sell_quan: ceSellQuan,
          trade_volume: ceVolume,
        },
        PE: {
          Indexltp: indexValue,
          change_in_opn_interest: peOpenInterest - prevPeOpenInterest,
          change_in_total_buy_quan: peBuyQuan - prevPeBuyQuan,
          change_in_total_sell_quan: peSellQuan - prevPeSellQuan,
          change_in_trade_volume: peVolume - prevPeVolume,
          ltp: peLtp,
          opn_interest: peOpenInterest,
          option_position: peOptionPosition,
          option_type: "PE",
          symbol: `${symbol}${expiry}${strikePrice}PE`,
          token: "45427",
          total_buy_quan: peBuyQuan,
          total_sell_quan: peSellQuan,
          trade_volume: peVolume,
        }
      });
    }
    
    return mockTimeEntries;
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const formatTimestamp = (timestamp: string) => {
    // Check if the timestamp already has the right format
    if (timestamp.includes(' ')) {
      return timestamp;
    }
    
    // If it's an ISO string, format it nicely
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch (e) {
      return timestamp;
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const getColorClass = (value: number, isChange = false) => {
    if (!isChange) return "";
    return value > 0 ? "text-green-600" : value < 0 ? "text-red-600" : "";
  };

  return (
    <HomeLayout title={`Strike Price ${strikePrice} Details`}>
      <div className="w-full max-w-7xl mx-auto">
        <Card className="p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-1" 
              onClick={handleGoBack}
            >
              <ChevronLeft size={16} />
              Back to Option Chain
            </Button>
            <div className="text-xl font-semibold">
              {symbol} {expiry} @ {strikePrice}
              {usingFallbackData && <span className="ml-2 text-sm font-normal text-destructive">(Using Fallback Data)</span>}
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-4">
              {error}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead colSpan={5} className="text-center bg-muted/50">Call Option (CE)</TableHead>
                    <TableHead className="text-center bg-primary/20">Index & Time</TableHead>
                    <TableHead colSpan={5} className="text-center bg-muted/50">Put Option (PE)</TableHead>
                  </TableRow>
                  <TableRow>
                    <TableHead className="text-xs w-1/12">OI (Chg)</TableHead>
                    <TableHead className="text-xs w-1/12">Volume (Chg)</TableHead>
                    <TableHead className="text-xs w-1/12">LTP</TableHead>
                    <TableHead className="text-xs w-1/12">Buy Qty (Chg)</TableHead>
                    <TableHead className="text-xs w-1/12">Sell Qty (Chg)</TableHead>
                    <TableHead className="text-center bg-primary/10 w-2/12">Time & Index</TableHead>
                    <TableHead className="text-xs w-1/12">Sell Qty (Chg)</TableHead>
                    <TableHead className="text-xs w-1/12">Buy Qty (Chg)</TableHead>
                    <TableHead className="text-xs w-1/12">LTP</TableHead>
                    <TableHead className="text-xs w-1/12">Volume (Chg)</TableHead>
                    <TableHead className="text-xs w-1/12">OI (Chg)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeData.map((entry, index) => (
                    <TableRow key={index} className={index % 2 === 0 ? "bg-muted/5" : ""}>
                      {/* CE Data */}
                      <TableCell className={`text-xs ${entry.CE.option_position === "ITM" ? "bg-green-50 dark:bg-green-950/20" : ""}`}>
                        {formatNumber(entry.CE.opn_interest)}
                        <div className={getColorClass(entry.CE.change_in_opn_interest, true)}>
                          ({formatNumber(entry.CE.change_in_opn_interest)})
                        </div>
                      </TableCell>
                      <TableCell className={`text-xs ${entry.CE.option_position === "ITM" ? "bg-green-50 dark:bg-green-950/20" : ""}`}>
                        {formatNumber(entry.CE.trade_volume)}
                        <div className={getColorClass(entry.CE.change_in_trade_volume, true)}>
                          ({formatNumber(entry.CE.change_in_trade_volume)})
                        </div>
                      </TableCell>
                      <TableCell className={`text-xs font-semibold ${entry.CE.option_position === "ITM" ? "bg-green-50 dark:bg-green-950/20" : ""}`}>
                        {entry.CE.ltp.toFixed(2)}
                      </TableCell>
                      <TableCell className={`text-xs ${entry.CE.option_position === "ITM" ? "bg-green-50 dark:bg-green-950/20" : ""}`}>
                        {formatNumber(entry.CE.total_buy_quan)}
                        <div className={getColorClass(entry.CE.change_in_total_buy_quan, true)}>
                          ({formatNumber(entry.CE.change_in_total_buy_quan)})
                        </div>
                      </TableCell>
                      <TableCell className={`text-xs ${entry.CE.option_position === "ITM" ? "bg-green-50 dark:bg-green-950/20" : ""}`}>
                        {formatNumber(entry.CE.total_sell_quan)}
                        <div className={getColorClass(entry.CE.change_in_total_sell_quan, true)}>
                          ({formatNumber(entry.CE.change_in_total_sell_quan)})
                        </div>
                      </TableCell>
                      
                      {/* Time and Index */}
                      <TableCell className="text-center bg-primary/5 font-medium">
                        <div>{formatTimestamp(entry.timestamp)}</div>
                        <div className="font-semibold mt-1">
                          {entry.CE.Indexltp.toFixed(2)}
                        </div>
                      </TableCell>
                      
                      {/* PE Data */}
                      <TableCell className={`text-xs ${entry.PE.option_position === "ITM" ? "bg-green-50 dark:bg-green-950/20" : ""}`}>
                        {formatNumber(entry.PE.total_sell_quan)}
                        <div className={getColorClass(entry.PE.change_in_total_sell_quan, true)}>
                          ({formatNumber(entry.PE.change_in_total_sell_quan)})
                        </div>
                      </TableCell>
                      <TableCell className={`text-xs ${entry.PE.option_position === "ITM" ? "bg-green-50 dark:bg-green-950/20" : ""}`}>
                        {formatNumber(entry.PE.total_buy_quan)}
                        <div className={getColorClass(entry.PE.change_in_total_buy_quan, true)}>
                          ({formatNumber(entry.PE.change_in_total_buy_quan)})
                        </div>
                      </TableCell>
                      <TableCell className={`text-xs font-semibold ${entry.PE.option_position === "ITM" ? "bg-green-50 dark:bg-green-950/20" : ""}`}>
                        {entry.PE.ltp.toFixed(2)}
                      </TableCell>
                      <TableCell className={`text-xs ${entry.PE.option_position === "ITM" ? "bg-green-50 dark:bg-green-950/20" : ""}`}>
                        {formatNumber(entry.PE.trade_volume)}
                        <div className={getColorClass(entry.PE.change_in_trade_volume, true)}>
                          ({formatNumber(entry.PE.change_in_trade_volume)})
                        </div>
                      </TableCell>
                      <TableCell className={`text-xs ${entry.PE.option_position === "ITM" ? "bg-green-50 dark:bg-green-950/20" : ""}`}>
                        {formatNumber(entry.PE.opn_interest)}
                        <div className={getColorClass(entry.PE.change_in_opn_interest, true)}>
                          ({formatNumber(entry.PE.change_in_opn_interest)})
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>
    </HomeLayout>
  );
};

export default StrikeDetail;
