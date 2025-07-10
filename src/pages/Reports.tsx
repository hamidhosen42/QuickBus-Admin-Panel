
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Download, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Bus,
  MapPin,
  Clock,
  CreditCard,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

const Reports = () => {
  const [reportType, setReportType] = useState('daily');
  const [dateRange, setDateRange] = useState('today');

  // Mock data - replace with actual API calls
  const dailyStats = {
    totalRevenue: 45230,
    totalTickets: 248,
    averageOccupancy: 78,
    activeBuses: 8,
    cashRevenue: 25430,
    digitalRevenue: 19800,
    peakHour: '9:00 AM - 10:00 AM',
    topRoute: 'City Centre → Airport'
  };

  const routePerformance = [
    { route: 'City Centre → Airport', tickets: 89, revenue: 13350, occupancy: 85 },
    { route: 'Downtown → Mall', tickets: 67, revenue: 5360, occupancy: 72 },
    { route: 'Station → University', tickets: 54, revenue: 5400, occupancy: 68 },
    { route: 'Airport → City Centre', tickets: 38, revenue: 5700, occupancy: 60 }
  ];

  const busPerformance = [
    { bus: 'KL-01-A-1234', trips: 12, revenue: 1800, occupancy: 82 },
    { bus: 'KL-01-B-5678', trips: 10, revenue: 1200, occupancy: 75 },
    { bus: 'KL-01-C-9012', trips: 8, revenue: 800, occupancy: 65 }
  ];

  const operatorStats = [
    { operator: 'OP001', tickets: 89, revenue: 13350, efficiency: 95 },
    { operator: 'OP002', tickets: 67, revenue: 10240, efficiency: 88 },
    { operator: 'OP003', tickets: 54, revenue: 8640, efficiency: 92 }
  ];

  const handleExport = (format: 'pdf' | 'csv') => {
    toast.success(`Exporting ${reportType} report as ${format.toUpperCase()}...`);
  };

  const handleGenerateReport = () => {
    toast.success('Generating detailed report...');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Reports & Analytics</h2>
          <p className="text-gray-600">Comprehensive insights into your bus operations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('csv')}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => handleExport('pdf')}>
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Report Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
          <CardDescription>Select report type and date range</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily Report</SelectItem>
                  <SelectItem value="weekly">Weekly Report</SelectItem>
                  <SelectItem value="monthly">Monthly Report</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="last7days">Last 7 Days</SelectItem>
                  <SelectItem value="last30days">Last 30 Days</SelectItem>
                  <SelectItem value="thisMonth">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleGenerateReport} className="w-full">
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">₹{dailyStats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tickets Sold</p>
                <p className="text-2xl font-bold text-blue-600">{dailyStats.totalTickets}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Occupancy</p>
                <p className="text-2xl font-bold text-orange-600">{dailyStats.averageOccupancy}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Buses</p>
                <p className="text-2xl font-bold text-purple-600">{dailyStats.activeBuses}</p>
              </div>
              <Bus className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium">Cash Payments</p>
                  <p className="text-sm text-gray-600">56% of total revenue</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">₹{dailyStats.cashRevenue.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium">Digital Payments</p>
                  <p className="text-sm text-gray-600">44% of total revenue</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">₹{dailyStats.digitalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Peak Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-orange-50 rounded-lg">
                <p className="font-medium">Peak Hour</p>
                <p className="text-lg font-bold text-orange-600">{dailyStats.peakHour}</p>
                <p className="text-sm text-gray-600">Highest booking activity</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="font-medium">Top Performing Route</p>
                <p className="text-lg font-bold text-purple-600">{dailyStats.topRoute}</p>
                <p className="text-sm text-gray-600">Highest revenue generator</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Route Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Route Performance
          </CardTitle>
          <CardDescription>Revenue and occupancy by route</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Route</th>
                  <th className="text-left p-3">Tickets</th>
                  <th className="text-left p-3">Revenue</th>
                  <th className="text-left p-3">Occupancy</th>
                  <th className="text-left p-3">Performance</th>
                </tr>
              </thead>
              <tbody>
                {routePerformance.map((route, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{route.route}</td>
                    <td className="p-3">{route.tickets}</td>
                    <td className="p-3 font-bold text-green-600">₹{route.revenue.toLocaleString()}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${route.occupancy}%` }}
                          />
                        </div>
                        <span className="text-sm">{route.occupancy}%</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant={route.occupancy > 80 ? 'default' : route.occupancy > 60 ? 'secondary' : 'outline'}>
                        {route.occupancy > 80 ? 'Excellent' : route.occupancy > 60 ? 'Good' : 'Average'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Operator Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Operator Performance</CardTitle>
            <CardDescription>Individual operator statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {operatorStats.map((operator, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{operator.operator}</p>
                    <p className="text-sm text-gray-600">{operator.tickets} tickets • ₹{operator.revenue.toLocaleString()}</p>
                  </div>
                  <Badge variant={operator.efficiency > 90 ? 'default' : 'secondary'}>
                    {operator.efficiency}% Efficiency
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bus Utilization</CardTitle>
            <CardDescription>Fleet performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {busPerformance.map((bus, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{bus.bus}</p>
                    <p className="text-sm text-gray-600">{bus.trips} trips • ₹{bus.revenue.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{bus.occupancy}%</p>
                    <div className="w-12 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${bus.occupancy}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
