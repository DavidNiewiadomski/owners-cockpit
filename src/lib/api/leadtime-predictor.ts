// Lead Time Predictor API Client

export interface ForecastRequest {
  work_pkg: string;
  fab_start_date: string;
  region?: string;
  project_type?: string;
  project_size?: string;
  urgency?: string;
  quantity?: number;
}

export interface ForecastResponse {
  delivery_est: number;
  confidence_interval: {
    lower: number;
    upper: number;
  };
  factors: {
    work_package: string;
    region: string;
    urgency_level: string;
    project_size: string;
    seasonal_factor: number;
    market_conditions: string;
  };
  enr_impact?: number;
  model_version: string;
  generated_at: string;
  // SHAP values for AI tooltip
  shap_values?: {
    work_package_impact: number;
    region_impact: number;
    urgency_impact: number;
    size_impact: number;
    seasonal_impact: number;
    enr_impact: number;
  };
}

export interface ModelStatus {
  status: string;
  last_trained?: string;
  model_version: string;
  records_used: number;
  accuracy_metrics?: {
    mae: number;
    rmse: number;
  };
}

class LeadTimePredictorAPI {
  private baseUrl = 'http://localhost:8002';

  async forecast(request: ForecastRequest): Promise<ForecastResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/lead-time/forecast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Forecast request failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Mock SHAP values since the current model doesn't return them
      // In production, this should come from the predictor service
      data.shap_values = this.mockShapValues(request, data);
      
      return data;
    } catch (error) {
      console.error('Error calling lead time predictor:', error);
      throw error;
    }
  }

  async getModelStatus(): Promise<ModelStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/model/status`);
      
      if (!response.ok) {
        throw new Error(`Model status request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting model status:', error);
      throw error;
    }
  }

  async triggerModelTraining(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/model/train`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`Model training request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error triggering model training:', error);
      throw error;
    }
  }

  async healthCheck(): Promise<{ status: string; service: string; model_status: string; version: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking service health:', error);
      throw error;
    }
  }

  // Mock SHAP values for demonstration
  // In production, these should come from the actual ML model
  private mockShapValues(request: ForecastRequest, response: ForecastResponse) {
    // Create realistic SHAP values based on the request parameters
    const workPkgImpact = this.getWorkPackageImpact(request.work_pkg);
    const regionImpact = this.getRegionImpact(request.region || 'US');
    const urgencyImpact = this.getUrgencyImpact(request.urgency || 'normal');
    const sizeImpact = this.getSizeImpact(request.project_size || 'medium');
    const seasonalImpact = response.factors.seasonal_factor * 5; // Scale up for visibility
    const enrImpact = response.enr_impact || 0;

    return {
      work_package_impact: workPkgImpact,
      region_impact: regionImpact,
      urgency_impact: urgencyImpact,
      size_impact: sizeImpact,
      seasonal_impact: seasonalImpact,
      enr_impact: enrImpact,
    };
  }

  private getWorkPackageImpact(workPkg: string): number {
    // Map work packages to typical lead time impacts
    const impacts: { [key: string]: number } = {
      '03200': -2,  // Concrete accessories - shorter
      '03300': -1,  // Concrete - shorter
      '05120': 8,   // Structural steel - longer
      '05500': 4,   // Metal fabrications - moderate
      '07920': 1,   // Joint sealers - slight
      '08110': 3,   // Metal doors - moderate
      '09900': -3,  // Painting - shorter
      '22110': 2,   // Plumbing - slight
      '23090': 1,   // HVAC - slight
      '26050': 5,   // Electrical - moderate
      '27100': 7,   // Audio-visual - longer
      '31230': 10,  // Site improvements - longest
    };
    
    return impacts[workPkg] || 0;
  }

  private getRegionImpact(region: string): number {
    const impacts: { [key: string]: number } = {
      'US-NE': 2,   // Northeast - slight delay
      'US-SE': -1,  // Southeast - slight faster
      'US-MW': 0,   // Midwest - neutral
      'US-SW': 0,   // Southwest - neutral
      'US-W': 3,    // West - slight delay
      'CA': 2,      // Canada - slight delay
      'MX': -2,     // Mexico - faster
      'US': 0,      // Default US
    };
    
    return impacts[region] || 0;
  }

  private getUrgencyImpact(urgency: string): number {
    const impacts: { [key: string]: number } = {
      'low': 5,      // Low urgency - longer lead time
      'normal': 0,   // Normal - baseline
      'high': -3,    // High urgency - shorter
      'critical': -7, // Critical - much shorter
    };
    
    return impacts[urgency] || 0;
  }

  private getSizeImpact(size: string): number {
    const impacts: { [key: string]: number } = {
      'small': -2,   // Small projects - faster
      'medium': 0,   // Medium - baseline
      'large': 4,    // Large - longer
      'mega': 8,     // Mega projects - much longer
    };
    
    return impacts[size] || 0;
  }
}

export const leadTimePredictorAPI = new LeadTimePredictorAPI();
