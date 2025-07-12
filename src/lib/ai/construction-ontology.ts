export interface OntologyNode {
  id: string;
  name: string;
  type: 'class' | 'property' | 'relationship' | 'instance';
  parent?: string;
  children?: string[];
  properties?: Property[];
  relationships?: Relationship[];
  synonyms?: string[];
  definition?: string;
  metadata?: any;
}

export interface Property {
  name: string;
  dataType: 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array';
  required?: boolean;
  defaultValue?: any;
  constraints?: Constraint[];
  unit?: string;
}

export interface Relationship {
  type: string;
  target: string;
  cardinality: 'one-to-one' | 'one-to-many' | 'many-to-many';
  inverse?: string;
  properties?: Property[];
}

export interface Constraint {
  type: 'min' | 'max' | 'pattern' | 'enum' | 'custom';
  value: any;
  message?: string;
}

export interface OntologyQuery {
  text: string;
  context?: string;
  includeRelated?: boolean;
  depth?: number;
}

export class ConstructionOntology {
  private nodes: Map<string, OntologyNode> = new Map();
  private index: Map<string, Set<string>> = new Map(); // term -> node IDs
  
  constructor() {
    this.initializeBaseOntology();
  }

  private initializeBaseOntology() {
    // Core construction concepts
    this.addNode({
      id: 'project',
      name: 'Construction Project',
      type: 'class',
      properties: [
        { name: 'name', dataType: 'string', required: true },
        { name: 'type', dataType: 'string', constraints: [{ type: 'enum', value: ['residential', 'commercial', 'industrial', 'infrastructure'] }] },
        { name: 'startDate', dataType: 'date' },
        { name: 'endDate', dataType: 'date' },
        { name: 'budget', dataType: 'number', unit: 'USD' },
        { name: 'status', dataType: 'string' }
      ],
      relationships: [
        { type: 'hasPhase', target: 'phase', cardinality: 'one-to-many' },
        { type: 'hasStakeholder', target: 'stakeholder', cardinality: 'one-to-many' },
        { type: 'hasDocument', target: 'document', cardinality: 'one-to-many' },
        { type: 'locatedAt', target: 'location', cardinality: 'one-to-one' }
      ]
    });

    // Project phases
    this.addNode({
      id: 'phase',
      name: 'Project Phase',
      type: 'class',
      parent: 'project',
      properties: [
        { name: 'name', dataType: 'string', required: true },
        { name: 'type', dataType: 'string', constraints: [{ type: 'enum', value: ['planning', 'design', 'bidding', 'construction', 'closeout'] }] },
        { name: 'startDate', dataType: 'date' },
        { name: 'endDate', dataType: 'date' },
        { name: 'percentComplete', dataType: 'number', constraints: [{ type: 'min', value: 0 }, { type: 'max', value: 100 }] }
      ],
      relationships: [
        { type: 'hasActivity', target: 'activity', cardinality: 'one-to-many' },
        { type: 'hasMilestone', target: 'milestone', cardinality: 'one-to-many' }
      ]
    });

    // Activities
    this.addNode({
      id: 'activity',
      name: 'Construction Activity',
      type: 'class',
      properties: [
        { name: 'name', dataType: 'string', required: true },
        { name: 'description', dataType: 'string' },
        { name: 'duration', dataType: 'number', unit: 'days' },
        { name: 'cost', dataType: 'number', unit: 'USD' },
        { name: 'resources', dataType: 'array' }
      ],
      relationships: [
        { type: 'dependsOn', target: 'activity', cardinality: 'many-to-many' },
        { type: 'assignedTo', target: 'contractor', cardinality: 'many-to-one' }
      ],
      synonyms: ['task', 'work item', 'job']
    });

    // Stakeholders
    this.addNode({
      id: 'stakeholder',
      name: 'Project Stakeholder',
      type: 'class',
      properties: [
        { name: 'name', dataType: 'string', required: true },
        { name: 'role', dataType: 'string' },
        { name: 'organization', dataType: 'string' },
        { name: 'contactInfo', dataType: 'object' }
      ],
      children: ['owner', 'contractor', 'architect', 'engineer', 'inspector']
    });

    // Materials
    this.addNode({
      id: 'material',
      name: 'Construction Material',
      type: 'class',
      properties: [
        { name: 'name', dataType: 'string', required: true },
        { name: 'type', dataType: 'string' },
        { name: 'specification', dataType: 'string' },
        { name: 'quantity', dataType: 'number' },
        { name: 'unit', dataType: 'string' },
        { name: 'unitCost', dataType: 'number', unit: 'USD' },
        { name: 'supplier', dataType: 'string' }
      ],
      children: ['concrete', 'steel', 'lumber', 'electrical', 'plumbing', 'finishing'],
      synonyms: ['supplies', 'products', 'goods']
    });

    // Equipment
    this.addNode({
      id: 'equipment',
      name: 'Construction Equipment',
      type: 'class',
      properties: [
        { name: 'name', dataType: 'string', required: true },
        { name: 'type', dataType: 'string' },
        { name: 'model', dataType: 'string' },
        { name: 'capacity', dataType: 'string' },
        { name: 'status', dataType: 'string', constraints: [{ type: 'enum', value: ['available', 'in-use', 'maintenance', 'retired'] }] }
      ],
      children: ['crane', 'excavator', 'bulldozer', 'truck', 'tool'],
      synonyms: ['machinery', 'plant', 'apparatus']
    });

    // Documents
    this.addNode({
      id: 'document',
      name: 'Project Document',
      type: 'class',
      properties: [
        { name: 'title', dataType: 'string', required: true },
        { name: 'type', dataType: 'string' },
        { name: 'version', dataType: 'string' },
        { name: 'date', dataType: 'date' },
        { name: 'author', dataType: 'string' },
        { name: 'status', dataType: 'string' }
      ],
      children: ['drawing', 'specification', 'report', 'permit', 'contract', 'schedule'],
      relationships: [
        { type: 'references', target: 'document', cardinality: 'many-to-many' },
        { type: 'supersedes', target: 'document', cardinality: 'one-to-many' }
      ]
    });

    // Safety
    this.addNode({
      id: 'safety',
      name: 'Safety Management',
      type: 'class',
      properties: [
        { name: 'category', dataType: 'string' },
        { name: 'severity', dataType: 'string', constraints: [{ type: 'enum', value: ['low', 'medium', 'high', 'critical'] }] },
        { name: 'description', dataType: 'string' },
        { name: 'mitigation', dataType: 'string' }
      ],
      children: ['hazard', 'incident', 'inspection', 'training', 'ppe'],
      relationships: [
        { type: 'identifiedAt', target: 'location', cardinality: 'many-to-one' },
        { type: 'reportedBy', target: 'stakeholder', cardinality: 'many-to-one' }
      ]
    });

    // Quality
    this.addNode({
      id: 'quality',
      name: 'Quality Control',
      type: 'class',
      properties: [
        { name: 'type', dataType: 'string' },
        { name: 'standard', dataType: 'string' },
        { name: 'result', dataType: 'string', constraints: [{ type: 'enum', value: ['pass', 'fail', 'conditional'] }] },
        { name: 'date', dataType: 'date' },
        { name: 'inspector', dataType: 'string' }
      ],
      children: ['inspection', 'test', 'defect', 'rework', 'approval'],
      relationships: [
        { type: 'appliesTo', target: 'activity', cardinality: 'many-to-many' },
        { type: 'references', target: 'specification', cardinality: 'many-to-one' }
      ]
    });

    // Environmental
    this.addNode({
      id: 'environmental',
      name: 'Environmental Management',
      type: 'class',
      properties: [
        { name: 'aspect', dataType: 'string' },
        { name: 'impact', dataType: 'string' },
        { name: 'mitigation', dataType: 'string' },
        { name: 'compliance', dataType: 'boolean' }
      ],
      children: ['emission', 'waste', 'noise', 'water', 'soil'],
      relationships: [
        { type: 'regulatedBy', target: 'regulation', cardinality: 'many-to-many' }
      ]
    });

    // Cost
    this.addNode({
      id: 'cost',
      name: 'Cost Management',
      type: 'class',
      properties: [
        { name: 'category', dataType: 'string' },
        { name: 'budgeted', dataType: 'number', unit: 'USD' },
        { name: 'actual', dataType: 'number', unit: 'USD' },
        { name: 'variance', dataType: 'number', unit: 'USD' },
        { name: 'date', dataType: 'date' }
      ],
      children: ['labor', 'material', 'equipment', 'overhead', 'contingency'],
      relationships: [
        { type: 'allocatedTo', target: 'activity', cardinality: 'many-to-one' }
      ]
    });

    // Schedule
    this.addNode({
      id: 'schedule',
      name: 'Project Schedule',
      type: 'class',
      properties: [
        { name: 'baselineStart', dataType: 'date' },
        { name: 'baselineEnd', dataType: 'date' },
        { name: 'actualStart', dataType: 'date' },
        { name: 'actualEnd', dataType: 'date' },
        { name: 'float', dataType: 'number', unit: 'days' },
        { name: 'criticalPath', dataType: 'boolean' }
      ],
      relationships: [
        { type: 'contains', target: 'activity', cardinality: 'one-to-many' },
        { type: 'hasMilestone', target: 'milestone', cardinality: 'one-to-many' }
      ]
    });

    // BIM
    this.addNode({
      id: 'bim',
      name: 'Building Information Model',
      type: 'class',
      properties: [
        { name: 'level', dataType: 'string' },
        { name: 'discipline', dataType: 'string' },
        { name: 'version', dataType: 'string' },
        { name: 'software', dataType: 'string' },
        { name: 'lastModified', dataType: 'date' }
      ],
      children: ['model', 'element', 'clash', 'view', 'sheet'],
      relationships: [
        { type: 'contains', target: 'element', cardinality: 'one-to-many' },
        { type: 'referencedBy', target: 'document', cardinality: 'many-to-many' }
      ]
    });

    // Add specific material types
    this.addNode({
      id: 'concrete',
      name: 'Concrete',
      type: 'class',
      parent: 'material',
      properties: [
        { name: 'strength', dataType: 'number', unit: 'psi' },
        { name: 'slump', dataType: 'number', unit: 'inches' },
        { name: 'admixtures', dataType: 'array' },
        { name: 'cureTime', dataType: 'number', unit: 'days' }
      ],
      synonyms: ['cement', 'ready-mix']
    });

    this.addNode({
      id: 'steel',
      name: 'Steel',
      type: 'class',
      parent: 'material',
      properties: [
        { name: 'grade', dataType: 'string' },
        { name: 'yield', dataType: 'number', unit: 'ksi' },
        { name: 'shape', dataType: 'string' },
        { name: 'coating', dataType: 'string' }
      ],
      synonyms: ['rebar', 'structural steel', 'metal']
    });

    // Add relationships between concepts
    this.addRelationshipInstances();
  }

  private addRelationshipInstances() {
    // Add common relationship patterns
    this.addRelationship('activity', 'requires', 'material', 'one-to-many');
    this.addRelationship('activity', 'uses', 'equipment', 'many-to-many');
    this.addRelationship('contractor', 'performs', 'activity', 'one-to-many');
    this.addRelationship('document', 'governs', 'activity', 'many-to-many');
    this.addRelationship('quality', 'validates', 'material', 'one-to-many');
    this.addRelationship('safety', 'protects', 'stakeholder', 'many-to-many');
  }

  // Core methods
  addNode(node: OntologyNode): void {
    this.nodes.set(node.id, node);
    
    // Update parent-child relationships
    if (node.parent) {
      const parent = this.nodes.get(node.parent);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(node.id);
      }
    }

    // Index terms
    this.indexTerm(node.name.toLowerCase(), node.id);
    node.synonyms?.forEach(syn => this.indexTerm(syn.toLowerCase(), node.id));
  }

  addRelationship(sourceId: string, type: string, targetId: string, cardinality: Relationship['cardinality']): void {
    const source = this.nodes.get(sourceId);
    if (source) {
      source.relationships = source.relationships || [];
      source.relationships.push({ type, target: targetId, cardinality });
    }
  }

  private indexTerm(term: string, nodeId: string): void {
    if (!this.index.has(term)) {
      this.index.set(term, new Set());
    }
    this.index.get(term)!.add(nodeId);
  }

  // Query methods
  async query(query: OntologyQuery): Promise<{
    concepts: OntologyNode[];
    relationships: any[];
    suggestions: string[];
  }> {
    const terms = this.extractTerms(query.text);
    const relevantNodes = this.findRelevantNodes(terms);
    
    let concepts = Array.from(relevantNodes);
    
    if (query.includeRelated) {
      concepts = this.expandWithRelated(concepts, query.depth || 1);
    }

    const relationships = this.extractRelationships(concepts);
    const suggestions = await this.generateSuggestions(query.text, concepts);

    return { concepts, relationships, suggestions };
  }

  private extractTerms(text: string): string[] {
    // Simple term extraction - in production, use NLP
    return text.toLowerCase()
      .split(/\s+/)
      .filter(term => term.length > 2)
      .map(term => term.replace(/[^a-z0-9]/g, ''));
  }

  private findRelevantNodes(terms: string[]): Set<OntologyNode> {
    const relevant = new Set<OntologyNode>();
    
    terms.forEach(term => {
      // Direct matches
      if (this.index.has(term)) {
        this.index.get(term)!.forEach(nodeId => {
          const node = this.nodes.get(nodeId);
          if (node) relevant.add(node);
        });
      }
      
      // Partial matches
      this.index.forEach((nodeIds, indexedTerm) => {
        if (indexedTerm.includes(term) || term.includes(indexedTerm)) {
          nodeIds.forEach(nodeId => {
            const node = this.nodes.get(nodeId);
            if (node) relevant.add(node);
          });
        }
      });
    });

    return relevant;
  }

  private expandWithRelated(nodes: OntologyNode[], depth: number): OntologyNode[] {
    const expanded = new Set<OntologyNode>(nodes);
    const processed = new Set<string>();

    const expand = (node: OntologyNode, currentDepth: number) => {
      if (currentDepth <= 0 || processed.has(node.id)) return;
      processed.add(node.id);

      // Add parent
      if (node.parent) {
        const parent = this.nodes.get(node.parent);
        if (parent) {
          expanded.add(parent);
          expand(parent, currentDepth - 1);
        }
      }

      // Add children
      node.children?.forEach(childId => {
        const child = this.nodes.get(childId);
        if (child) {
          expanded.add(child);
          expand(child, currentDepth - 1);
        }
      });

      // Add related through relationships
      node.relationships?.forEach(rel => {
        const related = this.nodes.get(rel.target);
        if (related) {
          expanded.add(related);
          if (currentDepth > 1) {
            expand(related, currentDepth - 1);
          }
        }
      });
    };

    nodes.forEach(node => expand(node, depth));
    return Array.from(expanded);
  }

  private extractRelationships(nodes: OntologyNode[]): any[] {
    const relationships = [];
    const nodeIds = new Set(nodes.map(n => n.id));

    nodes.forEach(node => {
      node.relationships?.forEach(rel => {
        if (nodeIds.has(rel.target)) {
          relationships.push({
            source: node.id,
            sourceName: node.name,
            type: rel.type,
            target: rel.target,
            targetName: this.nodes.get(rel.target)?.name,
            cardinality: rel.cardinality
          });
        }
      });
    });

    return relationships;
  }

  private async generateSuggestions(query: string, concepts: OntologyNode[]): Promise<string[]> {
    const suggestions = new Set<string>();

    // Suggest related concepts
    concepts.forEach(concept => {
      concept.relationships?.forEach(rel => {
        const target = this.nodes.get(rel.target);
        if (target) {
          suggestions.add(`${rel.type} ${target.name}`);
        }
      });
    });

    // Suggest properties
    concepts.forEach(concept => {
      concept.properties?.forEach(prop => {
        suggestions.add(`${concept.name} ${prop.name}`);
      });
    });

    return Array.from(suggestions).slice(0, 5);
  }

  // Validation methods
  validateData(data: any, conceptId: string): { valid: boolean; errors: string[] } {
    const concept = this.nodes.get(conceptId);
    if (!concept) {
      return { valid: false, errors: ['Unknown concept'] };
    }

    const errors: string[] = [];

    concept.properties?.forEach(prop => {
      const value = data[prop.name];

      // Check required
      if (prop.required && (value === undefined || value === null)) {
        errors.push(`${prop.name} is required`);
        return;
      }

      if (value !== undefined && value !== null) {
        // Check data type
        if (!this.checkDataType(value, prop.dataType)) {
          errors.push(`${prop.name} must be a ${prop.dataType}`);
        }

        // Check constraints
        prop.constraints?.forEach(constraint => {
          if (!this.checkConstraint(value, constraint)) {
            errors.push(constraint.message || `${prop.name} fails ${constraint.type} constraint`);
          }
        });
      }
    });

    return { valid: errors.length === 0, errors };
  }

  private checkDataType(value: any, dataType: Property['dataType']): boolean {
    switch (dataType) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number';
      case 'boolean':
        return typeof value === 'boolean';
      case 'date':
        return value instanceof Date || !isNaN(Date.parse(value));
      case 'object':
        return typeof value === 'object' && !Array.isArray(value);
      case 'array':
        return Array.isArray(value);
      default:
        return true;
    }
  }

  private checkConstraint(value: any, constraint: Constraint): boolean {
    switch (constraint.type) {
      case 'min':
        return value >= constraint.value;
      case 'max':
        return value <= constraint.value;
      case 'pattern':
        return new RegExp(constraint.value).test(value);
      case 'enum':
        return constraint.value.includes(value);
      case 'custom':
        // Execute custom validation function
        return true;
      default:
        return true;
    }
  }

  // Export/Import
  exportOntology(): string {
    const ontology = {
      nodes: Array.from(this.nodes.values()),
      version: '1.0',
      timestamp: new Date().toISOString()
    };
    return JSON.stringify(ontology, null, 2);
  }

  importOntology(json: string): void {
    const ontology = JSON.parse(json);
    ontology.nodes.forEach(node => this.addNode(node));
  }

  // Reasoning capabilities
  infer(fact: { subject: string; predicate: string; object: string }): any[] {
    const inferences = [];
    
    // Simple inference rules
    if (fact.predicate === 'isA') {
      const parent = this.nodes.get(fact.object);
      if (parent) {
        // Inherit properties
        inferences.push({
          type: 'inheritance',
          message: `${fact.subject} inherits properties from ${parent.name}`,
          properties: parent.properties
        });
      }
    }

    if (fact.predicate === 'requires' && fact.object === 'concrete') {
      // Domain-specific inference
      inferences.push({
        type: 'suggestion',
        message: 'Consider scheduling concrete delivery and testing',
        actions: ['schedule_delivery', 'plan_testing']
      });
    }

    return inferences;
  }

  // Natural language generation
  describeRelationship(sourceId: string, targetId: string): string {
    const source = this.nodes.get(sourceId);
    const target = this.nodes.get(targetId);
    
    if (!source || !target) {
      return 'Unknown relationship';
    }

    const relationship = source.relationships?.find(r => r.target === targetId);
    
    if (relationship) {
      return `${source.name} ${relationship.type} ${target.name} (${relationship.cardinality})`;
    }

    return `No direct relationship between ${source.name} and ${target.name}`;
  }
}