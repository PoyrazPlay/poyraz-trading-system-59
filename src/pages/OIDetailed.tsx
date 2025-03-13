
import React, { useEffect, useState } from "react";
import HomeLayout from '@/components/layout/HomeLayout';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast";

class OptionData {
  constructor(details: any) {
    this.strike_price = details.strike_price;
    this.total_sell_quan = details.total_sell_quan;
    this.total_buy_quan = details.total_buy_quan;
    this.trade_volume = details.trade_volume;
    this.opn_interest = details.opn_interest;
    this.ltp = details.ltp;
    this.Indexltp = details.Indexltp;
    this.change_in_total_sell_quan = details.change_in_total_sell_quan;
    this.change_in_total_buy_quan = details.change_in_total_buy_quan;
    this.change_in_opn_interest = details.change_in_opn_interest;
    this.change_in_trade_volume = details.change_in_trade_volume;
    this.option_position = details.option_position;
    this.option_type = details.option_type; // Ensure option_type is set
  }
  
  strike_price: string | number;
  total_sell_quan: number;
  total_buy_quan: number;
  trade_volume: number;
  opn_interest: number;
  ltp: number;
  Indexltp: number;
  change_in_total_sell_quan: number;
  change_in_total_buy_quan: number;
  change_in_opn_interest: number;
  change_in_trade_volume: number;
  option_position: string;
  option_type: string;
}

interface DataEntry {
  date: string;
  time: string;
  values: (OptionData & { id: string })[];
}

const OIDetailed = () => {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [expiries, setExpiries] = useState<string[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [selectedExpiry, setSelectedExpiry] = useState('');
  const [data, setData] = useState<DataEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null as string | null, direction: 'ascending' });
  const [selectedStrikes, setSelectedStrikes] = useState<string[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [times, setTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSymbolsAndExpiries = async () => {
      setLoading(true);
      try {
        // Mock data for development until API is available
        const mockResponse = {
          data: {
            'NIFTY': ['25-JUL-2024', '29-AUG-2024', '26-SEP-2024'],
            'BANKNIFTY': ['25-JUL-2024', '29-AUG-2024', '26-SEP-2024'],
            'FINNIFTY': ['25-JUL-2024', '29-AUG-2024', '26-SEP-2024']
          }
        };
        
        try {
          // Try to fetch from API
          const response = await axios.get('http://54.221.81.212:5000/option_chain_symbols_expiries');
          console.log("API Response:", response.data);
          
          if (response.data && typeof response.data === 'object') {
            setSymbols(Object.keys(response.data));
            
            if (selectedSymbol && response.data[selectedSymbol]) {
              // Ensure expiries is always an array
              const expiriesData = Array.isArray(response.data[selectedSymbol]) 
                ? response.data[selectedSymbol] 
                : [];
              setExpiries(expiriesData);
            } else if (Object.keys(response.data).length > 0) {
              // Set default selected symbol
              const firstSymbol = Object.keys(response.data)[0];
              setSelectedSymbol(firstSymbol);
              // Ensure expiries is always an array
              const expiriesData = Array.isArray(response.data[firstSymbol]) 
                ? response.data[firstSymbol] 
                : [];
              setExpiries(expiriesData);
            }
          } else {
            throw new Error("Invalid API response");
          }
        } catch (apiError) {
          console.error("Using mock data due to API error:", apiError);
          // Use mock data
          setSymbols(Object.keys(mockResponse.data));
          
          if (selectedSymbol && mockResponse.data[selectedSymbol]) {
            setExpiries(mockResponse.data[selectedSymbol] || []);
          } else if (Object.keys(mockResponse.data).length > 0) {
            const firstSymbol = Object.keys(mockResponse.data)[0];
            setSelectedSymbol(firstSymbol);
            setExpiries(mockResponse.data[firstSymbol] || []);
          }
          
          toast({
            title: "Using demo data",
            description: "API connection failed. Using demonstration data instead.",
            duration: 5000,
          });
        }
      } catch (error) {
        console.error("Error fetching symbols and expiries:", error);
        setError("Failed to load symbols and expiries");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load option chain data",
        });
      } finally {
        setLoading(false);
      }
    };
  
    fetchSymbolsAndExpiries();
  }, []);

  useEffect(() => {
    if (selectedSymbol) {
      setLoading(true);
      
      const fetchExpiries = async () => {
        try {
          const response = await axios.get('http://54.221.81.212:5000/option_chain_symbols_expiries');
          console.log("Fetch expiries for symbol:", selectedSymbol, response.data);
          
          if (response.data && response.data[selectedSymbol]) {
            // Ensure expiries is always an array
            const expiriesData = Array.isArray(response.data[selectedSymbol]) 
                ? response.data[selectedSymbol] 
                : [];
            setExpiries(expiriesData);
            
            if (expiriesData.length > 0) {
              setSelectedExpiry(expiriesData[0]);
            }
          } else {
            // Use mock data
            setExpiries(['25-JUL-2024', '29-AUG-2024', '26-SEP-2024']);
            setSelectedExpiry('25-JUL-2024');
            
            toast({
              title: "Using demo expiries",
              description: "Could not fetch expiries from API. Using demonstration data.",
              duration: 5000,
            });
          }
        } catch (error) {
          console.error("Error fetching expiries:", error);
          // Mock data fallback
          const mockExpiries = ['25-JUL-2024', '29-AUG-2024', '26-SEP-2024'];
          setExpiries(mockExpiries);
          setSelectedExpiry(mockExpiries[0]);
        } finally {
          setLoading(false);
        }
      };
      
      fetchExpiries();
    }
  }, [selectedSymbol]);

  useEffect(() => {
    if (selectedSymbol && selectedExpiry) {
      setLoading(true);
      
      const fetchDates = async () => {
        try {
          const response = await axios.get(`http://54.221.81.212:5000/available_dates_times?symbol=${selectedSymbol}&expiry=${selectedExpiry}`);
          console.log("Fetch dates response:", response.data);
          
          if (response.data && response.data.dates && Array.isArray(response.data.dates)) {
            setDates(response.data.dates);
            if (response.data.dates.length > 0) {
              setSelectedDate(response.data.dates[0]);
            } else {
              setSelectedDate('');
            }
          } else {
            // Mock dates
            const mockDates = ['2024-07-19', '2024-07-18', '2024-07-17'];
            setDates(mockDates);
            setSelectedDate(mockDates[0]);
            
            toast({
              title: "Using demo dates",
              description: "Could not fetch dates from API. Using demonstration data.",
              duration: 5000,
            });
          }
        } catch (error) {
          console.error('Error fetching dates:', error);
          // Mock dates
          const mockDates = ['2024-07-19', '2024-07-18', '2024-07-17'];
          setDates(mockDates);
          setSelectedDate(mockDates[0]);
        } finally {
          setLoading(false);
        }
      };
      
      fetchDates();
    }
  }, [selectedSymbol, selectedExpiry]);

  useEffect(() => {
    if (selectedDate && selectedSymbol && selectedExpiry) {
      setLoading(true);
      
      const fetchTimes = async () => {
        try {
          const response = await axios.get(`http://54.221.81.212:5000/available_times?symbol=${selectedSymbol}&expiry=${selectedExpiry}&date=${selectedDate}`);
          console.log("Fetch times response:", response.data);
          
          if (response.data && response.data.times && Array.isArray(response.data.times)) {
            setTimes(response.data.times);
            if (response.data.times.length > 0) {
              setSelectedTime(response.data.times[0]);
            } else {
              setSelectedTime('');
            }
          } else {
            // Mock times
            const mockTimes = ['09:30:00', '10:30:00', '11:30:00', '12:30:00', '13:30:00', '14:30:00', '15:15:00'];
            setTimes(mockTimes);
            setSelectedTime(mockTimes[0]);
            
            toast({
              title: "Using demo times",
              description: "Could not fetch times from API. Using demonstration data.",
              duration: 5000,
            });
          }
        } catch (error) {
          console.error('Error fetching times:', error);
          // Mock times
          const mockTimes = ['09:30:00', '10:30:00', '11:30:00', '12:30:00', '13:30:00', '14:30:00', '15:15:00'];
          setTimes(mockTimes);
          setSelectedTime(mockTimes[0]);
        } finally {
          setLoading(false);
        }
      };
      
      fetchTimes();
    }
  }, [selectedDate, selectedSymbol, selectedExpiry]);

  useEffect(() => {
    if (selectedSymbol && selectedExpiry && selectedDate && selectedTime) {
      setLoading(true);
      setError(null);
      
      const fetchOptionChainData = async () => {
        try {
          const response = await axios.get('http://54.221.81.212:5000/option_chain_data', {
            params: { symbol: selectedSymbol, expiry: selectedExpiry, date: selectedDate, time: selectedTime }
          });
          console.log("Fetching option chain data", response.data);
          
          if (response.data && typeof response.data === 'object') {
            const optionChainData = response.data;
            const formattedData = Object.entries(optionChainData).map(([id, details]: [string, any]) => ({
              id,
              ...new OptionData(details),
            }));
          
            setData([{ date: selectedDate, time: selectedTime, values: formattedData }]);
          
            if (formattedData.length > 0) {
              setSelectedStrikes(formattedData.map(item => item.strike_price.toString()));
            } else {
              setSelectedStrikes([]);
            }
          } else {
            throw new Error("Invalid option chain data response");
          }
        } catch (error) {
          console.error("Error fetching option chain data:", error);
          setError("Failed to load option chain data");
          
          // Create mock data with both CE and PE options for demo
          const mockData = generateMockData(selectedSymbol, selectedDate, selectedTime);
          setData([mockData]);
          
          if (mockData.values.length > 0) {
            const uniqueStrikes = [...new Set(mockData.values.map(item => item.strike_price.toString()))];
            setSelectedStrikes(uniqueStrikes);
          }
          
          toast({
            title: "Using demo data",
            description: "API connection failed. Using demonstration data instead.",
            duration: 5000,
          });
        } finally {
          setLoading(false);
        }
      };
      
      fetchOptionChainData();
    }
  }, [selectedSymbol, selectedExpiry, selectedDate, selectedTime]);

  useEffect(() => {
    if (data.length > 0 && data[0].values.length > 0) {
      const allStrikes = [...new Set(data[0].values.map(item => item.strike_price.toString()))];
      setSelectedStrikes(allStrikes);
    }
  }, [data]);

  const handleDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTime(event.target.value);
  };

  const handleSort = (key: string) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleStrikeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    let newSelectedStrikes = [...selectedStrikes]; // Preserve previous selections
    
    if (value === "all") {
      if (newSelectedStrikes.length === Object.keys(groupedData).length) {
        newSelectedStrikes = []; // Deselect all if all are already selected
      } else {
        newSelectedStrikes = Object.keys(groupedData); // Select all
      }
    } else if (value === "multiplesOf500") {
      const multiplesOf500 = Object.keys(groupedData).filter((strike) => parseInt(strike) % 500 === 0);
      if (multiplesOf500.length > 0 && multiplesOf500.every((strike) => newSelectedStrikes.includes(strike))) {
        newSelectedStrikes = newSelectedStrikes.filter((strike) => !multiplesOf500.includes(strike));
      } else {
        newSelectedStrikes = [...new Set([...newSelectedStrikes, ...multiplesOf500])];
      }
    } else if (value === "multiplesOf100") {
      const multiplesOf100 = Object.keys(groupedData).filter((strike) => parseInt(strike) % 100 === 0);
      if (multiplesOf100.every((strike) => newSelectedStrikes.includes(strike))) {
        newSelectedStrikes = newSelectedStrikes.filter((strike) => !multiplesOf100.includes(strike));
      } else {
        newSelectedStrikes = [...new Set([...newSelectedStrikes, ...multiplesOf100])];
      }
    } else if (value === "multiplesOf200") {
      const multiplesOf200 = Object.keys(groupedData).filter((strike) => parseInt(strike) % 200 === 0);
      if (multiplesOf200.every((strike) => newSelectedStrikes.includes(strike))) {
        newSelectedStrikes = newSelectedStrikes.filter((strike) => !multiplesOf200.includes(strike));
      } else {
        newSelectedStrikes = [...new Set([...newSelectedStrikes, ...multiplesOf200])];
      }
    } else {
      newSelectedStrikes = newSelectedStrikes.includes(value)
        ? newSelectedStrikes.filter((strike) => strike !== value)
        : [...newSelectedStrikes, value];
    }
  
    setSelectedStrikes(newSelectedStrikes);
  };

  const generateMockData = (symbol: string, date: string, time: string): DataEntry => {
    const indexLTP = symbol === 'NIFTY' ? 24300 : symbol === 'BANKNIFTY' ? 51200 : 22800;
    const baseStrike = Math.round(indexLTP / 100) * 100;
    const strikes = [];
    
    for (let i = -10; i <= 10; i++) {
      strikes.push(baseStrike + (i * 100));
    }
    
    const values = strikes.flatMap(strike => {
      const ceOptionPosition = strike < indexLTP ? "ITM" : "OTM";
      const peOptionPosition = strike > indexLTP ? "ITM" : "OTM";
      
      const ce = {
        id: `${symbol}_${date}_${strike}_CE`,
        strike_price: strike,
        total_sell_quan: Math.floor(Math.random() * 5000) + 1000,
        total_buy_quan: Math.floor(Math.random() * 5000) + 1000,
        trade_volume: Math.floor(Math.random() * 10000) + 2000,
        opn_interest: Math.floor(Math.random() * 500000) + 100000,
        ltp: ceOptionPosition === "ITM" ? (indexLTP - strike + Math.random() * 50) : (Math.random() * 50),
        Indexltp: indexLTP,
        change_in_total_sell_quan: Math.floor(Math.random() * 1000) - 500,
        change_in_total_buy_quan: Math.floor(Math.random() * 1000) - 500,
        change_in_opn_interest: Math.floor(Math.random() * 10000) - 5000,
        change_in_trade_volume: Math.floor(Math.random() * 5000) - 2500,
        option_position: ceOptionPosition,
        option_type: "CE"
      };
      
      const pe = {
        id: `${symbol}_${date}_${strike}_PE`,
        strike_price: strike,
        total_sell_quan: Math.floor(Math.random() * 5000) + 1000,
        total_buy_quan: Math.floor(Math.random() * 5000) + 1000,
        trade_volume: Math.floor(Math.random() * 10000) + 2000,
        opn_interest: Math.floor(Math.random() * 500000) + 100000,
        ltp: peOptionPosition === "ITM" ? (strike - indexLTP + Math.random() * 50) : (Math.random() * 50),
        Indexltp: indexLTP,
        change_in_total_sell_quan: Math.floor(Math.random() * 1000) - 500,
        change_in_total_buy_quan: Math.floor(Math.random() * 1000) - 500,
        change_in_opn_interest: Math.floor(Math.random() * 10000) - 5000,
        change_in_trade_volume: Math.floor(Math.random() * 5000) - 2500,
        option_position: peOptionPosition,
        option_type: "PE"
      };
      
      return [ce, pe];
    });
    
    return {
      date,
      time,
      values
    };
  };

  const selectedData = data.find((entry) => entry.date === selectedDate && entry.time === selectedTime);

  const sortedData = selectedData ? [...selectedData.values].sort((a, b) => {
    if (sortConfig.key === null) return 0;
    
    const aValue = a[sortConfig.key as keyof typeof a];
    const bValue = b[sortConfig.key as keyof typeof b];
    
    if (aValue < bValue) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  }) : [];

  const groupedData: Record<string, { CE: Partial<OptionData>, PE: Partial<OptionData> }> = {};
  
  sortedData.forEach(item => {
    const strikeKey = item.strike_price.toString();
    if (!groupedData[strikeKey]) {
      groupedData[strikeKey] = { CE: {}, PE: {} };
    }
    groupedData[strikeKey][item.option_type as 'CE' | 'PE'] = item;
  });

  const indexLTP = selectedData && selectedData.values.length > 0 ? selectedData.values[0].Indexltp : null;

  return (
    <HomeLayout title="Option Chain Analysis">
      <div className="w-full max-w-7xl mx-auto">
        <div className="card-glass rounded-xl p-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Symbol:
                <select 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" 
                  value={selectedSymbol} 
                  onChange={(e) => setSelectedSymbol(e.target.value)}
                  disabled={loading}
                >
                  <option value="">Select Symbol</option>
                  {symbols.map(symbol => (
                    <option key={symbol} value={symbol}>{symbol}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Expiry:
                <select 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" 
                  value={selectedExpiry} 
                  onChange={(e) => setSelectedExpiry(e.target.value)}
                  disabled={loading || expiries.length === 0}
                >
                  <option value="">Select Expiry</option>
                  {Array.isArray(expiries) && expiries.map(expiry => (
                    <option key={expiry} value={expiry}>{expiry}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Date:
                <select 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  value={selectedDate} 
                  onChange={handleDateChange}
                  disabled={loading || dates.length === 0}
                >
                  <option value="">Select Date</option>
                  {dates.map((date) => (
                    <option key={date} value={date}>{date}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Time:
                <select 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  value={selectedTime} 
                  onChange={handleTimeChange}
                  disabled={loading || times.length === 0}
                >
                  <option value="">Select Time</option>
                  {times.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Strike Filters:
                <select 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  onChange={handleStrikeChange}
                  disabled={loading || Object.keys(groupedData).length === 0}
                >
                  <option value="all">All Strikes</option>
                  <option value="multiplesOf500">Multiples of 500</option>
                  <option value="multiplesOf100">Multiples of 100</option>
                  <option value="multiplesOf200">Multiples of 200</option>
                </select>
              </label>
            </div>
          </div>
          
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}
          
          {error && (
            <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-4">
              {error}
            </div>
          )}
          
          {indexLTP && (
            <div className="bg-secondary p-3 rounded-md mb-4 text-center font-semibold">
              Index LTP: {indexLTP.toLocaleString()}
            </div>
          )}
          
          {selectedData && !loading && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-secondary">
                    <th colSpan={9} className="px-4 py-2 text-center border">Call Option (CE)</th>
                    <th className="px-4 py-2 text-center border bg-primary/20">Strike</th>
                    <th colSpan={9} className="px-4 py-2 text-center border">Put Option (PE)</th>
                  </tr>
                  <tr className="bg-secondary/60 text-xs">
                    <th className="px-2 py-1 border" onClick={() => handleSort('change_in_total_sell_quan')}>Chg Sell Qty</th>
                    <th className="px-2 py-1 border" onClick={() => handleSort('total_sell_quan')}>Sell Qty</th>
                    <th className="px-2 py-1 border" onClick={() => handleSort('change_in_total_buy_quan')}>Chg Buy Qty</th>
                    <th className="px-2 py-1 border" onClick={() => handleSort('total_buy_quan')}>Buy Qty</th>
                    <th className="px-2 py-1 border" onClick={() => handleSort('change_in_trade_volume')}>Chg Vol</th>
                    <th className="px-2 py-1 border" onClick={() => handleSort('trade_volume')}>Volume</th>
                    <th className="px-2 py-1 border" onClick={() => handleSort('change_in_opn_interest')}>Chg OI</th>
                    <th className="px-2 py-1 border" onClick={() => handleSort('opn_interest')}>OI</th>
                    <th className="px-2 py-1 border" onClick={() => handleSort('ltp')}>LTP</th>
                    <th className="px-2 py-1 border bg-primary/20" onClick={() => handleSort('strike_price')}>Strike</th>
                    <th className="px-2 py-1 border" onClick={() => handleSort('ltp')}>LTP</th>
                    <th className="px-2 py-1 border" onClick={() => handleSort('opn_interest')}>OI</th>
                    <th className="px-2 py-1 border" onClick={() => handleSort('change_in_opn_interest')}>Chg OI</th>
                    <th className="px-2 py-1 border" onClick={() => handleSort('trade_volume')}>Volume</th>
                    <th className="px-2 py-1 border" onClick={() => handleSort('change_in_trade_volume')}>Chg Vol</th>
                    <th className="px-2 py-1 border" onClick={() => handleSort('total_buy_quan')}>Buy Qty</th>
                    <th className="px-2 py-1 border" onClick={() => handleSort('change_in_total_buy_quan')}>Chg Buy Qty</th>
                    <th className="px-2 py-1 border" onClick={() => handleSort('total_sell_quan')}>Sell Qty</th>
                    <th className="px-2 py-1 border" onClick={() => handleSort('change_in_total_sell_quan')}>Chg Sell Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(groupedData)
                    .filter(([strikePrice]) => selectedStrikes.includes(strikePrice))
                    .sort(([strikeA], [strikeB]) => parseInt(strikeA) - parseInt(strikeB))
                    .map(([strikePrice, details]) => {
                      const ce = details.CE as OptionData;
                      const pe = details.PE as OptionData;
                      const isATM = indexLTP && Math.abs(parseInt(strikePrice) - indexLTP) < 100;
                      
                      return (
                        <tr key={strikePrice} className={isATM ? "bg-blue-50" : "hover:bg-gray-50"}>
                          <td className={`px-2 py-1 border text-xs text-center ${ce?.option_position === "ITM" ? "bg-green-50" : ""}`}
                              style={{ color: ce?.change_in_total_sell_quan > 0 ? 'green' : 'red' }}>
                            {ce?.change_in_total_sell_quan?.toLocaleString()}
                          </td>
                          <td className={`px-2 py-1 border text-xs text-center ${ce?.option_position === "ITM" ? "bg-green-50" : ""}`}>
                            {ce?.total_sell_quan?.toLocaleString()}
                          </td>
                          <td className={`px-2 py-1 border text-xs text-center ${ce?.option_position === "ITM" ? "bg-green-50" : ""}`}
                              style={{ color: ce?.change_in_total_buy_quan > 0 ? 'green' : 'red' }}>
                            {ce?.change_in_total_buy_quan?.toLocaleString()}
                          </td>
                          <td className={`px-2 py-1 border text-xs text-center ${ce?.option_position === "ITM" ? "bg-green-50" : ""}`}>
                            {ce?.total_buy_quan?.toLocaleString()}
                          </td>
                          <td className={`px-2 py-1 border text-xs text-center ${ce?.option_position === "ITM" ? "bg-green-50" : ""}`}
                              style={{ color: ce?.change_in_trade_volume > 0 ? 'green' : 'red' }}>
                            {ce?.change_in_trade_volume?.toLocaleString()}
                          </td>
                          <td className={`px-2 py-1 border text-xs text-center ${ce?.option_position === "ITM" ? "bg-green-50" : ""}`}>
                            {ce?.trade_volume?.toLocaleString()}
                          </td>
                          <td className={`px-2 py-1 border text-xs text-center ${ce?.option_position === "ITM" ? "bg-green-50" : ""}`}
                              style={{ color: ce?.change_in_opn_interest > 0 ? 'green' : 'red' }}>
                            {ce?.change_in_opn_interest?.toLocaleString()}
                          </td>
                          <td className={`px-2 py-1 border text-xs text-center ${ce?.option_position === "ITM" ? "bg-green-50" : ""}`}>
                            {ce?.opn_interest?.toLocaleString()}
                          </td>
                          <td className={`px-2 py-1 border text-xs text-center ${ce?.option_position === "ITM" ? "bg-green-50" : ""}`}>
                            {ce?.ltp?.toLocaleString()}
                          </td>
                          <td className="px-2 py-1 border text-xs text-center font-semibold bg-primary/20">
                            {strikePrice}
                          </td>
                          <td className={`px-2 py-1 border text-xs text-center ${pe?.option_position === "ITM" ? "bg-green-50" : ""}`}>
                            {pe?.ltp?.toLocaleString()}
                          </td>
                          <td className={`px-2 py-1 border text-xs text-center ${pe?.option_position === "ITM" ? "bg-green-50" : ""}`}>
                            {pe?.opn_interest?.toLocaleString()}
                          </td>
                          <td className={`px-2 py-1 border text-xs text-center ${pe?.option_position === "ITM" ? "bg-green-50" : ""}`}
                              style={{ color: pe?.change_in_opn_interest > 0 ? 'green' : 'red' }}>
                            {pe?.change_in_opn_interest?.toLocaleString()}
                          </td>
                          <td className={`px-2 py-1 border text-xs text-center ${pe?.option_position === "ITM" ? "bg-green-50" : ""}`}>
                            {pe?.trade_volume?.toLocaleString()}
                          </td>
                          <td className={`px-2 py-1 border text-xs text-center ${pe?.option_position === "ITM" ? "bg-green-50" : ""}`}
                              style={{ color: pe?.change_in_trade_volume > 0 ? 'green' : 'red' }}>
                            {pe?.change_in_trade_volume?.toLocaleString()}
                          </td>
                          <td className={`px-2 py-1 border text-xs text-center ${pe?.option_position === "ITM" ? "bg-green-50" : ""}`}>
                            {pe?.total_buy_quan?.toLocaleString()}
                          </td>
                          <td className={`px-2 py-1 border text-xs text-center ${pe?.option_position === "ITM" ? "bg-green-50" : ""}`}
                              style={{ color: pe?.change_in_total_buy_quan > 0 ? 'green' : 'red' }}>
                            {pe?.change_in_total_buy_quan?.toLocaleString()}
                          </td>
                          <td className={`px-2 py-1 border text-xs text-center ${pe?.option_position === "ITM" ? "bg-green-50" : ""}`}>
                            {pe?.total_sell_quan?.toLocaleString()}
                          </td>
                          <td className={`px-2 py-1 border text-xs text-center ${pe?.option_position === "ITM" ? "bg-green-50" : ""}`}
                              style={{ color: pe?.change_in_total_sell_quan > 0 ? 'green' : 'red' }}>
                            {pe?.change_in_total_sell_quan?.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
          
          {!selectedData && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              Select symbol, expiry, date and time to view option chain data
            </div>
          )}
        </div>
      </div>
    </HomeLayout>
  );
};

export default OIDetailed;
