import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import HomeLayout from '@/components/layout/HomeLayout';
import MenuCard from '@/components/ui/menu-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, BarChart, PieChart, Activity, TrendingUp, Calendar, Eye, History, HelpCircle, FileText, CandlestickChart, Wallet, IndianRupee, RefreshCw, AlertTriangle, LineChartIcon, List, ArrowRight } from 'lucide-react';
import apiClient from '@/utils/apiService';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Types for user PNL data
interface DailyPNL {
  date: string;
  pnl: number;
  pnlPercentage: number;
  walletBalance: number;
}

interface UserPNLResponse {
  daily_pnl: DailyPNL[];
}

// Types for Nifty 50 constituents
interface Stock {
  weightage: number;
  token: string;
}

interface Nifty50Stocks {
  [key: string]: Stock;
}

// Fetch user PNL data
const fetchUserPNL = async (): Promise<UserPNLResponse> => {
  try {
    const response = await apiClient.get('/get_user_pnl?username=faiizan');
    return response.data;
  } catch (error) {
    console.error("Error fetching user PNL:", error);
    throw error;
  }
};

const Home = () => {
  const [nifty50Stocks, setNifty50Stocks] = useState<Nifty50Stocks>({
    "HDFCBANK-EQ": { weightage: 13.3, token: "" },
    "ICICIBANK-EQ": { weightage: 8.58, token: "" },
    "RELIANCE-EQ": { weightage: 8.23, token: "" },
    "INFY-EQ": { weightage: 6.14, token: "" },
    "BHARTIARTL-EQ": { weightage: 4.25, token: "" },
    "TCS-EQ": { weightage: 3.97, token: "" },
    "ITC-EQ": { weightage: 3.85, token: "" },
    "LT-EQ": { weightage: 3.62, token: "" },
    "KOTAKBANK-EQ": { weightage: 3.47, token: "" },
    "HINDUNILVR-EQ": { weightage: 3.23, token: "" },
    "SBIN-EQ": { weightage: 3.07, token: "" },
    "AXISBANK-EQ": { weightage: 2.94, token: "" },
    "BAJFINANCE-EQ": { weightage: 2.81, token: "" },
    "ASIANPAINT-EQ": { weightage: 2.68, token: "" },
    "MARUTI-EQ": { weightage: 2.03, token: "" },
    "M&M-EQ": { weightage: 1.92, token: "" },
    "NTPC-EQ": { weightage: 1.81, token: "" },
    "ULTRACEMCO-EQ": { weightage: 1.74, token: "" },
    "BAJAJFINSV-EQ": { weightage: 1.63, token: "" },
    "ONGC-EQ": { weightage: 1.61, token: "" },
    "WIPRO-EQ": { weightage: 1.51, token: "" },
    "TITAN-EQ": { weightage: 1.51, token: "" },
    "ADANIENT-EQ": { weightage: 1.47, token: "" },
    "POWERGRID-EQ": { weightage: 1.39, token: "" },
    "ADANIPORTS-EQ": { weightage: 1.38, token: "" },
    "TATAMOTORS-EQ": { weightage: 1.38, token: "" },
    "JSWSTEEL-EQ": { weightage: 1.37, token: "" },
    "COALINDIA-EQ": { weightage: 1.32, token: "" },
    "BAJAJ-AUTO-EQ": { weightage: 1.17, token: "" },
    "NESTLEIND-EQ": { weightage: 1.17, token: "" },
    "BEL-EQ": { weightage: 1.15, token: "" },
    "TATASTEEL-EQ": { weightage: 1.07, token: "" },
    "TRENT-EQ": { weightage: 1.03, token: "" },
    "GRASIM-EQ": { weightage: 0.91, token: "" },
    "HINDALCO-EQ": { weightage: 0.87, token: "" },
    "SBILIFE-EQ": { weightage: 0.81, token: "" },
    "EICHERMOT-EQ": { weightage: 0.78, token: "" },
    "TECHM-EQ": { weightage: 0.77, token: "" },
    "HDFCLIFE-EQ": { weightage: 0.76, token: "" },
    "CIPLA-EQ": { weightage: 0.67, token: "" },
    "SHRIRAMFIN-EQ": { weightage: 0.67, token: "" },
    "BRITANNIA-EQ": { weightage: 0.63, token: "" },
    "BPCL-EQ": { weightage: 0.63, token: "" },
    "DRREDDY-EQ": { weightage: 0.54, token: "" },
    "TATACONSUM-EQ": { weightage: 0.52, token: "" },
    "APOLLOHOSP-EQ": { weightage: 0.50, token: "" }
  });

  const { 
    data: userPNLData, 
    isLoading: isLoadingPNL, 
    error: pnlError,
    refetch: refetchPNL
  } = useQuery({
    queryKey: ['userPNL'],
    queryFn: fetchUserPNL,
    meta: {
      onSettled: (_, error) => {
        if (error) {
          toast.error("Failed to load user data", {
            description: "Could not connect to the server"
          });
        }
      }
    }
  });

  const tradingOptions = [
    { 
      title: "Live Trade", 
      path: "/live-trade", 
      icon: <Activity />,
      description: "Track current trading activity in real-time"
    },
    { 
      title: "Today's Trade", 
      path: "/todays-trade", 
      icon: <Calendar />,
      description: "View trading data for the current day"
    },
    { 
      title: "Historical Trades", 
      path: "/hist-trades", 
      icon: <History />,
      description: "Access past trading records and analysis"
    },
    { 
      title: "Execution Logs", 
      path: "/execution-logs", 
      icon: <FileText />,
      description: "View detailed execution logs and errors"
    }
  ];

  const analysisOptions = [
    { 
      title: "OHLC Analysis", 
      path: "/ohlc-analysis", 
      icon: <CandlestickChart />,
      description: "Candlestick charts and technical indicators"
    },
    { 
      title: "Option Chain", 
      path: "/oi-detailed", 
      icon: <LineChart />,
      description: "Detailed option chain analysis"
    },
    { 
      title: "OI Summary", 
      path: "/oi-summary", 
      icon: <BarChart />,
      description: "Open interest summary and insights"
    },
    { 
      title: "PCR View", 
      path: "/pcr", 
      icon: <PieChart />,
      description: "Put/Call ratio visualization"
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <HomeLayout 
      title="Welcome to Poyraz Trading System"
      subtitle="Access advanced trading tools and real-time market analysis"
    >
      <div 
        className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mx-auto"
      >
        <div className="space-y-6">
          <h2 className="text-xl font-medium px-1 flex items-center gap-2 mb-4">
            <Eye className="h-5 w-5 text-primary" />
            <span>Trading Activities</span>
          </h2>
          <div className="grid gap-4">
            {tradingOptions.map((option) => (
              <div key={option.path}>
                <MenuCard
                  title={option.title}
                  to={option.path}
                  icon={option.icon}
                  description={option.description}
                />
              </div>
            ))}
          </div>
          
          <Card className="card-hover shadow-md mt-6 border-t-4 border-t-primary">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Account & Wallet Details
              </CardTitle>
              <CardDescription>
                Track your wallet balance and trading performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pnlError ? (
                <Alert variant="destructive" className="mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to load account data. Server may be unavailable.
                  </AlertDescription>
                </Alert>
              ) : isLoadingPNL ? (
                <div className="flex items-center justify-center py-6">
                  <div className="animate-spin h-6 w-6 border-t-2 border-primary rounded-full"></div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4 bg-muted/30 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <IndianRupee className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">Current Balance:</span>
                    </div>
                    <span className="text-lg font-bold">
                      {userPNLData?.daily_pnl?.[userPNLData.daily_pnl.length - 1] 
                        ? formatCurrency(userPNLData.daily_pnl[userPNLData.daily_pnl.length - 1].walletBalance) 
                        : "N/A"}
                    </span>
                  </div>
                  
                  <div className="overflow-hidden rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>P&L</TableHead>
                          <TableHead>Change</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userPNLData?.daily_pnl?.slice().reverse().slice(0, 3).map((day) => (
                          <TableRow key={day.date}>
                            <TableCell className="font-medium">{day.date}</TableCell>
                            <TableCell className={day.pnl >= 0 ? "text-green-600" : "text-red-600"}>
                              {formatCurrency(day.pnl)}
                            </TableCell>
                            <TableCell className={day.pnlPercentage >= 0 ? "text-green-600" : "text-red-600"}>
                              {day.pnlPercentage > 0 ? "+" : ""}{day.pnlPercentage}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="mt-3 flex justify-between items-center">
                    <button
                      onClick={() => { 
                        toast.info("Refreshing account data..."); 
                        refetchPNL(); 
                      }}
                      className="text-xs flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Refresh
                    </button>
                    
                    <Link to="/user-account">
                      <Button variant="link" className="text-xs h-auto p-0 gap-1" asChild>
                        <div className="flex items-center">
                          View Details <ArrowRight className="h-3 w-3" />
                        </div>
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-xl font-medium px-1 flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Market Analysis</span>
          </h2>
          <div className="grid gap-4">
            {analysisOptions.map((option) => (
              <div key={option.path}>
                <MenuCard
                  title={option.title}
                  to={option.path}
                  icon={option.icon}
                  description={option.description}
                />
              </div>
            ))}
          </div>
          
          <Card className="card-hover shadow-md mt-6 border-t-4 border-t-primary">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <List className="h-5 w-5 text-primary" />
                Nifty 50 Constituents
              </CardTitle>
              <CardDescription>
                View weightage of top Nifty 50 stocks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[270px] pr-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead className="text-right">Weightage (%)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(nifty50Stocks)
                      .sort((a, b) => b[1].weightage - a[1].weightage)
                      .slice(0, 10)
                      .map(([symbol, data]) => (
                        <TableRow key={symbol}>
                          <TableCell className="font-medium">{symbol.replace("-EQ", "")}</TableCell>
                          <TableCell className="text-right">
                            {data.weightage.toFixed(2)}%
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </ScrollArea>
              
              <div className="mt-3 flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  Showing top 10 of {Object.keys(nifty50Stocks).length} stocks
                </span>
                
                <Link to="/nifty50-constituents">
                  <Button variant="link" className="text-xs h-auto p-0 gap-1" asChild>
                    <div className="flex items-center">
                      View All <ArrowRight className="h-3 w-3" />
                    </div>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </HomeLayout>
  );
};

export default Home;
