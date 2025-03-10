
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import HomeLayout from '@/components/layout/HomeLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, AlertTriangle, CheckCircle, Clock, Search, Filter } from 'lucide-react';
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

// Function to fetch log data
const fetchLogs = async (): Promise<LogEntry[]> => {
  const response = await fetch('http://localhost:5000/execution_logs');
  if (!response.ok) {
    throw new Error('Failed to fetch execution logs');
  }
  return response.json();
};

const ExecutionLogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');

  // Fetch log data
  const { data, isLoading, error } = useQuery({
    queryKey: ['executionLogs'],
    queryFn: fetchLogs,
    refetchInterval: 60000, // Refresh every minute
    meta: {
      onSettled: (_, error) => {
        if (error) {
          toast.error("Failed to load execution logs. Using demo data instead.");
        }
      }
    }
  });

  const logs = data || demoLogs;

  // Filter logs based on search term and level filter
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.tradeId && log.tradeId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.symbol && log.symbol.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    
    return matchesSearch && matchesLevel;
  });

  // Get level badge color
  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'error':
        return <Badge variant="destructive">{level}</Badge>;
      case 'warning':
        // Changed from 'warning' to 'secondary' with custom yellow styling
        return <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600">{level}</Badge>;
      case 'info':
        return <Badge variant="default">{level}</Badge>;
      case 'debug':
        return <Badge variant="outline" className="text-muted-foreground">{level}</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <HomeLayout title="Execution Logs" subtitle="Loading log data...">
        <div className="flex items-center justify-center h-64 w-full">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-t-4 border-primary rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Loading execution logs...</p>
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
              <div className="relative max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search logs..."
                  className="pl-8 w-[200px] md:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={levelFilter}
                  onValueChange={setLevelFilter}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Filter by level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="debug">Debug</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <ScrollArea className="h-[500px] rounded-md border">
            <div className="p-4 space-y-4">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, index) => (
                  <div key={index} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {log.level === 'error' && <AlertTriangle className="h-4 w-4 text-destructive" />}
                        {log.level === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                        {log.level === 'info' && <CheckCircle className="h-4 w-4 text-primary" />}
                        {log.level === 'debug' && <FileText className="h-4 w-4 text-muted-foreground" />}
                        <span className="font-medium">{log.message}</span>
                        {getLevelBadge(log.level)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{log.timestamp}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 ml-6 text-sm">
                      {log.tradeId && (
                        <div>
                          <span className="font-medium">Trade ID:</span> {log.tradeId}
                        </div>
                      )}
                      {log.symbol && (
                        <div>
                          <span className="font-medium">Symbol:</span> {log.symbol}
                        </div>
                      )}
                      {log.details && (
                        <div>
                          <span className="font-medium">Details:</span> {log.details}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <FileText className="h-10 w-10 text-muted-foreground mb-3" />
                  <h3 className="font-medium text-lg mb-1">No logs found</h3>
                  <p className="text-muted-foreground">
                    No logs match your current search and filter criteria.
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        
        <CardFooter className="border-t pt-4">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Last update: {new Date().toLocaleTimeString()} • Showing {filteredLogs.length} of {logs.length} logs
          </p>
        </CardFooter>
      </Card>
    </HomeLayout>
  );
};

export default ExecutionLogs;
