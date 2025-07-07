# Risk Analyzer Service

AI-powered document parsing for vendor prequalification risk assessment using AWS Textract.

## Features

- **Insurance Certificate Analysis**: Extracts coverage limits, expiry dates, and policy details
- **W-9 Tax Form Processing**: Extracts business information and tax classification
- **Financial Statement Analysis**: Extracts key financial metrics and ratios
- **Automated Risk Assessment**: Flags potential risks and updates company risk scores
- **AWS Textract Integration**: Uses AWS OCR for accurate document text extraction

## API Endpoints

### POST /analyze/certificate
Analyzes insurance certificates and extracts:
- Policy type and coverage limits
- Effective and expiry dates
- Carrier information and policy numbers
- Automatically flags expiring policies (< 60 days)

**Parameters:**
- `file`: Document file (PDF, PNG, JPG)
- `prequal_id`: Prequalification ID
- `file_id`: Optional file identifier

### POST /analyze/w9
Analyzes W-9 tax forms and extracts:
- Business name and tax classification
- EIN/SSN identification numbers
- Business address and certification date

### POST /analyze/financials
Analyzes financial statements and extracts:
- Revenue, assets, liabilities
- Net worth and working capital
- Statement dates and audit status
- Automatically calculates debt ratios and flags risks

### GET /health
Health check endpoint for service monitoring.

## Setup

### Prerequisites
- Python 3.11+
- AWS Account with Textract access
- Supabase project with prequalification schema

### Environment Variables
Copy `.env.example` to `.env` and configure:

```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# AWS Textract Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
```

### Local Development
```bash
# Install dependencies
pip install -r requirements.txt

# Run the service
python main.py
```

Service will be available at `http://localhost:8001`

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## Risk Assessment Logic

### Insurance Risks
- **Expiry Warning**: Flags policies expiring within 60 days
- **Low Coverage**: Alerts for coverage below $1M
- **Missing Information**: Identifies incomplete certificate data

### Financial Risks
- **High Debt Ratio**: Flags debt-to-asset ratios > 80%
- **Negative Working Capital**: Identifies cash flow concerns
- **Unaudited Statements**: Notes lack of independent verification

### Risk Scoring
- High severity risks: +10 points
- Medium severity risks: +5 points
- Low severity risks: +2 points

Risk scores are automatically updated in the company profile.

## Integration

### Frontend Integration
```typescript
// Example usage in React component
const analyzeDocument = async (file: File, prequalId: string, type: 'certificate' | 'w9' | 'financials') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('prequal_id', prequalId);
  
  const response = await fetch(`http://localhost:8001/analyze/${type}`, {
    method: 'POST',
    body: formData,
  });
  
  return response.json();
};
```

### Edge Functions Integration
```typescript
// Example Supabase Edge Function
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const formData = await req.formData()
  
  const response = await fetch('http://risk-analyzer:8001/analyze/certificate', {
    method: 'POST',
    body: formData,
  })
  
  return new Response(await response.text(), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

## Monitoring

The service includes:
- Health check endpoint at `/health`
- Structured logging with Loguru
- Error tracking and reporting
- Performance metrics for document processing

## Security

- Service key authentication for Supabase
- AWS IAM roles for Textract access
- Input validation and sanitization
- No sensitive data logging

## Support

For issues or questions regarding the risk analyzer service, check the logs or health endpoint for service status.
