import React, { useState, useEffect } from 'react';
import HomeLayout from '@/components/layout/HomeLayout';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, ChartLine, Gauge } from 'lucide-react';
import apiClient from '@/utils/apiService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define the interface for the PCR data
interface PCRData {
  volume_pcr: string;
  indexLtp?: number;
  MarketMoodIndex?: number;
}

const PCR = () => {
  const [symbol, setSymbol] = useState('');
  const [expiry, setExpiry] = useState('');
  const [data, setData] = useState<Record<string, PCRData> | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [symbols, setSymbols] = useState<string[]>([]);
  const [expiries, setExpiries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSymbolsAndExpiries();
  }, []);
  
  const fetchSymbolsAndExpiries = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get("/symbols_expiries");
      const symbolsExpiries = response.data;
      
      if (Object.keys(symbolsExpiries).length > 0) {
        const initialSymbol = Object.keys(symbolsExpiries)[0];
        const initialExpiry = symbolsExpiries[initialSymbol]?.[0] || "";
        setSymbols(Object.keys(symbolsExpiries));
        setExpiries(symbolsExpiries[initialSymbol] || []);
        setSymbol(initialSymbol);
        setExpiry(initialExpiry);
      }
    } catch (error) {
      console.error("Error fetching symbols and expiries:", error);
      toast({
        title: "Error",
        description: "Failed to fetch symbols and expiries. Using demo data.",
        variant: "destructive",
      });
      
      // Mock data for demo if API fails
      const mockSymbols = ["NIFTY", "BANKNIFTY", "FINNIFTY"];
      const mockExpiries = ["28-Jun-2023", "05-Jul-2023", "12-Jul-2023"];
      setSymbols(mockSymbols);
      setExpiries(mockExpiries);
      setSymbol(mockSymbols[0]);
      setExpiry(mockExpiries[0]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (symbol && expiry) {
      fetchPCRData();
    }
  }, [symbol, expiry]);

  const fetchPCRData = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/pcr_data', {
        params: { symbol, expiry }
      });
      setData(response.data);
      setSelectedDate(""); // Reset selected date when new data is fetched
      toast({
        title: "Data Updated",
        description: `PCR data loaded for ${symbol} expiry ${expiry}`,
      });
    } catch (error) {
      console.error("Error fetching PCR data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch PCR data. Using demo data.",
        variant: "destructive",
      });
      
      // Mock data for demo if API fails
      const mockData = generateMockPCRData();
      setData(mockData);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate mock data for demo purposes
  const generateMockPCRData = () => {
    const mockData: Record<string, PCRData> = {};
    const today = new Date();
    
    for (let i = 0; i < 24; i++) {
      const date = new Date(today);
      date.setHours(9 + Math.floor(i/2), (i % 2) * 30, 0);
      
      if (date.getHours() >= 9 && date.getHours() <= 15) {
        const timestamp = date.toISOString().split('T')[0] + ' ' + 
          date.toTimeString().split(' ')[0].substring(0, 5);
        
        const indexValue = 22000 + Math.random() * 500;
        const pcr = (Math.random() * 1.5 + 0.5).toFixed(2);
        const mmi = Math.round(Math.random() * 100);
        
        mockData[timestamp] = {
          volume_pcr: pcr,
          indexLtp: parseFloat(indexValue.toFixed(2)),
          MarketMoodIndex: mmi
        };
      }
    }
    
    return mockData;
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleSymbolChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSymbol = event.target.value;
    setSymbol(newSymbol);
    
    try {
      apiClient.get(`/symbols_expiries`)
        .then((response) => {
          setExpiries(response.data[newSymbol]);
          setExpiry(response.data[newSymbol][0]);
        });
    } catch (error) {
      console.error("Error fetching expiries:", error);
      toast({
        title: "Error",
        description: "Failed to fetch expiries. Using demo data.",
        variant: "destructive",
      });
    }
  };

  const handleExpiryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setExpiry(event.target.value);
  };

  const uniqueDates = data ? [...new Set(Object.keys(data).map((timestamp) => timestamp.split(" ")[0]))] : [];
  // Sort dates in descending order (newest first)
  uniqueDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  const filteredData = data && selectedDate 
    ? Object.entries(data).filter(([timestamp]) => timestamp.startsWith(selectedDate)) 
    : Object.entries(data || {});

  // Helper function to get MMI status color
  const getMmiStatusColor = (mmi: number | undefined) => {
    if (!mmi) return '';
    if (mmi >= 70) return 'text-green-600';
    if (mmi <= 30) return 'text-red-600';
    return 'text-amber-600';
  };

  return (
    <HomeLayout title="Put/Call Ratio Analysis">
      <div className="card-glass rounded-xl p-8 w-full max-w-5xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="symbol-select" className="block text-sm font-medium">
              Symbol
            </label>
            <select 
              id="symbol-select" 
              value={symbol} 
              onChange={handleSymbolChange}
              className="block w-full rounded-md border border-input px-3 py-2 bg-background text-foreground shadow-sm"
              disabled={isLoading}
            >
              {symbols.map((sym) => (
                <option key={sym} value={sym}>
                  {sym}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="expiry-select" className="block text-sm font-medium">
              Expiry
            </label>
            <select 
              id="expiry-select" 
              value={expiry} 
              onChange={handleExpiryChange}
              className="block w-full rounded-md border border-input px-3 py-2 bg-background text-foreground shadow-sm"
              disabled={isLoading}
            >
              {expiries.map((exp) => (
                <option key={exp} value={exp}>
                  {exp}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="date-select" className="block text-sm font-medium">
              Date Filter
            </label>
            <select 
              id="date-select" 
              value={selectedDate} 
              onChange={handleDateChange}
              className="block w-full rounded-md border border-input px-3 py-2 bg-background text-foreground shadow-sm"
              disabled={isLoading}
            >
              <option value="">All Dates</option>
              {uniqueDates.map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="py-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-2 text-muted-foreground">Loading data...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <ChartLine size={16} />
                      <span>Index Price</span>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <TrendingUp size={16} />
                      <span>Volume PCR</span>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Gauge size={16} />
                      <span>Market Mood Index</span>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map(([timestamp, entry], index) => (
                    <TableRow key={index}>
                      <TableCell>{timestamp}</TableCell>
                      <TableCell>
                        {entry.indexLtp ? 
                          entry.indexLtp.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : 
                          'N/A'}
                      </TableCell>
                      <TableCell>
                        <span 
                          className={`font-medium ${
                            parseFloat(entry.volume_pcr as string) > 1 ? 'text-green-600' : 
                            parseFloat(entry.volume_pcr as string) < 0.8 ? 'text-red-600' : 'text-amber-600'
                          }`}
                        >
                          {entry.volume_pcr}
                        </span>
                      </TableCell>
                      <TableCell>
                        {entry.MarketMoodIndex !== undefined ? (
                          <span className={`font-medium ${getMmiStatusColor(entry.MarketMoodIndex)}`}>
                            {entry.MarketMoodIndex.toFixed(2)}
                          </span>
                        ) : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      No PCR data available for the selected criteria
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

export default PCR;
