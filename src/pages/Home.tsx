
import React from 'react';
import HomeLayout from '@/components/layout/HomeLayout';
import MenuCard from '@/components/ui/menu-card';
import { LineChart, BarChart, PieChart, Activity, TrendingUp, Calendar, Eye, History, HelpCircle, FileText, CandlestickChart } from 'lucide-react';

const Home = () => {
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
