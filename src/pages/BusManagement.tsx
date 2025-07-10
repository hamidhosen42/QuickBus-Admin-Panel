import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit2, Trash2, Bus, Users, Settings, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface BusInfo {
  id: string;
  number: string;
  model: string;
  capacity: number;
  driver: string;
  conductor: string;
  route: string;
  status: 'active' | 'maintenance' | 'inactive';
  lastMaintenance: string;
  seatLayout: string;
}

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const BusManagement = () => {
  const [buses, setBuses] = useState<BusInfo[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBus, setEditingBus] = useState<BusInfo | null>(null);
  const [formData, setFormData] = useState({
    number: '',
    model: '',
    capacity: '',
    driver: '',
    conductor: '',
    route: '',
    status: 'active' as 'active' | 'maintenance' | 'inactive',
    seatLayout: '2x2'
  });

  // Fetch bus list
  const fetchBuses = async () => {
    if (!baseUrl) {
      toast.error('API base URL is not configured');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/bus`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers if required, e.g., Authorization: Bearer <token>
        }
      });

      const result = await response.json();

      if (response.ok && result.statusCode === 200 && result.status === 'SUCCESS') {
        const fetchedBuses: BusInfo[] = result.data.map((bus: any) => ({
          id: bus._id,
          number: bus.bus_number,
          model: bus.model,
          capacity: bus.capacity,
          driver: bus.driver_name,
          conductor: bus.conductor_name,
          route: bus.assigned_route,
          status: bus.status,
          lastMaintenance: new Date().toISOString().split('T')[0], // Default to current date
          seatLayout: bus.seat_layout
        }));
        setBuses(fetchedBuses);
        toast.success('Bus list fetched successfully');
      } else {
        toast.error(result.message || 'Failed to fetch bus list');
      }
    } catch (error) {
      console.error('Error fetching buses:', error);
      toast.error('An error occurred while fetching the bus list');
    }
  };

  // Fetch buses on component mount
  useEffect(() => {
    fetchBuses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.number || !formData.model || !formData.capacity || !formData.driver) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!baseUrl) {
      toast.error('API base URL is not configured');
      return;
    }

    const payload = {
      bus_number: formData.number,
      model: formData.model,
      capacity: Number(formData.capacity),
      seat_layout: formData.seatLayout,
      driver_name: formData.driver,
      conductor_name: formData.conductor,
      assigned_route: formData.route,
      status: formData.status
    };

    try {
      const url = editingBus ? `${baseUrl}/bus/${editingBus.id}` : `${baseUrl}/bus`;
      const method = editingBus ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers if required, e.g., Authorization: Bearer <token>
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.statusCode === 200 && result.status === 'SUCCESS') {
        const busData: BusInfo = {
          id: editingBus?.id || result.data._id || `B${String(buses.length + 1).padStart(3, '0')}`,
          number: result.data?.bus_number || formData.number,
          model: result.data?.model || formData.model,
          capacity: result.data?.capacity || Number(formData.capacity),
          driver: result.data?.driver_name || formData.driver,
          conductor: result.data?.conductor_name || formData.conductor,
          route: result.data?.assigned_route || formData.route,
          status: result.data?.status || formData.status,
          lastMaintenance: editingBus?.lastMaintenance || new Date().toISOString().split('T')[0],
          seatLayout: result.data?.seat_layout || formData.seatLayout
        };

        // Refetch buses to ensure UI reflects backend state
        await fetchBuses();

        toast.success(editingBus ? 'Bus updated successfully' : 'Bus added successfully');
        resetForm();
        setIsDialogOpen(false);
      } else {
        // Handle non-200 responses, e.g., 404
        toast.error(result.detail || result.message || `Failed to ${editingBus ? 'update' : 'add'} bus`);
      }
    } catch (error) {
      console.error(`Error ${editingBus ? 'updating' : 'adding'} bus:`, error);
      toast.error('An error occurred while adding or updating the bus. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      number: '',
      model: '',
      capacity: '',
      driver: '',
      conductor: '',
      route: '',
      status: 'active',
      seatLayout: '2x2'
    });
    setEditingBus(null);
  };

  const handleEdit = (bus: BusInfo) => {
    setEditingBus(bus);
    setFormData({
      number: bus.number,
      model: bus.model,
      capacity: bus.capacity.toString(),
      driver: bus.driver,
      conductor: bus.conductor,
      route: bus.route,
      status: bus.status,
      seatLayout: bus.seatLayout
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (busId: string) => {
    if (!baseUrl) {
      toast.error('API base URL is not configured');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/bus/${busId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers if required, e.g., Authorization: Bearer <token>
        }
      });

      const result = await response.json();

      if (response.ok && result.statusCode === 200 && result.status === 'SUCCESS') {
        // Refetch buses to ensure UI reflects backend state
        await fetchBuses();
        toast.success('Bus deleted successfully');
      } else {
        toast.error(result.detail || result.message || 'Failed to delete bus');
      }
    } catch (error) {
      console.error('Error deleting bus:', error);
      toast.error('An error occurred while deleting the bus');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'maintenance': return 'destructive';
      case 'inactive': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Bus className="h-4 w-4" />;
      case 'maintenance': return <Settings className="h-4 w-4" />;
      case 'inactive': return <Bus className="h-4 w-4 opacity-50" />;
      default: return <Bus className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Bus Management</h2>
          <p className="text-gray-600">Manage your fleet and assign routes</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Bus
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingBus ? 'Edit Bus' : 'Add New Bus'}</DialogTitle>
              <DialogDescription>
                {editingBus ? 'Update bus information' : 'Register a new bus in your fleet'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="number">Bus Number *</Label>
                  <Input
                    id="number"
                    value={formData.number}
                    onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                    placeholder="KL-01-A-1234"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="model">Bus Model *</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                    placeholder="Tata Ultra"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="capacity">Capacity *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                    placeholder="45"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="seatLayout">Seat Layout</Label>
                  <Select value={formData.seatLayout} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, seatLayout: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2x2">2x2 (Premium)</SelectItem>
                      <SelectItem value="2x3">2x3 (Standard)</SelectItem>
                      <SelectItem value="3x3">3x3 (Economy)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="driver">Driver Name *</Label>
                  <Input
                    id="driver"
                    value={formData.driver}
                    onChange={(e) => setFormData(prev => ({ ...prev, driver: e.target.value }))}
                    placeholder="David Smith"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="conductor">Conductor Name</Label>
                  <Input
                    id="conductor"
                    value={formData.conductor}
                    onChange={(e) => setFormData(prev => ({ ...prev, conductor: e.target.value }))}
                    placeholder="Mark Johnson"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="route">Assigned Route</Label>
                  <Input
                    id="route"
                    value={formData.route}
                    onChange={(e) => setFormData(prev => ({ ...prev, route: e.target.value }))}
                    placeholder="City Centre → Airport"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: 'active' | 'maintenance' | 'inactive') => 
                    setFormData(prev => ({ ...prev, status: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingBus ? 'Update Bus' : 'Add Bus'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {buses.map((bus) => (
          <Card key={bus.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon(bus.status)}
                    {bus.number}
                    <Badge variant={getStatusColor(bus.status)}>
                      {bus.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {bus.model} • Bus ID: {bus.id}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(bus)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(bus.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{bus.capacity} Seats</p>
                    <p className="text-xs text-gray-500">{bus.seatLayout} Layout</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{bus.route || 'Not Assigned'}</p>
                    <p className="text-xs text-gray-500">Current Route</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Driver: {bus.driver}</p>
                  <p className="text-xs text-gray-500">
                    {bus.conductor ? `Conductor: ${bus.conductor}` : 'No conductor assigned'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Last Maintenance</p>
                  <p className="text-xs text-gray-500">{bus.lastMaintenance}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BusManagement;