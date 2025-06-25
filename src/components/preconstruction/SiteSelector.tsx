
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, Search, Star, AlertTriangle, DollarSign } from 'lucide-react';
import type { Site, SiteSearchCriteria, ProjectType } from '@/types/preconstruction';

interface SiteSelectorProps {
  onSiteSelect: (site: Site) => void;
}

const SiteSelector: React.FC<SiteSelectorProps> = ({ onSiteSelect }) => {
  const [searchCriteria, setSearchCriteria] = useState<Partial<SiteSearchCriteria>>({
    projectType: 'residential_multi_family',
    minSize: 10000,
    maxSize: 50000,
    maxBudget: 5000000,
    targetROI: 15
  });
  const [sites, setSites] = useState<Site[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock data for demonstration
  const mockSites: Site[] = [
    {
      id: '1',
      address: '123 Development Ave, Downtown',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      parcelSize: 25000,
      zoning: {
        zone: 'R-6',
        designation: 'High Density Residential',
        maxFAR: 6.0,
        maxHeight: 200,
        setbacks: { front: 10, rear: 20, side: 8 },
        parkingRatio: 0.75,
        permittedUses: ['Multi-family residential', 'Commercial ground floor'],
        specialRestrictions: ['Historic overlay district']
      },
      marketData: {
        medianPrice: 850000,
        pricePerSqft: 450,
        demographicScore: 85,
        accessibilityScore: 92,
        amenityScore: 88,
        futureGrowthProjection: 15
      },
      environmentalFactors: [
        {
          type: 'flood_zone',
          severity: 'low',
          description: 'Zone X - minimal flood risk',
          impact: 'No additional insurance required'
        }
      ],
      feasibilityScore: 87,
      status: 'available',
      lastUpdated: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      address: '456 Commerce Blvd, Midtown',
      coordinates: { lat: 40.7589, lng: -73.9851 },
      parcelSize: 18000,
      zoning: {
        zone: 'C-4',
        designation: 'General Commercial',
        maxFAR: 4.0,
        maxHeight: 150,
        setbacks: { front: 15, rear: 25, side: 10 },
        parkingRatio: 1.0,
        permittedUses: ['Commercial', 'Office', 'Mixed-use'],
        specialRestrictions: []
      },
      marketData: {
        medianPrice: 720000,
        pricePerSqft: 380,
        demographicScore: 78,
        accessibilityScore: 95,
        amenityScore: 82,
        futureGrowthProjection: 12
      },
      environmentalFactors: [],
      feasibilityScore: 91,
      status: 'available',
      lastUpdated: '2024-01-14T14:30:00Z'
    }
  ];

  const handleSearch = async () => {
    setIsSearching(true);
    // Simulate AI-powered site search
    setTimeout(() => {
      setSites(mockSites);
      setIsSearching(false);
    }, 2000);
  };

  const getFeasibilityBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Search Criteria */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            AI Site Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Project Type</label>
              <Select 
                value={searchCriteria.projectType} 
                onValueChange={(value) => setSearchCriteria(prev => ({ ...prev, projectType: value as ProjectType }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential_multi_family">Multi-Family Residential</SelectItem>
                  <SelectItem value="commercial_office">Commercial Office</SelectItem>
                  <SelectItem value="commercial_retail">Retail</SelectItem>
                  <SelectItem value="mixed_use">Mixed Use</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Min Size (sq ft)</label>
              <Input 
                type="number" 
                value={searchCriteria.minSize}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, minSize: parseInt(e.target.value) }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Max Budget</label>
              <Input 
                type="number" 
                value={searchCriteria.maxBudget}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, maxBudget: parseInt(e.target.value) }))}
              />
            </div>
          </div>
          
          <Button onClick={handleSearch} disabled={isSearching} className="w-full">
            {isSearching ? 'AI Analyzing Sites...' : 'Search Sites with AI'}
          </Button>
        </CardContent>
      </Card>

      {/* Search Results */}
      {sites.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">AI-Recommended Sites</h3>
          {sites.map((site) => (
            <Card key={site.id} className="hover:shadow-md transition-shadow cursor-pointer" 
                  onClick={() => onSiteSelect(site)}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <h4 className="text-lg font-semibold">{site.address}</h4>
                      <Badge variant={getFeasibilityBadgeVariant(site.feasibilityScore)}>
                        <Star className="h-3 w-3 mr-1" />
                        {site.feasibilityScore}% Feasible
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Size:</span>
                        <div className="font-medium">{site.parcelSize.toLocaleString()} sq ft</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Zoning:</span>
                        <div className="font-medium">{site.zoning.zone} - {site.zoning.designation}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Max FAR:</span>
                        <div className="font-medium">{site.zoning.maxFAR}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Est. Price:</span>
                        <div className="font-medium">{formatCurrency(site.marketData.medianPrice)}</div>
                      </div>
                    </div>

                    {site.environmentalFactors.length > 0 && (
                      <div className="mt-3 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span className="text-sm text-muted-foreground">
                          {site.environmentalFactors.length} environmental consideration(s)
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 text-green-600">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-lg font-bold">
                        {site.marketData.futureGrowthProjection}%
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">Growth Projection</div>
                    <Button variant="outline" size="sm" className="mt-2">
                      Analyze Site
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SiteSelector;
