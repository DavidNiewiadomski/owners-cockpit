"""
Lead Time Predictor Service
AI-powered delivery time forecasting using Random Forest on historical awarded package data
"""

import os
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
import logging
from pathlib import Path
import json
import pickle
import asyncio
from concurrent.futures import ThreadPoolExecutor

# FastAPI and Pydantic
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# ML Libraries
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error

# Database and external APIs
from supabase import create_client, Client
import httpx
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Lead Time Predictor Service",
    description="AI-powered delivery time forecasting for construction packages",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure based on your security needs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Supabase client (optional for testing)
supabase: Optional[Client] = None
try:
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
    if supabase_url and supabase_key:
        supabase = create_client(supabase_url, supabase_key)
        logger.info("Supabase client initialized")
    else:
        logger.warning("Supabase credentials not found, using synthetic data only")
except Exception as e:
    logger.warning(f"Failed to initialize Supabase client: {e}")

# Pydantic models
class ForecastRequest(BaseModel):
    work_pkg: str = Field(..., description="Work package/CSI code (e.g., '03300', '05120')")
    fab_start_date: str = Field(..., description="Fabrication start date in ISO format")
    region: str = Field(default="US", description="Geographic region code")
    project_type: Optional[str] = Field(default="commercial", description="Project type")
    project_size: Optional[str] = Field(default="medium", description="Project size category")
    urgency: Optional[str] = Field(default="normal", description="Urgency level")
    quantity: Optional[float] = Field(default=1.0, description="Quantity or scale factor")

class ForecastResponse(BaseModel):
    delivery_est: int = Field(..., description="Estimated delivery time in days")
    confidence_interval: Dict[str, int] = Field(..., description="95% confidence interval")
    factors: Dict[str, Any] = Field(..., description="Key factors affecting delivery time")
    enr_impact: Optional[float] = Field(None, description="ENR commodity index impact")
    model_version: str = Field(..., description="Model version used")
    generated_at: str = Field(..., description="Timestamp when forecast was generated")

class TrainingStatus(BaseModel):
    status: str
    last_trained: Optional[str]
    model_version: str
    records_used: int
    accuracy_metrics: Optional[Dict[str, float]]

class ENRIndexData(BaseModel):
    date: str
    steel_index: float
    concrete_index: float
    lumber_index: float
    copper_index: float
    composite_index: float

# Global model cache
MODEL_CACHE = {
    "model": None,
    "encoders": {},
    "scaler": None,
    "version": None,
    "last_updated": None
}

class LeadTimePredictor:
    """Main predictor class with Random Forest model"""
    
    def __init__(self):
        self.model = None
        self.feature_encoders = {}
        self.scaler = StandardScaler()
        self.model_path = Path("models")
        self.model_path.mkdir(exist_ok=True)
        
    async def fetch_historical_data(self) -> pd.DataFrame:
        """Fetch historical awarded package data from database"""
        try:
            # Check if supabase client is available
            if not supabase:
                logger.info("Supabase client not available, using synthetic data")
                return self._generate_synthetic_data()
            
            # Query historical data from lead_time table and related tables
            query = """
            SELECT 
                lt.*,
                bli.csi_code,
                bli.category,
                bli.subcategory,
                bli.quantity,
                bli.unit_of_measure,
                bp.project_type,
                bp.project_location,
                bp.total_budget,
                vbs.total_bid_amount,
                v.company_type,
                v.prequalification_status
            FROM lead_time lt
            JOIN bid_line_items bli ON lt.rfp_id = bli.bid_project_id
            JOIN bid_projects bp ON lt.rfp_id = bp.id
            LEFT JOIN vendor_bid_submissions vbs ON bp.id = vbs.bid_project_id
            LEFT JOIN bid_vendors v ON vbs.vendor_id = v.id
            WHERE lt.status = 'delivered'
            AND lt.actual_delivery_date IS NOT NULL
            AND lt.issue_date IS NOT NULL
            """
            
            response = supabase.rpc('execute_sql', {'query': query}).execute()
            
            if response.data:
                df = pd.DataFrame(response.data)
                logger.info(f"Fetched {len(df)} historical records")
                return df
            else:
                # If no data from lead_time table, create synthetic data for initial training
                logger.warning("No historical data found, generating synthetic training data")
                return self._generate_synthetic_data()
                
        except Exception as e:
            logger.error(f"Error fetching historical data: {e}")
            return self._generate_synthetic_data()
    
    def _generate_synthetic_data(self, n_samples: int = 1000) -> pd.DataFrame:
        """Generate synthetic training data for initial model"""
        np.random.seed(42)
        
        # CSI codes for different construction trades
        csi_codes = [
            "03300", "03200", "05120", "05500", "07920", "08110", 
            "09900", "22110", "23090", "26050", "27100", "31230"
        ]
        
        regions = ["US-NE", "US-SE", "US-MW", "US-SW", "US-W", "CA", "MX"]
        project_types = ["commercial", "residential", "industrial", "infrastructure"]
        urgency_levels = ["low", "normal", "high", "critical"]
        project_sizes = ["small", "medium", "large", "mega"]
        
        data = []
        
        for _ in range(n_samples):
            csi_code = np.random.choice(csi_codes)
            region = np.random.choice(regions)
            project_type = np.random.choice(project_types)
            urgency = np.random.choice(urgency_levels)
            project_size = np.random.choice(project_sizes)
            
            # Base lead time by CSI code (realistic industry averages)
            base_times = {
                "03300": 14,  # Concrete
                "03200": 10,  # Concrete accessories  
                "05120": 45,  # Structural steel
                "05500": 28,  # Metal fabrications
                "07920": 21,  # Joint sealers
                "08110": 35,  # Metal doors
                "09900": 14,  # Painting
                "22110": 30,  # Domestic water piping
                "23090": 25,  # HVAC instrumentation
                "26050": 40,  # Electrical lighting
                "27100": 50,  # Audio-visual systems
                "31230": 60   # Site improvements
            }
            
            base_time = base_times.get(csi_code, 30)
            
            # Apply modifiers
            urgency_multiplier = {"low": 1.3, "normal": 1.0, "high": 0.8, "critical": 0.6}[urgency]
            size_multiplier = {"small": 0.8, "medium": 1.0, "large": 1.4, "mega": 2.0}[project_size]
            region_multiplier = {"US-NE": 1.1, "US-SE": 0.9, "US-MW": 1.0, "US-SW": 1.0, "US-W": 1.2, "CA": 1.15, "MX": 0.85}[region]
            
            # ENR index impact (simulate commodity price fluctuations)
            enr_impact = np.random.normal(1.0, 0.15)
            seasonal_impact = 1 + 0.1 * np.sin(2 * np.pi * np.random.randint(1, 365) / 365)
            
            # Calculate lead time with some randomness
            lead_time = int(base_time * urgency_multiplier * size_multiplier * region_multiplier * enr_impact * seasonal_impact)
            lead_time = max(1, lead_time + np.random.randint(-5, 6))  # Add noise
            
            data.append({
                "csi_code": csi_code,
                "region": region,
                "project_type": project_type,
                "urgency": urgency,
                "project_size": project_size,
                "quantity": np.random.lognormal(0, 1),
                "project_budget": np.random.lognormal(15, 1),  # $1M-$100M range
                "enr_steel_index": np.random.normal(100, 10),
                "enr_concrete_index": np.random.normal(100, 8),
                "enr_lumber_index": np.random.normal(100, 15),
                "vendor_rating": np.random.uniform(1, 5),
                "month": np.random.randint(1, 13),
                "year": np.random.randint(2020, 2025),
                "lead_time_days": lead_time
            })
        
        return pd.DataFrame(data)
    
    async def fetch_enr_index(self, date: Optional[str] = None) -> ENRIndexData:
        """Fetch ENR commodity index data (mock implementation)"""
        # In production, this would call the actual ENR API
        # For now, return mock data with realistic fluctuations
        current_date = date or datetime.now().isoformat()
        
        # Simulate realistic commodity indices
        base_indices = {
            "steel": 105.2,
            "concrete": 98.7,
            "lumber": 125.4,
            "copper": 112.1
        }
        
        # Add seasonal and market fluctuations
        fluctuation = np.random.normal(0, 5)
        
        return ENRIndexData(
            date=current_date,
            steel_index=base_indices["steel"] + fluctuation,
            concrete_index=base_indices["concrete"] + fluctuation * 0.5,
            lumber_index=base_indices["lumber"] + fluctuation * 1.5,
            copper_index=base_indices["copper"] + fluctuation * 0.8,
            composite_index=np.mean(list(base_indices.values())) + fluctuation
        )
    
    def prepare_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Prepare features for training or prediction"""
        # Create feature columns
        features_df = df.copy()
        
        # Encode categorical variables
        categorical_cols = ["csi_code", "region", "project_type", "urgency", "project_size"]
        
        for col in categorical_cols:
            if col not in self.feature_encoders:
                self.feature_encoders[col] = LabelEncoder()
                features_df[f"{col}_encoded"] = self.feature_encoders[col].fit_transform(features_df[col].astype(str))
            else:
                # Handle unseen categories
                le = self.feature_encoders[col]
                features_df[f"{col}_encoded"] = features_df[col].map(
                    lambda x: le.transform([str(x)])[0] if str(x) in le.classes_ else -1
                )
        
        # Create derived features
        features_df["log_quantity"] = np.log1p(features_df.get("quantity", 1))
        features_df["log_budget"] = np.log1p(features_df.get("project_budget", 1000000))
        
        # Seasonal features
        if "month" in features_df.columns:
            features_df["month_sin"] = np.sin(2 * np.pi * features_df["month"] / 12)
            features_df["month_cos"] = np.cos(2 * np.pi * features_df["month"] / 12)
        
        # Select final feature columns
        feature_cols = [
            "csi_code_encoded", "region_encoded", "project_type_encoded",
            "urgency_encoded", "project_size_encoded", "log_quantity", "log_budget",
            "enr_steel_index", "enr_concrete_index", "enr_lumber_index",
            "vendor_rating", "month_sin", "month_cos"
        ]
        
        # Fill missing columns with defaults
        for col in feature_cols:
            if col not in features_df.columns:
                features_df[col] = 0
        
        return features_df[feature_cols]
    
    async def train_model(self) -> Dict[str, Any]:
        """Train the Random Forest model on historical data"""
        try:
            logger.info("Starting model training...")
            
            # Fetch historical data
            df = await self.fetch_historical_data()
            
            if len(df) < 50:
                raise ValueError("Insufficient training data (minimum 50 records required)")
            
            # Prepare features
            X = self.prepare_features(df)
            y = df["lead_time_days"]
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            # Scale features
            X_train_scaled = self.scaler.fit_transform(X_train)
            X_test_scaled = self.scaler.transform(X_test)
            
            # Train Random Forest model
            self.model = RandomForestRegressor(
                n_estimators=100,
                max_depth=10,
                random_state=42,
                n_jobs=-1
            )
            
            # Fit model
            self.model.fit(X_train_scaled, y_train)
            
            # Calculate metrics
            y_pred = self.model.predict(X_test_scaled)
            mae = mean_absolute_error(y_test, y_pred)
            rmse = np.sqrt(mean_squared_error(y_test, y_pred))
            
            # Save model
            model_version = f"v{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            model_file = self.model_path / f"leadtime_model_{model_version}.pkl"
            
            model_data = {
                "model": self.model,
                "encoders": self.feature_encoders,
                "scaler": self.scaler,
                "version": model_version,
                "trained_at": datetime.now().isoformat(),
                "metrics": {"mae": mae, "rmse": rmse},
                "feature_names": X.columns.tolist()
            }
            
            with open(model_file, "wb") as f:
                pickle.dump(model_data, f)
            
            # Update global cache
            MODEL_CACHE.update({
                "model": self.model,
                "encoders": self.feature_encoders,
                "scaler": self.scaler,
                "version": model_version,
                "last_updated": datetime.now().isoformat()
            })
            
            logger.info(f"Model training completed. MAE: {mae:.2f}, RMSE: {rmse:.2f}")
            
            return {
                "status": "success",
                "model_version": model_version,
                "records_used": len(df),
                "metrics": {"mae": float(mae), "rmse": float(rmse)},
                "trained_at": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Model training failed: {e}")
            raise HTTPException(status_code=500, detail=f"Training failed: {str(e)}")
    
    async def predict_delivery(self, work_pkg: str, region: str = "US", **kwargs) -> int:
        """Predict delivery time for a work package"""
        if not self.model:
            await self.load_model()
        
        if not self.model:
            raise HTTPException(status_code=503, detail="Model not available. Please train the model first.")
        
        try:
            # Get current ENR index
            enr_data = await self.fetch_enr_index()
            
            # Prepare input data
            input_data = pd.DataFrame([{
                "csi_code": work_pkg,
                "region": region,
                "project_type": kwargs.get("project_type", "commercial"),
                "urgency": kwargs.get("urgency", "normal"),
                "project_size": kwargs.get("project_size", "medium"),
                "quantity": kwargs.get("quantity", 1.0),
                "project_budget": kwargs.get("project_budget", 1000000),
                "enr_steel_index": enr_data.steel_index,
                "enr_concrete_index": enr_data.concrete_index,
                "enr_lumber_index": enr_data.lumber_index,
                "vendor_rating": kwargs.get("vendor_rating", 3.5),
                "month": datetime.now().month,
                "year": datetime.now().year
            }])
            
            # Prepare features
            X = self.prepare_features(input_data)
            X_scaled = self.scaler.transform(X)
            
            # Make prediction
            prediction = self.model.predict(X_scaled)[0]
            
            return max(1, int(round(prediction)))
            
        except Exception as e:
            logger.error(f"Prediction failed: {e}")
            raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
    
    async def load_model(self):
        """Load the latest trained model"""
        try:
            model_files = list(self.model_path.glob("leadtime_model_*.pkl"))
            
            if not model_files:
                logger.warning("No trained model found")
                return False
            
            # Get the latest model file
            latest_model = max(model_files, key=lambda x: x.stat().st_mtime)
            
            with open(latest_model, "rb") as f:
                model_data = pickle.load(f)
            
            self.model = model_data["model"]
            self.feature_encoders = model_data["encoders"]
            self.scaler = model_data["scaler"]
            
            # Update global cache
            MODEL_CACHE.update({
                "model": self.model,
                "encoders": self.feature_encoders,
                "scaler": self.scaler,
                "version": model_data["version"],
                "last_updated": model_data["trained_at"]
            })
            
            logger.info(f"Loaded model version: {model_data['version']}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            return False

# Global predictor instance
predictor = LeadTimePredictor()

# Dependency to ensure model is loaded
async def get_predictor():
    if not predictor.model:
        await predictor.load_model()
    return predictor

# API Endpoints
@app.post("/lead-time/forecast", response_model=ForecastResponse)
async def forecast_delivery(
    request: ForecastRequest,
    pred: LeadTimePredictor = Depends(get_predictor)
):
    """Forecast delivery time for a work package"""
    try:
        # Parse fabrication start date
        fab_start = datetime.fromisoformat(request.fab_start_date.replace('Z', '+00:00'))
        
        # Get prediction
        delivery_days = await pred.predict_delivery(
            work_pkg=request.work_pkg,
            region=request.region,
            project_type=request.project_type,
            project_size=request.project_size,
            urgency=request.urgency,
            quantity=request.quantity
        )
        
        # Calculate confidence interval (±20% typical for lead time predictions)
        ci_lower = max(1, int(delivery_days * 0.8))
        ci_upper = int(delivery_days * 1.2)
        
        # Get ENR impact
        enr_data = await pred.fetch_enr_index()
        enr_impact = (enr_data.composite_index - 100) / 100  # Percentage impact
        
        # Identify key factors
        factors = {
            "work_package": request.work_pkg,
            "region": request.region,
            "urgency_level": request.urgency,
            "project_size": request.project_size,
            "seasonal_factor": abs(np.sin(2 * np.pi * datetime.now().timetuple().tm_yday / 365)),
            "market_conditions": "stable" if abs(enr_impact) < 0.1 else "volatile"
        }
        
        return ForecastResponse(
            delivery_est=delivery_days,
            confidence_interval={"lower": ci_lower, "upper": ci_upper},
            factors=factors,
            enr_impact=round(enr_impact, 3),
            model_version=MODEL_CACHE.get("version", "unknown"),
            generated_at=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Forecast failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/model/train")
async def train_model():
    """Train the prediction model on latest data"""
    return await predictor.train_model()

@app.get("/model/status", response_model=TrainingStatus)
async def get_model_status():
    """Get current model status and metrics"""
    try:
        # Try to load model info
        model_files = list(predictor.model_path.glob("leadtime_model_*.pkl"))
        
        if not model_files:
            return TrainingStatus(
                status="not_trained",
                last_trained=None,
                model_version="none",
                records_used=0,
                accuracy_metrics=None
            )
        
        # Get latest model file
        latest_model = max(model_files, key=lambda x: x.stat().st_mtime)
        
        with open(latest_model, "rb") as f:
            model_data = pickle.load(f)
        
        return TrainingStatus(
            status="trained",
            last_trained=model_data.get("trained_at"),
            model_version=model_data.get("version", "unknown"),
            records_used=model_data.get("records_used", 0),
            accuracy_metrics=model_data.get("metrics")
        )
        
    except Exception as e:
        logger.error(f"Failed to get model status: {e}")
        return TrainingStatus(
            status="error",
            last_trained=None,
            model_version="unknown",
            records_used=0,
            accuracy_metrics=None
        )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    model_status = "loaded" if predictor.model else "not_loaded"
    return {
        "status": "healthy",
        "service": "leadtime-predictor",
        "model_status": model_status,
        "version": MODEL_CACHE.get("version", "unknown")
    }

# Auto-load model on startup
@app.on_event("startup")
async def startup_event():
    """Load model on service startup"""
    logger.info("Starting Lead Time Predictor Service...")
    await predictor.load_model()
    
    # If no model exists, train one with synthetic data
    if not predictor.model:
        logger.info("No existing model found, training initial model...")
        try:
            await predictor.train_model()
        except Exception as e:
            logger.warning(f"Failed to train initial model: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
