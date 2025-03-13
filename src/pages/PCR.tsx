
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HomeLayout from '@/components/layout/HomeLayout';
import { useToast } from '@/hooks/use-toast';

const PCR = () => {
  const [symbol, setSymbol] = useState('');
  const [expiry, setExpiry] = useState('');
  const [data, setData] = useState<Record<string, { volume_pcr: string }> | null>(null);
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
      const response = await fetch("http://localhost:5000/symbols_expiries");
      const symbolsExpiries = await response.json();
      
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
      const response = await axios.get('http://localhost:5000/pcr_data', {
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
    const mockData: Record<string, { volume_pcr: string }> = {};
    const today = new Date();
    
    for (let i = 0; i < 24; i++) {
      const date = new Date(today);
      date.setHours(9 + Math.floor(i/2), (i % 2) * 30, 0);
      
      if (date.getHours() >= 9 && date.getHours() <= 15) {
        const timestamp = date.toISOString().split('T')[0] + ' ' + 
          date.toTimeString().split(' ')[0].substring(0, 5);
        
        mockData[timestamp] = {
          volume_pcr: (Math.random() * 1.5 + 0.5).toFixed(2)
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
      fetch(`http://localhost:5000/symbols_expiries`)
        .then((response) => response.json())
        .then((symbolsExpiries) => {
          setExpiries(symbolsExpiries[newSymbol]);
          setExpiry(symbolsExpiries[newSymbol][0]);
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
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 px-4 text-left font-medium">Time</th>
                  <th className="py-3 px-4 text-left font-medium">Volume PCR</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map(([timestamp, entry], index) => (
                    <tr key={index} className="border-b border-border/40 hover:bg-muted/30">
                      <td className="py-3 px-4">{timestamp}</td>
                      <td className="py-3 px-4">
                        <span 
                          className={`font-medium ${
                            parseFloat(entry.volume_pcr) > 1 ? 'text-green-600' : 
                            parseFloat(entry.volume_pcr) < 0.8 ? 'text-red-600' : 'text-amber-600'
                          }`}
                        >
                          {entry.volume_pcr}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="py-8 text-center text-muted-foreground">
                      No PCR data available for the selected criteria
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

export default PCR;
