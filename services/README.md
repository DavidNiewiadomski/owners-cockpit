# Document Extractor Service

This service automatically extracts cost data from bid submission documents (PDF and XLSX files) using OpenAI's GPT-4 Vision API and stores the structured data in the database.

## Overview

The document extractor service is part of the post-RFP process and consists of:

1. **Python FastAPI Service** (`doc_extractor.py`) - Main extraction service
2. **AWS Lambda Trigger** (`aws-lambda/doc-extractor-trigger/`) - S3 event handler
3. **Database Schema** (`supabase/migrations/20250702220000_create_document_extraction_tables.sql`) - Storage tables
4. **AWS Infrastructure** (`aws-infrastructure/doc-extractor-s3-trigger.json`) - CloudFormation template

## Features

- **Multi-format Support**: Handles both PDF and XLSX files
- **MIME Detection**: Automatically detects file types
- **AI-Powered Extraction**: Uses OpenAI GPT-4 for intelligent data extraction
- **Structured Data**: Extracts line items, alternates, and unit prices
- **Database Integration**: Stores results in Supabase with proper relationships
- **S3 Integration**: Triggered automatically when files are uploaded
- **Error Handling**: Comprehensive error handling and logging

## Database Schema

The service creates three main tables:

### `bid_line_item`
- Individual cost line items from bid documents
- Fields: CSI code, description, quantity, unit of measure, unit price, extended price

### `bid_alt` 
- Bid alternates (additive/deductive scope items)
- Fields: alternate number, description, price

### `bid_unit_price`
- Unit price schedule items
- Fields: item number, description, unit, estimated quantity, unit price

## Installation

### Prerequisites

- Python 3.8+
- OpenAI API key
- Supabase project
- AWS account (for S3 integration)
- Tesseract OCR (for PDF processing)

### 1. Install Python Dependencies

```bash
cd services/
pip install -r requirements.txt
```

### 2. Install System Dependencies

```bash
# macOS
brew install tesseract
brew install libmagic

# Ubuntu/Debian
sudo apt-get install tesseract-ocr
sudo apt-get install libmagic1

# CentOS/RHEL
sudo yum install tesseract
sudo yum install file-devel
```

### 3. Environment Variables

Create a `.env` file or set these environment variables:

```bash
OPENAI_API_KEY=your_openai_api_key_here
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Migration

Run the database migration to create the required tables:

```bash
supabase migration apply 20250702220000_create_document_extraction_tables
```

## Usage

### Running the Service Locally

```bash
cd services/
python doc_extractor.py
```

The service will start on `http://localhost:8000`

### API Endpoints

#### POST /extract

Extracts cost data from an uploaded document.

**Parameters:**
- `file`: Uploaded file (PDF or XLSX)
- `file_id`: Unique identifier for the file
- `submission_id`: UUID of the bid submission

**Response:**
```json
{
  "submission_id": "uuid",
  "file_id": "string",
  "line_items_count": 42,
  "alternates_count": 3,
  "unit_prices_count": 15,
  "base_bid_total": 1250000.00,
  "extracted_at": "2025-07-02T21:32:09Z",
  "success": true
}
```

#### GET /health

Health check endpoint.

### Example Usage with curl

```bash
curl -X POST "http://localhost:8000/extract" \
  -F "file=@bid_document.pdf" \
  -F "file_id=test_file_001" \
  -F "submission_id=550e8400-e29b-41d4-a716-446655440000"
```

## AWS Deployment

### 1. Deploy Infrastructure

```bash
aws cloudformation create-stack \
  --stack-name doc-extractor-infrastructure \
  --template-body file://aws-infrastructure/doc-extractor-s3-trigger.json \
  --parameters ParameterKey=DocExtractorEndpoint,ParameterValue=https://your-service-endpoint.com \
               ParameterKey=Environment,ParameterValue=dev \
  --capabilities CAPABILITY_IAM
```

### 2. Deploy Lambda Function

```bash
cd aws-lambda/doc-extractor-trigger/
npm install
zip -r function.zip .

aws lambda update-function-code \
  --function-name doc-extractor-trigger-dev \
  --zip-file fileb://function.zip
```

### 3. Configure S3 Trigger

The CloudFormation template automatically sets up S3 triggers for:
- `rfp_submissions/**/*.pdf`
- `rfp_submissions/**/*.xlsx`

## Integration with Agent Operating Rules

The service follows the Agent Operating Rules for:

### Model Selection
- Uses **GPT-4o** for vision tasks (PDF image processing)
- Uses **GPT-4** for text processing (XLSX data)
- Falls back to **Gemini Flash** if vision processing fails

### Credential Handling
- All API keys stored in environment variables
- No hard-coded credentials in code
- Follows Rule #9 for secure credential management

### Cost Management
- Monitors token usage for cost optimization
- Uses efficient prompts to minimize API calls
- Implements retry logic with exponential backoff

## Error Handling

The service includes comprehensive error handling:

- **File Type Validation**: Only processes PDF and XLSX files
- **API Failures**: Graceful degradation with meaningful error messages
- **Database Errors**: Transaction rollback on failures
- **Timeout Handling**: 5-minute timeout for Lambda functions
- **Logging**: Detailed logging for debugging and monitoring

## License

This project is part of the Owners Cockpit platform.
