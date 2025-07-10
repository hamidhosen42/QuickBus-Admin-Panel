
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Bus, 
  Ticket, 
  DollarSign,
  RefreshCw,
  Calendar,
  MapPin,
  Clock
} from 'lucide-react';

const Dashboard = () => {
  // Mock data - replace with actual API calls
  const stats = [
    {
      title: 'Today\'s Sales',
      value: '₹45,230',
      change: '+12%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Tickets Sold',
      value: '248',
      change: '+8%',
      trend: 'up',
      icon: Ticket,
      color: 'text-blue-600'
    },
    {
      title: 'Active Routes',
      value: '12',
      change: '0%',
      trend: 'neutral',
      icon: MapPin,
      color: 'text-orange-600'
    },
    {
      title: 'Buses Running',
      value: '8',
      change: '-1',
      trend: 'down',
      icon: Bus,
      color: 'text-purple-600'
    }
  ];

  const recentTickets = [
    { id: 'T001', route: 'City Centre → Airport', passenger: 'John Doe', time: '10:30 AM', status: 'confirmed' },
    { id: 'T002', route: 'Downtown → Mall', passenger: 'Sarah Wilson', time: '10:25 AM', status: 'confirmed' },
    { id: 'T003', route: 'Station → University', passenger: 'Mike Johnson', time: '10:20 AM', status: 'pending' },
    { id: 'T004', route: 'Airport → City Centre', passenger: 'Emma Davis', time: '10:15 AM', status: 'confirmed' },
  ];

  const activeBuses = [
    { id: 'B001', route: 'City Centre → Airport', driver: 'David Smith', status: 'on-route', occupancy: 75 },
    { id: 'B002', route: 'Downtown → Mall', driver: 'Lisa Brown', status: 'on-route', occupancy: 60 },
    { id: 'B003', route: 'Station → University', driver: 'James Wilson', status: 'boarding', occupancy: 40 },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                {stat.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-600 mr-1" />}
                {stat.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-600 mr-1" />}
                <span className={
                  stat.trend === 'up' ? 'text-green-600' : 
                  stat.trend === 'down' ? 'text-red-600' : 'text-gray-500'
                }>
                  {stat.change} from yesterday
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tickets */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Tickets</CardTitle>
                <CardDescription>Latest bookings from counters</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{ticket.id}</span>
                      <Badge variant={ticket.status === 'confirmed' ? 'default' : 'secondary'}>
                        {ticket.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{ticket.route}</p>
                    <p className="text-xs text-gray-500">{ticket.passenger}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {ticket.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Buses */}
        <Card>
          <CardHeader>
            <CardTitle>Active Buses</CardTitle>
            <CardDescription>Real-time bus status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeBuses.map((bus) => (
                <div key={bus.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{bus.id}</span>
                      <Badge variant={bus.status === 'on-route' ? 'default' : 'secondary'}>
                        {bus.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{bus.route}</p>
                    <p className="text-xs text-gray-500">Driver: {bus.driver}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{bus.occupancy}%</div>
                    <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-24 flex flex-col gap-2">
              <MapPin className="h-6 w-6" />
              <span>Add New Route</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2">
              <Bus className="h-6 w-6" />
              <span>Register Bus</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2">
              <Calendar className="h-6 w-6" />
              <span>Generate Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
