import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import HomeLayout from '@/components/layout/HomeLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, AlertTriangle, CheckCircle, Clock, Search, Filter, Calendar } from 'lucide-react';
import { toast } from 'sonner';

// Define log entry type
interface LogEntry {
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  tradeId?: string;
  symbol?: string;
  details?: string;
}

// Demo data for testing
const demoLogs: LogEntry[] = [
  { timestamp: "2025-02-28 09:30:15", level: "info", message: "Trading session started", details: "Session ID: 9872345" },
  { timestamp: "2025-02-28 09:31:20", level: "info", message: "Order placed", tradeId: "ORD123456", symbol: "NIFTY25MARFUT", details: "Buy 50 @ 22451.65" },
  { timestamp: "2025-02-28 09:35:45", level: "info", message: "Order executed", tradeId: "ORD123456", symbol: "NIFTY25MARFUT", details: "Bought 50 @ 22452.10" },
  { timestamp: "2025-02-28 10:15:30", level: "warning", message: "Slippage detected", tradeId: "ORD123456", symbol: "NIFTY25MARFUT", details: "Expected: 22452.10, Actual: 22454.25" },
  { timestamp: "2025-02-28 11:05:12", level: "error", message: "Order rejection", tradeId: "ORD789012", symbol: "BANKNIFTY25MARFUT", details: "Insufficient margin" },
  { timestamp: "2025-02-28 11:30:45", level: "info", message: "Take profit triggered", tradeId: "ORD123456", symbol: "NIFTY25MARFUT", details: "Sold 50 @ 22495.60, P&L: +2175.00" },
  { timestamp: "2025-02-28 12:45:10", level: "debug", message: "Price feed reconnected", details: "Reconnect attempt: 1" },
  { timestamp: "2025-02-28 13:15:22", level: "info", message: "Order placed", tradeId: "ORD345678", symbol: "NIFTY25MARFUT", details: "Sell 25 @ 22510.40" },
  { timestamp: "2025-02-28 13:16:05", level: "info", message: "Order executed", tradeId: "ORD345678", symbol: "NIFTY25MARFUT", details: "Sold 25 @ 22508.75" },
  { timestamp: "2025-02-28 14:30:18", level: "error", message: "API connection failed", details: "Timeout after 30s, retrying..." },
  { timestamp: "2025-02-28 14:32:45", level: "debug", message: "API reconnected", details: "Reconnect successful after 2 attempts" },
  { timestamp: "2025-02-28 15:10:30", level: "info", message: "Stop loss triggered", tradeId: "ORD345678", symbol: "NIFTY25MARFUT", details: "Bought 25 @ 22530.25, P&L: -537.50" }
];

// Interface for date API response
interface DatesResponse {
  exec_dates: string[];
}

// Interface for log content API response
interface LogContentResponse {
  date: string;
  log_content: string;
}

// Function to fetch available execution dates
const fetchAvailableDates = async (): Promise<string[]> => {
  try {
    const response = await fetch('http://54.221.81.212:5000/get_exec_dates');
    if (!response.ok) {
      throw new Error('Failed to fetch execution dates');
    }
    const data: DatesResponse = await response.json();
    return data.exec_dates;
  } catch (error) {
    console.error("Error fetching dates:", error);
    throw error;
  }
};

// Function to fetch log content for a specific date
const fetchLogContent = async (date: string): Promise<string> => {
  try {
    const response = await fetch(`http://54.221.81.212:5000/get_exec_log?date=${date}`);
    if (!response.ok) {
      throw new Error('Failed to fetch execution log content');
    }
    const data: LogContentResponse = await response.json();
    return data.log_content;
  } catch (error) {
    console.error(`Error fetching log content for date ${date}:`, error);
    throw error;
  }
};

// Function to format date from YYYYMMDD to YYYY-MM-DD format
const formatDateDisplay = (dateString: string): string => {
  if (dateString.length !== 8) return dateString;
  
  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);
  
  return `${year}-${month}-${day}`;
};

const ExecutionLogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [rawLogContent, setRawLogContent] = useState<string>('');

  // Fetch available dates
  const { 
    data: availableDates, 
    isLoading: isLoadingDates, 
    error: datesError 
  } = useQuery({
    queryKey: ['executionDates'],
    queryFn: fetchAvailableDates,
    meta: {
      onSettled: (_, error) => {
        if (error) {
          toast.error("Failed to load execution dates");
        }
      }
    }
  });

  // Fetch log content for selected date
  const { 
    data: logContent,
    isLoading: isLoadingContent,
    error: contentError,
    refetch: refetchLogContent
  } = useQuery({
    queryKey: ['executionLogContent', selectedDate],
    queryFn: () => fetchLogContent(selectedDate),
    enabled: !!selectedDate, // Only run query if selectedDate is set
    meta: {
      onSettled: (_, error) => {
        if (error) {
          toast.error(`Failed to load log content for date ${selectedDate}`);
        }
      }
    }
  });

  // Set the first available date as selected when dates are loaded
  useEffect(() => {
    if (availableDates && availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates, selectedDate]);

  // Update rawLogContent when logContent changes
  useEffect(() => {
    if (logContent) {
      setRawLogContent(logContent);
    }
  }, [logContent]);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  if (isLoadingDates) {
    return (
      <HomeLayout title="Execution Logs" subtitle="Loading date data...">
        <div className="flex items-center justify-center h-64 w-full">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-t-4 border-primary rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Loading execution dates...</p>
          </div>
        </div>
      </HomeLayout>
    );
  }

  if (datesError) {
    return (
      <HomeLayout title="Execution Logs" subtitle="Error loading data">
        <Card className="w-full max-w-7xl">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
              <h3 className="font-medium text-lg mb-2">Failed to load execution dates</h3>
              <p className="text-muted-foreground mb-4">
                There was an error loading the available execution dates.
              </p>
              <button 
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          </CardContent>
        </Card>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout 
      title="Execution Logs" 
      subtitle="Monitor system execution logs and errors"
    >
      <Card className="w-full max-w-7xl card-hover">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Execution Logs
              </CardTitle>
              <CardDescription>
                System logs, errors, and trading execution details
              </CardDescription>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={selectedDate}
                  onValueChange={handleDateChange}
                  disabled={isLoadingDates || !availableDates}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select date" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDates && availableDates.map((date) => (
                      <SelectItem key={date} value={date}>
                        {formatDateDisplay(date)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <ScrollArea className="h-[600px] rounded-md border">
            {isLoadingContent && selectedDate ? (
              <div className="flex flex-col items-center justify-center h-full py-10">
                <div className="w-10 h-10 border-t-4 border-primary rounded-full animate-spin mb-4"></div>
                <p className="text-muted-foreground">Loading log content...</p>
              </div>
            ) : contentError ? (
              <div className="flex flex-col items-center justify-center py-10 text-center p-4">
                <AlertTriangle className="h-10 w-10 text-destructive mb-3" />
                <h3 className="font-medium text-lg mb-1">Error loading log content</h3>
                <p className="text-muted-foreground mb-4">
                  Failed to load log content for date {formatDateDisplay(selectedDate)}
                </p>
                <button 
                  className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm"
                  onClick={() => refetchLogContent()}
                >
                  Retry
                </button>
              </div>
            ) : !selectedDate ? (
              <div className="flex flex-col items-center justify-center py-10 text-center p-4">
                <Calendar className="h-10 w-10 text-muted-foreground mb-3" />
                <h3 className="font-medium text-lg mb-1">No date selected</h3>
                <p className="text-muted-foreground">
                  Please select a date to view execution logs.
                </p>
              </div>
            ) : (
              <pre className="p-4 font-mono text-sm whitespace-pre-wrap break-words">
                {rawLogContent || "No log content available for the selected date."}
              </pre>
            )}
          </ScrollArea>
        </CardContent>
        
        <CardFooter className="border-t pt-4">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {selectedDate ? 
              <>Selected date: {formatDateDisplay(selectedDate)} • Last update: {new Date().toLocaleTimeString()}</> :
              <>No date selected • Last update: {new Date().toLocaleTimeString()}</>
            }
          </p>
        </CardFooter>
      </Card>
    </HomeLayout>
  );
};

export default ExecutionLogs;
