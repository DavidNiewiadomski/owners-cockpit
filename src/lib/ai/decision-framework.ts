import { supabase } from '@/integrations/supabase/client';

export interface Decision {
  id: string;
  type: 'approval' | 'resource_allocation' | 'schedule_change' | 'risk_mitigation' | 'cost_control';
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  impact: {
    cost?: number;
    schedule?: number; // days
    safety?: 'low' | 'medium' | 'high';
    quality?: 'low' | 'medium' | 'high';
  };
  options: DecisionOption[];
  recommendation?: DecisionOption;
  confidence: number;
  factors: DecisionFactor[];
  requiresApproval: boolean;
  approvalLevel?: 'pm' | 'director' | 'executive';
  deadline?: Date;
  relatedItems?: {
    type: string;
    id: string;
    name: string;
  }[];
}

export interface DecisionOption {
  id: string;
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  risks: Risk[];
  estimatedCost?: number;
  estimatedDuration?: number;
  confidence: number;
  score: number;
}

export interface Risk {
  id: string;
  description: string;
  probability: number; // 0-1
  impact: number; // 1-5
  category: 'cost' | 'schedule' | 'safety' | 'quality' | 'legal' | 'reputation';
  mitigation?: string;
  owner?: string;
}

export interface DecisionFactor {
  name: string;
  weight: number;
  value: number;
  reasoning: string;
}

export interface DecisionContext {
  projectId: string;
  userId: string;
  projectPhase: string;
  budgetRemaining: number;
  scheduleFloat: number;
  riskTolerance: 'low' | 'medium' | 'high';
  stakeholderPriorities: {
    cost: number;
    schedule: number;
    quality: number;
    safety: number;
  };
}

export class DecisionFramework {
  private context: DecisionContext;
  private historicalDecisions: Map<string, Decision[]> = new Map();
  private learningData: any[] = [];

  constructor(context: DecisionContext) {
    this.context = context;
    this.loadHistoricalData();
  }

  private async loadHistoricalData() {
    const { data } = await supabase
      .from('ai_decisions')
      .select('*')
      .eq('project_id', this.context.projectId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (data) {
      data.forEach(decision => {
        const type = decision.type;
        if (!this.historicalDecisions.has(type)) {
          this.historicalDecisions.set(type, []);
        }
        this.historicalDecisions.get(type)!.push(decision);
      });
    }
  }

  async analyzeDecision(
    type: Decision['type'],
    title: string,
    description: string,
    options: Partial<DecisionOption>[],
    relatedData?: any
  ): Promise<Decision> {
    console.log(`🧠 Analyzing decision: ${title}`);

    // Calculate urgency based on type and context
    const urgency = this.calculateUrgency(type, relatedData);
    
    // Assess impact
    const impact = await this.assessImpact(type, options, relatedData);
    
    // Evaluate each option
    const evaluatedOptions = await Promise.all(
      options.map(opt => this.evaluateOption(opt, type, impact))
    );
    
    // Identify key factors
    const factors = this.identifyDecisionFactors(type, evaluatedOptions, impact);
    
    // Make recommendation
    const recommendation = this.makeRecommendation(evaluatedOptions, factors);
    
    // Determine approval requirements
    const { requiresApproval, approvalLevel } = this.determineApprovalRequirements(
      type,
      impact,
      recommendation
    );

    const decision: Decision = {
      id: this.generateDecisionId(),
      type,
      title,
      description,
      urgency,
      impact,
      options: evaluatedOptions,
      recommendation,
      confidence: this.calculateConfidence(evaluatedOptions, factors),
      factors,
      requiresApproval,
      approvalLevel,
      deadline: this.calculateDeadline(urgency),
      relatedItems: relatedData?.relatedItems
    };

    // Store decision for learning
    await this.storeDecision(decision);

    return decision;
  }

  private calculateUrgency(type: Decision['type'], data: any): Decision['urgency'] {
    // Complex urgency calculation based on multiple factors
    let urgencyScore = 0;

    // Type-based urgency
    const typeUrgency = {
      'risk_mitigation': 3,
      'safety': 4,
      'approval': 2,
      'resource_allocation': 2,
      'schedule_change': 3,
      'cost_control': 2
    };

    urgencyScore += typeUrgency[type] || 2;

    // Context-based adjustments
    if (this.context.scheduleFloat < 5) urgencyScore += 2;
    if (this.context.budgetRemaining < 0.1) urgencyScore += 1;
    
    // Data-based adjustments
    if (data?.severity === 'critical') urgencyScore += 3;
    if (data?.affectedCriticalPath) urgencyScore += 2;
    if (data?.regulatoryDeadline) urgencyScore += 2;

    if (urgencyScore >= 8) return 'critical';
    if (urgencyScore >= 6) return 'high';
    if (urgencyScore >= 4) return 'medium';
    return 'low';
  }

  private async assessImpact(
    type: Decision['type'],
    options: Partial<DecisionOption>[],
    data: any
  ): Promise<Decision['impact']> {
    const impact: Decision['impact'] = {};

    // Calculate cost impact
    const costImpacts = options.map(opt => opt.estimatedCost || 0);
    impact.cost = Math.max(...costImpacts);

    // Calculate schedule impact
    const scheduleImpacts = options.map(opt => opt.estimatedDuration || 0);
    impact.schedule = Math.max(...scheduleImpacts);

    // Assess safety impact
    if (type === 'risk_mitigation' || data?.safetyRelated) {
      impact.safety = this.assessSafetyImpact(options, data);
    }

    // Assess quality impact
    if (type === 'approval' || type === 'cost_control') {
      impact.quality = this.assessQualityImpact(options, data);
    }

    return impact;
  }

  private async evaluateOption(
    option: Partial<DecisionOption>,
    type: Decision['type'],
    impact: Decision['impact']
  ): Promise<DecisionOption> {
    const risks = await this.identifyRisks(option, type);
    const score = this.calculateOptionScore(option, risks, impact);

    return {
      id: this.generateOptionId(),
      title: option.title || 'Option',
      description: option.description || '',
      pros: option.pros || this.generatePros(option, type),
      cons: option.cons || this.generateCons(option, type),
      risks,
      estimatedCost: option.estimatedCost,
      estimatedDuration: option.estimatedDuration,
      confidence: this.calculateOptionConfidence(option, risks),
      score
    };
  }

  private async identifyRisks(option: Partial<DecisionOption>, type: Decision['type']): Promise<Risk[]> {
    const risks: Risk[] = [];

    // Cost overrun risk
    if (option.estimatedCost && option.estimatedCost > this.context.budgetRemaining * 0.2) {
      risks.push({
        id: this.generateRiskId(),
        description: 'Potential budget overrun',
        probability: 0.3,
        impact: 3,
        category: 'cost',
        mitigation: 'Secure additional funding or reduce scope'
      });
    }

    // Schedule delay risk
    if (option.estimatedDuration && option.estimatedDuration > this.context.scheduleFloat) {
      risks.push({
        id: this.generateRiskId(),
        description: 'Critical path delay',
        probability: 0.4,
        impact: 4,
        category: 'schedule',
        mitigation: 'Accelerate other activities or add resources'
      });
    }

    // Type-specific risks
    switch (type) {
      case 'risk_mitigation':
        if (!option.estimatedCost || option.estimatedCost < 10000) {
          risks.push({
            id: this.generateRiskId(),
            description: 'Mitigation may be insufficient',
            probability: 0.25,
            impact: 3,
            category: 'quality',
            mitigation: 'Consider more comprehensive solution'
          });
        }
        break;

      case 'resource_allocation':
        risks.push({
          id: this.generateRiskId(),
          description: 'Resource conflicts with other projects',
          probability: 0.2,
          impact: 2,
          category: 'schedule',
          mitigation: 'Coordinate with resource manager'
        });
        break;
    }

    return risks;
  }

  private calculateOptionScore(
    option: Partial<DecisionOption>,
    risks: Risk[],
    impact: Decision['impact']
  ): number {
    let score = 100;

    // Cost factor
    if (option.estimatedCost) {
      const costRatio = option.estimatedCost / (this.context.budgetRemaining || 1);
      score -= costRatio * this.context.stakeholderPriorities.cost * 10;
    }

    // Schedule factor
    if (option.estimatedDuration) {
      const scheduleRatio = option.estimatedDuration / (this.context.scheduleFloat || 1);
      score -= scheduleRatio * this.context.stakeholderPriorities.schedule * 10;
    }

    // Risk factor
    const riskScore = risks.reduce((sum, risk) => sum + (risk.probability * risk.impact), 0);
    score -= riskScore * 5;

    // Positive adjustments for benefits
    if (option.pros && option.pros.length > 3) score += 10;
    if (impact.safety === 'low') score += 15;
    if (impact.quality === 'high') score -= 10; // Negative quality impact reduces score

    return Math.max(0, Math.min(100, score));
  }

  private identifyDecisionFactors(
    type: Decision['type'],
    options: DecisionOption[],
    impact: Decision['impact']
  ): DecisionFactor[] {
    const factors: DecisionFactor[] = [];

    // Always consider cost
    factors.push({
      name: 'Cost Impact',
      weight: this.context.stakeholderPriorities.cost,
      value: impact.cost ? Math.min(100, (impact.cost / this.context.budgetRemaining) * 100) : 0,
      reasoning: `Cost represents ${((impact.cost || 0) / this.context.budgetRemaining * 100).toFixed(1)}% of remaining budget`
    });

    // Always consider schedule
    factors.push({
      name: 'Schedule Impact',
      weight: this.context.stakeholderPriorities.schedule,
      value: impact.schedule ? Math.min(100, (impact.schedule / this.context.scheduleFloat) * 100) : 0,
      reasoning: `Impacts ${impact.schedule || 0} days of ${this.context.scheduleFloat} day float`
    });

    // Risk factor
    const avgRiskScore = options.reduce((sum, opt) => 
      sum + opt.risks.reduce((rSum, risk) => rSum + (risk.probability * risk.impact), 0), 0
    ) / options.length;
    
    factors.push({
      name: 'Risk Level',
      weight: this.context.riskTolerance === 'low' ? 0.4 : 0.2,
      value: avgRiskScore * 10,
      reasoning: `Average risk score of ${avgRiskScore.toFixed(1)} across all options`
    });

    // Type-specific factors
    if (type === 'risk_mitigation' || impact.safety) {
      factors.push({
        name: 'Safety Impact',
        weight: this.context.stakeholderPriorities.safety,
        value: impact.safety === 'high' ? 80 : impact.safety === 'medium' ? 50 : 20,
        reasoning: `${impact.safety || 'low'} safety impact identified`
      });
    }

    if (type === 'approval' || impact.quality) {
      factors.push({
        name: 'Quality Impact',
        weight: this.context.stakeholderPriorities.quality,
        value: impact.quality === 'high' ? 80 : impact.quality === 'medium' ? 50 : 20,
        reasoning: `${impact.quality || 'low'} quality impact expected`
      });
    }

    return factors;
  }

  private makeRecommendation(
    options: DecisionOption[],
    factors: DecisionFactor[]
  ): DecisionOption | undefined {
    if (options.length === 0) return undefined;

    // Sort options by score
    const sortedOptions = [...options].sort((a, b) => b.score - a.score);
    
    // Check if top option is significantly better
    if (sortedOptions.length > 1) {
      const scoreDiff = sortedOptions[0].score - sortedOptions[1].score;
      if (scoreDiff < 10) {
        // Too close to call - need human judgment
        console.log('Options too close for autonomous decision');
        return undefined;
      }
    }

    // Validate against minimum thresholds
    const topOption = sortedOptions[0];
    if (topOption.score < 50) {
      console.log('No option meets minimum score threshold');
      return undefined;
    }

    // Check risk tolerance
    const totalRisk = topOption.risks.reduce((sum, risk) => sum + (risk.probability * risk.impact), 0);
    if (this.context.riskTolerance === 'low' && totalRisk > 5) {
      console.log('Risk too high for current tolerance level');
      return undefined;
    }

    return topOption;
  }

  private determineApprovalRequirements(
    type: Decision['type'],
    impact: Decision['impact'],
    recommendation?: DecisionOption
  ): { requiresApproval: boolean; approvalLevel?: 'pm' | 'director' | 'executive' } {
    let requiresApproval = false;
    let approvalLevel: 'pm' | 'director' | 'executive' | undefined;

    // Cost-based approval
    if (impact.cost) {
      if (impact.cost > 100000) {
        requiresApproval = true;
        approvalLevel = 'executive';
      } else if (impact.cost > 50000) {
        requiresApproval = true;
        approvalLevel = 'director';
      } else if (impact.cost > 10000) {
        requiresApproval = true;
        approvalLevel = 'pm';
      }
    }

    // Safety-based approval
    if (impact.safety === 'high') {
      requiresApproval = true;
      approvalLevel = approvalLevel === 'pm' ? 'director' : approvalLevel || 'director';
    }

    // Type-based approval
    if (type === 'approval' || type === 'risk_mitigation') {
      requiresApproval = true;
      approvalLevel = approvalLevel || 'pm';
    }

    // No recommendation requires approval
    if (!recommendation) {
      requiresApproval = true;
      approvalLevel = approvalLevel || 'pm';
    }

    return { requiresApproval, approvalLevel };
  }

  private calculateConfidence(options: DecisionOption[], factors: DecisionFactor[]): number {
    let confidence = 0;

    // Data quality component
    const dataCompleteness = options.every(opt => opt.estimatedCost && opt.estimatedDuration) ? 20 : 10;
    confidence += dataCompleteness;

    // Historical precedent component  
    const historicalMatches = this.findHistoricalPrecedents(options[0]?.title || '');
    confidence += Math.min(30, historicalMatches.length * 10);

    // Option differentiation component
    if (options.length > 1) {
      const scores = options.map(opt => opt.score);
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      const variance = scores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) / scores.length;
      confidence += variance > 100 ? 20 : 10;
    }

    // Factor clarity component
    const highWeightFactors = factors.filter(f => f.weight > 0.3);
    confidence += highWeightFactors.length > 0 ? 20 : 10;

    // Risk clarity component
    const totalRisks = options.reduce((sum, opt) => sum + opt.risks.length, 0);
    confidence += totalRisks > 0 ? 10 : 5;

    return Math.min(100, confidence);
  }

  private findHistoricalPrecedents(title: string): Decision[] {
    const precedents: Decision[] = [];
    const keywords = title.toLowerCase().split(' ');

    this.historicalDecisions.forEach(decisions => {
      decisions.forEach(decision => {
        const decisionKeywords = decision.title.toLowerCase().split(' ');
        const matchCount = keywords.filter(kw => decisionKeywords.includes(kw)).length;
        if (matchCount >= 2) {
          precedents.push(decision);
        }
      });
    });

    return precedents;
  }

  private async storeDecision(decision: Decision) {
    const { error } = await supabase.from('ai_decisions').insert({
      project_id: this.context.projectId,
      user_id: this.context.userId,
      type: decision.type,
      title: decision.title,
      description: decision.description,
      urgency: decision.urgency,
      impact: decision.impact,
      options: decision.options,
      recommendation_id: decision.recommendation?.id,
      confidence: decision.confidence,
      factors: decision.factors,
      requires_approval: decision.requiresApproval,
      approval_level: decision.approvalLevel
    });

    if (!error) {
      // Update learning data
      this.learningData.push({
        decision,
        context: this.context,
        timestamp: new Date()
      });
    }
  }

  async applyDecision(decisionId: string, optionId: string, approvedBy?: string): Promise<any> {
    // Execute the chosen option
    const decision = await this.getDecision(decisionId);
    if (!decision) throw new Error('Decision not found');

    const option = decision.options.find(opt => opt.id === optionId);
    if (!option) throw new Error('Option not found');

    // Log the decision execution
    await supabase.from('ai_decision_executions').insert({
      decision_id: decisionId,
      option_id: optionId,
      executed_by: this.context.userId,
      approved_by: approvedBy,
      executed_at: new Date().toISOString()
    });

    // Return execution plan
    return {
      decision,
      option,
      executionPlan: this.generateExecutionPlan(decision, option)
    };
  }

  private generateExecutionPlan(decision: Decision, option: DecisionOption): any {
    return {
      immediate_actions: this.getImmediateActions(decision.type, option),
      monitoring_plan: this.getMonitoringPlan(option.risks),
      success_criteria: this.getSuccessCriteria(decision, option),
      rollback_plan: this.getRollbackPlan(decision.type, option)
    };
  }

  // Helper methods
  private assessSafetyImpact(options: Partial<DecisionOption>[], data: any): 'low' | 'medium' | 'high' {
    if (data?.safetyScore < 70) return 'high';
    if (data?.safetyScore < 85) return 'medium';
    return 'low';
  }

  private assessQualityImpact(options: Partial<DecisionOption>[], data: any): 'low' | 'medium' | 'high' {
    if (data?.qualityScore < 70) return 'high';
    if (data?.qualityScore < 85) return 'medium';
    return 'low';
  }

  private generatePros(option: Partial<DecisionOption>, type: Decision['type']): string[] {
    const pros = [];
    if (option.estimatedCost && option.estimatedCost < 10000) pros.push('Low cost impact');
    if (option.estimatedDuration && option.estimatedDuration < 3) pros.push('Minimal schedule impact');
    if (type === 'risk_mitigation') pros.push('Reduces project risk');
    return pros;
  }

  private generateCons(option: Partial<DecisionOption>, type: Decision['type']): string[] {
    const cons = [];
    if (option.estimatedCost && option.estimatedCost > 50000) cons.push('Significant cost');
    if (option.estimatedDuration && option.estimatedDuration > 7) cons.push('Schedule impact');
    return cons;
  }

  private calculateOptionConfidence(option: Partial<DecisionOption>, risks: Risk[]): number {
    let confidence = 80;
    confidence -= risks.length * 5;
    if (!option.estimatedCost) confidence -= 10;
    if (!option.estimatedDuration) confidence -= 10;
    return Math.max(20, confidence);
  }

  private calculateDeadline(urgency: Decision['urgency']): Date {
    const deadline = new Date();
    switch (urgency) {
      case 'critical':
        deadline.setHours(deadline.getHours() + 4);
        break;
      case 'high':
        deadline.setDate(deadline.getDate() + 1);
        break;
      case 'medium':
        deadline.setDate(deadline.getDate() + 3);
        break;
      case 'low':
        deadline.setDate(deadline.getDate() + 7);
        break;
    }
    return deadline;
  }

  private async getDecision(id: string): Promise<Decision | null> {
    const { data } = await supabase
      .from('ai_decisions')
      .select('*')
      .eq('id', id)
      .single();
    
    return data;
  }

  private getImmediateActions(type: Decision['type'], option: DecisionOption): string[] {
    const actions = [];
    
    switch (type) {
      case 'approval':
        actions.push('Update project documentation');
        actions.push('Notify affected teams');
        break;
      case 'resource_allocation':
        actions.push('Update resource calendar');
        actions.push('Confirm availability with resources');
        break;
      case 'risk_mitigation':
        actions.push('Implement mitigation measures');
        actions.push('Update risk register');
        break;
    }
    
    return actions;
  }

  private getMonitoringPlan(risks: Risk[]): any {
    return {
      frequency: risks.some(r => r.impact >= 4) ? 'daily' : 'weekly',
      metrics: risks.map(r => ({
        risk: r.description,
        indicator: this.getRiskIndicator(r),
        threshold: this.getRiskThreshold(r)
      })),
      escalation: 'Auto-escalate if threshold breached'
    };
  }

  private getSuccessCriteria(decision: Decision, option: DecisionOption): string[] {
    const criteria = [];
    
    if (option.estimatedCost) {
      criteria.push(`Stay within ${option.estimatedCost * 1.1} budget`);
    }
    if (option.estimatedDuration) {
      criteria.push(`Complete within ${option.estimatedDuration} days`);
    }
    if (decision.impact.safety) {
      criteria.push('No safety incidents');
    }
    
    return criteria;
  }

  private getRollbackPlan(type: Decision['type'], option: DecisionOption): any {
    return {
      triggers: ['Budget exceeded by 20%', 'Schedule delayed by 30%', 'Safety incident'],
      actions: ['Pause implementation', 'Reassess decision', 'Implement alternative'],
      approval: 'PM approval required for rollback'
    };
  }

  private getRiskIndicator(risk: Risk): string {
    switch (risk.category) {
      case 'cost':
        return 'Budget variance %';
      case 'schedule':
        return 'Schedule variance days';
      case 'safety':
        return 'Near-miss count';
      default:
        return 'Occurrence count';
    }
  }

  private getRiskThreshold(risk: Risk): number {
    return risk.impact >= 4 ? 1 : risk.impact >= 3 ? 3 : 5;
  }

  private generateDecisionId(): string {
    return `dec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateOptionId(): string {
    return `opt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateRiskId(): string {
    return `risk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}