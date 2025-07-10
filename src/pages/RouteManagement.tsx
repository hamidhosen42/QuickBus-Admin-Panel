import { useState, useEffect } from 'react';
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

const baseUrl = import.meta.env.VITE_API_BASE_URL; // Fallback URL

const RouteManagement = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
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

  // Fetch routes from API
  const fetchRoutes = async () => {
    if (!baseUrl) {
      toast.error('API base URL is not configured');
      return;
    }

    const token = localStorage.getItem('quickbus_token');
    if (!token) {
      toast.error('Authentication token is missing. Please log in.');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/route`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (response.ok && result.statusCode === 200 && result.status === 'SUCCESS') {
        const fetchedRoutes: Route[] = result.data.map((route: any) => ({
          id: route.id,
          name: route.name,
          from: route.from_location,
          to: route.to_location,
          distance: route.distance_km,
          duration: `${route.duration_minutes} mins`, 
          fare: route.fare,
          stops: route.stops,
          status: route.status
        }));
        setRoutes(fetchedRoutes);
      } else {
        toast.error(result.message || result.detail || 'Failed to fetch route list');
      }
    } catch (error) {
      console.error('Error fetching routes:', error);
      toast.error('An error occurred while fetching the route list');
    }
  };

  // Fetch routes on component mount
  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.from || !formData.to || !formData.fare) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!baseUrl) {
      toast.error('API base URL is not configured');
      return;
    }

    const token = localStorage.getItem('quickbus_token');
    if (!token) {
      toast.error('Authentication token is missing. Please log in.');
      return;
    }

    const durationMinutes = parseInt(formData.duration) || 0; // Convert duration to number (e.g., "45 mins" -> 45)

    const payload = {
      name: formData.name,
      from_location: formData.from,
      to_location: formData.to,
      distance_km: Number(formData.distance) || 0,
      duration_minutes: durationMinutes,
      fare: Number(formData.fare),
      stops: formData.stops.split(',').map(stop => stop.trim()).filter(Boolean),
      status: formData.status
    };

    try {
      const url = editingRoute ? `${baseUrl}/route/${editingRoute.id}` : `${baseUrl}/route`;
      const method = editingRoute ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.statusCode === 200 && result.status === 'SUCCESS') {
        const routeData: Route = {
          id: editingRoute?.id || result.data.id,
          name: result.data.name || formData.name,
          from: result.data.from_location || formData.from,
          to: result.data.to_location || formData.to,
          distance: result.data.distance_km || Number(formData.distance) || 0,
          duration: `${result.data.duration_minutes || durationMinutes} mins`,
          fare: result.data.fare || Number(formData.fare),
          stops: result.data.stops || payload.stops,
          status: result.data.status || formData.status
        };

        // Refetch routes to ensure UI reflects backend state
        await fetchRoutes();

        toast.success(editingRoute ? 'Route updated successfully' : 'Route added successfully');
        resetForm();
        setIsDialogOpen(false);
      } else {
        toast.error(result.message || result.detail || `Failed to ${editingRoute ? 'update' : 'add'} route`);
      }
    } catch (error) {
      console.error(`Error ${editingRoute ? 'updating' : 'adding'} route:`, error);
      toast.error(`An error occurred while ${editingRoute ? 'updating' : 'adding'} the route`);
    }
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

  const handleDelete = async (routeId: string) => {
    if (!baseUrl) {
      toast.error('API base URL is not configured');
      return;
    }

    const token = localStorage.getItem('quickbus_token');
    if (!token) {
      toast.error('Authentication token is missing. Please log in.');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/route/${routeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (response.ok && result.statusCode === 200 && result.status === 'SUCCESS') {
        // Refetch routes to ensure UI reflects backend state
        await fetchRoutes();
        toast.success('Route deleted successfully');
      } else {
        toast.error(result.message || result.detail || 'Failed to delete route');
      }
    } catch (error) {
      console.error('Error deleting route:', error);
      toast.error('An error occurred while deleting the route');
    }
  };

  const toggleStatus = async (routeId: string) => {
    if (!baseUrl) {
      toast.error('API base URL is not configured');
      return;
    }

    const token = localStorage.getItem('quickbus_token');
    if (!token) {
      toast.error('Authentication token is missing. Please log in.');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/route/${routeId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (response.ok && result.statusCode === 200 && result.status === 'SUCCESS') {
        // Refetch routes to ensure UI reflects backend state
        await fetchRoutes();
        toast.success('Route status updated');
      } else {
        toast.error(result.message || result.detail || 'Failed to update route status');
      }
    } catch (error) {
      console.error('Error updating route status:', error);
      toast.error('An error occurred while updating the route status');
    }
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