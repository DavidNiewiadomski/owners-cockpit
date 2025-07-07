# Lead Time Predictor Service

AI-powered delivery time forecasting using LightGBM on historical awarded package data with ENR commodity index integration.

## Overview

This microservice provides intelligent lead time predictions for construction work packages by analyzing:
- Historical awarded package data
- ENR commodity price indices
- Project characteristics (size, urgency, location)
- Seasonal and market factors

## Features

- **LightGBM Machine Learning Model** - Gradient boosting for accurate predictions
- **ENR Index Integration** - Real-time commodity price impact analysis
- **Synthetic Data Generation** - Bootstrap training when historical data is limited
- **Confidence Intervals** - Statistical uncertainty quantification
- **RESTful API** - Easy integration with other services
- **Model Versioning** - Track and manage model deployments
- **Auto-Training** - Scheduled retraining on new data

## API Endpoints

### POST /lead-time/forecast
Forecast delivery time for a work package.

**Request:**
```json
{
  "work_pkg": "05120",
  "fab_start_date": "2024-02-15T10:00:00Z",
  "region": "US-MW",
  "project_type": "commercial",
  "project_size": "large",
  "urgency": "normal",
  "quantity": 1500.0
}
```

**Response:**
```json
{
  "delivery_est": 42,
  "confidence_interval": {
    "lower": 34,
    "upper": 50
  },
  "factors": {
    "work_package": "05120",
    "region": "US-MW",
    "urgency_level": "normal",
    "project_size": "large",
    "seasonal_factor": 0.15,
    "market_conditions": "stable"
  },
  "enr_impact": 0.052,
  "model_version": "v20241215_143022",
  "generated_at": "2024-12-15T14:30:45"
}
```

### POST /model/train
Trigger model retraining on latest data.

**Response:**
```json
{
  "status": "success",
  "model_version": "v20241215_143022",
  "records_used": 1847,
  "metrics": {
    "mae": 3.2,
    "rmse": 4.8
  },
  "trained_at": "2024-12-15T14:30:22"
}
```

### GET /model/status
Get current model status and performance metrics.

**Response:**
```json
{
  "status": "trained",
  "last_trained": "2024-12-15T14:30:22",
  "model_version": "v20241215_143022",
  "records_used": 1847,
  "accuracy_metrics": {
    "mae": 3.2,
    "rmse": 4.8
  }
}
```

### GET /health
Service health check endpoint.

## Work Package Codes (CSI)

The service supports common CSI Division codes:

| Code | Description | Typical Lead Time |
|------|-------------|-------------------|
| 03200 | Concrete Accessories | 10 days |
| 03300 | Cast-in-Place Concrete | 14 days |
| 05120 | Structural Steel | 45 days |
| 05500 | Metal Fabrications | 28 days |
| 07920 | Joint Sealers | 21 days |
| 08110 | Metal Doors | 35 days |
| 09900 | Painting | 14 days |
| 22110 | Domestic Water Piping | 30 days |
| 23090 | HVAC Instrumentation | 25 days |
| 26050 | Electrical Lighting | 40 days |
| 27100 | Audio-Visual Systems | 50 days |
| 31230 | Site Improvements | 60 days |

## Model Features

The LightGBM model uses the following features:

### Categorical Features
- **CSI Code** - Work package type
- **Region** - Geographic location (US-NE, US-SE, US-MW, US-SW, US-W, CA, MX)
- **Project Type** - commercial, residential, industrial, infrastructure
- **Urgency** - low, normal, high, critical
- **Project Size** - small, medium, large, mega

### Numerical Features
- **Quantity** - Scale factor or quantity (log-transformed)
- **Project Budget** - Total project value (log-transformed)
- **ENR Indices** - Steel, concrete, lumber commodity prices
- **Vendor Rating** - Supplier performance score (1-5)
- **Seasonal Factors** - Month sine/cosine encoding

## Installation & Setup

### Local Development

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set environment variables:**
   ```bash
   export SUPABASE_URL="your-supabase-url"
   export SUPABASE_SERVICE_KEY="your-service-key"
   ```

3. **Run the service:**
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8002 --reload
   ```

### Docker Deployment

1. **Build the image:**
   ```bash
   docker build -t leadtime-predictor .
   ```

2. **Run the container:**
   ```bash
   docker run -p 8002:8002 \
     -e SUPABASE_URL="your-supabase-url" \
     -e SUPABASE_SERVICE_KEY="your-service-key" \
     leadtime-predictor
   ```

## Database Schema

The service expects the following database tables:

### lead_time
```sql
CREATE TABLE lead_time (
  id SERIAL PRIMARY KEY,
  rfp_id INTEGER REFERENCES bid_projects(id),
  issue_date TIMESTAMPTZ,
  delivery_date TIMESTAMPTZ,
  actual_delivery_date TIMESTAMPTZ,
  status VARCHAR(50),
  lead_time_days INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Integration Tables
- `bid_line_items` - CSI codes and quantities
- `bid_projects` - Project metadata
- `vendor_bid_submissions` - Supplier information
- `bid_vendors` - Vendor ratings and qualifications

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_SERVICE_KEY` | Service role key | Yes |
| `ENR_API_KEY` | ENR data API key | No* |
| `MODEL_RETRAIN_SCHEDULE` | Cron schedule for retraining | No |

*Uses mock data if ENR API key not provided

### Model Parameters

Key LightGBM hyperparameters:
- **Learning Rate:** 0.05
- **Num Leaves:** 31
- **Feature Fraction:** 0.9
- **Bagging Fraction:** 0.8
- **Early Stopping:** 100 rounds

## Performance

### Typical Accuracy
- **MAE (Mean Absolute Error):** 3-5 days
- **RMSE (Root Mean Square Error):** 4-7 days
- **95% Confidence Interval:** ±20% of prediction

### Response Times
- **Prediction:** < 100ms
- **Model Training:** 2-5 minutes (1000+ records)
- **Health Check:** < 10ms

## Monitoring & Logging

The service logs:
- Prediction requests and responses
- Model training events and metrics
- Database query performance
- Error conditions and exceptions

Log levels: INFO, WARNING, ERROR

## Integration

### Frontend Integration
```typescript
interface ForecastRequest {
  work_pkg: string;
  fab_start_date: string;
  region?: string;
  project_type?: string;
  project_size?: string;
  urgency?: string;
  quantity?: number;
}

const forecastDelivery = async (request: ForecastRequest) => {
  const response = await fetch('/api/leadtime-predictor/lead-time/forecast', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });
  return response.json();
};
```

### Supabase Edge Function Integration
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { work_pkg, fab_start_date } = await req.json()
  
  const response = await fetch('http://leadtime-predictor:8002/lead-time/forecast', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ work_pkg, fab_start_date })
  })
  
  return new Response(JSON.stringify(await response.json()))
})
```

## Troubleshooting

### Common Issues

1. **Model Not Trained**
   - Trigger training: `POST /model/train`
   - Check data availability in database
   - Verify Supabase credentials

2. **Poor Predictions**
   - Review training data quality
   - Check ENR index connectivity
   - Validate input feature encoding

3. **High Latency**
   - Monitor database query performance
   - Check model size and complexity
   - Review concurrent request load

### Debug Mode
Run with debug logging:
```bash
uvicorn main:app --log-level debug
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

## License

MIT License - see LICENSE file for details.
