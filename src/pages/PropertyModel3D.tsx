import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Maximize2,
  Minimize2,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Home,
  Layers,
  Eye,
  EyeOff,
  Download,
  Camera,
  Sun,
  Moon,
  Grid3x3,
  Ruler,
  Info,
  Play,
  Pause,
  Building
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { Progress } from '@/components/ui/progress';

interface ModelLayer {
  id: string;
  name: string;
  type: 'structure' | 'mechanical' | 'electrical' | 'plumbing' | 'exterior' | 'interior';
  visible: boolean;
  opacity: number;
}

interface ViewMode {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface ModelAnnotation {
  id: string;
  title: string;
  description: string;
  position: { x: number; y: number; z: number };
  type: 'info' | 'warning' | 'issue';
}

const PropertyModel3D: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const [activeView, setActiveView] = useState('exterior');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [measureMode, setMeasureMode] = useState(false);
  const [playWalkthrough, setPlayWalkthrough] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState('all');

  // Mock model layers
  const [modelLayers, setModelLayers] = useState<ModelLayer[]>([
    { id: '1', name: 'Structural Frame', type: 'structure', visible: true, opacity: 100 },
    { id: '2', name: 'Exterior Walls', type: 'exterior', visible: true, opacity: 100 },
    { id: '3', name: 'Interior Walls', type: 'interior', visible: true, opacity: 100 },
    { id: '4', name: 'Mechanical Systems', type: 'mechanical', visible: false, opacity: 80 },
    { id: '5', name: 'Electrical Systems', type: 'electrical', visible: false, opacity: 80 },
    { id: '6', name: 'Plumbing Systems', type: 'plumbing', visible: false, opacity: 80 }
  ]);

  // Mock view modes
  const viewModes: ViewMode[] = [
    { id: 'exterior', name: 'Exterior View', icon: <Building className="h-4 w-4" />, description: 'Building exterior and surroundings' },
    { id: 'interior', name: 'Interior View', icon: <Home className="h-4 w-4" />, description: 'Interior spaces and layout' },
    { id: 'systems', name: 'Building Systems', icon: <Layers className="h-4 w-4" />, description: 'MEP and structural systems' },
    { id: 'construction', name: 'Construction Progress', icon: <RotateCw className="h-4 w-4" />, description: 'Current construction status' }
  ];

  // Mock annotations
  const annotations: ModelAnnotation[] = [
    { id: '1', title: 'Main Entrance', description: 'Grand lobby with 30ft ceiling', position: { x: 0, y: 0, z: 0 }, type: 'info' },
    { id: '2', title: 'HVAC Unit', description: 'Rooftop mechanical equipment', position: { x: 50, y: 150, z: 0 }, type: 'info' },
    { id: '3', title: 'Structural Issue', description: 'Beam reinforcement needed', position: { x: -30, y: 60, z: 0 }, type: 'warning' },
    { id: '4', title: 'Electrical Panel', description: 'Main distribution panel location', position: { x: -50, y: 0, z: -10 }, type: 'info' }
  ];

  const toggleLayerVisibility = (layerId: string) => {
    setModelLayers(layers => 
      layers.map(layer => 
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    );
  };

  const updateLayerOpacity = (layerId: string, opacity: number) => {
    setModelLayers(layers => 
      layers.map(layer => 
        layer.id === layerId ? { ...layer, opacity } : layer
      )
    );
  };

  const getLayerIcon = (type: string) => {
    switch (type) {
      case 'structure': return '🏗️';
      case 'mechanical': return '⚙️';
      case 'electrical': return '⚡';
      case 'plumbing': return '🚿';
      case 'exterior': return '🏢';
      case 'interior': return '🏠';
      default: return '📦';
    }
  };

  const getAnnotationColor = (type: string) => {
    switch (type) {
      case 'info': return 'bg-blue-500';
      case 'warning': return 'bg-yellow-500';
      case 'issue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">
              3D Property Model
            </h1>
            <p className="text-muted-foreground mt-1">
              Interactive building visualization and walkthrough
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Camera className="w-4 h-4 mr-2" />
              Screenshot
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Model
            </Button>
            <Button 
              variant="outline"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 3D Viewer */}
          <div className="lg:col-span-3">
            <Card className="bg-card border-border h-[600px]">
              <CardContent className="p-0 relative h-full">
                {/* Placeholder for 3D model */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-64 h-64 mx-auto mb-4 rounded-lg bg-muted/50 flex items-center justify-center">
                      <div className="text-6xl">🏢</div>
                    </div>
                    <p className="text-muted-foreground">3D Model Viewer</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Interactive 3D model would be rendered here using Three.js or similar
                    </p>
                  </div>
                </div>

                {/* Viewer Controls */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <Button size="sm" variant="secondary" className="bg-background/80 backdrop-blur">
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary" className="bg-background/80 backdrop-blur">
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary" className="bg-background/80 backdrop-blur">
                    <Home className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary" className="bg-background/80 backdrop-blur">
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </div>

                {/* View Options */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button 
                    size="sm" 
                    variant={showGrid ? "default" : "secondary"}
                    className="bg-background/80 backdrop-blur"
                    onClick={() => setShowGrid(!showGrid)}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant={measureMode ? "default" : "secondary"}
                    className="bg-background/80 backdrop-blur"
                    onClick={() => setMeasureMode(!measureMode)}
                  >
                    <Ruler className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant={showAnnotations ? "default" : "secondary"}
                    className="bg-background/80 backdrop-blur"
                    onClick={() => setShowAnnotations(!showAnnotations)}
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </div>

                {/* Walkthrough Controls */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-background/80 backdrop-blur px-4 py-2 rounded-lg">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setPlayWalkthrough(!playWalkthrough)}
                  >
                    {playWalkthrough ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <span className="text-sm text-muted-foreground">Virtual Walkthrough</span>
                  <Progress value={35} className="w-32" />
                </div>

                {/* Annotations Overlay */}
                {showAnnotations && (
                  <div className="absolute inset-0 pointer-events-none">
                    {annotations.map((annotation) => (
                      <div
                        key={annotation.id}
                        className="absolute pointer-events-auto"
                        style={{ 
                          left: `${50 + annotation.position.x * 0.3}%`, 
                          top: `${50 - annotation.position.y * 0.3}%` 
                        }}
                      >
                        <div className={`w-6 h-6 rounded-full ${getAnnotationColor(annotation.type)} animate-pulse cursor-pointer relative group`}>
                          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-background/95 backdrop-blur p-3 rounded-lg shadow-lg border border-border hidden group-hover:block w-48">
                            <h4 className="font-medium text-sm text-foreground">{annotation.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{annotation.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            {/* View Modes */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-sm">View Modes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {viewModes.map((mode) => (
                  <Button
                    key={mode.id}
                    variant={activeView === mode.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setActiveView(mode.id)}
                  >
                    {mode.icon}
                    <span className="ml-2">{mode.name}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Floor Selection */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-sm">Floor Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <select 
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                  value={selectedFloor}
                  onChange={(e) => setSelectedFloor(e.target.value)}
                >
                  <option value="all">All Floors</option>
                  <option value="basement">Basement</option>
                  <option value="ground">Ground Floor</option>
                  <option value="1">Floor 1</option>
                  <option value="2">Floor 2</option>
                  <option value="3">Floor 3</option>
                  <option value="roof">Roof</option>
                </select>
              </CardContent>
            </Card>

            {/* Layer Controls */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-sm">Model Layers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {modelLayers.map((layer) => (
                  <div key={layer.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{getLayerIcon(layer.type)}</span>
                        <span className="text-sm text-foreground">{layer.name}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleLayerVisibility(layer.id)}
                      >
                        {layer.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                    </div>
                    {layer.visible && (
                      <div className="flex items-center gap-2 pl-6">
                        <span className="text-xs text-muted-foreground">Opacity</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={layer.opacity}
                          onChange={(e) => updateLayerOpacity(layer.id, parseInt(e.target.value))}
                          className="flex-1"
                        />
                        <span className="text-xs text-muted-foreground w-10">{layer.opacity}%</span>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Lighting Controls */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-sm">Lighting</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Sun className="h-4 w-4 mr-2" />
                  Daylight
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Moon className="h-4 w-4 mr-2" />
                  Night View
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Information Tabs */}
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="details">Model Details</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="progress">Construction Progress</TabsTrigger>
            <TabsTrigger value="issues">Issues & Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Building Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Total Area</h4>
                    <p className="text-2xl font-bold text-foreground">125,000 sq ft</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Floors</h4>
                    <p className="text-2xl font-bold text-foreground">15</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Height</h4>
                    <p className="text-2xl font-bold text-foreground">185 ft</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Model Version</h4>
                    <p className="text-2xl font-bold text-foreground">v3.2</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h4>
                    <p className="text-2xl font-bold text-foreground">Dec 18</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">File Size</h4>
                    <p className="text-2xl font-bold text-foreground">248 MB</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specifications">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Technical Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border border-border">
                      <h4 className="font-medium text-foreground mb-3">Structural System</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Reinforced concrete frame</li>
                        <li>• Post-tensioned slabs</li>
                        <li>• Seismic resistance: Zone 4</li>
                        <li>• Wind load: 120 mph design</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg border border-border">
                      <h4 className="font-medium text-foreground mb-3">MEP Systems</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• VRF HVAC system</li>
                        <li>• LED lighting throughout</li>
                        <li>• 4000A electrical service</li>
                        <li>• Dual water supply</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Construction Progress by System</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">Structure</span>
                      <span className="text-sm text-muted-foreground">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">Exterior Envelope</span>
                      <span className="text-sm text-muted-foreground">60%</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">MEP Rough-in</span>
                      <span className="text-sm text-muted-foreground">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">Interior Framing</span>
                      <span className="text-sm text-muted-foreground">30%</span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="issues">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Model Issues & Coordination Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {annotations.filter(a => a.type !== 'info').map((annotation) => (
                    <div key={annotation.id} className="p-3 rounded-lg border border-border bg-card/50">
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 ${getAnnotationColor(annotation.type)}`} />
                        <div>
                          <h4 className="font-medium text-foreground">{annotation.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{annotation.description}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Location: Level {Math.floor(annotation.position.y / 10) || 'Ground'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default PropertyModel3D;