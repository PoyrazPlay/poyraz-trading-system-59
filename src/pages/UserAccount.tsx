
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Wallet, IndianRupee, RefreshCw, BarChart3, LineChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import HomeLayout from '@/components/layout/HomeLayout';
import { Skeleton } from '@/components/ui/skeleton';
import apiClient, { getCurrentMachine } from '@/utils/apiService';

// Types for user PNL data
interface VolatilityData {
  std: number;
  sum: number;
}

interface VolatilityInfo {
  Morning: VolatilityData;
  Afternoon: VolatilityData;
  Evening: VolatilityData;
}

interface DailyPNL {
  date: string;
  pnl: number;
  pnlPercentage: number;
  walletBalance: number;
  accuracyPercentage?: number;
  Strategy?: string;
  volatility?: VolatilityInfo;
}

interface UserPNLResponse {
  daily_pnl: DailyPNL[];
}

// Fallback data for when API fails
const fallbackPNLData: UserPNLResponse = {
  daily_pnl: [
    {
      date: "2025-03-16",
      pnl: 18600,
      pnlPercentage: 4,
      walletBalance: 570040,
      accuracyPercentage: 64.0,
      Strategy: "HA_SUM_5Min",
      volatility: {
        Morning: {std: 8.56, sum: 45.32},
        Afternoon: {std: 6.12, sum: 32.75},
        Evening: {std: 10.34, sum: 50.89}
      }
    },
    {
      date: "2025-03-17",
      pnl: -10600,
      pnlPercentage: -2.8,
      walletBalance: 559020,
      accuracyPercentage: 33.0,
      Strategy: "HA_SUM_5Min",
      volatility: {
        Morning: {std: 7.23, sum: 38.45},
        Afternoon: {std: 5.89, sum: 30.12},
        Evening: {std: 9.67, sum: 48.21}
      }
    },
    {
      date: "2025-03-18",
      pnl: 32960,
      pnlPercentage: 9.2,
      walletBalance: 590640,
      accuracyPercentage: 77.0,
      Strategy: "HA_SUM_5Min",
      volatility: {
        Morning: {std: 9.12, sum: 47.89},
        Afternoon: {std: 6.45, sum: 33.67},
        Evening: {std: 11.23, sum: 53.45}
      }
    }
  ]
};

// Fetch user PNL data
const fetchUserPNL = async (): Promise<UserPNLResponse> => {
  try {
    const currentMachine = getCurrentMachine();
    const response = await apiClient.get(`/get_user_pnl?username=${currentMachine.username}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user PNL:", error);
    throw error;
  }
};

const UserAccount = () => {
  // Query for user PNL data
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

  // Get data to display (use fallback if needed)
  const displayData = pnlError ? fallbackPNLData : userPNLData || fallbackPNLData;

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <HomeLayout
      title="User Account & Wallet Details"
      action={
        <Button 
          onClick={() => { 
            toast.info("Refreshing account data..."); 
            refetchPNL(); 
          }}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
      }
    >
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Current Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingPNL ? (
                <Skeleton className="h-8 w-3/4" />
              ) : pnlError && !displayData ? (
                <Alert variant="destructive" className="mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to load account data
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="text-3xl font-bold">
                  {formatCurrency(displayData.daily_pnl[displayData.daily_pnl.length - 1].walletBalance)}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-primary" />
                Latest PNL
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingPNL ? (
                <Skeleton className="h-8 w-3/4" />
              ) : pnlError && !displayData ? (
                <Alert variant="destructive" className="mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to load account data
                  </AlertDescription>
                </Alert>
              ) : (
                <div className={`text-3xl font-bold ${
                  displayData.daily_pnl[displayData.daily_pnl.length - 1].pnl >= 0 
                    ? "text-green-600" 
                    : "text-red-600"
                }`}>
                  {formatCurrency(displayData.daily_pnl[displayData.daily_pnl.length - 1].pnl)}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-primary" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingPNL ? (
                <Skeleton className="h-8 w-3/4" />
              ) : pnlError && !displayData ? (
                <Alert variant="destructive" className="mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to load account data
                  </AlertDescription>
                </Alert>
              ) : (
                <div className={`text-3xl font-bold ${
                  displayData.daily_pnl[displayData.daily_pnl.length - 1].pnlPercentage >= 0 
                    ? "text-green-600" 
                    : "text-red-600"
                }`}>
                  {`${displayData.daily_pnl[displayData.daily_pnl.length - 1].pnlPercentage > 0 ? "+" : ""}${displayData.daily_pnl[displayData.daily_pnl.length - 1].pnlPercentage}%`}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Strategy
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingPNL ? (
                <Skeleton className="h-8 w-3/4" />
              ) : pnlError && !displayData ? (
                <Alert variant="destructive" className="mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to load account data
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="text-3xl font-bold">
                  {displayData.daily_pnl[displayData.daily_pnl.length - 1].Strategy || "N/A"}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Volatility Card */}
        <Card className="shadow-md mb-8">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <LineChart className="h-5 w-5 text-primary" />
              Daily Volatility
            </CardTitle>
            <CardDescription>
              Market volatility breakdown by time of day
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingPNL ? (
              <div className="space-y-2">
                <Skeleton className="h-20 w-full" />
              </div>
            ) : pnlError && !displayData ? (
              <Alert variant="destructive" className="mb-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load volatility data
                </AlertDescription>
              </Alert>
            ) : displayData.daily_pnl[displayData.daily_pnl.length - 1].volatility ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(displayData.daily_pnl[displayData.daily_pnl.length - 1].volatility || {}).map(([period, data]) => (
                  <Card key={period} className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{period}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Standard Deviation</p>
                          <p className="text-2xl font-semibold">{data.std.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Movement</p>
                          <p className="text-2xl font-semibold">{data.sum.toFixed(2)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No volatility data available</p>
            )}
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">PNL History</CardTitle>
            <CardDescription>
              Track your daily profit and loss performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pnlError && !displayData ? (
              <Alert variant="destructive" className="mb-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load account data. Server may be unavailable.
                </AlertDescription>
              </Alert>
            ) : isLoadingPNL ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <div className="overflow-hidden rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>P&L</TableHead>
                      <TableHead>Change (%)</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Accuracy (%)</TableHead>
                      <TableHead>Strategy</TableHead>
                      <TableHead>Volatility (Std/Sum)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayData.daily_pnl.slice().reverse().map((day) => (
                      <TableRow key={day.date}>
                        <TableCell className="font-medium">{day.date}</TableCell>
                        <TableCell className={day.pnl >= 0 ? "text-green-600" : "text-red-600"}>
                          {formatCurrency(day.pnl)}
                        </TableCell>
                        <TableCell className={day.pnlPercentage >= 0 ? "text-green-600" : "text-red-600"}>
                          {day.pnlPercentage > 0 ? "+" : ""}{day.pnlPercentage}%
                        </TableCell>
                        <TableCell>{formatCurrency(day.walletBalance)}</TableCell>
                        <TableCell>{day.accuracyPercentage?.toFixed(1) || "N/A"}%</TableCell>
                        <TableCell>{day.Strategy || "N/A"}</TableCell>
                        <TableCell>
                          {day.volatility ? (
                            `M: ${day.volatility.Morning.std.toFixed(2)}/${day.volatility.Morning.sum.toFixed(2)} | 
                             A: ${day.volatility.Afternoon.std.toFixed(2)}/${day.volatility.Afternoon.sum.toFixed(2)} | 
                             E: ${day.volatility.Evening.std.toFixed(2)}/${day.volatility.Evening.sum.toFixed(2)}`
                          ) : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </HomeLayout>
  );
};

export default UserAccount;
