
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    TradingView: any;
  }
}

const TradingViewWidget = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create script element
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (container.current) {
        new window.TradingView.widget({
          autosize: true,
          symbol: "NSE:NIFTY",
          interval: "5",
          timezone: "Asia/Kolkata",
          theme: "light",
          style: "1",
          locale: "in",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: container.current.id,
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return <div id="tradingview_widget" ref={container} className="h-[500px] w-full" />;
};

export default TradingViewWidget;
