from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import openai
import pandas as pd
from unstructured.partition.auto import partition
from unstructured.partition.pdf import partition_pdf
import os
import uuid
import magic
import base64
import json
import tempfile
from io import BytesIO
from PIL import Image
import pytesseract
from supabase import create_client, Client
import asyncio
from decimal import Decimal
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI app initialization
app = FastAPI(title="Document Extractor Service", version="1.0.0")

# Environment variables for API keys
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_ANON_KEY")

if not all([OPENAI_API_KEY, SUPABASE_URL, SUPABASE_KEY]):
    raise ValueError("Missing required environment variables: OPENAI_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY")

# Initialize clients
openai.api_key = OPENAI_API_KEY
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Data models
class ExtractionRequest(BaseModel):
    file_id: str = Field(..., description="Unique identifier for the uploaded file")
    submission_id: str = Field(..., description="UUID of the bid submission")

class BidLineItem(BaseModel):
    csi_code: Optional[str] = None
    description: str
    qty: Optional[float] = None
    uom: Optional[str] = None  # Unit of measure
    unit_price: Optional[float] = None
    extended: float
    confidence_score: Optional[float] = None
    raw_text: Optional[str] = None

class BidAlternate(BaseModel):
    alternate_number: int
    description: str
    price: float
    confidence_score: Optional[float] = None
    raw_text: Optional[str] = None

class BidUnitPrice(BaseModel):
    item_number: Optional[str] = None
    description: str
    unit: str
    estimated_qty: Optional[float] = None
    unit_price: float
    extended_price: Optional[float] = None
    confidence_score: Optional[float] = None
    raw_text: Optional[str] = None

class ExtractionResult(BaseModel):
    submission_id: str
    file_id: str
    line_items_count: int
    alternates_count: int
    unit_prices_count: int
    base_bid_total: float
    extracted_at: str
    success: bool = True
    error_message: Optional[str] = None

# System prompt for OpenAI Vision
SYSTEM_PROMPT = """
You are a construction cost analyst. Extract every cost line item from this bid document image into JSON format.

Return a JSON object with these exact fields:
{
  "line_items": [
    {
      "csi_code": "string or null",
      "description": "string",
      "qty": "number or null",
      "uom": "string or null (sf, lf, ea, cy, etc.)",
      "unit_price": "number or null",
      "extended": "number (required)"
    }
  ],
  "base_bid_total": "number",
  "alternates": [
    {
      "number": "integer",
      "description": "string",
      "price": "number (positive for additive, negative for deductive)"
    }
  ],
  "unit_prices": [
    {
      "item_number": "string or null",
      "description": "string",
      "unit": "string",
      "estimated_qty": "number or null",
      "unit_price": "number",
      "extended_price": "number or null"
    }
  ]
}

Extract ALL cost information visible in the document. Be thorough and accurate.
"""

def detect_file_type(file_content: bytes) -> str:
    """Detect file MIME type using python-magic"""
    mime = magic.from_buffer(file_content, mime=True)
    return mime

def convert_pdf_to_images(pdf_content: bytes) -> List[Image.Image]:
    """Convert PDF pages to images for OCR processing"""
    try:
        # Save PDF to temporary file
        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as temp_pdf:
            temp_pdf.write(pdf_content)
            temp_pdf_path = temp_pdf.name
        
        # Use unstructured to extract images from PDF
        elements = partition_pdf(
            filename=temp_pdf_path,
            strategy="hi_res",
            extract_images_in_pdf=True,
            infer_table_structure=True
        )
        
        # Clean up temp file
        os.unlink(temp_pdf_path)
        
        # Convert to PIL Images (simplified - in production, would extract actual images)
        # For now, we'll use a placeholder approach
        images = []
        # This is a simplified implementation - in production, you'd extract actual page images
        
        return images
    except Exception as e:
        logger.error(f"Error converting PDF to images: {str(e)}")
        return []

def parse_xlsx_file(xlsx_content: bytes) -> Dict[str, Any]:
    """Parse XLSX file using pandas"""
    try:
        # Read XLSX into pandas DataFrame
        xlsx_io = BytesIO(xlsx_content)
        
        # Try to read multiple sheets
        excel_file = pd.ExcelFile(xlsx_io)
        all_data = {}
        
        for sheet_name in excel_file.sheet_names:
            df = pd.read_excel(xlsx_io, sheet_name=sheet_name)
            all_data[sheet_name] = df
        
        return all_data
    except Exception as e:
        logger.error(f"Error parsing XLSX file: {str(e)}")
        return {}

async def call_openai_vision(image_data: bytes, prompt: str) -> Dict[str, Any]:
    """Call OpenAI Vision API to extract data from image"""
    try:
        # Encode image to base64
        base64_image = base64.b64encode(image_data).decode('utf-8')
        
        response = await openai.ChatCompletion.acreate(
            model="gpt-4-vision-preview",
            messages=[
                {
                    "role": "system",
                    "content": prompt
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}",
                                "detail": "high"
                            }
                        }
                    ]
                }
            ],
            max_tokens=4000,
            temperature=0.1
        )
        
        content = response.choices[0].message.content
        return json.loads(content)
    except Exception as e:
        logger.error(f"OpenAI Vision API error: {str(e)}")
        return {}

async def process_xlsx_with_openai(xlsx_data: Dict[str, pd.DataFrame]) -> Dict[str, Any]:
    """Process XLSX data by converting to text and calling OpenAI"""
    try:
        # Convert DataFrames to text representation
        combined_text = ""
        for sheet_name, df in xlsx_data.items():
            combined_text += f"\n\nSheet: {sheet_name}\n"
            combined_text += df.to_string(index=False)
        
        # Call OpenAI text completion instead of vision
        response = await openai.ChatCompletion.acreate(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": f"Extract cost information from this spreadsheet data:\n{combined_text}"
                }
            ],
            max_tokens=4000,
            temperature=0.1
        )
        
        content = response.choices[0].message.content
        return json.loads(content)
    except Exception as e:
        logger.error(f"OpenAI text processing error: {str(e)}")
        return {}

async def persist_extraction_data(
    submission_id: str,
    file_id: str,
    extracted_data: Dict[str, Any]
) -> bool:
    """Persist extracted data to Supabase database"""
    try:
        # Insert line items
        if "line_items" in extracted_data:
            line_items_data = []
            for item in extracted_data["line_items"]:
                line_item_data = {
                    "submission_id": submission_id,
                    "file_id": file_id,
                    "csi_code": item.get("csi_code"),
                    "description": item["description"],
                    "qty": item.get("qty"),
                    "uom": item.get("uom"),
                    "unit_price": item.get("unit_price"),
                    "extended": float(item["extended"]),
                    "confidence_score": 0.85,  # Default confidence
                    "raw_text": json.dumps(item)
                }
                line_items_data.append(line_item_data)
            
            if line_items_data:
                result = supabase.table("bid_line_item").insert(line_items_data).execute()
                logger.info(f"Inserted {len(line_items_data)} line items")
        
        # Insert alternates
        if "alternates" in extracted_data:
            alternates_data = []
            for alt in extracted_data["alternates"]:
                alternate_data = {
                    "submission_id": submission_id,
                    "file_id": file_id,
                    "alternate_number": int(alt["number"]),
                    "description": alt["description"],
                    "price": float(alt["price"]),
                    "confidence_score": 0.85,
                    "raw_text": json.dumps(alt)
                }
                alternates_data.append(alternate_data)
            
            if alternates_data:
                result = supabase.table("bid_alt").insert(alternates_data).execute()
                logger.info(f"Inserted {len(alternates_data)} alternates")
        
        # Insert unit prices
        if "unit_prices" in extracted_data:
            unit_prices_data = []
            for unit_price in extracted_data["unit_prices"]:
                unit_price_data = {
                    "submission_id": submission_id,
                    "file_id": file_id,
                    "item_number": unit_price.get("item_number"),
                    "description": unit_price["description"],
                    "unit": unit_price["unit"],
                    "estimated_qty": unit_price.get("estimated_qty"),
                    "unit_price": float(unit_price["unit_price"]),
                    "extended_price": unit_price.get("extended_price"),
                    "confidence_score": 0.85,
                    "raw_text": json.dumps(unit_price)
                }
                unit_prices_data.append(unit_price_data)
            
            if unit_prices_data:
                result = supabase.table("bid_unit_price").insert(unit_prices_data).execute()
                logger.info(f"Inserted {len(unit_prices_data)} unit prices")
        
        return True
    except Exception as e:
        logger.error(f"Database persistence error: {str(e)}")
        return False

async def get_extraction_summary(submission_id: str, file_id: str) -> Dict[str, Any]:
    """Get summary of extraction results"""
    try:
        # Call the database function
        result = supabase.rpc("get_extraction_summary", {
            "p_submission_id": submission_id,
            "p_file_id": file_id
        }).execute()
        
        if result.data:
            return result.data
        else:
            return {
                "submission_id": submission_id,
                "file_id": file_id,
                "line_items_count": 0,
                "alternates_count": 0,
                "unit_prices_count": 0,
                "base_bid_total": 0.0,
                "extracted_at": ""
            }
    except Exception as e:
        logger.error(f"Error getting extraction summary: {str(e)}")
        return {}

# POST /extract endpoint
@app.post("/extract", response_model=ExtractionResult)
async def extract_document(
    file: UploadFile = File(...),
    file_id: str = Form(...),
    submission_id: str = Form(...)
):
    """Extract cost data from uploaded bid document"""
    logger.info(f"Starting extraction for file_id: {file_id}, submission_id: {submission_id}")
    
    try:
        # Read file content
        file_content = await file.read()
        
        # 1. Detect MIME type
        mime_type = detect_file_type(file_content)
        logger.info(f"Detected MIME type: {mime_type}")
        
        extracted_data = {}
        
        # 2. Process based on file type
        if mime_type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
            # XLSX file - use pandas
            logger.info("Processing XLSX file with pandas")
            xlsx_data = parse_xlsx_file(file_content)
            if xlsx_data:
                extracted_data = await process_xlsx_with_openai(xlsx_data)
        
        elif mime_type == "application/pdf":
            # PDF file - convert to images and use OCR + Vision
            logger.info("Processing PDF file with OCR and Vision API")
            # For simplicity, we'll process the PDF text directly
            # In production, you'd convert to images and use Vision API
            try:
                # Use unstructured to extract text from PDF
                with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as temp_pdf:
                    temp_pdf.write(file_content)
                    temp_pdf_path = temp_pdf.name
                
                elements = partition_pdf(filename=temp_pdf_path, strategy="fast")
                text_content = "\n".join([str(element) for element in elements])
                
                # Clean up temp file
                os.unlink(temp_pdf_path)
                
                # Process with OpenAI text model
                response = await openai.ChatCompletion.acreate(
                    model="gpt-4",
                    messages=[
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": f"Extract cost information from this PDF text:\n{text_content}"}
                    ],
                    max_tokens=4000,
                    temperature=0.1
                )
                
                extracted_data = json.loads(response.choices[0].message.content)
            except Exception as e:
                logger.error(f"PDF processing error: {str(e)}")
                extracted_data = {}
        
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type: {mime_type}. Only XLSX and PDF files are supported."
            )
        
        # 3. Persist extracted data to database
        if extracted_data:
            success = await persist_extraction_data(submission_id, file_id, extracted_data)
            if not success:
                raise HTTPException(status_code=500, detail="Failed to persist extracted data")
        
        # 4. Return summary of extraction
        summary = await get_extraction_summary(submission_id, file_id)
        
        return ExtractionResult(
            submission_id=submission_id,
            file_id=file_id,
            line_items_count=summary.get("line_items_count", 0),
            alternates_count=summary.get("alternates_count", 0),
            unit_prices_count=summary.get("unit_prices_count", 0),
            base_bid_total=float(summary.get("base_bid_total", 0.0)),
            extracted_at=str(summary.get("extracted_at", "")),
            success=True
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Extraction error: {str(e)}")
        return ExtractionResult(
            submission_id=submission_id,
            file_id=file_id,
            line_items_count=0,
            alternates_count=0,
            unit_prices_count=0,
            base_bid_total=0.0,
            extracted_at="",
            success=False,
            error_message=str(e)
        )

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "doc-extractor"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
