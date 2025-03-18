
import React, { useState } from 'react';
import { List, ArrowLeft, Search, SortAsc, SortDesc } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

// Types for Nifty 50 stocks
interface Stock {
  weightage: number;
  token: string;
}

interface Nifty50Stocks {
  [key: string]: Stock;
}

const Nifty50Constituents = () => {
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

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and sort the stocks
  const filteredAndSortedStocks = Object.entries(nifty50Stocks)
    .filter(([symbol]) => 
      symbol.toLowerCase().replace('-eq', '').includes(searchTerm.toLowerCase())
    )
    .sort(([, a], [, b]) => 
      sortOrder === 'desc' ? b.weightage - a.weightage : a.weightage - b.weightage
    );

  const totalWeightage = filteredAndSortedStocks.reduce(
    (sum, [, stock]) => sum + stock.weightage, 0
  );

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Link to="/home">
            <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Nifty 50 Constituents</h1>
        </div>
        <Button 
          onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
          variant="outline"
          className="flex items-center gap-2"
        >
          {sortOrder === 'desc' ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
          Sort by Weightage
        </Button>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search stocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <List className="h-5 w-5 text-primary" />
            Nifty 50 Stocks
          </CardTitle>
          <CardDescription>
            View weightage of top Nifty 50 stocks (Total: {Object.keys(nifty50Stocks).length})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead className="text-right">Weightage (%)</TableHead>
                  <TableHead className="text-right">% of Selection</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedStocks.map(([symbol, data]) => (
                  <TableRow key={symbol}>
                    <TableCell className="font-medium">{symbol.replace("-EQ", "")}</TableCell>
                    <TableCell className="text-right">
                      {data.weightage.toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right">
                      {((data.weightage / totalWeightage) * 100).toFixed(2)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
          
          <div className="mt-3 flex justify-between items-center text-xs text-muted-foreground">
            <span>Displayed stocks: {filteredAndSortedStocks.length}</span>
            <span>Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Nifty50Constituents;
