
// Demo dates for fallback when API is unreachable
export const fallbackDates = [
  "20250228",
  "20250301",
  "20250302",
  "20250303",
  "20250304",
];

// Demo log content for fallback when API is unreachable
export const getFallbackLogContent = (date: string): string => {
  const formattedDate = date.substring(0, 4) + "-" + date.substring(4, 6) + "-" + date.substring(6, 8);
  
  return `Starting script at ${formattedDate} 06:30:45 UTC 2025
Starting main.py
[I ${date.substring(2)} 06:30:47 smartConnect:121] in pool
---------------------------------------
Hello, Welcome to AngleONE TradingSetup (FALLBACK DATA)
---------------------------------------
Starting Hist data Collection
Starting Trading Interface
                         open      high       low     close       ha_open   ha_high        ha_low    ha_close  color_change ha_color
date                                                                                                                                
${formattedDate} 09:15:00  22415.30  22444.75  22410.65  22438.40  22432.462500  22444.75  22410.650000  22427.2750         False    green
${formattedDate} 09:20:00  22439.25  22468.20  22428.50  22464.55  22429.868750  22468.20  22428.500000  22450.1250          True    green
${formattedDate} 09:25:00  22465.05  22477.60  22461.05  22469.15  22439.996875  22477.60  22439.996875  22468.2125         False    green
${formattedDate} 09:30:00  22468.60  22475.70  22457.95  22464.85  22454.104688  22475.70  22454.104688  22466.7750         False    green
${formattedDate} 09:35:00  22464.95  22473.65  22459.50  22467.90  22460.439844  22473.65  22459.500000  22466.5000         False    green
${formattedDate} 09:40:00  22469.05  22469.95  22449.60  22451.15  22463.469922  22469.95  22449.600000  22460.0000         False    green

============Selected Option===============
{'symbol': 'NIFTY${date.substring(4, 6)}MAR25${(parseInt(date.substring(6, 8)) + 2).toString().padStart(2, '0')}00PE', 'token': '45463', 'strike_price': ${(parseInt(date.substring(6, 8)) + 2) * 100}, 'LTP': ${22400 + parseInt(date.substring(6, 8))}.35, 'intrinsic_value': ${parseInt(date.substring(6, 8))}, 'option_type': 'OTM', 'LTP_OPT': ${90 + parseInt(date.substring(6, 8))}.0, 'Variable_LTP': ${60 + parseInt(date.substring(6, 8))}}

Order Placed: BUY NIFTY${date.substring(4, 6)}MAR25${(parseInt(date.substring(6, 8)) + 2).toString().padStart(2, '0')}00PE @ ${90 + parseInt(date.substring(6, 8))}.0

Order Executed: BUY NIFTY${date.substring(4, 6)}MAR25${(parseInt(date.substring(6, 8)) + 2).toString().padStart(2, '0')}00PE @ ${90 + parseInt(date.substring(6, 8))}.25
Take Profit set to ${(90 + parseInt(date.substring(6, 8)) * 1.5).toFixed(2)}
Stop Loss set to ${(90 + parseInt(date.substring(6, 8)) * 0.7).toFixed(2)}

                         open      high       low     close       ha_open   ha_high        ha_low    ha_close  color_change ha_color
date                                                                                                                                
${formattedDate} 10:15:00  22423.85  22425.65  22413.25  22420.95  22423.150000  22425.65  22413.250000  22420.9250          True      red
${formattedDate} 10:20:00  22421.05  22425.00  22417.05  22424.15  22422.037500  22425.00  22417.050000  22421.8125         False      red
${formattedDate} 10:25:00  22423.80  22429.80  22421.90  22428.20  22421.925000  22429.80  22421.900000  22425.9250          True    green

Take Profit triggered: SELL NIFTY${date.substring(4, 6)}MAR25${(parseInt(date.substring(6, 8)) + 2).toString().padStart(2, '0')}00PE @ ${(90 + parseInt(date.substring(6, 8)) * 1.5).toFixed(2)}

Trading session completed for ${formattedDate}
P&L Summary: +${(parseInt(date.substring(6, 8)) * 32).toString()}00.50 INR
`;
};
