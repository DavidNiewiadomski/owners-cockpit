import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Truck,
  Package,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  DollarSign,
  FileText,
  Download,
  Plus,
  Filter
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';

interface Delivery {
  id: string;
  material: string;
  supplier: string;
  quantity: string;
  cost: number;
  scheduledDate: string;
  scheduledTime: string;
  status: 'delivered' | 'in-transit' | 'scheduled' | 'delayed';
  location: string;
  poNumber: string;
  trackingNumber?: string;
  notes?: string;
}

const MaterialDelivery: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedWeek, setSelectedWeek] = useState<string>('current');

  // Mock delivery data
  const deliveries: Delivery[] = [
    {
      id: '1',
      material: 'Structural Steel Beams',
      supplier: 'Ironworks Construction LLC',
      quantity: '24 beams (12" x 24")',
      cost: 485000,
      scheduledDate: '2024-12-16',
      scheduledTime: '08:00 AM',
      status: 'scheduled',
      location: 'North Loading Dock',
      poNumber: 'PO-2024-1156',
      trackingNumber: 'TRK-890123',
      notes: 'Crane required for unloading'
    },
    {
      id: '2',
      material: 'Electrical Conduit',
      supplier: 'Metro Electric Supply',
      quantity: '500 linear feet',
      cost: 15000,
      scheduledDate: '2024-12-16',
      scheduledTime: '10:00 AM',
      status: 'in-transit',
      location: 'East Storage Area',
      poNumber: 'PO-2024-1157',
      trackingNumber: 'TRK-890124'
    },
    {
      id: '3',
      material: 'HVAC Ductwork',
      supplier: 'Climate Control Systems',
      quantity: '25 sections',
      cost: 85000,
      scheduledDate: '2024-12-18',
      scheduledTime: '09:00 AM',
      status: 'scheduled',
      location: 'Mechanical Room Floor 10',
      poNumber: 'PO-2024-1158'
    },
    {
      id: '4',
      material: 'Concrete Mix',
      supplier: 'Ready Mix Concrete Co.',
      quantity: '120 cubic yards',
      cost: 18000,
      scheduledDate: '2024-12-15',
      scheduledTime: '07:00 AM',
      status: 'delivered',
      location: 'Foundation Area B',
      poNumber: 'PO-2024-1155',
      notes: 'Delivered successfully'
    },
    {
      id: '5',
      material: 'Plumbing Fixtures',
      supplier: 'ProPlumb Wholesale',
      quantity: '45 units (mixed)',
      cost: 125000,
      scheduledDate: '2024-12-20',
      scheduledTime: '02:00 PM',
      status: 'delayed',
      location: 'Storage Building A',
      poNumber: 'PO-2024-1159',
      notes: 'Supplier backorder - new date pending'
    }
  ];

  // Summary statistics
  const totalDeliveries = deliveries.length;
  const scheduledToday = deliveries.filter(d => d.scheduledDate === '2024-12-16').length;
  const totalValue = deliveries.reduce((sum, d) => sum + d.cost, 0);
  const onTimeRate = Math.round((deliveries.filter(d => d.status !== 'delayed').length / totalDeliveries) * 100);

  // Filter deliveries
  const filteredDeliveries = deliveries.filter(delivery => {
    if (filterStatus === 'all') return true;
    return delivery.status === filterStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'in-transit': return 'bg-blue-100 text-blue-700';
      case 'scheduled': return 'bg-yellow-100 text-yellow-700';
      case 'delayed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'in-transit': return <Truck className="h-4 w-4 text-blue-600" />;
      case 'scheduled': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'delayed': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">
              Material Delivery Schedule
            </h1>
            <p className="text-muted-foreground mt-1">
              Track deliveries, manage logistics, and coordinate material flow
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Schedule
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Delivery
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Today's Deliveries</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{scheduledToday}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Scheduled for arrival
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">${(totalValue / 1000).toFixed(0)}K</div>
              <div className="text-xs text-muted-foreground mt-1">
                Materials in pipeline
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">On-Time Rate</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{onTimeRate}%</div>
              <div className="text-xs text-muted-foreground mt-1">
                Delivery performance
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Suppliers</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">5</div>
              <div className="text-xs text-muted-foreground mt-1">
                Vendors this week
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('all')}
                  size="sm"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  All Status
                </Button>
                <Button
                  variant={filterStatus === 'scheduled' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('scheduled')}
                  size="sm"
                >
                  Scheduled
                </Button>
                <Button
                  variant={filterStatus === 'in-transit' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('in-transit')}
                  size="sm"
                >
                  In Transit
                </Button>
                <Button
                  variant={filterStatus === 'delivered' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('delivered')}
                  size="sm"
                >
                  Delivered
                </Button>
                <Button
                  variant={filterStatus === 'delayed' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('delayed')}
                  size="sm"
                >
                  Delayed
                </Button>
              </div>
              <div className="flex gap-2 ml-auto">
                <Button
                  variant={selectedWeek === 'current' ? 'default' : 'outline'}
                  onClick={() => setSelectedWeek('current')}
                  size="sm"
                >
                  This Week
                </Button>
                <Button
                  variant={selectedWeek === 'next' ? 'default' : 'outline'}
                  onClick={() => setSelectedWeek('next')}
                  size="sm"
                >
                  Next Week
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Schedule */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              Delivery Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredDeliveries.map((delivery) => (
                <div key={delivery.id} className="p-4 rounded-lg border border-border bg-card/50 hover:bg-card/70 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground">{delivery.material}</h3>
                        <Badge className={getStatusColor(delivery.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(delivery.status)}
                            {delivery.status}
                          </span>
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Supplier:</span>
                          <span className="ml-2 text-foreground">{delivery.supplier}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Quantity:</span>
                          <span className="ml-2 text-foreground">{delivery.quantity}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Date:</span>
                          <span className="ml-2 text-foreground">{delivery.scheduledDate}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Time:</span>
                          <span className="ml-2 text-foreground">{delivery.scheduledTime}</span>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">{delivery.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">{delivery.poNumber}</span>
                        </div>
                        {delivery.trackingNumber && (
                          <div className="flex items-center gap-1">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground">{delivery.trackingNumber}</span>
                          </div>
                        )}
                      </div>
                      {delivery.notes && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          Note: {delivery.notes}
                        </div>
                      )}
                    </div>
                    <div className="ml-4 text-right">
                      <div className="text-sm text-muted-foreground mb-1">Value</div>
                      <div className="text-xl font-bold text-foreground">${(delivery.cost / 1000).toFixed(0)}K</div>
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" variant="outline">
                          Track
                        </Button>
                        <Button size="sm" variant="outline">
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Logistics Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                Delivery Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 rounded-lg border border-border bg-card/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm text-foreground">North Loading Dock</span>
                    <Badge variant="secondary">1 delivery</Badge>
                  </div>
                  <Progress value={25} className="h-2" />
                  <div className="text-xs text-muted-foreground mt-1">25% capacity used today</div>
                </div>
                <div className="p-3 rounded-lg border border-border bg-card/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm text-foreground">East Storage Area</span>
                    <Badge variant="secondary">1 delivery</Badge>
                  </div>
                  <Progress value={40} className="h-2" />
                  <div className="text-xs text-muted-foreground mt-1">40% capacity used today</div>
                </div>
                <div className="p-3 rounded-lg border border-border bg-card/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm text-foreground">Storage Building A</span>
                    <Badge variant="secondary">1 delivery</Badge>
                  </div>
                  <Progress value={60} className="h-2" />
                  <div className="text-xs text-muted-foreground mt-1">60% capacity used today</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                Delivery Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/10">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-foreground">Delivery Delayed</div>
                      <div className="text-xs text-muted-foreground">Plumbing fixtures delayed due to supplier backorder</div>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-yellow-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-foreground">Crane Required</div>
                      <div className="text-xs text-muted-foreground">Steel beam delivery tomorrow requires crane operator</div>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-blue-500/30 bg-blue-500/10">
                  <div className="flex items-start gap-2">
                    <Truck className="h-4 w-4 text-blue-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-foreground">In Transit</div>
                      <div className="text-xs text-muted-foreground">Electrical conduit delivery en route, ETA 10:00 AM</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default MaterialDelivery;