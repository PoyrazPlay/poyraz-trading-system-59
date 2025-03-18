
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import HomeLayout from '@/components/layout/HomeLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { FileText, AlertTriangle, RefreshCw, Clock, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { fallbackDates, getFallbackLogContent } from '@/utils/execLogsData';
import apiClient from '@/utils/apiService';

interface DatesResponse {
  exec_dates: string[];
}

interface LogContentResponse {
  date: string;
  log_content: string;
  log_file?: string;
}

// Available log files
const LOG_FILES = [
  "BackendLogs.log",
  "execLogs.log",
  "execOPT_Download.log",
  "execOptCHN.log",
  "execOptPCR.log"
];

const fetchAvailableDates = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get('/get_exec_dates');
    const data: DatesResponse = response.data;
    return data.exec_dates;
  } catch (error) {
    console.error("Error fetching dates:", error);
    throw error;
  }
};

const fetchLogContent = async (date: string, logFile: string): Promise<string> => {
  try {
    const response = await apiClient.get('/get_exec_log', {
      params: { date, log_file: logFile }
    });
    const data: LogContentResponse = response.data;
    return data.log_content;
  } catch (error) {
    console.error(`Error fetching log content for date ${date} and file ${logFile}:`, error);
    throw error;
  }
};

const formatDateDisplay = (dateString: string): string => {
  if (dateString.length !== 8) return dateString;
  
  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);
  
  return `${year}-${month}-${day}`;
};

const ExecutionLogs: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedLogFile, setSelectedLogFile] = useState<string>(LOG_FILES[0]);
  const [rawLogContent, setRawLogContent] = useState<string>('');
  const [usingFallbackData, setUsingFallbackData] = useState<boolean>(false);

  const { 
    data: availableDates, 
    isLoading: isLoadingDates, 
    error: datesError,
    refetch: refetchDates
  } = useQuery({
    queryKey: ['executionDates'],
    queryFn: fetchAvailableDates,
    meta: {
      onSettled: (_, error) => {
        if (error) {
          console.log("Using fallback dates due to API error");
          setUsingFallbackData(true);
          toast.warning("Using offline data - API unreachable", {
            description: "We're showing you cached data because we couldn't connect to the server."
          });
        } else {
          setUsingFallbackData(false);
        }
      }
    }
  });

  const { 
    data: logContent,
    isLoading: isLoadingContent,
    error: contentError,
    refetch: refetchLogContent
  } = useQuery({
    queryKey: ['executionLogContent', selectedDate, selectedLogFile],
    queryFn: () => fetchLogContent(selectedDate, selectedLogFile),
    enabled: !!selectedDate && !usingFallbackData,
    meta: {
      onSettled: (_, error) => {
        if (error && selectedDate) {
          console.log(`Using fallback log content for date ${selectedDate}`);
          setRawLogContent(getFallbackLogContent(selectedDate));
          if (!usingFallbackData) {
            toast.warning("Using offline data for logs", {
              description: "We're showing you cached log data because we couldn't connect to the server."
            });
            setUsingFallbackData(true);
          }
        }
      }
    }
  });

  useEffect(() => {
    const dates = usingFallbackData ? fallbackDates : availableDates;
    if (dates && dates.length > 0) {
      const sortedDates = [...dates].sort((a, b) => {
        const dateA = a.length === 8 ? 
          new Date(`${a.substring(0, 4)}-${a.substring(4, 6)}-${a.substring(6, 8)}`) :
          new Date(a);
        const dateB = b.length === 8 ? 
          new Date(`${b.substring(0, 4)}-${b.substring(4, 6)}-${b.substring(6, 8)}`) :
          new Date(b);
        return dateB.getTime() - dateA.getTime();
      });
      
      if (!selectedDate) {
        setSelectedDate(sortedDates[0]);
      }
    }
  }, [availableDates, selectedDate, usingFallbackData]);

  useEffect(() => {
    if (datesError) {
      setUsingFallbackData(true);
    }
  }, [datesError]);

  useEffect(() => {
    if (logContent) {
      setRawLogContent(logContent);
    }
  }, [logContent]);

  useEffect(() => {
    if (usingFallbackData && selectedDate) {
      setRawLogContent(getFallbackLogContent(selectedDate));
    }
  }, [selectedDate, usingFallbackData]);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const handleLogFileChange = (logFile: string) => {
    setSelectedLogFile(logFile);
  };

  const effectiveDates = usingFallbackData ? [...fallbackDates] : [...(availableDates || [])];
  effectiveDates.sort((a, b) => {
    const dateA = a.length === 8 ? 
      new Date(`${a.substring(0, 4)}-${a.substring(4, 6)}-${a.substring(6, 8)}`) :
      new Date(a);
    const dateB = b.length === 8 ? 
      new Date(`${b.substring(0, 4)}-${b.substring(4, 6)}-${b.substring(6, 8)}`) :
      new Date(b);
    return dateB.getTime() - dateA.getTime();
  });

  const handleRetry = () => {
    setUsingFallbackData(false);
    refetchDates();
    if (selectedDate) {
      refetchLogContent();
    }
  };

  const handleRefresh = () => {
    toast.info("Refreshing data...");
    refetchDates();
    if (selectedDate) {
      refetchLogContent();
    }
  };

  if (isLoadingDates && !usingFallbackData) {
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

  return (
    <HomeLayout 
      title="Execution Logs" 
      subtitle="Monitor system execution logs and errors"
    >
      {usingFallbackData && (
        <Alert variant="destructive" className="mb-6 max-w-7xl">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Using Offline Data</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            <span>
              You're viewing cached data because we couldn't connect to the server.
            </span>
            <button 
              onClick={handleRetry}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm"
            >
              Try Again
            </button>
          </AlertDescription>
        </Alert>
      )}

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
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={selectedDate}
                  onValueChange={handleDateChange}
                  disabled={isLoadingDates && !usingFallbackData}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select date" />
                  </SelectTrigger>
                  <SelectContent>
                    {effectiveDates && effectiveDates.map((date) => (
                      <SelectItem key={date} value={date}>
                        {formatDateDisplay(date)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={selectedLogFile}
                  onValueChange={handleLogFileChange}
                  disabled={isLoadingDates && !usingFallbackData}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select log file" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOG_FILES.map((logFile) => (
                      <SelectItem key={logFile} value={logFile}>
                        {logFile}
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
            {isLoadingContent && selectedDate && !usingFallbackData ? (
              <div className="flex flex-col items-center justify-center h-full py-10">
                <div className="w-10 h-10 border-t-4 border-primary rounded-full animate-spin mb-4"></div>
                <p className="text-muted-foreground">Loading log content...</p>
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
                {rawLogContent || "No log content available for the selected date and log file."}
              </pre>
            )}
          </ScrollArea>
        </CardContent>
        
        <CardFooter className="border-t pt-4">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {selectedDate ? 
              <>Selected: {formatDateDisplay(selectedDate)} • File: {selectedLogFile} • Last update: {new Date().toLocaleTimeString()}{usingFallbackData ? " (Offline)" : ""}</> :
              <>No date selected • Last update: {new Date().toLocaleTimeString()}</>
            }
          </p>
        </CardFooter>
      </Card>
    </HomeLayout>
  );
};

export default ExecutionLogs;
