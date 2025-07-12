import { createClient } from '@supabase/supabase-js';

export interface SnowflakeConfig {
  account: string;
  username: string;
  password: string;
  warehouse: string;
  database: string;
  schema: string;
  role?: string;
}

export interface ETLPipeline {
  id: string;
  name: string;
  source: DataSource;
  transformations: Transformation[];
  destination: DataDestination;
  schedule?: Schedule;
  status: 'active' | 'paused' | 'failed';
}

export interface DataSource {
  type: 'supabase' | 'api' | 'file' | 'stream';
  config: any;
  query?: string;
  filters?: any;
}

export interface Transformation {
  type: 'map' | 'filter' | 'aggregate' | 'join' | 'pivot' | 'custom';
  config: any;
  order: number;
}

export interface DataDestination {
  type: 'snowflake' | 'supabase' | 'webhook';
  table: string;
  config: any;
  writeMode: 'append' | 'overwrite' | 'merge';
}

export interface Schedule {
  frequency: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  time?: string;
  timezone?: string;
}

export interface ETLJob {
  id: string;
  pipelineId: string;
  startTime: Date;
  endTime?: Date;
  status: 'running' | 'completed' | 'failed';
  recordsProcessed: number;
  errors?: any[];
}

export class SnowflakeETL {
  private snowflakeConfig: SnowflakeConfig;
  private supabase: any;
  private pipelines: Map<string, ETLPipeline> = new Map();
  private activeJobs: Map<string, ETLJob> = new Map();

  constructor(config: SnowflakeConfig) {
    this.snowflakeConfig = config;
    this.supabase = createClient(
      process.env.VITE_SUPABASE_URL!,
      process.env.VITE_SUPABASE_ANON_KEY!
    );
  }

  // Pipeline Management
  async createPipeline(pipeline: Omit<ETLPipeline, 'id' | 'status'>): Promise<ETLPipeline> {
    const newPipeline: ETLPipeline = {
      ...pipeline,
      id: this.generateId('pipeline'),
      status: 'active'
    };

    this.pipelines.set(newPipeline.id, newPipeline);
    
    // Store pipeline configuration
    await this.supabase.from('etl_pipelines').insert({
      id: newPipeline.id,
      name: newPipeline.name,
      config: newPipeline,
      status: newPipeline.status
    });

    // Schedule if needed
    if (newPipeline.schedule && newPipeline.schedule.frequency !== 'realtime') {
      await this.schedulePipeline(newPipeline);
    }

    return newPipeline;
  }

  async executePipeline(pipelineId: string): Promise<ETLJob> {
    const pipeline = this.pipelines.get(pipelineId);
    if (!pipeline) {
      throw new Error(`Pipeline ${pipelineId} not found`);
    }

    const job: ETLJob = {
      id: this.generateId('job'),
      pipelineId,
      startTime: new Date(),
      status: 'running',
      recordsProcessed: 0
    };

    this.activeJobs.set(job.id, job);

    try {
      // Extract data from source
      const sourceData = await this.extractData(pipeline.source);

      // Apply transformations
      const transformedData = await this.transformData(
        sourceData,
        pipeline.transformations
      );

      // Load to destination
      await this.loadData(transformedData, pipeline.destination);

      // Update job status
      job.endTime = new Date();
      job.status = 'completed';
      job.recordsProcessed = transformedData.length;

      // Log job completion
      await this.logJobCompletion(job);

    } catch (error) {
      job.status = 'failed';
      job.errors = [error.message];
      await this.logJobError(job, error);
      throw error;
    } finally {
      this.activeJobs.delete(job.id);
    }

    return job;
  }

  // Data Extraction
  private async extractData(source: DataSource): Promise<any[]> {
    switch (source.type) {
      case 'supabase':
        return this.extractFromSupabase(source);
      case 'api':
        return this.extractFromAPI(source);
      case 'file':
        return this.extractFromFile(source);
      case 'stream':
        return this.extractFromStream(source);
      default:
        throw new Error(`Unsupported source type: ${source.type}`);
    }
  }

  private async extractFromSupabase(source: DataSource): Promise<any[]> {
    let query = this.supabase.from(source.config.table).select(source.query || '*');

    // Apply filters
    if (source.filters) {
      Object.entries(source.filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          query = query.in(key, value);
        } else if (typeof value === 'object' && value.min && value.max) {
          query = query.gte(key, value.min).lte(key, value.max);
        } else {
          query = query.eq(key, value);
        }
      });
    }

    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Supabase extraction error: ${error.message}`);
    }

    return data || [];
  }

  private async extractFromAPI(source: DataSource): Promise<any[]> {
    const response = await fetch(source.config.url, {
      method: source.config.method || 'GET',
      headers: source.config.headers,
      body: source.config.body ? JSON.stringify(source.config.body) : undefined
    });

    if (!response.ok) {
      throw new Error(`API extraction error: ${response.statusText}`);
    }

    const data = await response.json();
    return source.config.dataPath 
      ? this.getNestedValue(data, source.config.dataPath)
      : data;
  }

  private async extractFromFile(source: DataSource): Promise<any[]> {
    // Implementation would handle file uploads from Supabase storage
    const { data, error } = await this.supabase.storage
      .from(source.config.bucket)
      .download(source.config.path);

    if (error) {
      throw new Error(`File extraction error: ${error.message}`);
    }

    // Parse based on file type
    const text = await data.text();
    
    switch (source.config.format) {
      case 'json':
        return JSON.parse(text);
      case 'csv':
        return this.parseCSV(text);
      default:
        throw new Error(`Unsupported file format: ${source.config.format}`);
    }
  }

  private async extractFromStream(source: DataSource): Promise<any[]> {
    // Implementation for real-time streaming data
    // This would typically connect to a message queue or event stream
    return [];
  }

  // Data Transformation
  private async transformData(
    data: any[],
    transformations: Transformation[]
  ): Promise<any[]> {
    let result = data;

    // Sort transformations by order
    const sortedTransformations = [...transformations].sort((a, b) => a.order - b.order);

    for (const transformation of sortedTransformations) {
      result = await this.applyTransformation(result, transformation);
    }

    return result;
  }

  private async applyTransformation(
    data: any[],
    transformation: Transformation
  ): Promise<any[]> {
    switch (transformation.type) {
      case 'map':
        return data.map(item => this.mapItem(item, transformation.config));
      
      case 'filter':
        return data.filter(item => this.evaluateFilter(item, transformation.config));
      
      case 'aggregate':
        return this.aggregateData(data, transformation.config);
      
      case 'join':
        return await this.joinData(data, transformation.config);
      
      case 'pivot':
        return this.pivotData(data, transformation.config);
      
      case 'custom':
        return await this.applyCustomTransformation(data, transformation.config);
      
      default:
        throw new Error(`Unsupported transformation type: ${transformation.type}`);
    }
  }

  private mapItem(item: any, config: any): any {
    const mapped = {};
    
    Object.entries(config.mapping).forEach(([targetField, sourceConfig]) => {
      if (typeof sourceConfig === 'string') {
        mapped[targetField] = this.getNestedValue(item, sourceConfig);
      } else if (typeof sourceConfig === 'object') {
        // Handle computed fields
        mapped[targetField] = this.computeField(item, sourceConfig);
      }
    });

    return mapped;
  }

  private evaluateFilter(item: any, config: any): boolean {
    return config.conditions.every(condition => {
      const value = this.getNestedValue(item, condition.field);
      
      switch (condition.operator) {
        case 'eq':
          return value === condition.value;
        case 'ne':
          return value !== condition.value;
        case 'gt':
          return value > condition.value;
        case 'gte':
          return value >= condition.value;
        case 'lt':
          return value < condition.value;
        case 'lte':
          return value <= condition.value;
        case 'in':
          return condition.value.includes(value);
        case 'contains':
          return value?.includes(condition.value);
        default:
          return true;
      }
    });
  }

  private aggregateData(data: any[], config: any): any[] {
    const groups = new Map();

    // Group data
    data.forEach(item => {
      const key = config.groupBy.map(field => this.getNestedValue(item, field)).join('|');
      
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      
      groups.get(key).push(item);
    });

    // Apply aggregations
    const results = [];
    
    groups.forEach((items, key) => {
      const keyValues = key.split('|');
      const result = {};
      
      // Add group fields
      config.groupBy.forEach((field, index) => {
        result[field] = keyValues[index];
      });
      
      // Add aggregations
      config.aggregations.forEach(agg => {
        const values = items.map(item => this.getNestedValue(item, agg.field));
        
        switch (agg.function) {
          case 'sum':
            result[agg.alias] = values.reduce((sum, val) => sum + (val || 0), 0);
            break;
          case 'avg':
            result[agg.alias] = values.reduce((sum, val) => sum + (val || 0), 0) / values.length;
            break;
          case 'count':
            result[agg.alias] = values.length;
            break;
          case 'min':
            result[agg.alias] = Math.min(...values);
            break;
          case 'max':
            result[agg.alias] = Math.max(...values);
            break;
        }
      });
      
      results.push(result);
    });

    return results;
  }

  private async joinData(data: any[], config: any): Promise<any[]> {
    // Fetch join data
    const joinData = await this.extractData(config.source);
    
    // Create lookup map
    const lookup = new Map();
    joinData.forEach(item => {
      const key = this.getNestedValue(item, config.rightKey);
      lookup.set(key, item);
    });

    // Perform join
    return data.map(item => {
      const key = this.getNestedValue(item, config.leftKey);
      const joinItem = lookup.get(key);
      
      if (joinItem) {
        return { ...item, ...joinItem };
      } else if (config.type === 'inner') {
        return null;
      } else {
        return item;
      }
    }).filter(item => item !== null);
  }

  private pivotData(data: any[], config: any): any[] {
    const pivoted = new Map();

    data.forEach(item => {
      const rowKey = this.getNestedValue(item, config.rowKey);
      const colKey = this.getNestedValue(item, config.columnKey);
      const value = this.getNestedValue(item, config.valueKey);

      if (!pivoted.has(rowKey)) {
        pivoted.set(rowKey, { [config.rowKey]: rowKey });
      }

      pivoted.get(rowKey)[colKey] = value;
    });

    return Array.from(pivoted.values());
  }

  private async applyCustomTransformation(data: any[], config: any): Promise<any[]> {
    // Execute custom transformation function
    // In production, this would run in a sandboxed environment
    const transformFunction = new Function('data', 'config', config.code);
    return transformFunction(data, config.params);
  }

  // Data Loading
  private async loadData(data: any[], destination: DataDestination): Promise<void> {
    switch (destination.type) {
      case 'snowflake':
        return this.loadToSnowflake(data, destination);
      case 'supabase':
        return this.loadToSupabase(data, destination);
      case 'webhook':
        return this.loadToWebhook(data, destination);
      default:
        throw new Error(`Unsupported destination type: ${destination.type}`);
    }
  }

  private async loadToSnowflake(data: any[], destination: DataDestination): Promise<void> {
    // This would use Snowflake's Node.js driver
    // For now, we'll simulate by storing in Supabase
    
    const snowflakeData = {
      warehouse: this.snowflakeConfig.warehouse,
      database: this.snowflakeConfig.database,
      schema: this.snowflakeConfig.schema,
      table: destination.table,
      writeMode: destination.writeMode,
      data: data,
      timestamp: new Date()
    };

    await this.supabase.from('snowflake_staging').insert(snowflakeData);
  }

  private async loadToSupabase(data: any[], destination: DataDestination): Promise<void> {
    if (destination.writeMode === 'overwrite') {
      // Delete existing data
      await this.supabase.from(destination.table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    }

    // Insert data in batches
    const batchSize = 100;
    
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      
      if (destination.writeMode === 'merge') {
        // Upsert based on unique key
        const { error } = await this.supabase
          .from(destination.table)
          .upsert(batch, { onConflict: destination.config.mergeKey });
          
        if (error) {
          throw new Error(`Supabase load error: ${error.message}`);
        }
      } else {
        // Regular insert
        const { error } = await this.supabase
          .from(destination.table)
          .insert(batch);
          
        if (error) {
          throw new Error(`Supabase load error: ${error.message}`);
        }
      }
    }
  }

  private async loadToWebhook(data: any[], destination: DataDestination): Promise<void> {
    const response = await fetch(destination.config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...destination.config.headers
      },
      body: JSON.stringify({
        table: destination.table,
        writeMode: destination.writeMode,
        data: data,
        metadata: destination.config.metadata
      })
    });

    if (!response.ok) {
      throw new Error(`Webhook load error: ${response.statusText}`);
    }
  }

  // Utility methods
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private computeField(item: any, config: any): any {
    switch (config.type) {
      case 'concatenate':
        return config.fields.map(f => this.getNestedValue(item, f)).join(config.separator || '');
      case 'calculate':
        // Simple expression evaluation
        return eval(config.expression.replace(/\{(\w+)\}/g, (_, field) => 
          this.getNestedValue(item, field)
        ));
      case 'date':
        return new Date(this.getNestedValue(item, config.field));
      default:
        return null;
    }
  }

  private parseCSV(text: string): any[] {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
      const values = line.split(',');
      const obj = {};
      
      headers.forEach((header, index) => {
        obj[header] = values[index]?.trim();
      });
      
      return obj;
    });
  }

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async schedulePipeline(pipeline: ETLPipeline): Promise<void> {
    // Store schedule in database
    await this.supabase.from('etl_schedules').insert({
      pipeline_id: pipeline.id,
      frequency: pipeline.schedule.frequency,
      time: pipeline.schedule.time,
      timezone: pipeline.schedule.timezone || 'UTC',
      next_run: this.calculateNextRun(pipeline.schedule)
    });
  }

  private calculateNextRun(schedule: Schedule): Date {
    const now = new Date();
    
    switch (schedule.frequency) {
      case 'hourly':
        return new Date(now.getTime() + 60 * 60 * 1000);
      case 'daily':
        const daily = new Date(now);
        daily.setDate(daily.getDate() + 1);
        if (schedule.time) {
          const [hours, minutes] = schedule.time.split(':');
          daily.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        }
        return daily;
      case 'weekly':
        const weekly = new Date(now);
        weekly.setDate(weekly.getDate() + 7);
        return weekly;
      case 'monthly':
        const monthly = new Date(now);
        monthly.setMonth(monthly.getMonth() + 1);
        return monthly;
      default:
        return now;
    }
  }

  private async logJobCompletion(job: ETLJob): Promise<void> {
    await this.supabase.from('etl_job_logs').insert({
      job_id: job.id,
      pipeline_id: job.pipelineId,
      start_time: job.startTime,
      end_time: job.endTime,
      status: job.status,
      records_processed: job.recordsProcessed
    });
  }

  private async logJobError(job: ETLJob, error: Error): Promise<void> {
    await this.supabase.from('etl_job_logs').insert({
      job_id: job.id,
      pipeline_id: job.pipelineId,
      start_time: job.startTime,
      end_time: new Date(),
      status: 'failed',
      error_message: error.message,
      error_stack: error.stack
    });
  }

  // Monitoring and Management
  async getPipelineStatus(pipelineId: string): Promise<any> {
    const pipeline = this.pipelines.get(pipelineId);
    if (!pipeline) {
      throw new Error(`Pipeline ${pipelineId} not found`);
    }

    const { data: recentJobs } = await this.supabase
      .from('etl_job_logs')
      .select('*')
      .eq('pipeline_id', pipelineId)
      .order('start_time', { ascending: false })
      .limit(10);

    return {
      pipeline,
      recentJobs,
      isRunning: Array.from(this.activeJobs.values()).some(j => j.pipelineId === pipelineId)
    };
  }

  async pausePipeline(pipelineId: string): Promise<void> {
    const pipeline = this.pipelines.get(pipelineId);
    if (pipeline) {
      pipeline.status = 'paused';
      await this.supabase
        .from('etl_pipelines')
        .update({ status: 'paused' })
        .eq('id', pipelineId);
    }
  }

  async resumePipeline(pipelineId: string): Promise<void> {
    const pipeline = this.pipelines.get(pipelineId);
    if (pipeline) {
      pipeline.status = 'active';
      await this.supabase
        .from('etl_pipelines')
        .update({ status: 'active' })
        .eq('id', pipelineId);
    }
  }
}