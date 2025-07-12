import { supabase } from '@/integrations/supabase/client';

export interface LearningEvent {
  id: string;
  timestamp: Date;
  eventType: 'action' | 'decision' | 'feedback' | 'outcome';
  category: string;
  context: any;
  result: any;
  success: boolean;
  confidence: number;
  feedback?: UserFeedback;
  outcomes?: Outcome[];
  patterns?: Pattern[];
}

export interface UserFeedback {
  rating: 1 | 2 | 3 | 4 | 5;
  helpful: boolean;
  accurate: boolean;
  comment?: string;
  corrections?: any;
  preferredAction?: string;
}

export interface Outcome {
  metric: string;
  expected: number;
  actual: number;
  variance: number;
  timeframe: string;
}

export interface Pattern {
  id: string;
  type: 'sequence' | 'correlation' | 'anomaly' | 'preference';
  description: string;
  occurrences: number;
  confidence: number;
  context: any;
  recommendations: string[];
}

export interface LearningModel {
  projectId: string;
  modelVersion: string;
  lastUpdated: Date;
  accuracy: number;
  patterns: Pattern[];
  preferences: UserPreferences;
  performance: PerformanceMetrics;
  improvements: Improvement[];
}

export interface UserPreferences {
  communicationStyle: 'detailed' | 'concise' | 'visual';
  riskTolerance: 'low' | 'medium' | 'high';
  priorityWeights: {
    cost: number;
    schedule: number;
    quality: number;
    safety: number;
  };
  preferredActions: Map<string, string[]>;
  avoidedActions: Set<string>;
  approvalThresholds: {
    cost: number;
    schedule: number;
    risk: string;
  };
}

export interface PerformanceMetrics {
  successRate: number;
  avgConfidence: number;
  avgResponseTime: number;
  userSatisfaction: number;
  outcomeAccuracy: number;
  patternDetectionRate: number;
}

export interface Improvement {
  id: string;
  type: 'algorithm' | 'parameter' | 'workflow' | 'knowledge';
  description: string;
  impact: number;
  implemented: boolean;
  results?: any;
}

export class LearningSystem {
  private projectId: string;
  private userId: string;
  private events: LearningEvent[] = [];
  private model: LearningModel;
  private feedbackQueue: UserFeedback[] = [];
  private patternThreshold = 3; // Minimum occurrences for pattern detection

  constructor(projectId: string, userId: string) {
    this.projectId = projectId;
    this.userId = userId;
    this.model = this.initializeModel();
    this.loadHistoricalData();
  }

  private initializeModel(): LearningModel {
    return {
      projectId: this.projectId,
      modelVersion: '1.0.0',
      lastUpdated: new Date(),
      accuracy: 85,
      patterns: [],
      preferences: {
        communicationStyle: 'concise',
        riskTolerance: 'medium',
        priorityWeights: {
          cost: 0.25,
          schedule: 0.25,
          quality: 0.25,
          safety: 0.25
        },
        preferredActions: new Map(),
        avoidedActions: new Set(),
        approvalThresholds: {
          cost: 50000,
          schedule: 7,
          risk: 'high'
        }
      },
      performance: {
        successRate: 0,
        avgConfidence: 0,
        avgResponseTime: 0,
        userSatisfaction: 0,
        outcomeAccuracy: 0,
        patternDetectionRate: 0
      },
      improvements: []
    };
  }

  private async loadHistoricalData() {
    const { data: events } = await supabase
      .from('ai_learning_events')
      .select('*')
      .eq('project_id', this.projectId)
      .order('created_at', { ascending: false })
      .limit(1000);

    if (events) {
      this.events = events.map(e => ({
        ...e,
        timestamp: new Date(e.created_at)
      }));
      
      // Rebuild model from historical data
      await this.rebuildModel();
    }
  }

  async recordEvent(event: Omit<LearningEvent, 'id' | 'timestamp'>): Promise<void> {
    const learningEvent: LearningEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: new Date()
    };

    this.events.push(learningEvent);

    // Store in database
    await supabase.from('ai_learning_events').insert({
      project_id: this.projectId,
      user_id: this.userId,
      event_type: event.eventType,
      category: event.category,
      context: event.context,
      result: event.result,
      success: event.success,
      confidence: event.confidence,
      feedback: event.feedback,
      outcomes: event.outcomes
    });

    // Update model in real-time
    await this.updateModel(learningEvent);
  }

  async provideFeedback(
    eventId: string,
    feedback: UserFeedback
  ): Promise<void> {
    const event = this.events.find(e => e.id === eventId);
    if (!event) return;

    event.feedback = feedback;
    this.feedbackQueue.push(feedback);

    // Update event in database
    await supabase
      .from('ai_learning_events')
      .update({ feedback })
      .eq('id', eventId);

    // Process feedback immediately
    await this.processFeedback(event, feedback);

    // Trigger model update if significant feedback
    if (feedback.rating <= 2 || feedback.corrections) {
      await this.updateModel(event);
    }
  }

  async trackOutcome(
    eventId: string,
    outcomes: Outcome[]
  ): Promise<void> {
    const event = this.events.find(e => e.id === eventId);
    if (!event) return;

    event.outcomes = outcomes;

    // Update event in database
    await supabase
      .from('ai_learning_events')
      .update({ outcomes })
      .eq('id', eventId);

    // Analyze outcome accuracy
    const accuracy = this.calculateOutcomeAccuracy(outcomes);
    
    // Update performance metrics
    this.model.performance.outcomeAccuracy = 
      (this.model.performance.outcomeAccuracy * 0.9) + (accuracy * 0.1);

    // Detect patterns from outcomes
    await this.detectOutcomePatterns(event, outcomes);
  }

  private async updateModel(event: LearningEvent): Promise<void> {
    console.log(`📚 Updating learning model with event: ${event.eventType}`);

    // Update performance metrics
    this.updatePerformanceMetrics(event);

    // Update preferences based on feedback
    if (event.feedback) {
      this.updatePreferences(event);
    }

    // Detect new patterns
    const newPatterns = await this.detectPatterns();
    
    // Merge new patterns with existing
    this.mergePatterns(newPatterns);

    // Generate improvements
    const improvements = this.generateImprovements();
    this.model.improvements.push(...improvements);

    // Update model metadata
    this.model.lastUpdated = new Date();
    this.model.accuracy = this.calculateModelAccuracy();

    // Persist model
    await this.saveModel();
  }

  private updatePerformanceMetrics(event: LearningEvent): void {
    const metrics = this.model.performance;
    const eventCount = this.events.length;

    // Update success rate
    const successEvents = this.events.filter(e => e.success).length;
    metrics.successRate = successEvents / eventCount;

    // Update average confidence
    const totalConfidence = this.events.reduce((sum, e) => sum + e.confidence, 0);
    metrics.avgConfidence = totalConfidence / eventCount;

    // Update user satisfaction from feedback
    const feedbackEvents = this.events.filter(e => e.feedback);
    if (feedbackEvents.length > 0) {
      const totalRating = feedbackEvents.reduce((sum, e) => sum + (e.feedback?.rating || 0), 0);
      metrics.userSatisfaction = totalRating / feedbackEvents.length;
    }
  }

  private updatePreferences(event: LearningEvent): void {
    if (!event.feedback) return;

    const prefs = this.model.preferences;

    // Update communication style preference
    if (event.feedback.comment?.includes('more detail')) {
      prefs.communicationStyle = 'detailed';
    } else if (event.feedback.comment?.includes('too much')) {
      prefs.communicationStyle = 'concise';
    }

    // Update preferred actions
    if (event.feedback.preferredAction) {
      const category = event.category;
      if (!prefs.preferredActions.has(category)) {
        prefs.preferredActions.set(category, []);
      }
      prefs.preferredActions.get(category)!.push(event.feedback.preferredAction);
    }

    // Update avoided actions based on low ratings
    if (event.feedback.rating <= 2) {
      prefs.avoidedActions.add(`${event.category}:${event.context.action}`);
    }

    // Adjust priority weights based on corrections
    if (event.feedback.corrections?.priorityAdjustment) {
      const adj = event.feedback.corrections.priorityAdjustment;
      Object.keys(adj).forEach(key => {
        if (key in prefs.priorityWeights) {
          prefs.priorityWeights[key as keyof typeof prefs.priorityWeights] = adj[key];
        }
      });
    }
  }

  private async detectPatterns(): Promise<Pattern[]> {
    const patterns: Pattern[] = [];

    // Sequence patterns - common action sequences
    const sequences = this.detectSequencePatterns();
    patterns.push(...sequences);

    // Correlation patterns - actions that lead to success/failure
    const correlations = this.detectCorrelationPatterns();
    patterns.push(...correlations);

    // Anomaly patterns - unusual but successful approaches
    const anomalies = this.detectAnomalyPatterns();
    patterns.push(...anomalies);

    // Preference patterns - user-specific preferences
    const preferences = this.detectPreferencePatterns();
    patterns.push(...preferences);

    return patterns;
  }

  private detectSequencePatterns(): Pattern[] {
    const patterns: Pattern[] = [];
    const sequenceMap = new Map<string, number>();

    // Look for 3-action sequences
    for (let i = 0; i < this.events.length - 2; i++) {
      const sequence = [
        this.events[i].category,
        this.events[i + 1].category,
        this.events[i + 2].category
      ].join(' -> ');

      sequenceMap.set(sequence, (sequenceMap.get(sequence) || 0) + 1);
    }

    // Convert to patterns if above threshold
    sequenceMap.forEach((count, sequence) => {
      if (count >= this.patternThreshold) {
        patterns.push({
          id: this.generatePatternId(),
          type: 'sequence',
          description: `Common action sequence: ${sequence}`,
          occurrences: count,
          confidence: Math.min(95, 70 + (count * 5)),
          context: { sequence },
          recommendations: [
            `Consider automating this sequence`,
            `Pre-fetch data for subsequent actions`
          ]
        });
      }
    });

    return patterns;
  }

  private detectCorrelationPatterns(): Pattern[] {
    const patterns: Pattern[] = [];
    
    // Group events by category and success
    const categorySuccess = new Map<string, { success: number; total: number }>();
    
    this.events.forEach(event => {
      const key = `${event.category}:${event.context.action || 'default'}`;
      if (!categorySuccess.has(key)) {
        categorySuccess.set(key, { success: 0, total: 0 });
      }
      const stats = categorySuccess.get(key)!;
      stats.total++;
      if (event.success) stats.success++;
    });

    // Identify strong correlations
    categorySuccess.forEach((stats, key) => {
      const successRate = stats.success / stats.total;
      
      if (stats.total >= this.patternThreshold) {
        if (successRate > 0.9) {
          patterns.push({
            id: this.generatePatternId(),
            type: 'correlation',
            description: `High success rate for ${key}`,
            occurrences: stats.total,
            confidence: successRate * 100,
            context: { action: key, stats },
            recommendations: [
              `Prioritize this action type`,
              `Use as default approach`
            ]
          });
        } else if (successRate < 0.3) {
          patterns.push({
            id: this.generatePatternId(),
            type: 'correlation',
            description: `Low success rate for ${key}`,
            occurrences: stats.total,
            confidence: 80,
            context: { action: key, stats },
            recommendations: [
              `Review and improve this action`,
              `Consider alternative approaches`
            ]
          });
        }
      }
    });

    return patterns;
  }

  private detectAnomalyPatterns(): Pattern[] {
    const patterns: Pattern[] = [];
    
    // Find unusual but successful approaches
    const unusualSuccesses = this.events.filter(event => 
      event.success && 
      event.confidence < 50 && 
      (!event.feedback || event.feedback.rating >= 4)
    );

    if (unusualSuccesses.length >= 2) {
      patterns.push({
        id: this.generatePatternId(),
        type: 'anomaly',
        description: 'Low confidence actions that succeeded',
        occurrences: unusualSuccesses.length,
        confidence: 70,
        context: { events: unusualSuccesses.map(e => e.id) },
        recommendations: [
          'Adjust confidence calculation',
          'Learn from unexpected successes'
        ]
      });
    }

    return patterns;
  }

  private detectPreferencePatterns(): Pattern[] {
    const patterns: Pattern[] = [];
    
    // Analyze feedback patterns
    const positiveFeedback = this.events.filter(e => 
      e.feedback && e.feedback.rating >= 4
    );
    
    const negativeFeedback = this.events.filter(e => 
      e.feedback && e.feedback.rating <= 2
    );

    // Common characteristics of well-received actions
    if (positiveFeedback.length >= this.patternThreshold) {
      const commonTraits = this.findCommonTraits(positiveFeedback);
      if (commonTraits.length > 0) {
        patterns.push({
          id: this.generatePatternId(),
          type: 'preference',
          description: 'User prefers actions with these traits',
          occurrences: positiveFeedback.length,
          confidence: 85,
          context: { traits: commonTraits },
          recommendations: commonTraits.map(trait => 
            `Prioritize actions with ${trait}`
          )
        });
      }
    }

    return patterns;
  }

  private findCommonTraits(events: LearningEvent[]): string[] {
    const traits: string[] = [];
    
    // Check for common context properties
    const contextKeys = new Set<string>();
    events.forEach(e => {
      Object.keys(e.context).forEach(key => contextKeys.add(key));
    });

    // Find traits present in most events
    contextKeys.forEach(key => {
      const count = events.filter(e => key in e.context).length;
      if (count > events.length * 0.7) {
        traits.push(key);
      }
    });

    return traits;
  }

  private detectOutcomePatterns(event: LearningEvent, outcomes: Outcome[]): void {
    // Analyze variance patterns
    outcomes.forEach(outcome => {
      if (Math.abs(outcome.variance) > 0.2) {
        const pattern: Pattern = {
          id: this.generatePatternId(),
          type: 'correlation',
          description: `High variance in ${outcome.metric}`,
          occurrences: 1,
          confidence: 60,
          context: { event: event.id, outcome },
          recommendations: [
            `Improve ${outcome.metric} prediction`,
            `Consider additional factors`
          ]
        };
        
        this.model.patterns.push(pattern);
      }
    });
  }

  private mergePatterns(newPatterns: Pattern[]): void {
    newPatterns.forEach(newPattern => {
      const existing = this.model.patterns.find(p => 
        p.type === newPattern.type && 
        p.description === newPattern.description
      );

      if (existing) {
        // Update existing pattern
        existing.occurrences += newPattern.occurrences;
        existing.confidence = (existing.confidence + newPattern.confidence) / 2;
        existing.recommendations = [
          ...new Set([...existing.recommendations, ...newPattern.recommendations])
        ];
      } else {
        // Add new pattern
        this.model.patterns.push(newPattern);
      }
    });

    // Remove low-confidence patterns
    this.model.patterns = this.model.patterns.filter(p => p.confidence > 50);
  }

  private generateImprovements(): Improvement[] {
    const improvements: Improvement[] = [];

    // Algorithm improvements based on patterns
    if (this.model.performance.successRate < 0.8) {
      improvements.push({
        id: this.generateImprovementId(),
        type: 'algorithm',
        description: 'Adjust decision thresholds based on recent failures',
        impact: 15,
        implemented: false
      });
    }

    // Parameter tuning based on feedback
    if (this.model.performance.userSatisfaction < 3.5) {
      improvements.push({
        id: this.generateImprovementId(),
        type: 'parameter',
        description: 'Tune response generation parameters',
        impact: 10,
        implemented: false
      });
    }

    // Workflow improvements from sequences
    const sequencePatterns = this.model.patterns.filter(p => p.type === 'sequence');
    if (sequencePatterns.length > 3) {
      improvements.push({
        id: this.generateImprovementId(),
        type: 'workflow',
        description: 'Create automated workflows for common sequences',
        impact: 20,
        implemented: false
      });
    }

    return improvements;
  }

  private calculateOutcomeAccuracy(outcomes: Outcome[]): number {
    if (outcomes.length === 0) return 100;

    const accuracies = outcomes.map(o => 
      Math.max(0, 100 - Math.abs(o.variance) * 100)
    );

    return accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
  }

  private calculateModelAccuracy(): number {
    const factors = [
      this.model.performance.successRate * 100,
      this.model.performance.outcomeAccuracy,
      this.model.performance.userSatisfaction * 20,
      Math.min(100, 50 + this.model.patterns.length * 2)
    ];

    return factors.reduce((a, b) => a + b, 0) / factors.length;
  }

  private async saveModel(): Promise<void> {
    await supabase.from('ai_learning_models').upsert({
      project_id: this.projectId,
      user_id: this.userId,
      model_data: this.model,
      version: this.model.modelVersion,
      accuracy: this.model.accuracy,
      updated_at: new Date().toISOString()
    });
  }

  private async rebuildModel(): Promise<void> {
    // Recalculate all metrics
    this.updatePerformanceMetrics(this.events[0]);
    
    // Detect all patterns
    const patterns = await this.detectPatterns();
    this.model.patterns = patterns;
    
    // Process all feedback
    this.events.filter(e => e.feedback).forEach(e => {
      this.updatePreferences(e);
    });
    
    // Save rebuilt model
    await this.saveModel();
  }

  private async processFeedback(event: LearningEvent, feedback: UserFeedback): Promise<void> {
    console.log(`💭 Processing user feedback for event ${event.id}`);

    // Immediate adjustments based on feedback
    if (feedback.rating <= 2) {
      // Poor rating - avoid similar actions
      console.log('Poor rating received, adjusting future behavior');
    } else if (feedback.rating >= 4) {
      // Good rating - reinforce similar actions
      console.log('Positive feedback received, reinforcing behavior');
    }

    // Apply corrections if provided
    if (feedback.corrections) {
      console.log('Applying user corrections:', feedback.corrections);
      // These corrections will be used in future similar scenarios
    }
  }

  // Public methods for querying the model
  getRecommendations(context: any): string[] {
    const relevantPatterns = this.model.patterns.filter(p => 
      this.isPatternRelevant(p, context)
    );

    return relevantPatterns.flatMap(p => p.recommendations);
  }

  getPreferences(): UserPreferences {
    return this.model.preferences;
  }

  getPerformanceMetrics(): PerformanceMetrics {
    return this.model.performance;
  }

  getPatterns(type?: Pattern['type']): Pattern[] {
    if (type) {
      return this.model.patterns.filter(p => p.type === type);
    }
    return this.model.patterns;
  }

  shouldAvoidAction(category: string, action: string): boolean {
    return this.model.preferences.avoidedActions.has(`${category}:${action}`);
  }

  getConfidenceAdjustment(context: any): number {
    // Adjust confidence based on historical performance
    const similar = this.events.filter(e => 
      e.category === context.category &&
      e.success
    );

    if (similar.length > 5) {
      const successRate = similar.filter(e => e.success).length / similar.length;
      return (successRate - 0.5) * 20; // +/- 10% adjustment
    }

    return 0;
  }

  private isPatternRelevant(pattern: Pattern, context: any): boolean {
    // Simple relevance check - can be made more sophisticated
    if (pattern.context.category && pattern.context.category !== context.category) {
      return false;
    }

    if (pattern.context.action && pattern.context.action !== context.action) {
      return false;
    }

    return true;
  }

  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generatePatternId(): string {
    return `pat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateImprovementId(): string {
    return `imp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}