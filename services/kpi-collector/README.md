# KPI Collector Service

Automated service for collecting Key Performance Indicators (KPIs) from Procore API and generating AI-powered performance summaries.

## Features

- **Automated Data Collection**: Daily scheduled collection of KPIs from Procore projects
- **Smart Mapping**: Maps Procore data to standardized KPI metrics
- **AI Summaries**: Generates comprehensive performance reports using OpenAI GPT-4
- **Event Publishing**: Publishes `kpi.updated` events for real-time notifications
- **Error Handling**: Robust error handling with retry logic and event logging

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Procore API    │◄───│ KPI Collector   │───►│ Supabase DB     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ OpenAI GPT-4    │
                    │ (Summaries)     │
                    └─────────────────┘
```

## Installation

1. **Install Dependencies**
   ```bash
   cd services/kpi-collector
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

3. **Database Setup**
   ```bash
   # Run migrations in the main project
   supabase migration apply
   ```

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_SERVICE_KEY` | Supabase service role key | Yes |
| `OPENAI_API_KEY` | OpenAI API key for summaries | Yes |
| `PROCORE_CLIENT_ID` | Procore OAuth client ID | Yes |
| `PROCORE_CLIENT_SECRET` | Procore OAuth client secret | Yes |
| `PROCORE_COMPANY_ID` | Default Procore company ID | Yes |
| `KPI_COLLECTOR_PORT` | Service port (default: 3001) | No |
| `CRON_SCHEDULE` | Cron schedule (default: 0 2 * * *) | No |

### Procore Setup

1. **Create OAuth Application** in Procore Developer Portal
2. **Configure Permissions**: Budget, Schedule, Safety, Quality read access
3. **Set Redirect URI**: Not required for client credentials flow
4. **Note Client ID and Secret** for environment configuration

## Usage

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

### Docker Deployment

```bash
# Build image
docker build -t kpi-collector .

# Run container
docker run -d \
  --name kpi-collector \
  --env-file .env \
  -p 3001:3001 \
  kpi-collector
```

## API Endpoints

### Health Check
```http
GET /health
```

### Manual KPI Collection
```http
POST /collect-kpis
```

### Generate Performance Summary
```http
POST /generate-summary/:companyId/:period
```

## KPI Collection Process

1. **Authentication**: OAuth client credentials flow with Procore
2. **Project Discovery**: Fetch active projects with Procore integration
3. **Data Collection**: Collect KPIs for each project:
   - Cost variance from budget vs actual
   - Schedule variance from planned vs actual dates
   - Safety incidents count for current quarter
   - Quality scores from inspections
4. **Data Mapping**: Map Procore data to standardized KPI metrics
5. **Database Storage**: Upsert KPI records in performance_kpi table
6. **Event Publishing**: Publish kpi.updated events
7. **AI Summary Generation**: Generate performance summaries using OpenAI

## KPI Metrics Collected

| Metric | Source | Description |
|--------|--------|-------------|
| `cost_variance` | Budget vs Actual | Percentage variance from original budget |
| `schedule_variance` | Schedule vs Actual | Average days variance from planned schedule |
| `safety_incidents` | Incident Reports | Count of safety incidents in current quarter |
| `quality_score` | Inspections | Average quality score from inspections |
| `budget_adherence` | Budget Analysis | Percentage of budget adherence |
| `on_time_delivery` | Schedule Analysis | Percentage of tasks completed on time |

## Event System

The service publishes events to support real-time updates:

### KPI Updated Event
```json
{
  "type": "kpi.updated",
  "company_id": "uuid",
  "period": "Q4-2024",
  "timestamp": "2024-12-04T02:00:00Z",
  "metadata": {
    "source": "kpi-collector",
    "automated": true
  }
}
```

### Batch Update Event
```json
{
  "type": "kpi.batch_updated",
  "companies": ["uuid1", "uuid2"],
  "period": "Q4-2024",
  "timestamp": "2024-12-04T02:00:00Z",
  "metadata": {
    "source": "kpi-collector",
    "automated": true,
    "batch_size": 2
  }
}
```

## AI Summary Generation

The service uses OpenAI GPT-4 to generate comprehensive performance summaries:

### Summary Sections
1. **Executive Summary** - Overall performance assessment
2. **Key Performance Indicators** - Detailed KPI analysis
3. **Trends and Changes** - Period-over-period comparison
4. **Strengths** - Well-performing areas
5. **Areas for Improvement** - Recommendations for underperformers
6. **Risk Assessment** - Potential risks and concerns
7. **Action Items** - Specific, actionable recommendations

### Summary Storage
Summaries are stored in the `performance_summaries` table and can be accessed via the API.

## Scheduling

The service runs automated KPI collection daily at 2:00 AM EST by default. The schedule can be customized using the `CRON_SCHEDULE` environment variable.

```javascript
// Default schedule: Daily at 2 AM EST
cron.schedule('0 2 * * *', collectKPIs, {
  timezone: "America/New_York"
});
```

## Error Handling

- **Retry Logic**: Automatic retries for transient failures
- **Error Events**: Failed collections publish error events
- **Graceful Degradation**: Continues processing other projects if one fails
- **Detailed Logging**: Comprehensive logging for debugging

## Monitoring

### Health Check
The service provides a health check endpoint for monitoring:

```bash
curl http://localhost:3001/health
```

### Logging
Logs are written to console and optionally to file. Log levels can be configured.

### Metrics
Monitor these key metrics:
- KPI collection success rate
- API response times
- Error rates
- Summary generation success

## Security

- **Service Role Access**: Uses Supabase service role for database access
- **OAuth Client Credentials**: Secure Procore API authentication
- **Non-root Container**: Docker container runs as non-root user
- **Environment Variables**: Sensitive data stored in environment variables

## Development

### Running Tests
```bash
npm test
npm run test:watch
```

### Linting
```bash
npm run lint
npm run lint:fix
```

### Manual Testing
```bash
# Test Procore connection
curl -X POST http://localhost:3001/collect-kpis

# Generate summary
curl -X POST http://localhost:3001/generate-summary/company-uuid/Q4-2024
```

## Troubleshooting

### Common Issues

1. **Procore Authentication Failures**
   - Verify client ID and secret
   - Check OAuth application permissions
   - Ensure company ID is correct

2. **Database Connection Issues**
   - Verify Supabase URL and service key
   - Check network connectivity
   - Ensure database migrations are applied

3. **OpenAI API Errors**
   - Verify API key is valid
   - Check rate limits and quotas
   - Monitor token usage

### Debug Mode
Set `LOG_LEVEL=debug` for detailed logging during troubleshooting.
