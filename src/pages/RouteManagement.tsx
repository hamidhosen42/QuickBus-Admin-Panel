
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit2, Trash2, MapPin, Clock, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface Route {
  id: string;
  name: string;
  from: string;
  to: string;
  distance: number;
  duration: string;
  fare: number;
  stops: string[];
  status: 'active' | 'inactive';
}

const RouteManagement = () => {
  const [routes, setRoutes] = useState<Route[]>([
    {
      id: 'R001',
      name: 'City Centre Express',
      from: 'City Centre',
      to: 'Airport',
      distance: 25,
      duration: '45 mins',
      fare: 150,
      stops: ['Central Mall', 'Tech Park', 'Hospital', 'Airport'],
      status: 'active'
    },
    {
      id: 'R002',
      name: 'Downtown Loop',
      from: 'Downtown',
      to: 'Mall',
      distance: 12,
      duration: '25 mins',
      fare: 80,
      stops: ['Bank Street', 'University', 'Mall'],
      status: 'active'
    },
    {
      id: 'R003',
      name: 'Suburban Connect',
      from: 'Station',
      to: 'University',
      distance: 18,
      duration: '35 mins',
      fare: 100,
      stops: ['Residential Complex', 'Market', 'University'],
      status: 'inactive'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    from: '',
    to: '',
    distance: '',
    duration: '',
    fare: '',
    stops: '',
    status: 'active' as 'active' | 'inactive'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.from || !formData.to || !formData.fare) {
      toast.error('Please fill in all required fields');
      return;
    }

    const routeData: Route = {
      id: editingRoute?.id || `R${String(routes.length + 1).padStart(3, '0')}`,
      name: formData.name,
      from: formData.from,
      to: formData.to,
      distance: Number(formData.distance) || 0,
      duration: formData.duration,
      fare: Number(formData.fare),
      stops: formData.stops.split(',').map(stop => stop.trim()).filter(Boolean),
      status: formData.status
    };

    if (editingRoute) {
      setRoutes(prev => prev.map(route => route.id === editingRoute.id ? routeData : route));
      toast.success('Route updated successfully');
    } else {
      setRoutes(prev => [...prev, routeData]);
      toast.success('Route added successfully');
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      from: '',
      to: '',
      distance: '',
      duration: '',
      fare: '',
      stops: '',
      status: 'active'
    });
    setEditingRoute(null);
  };

  const handleEdit = (route: Route) => {
    setEditingRoute(route);
    setFormData({
      name: route.name,
      from: route.from,
      to: route.to,
      distance: route.distance.toString(),
      duration: route.duration,
      fare: route.fare.toString(),
      stops: route.stops.join(', '),
      status: route.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (routeId: string) => {
    setRoutes(prev => prev.filter(route => route.id !== routeId));
    toast.success('Route deleted successfully');
  };

  const toggleStatus = (routeId: string) => {
    setRoutes(prev => prev.map(route => 
      route.id === routeId 
        ? { ...route, status: route.status === 'active' ? 'inactive' : 'active' }
        : route
    ));
    toast.success('Route status updated');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Route Management</h2>
          <p className="text-gray-600">Manage your bus routes and schedules</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Route
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingRoute ? 'Edit Route' : 'Add New Route'}</DialogTitle>
              <DialogDescription>
                {editingRoute ? 'Update route information' : 'Create a new bus route'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Route Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., City Centre Express"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => 
                    setFormData(prev => ({ ...prev, status: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="from">From *</Label>
                  <Input
                    id="from"
                    value={formData.from}
                    onChange={(e) => setFormData(prev => ({ ...prev, from: e.target.value }))}
                    placeholder="Starting point"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="to">To *</Label>
                  <Input
                    id="to"
                    value={formData.to}
                    onChange={(e) => setFormData(prev => ({ ...prev, to: e.target.value }))}
                    placeholder="Destination"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="distance">Distance (km)</Label>
                  <Input
                    id="distance"
                    type="number"
                    value={formData.distance}
                    onChange={(e) => setFormData(prev => ({ ...prev, distance: e.target.value }))}
                    placeholder="25"
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="45 mins"
                  />
                </div>
                <div>
                  <Label htmlFor="fare">Fare (₹) *</Label>
                  <Input
                    id="fare"
                    type="number"
                    value={formData.fare}
                    onChange={(e) => setFormData(prev => ({ ...prev, fare: e.target.value }))}
                    placeholder="150"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="stops">Stops (comma-separated)</Label>
                <Textarea
                  id="stops"
                  value={formData.stops}
                  onChange={(e) => setFormData(prev => ({ ...prev, stops: e.target.value }))}
                  placeholder="Central Mall, Tech Park, Hospital, Airport"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingRoute ? 'Update Route' : 'Add Route'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {routes.map((route) => (
          <Card key={route.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {route.name}
                    <Badge variant={route.status === 'active' ? 'default' : 'secondary'}>
                      {route.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Route ID: {route.id}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleStatus(route.id)}
                  >
                    {route.status === 'active' ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(route)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(route.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{route.from} → {route.to}</p>
                    <p className="text-xs text-gray-500">{route.distance} km</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{route.duration}</p>
                    <p className="text-xs text-gray-500">Duration</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">₹{route.fare}</p>
                    <p className="text-xs text-gray-500">Base Fare</p>
                  </div>
                </div>
                <div className="md:col-span-1">
                  <p className="text-sm font-medium mb-1">{route.stops.length} Stops</p>
                  <p className="text-xs text-gray-500">
                    {route.stops.slice(0, 2).join(', ')}
                    {route.stops.length > 2 && ` +${route.stops.length - 2} more`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RouteManagement;
