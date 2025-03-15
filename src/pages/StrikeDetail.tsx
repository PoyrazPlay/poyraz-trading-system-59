
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
          
          toast({
            title: "Data Loaded",
            description: `Loaded data for ${symbol} ${expiry} ${strikePrice}`,
          });
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (error) {
        console.error("Error fetching strike price data:", error);
        setError("Failed to load option data for this strike price");
        
        // Generate mock data for demonstration
        const mockData = generateMockStrikeData();
        setTimeData(mockData);
        
        toast({
          title: "Using demo data",
          description: "API connection failed. Using demonstration data instead.",
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
    
    // Generate data entries for the last 10 time intervals (30 min each)
    for (let i = 0; i < 10; i++) {
      const timeStamp = new Date(currentDate);
      timeStamp.setMinutes(currentDate.getMinutes() - (i * 30));
      
      const indexValue = 22500 + Math.floor(Math.random() * 200) - 100;
      const strikeNum = parseInt(strikePrice || "0");
      
      const ceOptionPosition = strikeNum < indexValue ? "ITM" : "OTM";
      const peOptionPosition = strikeNum > indexValue ? "ITM" : "OTM";
      
      mockTimeEntries.push({
        timestamp: timeStamp.toISOString().replace('T', ' ').slice(0, 19),
        CE: {
          Indexltp: indexValue,
          change_in_opn_interest: Math.floor(Math.random() * 10000) - 5000,
          change_in_total_buy_quan: Math.floor(Math.random() * 20000) - 10000,
          change_in_total_sell_quan: Math.floor(Math.random() * 20000) - 10000,
          change_in_trade_volume: Math.floor(Math.random() * 10000) - 5000,
          ltp: ceOptionPosition === "ITM" ? (indexValue - strikeNum + Math.random() * 50) : (Math.random() * 50),
          opn_interest: Math.floor(Math.random() * 500000) + 100000,
          option_position: ceOptionPosition,
          option_type: "CE",
          symbol: `${symbol}${expiry}${strikePrice}CE`,
          token: "12345",
          total_buy_quan: Math.floor(Math.random() * 50000) + 10000,
          total_sell_quan: Math.floor(Math.random() * 50000) + 10000,
          trade_volume: Math.floor(Math.random() * 100000) + 20000,
        },
        PE: {
          Indexltp: indexValue,
          change_in_opn_interest: Math.floor(Math.random() * 10000) - 5000,
          change_in_total_buy_quan: Math.floor(Math.random() * 20000) - 10000,
          change_in_total_sell_quan: Math.floor(Math.random() * 20000) - 10000,
          change_in_trade_volume: Math.floor(Math.random() * 10000) - 5000,
          ltp: peOptionPosition === "ITM" ? (strikeNum - indexValue + Math.random() * 50) : (Math.random() * 50),
          opn_interest: Math.floor(Math.random() * 500000) + 100000,
          option_position: peOptionPosition,
          option_type: "PE",
          symbol: `${symbol}${expiry}${strikePrice}PE`,
          token: "12346",
          total_buy_quan: Math.floor(Math.random() * 50000) + 10000,
          total_sell_quan: Math.floor(Math.random() * 50000) + 10000,
          trade_volume: Math.floor(Math.random() * 100000) + 20000,
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
                      <TableCell className={`text-xs ${entry.CE.option_position === "ITM" ? "bg-green-50" : ""}`}>
                        {formatNumber(entry.CE.opn_interest)}
                        <div className={getColorClass(entry.CE.change_in_opn_interest, true)}>
                          ({formatNumber(entry.CE.change_in_opn_interest)})
                        </div>
                      </TableCell>
                      <TableCell className={`text-xs ${entry.CE.option_position === "ITM" ? "bg-green-50" : ""}`}>
                        {formatNumber(entry.CE.trade_volume)}
                        <div className={getColorClass(entry.CE.change_in_trade_volume, true)}>
                          ({formatNumber(entry.CE.change_in_trade_volume)})
                        </div>
                      </TableCell>
                      <TableCell className={`text-xs font-semibold ${entry.CE.option_position === "ITM" ? "bg-green-50" : ""}`}>
                        {entry.CE.ltp.toFixed(2)}
                      </TableCell>
                      <TableCell className={`text-xs ${entry.CE.option_position === "ITM" ? "bg-green-50" : ""}`}>
                        {formatNumber(entry.CE.total_buy_quan)}
                        <div className={getColorClass(entry.CE.change_in_total_buy_quan, true)}>
                          ({formatNumber(entry.CE.change_in_total_buy_quan)})
                        </div>
                      </TableCell>
                      <TableCell className={`text-xs ${entry.CE.option_position === "ITM" ? "bg-green-50" : ""}`}>
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
                      <TableCell className={`text-xs ${entry.PE.option_position === "ITM" ? "bg-green-50" : ""}`}>
                        {formatNumber(entry.PE.total_sell_quan)}
                        <div className={getColorClass(entry.PE.change_in_total_sell_quan, true)}>
                          ({formatNumber(entry.PE.change_in_total_sell_quan)})
                        </div>
                      </TableCell>
                      <TableCell className={`text-xs ${entry.PE.option_position === "ITM" ? "bg-green-50" : ""}`}>
                        {formatNumber(entry.PE.total_buy_quan)}
                        <div className={getColorClass(entry.PE.change_in_total_buy_quan, true)}>
                          ({formatNumber(entry.PE.change_in_total_buy_quan)})
                        </div>
                      </TableCell>
                      <TableCell className={`text-xs font-semibold ${entry.PE.option_position === "ITM" ? "bg-green-50" : ""}`}>
                        {entry.PE.ltp.toFixed(2)}
                      </TableCell>
                      <TableCell className={`text-xs ${entry.PE.option_position === "ITM" ? "bg-green-50" : ""}`}>
                        {formatNumber(entry.PE.trade_volume)}
                        <div className={getColorClass(entry.PE.change_in_trade_volume, true)}>
                          ({formatNumber(entry.PE.change_in_trade_volume)})
                        </div>
                      </TableCell>
                      <TableCell className={`text-xs ${entry.PE.option_position === "ITM" ? "bg-green-50" : ""}`}>
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
