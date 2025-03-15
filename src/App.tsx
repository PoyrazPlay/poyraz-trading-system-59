
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";

// Layout components
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Pages
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import LiveTrade from "@/pages/LiveTrade";
import TodaysTrade from "@/pages/TodaysTrade";
import HistTrades from "@/pages/HistTrades";
import OIDetailed from "@/pages/OIDetailed";
import OISummary from "@/pages/OISummary";
import PCR from "@/pages/PCR";
import OHLCAnalysis from "@/pages/OHLCAnalysis";
import ExecutionLogs from "@/pages/ExecutionLogs";
import StrikeDetail from "@/pages/StrikeDetail";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/live-trade" element={<LiveTrade />} />
      <Route path="/todays-trade" element={<TodaysTrade />} />
      <Route path="/hist-trades" element={<HistTrades />} />
      <Route path="/pcr" element={<PCR />} />
      <Route path="/oi-detailed" element={<OIDetailed />} />
      <Route path="/oi-summary" element={<OISummary />} />
      <Route path="/ohlc-analysis" element={<OHLCAnalysis />} />
      <Route path="/execution-logs" element={<ExecutionLogs />} />
      <Route path="/strike-detail/:symbol/:expiry/:strikePrice" element={<StrikeDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 flex flex-col">
            <AnimatedRoutes />
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
