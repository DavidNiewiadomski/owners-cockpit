/**
 * Comprehensive Bid Analysis Engine
 * Implements sophisticated statistical analysis for bid leveling
 */

export interface BidLineItem {
  id: string;
  submissionId: string;
  vendorName: string;
  csiCode: string;
  description: string;
  quantity: number;
  unitOfMeasure: string;
  unitPrice: number;
  extended: number;
  isAllowance: boolean;
  confidenceScore: number;
  extractedAt: string;
}

export interface StatisticalSummary {
  count: number;
  mean: number;
  median: number;
  min: number;
  max: number;
  range: number;
  variance: number;
  standardDeviation: number;
  coefficientOfVariation: number;
  q1: number;
  q3: number;
  iqr: number;
  skewness: number;
  kurtosis: number;
}

export interface OutlierAnalysis {
  isOutlier: boolean;
  outlierType: 'low' | 'high' | null;
  outlierSeverity: 'mild' | 'moderate' | 'severe' | null;
  deviationFromMedian: number;
  percentileRank: number;
  zScore: number;
  modifiedZScore: number;
  iqrPosition: number;
}

export interface GroupedLineItem {
  groupKey: string;
  csiCode: string;
  description: string;
  items: BidLineItem[];
  statistics: StatisticalSummary;
  outliers: Array<BidLineItem & OutlierAnalysis>;
  riskAssessment: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
    confidence: number;
  };
  dataQuality: {
    completeness: number;
    consistency: number;
    accuracy: number;
    overall: number;
  };
}

export interface VendorPerformance {
  vendorId: string;
  vendorName: string;
  totalItems: number;
  competitiveItems: number;
  outlierItems: number;
  missingItems: number;
  averageRank: number;
  competitivenessScore: number;
  reliabilityScore: number;
  overallScore: number;
}

export interface MarketAnalysis {
  totalItems: number;
  competitiveItems: number;
  nonCompetitiveItems: number;
  averageCompetition: number;
  priceVolatility: number;
  marketMaturity: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
}

export class BidAnalysisEngine {
  private outlierThreshold: number;
  private confidenceThreshold: number;

  constructor(outlierThreshold = 1.5, confidenceThreshold = 0.8) {
    this.outlierThreshold = outlierThreshold;
    this.confidenceThreshold = confidenceThreshold;
  }

  /**
   * Perform comprehensive bid analysis
   */
  public analyzeBids(bidLineItems: BidLineItem[]): {
    groupedItems: GroupedLineItem[];
    vendorPerformance: VendorPerformance[];
    marketAnalysis: MarketAnalysis;
    recommendations: string[];
  } {
    // Group line items by CSI code and description
    const groupedItems = this.groupLineItems(bidLineItems);
    
    // Analyze each group
    const analyzedGroups = groupedItems.map(group => this.analyzeGroup(group));
    
    // Calculate vendor performance metrics
    const vendorPerformance = this.calculateVendorPerformance(bidLineItems, analyzedGroups);
    
    // Perform market analysis
    const marketAnalysis = this.performMarketAnalysis(analyzedGroups);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(analyzedGroups, vendorPerformance, marketAnalysis);

    return {
      groupedItems: analyzedGroups,
      vendorPerformance,
      marketAnalysis,
      recommendations
    };
  }

  /**
   * Group line items by CSI code and description
   */
  private groupLineItems(bidLineItems: BidLineItem[]): Array<Omit<GroupedLineItem, 'statistics' | 'outliers' | 'riskAssessment' | 'dataQuality'>> {
    const groups = new Map<string, BidLineItem[]>();

    bidLineItems.forEach(item => {
      const key = `${item.csiCode}-${this.normalizeDescription(item.description)}`;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(item);
    });

    return Array.from(groups.entries()).map(([key, items]) => ({
      groupKey: key,
      csiCode: items[0].csiCode,
      description: items[0].description,
      items
    }));
  }

  /**
   * Normalize description for grouping
   */
  private normalizeDescription(description: string): string {
    return description
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ');
  }

  /**
   * Analyze a group of line items
   */
  private analyzeGroup(group: Omit<GroupedLineItem, 'statistics' | 'outliers' | 'riskAssessment' | 'dataQuality'>): GroupedLineItem {
    const extendedPrices = group.items.map(item => item.extended).filter(price => price > 0);
    
    if (extendedPrices.length === 0) {
      return {
        ...group,
        statistics: this.createEmptyStatistics(),
        outliers: [],
        riskAssessment: { level: 'high', factors: ['No pricing data'], confidence: 1.0 },
        dataQuality: { completeness: 0, consistency: 0, accuracy: 0, overall: 0 }
      };
    }

    // Calculate statistics
    const statistics = this.calculateStatistics(extendedPrices);
    
    // Detect outliers
    const outliers = this.detectOutliers(group.items, statistics);
    
    // Assess risk
    const riskAssessment = this.assessRisk(statistics, outliers, group.items);
    
    // Evaluate data quality
    const dataQuality = this.evaluateDataQuality(group.items);

    return {
      ...group,
      statistics,
      outliers,
      riskAssessment,
      dataQuality
    };
  }

  /**
   * Calculate comprehensive statistics
   */
  private calculateStatistics(values: number[]): StatisticalSummary {
    if (values.length === 0) {
      return this.createEmptyStatistics();
    }

    const sorted = [...values].sort((a, b) => a - b);
    const n = values.length;
    
    // Basic statistics
    const sum = values.reduce((acc, val) => acc + val, 0);
    const mean = sum / n;
    const min = sorted[0];
    const max = sorted[n - 1];
    const range = max - min;
    
    // Median and quartiles
    const median = this.calculatePercentile(sorted, 50);
    const q1 = this.calculatePercentile(sorted, 25);
    const q3 = this.calculatePercentile(sorted, 75);
    const iqr = q3 - q1;
    
    // Variance and standard deviation
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (n - 1);
    const standardDeviation = Math.sqrt(variance);
    const coefficientOfVariation = standardDeviation / mean;
    
    // Skewness and kurtosis
    const skewness = this.calculateSkewness(values, mean, standardDeviation);
    const kurtosis = this.calculateKurtosis(values, mean, standardDeviation);

    return {
      count: n,
      mean,
      median,
      min,
      max,
      range,
      variance,
      standardDeviation,
      coefficientOfVariation,
      q1,
      q3,
      iqr,
      skewness,
      kurtosis
    };
  }

  /**
   * Calculate percentile
   */
  private calculatePercentile(sortedValues: number[], percentile: number): number {
    const index = (percentile / 100) * (sortedValues.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;
    
    if (upper >= sortedValues.length) {
      return sortedValues[sortedValues.length - 1];
    }
    
    return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight;
  }

  /**
   * Calculate skewness
   */
  private calculateSkewness(values: number[], mean: number, stdDev: number): number {
    const n = values.length;
    const sum = values.reduce((acc, val) => acc + Math.pow((val - mean) / stdDev, 3), 0);
    return (n / ((n - 1) * (n - 2))) * sum;
  }

  /**
   * Calculate kurtosis
   */
  private calculateKurtosis(values: number[], mean: number, stdDev: number): number {
    const n = values.length;
    const sum = values.reduce((acc, val) => acc + Math.pow((val - mean) / stdDev, 4), 0);
    return ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * sum - (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3));
  }

  /**
   * Detect outliers using multiple methods
   */
  private detectOutliers(items: BidLineItem[], statistics: StatisticalSummary): Array<BidLineItem & OutlierAnalysis> {
    return items.map(item => {
      const analysis = this.analyzeOutlier(item.extended, statistics);
      return { ...item, ...analysis };
    }).filter(item => item.isOutlier);
  }

  /**
   * Analyze individual value for outlier characteristics
   */
  private analyzeOutlier(value: number, statistics: StatisticalSummary): OutlierAnalysis {
    if (value === 0 || statistics.count === 0) {
      return {
        isOutlier: false,
        outlierType: null,
        outlierSeverity: null,
        deviationFromMedian: 0,
        percentileRank: 0,
        zScore: 0,
        modifiedZScore: 0,
        iqrPosition: 0
      };
    }

    // Calculate various outlier metrics
    const zScore = (value - statistics.mean) / statistics.standardDeviation;
    const modifiedZScore = 0.6745 * (value - statistics.median) / (statistics.iqr / 1.35);
    const deviationFromMedian = ((value - statistics.median) / statistics.median) * 100;
    
    // IQR method
    const lowerBound = statistics.q1 - (this.outlierThreshold * statistics.iqr);
    const upperBound = statistics.q3 + (this.outlierThreshold * statistics.iqr);
    const severeLowerBound = statistics.q1 - (3.0 * statistics.iqr);
    const severeUpperBound = statistics.q3 + (3.0 * statistics.iqr);
    
    let isOutlier = false;
    let outlierType: 'low' | 'high' | null = null;
    let outlierSeverity: 'mild' | 'moderate' | 'severe' | null = null;
    
    if (value < lowerBound || value > upperBound) {
      isOutlier = true;
      outlierType = value < lowerBound ? 'low' : 'high';
      
      // Determine severity
      if (value < severeLowerBound || value > severeUpperBound) {
        outlierSeverity = 'severe';
      } else if (Math.abs(zScore) > 2.5) {
        outlierSeverity = 'moderate';
      } else {
        outlierSeverity = 'mild';
      }
    }
    
    // Calculate percentile rank
    const percentileRank = this.calculatePercentileRank(value, statistics);
    
    // Calculate IQR position
    const iqrPosition = (value - statistics.q1) / statistics.iqr;

    return {
      isOutlier,
      outlierType,
      outlierSeverity,
      deviationFromMedian,
      percentileRank,
      zScore,
      modifiedZScore,
      iqrPosition
    };
  }

  /**
   * Calculate percentile rank for a value
   */
  private calculatePercentileRank(value: number, statistics: StatisticalSummary): number {
    // Simplified calculation - in reality would need the full dataset
    if (value <= statistics.min) return 0;
    if (value >= statistics.max) return 100;
    if (value <= statistics.q1) return 25 * (value - statistics.min) / (statistics.q1 - statistics.min);
    if (value <= statistics.median) return 25 + 25 * (value - statistics.q1) / (statistics.median - statistics.q1);
    if (value <= statistics.q3) return 50 + 25 * (value - statistics.median) / (statistics.q3 - statistics.median);
    return 75 + 25 * (value - statistics.q3) / (statistics.max - statistics.q3);
  }

  /**
   * Assess risk level for a group
   */
  private assessRisk(
    statistics: StatisticalSummary, 
    outliers: Array<BidLineItem & OutlierAnalysis>, 
    items: BidLineItem[]
  ): { level: 'low' | 'medium' | 'high'; factors: string[]; confidence: number } {
    const factors: string[] = [];
    let riskScore = 0;
    
    // High coefficient of variation
    if (statistics.coefficientOfVariation > 0.3) {
      factors.push('High price volatility');
      riskScore += 30;
    } else if (statistics.coefficientOfVariation > 0.15) {
      factors.push('Moderate price volatility');
      riskScore += 15;
    }
    
    // Outlier ratio
    const outlierRatio = outliers.length / items.length;
    if (outlierRatio > 0.4) {
      factors.push('High outlier rate');
      riskScore += 25;
    } else if (outlierRatio > 0.2) {
      factors.push('Moderate outlier rate');
      riskScore += 10;
    }
    
    // Missing data
    const responseRate = items.filter(item => item.extended > 0).length / items.length;
    if (responseRate < 0.7) {
      factors.push('Low response rate');
      riskScore += 20;
    } else if (responseRate < 0.9) {
      factors.push('Moderate response rate');
      riskScore += 5;
    }
    
    // Severe outliers
    const severeOutliers = outliers.filter(o => o.outlierSeverity === 'severe');
    if (severeOutliers.length > 0) {
      factors.push(`${severeOutliers.length} severe outlier(s)`);
      riskScore += severeOutliers.length * 10;
    }
    
    // Sample size
    if (statistics.count < 3) {
      factors.push('Insufficient sample size');
      riskScore += 30;
    } else if (statistics.count < 5) {
      factors.push('Small sample size');
      riskScore += 10;
    }
    
    // Skewness
    if (Math.abs(statistics.skewness) > 2) {
      factors.push('Highly skewed distribution');
      riskScore += 15;
    } else if (Math.abs(statistics.skewness) > 1) {
      factors.push('Moderately skewed distribution');
      riskScore += 5;
    }
    
    let level: 'low' | 'medium' | 'high';
    if (riskScore >= 50) {
      level = 'high';
    } else if (riskScore >= 25) {
      level = 'medium';
    } else {
      level = 'low';
    }
    
    const confidence = Math.min(1.0, Math.max(0.1, 1.0 - (Math.abs(50 - riskScore) / 100)));
    
    return { level, factors, confidence };
  }

  /**
   * Evaluate data quality
   */
  private evaluateDataQuality(items: BidLineItem[]): {
    completeness: number;
    consistency: number;
    accuracy: number;
    overall: number;
  } {
    // Completeness: percentage of items with pricing
    const completeness = (items.filter(item => item.extended > 0).length / items.length) * 100;
    
    // Consistency: based on coefficient of variation of unit prices
    const unitPrices = items.filter(item => item.unitPrice > 0).map(item => item.unitPrice);
    let consistency = 100;
    if (unitPrices.length > 1) {
      const stats = this.calculateStatistics(unitPrices);
      consistency = Math.max(0, 100 - (stats.coefficientOfVariation * 100));
    }
    
    // Accuracy: based on confidence scores from document extraction
    const accuracy = items.reduce((acc, item) => acc + item.confidenceScore, 0) / items.length * 100;
    
    // Overall quality score
    const overall = (completeness * 0.4 + consistency * 0.3 + accuracy * 0.3);
    
    return { completeness, consistency, accuracy, overall };
  }

  /**
   * Calculate vendor performance metrics
   */
  private calculateVendorPerformance(
    bidLineItems: BidLineItem[], 
    analyzedGroups: GroupedLineItem[]
  ): VendorPerformance[] {
    const vendorMap = new Map<string, {
      vendorId: string;
      vendorName: string;
      items: BidLineItem[];
      ranks: number[];
      outliers: number;
    }>();

    // Collect vendor data
    bidLineItems.forEach(item => {
      if (!vendorMap.has(item.submissionId)) {
        vendorMap.set(item.submissionId, {
          vendorId: item.submissionId,
          vendorName: item.vendorName,
          items: [],
          ranks: [],
          outliers: 0
        });
      }
      vendorMap.get(item.submissionId)!.items.push(item);
    });

    // Calculate ranks and outliers
    analyzedGroups.forEach(group => {
      const sortedItems = group.items.filter(item => item.extended > 0)
        .sort((a, b) => a.extended - b.extended);
      
      sortedItems.forEach((item, index) => {
        const vendor = vendorMap.get(item.submissionId);
        if (vendor) {
          vendor.ranks.push((index + 1) / sortedItems.length);
          if (group.outliers.some(o => o.id === item.id)) {
            vendor.outliers++;
          }
        }
      });
    });

    // Calculate performance metrics
    return Array.from(vendorMap.values()).map(vendor => {
      const totalItems = vendor.items.length;
      const pricedItems = vendor.items.filter(item => item.extended > 0).length;
      const competitiveItems = vendor.ranks.filter(rank => rank <= 0.33).length;
      const averageRank = vendor.ranks.length > 0 
        ? vendor.ranks.reduce((acc, rank) => acc + rank, 0) / vendor.ranks.length 
        : 1;
      
      const competitivenessScore = competitiveItems / Math.max(1, pricedItems) * 100;
      const reliabilityScore = pricedItems / totalItems * 100;
      const outlierPenalty = vendor.outliers / Math.max(1, pricedItems) * 20;
      
      const overallScore = Math.max(0, 
        (competitivenessScore * 0.4 + reliabilityScore * 0.4 + (100 - averageRank * 100) * 0.2) - outlierPenalty
      );

      return {
        vendorId: vendor.vendorId,
        vendorName: vendor.vendorName,
        totalItems,
        competitiveItems,
        outlierItems: vendor.outliers,
        missingItems: totalItems - pricedItems,
        averageRank,
        competitivenessScore,
        reliabilityScore,
        overallScore
      };
    }).sort((a, b) => b.overallScore - a.overallScore);
  }

  /**
   * Perform market analysis
   */
  private performMarketAnalysis(analyzedGroups: GroupedLineItem[]): MarketAnalysis {
    const totalItems = analyzedGroups.length;
    const competitiveItems = analyzedGroups.filter(group => 
      group.statistics.coefficientOfVariation < 0.15 && group.statistics.count >= 3
    ).length;
    const nonCompetitiveItems = totalItems - competitiveItems;
    
    const averageCompetition = analyzedGroups.reduce((acc, group) => 
      acc + group.statistics.count, 0
    ) / totalItems;
    
    const priceVolatility = analyzedGroups.reduce((acc, group) => 
      acc + group.statistics.coefficientOfVariation, 0
    ) / totalItems;
    
    const marketMaturity = competitiveItems / totalItems;
    
    const riskDistribution = {
      low: analyzedGroups.filter(group => group.riskAssessment.level === 'low').length,
      medium: analyzedGroups.filter(group => group.riskAssessment.level === 'medium').length,
      high: analyzedGroups.filter(group => group.riskAssessment.level === 'high').length
    };

    return {
      totalItems,
      competitiveItems,
      nonCompetitiveItems,
      averageCompetition,
      priceVolatility,
      marketMaturity,
      riskDistribution
    };
  }

  /**
   * Generate analysis recommendations
   */
  private generateRecommendations(
    analyzedGroups: GroupedLineItem[],
    vendorPerformance: VendorPerformance[],
    marketAnalysis: MarketAnalysis
  ): string[] {
    const recommendations: string[] = [];
    
    // Market-level recommendations
    if (marketAnalysis.marketMaturity < 0.5) {
      recommendations.push("Market shows low maturity with high price volatility. Consider pre-qualification of vendors.");
    }
    
    if (marketAnalysis.averageCompetition < 3) {
      recommendations.push("Low vendor participation. Consider expanding vendor outreach or adjusting requirements.");
    }
    
    if (marketAnalysis.priceVolatility > 0.3) {
      recommendations.push("High price volatility detected. Implement additional scope clarifications.");
    }
    
    // High-risk items
    const highRiskItems = analyzedGroups.filter(group => group.riskAssessment.level === 'high');
    if (highRiskItems.length > 0) {
      recommendations.push(`${highRiskItems.length} line items require additional scrutiny due to high risk factors.`);
    }
    
    // Vendor-specific recommendations
    const unreliableVendors = vendorPerformance.filter(vendor => vendor.reliabilityScore < 70);
    if (unreliableVendors.length > 0) {
      recommendations.push(`${unreliableVendors.length} vendors have low response rates. Follow up on missing items.`);
    }
    
    const outlierVendors = vendorPerformance.filter(vendor => vendor.outlierItems > vendor.totalItems * 0.2);
    if (outlierVendors.length > 0) {
      recommendations.push(`${outlierVendors.length} vendors have high outlier rates. Request pricing clarifications.`);
    }
    
    // Data quality recommendations
    const lowQualityGroups = analyzedGroups.filter(group => group.dataQuality.overall < 70);
    if (lowQualityGroups.length > 0) {
      recommendations.push(`${lowQualityGroups.length} line items have data quality issues. Verify extraction accuracy.`);
    }
    
    return recommendations;
  }

  /**
   * Create empty statistics object
   */
  private createEmptyStatistics(): StatisticalSummary {
    return {
      count: 0,
      mean: 0,
      median: 0,
      min: 0,
      max: 0,
      range: 0,
      variance: 0,
      standardDeviation: 0,
      coefficientOfVariation: 0,
      q1: 0,
      q3: 0,
      iqr: 0,
      skewness: 0,
      kurtosis: 0
    };
  }

  /**
   * Update analysis settings
   */
  public updateSettings(outlierThreshold?: number, confidenceThreshold?: number): void {
    if (outlierThreshold !== undefined) {
      this.outlierThreshold = outlierThreshold;
    }
    if (confidenceThreshold !== undefined) {
      this.confidenceThreshold = confidenceThreshold;
    }
  }
}

export default BidAnalysisEngine;
