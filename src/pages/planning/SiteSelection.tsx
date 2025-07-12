import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MapPin,
  TrendingUp,
  DollarSign,
  Building,
  Car,
  Trees,
  Zap,
  Users,
  CheckCircle2,
  AlertTriangle,
  Target,
  BarChart3,
  Download,
  Navigation
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

interface SiteOption {
  id: string;
  name: string;
  address: string;
  size: string;
  price: number;
  zoning: string;
  score: number;
  status: 'available' | 'under-negotiation' | 'selected' | 'rejected';
  pros: string[];
  cons: string[];
  metrics: {
    location: number;
    accessibility: number;
    infrastructure: number;
    zoning: number;
    cost: number;
    growth: number;
  };
}

interface EvaluationCriteria {
  criteria: string;
  weight: number;
  description: string;
}

const SiteSelection: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const [selectedSite, setSelectedSite] = useState<string>('1');
  const [comparisonMode, setComparisonMode] = useState(false);

  // Mock site options
  const siteOptions: SiteOption[] = [
    {
      id: '1',
      name: 'Downtown Business District',
      address: '1200 Main Street, Metro City',
      size: '2.3 acres',
      price: 12500000,
      zoning: 'Commercial Mixed-Use',
      score: 92,
      status: 'selected',
      pros: [
        'Prime downtown location',
        'Excellent public transportation access',
        'High foot traffic area',
        'Adjacent to major employers'
      ],
      cons: [
        'Higher acquisition cost',
        'Limited parking options',
        'Complex zoning requirements'
      ],
      metrics: {
        location: 95,
        accessibility: 90,
        infrastructure: 88,
        zoning: 85,
        cost: 70,
        growth: 98
      }
    },
    {
      id: '2',
      name: 'Suburban Commercial Hub',
      address: '450 Commerce Blvd, Westfield',
      size: '3.1 acres',
      price: 8300000,
      zoning: 'Commercial',
      score: 78,
      status: 'available',
      pros: [
        'Lower acquisition cost',
        'Ample parking space',
        'Growing suburban market',
        'Easier construction logistics'
      ],
      cons: [
        'Limited public transit',
        'Lower foot traffic',
        'Distance from city center'
      ],
      metrics: {
        location: 75,
        accessibility: 70,
        infrastructure: 85,
        zoning: 90,
        cost: 85,
        growth: 80
      }
    },
    {
      id: '3',
      name: 'Tech Corridor Site',
      address: '2100 Innovation Drive, Tech Park',
      size: '2.8 acres',
      price: 10200000,
      zoning: 'Mixed-Use Development',
      score: 85,
      status: 'under-negotiation',
      pros: [
        'Near tech companies',
        'Modern infrastructure',
        'Growth potential',
        'Younger demographics'
      ],
      cons: [
        'Competition from existing developments',
        'Traffic congestion',
        'Higher construction costs'
      ],
      metrics: {
        location: 85,
        accessibility: 80,
        infrastructure: 92,
        zoning: 88,
        cost: 75,
        growth: 90
      }
    }
  ];

  const evaluationCriteria: EvaluationCriteria[] = [
    {
      criteria: 'Location Quality',
      weight: 25,
      description: 'Proximity to amenities, visibility, neighborhood quality'
    },
    {
      criteria: 'Accessibility',
      weight: 20,
      description: 'Public transit, highway access, walkability'
    },
    {
      criteria: 'Infrastructure',
      weight: 15,
      description: 'Utilities, internet, existing structures'
    },
    {
      criteria: 'Zoning & Permits',
      weight: 15,
      description: 'Current zoning, ease of approvals, restrictions'
    },
    {
      criteria: 'Cost Efficiency',
      weight: 15,
      description: 'Acquisition cost, development costs, ROI potential'
    },
    {
      criteria: 'Growth Potential',
      weight: 10,
      description: 'Area development trends, future appreciation'
    }
  ];

  const selectedSiteData = siteOptions.find(s => s.id === selectedSite) || siteOptions[0];

  // Prepare radar chart data
  const radarData = [
    { metric: 'Location', value: selectedSiteData.metrics.location },
    { metric: 'Access', value: selectedSiteData.metrics.accessibility },
    { metric: 'Infrastructure', value: selectedSiteData.metrics.infrastructure },
    { metric: 'Zoning', value: selectedSiteData.metrics.zoning },
    { metric: 'Cost', value: selectedSiteData.metrics.cost },
    { metric: 'Growth', value: selectedSiteData.metrics.growth }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'selected': return 'bg-green-100 text-green-700';
      case 'under-negotiation': return 'bg-blue-100 text-blue-700';
      case 'available': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">
              Site Selection Analysis
            </h1>
            <p className="text-muted-foreground mt-1">
              Evaluate and compare potential development sites
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Analysis
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setComparisonMode(!comparisonMode)}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              {comparisonMode ? 'Exit Comparison' : 'Compare Sites'}
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Sites Evaluated</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{siteOptions.length}</div>
              <div className="text-xs text-muted-foreground mt-1">
                1 selected, 1 in negotiation
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Best Score</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">92/100</div>
              <div className="text-xs text-muted-foreground mt-1">
                Downtown Business District
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Price Range</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">$8.3-12.5M</div>
              <div className="text-xs text-muted-foreground mt-1">
                Acquisition cost
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Area</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">8.2 acres</div>
              <div className="text-xs text-muted-foreground mt-1">
                Combined site area
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Site Options */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {siteOptions.map((site) => (
            <Card 
              key={site.id} 
              className={`bg-card border-border cursor-pointer transition-all ${
                selectedSite === site.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedSite(site.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{site.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{site.address}</p>
                  </div>
                  <Badge className={getStatusColor(site.status)}>
                    {site.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Score</div>
                    <div className={`text-2xl font-bold ${getScoreColor(site.score)}`}>
                      {site.score}/100
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Price</div>
                    <div className="text-xl font-bold text-foreground">
                      ${(site.price / 1000000).toFixed(1)}M
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Size:</span>
                    <span className="ml-2 text-foreground">{site.size}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Zoning:</span>
                    <span className="ml-2 text-foreground">{site.zoning}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-green-400">Advantages</div>
                  <ul className="space-y-1">
                    {site.pros.slice(0, 2).map((pro, index) => (
                      <li key={index} className="text-xs text-muted-foreground flex items-start gap-1">
                        <CheckCircle2 className="h-3 w-3 text-green-400 mt-0.5" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                {selectedSite === site.id && (
                  <Button className="w-full" size="sm">
                    View Detailed Analysis
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Analysis */}
        <Tabs defaultValue="analysis" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="analysis">Site Analysis</TabsTrigger>
            <TabsTrigger value="comparison">Comparison Matrix</TabsTrigger>
            <TabsTrigger value="criteria">Evaluation Criteria</TabsTrigger>
            <TabsTrigger value="location">Location Details</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-muted-foreground" />
                    Site Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#333" />
                      <PolarAngleAxis dataKey="metric" className="text-sm" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar 
                        name="Score" 
                        dataKey="value" 
                        stroke="#3b82f6" 
                        fill="#3b82f6" 
                        fillOpacity={0.6} 
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Detailed Evaluation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-green-400 mb-2">Strengths</h4>
                    <ul className="space-y-2">
                      {selectedSiteData.pros.map((pro, index) => (
                        <li key={index} className="text-sm text-foreground flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-400 mb-2">Challenges</h4>
                    <ul className="space-y-2">
                      {selectedSiteData.cons.map((con, index) => (
                        <li key={index} className="text-sm text-foreground flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="comparison">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Site Comparison Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 font-medium text-foreground">Criteria</th>
                        {siteOptions.map((site) => (
                          <th key={site.id} className="text-center p-3 font-medium text-foreground">
                            {site.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="p-3 text-foreground">Overall Score</td>
                        {siteOptions.map((site) => (
                          <td key={site.id} className="text-center p-3">
                            <span className={`font-bold ${getScoreColor(site.score)}`}>
                              {site.score}
                            </span>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-border">
                        <td className="p-3 text-foreground">Price</td>
                        {siteOptions.map((site) => (
                          <td key={site.id} className="text-center p-3 text-foreground">
                            ${(site.price / 1000000).toFixed(1)}M
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-border">
                        <td className="p-3 text-foreground">Size</td>
                        {siteOptions.map((site) => (
                          <td key={site.id} className="text-center p-3 text-foreground">
                            {site.size}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-border">
                        <td className="p-3 text-foreground">Location Quality</td>
                        {siteOptions.map((site) => (
                          <td key={site.id} className="text-center p-3">
                            <Progress value={site.metrics.location} className="w-20 mx-auto" />
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-border">
                        <td className="p-3 text-foreground">Accessibility</td>
                        {siteOptions.map((site) => (
                          <td key={site.id} className="text-center p-3">
                            <Progress value={site.metrics.accessibility} className="w-20 mx-auto" />
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-border">
                        <td className="p-3 text-foreground">Infrastructure</td>
                        {siteOptions.map((site) => (
                          <td key={site.id} className="text-center p-3">
                            <Progress value={site.metrics.infrastructure} className="w-20 mx-auto" />
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="criteria">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Evaluation Criteria & Weighting</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {evaluationCriteria.map((criteria, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border bg-card/50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-foreground">{criteria.criteria}</h4>
                        <Badge variant="secondary">{criteria.weight}% weight</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{criteria.description}</p>
                      <Progress value={criteria.weight} className="mt-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="location">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="h-5 w-5 text-muted-foreground" />
                    Transportation & Access
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Car className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">Highway Access</div>
                      <div className="text-xs text-muted-foreground">0.5 miles to I-95, 1.2 miles to Route 1</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">Public Transit</div>
                      <div className="text-xs text-muted-foreground">Metro station 2 blocks, 5 bus routes</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">Parking</div>
                      <div className="text-xs text-muted-foreground">350 spaces planned, street parking available</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trees className="h-5 w-5 text-muted-foreground" />
                    Environmental Factors
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">Utilities</div>
                      <div className="text-xs text-muted-foreground">All utilities available at site boundary</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Trees className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">Environmental Impact</div>
                      <div className="text-xs text-muted-foreground">No wetlands, minimal tree removal required</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">Flood Zone</div>
                      <div className="text-xs text-muted-foreground">Zone X - minimal flood risk</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default SiteSelection;