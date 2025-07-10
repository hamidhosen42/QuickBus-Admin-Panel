
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Download, Eye, RefreshCw, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface Ticket {
  id: string;
  passengerName: string;
  route: string;
  busNumber: string;
  seatNumber: string;
  bookingTime: string;
  travelDate: string;
  fare: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'used';
  paymentMethod: 'cash' | 'digital';
  operatorId: string;
  qrCode: string;
}

const TicketMonitor = () => {
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 'T001',
      passengerName: 'John Doe',
      route: 'City Centre → Airport',
      busNumber: 'KL-01-A-1234',
      seatNumber: 'A12',
      bookingTime: '2024-01-20 10:30',
      travelDate: '2024-01-20',
      fare: 150,
      status: 'confirmed',
      paymentMethod: 'digital',
      operatorId: 'OP001',
      qrCode: 'QR001'
    },
    {
      id: 'T002',
      passengerName: 'Sarah Wilson',
      route: 'Downtown → Mall',
      busNumber: 'KL-01-B-5678',
      seatNumber: 'B05',
      bookingTime: '2024-01-20 10:25',
      travelDate: '2024-01-20',
      fare: 80,
      status: 'confirmed',
      paymentMethod: 'cash',
      operatorId: 'OP002',
      qrCode: 'QR002'
    },
    {
      id: 'T003',
      passengerName: 'Mike Johnson',
      route: 'Station → University',
      busNumber: 'KL-01-C-9012',
      seatNumber: 'C18',
      bookingTime: '2024-01-20 10:20',
      travelDate: '2024-01-20',
      fare: 100,
      status: 'pending',
      paymentMethod: 'cash',
      operatorId: 'OP001',
      qrCode: 'QR003'
    },
    {
      id: 'T004',
      passengerName: 'Emma Davis',
      route: 'Airport → City Centre',
      busNumber: 'KL-01-A-1234',
      seatNumber: 'A15',
      bookingTime: '2024-01-20 10:15',
      travelDate: '2024-01-20',
      fare: 150,
      status: 'used',
      paymentMethod: 'digital',
      operatorId: 'OP003',
      qrCode: 'QR004'
    },
    {
      id: 'T005',
      passengerName: 'Robert Brown',
      route: 'Mall → Downtown',
      busNumber: 'KL-01-B-5678',
      seatNumber: 'B22',
      bookingTime: '2024-01-20 09:45',
      travelDate: '2024-01-20',
      fare: 80,
      status: 'cancelled',
      paymentMethod: 'cash',
      operatorId: 'OP002',
      qrCode: 'QR005'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.passengerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.busNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || ticket.paymentMethod === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      case 'used': return 'outline';
      default: return 'secondary';
    }
  };

  const handleExport = () => {
    toast.success('Exporting tickets to CSV...');
  };

  const handleRefresh = () => {
    toast.success('Tickets refreshed');
  };

  const handleViewTicket = (ticketId: string) => {
    toast.info(`Viewing details for ticket ${ticketId}`);
  };

  const totalTickets = filteredTickets.length;
  const totalRevenue = filteredTickets
    .filter(t => t.status === 'confirmed' || t.status === 'used')
    .reduce((sum, t) => sum + t.fare, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Ticket Monitor</h2>
          <p className="text-gray-600">Track and manage all ticket bookings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{totalTickets}</p>
              <p className="text-sm text-gray-600">Total Tickets</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">₹{totalRevenue}</p>
              <p className="text-sm text-gray-600">Revenue</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {filteredTickets.filter(t => t.status === 'confirmed').length}
              </p>
              <p className="text-sm text-gray-600">Confirmed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {filteredTickets.filter(t => t.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="used">Used</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="digital">Digital</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setPaymentFilter('all');
            }}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tickets ({filteredTickets.length})</CardTitle>
          <CardDescription>
            All ticket bookings from various counters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Ticket ID</th>
                  <th className="text-left p-2">Passenger</th>
                  <th className="text-left p-2">Route</th>
                  <th className="text-left p-2">Bus & Seat</th>
                  <th className="text-left p-2">Date & Time</th>
                  <th className="text-left p-2">Fare</th>
                  <th className="text-left p-2">Payment</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{ticket.id}</td>
                    <td className="p-2">{ticket.passengerName}</td>
                    <td className="p-2">
                      <div className="text-sm">{ticket.route}</div>
                    </td>
                    <td className="p-2">
                      <div className="text-sm">
                        <div>{ticket.busNumber}</div>
                        <div className="text-gray-500">Seat {ticket.seatNumber}</div>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {ticket.travelDate}
                        </div>
                        <div className="text-gray-500">{ticket.bookingTime.split(' ')[1]}</div>
                      </div>
                    </td>
                    <td className="p-2 font-medium">₹{ticket.fare}</td>
                    <td className="p-2">
                      <Badge variant={ticket.paymentMethod === 'digital' ? 'default' : 'secondary'}>
                        {ticket.paymentMethod}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Badge variant={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewTicket(ticket.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketMonitor;
