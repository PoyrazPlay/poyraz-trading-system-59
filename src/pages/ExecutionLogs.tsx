
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import HomeLayout from '@/components/layout/HomeLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText, AlertCircle, CheckCircle2, RefreshCw, Search, X, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Define log entry type
interface LogEntry {
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  details?: string;
  code?: string;
}

// Demo logs for testing
const demoLogs: LogEntry[] = [
  {
    timestamp: '2025-02-28 09:30:12',
    type: 'info',
    message: 'Session started',
    details: 'Trading session initialized successfully'
  },
  {
    timestamp: '2025-02-28 09:32:45',
    type: 'success',
    message: 'Order placed',
    details: 'Buy NIFTY 22100 CE @ 210.75, 5 lots'
  },
  {
    timestamp: '2025-02-28 09:35:22',
    type: 'warning',
    message: 'Market volatility detected',
    details: 'VIX increased by 3.2% in the last 5 minutes'
  },
  {
    timestamp: '2025-02-28 09:40:18',
    type: 'error',
    message: 'API connection failed',
    details: 'Unable to connect to order management system',
    code: 'ERR_CONNECTION_REFUSED'
  },
  {
    timestamp: '2025-02-28 09:42:33',
    type: 'success',
    message: 'Connection restored',
    details: 'API connection reestablished'
  },
  {
    timestamp: '2025-02-28 09:45:10',
    type: 'info',
    message: 'Stop loss updated',
    details: 'New stop loss set at 190.00'
  }
];

// Function to fetch execution logs
const fetchExecutionLogs = async (): Promise<LogEntry[]> => {
  const response = await fetch('http://localhost:5000/execution_logs');
  if (!response.ok) {
    throw new Error('Failed to fetch execution logs');
  }
  return response.json();
};

const ExecutionLogs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [logTypeFilter, setLogTypeFilter] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['executionLogs'],
    queryFn: fetchExecutionLogs,
    refetchInterval: 60000, // Refresh every minute
    onError: () => {
      toast.error("Failed to load execution logs. Using demo data instead.");
    }
  });

  const logs = data || demoLogs;

  // Filter logs based on search query and type filter
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = !logTypeFilter || log.type === logTypeFilter;
    
    return matchesSearch && matchesType;
  });

  // Get log type badge color
  const getLogTypeColor = (type: string) => {
    switch (type) {
      case 'info': return 'bg-blue-100 text-blue-800 hover:bg-blue-200/80 dark:bg-blue-900/30 dark:text-blue-400';
      case 'success': return 'bg-green-100 text-green-800 hover:bg-green-200/80 dark:bg-green-900/30 dark:text-green-400';
      case 'warning': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200/80 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'error': return 'bg-red-100 text-red-800 hover:bg-red-200/80 dark:bg-red-900/30 dark:text-red-400';
      default: return '';
    }
  };

  // Get log type icon
  const getLogTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return <FileText className="h-4 w-4" />;
      case 'success': return <CheckCircle2 className="h-4 w-4" />;
      case 'warning': return <AlertCircle className="h-4 w-4" />;
      case 'error': return <X className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <HomeLayout 
      title="Execution Logs" 
      subtitle="Trading system execution logs and error reports"
    >
      <Card className="w-full max-w-7xl card-hover">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5" />
            System Logs
          </CardTitle>
          <CardDescription>
            Trade execution events, warnings, and errors
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge 
                variant="outline" 
                className={cn(
                  "cursor-pointer", 
                  logTypeFilter === null ? "bg-primary/10 border-primary/50" : ""
                )}
                onClick={() => setLogTypeFilter(null)}
              >
                All
              </Badge>
              <Badge 
                variant="outline" 
                className={cn(
                  "cursor-pointer", 
                  getLogTypeColor('info'),
                  logTypeFilter === 'info' ? "border-primary/50" : ""
                )}
                onClick={() => setLogTypeFilter('info')}
              >
                Info
              </Badge>
              <Badge 
                variant="outline" 
                className={cn(
                  "cursor-pointer", 
                  getLogTypeColor('success'),
                  logTypeFilter === 'success' ? "border-primary/50" : ""
                )}
                onClick={() => setLogTypeFilter('success')}
              >
                Success
              </Badge>
              <Badge 
                variant="outline" 
                className={cn(
                  "cursor-pointer", 
                  getLogTypeColor('warning'),
                  logTypeFilter === 'warning' ? "border-primary/50" : ""
                )}
                onClick={() => setLogTypeFilter('warning')}
              >
                Warning
              </Badge>
              <Badge 
                variant="outline" 
                className={cn(
                  "cursor-pointer", 
                  getLogTypeColor('error'),
                  logTypeFilter === 'error' ? "border-primary/50" : ""
                )}
                onClick={() => setLogTypeFilter('error')}
              >
                Error
              </Badge>
              <Button 
                size="sm" 
                variant="outline" 
                className="ml-auto" 
                onClick={() => {
                  refetch();
                  toast.success("Logs refreshed");
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Logs Display */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No logs found matching your criteria</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {filteredLogs.map((log, index) => (
                <div 
                  key={index} 
                  className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "p-1.5 rounded-full", 
                        log.type === 'info' ? "bg-blue-100 dark:bg-blue-900/30" : "",
                        log.type === 'success' ? "bg-green-100 dark:bg-green-900/30" : "",
                        log.type === 'warning' ? "bg-yellow-100 dark:bg-yellow-900/30" : "",
                        log.type === 'error' ? "bg-red-100 dark:bg-red-900/30" : "",
                      )}>
                        {getLogTypeIcon(log.type)}
                      </div>
                      <span className="font-medium">{log.message}</span>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {log.timestamp}
                    </div>
                  </div>
                  
                  {log.details && (
                    <p className="text-sm ml-8 text-muted-foreground">
                      {log.details}
                    </p>
                  )}
                  
                  {log.code && (
                    <div className="mt-2 ml-8">
                      <code className="text-xs px-1.5 py-0.5 rounded bg-muted font-mono">
                        {log.code}
                      </code>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-4">
          <p className="text-sm text-muted-foreground">
            Displaying {filteredLogs.length} of {logs.length} log entries. Updated automatically every minute.
          </p>
        </CardFooter>
      </Card>
    </HomeLayout>
  );
};

export default ExecutionLogs;
