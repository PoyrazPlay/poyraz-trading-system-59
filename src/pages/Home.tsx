import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import HomeLayout from '@/components/layout/HomeLayout';
import MenuCard from '@/components/ui/menu-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, BarChart, PieChart, Activity, TrendingUp, Calendar, Eye, History, FileText, 
         CandlestickChart, Wallet, IndianRupee, RefreshCw, AlertTriangle, LineChartIcon, List, ArrowRight } from 'lucide-react';
import apiClient from '@/utils/apiService';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

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

// Fallback data for when API fails
const fallbackPNLData: UserPNLResponse = {
  daily_pnl: [
    {
      date: "2025-03-16",
      pnl: 18600,
      pnlPercentage: 4,
      walletBalance: 570040
    },
    {
      date: "2025-03-17",
      pnl: -10600,
      pnlPercentage: -2.8,
      walletBalance: 559020
    },
    {
      date: "2025-03-18",
      pnl: 32960,
      pnlPercentage: 9.2,
      walletBalance: 590640
    }
  ]
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
      icon: <Activity className="h-6 w-6" />,
      description: "Track current trading activity in real-time"
    },
    { 
      title: "Today's Trade", 
      path: "/todays-trade", 
      icon: <Calendar className="h-6 w-6" />,
      description: "View trading data for the current day"
    },
    { 
      title: "Historical Trades", 
      path: "/hist-trades", 
      icon: <History className="h-6 w-6" />,
      description: "Access past trading records and analysis"
    },
    { 
      title: "Execution Logs", 
      path: "/execution-logs", 
      icon: <FileText className="h-6 w-6" />,
      description: "View detailed execution logs and errors"
    },
    {
      title: "User Account", 
      path: "/user-account", 
      icon: <Wallet className="h-6 w-6" />,
      description: "Track your wallet balance and trading performance"
    }
  ];

  const analysisOptions = [
    { 
      title: "OHLC Analysis", 
      path: "/ohlc-analysis", 
      icon: <CandlestickChart className="h-6 w-6" />,
      description: "Candlestick charts and technical indicators"
    },
    { 
      title: "Option Chain", 
      path: "/oi-detailed", 
      icon: <LineChart className="h-6 w-6" />,
      description: "Detailed option chain analysis"
    },
    { 
      title: "OI Summary", 
      path: "/oi-summary", 
      icon: <BarChart className="h-6 w-6" />,
      description: "Open interest summary and insights"
    },
    { 
      title: "PCR View", 
      path: "/pcr", 
      icon: <PieChart className="h-6 w-6" />,
      description: "Put/Call ratio visualization"
    },
    {
      title: "Nifty 50", 
      path: "/nifty50-constituents", 
      icon: <List className="h-6 w-6" />,
      description: "View weightage of top Nifty 50 stocks"
    }
  ];

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
        </div>
      </div>
    </HomeLayout>
  );
};

export default Home;
