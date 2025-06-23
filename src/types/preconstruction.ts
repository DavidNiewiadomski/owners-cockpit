
export interface Site {
  id: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  parcelSize: number; // in square feet
  zoning: ZoningInfo;
  marketData: MarketData;
  environmentalFactors: EnvironmentalFactor[];
  feasibilityScore: number;
  status: 'available' | 'under_review' | 'reserved' | 'unavailable';
  lastUpdated: string;
}

export interface ZoningInfo {
  zone: string;
  designation: string;
  maxFAR: number;
  maxHeight: number; // in feet
  setbacks: {
    front: number;
    rear: number;
    side: number;
  };
  parkingRatio: number; // spaces per unit/1000sqft
  permittedUses: string[];
  specialRestrictions: string[];
  needsVariance?: boolean;
}

export interface MarketData {
  medianPrice: number;
  pricePerSqft: number;
  demographicScore: number;
  accessibilityScore: number;
  amenityScore: number;
  futureGrowthProjection: number;
}

export interface EnvironmentalFactor {
  type: 'flood_zone' | 'wetland' | 'historic_district' | 'soil_condition' | 'environmental_hazard';
  severity: 'low' | 'medium' | 'high';
  description: string;
  impact: string;
}

export interface FeasibilityStudy {
  id: string;
  siteId: string;
  projectType: ProjectType;
  scenarios: DevelopmentScenario[];
  recommendations: string[];
  riskFactors: RiskFactor[];
  timeline: ProjectTimeline;
  createdAt: string;
}

export interface DevelopmentScenario {
  id: string;
  name: string;
  buildingType: 'residential' | 'commercial' | 'mixed_use' | 'industrial';
  units: number;
  floors: number;
  grossFloorArea: number;
  parkingSpaces: number;
  estimatedCost: number;
  estimatedRevenue: number;
  roi: number;
  feasibilityScore: number;
  constraints: string[];
}

export interface RiskFactor {
  category: 'zoning' | 'environmental' | 'market' | 'regulatory' | 'financial';
  risk: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  mitigation: string;
  probability: number;
}

export interface ProjectTimeline {
  phases: TimelinePhase[];
  totalDuration: number; // in months
  criticalPath: string[];
}

export interface TimelinePhase {
  name: string;
  duration: number; // in months
  dependencies: string[];
  permits: string[];
  milestones: string[];
}

export type ProjectType = 
  | 'residential_single_family'
  | 'residential_multi_family'
  | 'residential_mixed_income'
  | 'commercial_office'
  | 'commercial_retail'
  | 'commercial_hospitality'
  | 'industrial_warehouse'
  | 'industrial_manufacturing'
  | 'mixed_use'
  | 'institutional';

export interface SiteSearchCriteria {
  projectType: ProjectType;
  minSize: number;
  maxSize: number;
  maxBudget: number;
  preferredZones: string[];
  requiredAmenities: string[];
  environmentalConstraints: string[];
  timeframe: string;
  targetROI: number;
}

export interface ZoningAnalysisRequest {
  siteId: string;
  proposedUse: string;
  buildingSpecs: {
    floors: number;
    units?: number;
    grossArea: number;
    height: number;
  };
}

export interface PermitRequirement {
  type: string;
  authority: string;
  estimatedDuration: number; // in weeks
  cost: number;
  requirements: string[];
  priority: 'critical' | 'high' | 'medium' | 'low';
}
