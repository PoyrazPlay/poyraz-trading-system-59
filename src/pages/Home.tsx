
import React from 'react';
import { motion } from 'framer-motion';
import HomeLayout from '@/components/layout/HomeLayout';
import MenuCard from '@/components/ui/menu-card';
import { LineChart, BarChart, PieChart, Activity, TrendingUp, Calendar, Eye, History, HelpCircle } from 'lucide-react';

const Home = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

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
    }
  ];

  const analysisOptions = [
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
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mx-auto"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="space-y-6">
          <h2 className="text-xl font-medium px-1 flex items-center gap-2 mb-4">
            <Eye className="h-5 w-5 text-primary" />
            <span>Trading Activities</span>
          </h2>
          <div className="grid gap-4">
            {tradingOptions.map((option) => (
              <motion.div key={option.path} variants={item}>
                <MenuCard
                  title={option.title}
                  to={option.path}
                  icon={option.icon}
                  description={option.description}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <motion.div variants={item} className="space-y-6">
          <h2 className="text-xl font-medium px-1 flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Market Analysis</span>
          </h2>
          <div className="grid gap-4">
            {analysisOptions.map((option) => (
              <motion.div key={option.path} variants={item}>
                <MenuCard
                  title={option.title}
                  to={option.path}
                  icon={option.icon}
                  description={option.description}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </HomeLayout>
  );
};

export default Home;
