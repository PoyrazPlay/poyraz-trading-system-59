import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useToast } from "@/hooks/use-toast";
import HomeLayout from '@/components/layout/HomeLayout';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import '../pages/OI.css';

interface OptionDataDetails {
  PCR_OI?: number;
  PCR_VOL?: number;
  Max_Pain_Level?: number;
  Total_OI_CE_ITM?: number;
  Total_OI_CE_OTM?: number;
  Total_OI_PE_ITM?: number;
  Total_OI_PE_OTM?: number;
  Total_Trade_Vol_CE_ITM?: number;
  Total_Trade_Vol_CE_OTM?: number;
  Total_Trade_Vol_PE_ITM?: number;
  Total_Trade_Vol_PE_OTM?: number;
  Total_Buy_CE_ITM?: number;
  Total_Buy_CE_OTM?: number;
  Total_Sell_CE_ITM?: number;
  Total_Sell_CE_OTM?: number;
  Total_Buy_PE_ITM?: number;
  Total_Buy_PE_OTM?: number;
  Total_Sell_PE_ITM?: number;
  Total_Sell_PE_OTM?: number;
  Total_Buy_To_Call_Ratio_ITM?: number;
  Total_Buy_To_Call_Ratio_OTM?: number;
  WA_Strike_CE?: number;
  WA_Strike_PE?: number;
}

class OptionData {
  PCR_OI: number;
  PCR_VOL: number;
  Max_Pain_Level: number;
  Total_OI_CE_ITM: number;
  Total_OI_CE_OTM: number;
  Total_OI_PE_ITM: number;
  Total_OI_PE_OTM: number;
  Total_Trade_Vol_CE_ITM: number;
  Total_Trade_Vol_CE_OTM: number;
  Total_Trade_Vol_PE_ITM: number;
  Total_Trade_Vol_PE_OTM: number;
  Total_Buy_CE_ITM: number;
  Total_Buy_CE_OTM: number;
  Total_Sell_CE_ITM: number;
  Total_Sell_CE_OTM: number;
  Total_Buy_PE_ITM: number;
  Total_Buy_PE_OTM: number;
  Total_Sell_PE_ITM: number;
  Total_Sell_PE_OTM: number;
  Total_Buy_To_Call_Ratio_ITM: number;
  Total_Buy_To_Call_Ratio_OTM: number;
  WA_Strike_CE: number;
  WA_Strike_PE: number;

  constructor(details: OptionDataDetails) {
    this.PCR_OI = details.PCR_OI ?? 0;
    this.PCR_VOL = details.PCR_VOL ?? 0;
    this.Max_Pain_Level = details.Max_Pain_Level ?? 0;
    this.Total_OI_CE_ITM = details.Total_OI_CE_ITM ?? 0;
    this.Total_OI_CE_OTM = details.Total_OI_CE_OTM ?? 0;
    this.Total_OI_PE_ITM = details.Total_OI_PE_ITM ?? 0;
    this.Total_OI_PE_OTM = details.Total_OI_PE_OTM ?? 0;
    this.Total_Trade_Vol_CE_ITM = details.Total_Trade_Vol_CE_ITM ?? 0;
    this.Total_Trade_Vol_CE_OTM = details.Total_Trade_Vol_CE_OTM ?? 0;
    this.Total_Trade_Vol_PE_ITM = details.Total_Trade_Vol_PE_ITM ?? 0;
    this.Total_Trade_Vol_PE_OTM = details.Total_Trade_Vol_PE_OTM ?? 0;
    this.Total_Buy_CE_ITM = details.Total_Buy_CE_ITM ?? 0;
    this.Total_Buy_CE_OTM = details.Total_Buy_CE_OTM ?? 0;
    this.Total_Sell_CE_ITM = details.Total_Sell_CE_ITM ?? 0;
    this.Total_Sell_CE_OTM = details.Total_Sell_CE_OTM ?? 0;
    this.Total_Buy_PE_ITM = details.Total_Buy_PE_ITM ?? 0;
    this.Total_Buy_PE_OTM = details.Total_Buy_PE_OTM ?? 0;
    this.Total_Sell_PE_ITM = details.Total_Sell_PE_ITM ?? 0;
    this.Total_Sell_PE_OTM = details.Total_Sell_PE_OTM ?? 0;
    this.Total_Buy_To_Call_Ratio_ITM = details.Total_Buy_To_Call_Ratio_ITM ?? 0;
    this.Total_Buy_To_Call_Ratio_OTM = details.Total_Buy_To_Call_Ratio_OTM ?? 0;
    this.WA_Strike_CE = details.WA_Strike_CE ?? 0;
    this.WA_Strike_PE = details.WA_Strike_PE ?? 0;
  }
}

interface DataItem extends OptionData {
  timestamp: string;
}

const demoData: Record<string, OptionDataDetails> = {
  "2023-09-01 10:00:00": {
    PCR_OI: 1.2,
    PCR_VOL: 0.8,
    Max_Pain_Level: 18500,
    Total_OI_CE_ITM: 250000,
    Total_OI_CE_OTM: 420000,
    Total_OI_PE_ITM: 180000,
    Total_OI_PE_OTM: 320000,
    Total_Trade_Vol_CE_ITM: 45000,
    Total_Trade_Vol_CE_OTM: 82000,
    Total_Trade_Vol_PE_ITM: 38000,
    Total_Trade_Vol_PE_OTM: 67000,
    Total_Buy_CE_ITM: 23000,
    Total_Buy_CE_OTM: 41000,
    Total_Sell_CE_ITM: 22000,
    Total_Sell_CE_OTM: 41000,
    Total_Buy_PE_ITM: 19000,
    Total_Buy_PE_OTM: 33500,
    Total_Sell_PE_ITM: 19000,
    Total_Sell_PE_OTM: 33500,
    Total_Buy_To_Call_Ratio_ITM: 1.05,
    Total_Buy_To_Call_Ratio_OTM: 1.0,
    WA_Strike_CE: 18450,
    WA_Strike_PE: 18550
  },
  "2023-09-01 11:00:00": {
    PCR_OI: 1.3,
    PCR_VOL: 0.9,
    Max_Pain_Level: 18520,
    Total_OI_CE_ITM: 260000,
    Total_OI_CE_OTM: 430000,
    Total_OI_PE_ITM: 190000,
    Total_OI_PE_OTM: 330000,
    Total_Trade_Vol_CE_ITM: 47000,
    Total_Trade_Vol_CE_OTM: 84000,
    Total_Trade_Vol_PE_ITM: 40000,
    Total_Trade_Vol_PE_OTM: 70000,
    Total_Buy_CE_ITM: 24000,
    Total_Buy_CE_OTM: 42000,
    Total_Sell_CE_ITM: 23000,
    Total_Sell_CE_OTM: 42000,
    Total_Buy_PE_ITM: 20000,
    Total_Buy_PE_OTM: 35000,
    Total_Sell_PE_ITM: 20000,
    Total_Sell_PE_OTM: 35000,
    Total_Buy_To_Call_Ratio_ITM: 1.04,
    Total_Buy_To_Call_Ratio_OTM: 1.0,
    WA_Strike_CE: 18470,
    WA_Strike_PE: 18570
  }
};

const OISummary = () => {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [expiries, setExpiries] = useState<string[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');
  const [selectedExpiry, setSelectedExpiry] = useState<string>('');
  const [data, setData] = useState<DataItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof DataItem | null, direction: 'ascending' | 'descending' }>({ 
    key: null, 
    direction: 'ascending' 
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSymbolsAndExpiries = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await axios.get('http://54.221.81.212:5000/option_chain_symbols_expiries');
        console.log("Fetched Symbols and Expiries:", response.data);
        
        if (response.data && typeof response.data === 'object') {
          setSymbols(Object.keys(response.data));
          
          if (selectedSymbol && response.data[selectedSymbol]) {
            const expiriesData = Array.isArray(response.data[selectedSymbol]) 
              ? response.data[selectedSymbol] 
              : [];
            setExpiries(expiriesData);
          } else if (Object.keys(response.data).length > 0) {
            const firstSymbol = Object.keys(response.data)[0];
            setSelectedSymbol(firstSymbol);
            const expiriesData = Array.isArray(response.data[firstSymbol]) 
              ? response.data[firstSymbol] 
              : [];
            setExpiries(expiriesData);
          }
        } else {
          setSymbols(['NIFTY', 'BANKNIFTY']);
          setExpiries(['29-Sep-2023', '26-Oct-2023']);
          
          if (!selectedSymbol) {
            setSelectedSymbol('NIFTY');
          }
          
          toast({
            title: "Using demo data",
            description: "Invalid response from API. Using demonstration data instead.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching symbols and expiries:", error);
        setError("Failed to load symbols and expiries. Using demo data.");
        
        setSymbols(['NIFTY', 'BANKNIFTY']);
        setExpiries(['29-Sep-2023', '26-Oct-2023']);
        
        if (!selectedSymbol) {
          setSelectedSymbol('NIFTY');
        }
        
        toast({
          title: "Connection Error",
          description: "Could not connect to the API. Using demonstration data instead.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchSymbolsAndExpiries();
  }, []);
  
  useEffect(() => {
    const fetchAvailableDates = async () => {
      if (!selectedSymbol || !selectedExpiry) return;
      
      setIsLoading(true);
      setError(null);
  
      try {
        const response = await axios.get('http://54.221.81.212:5000/available_dates_times', {
          params: { symbol: selectedSymbol, expiry: selectedExpiry }
        });
        console.log("Fetched Available Dates:", response.data);
        
        if (response.data && response.data.dates && Array.isArray(response.data.dates) && response.data.dates.length > 0) {
          setAvailableDates(response.data.dates);
          setSelectedDate(response.data.dates[0]);
        } else {
          setAvailableDates(['2023-09-01', '2023-09-02']);
          setSelectedDate('2023-09-01');
          
          toast({
            title: "Using demo dates",
            description: "No dates available from API. Using demonstration dates.",
          });
        }
      } catch (error) {
        console.error("Error fetching available dates:", error);
        setError("Failed to load available dates. Using demo dates.");
        
        setAvailableDates(['2023-09-01', '2023-09-02']);
        setSelectedDate('2023-09-01');
        
        toast({
          title: "Date Fetch Error",
          description: "Failed to get available dates. Using demonstration dates.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchAvailableDates();
  }, [selectedSymbol, selectedExpiry, toast]);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedSymbol || !selectedExpiry || !selectedDate) return;
      
      setIsLoading(true);
      setError(null);
  
      try {
        const response = await axios.get('http://54.221.81.212:5000/option_chain_summary', {
          params: { symbol: selectedSymbol, expiry: selectedExpiry, selected_date: selectedDate }
        });
        console.log("Fetched Data:", response.data);
  
        if (response.data && typeof response.data === 'object' && Object.keys(response.data).length > 0) {
          const formattedData = Object.entries(response.data).map(([timestamp, values]) => ({
            timestamp,
            ...new OptionData(values as OptionDataDetails),
          }));
          
          setData(formattedData);
          
          toast({
            title: "Data Loaded",
            description: `Loaded ${formattedData.length} records for ${selectedSymbol} with expiry ${selectedExpiry}`,
          });
        } else {
          const formattedDemoData = Object.entries(demoData).map(([timestamp, values]) => ({
            timestamp,
            ...new OptionData(values),
          }));
          
          setData(formattedDemoData);
          
          toast({
            title: "Using demo data",
            description: "No data available from API. Using demonstration data.",
          });
        }
      } catch (error) {
        console.error("Error fetching option chain data:", error);
        setError("Failed to load option chain data. Using demo data.");
        
        const formattedDemoData = Object.entries(demoData).map(([timestamp, values]) => ({
          timestamp,
          ...new OptionData(values),
        }));
        
        setData(formattedDemoData);
        
        toast({
          title: "Data Fetch Error",
          description: "Failed to get option chain data. Using demonstration data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [selectedSymbol, selectedExpiry, selectedDate, toast]);
  
  const handleDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("Selected Date:", event.target.value);
    setSelectedDate(event.target.value);
  };

  const handleSort = (key: keyof DataItem) => {
    if (!key) return;
  
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
  
    console.log("Sorting by:", key, "Direction:", direction);
    setSortConfig({ key, direction });
  };
  
  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    if (sortConfig.key === 'timestamp') {
      return sortConfig.direction === 'ascending'
        ? a.timestamp.localeCompare(b.timestamp)
        : b.timestamp.localeCompare(a.timestamp);
    }
    
    return sortConfig.direction === 'ascending'
      ? (a[sortConfig.key] as number) - (b[sortConfig.key] as number)
      : (b[sortConfig.key] as number) - (a[sortConfig.key] as number);
  });

  return (
    <HomeLayout title="Option Chain Summary">
      <div className="card-glass rounded-xl p-6 w-full max-w-[95vw] overflow-x-auto">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex-shrink-0">
            <label className="inline-flex items-center">
              Symbol:
              <select 
                className="styled-dropdown ml-2"
                value={selectedSymbol} 
                onChange={(e) => setSelectedSymbol(e.target.value)}
                disabled={isLoading}
              >
                <option value="">Select Symbol</option>
                {symbols.map(symbol => (
                  <option key={symbol} value={symbol}>{symbol}</option>
                ))}
              </select>
            </label>
          </div>
          
          <div className="flex-shrink-0">
            <label className="inline-flex items-center">
              Expiry:
              <select 
                className="styled-dropdown ml-2"
                value={selectedExpiry} 
                onChange={(e) => setSelectedExpiry(e.target.value)}
                disabled={isLoading || !selectedSymbol}
              >
                <option value="">Select Expiry</option>
                {Array.isArray(expiries) && expiries.map(expiry => (
                  <option key={expiry} value={expiry}>{expiry}</option>
                ))}
              </select>
            </label>
          </div>
          
          <div className="flex-shrink-0">
            <label className="inline-flex items-center">
              Date:
              <select 
                className="styled-dropdown ml-2"
                value={selectedDate} 
                onChange={handleDateChange}
                disabled={isLoading || !selectedSymbol || !selectedExpiry}
              >
                <option value="">Select Date</option>
                {availableDates.map((date) => (
                  <option key={date} value={date}>{date}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading data...</span>
          </div>
        ) : data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="data-table mt-4">
              <thead>
                <tr>
                  <th onClick={() => handleSort('timestamp')} className="cursor-pointer">
                    Timestamp {sortConfig.key === 'timestamp' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('PCR_OI')} className="cursor-pointer">
                    PCR_OI {sortConfig.key === 'PCR_OI' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('PCR_VOL')} className="cursor-pointer">
                    PCR_VOL {sortConfig.key === 'PCR_VOL' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('Max_Pain_Level')} className="cursor-pointer">
                    Max Pain Level {sortConfig.key === 'Max_Pain_Level' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th>CE ITM OI</th>
                  <th>CE OTM OI</th>
                  <th>PE ITM OI</th>
                  <th>PE OTM OI</th>
                  <th>CE ITM Vol</th>
                  <th>CE OTM Vol</th>
                  <th>PE ITM Vol</th>
                  <th>PE OTM Vol</th>
                  <th>CE ITM Buy</th>
                  <th>CE OTM Buy</th>
                  <th>CE ITM Sell</th>
                  <th>CE OTM Sell</th>
                  <th>PE ITM Buy</th>
                  <th>PE OTM Buy</th>
                  <th>PE ITM Sell</th>
                  <th>PE OTM Sell</th>
                  <th>Buy/Call ITM</th>
                  <th>Buy/Call OTM</th>
                  <th>WA Strike CE</th>
                  <th>WA Strike PE</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((item, index) => (
                  <tr key={`${item.timestamp}-${index}`}>
                    <td>{item.timestamp}</td>
                    <td style={{ color: item.PCR_OI > 1 ? 'green' : 'red', fontWeight: 'bold' }}>{item.PCR_OI.toFixed(2)}</td>
                    <td style={{ color: item.PCR_VOL > 1 ? 'green' : 'red', fontWeight: 'bold' }}>{item.PCR_VOL.toFixed(2)}</td>
                    <td>{item.Max_Pain_Level}</td>
                    <td>{item.Total_OI_CE_ITM.toLocaleString()}</td>
                    <td>{item.Total_OI_CE_OTM.toLocaleString()}</td>
                    <td>{item.Total_OI_PE_ITM.toLocaleString()}</td>
                    <td>{item.Total_OI_PE_OTM.toLocaleString()}</td>
                    <td>{item.Total_Trade_Vol_CE_ITM.toLocaleString()}</td>
                    <td>{item.Total_Trade_Vol_CE_OTM.toLocaleString()}</td>
                    <td>{item.Total_Trade_Vol_PE_ITM.toLocaleString()}</td>
                    <td>{item.Total_Trade_Vol_PE_OTM.toLocaleString()}</td>
                    <td>{item.Total_Buy_CE_ITM.toLocaleString()}</td>
                    <td>{item.Total_Buy_CE_OTM.toLocaleString()}</td>
                    <td>{item.Total_Sell_CE_ITM.toLocaleString()}</td>
                    <td>{item.Total_Sell_CE_OTM.toLocaleString()}</td>
                    <td>{item.Total_Buy_PE_ITM.toLocaleString()}</td>
                    <td>{item.Total_Buy_PE_OTM.toLocaleString()}</td>
                    <td>{item.Total_Sell_PE_ITM.toLocaleString()}</td>
                    <td>{item.Total_Sell_PE_OTM.toLocaleString()}</td>
                    <td>{item.Total_Buy_To_Call_Ratio_ITM.toFixed(2)}</td>
                    <td>{item.Total_Buy_To_Call_Ratio_OTM.toFixed(2)}</td>
                    <td>{item.WA_Strike_CE}</td>
                    <td>{item.WA_Strike_PE}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-8 text-muted-foreground">
            {selectedSymbol && selectedExpiry && selectedDate ? 
              "No data available for the selected criteria." : 
              "Please select symbol, expiry, and date to view data."}
          </div>
        )}
      </div>
    </HomeLayout>
  );
};

export default OISummary;
