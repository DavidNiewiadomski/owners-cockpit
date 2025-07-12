// Snowflake client for data warehouse operations
// Note: This uses the Snowflake REST API since the SDK doesn't work in browsers

export interface SnowflakeConfig {
  account: string;
  username: string;
  password: string;
  warehouse?: string;
  database?: string;
  schema?: string;
  role?: string;
}

export interface QueryResult {
  data: any[];
  rowCount: number;
  queryId: string;
  executionTime: number;
  error?: string;
}

export interface TableInfo {
  name: string;
  schema: string;
  rowCount: number;
  bytes: number;
  lastAltered: string;
}

// Get environment variables
const getEnvVar = (key: string): string => {
  const viteKey = `VITE_${key}`;
  if (import.meta.env[viteKey]) return import.meta.env[viteKey];
  if (import.meta.env[key]) return import.meta.env[key];
  return '';
};

export class SnowflakeClient {
  private config: SnowflakeConfig;
  private sessionToken: string | null = null;
  private baseUrl: string;
  
  constructor(config?: Partial<SnowflakeConfig>) {
    this.config = {
      account: config?.account || getEnvVar('SNOWFLAKE_ACCOUNT') || 'pya09025.east-us-2.azure',
      username: config?.username || getEnvVar('SNOWFLAKE_USERNAME') || '',
      password: config?.password || getEnvVar('SNOWFLAKE_PASSWORD') || '',
      warehouse: config?.warehouse || getEnvVar('SNOWFLAKE_WAREHOUSE') || 'COMPUTE_WH',
      database: config?.database || getEnvVar('SNOWFLAKE_DATABASE') || 'OWNERS_COCKPIT',
      schema: config?.schema || getEnvVar('SNOWFLAKE_SCHEMA') || 'PUBLIC',
      role: config?.role || getEnvVar('SNOWFLAKE_ROLE') || 'ACCOUNTADMIN'
    };
    
    // Construct base URL for Snowflake REST API
    this.baseUrl = `https://${this.config.account}.snowflakecomputing.com/api/v2`;
  }
  
  // Check if client is configured
  isConfigured(): boolean {
    return !!(this.config.account && this.config.username && this.config.password);
  }
  
  // Authenticate with Snowflake
  async authenticate(): Promise<boolean> {
    if (!this.isConfigured()) {
      throw new Error('Snowflake client not properly configured');
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/statements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${this.config.username}:${this.config.password}`)}`
        },
        body: JSON.stringify({
          statement: 'SELECT CURRENT_USER(), CURRENT_ROLE(), CURRENT_WAREHOUSE(), CURRENT_DATABASE()',
          warehouse: this.config.warehouse,
          database: this.config.database,
          schema: this.config.schema
        })
      });
      
      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.statusText}`);
      }
      
      // Extract session token from response
      const authHeader = response.headers.get('Authorization');
      if (authHeader) {
        this.sessionToken = authHeader.replace('Bearer ', '');
      }
      
      return true;
    } catch (error: any) {
      console.error('Snowflake authentication error:', error);
      return false;
    }
  }
  
  // Execute a query
  async executeQuery(sql: string, bindings?: any[]): Promise<QueryResult> {
    const startTime = Date.now();
    
    try {
      // Ensure we're authenticated
      if (!this.sessionToken) {
        await this.authenticate();
      }
      
      const response = await fetch(`${this.baseUrl}/statements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.sessionToken ? `Bearer ${this.sessionToken}` : `Basic ${btoa(`${this.config.username}:${this.config.password}`)}`
        },
        body: JSON.stringify({
          statement: sql,
          bindings: bindings,
          warehouse: this.config.warehouse,
          database: this.config.database,
          schema: this.config.schema,
          timeout: 60
        })
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Query execution failed: ${error}`);
      }
      
      const result = await response.json();
      
      // Get query results
      const dataResponse = await fetch(`${this.baseUrl}/statements/${result.statementHandle}`, {
        headers: {
          'Authorization': this.sessionToken ? `Bearer ${this.sessionToken}` : `Basic ${btoa(`${this.config.username}:${this.config.password}`)}`
        }
      });
      
      const data = await dataResponse.json();
      
      return {
        data: data.data || [],
        rowCount: data.rowCount || 0,
        queryId: result.statementHandle,
        executionTime: Date.now() - startTime
      };
    } catch (error: any) {
      return {
        data: [],
        rowCount: 0,
        queryId: '',
        executionTime: Date.now() - startTime,
        error: error.message
      };
    }
  }
  
  // Get list of tables
  async getTables(schema?: string): Promise<TableInfo[]> {
    const targetSchema = schema || this.config.schema || 'PUBLIC';
    
    const result = await this.executeQuery(`
      SHOW TABLES IN SCHEMA ${this.config.database}.${targetSchema}
    `);
    
    if (result.error) {
      throw new Error(`Failed to get tables: ${result.error}`);
    }
    
    return result.data.map((row: any) => ({
      name: row.name,
      schema: row.schema_name,
      rowCount: parseInt(row.rows || '0'),
      bytes: parseInt(row.bytes || '0'),
      lastAltered: row.created_on
    }));
  }
  
  // Get table schema
  async getTableSchema(tableName: string, schema?: string): Promise<any[]> {
    const targetSchema = schema || this.config.schema || 'PUBLIC';
    
    const result = await this.executeQuery(`
      DESCRIBE TABLE ${this.config.database}.${targetSchema}.${tableName}
    `);
    
    if (result.error) {
      throw new Error(`Failed to get table schema: ${result.error}`);
    }
    
    return result.data;
  }
  
  // Construction-specific queries
  async getProjectMetrics(projectId?: string): Promise<any> {
    const whereClause = projectId ? `WHERE project_id = '${projectId}'` : '';
    
    const result = await this.executeQuery(`
      SELECT 
        project_id,
        project_name,
        total_budget,
        spent_amount,
        completion_percentage,
        safety_incidents,
        on_schedule,
        last_updated
      FROM construction_metrics
      ${whereClause}
      ORDER BY last_updated DESC
    `);
    
    return result;
  }
  
  async getBudgetAnalysis(startDate?: string, endDate?: string): Promise<any> {
    const dateFilter = startDate && endDate 
      ? `WHERE date BETWEEN '${startDate}' AND '${endDate}'`
      : '';
    
    const result = await this.executeQuery(`
      SELECT 
        date,
        project_id,
        category,
        budgeted_amount,
        actual_amount,
        variance,
        variance_percentage
      FROM budget_analysis
      ${dateFilter}
      ORDER BY date DESC, variance_percentage DESC
    `);
    
    return result;
  }
  
  async getSafetyMetrics(daysBack: number = 30): Promise<any> {
    const result = await this.executeQuery(`
      SELECT 
        date,
        project_id,
        incident_type,
        severity,
        days_without_incident,
        safety_score
      FROM safety_metrics
      WHERE date >= DATEADD(day, -${daysBack}, CURRENT_DATE())
      ORDER BY date DESC
    `);
    
    return result;
  }
  
  async getResourceUtilization(): Promise<any> {
    const result = await this.executeQuery(`
      SELECT 
        resource_type,
        resource_name,
        project_id,
        utilization_percentage,
        availability_status,
        next_available_date
      FROM resource_utilization
      WHERE is_active = TRUE
      ORDER BY utilization_percentage DESC
    `);
    
    return result;
  }
  
  // Create a new project entry
  async createProject(projectData: any): Promise<QueryResult> {
    const columns = Object.keys(projectData).join(', ');
    const values = Object.values(projectData).map(v => 
      typeof v === 'string' ? `'${v}'` : v
    ).join(', ');
    
    return this.executeQuery(`
      INSERT INTO projects (${columns})
      VALUES (${values})
    `);
  }
  
  // Update project metrics
  async updateProjectMetrics(projectId: string, metrics: any): Promise<QueryResult> {
    const updates = Object.entries(metrics)
      .map(([key, value]) => `${key} = ${typeof value === 'string' ? `'${value}'` : value}`)
      .join(', ');
    
    return this.executeQuery(`
      UPDATE construction_metrics
      SET ${updates}, last_updated = CURRENT_TIMESTAMP()
      WHERE project_id = '${projectId}'
    `);
  }
  
  // Batch insert for time series data
  async insertTimeSeriesData(table: string, data: any[]): Promise<QueryResult> {
    if (!data.length) {
      return {
        data: [],
        rowCount: 0,
        queryId: '',
        executionTime: 0
      };
    }
    
    const columns = Object.keys(data[0]).join(', ');
    const values = data.map(row => 
      `(${Object.values(row).map(v => 
        typeof v === 'string' ? `'${v}'` : v
      ).join(', ')})`
    ).join(', ');
    
    return this.executeQuery(`
      INSERT INTO ${table} (${columns})
      VALUES ${values}
    `);
  }
  
  // Get data pipeline status
  async getDataPipelineStatus(): Promise<any> {
    const result = await this.executeQuery(`
      SELECT 
        pipeline_name,
        last_run_time,
        status,
        records_processed,
        error_count,
        next_scheduled_run
      FROM data_pipeline_status
      ORDER BY last_run_time DESC
    `);
    
    return result;
  }
  
  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      const result = await this.executeQuery('SELECT 1 as test');
      return !result.error && result.data.length > 0;
    } catch (error) {
      console.error('Snowflake connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance with default config
export const snowflakeClient = new SnowflakeClient();

// Convenience functions
export async function querySnowflake(sql: string, bindings?: any[]): Promise<QueryResult> {
  return snowflakeClient.executeQuery(sql, bindings);
}

export async function getConstructionMetrics(projectId?: string): Promise<any> {
  return snowflakeClient.getProjectMetrics(projectId);
}

export async function updateMetrics(projectId: string, metrics: any): Promise<QueryResult> {
  return snowflakeClient.updateProjectMetrics(projectId, metrics);
}