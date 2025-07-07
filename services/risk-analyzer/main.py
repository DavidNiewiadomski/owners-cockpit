"""
Risk Analyzer Service
AI-powered document parsing for vendor prequalification risk assessment
"""

import os
from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import boto3
from botocore.exceptions import ClientError
import json
from datetime import datetime, timedelta
import dateparser
import re
from loguru import logger
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Risk Analyzer Service",
    description="AI-powered document parsing for vendor prequalification",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure based on your needs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY")
)

textract_client = boto3.client(
    'textract',
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION", "us-east-1")
)

# Pydantic models
class AnalysisResponse(BaseModel):
    success: bool
    message: str
    extracted_data: Optional[Dict[str, Any]] = None
    risk_flags: Optional[list] = None

class InsuranceCertificateData(BaseModel):
    policy_type: str
    coverage_limit: float
    deductible: Optional[float] = None
    effective_date: str
    expiry_date: str
    carrier_name: str
    policy_number: str

class W9Data(BaseModel):
    business_name: str
    tax_classification: str
    ein_or_ssn: str
    address: str
    certification_date: str

class FinancialData(BaseModel):
    revenue: Optional[float] = None
    assets: Optional[float] = None
    liabilities: Optional[float] = None
    net_worth: Optional[float] = None
    working_capital: Optional[float] = None
    statement_date: str
    audited: bool = False

# Document analyzers
class TextractAnalyzer:
    """Base class for AWS Textract document analysis"""
    
    def __init__(self):
        self.client = textract_client
    
    def extract_text_from_document(self, document_bytes: bytes) -> Dict[str, Any]:
        """Extract text using Textract"""
        try:
            response = self.client.detect_document_text(
                Document={'Bytes': document_bytes}
            )
            
            # Extract all text blocks
            text_blocks = []
            for block in response['Blocks']:
                if block['BlockType'] == 'LINE':
                    text_blocks.append(block['Text'])
            
            full_text = '\n'.join(text_blocks)
            
            return {
                'full_text': full_text,
                'blocks': response['Blocks'],
                'raw_response': response
            }
        except ClientError as e:
            logger.error(f"Textract error: {e}")
            raise HTTPException(status_code=500, detail=f"Document analysis failed: {str(e)}")

class InsuranceCertificateAnalyzer(TextractAnalyzer):
    """Analyzer for insurance certificates"""
    
    def analyze(self, document_bytes: bytes) -> InsuranceCertificateData:
        """Extract insurance certificate data"""
        extracted = self.extract_text_from_document(document_bytes)
        text = extracted['full_text'].lower()
        
        # Extract policy type
        policy_type = self._extract_policy_type(text)
        
        # Extract coverage limits
        coverage_limit = self._extract_coverage_limit(text)
        
        # Extract dates
        effective_date = self._extract_effective_date(text)
        expiry_date = self._extract_expiry_date(text)
        
        # Extract carrier and policy number
        carrier_name = self._extract_carrier_name(text)
        policy_number = self._extract_policy_number(text)
        
        # Extract deductible
        deductible = self._extract_deductible(text)
        
        return InsuranceCertificateData(
            policy_type=policy_type,
            coverage_limit=coverage_limit,
            deductible=deductible,
            effective_date=effective_date,
            expiry_date=expiry_date,
            carrier_name=carrier_name,
            policy_number=policy_number
        )
    
    def _extract_policy_type(self, text: str) -> str:
        """Extract insurance policy type"""
        policy_patterns = [
            r'general liability',
            r'workers.{0,10}compensation',
            r'commercial auto',
            r'professional liability',
            r'umbrella',
            r'commercial property'
        ]
        
        for pattern in policy_patterns:
            if re.search(pattern, text, re.IGNORECASE):
                return re.search(pattern, text, re.IGNORECASE).group(0).title()
        
        return "Unknown"
    
    def _extract_coverage_limit(self, text: str) -> float:
        """Extract coverage limit amount"""
        # Look for common coverage limit patterns
        patterns = [
            r'\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:million|m)',  # $1.5 million
            r'\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)',  # $1,000,000
            r'(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:million|m)',  # 1.5 million
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                amount_str = matches[0].replace(',', '')
                amount = float(amount_str)
                
                # Convert millions to actual amount
                if 'million' in text.lower() or 'm' in text.lower():
                    amount *= 1000000
                
                return amount
        
        return 0.0
    
    def _extract_effective_date(self, text: str) -> str:
        """Extract policy effective date"""
        return self._extract_date(text, ['effective', 'from', 'start'])
    
    def _extract_expiry_date(self, text: str) -> str:
        """Extract policy expiry date"""
        return self._extract_date(text, ['expir', 'to', 'end', 'until'])
    
    def _extract_date(self, text: str, keywords: list) -> str:
        """Extract date based on keywords"""
        lines = text.split('\n')
        
        for line in lines:
            for keyword in keywords:
                if keyword in line.lower():
                    # Extract date from this line
                    date_patterns = [
                        r'\d{1,2}/\d{1,2}/\d{4}',
                        r'\d{1,2}-\d{1,2}-\d{4}',
                        r'\w+ \d{1,2}, \d{4}',
                        r'\d{1,2} \w+ \d{4}'
                    ]
                    
                    for pattern in date_patterns:
                        match = re.search(pattern, line)
                        if match:
                            parsed_date = dateparser.parse(match.group(0))
                            if parsed_date:
                                return parsed_date.isoformat()
        
        return datetime.now().isoformat()
    
    def _extract_carrier_name(self, text: str) -> str:
        """Extract insurance carrier name"""
        # Look for common insurance company patterns
        carrier_patterns = [
            r'(?:carrier|insurer|company):\s*([^\n]+)',
            r'([A-Z][a-z]+ Insurance[^\n]*)',
            r'([A-Z][a-z]+ Mutual[^\n]*)'
        ]
        
        for pattern in carrier_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        
        return "Unknown"
    
    def _extract_policy_number(self, text: str) -> str:
        """Extract policy number"""
        policy_patterns = [
            r'policy\s*(?:number|no|#):\s*([A-Z0-9\-]+)',
            r'policy:\s*([A-Z0-9\-]+)',
            r'([A-Z]{2,}\d{6,})'  # Common policy number format
        ]
        
        for pattern in policy_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        
        return "Unknown"
    
    def _extract_deductible(self, text: str) -> Optional[float]:
        """Extract deductible amount"""
        deductible_patterns = [
            r'deductible:\s*\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)',
            r'ded:\s*\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)'
        ]
        
        for pattern in deductible_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return float(match.group(1).replace(',', ''))
        
        return None

class W9Analyzer(TextractAnalyzer):
    """Analyzer for W-9 tax forms"""
    
    def analyze(self, document_bytes: bytes) -> W9Data:
        """Extract W-9 form data"""
        extracted = self.extract_text_from_document(document_bytes)
        text = extracted['full_text']
        
        return W9Data(
            business_name=self._extract_business_name(text),
            tax_classification=self._extract_tax_classification(text),
            ein_or_ssn=self._extract_ein_or_ssn(text),
            address=self._extract_address(text),
            certification_date=self._extract_certification_date(text)
        )
    
    def _extract_business_name(self, text: str) -> str:
        """Extract business name from W-9"""
        lines = text.split('\n')
        for i, line in enumerate(lines):
            if 'name' in line.lower() and 'business' in line.lower():
                # Next line likely contains the business name
                if i + 1 < len(lines):
                    return lines[i + 1].strip()
        return "Unknown"
    
    def _extract_tax_classification(self, text: str) -> str:
        """Extract tax classification"""
        classifications = [
            'individual', 'sole proprietor', 'c corporation', 
            's corporation', 'partnership', 'llc'
        ]
        
        text_lower = text.lower()
        for classification in classifications:
            if classification in text_lower:
                return classification.title()
        
        return "Unknown"
    
    def _extract_ein_or_ssn(self, text: str) -> str:
        """Extract EIN or SSN"""
        # EIN format: XX-XXXXXXX
        ein_pattern = r'\d{2}-\d{7}'
        ein_match = re.search(ein_pattern, text)
        if ein_match:
            return ein_match.group(0)
        
        # SSN format: XXX-XX-XXXX
        ssn_pattern = r'\d{3}-\d{2}-\d{4}'
        ssn_match = re.search(ssn_pattern, text)
        if ssn_match:
            return ssn_match.group(0)
        
        return "Unknown"
    
    def _extract_address(self, text: str) -> str:
        """Extract business address"""
        # Look for address patterns
        address_patterns = [
            r'\d+\s+[A-Za-z\s]+,\s*[A-Za-z\s]+,\s*[A-Z]{2}\s*\d{5}',
            r'\d+\s+[A-Za-z\s]+\n[A-Za-z\s]+,\s*[A-Z]{2}\s*\d{5}'
        ]
        
        for pattern in address_patterns:
            match = re.search(pattern, text)
            if match:
                return match.group(0).replace('\n', ', ')
        
        return "Unknown"
    
    def _extract_certification_date(self, text: str) -> str:
        """Extract certification date"""
        date_patterns = [
            r'date.*?(\d{1,2}/\d{1,2}/\d{4})',
            r'(\d{1,2}/\d{1,2}/\d{4})'
        ]
        
        for pattern in date_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                parsed_date = dateparser.parse(match.group(1))
                if parsed_date:
                    return parsed_date.isoformat()
        
        return datetime.now().isoformat()

class FinancialAnalyzer(TextractAnalyzer):
    """Analyzer for financial statements"""
    
    def analyze(self, document_bytes: bytes) -> FinancialData:
        """Extract financial statement data"""
        extracted = self.extract_text_from_document(document_bytes)
        text = extracted['full_text']
        
        return FinancialData(
            revenue=self._extract_revenue(text),
            assets=self._extract_assets(text),
            liabilities=self._extract_liabilities(text),
            net_worth=self._extract_net_worth(text),
            working_capital=self._extract_working_capital(text),
            statement_date=self._extract_statement_date(text),
            audited=self._is_audited(text)
        )
    
    def _extract_financial_amount(self, text: str, keywords: list) -> Optional[float]:
        """Extract financial amounts based on keywords"""
        lines = text.split('\n')
        
        for line in lines:
            line_lower = line.lower()
            for keyword in keywords:
                if keyword in line_lower:
                    # Extract amount from this line
                    amount_patterns = [
                        r'\$\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)',
                        r'(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)'
                    ]
                    
                    for pattern in amount_patterns:
                        match = re.search(pattern, line)
                        if match:
                            amount_str = match.group(1).replace(',', '')
                            try:
                                return float(amount_str)
                            except ValueError:
                                continue
        
        return None
    
    def _extract_revenue(self, text: str) -> Optional[float]:
        """Extract revenue/sales amount"""
        keywords = ['revenue', 'sales', 'gross income', 'total income']
        return self._extract_financial_amount(text, keywords)
    
    def _extract_assets(self, text: str) -> Optional[float]:
        """Extract total assets"""
        keywords = ['total assets', 'assets']
        return self._extract_financial_amount(text, keywords)
    
    def _extract_liabilities(self, text: str) -> Optional[float]:
        """Extract total liabilities"""
        keywords = ['total liabilities', 'liabilities']
        return self._extract_financial_amount(text, keywords)
    
    def _extract_net_worth(self, text: str) -> Optional[float]:
        """Extract net worth/equity"""
        keywords = ['net worth', 'equity', 'stockholders equity']
        return self._extract_financial_amount(text, keywords)
    
    def _extract_working_capital(self, text: str) -> Optional[float]:
        """Extract working capital"""
        keywords = ['working capital']
        return self._extract_financial_amount(text, keywords)
    
    def _extract_statement_date(self, text: str) -> str:
        """Extract statement date"""
        date_patterns = [
            r'as of\s+(\w+ \d{1,2}, \d{4})',
            r'(\d{1,2}/\d{1,2}/\d{4})',
            r'(\w+ \d{1,2}, \d{4})'
        ]
        
        for pattern in date_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                parsed_date = dateparser.parse(match.group(1))
                if parsed_date:
                    return parsed_date.isoformat()
        
        return datetime.now().isoformat()
    
    def _is_audited(self, text: str) -> bool:
        """Check if financial statement is audited"""
        audit_keywords = ['audited', 'independent auditor', 'cpa firm']
        text_lower = text.lower()
        
        for keyword in audit_keywords:
            if keyword in text_lower:
                return True
        
        return False

# Risk assessment functions
def assess_insurance_risk(certificate_data: InsuranceCertificateData) -> list:
    """Assess insurance-related risks"""
    risks = []
    
    # Check expiry date
    expiry_date = datetime.fromisoformat(certificate_data.expiry_date.replace('Z', '+00:00'))
    days_until_expiry = (expiry_date - datetime.now()).days
    
    if days_until_expiry < 60:
        risks.append({
            'type': 'insurance_expiry',
            'severity': 'high' if days_until_expiry < 30 else 'medium',
            'message': f'Insurance expires in {days_until_expiry} days',
            'days_until_expiry': days_until_expiry
        })
    
    # Check coverage limits
    if certificate_data.coverage_limit < 1000000:  # Less than $1M
        risks.append({
            'type': 'low_coverage',
            'severity': 'medium',
            'message': f'Coverage limit ${certificate_data.coverage_limit:,.2f} may be insufficient',
            'coverage_amount': certificate_data.coverage_limit
        })
    
    return risks

def assess_financial_risk(financial_data: FinancialData) -> list:
    """Assess financial-related risks"""
    risks = []
    
    # Check debt-to-equity ratio
    if financial_data.assets and financial_data.liabilities:
        debt_ratio = financial_data.liabilities / financial_data.assets
        if debt_ratio > 0.8:
            risks.append({
                'type': 'high_debt_ratio',
                'severity': 'high',
                'message': f'High debt-to-asset ratio: {debt_ratio:.2%}',
                'debt_ratio': debt_ratio
            })
    
    # Check working capital
    if financial_data.working_capital and financial_data.working_capital < 0:
        risks.append({
            'type': 'negative_working_capital',
            'severity': 'high',
            'message': f'Negative working capital: ${financial_data.working_capital:,.2f}',
            'working_capital': financial_data.working_capital
        })
    
    return risks

async def update_company_risk_score(company_id: str, risk_flags: list):
    """Update company risk score based on identified risks"""
    try:
        # Get current company data
        response = supabase.table('companies').select('risk_score').eq('id', company_id).single().execute()
        current_score = response.data.get('risk_score', 0) if response.data else 0
        
        # Calculate risk score increment
        risk_increment = 0
        for risk in risk_flags:
            if risk['severity'] == 'high':
                risk_increment += 10
            elif risk['severity'] == 'medium':
                risk_increment += 5
            else:
                risk_increment += 2
        
        new_score = current_score + risk_increment
        
        # Update company risk score
        supabase.table('companies').update({
            'risk_score': new_score,
            'updated_at': datetime.now().isoformat()
        }).eq('id', company_id).execute()
        
        logger.info(f"Updated company {company_id} risk score from {current_score} to {new_score}")
        
    except Exception as e:
        logger.error(f"Failed to update company risk score: {e}")

# API endpoints
@app.post("/analyze/certificate", response_model=AnalysisResponse)
async def analyze_certificate(
    file: UploadFile = File(...),
    prequal_id: str = Form(...),
    file_id: Optional[str] = Form(None)
):
    """Analyze insurance certificate document"""
    try:
        # Read file content
        content = await file.read()
        
        # Analyze document
        analyzer = InsuranceCertificateAnalyzer()
        certificate_data = analyzer.analyze(content)
        
        # Assess risks
        risk_flags = assess_insurance_risk(certificate_data)
        
        # Insert into database
        insert_data = {
            'prequal_id': prequal_id,
            'policy_type': certificate_data.policy_type,
            'coverage_limit': certificate_data.coverage_limit,
            'effective_date': certificate_data.effective_date,
            'expiry_date': certificate_data.expiry_date,
            'carrier_name': certificate_data.carrier_name,
            'policy_number': certificate_data.policy_number
        }
        
        if certificate_data.deductible:
            insert_data['deductible'] = certificate_data.deductible
        
        result = supabase.table('insurance_certificate').insert(insert_data).execute()
        
        # Get company ID and update risk score if there are risks
        if risk_flags:
            prequal_response = supabase.table('prequal').select('company_id').eq('id', prequal_id).single().execute()
            if prequal_response.data:
                await update_company_risk_score(prequal_response.data['company_id'], risk_flags)
        
        return AnalysisResponse(
            success=True,
            message="Insurance certificate analyzed successfully",
            extracted_data=certificate_data.dict(),
            risk_flags=risk_flags
        )
        
    except Exception as e:
        logger.error(f"Certificate analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/w9", response_model=AnalysisResponse)
async def analyze_w9(
    file: UploadFile = File(...),
    prequal_id: str = Form(...),
    file_id: Optional[str] = Form(None)
):
    """Analyze W-9 tax form document"""
    try:
        content = await file.read()
        
        analyzer = W9Analyzer()
        w9_data = analyzer.analyze(content)
        
        # Basic validation risks
        risk_flags = []
        if w9_data.ein_or_ssn == "Unknown":
            risk_flags.append({
                'type': 'missing_tax_id',
                'severity': 'high',
                'message': 'Tax identification number not found'
            })
        
        # Store W-9 data (you might want to create a separate table for this)
        # For now, we'll just return the extracted data
        
        return AnalysisResponse(
            success=True,
            message="W-9 form analyzed successfully",
            extracted_data=w9_data.dict(),
            risk_flags=risk_flags
        )
        
    except Exception as e:
        logger.error(f"W-9 analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/financials", response_model=AnalysisResponse)
async def analyze_financials(
    file: UploadFile = File(...),
    prequal_id: str = Form(...),
    file_id: Optional[str] = Form(None)
):
    """Analyze financial statement document"""
    try:
        content = await file.read()
        
        analyzer = FinancialAnalyzer()
        financial_data = analyzer.analyze(content)
        
        # Assess financial risks
        risk_flags = assess_financial_risk(financial_data)
        
        # Get company ID from prequal
        prequal_response = supabase.table('prequal').select('company_id').eq('id', prequal_id).single().execute()
        if not prequal_response.data:
            raise HTTPException(status_code=404, detail="Prequalification not found")
        
        company_id = prequal_response.data['company_id']
        
        # Insert financial statement
        insert_data = {
            'company_id': company_id,
            'statement_date': financial_data.statement_date,
            'audited': financial_data.audited
        }
        
        # Add financial metrics if available
        if financial_data.revenue:
            insert_data['revenue'] = financial_data.revenue
        if financial_data.assets:
            insert_data['assets'] = financial_data.assets
        if financial_data.liabilities:
            insert_data['liabilities'] = financial_data.liabilities
        if financial_data.net_worth:
            insert_data['net_worth'] = financial_data.net_worth
        if financial_data.working_capital:
            insert_data['working_capital'] = financial_data.working_capital
        
        result = supabase.table('financial_statement').insert(insert_data).execute()
        
        # Update company risk score if there are risks
        if risk_flags:
            await update_company_risk_score(company_id, risk_flags)
        
        return AnalysisResponse(
            success=True,
            message="Financial statement analyzed successfully",
            extracted_data=financial_data.dict(),
            risk_flags=risk_flags
        )
        
    except Exception as e:
        logger.error(f"Financial analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "risk-analyzer"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
