
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

const BusManagement = () => {
  const [buses, setBuses] = useState<BusInfo[]>([
    {
      id: 'B001',
      number: 'KL-01-A-1234',
      model: 'Tata Ultra',
      capacity: 45,
      driver: 'David Smith',
      conductor: 'Mark Johnson',
      route: 'City Centre → Airport',
      status: 'active',
      lastMaintenance: '2024-01-15',
      seatLayout: '2x2'
    },
    {
      id: 'B002',
      number: 'KL-01-B-5678',
      model: 'Ashok Leyland',
      capacity: 52,
      driver: 'Lisa Brown',
      conductor: 'Sarah Wilson',
      route: 'Downtown → Mall',
      status: 'active',
      lastMaintenance: '2024-01-10',
      seatLayout: '2x3'
    },
    {
      id: 'B003',
      number: 'KL-01-C-9012',
      model: 'Mahindra Cruzio',
      capacity: 35,
      driver: 'James Wilson',
      conductor: 'Emma Davis',
      route: 'Station → University',
      status: 'maintenance',
      lastMaintenance: '2024-01-05',
      seatLayout: '2x2'
    }
  ]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.number || !formData.model || !formData.capacity || !formData.driver) {
      toast.error('Please fill in all required fields');
      return;
    }

    const busData: BusInfo = {
      id: editingBus?.id || `B${String(buses.length + 1).padStart(3, '0')}`,
      number: formData.number,
      model: formData.model,
      capacity: Number(formData.capacity),
      driver: formData.driver,
      conductor: formData.conductor,
      route: formData.route,
      status: formData.status,
      lastMaintenance: editingBus?.lastMaintenance || new Date().toISOString().split('T')[0],
      seatLayout: formData.seatLayout
    };

    if (editingBus) {
      setBuses(prev => prev.map(bus => bus.id === editingBus.id ? busData : bus));
      toast.success('Bus updated successfully');
    } else {
      setBuses(prev => [...prev, busData]);
      toast.success('Bus added successfully');
    }

    resetForm();
    setIsDialogOpen(false);
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

  const handleDelete = (busId: string) => {
    setBuses(prev => prev.filter(bus => bus.id !== busId));
    toast.success('Bus removed successfully');
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
