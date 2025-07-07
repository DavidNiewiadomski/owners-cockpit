import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'crypto';

const SUPABASE_URL = "https://aqdwxbxofiadcvaeexjp.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SERVICE_ROLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Realistic construction company and vendor data
const CONSTRUCTION_COMPANIES = [
  { name: "Turner Construction Company", tier: "tier1", reputation: "excellent" },
  { name: "Skanska USA Building", tier: "tier1", reputation: "excellent" },
  { name: "Suffolk Construction", tier: "tier1", reputation: "excellent" },
  { name: "McCarthy Building Companies", tier: "tier1", reputation: "excellent" },
  { name: "Clark Construction Group", tier: "tier1", reputation: "excellent" },
  { name: "Hensel Phelps Construction", tier: "tier2", reputation: "good" },
  { name: "DPR Construction", tier: "tier2", reputation: "good" },
  { name: "Mortenson Construction", tier: "tier2", reputation: "good" },
  { name: "Brasfield & Gorrie", tier: "tier2", reputation: "good" },
  { name: "JE Dunn Construction", tier: "tier2", reputation: "good" },
  { name: "Regional Construction Co", tier: "tier3", reputation: "fair" },
  { name: "Metro Builders LLC", tier: "tier3", reputation: "fair" },
  { name: "Citywide Construction", tier: "tier3", reputation: "fair" },
  { name: "Premier Build Group", tier: "tier3", reputation: "good" },
  { name: "Apex Construction Services", tier: "tier3", reputation: "fair" }
];

const PROJECT_TYPES = [
  "Mixed-Use Development",
  "Office Tower",
  "Healthcare Facility", 
  "Educational Complex",
  "Retail Center",
  "Residential High-Rise",
  "Industrial Warehouse",
  "Government Building",
  "Sports & Recreation Center",
  "Transportation Hub"
];

// Comprehensive CSI MasterFormat line items for construction
const CSI_LINE_ITEMS = [
  // Division 00 - Procurement and Contracting Requirements
  { csi: "00700", description: "General Conditions", basePrice: 850000, variability: 0.15, unit: "LS" },
  { csi: "00800", description: "Supplementary Conditions", basePrice: 125000, variability: 0.20, unit: "LS" },
  
  // Division 01 - General Requirements
  { csi: "01100", description: "Summary of Work", basePrice: 75000, variability: 0.10, unit: "LS" },
  { csi: "01200", description: "Price and Payment Procedures", basePrice: 45000, variability: 0.05, unit: "LS" },
  { csi: "01300", description: "Administrative Requirements", basePrice: 85000, variability: 0.12, unit: "LS" },
  { csi: "01400", description: "Quality Requirements", basePrice: 125000, variability: 0.15, unit: "LS" },
  { csi: "01500", description: "Temporary Facilities and Controls", basePrice: 450000, variability: 0.25, unit: "LS" },
  { csi: "01600", description: "Product Requirements", basePrice: 35000, variability: 0.08, unit: "LS" },
  { csi: "01700", description: "Execution Requirements", basePrice: 95000, variability: 0.18, unit: "LS" },
  { csi: "01800", description: "Facility Operation", basePrice: 65000, variability: 0.12, unit: "LS" },
  
  // Division 02 - Existing Conditions
  { csi: "02200", description: "Site Assessment", basePrice: 185000, variability: 0.30, unit: "LS" },
  { csi: "02300", description: "Earthwork", basePrice: 1250000, variability: 0.35, unit: "CY" },
  { csi: "02400", description: "Tunneling, Boring, and Jacking", basePrice: 2850000, variability: 0.40, unit: "LF" },
  { csi: "02500", description: "Utility Services", basePrice: 750000, variability: 0.25, unit: "LS" },
  { csi: "02600", description: "Drainage and Containment", basePrice: 485000, variability: 0.28, unit: "LF" },
  { csi: "02700", description: "Bases, Ballasts, and Paving", basePrice: 325000, variability: 0.20, unit: "SY" },
  { csi: "02800", description: "Site Improvements and Amenities", basePrice: 450000, variability: 0.22, unit: "LS" },
  { csi: "02900", description: "Planting", basePrice: 165000, variability: 0.18, unit: "SF" },
  
  // Division 03 - Concrete
  { csi: "03100", description: "Concrete Forms and Accessories", basePrice: 850000, variability: 0.20, unit: "SFCA" },
  { csi: "03200", description: "Concrete Reinforcement", basePrice: 1250000, variability: 0.18, unit: "LB" },
  { csi: "03300", description: "Cast-in-Place Concrete", basePrice: 2850000, variability: 0.22, unit: "CY" },
  { csi: "03400", description: "Precast Concrete", basePrice: 1850000, variability: 0.25, unit: "SF" },
  { csi: "03500", description: "Cementitious Decks and Underlayment", basePrice: 385000, variability: 0.15, unit: "SF" },
  { csi: "03600", description: "Grouts", basePrice: 125000, variability: 0.20, unit: "CF" },
  { csi: "03700", description: "Mass Concrete", basePrice: 950000, variability: 0.30, unit: "CY" },
  { csi: "03800", description: "Concrete Cutting and Boring", basePrice: 185000, variability: 0.25, unit: "LF" },
  
  // Division 04 - Masonry
  { csi: "04200", description: "Unit Masonry", basePrice: 1450000, variability: 0.20, unit: "SF" },
  { csi: "04400", description: "Stone", basePrice: 750000, variability: 0.28, unit: "SF" },
  { csi: "04500", description: "Refractories", basePrice: 285000, variability: 0.22, unit: "SF" },
  { csi: "04600", description: "Corrosion-Resistant Masonry", basePrice: 385000, variability: 0.25, unit: "SF" },
  { csi: "04700", description: "Simulated Masonry", basePrice: 225000, variability: 0.18, unit: "SF" },
  
  // Division 05 - Metals
  { csi: "05100", description: "Structural Metal Framing", basePrice: 3250000, variability: 0.22, unit: "LB" },
  { csi: "05200", description: "Metal Joists", basePrice: 850000, variability: 0.18, unit: "LB" },
  { csi: "05300", description: "Metal Deck", basePrice: 485000, variability: 0.15, unit: "SF" },
  { csi: "05400", description: "Cold-Formed Metal Framing", basePrice: 650000, variability: 0.20, unit: "LB" },
  { csi: "05500", description: "Metal Fabrications", basePrice: 950000, variability: 0.25, unit: "LB" },
  { csi: "05600", description: "Hydraulic Fabrications", basePrice: 385000, variability: 0.30, unit: "LS" },
  { csi: "05700", description: "Ornamental Metal", basePrice: 285000, variability: 0.22, unit: "LB" },
  { csi: "05800", description: "Expansion Control", basePrice: 185000, variability: 0.28, unit: "LF" },
  
  // Division 06 - Wood, Plastics, and Composites
  { csi: "06100", description: "Rough Carpentry", basePrice: 1250000, variability: 0.20, unit: "BF" },
  { csi: "06200", description: "Finish Carpentry", basePrice: 750000, variability: 0.25, unit: "LF" },
  { csi: "06400", description: "Architectural Woodwork", basePrice: 485000, variability: 0.22, unit: "SF" },
  { csi: "06500", description: "Structural Plastics", basePrice: 285000, variability: 0.28, unit: "LB" },
  { csi: "06600", description: "Plastic Fabrications", basePrice: 185000, variability: 0.20, unit: "SF" },
  { csi: "06800", description: "Composite Fabrications", basePrice: 385000, variability: 0.25, unit: "SF" },
  
  // Division 07 - Thermal and Moisture Protection
  { csi: "07100", description: "Dampproofing and Waterproofing", basePrice: 650000, variability: 0.25, unit: "SF" },
  { csi: "07200", description: "Thermal Protection", basePrice: 950000, variability: 0.20, unit: "SF" },
  { csi: "07300", description: "Shingles and Roofing Tiles", basePrice: 385000, variability: 0.22, unit: "SF" },
  { csi: "07400", description: "Roofing and Siding Panels", basePrice: 750000, variability: 0.18, unit: "SF" },
  { csi: "07500", description: "Membrane Roofing", basePrice: 485000, variability: 0.25, unit: "SF" },
  { csi: "07600", description: "Flashing and Sheet Metal", basePrice: 285000, variability: 0.28, unit: "LF" },
  { csi: "07700", description: "Roof Specialties and Accessories", basePrice: 185000, variability: 0.20, unit: "EA" },
  { csi: "07800", description: "Fire and Smoke Protection", basePrice: 350000, variability: 0.22, unit: "SF" },
  { csi: "07900", description: "Joint Sealers", basePrice: 125000, variability: 0.25, unit: "LF" },
  
  // Division 08 - Openings
  { csi: "08100", description: "Metal Doors and Frames", basePrice: 750000, variability: 0.20, unit: "EA" },
  { csi: "08200", description: "Wood and Plastic Doors", basePrice: 485000, variability: 0.22, unit: "EA" },
  { csi: "08300", description: "Specialty Doors", basePrice: 385000, variability: 0.28, unit: "EA" },
  { csi: "08400", description: "Entrances, Storefronts, and Curtain Walls", basePrice: 1850000, variability: 0.25, unit: "SF" },
  { csi: "08500", description: "Windows", basePrice: 950000, variability: 0.22, unit: "SF" },
  { csi: "08600", description: "Skylights", basePrice: 285000, variability: 0.30, unit: "SF" },
  { csi: "08700", description: "Hardware", basePrice: 185000, variability: 0.18, unit: "EA" },
  { csi: "08800", description: "Glazing", basePrice: 650000, variability: 0.20, unit: "SF" },
  { csi: "08900", description: "Glazed Curtain Wall", basePrice: 1250000, variability: 0.25, unit: "SF" },
  
  // Division 09 - Finishes
  { csi: "09200", description: "Plaster and Gypsum Board", basePrice: 1450000, variability: 0.18, unit: "SF" },
  { csi: "09300", description: "Tiling", basePrice: 850000, variability: 0.22, unit: "SF" },
  { csi: "09400", description: "Terrazzo", basePrice: 485000, variability: 0.25, unit: "SF" },
  { csi: "09500", description: "Ceilings", basePrice: 750000, variability: 0.20, unit: "SF" },
  { csi: "09600", description: "Flooring", basePrice: 1250000, variability: 0.22, unit: "SF" },
  { csi: "09700", description: "Wall Finishes", basePrice: 650000, variability: 0.20, unit: "SF" },
  { csi: "09800", description: "Acoustic Treatment", basePrice: 285000, variability: 0.25, unit: "SF" },
  { csi: "09900", description: "Paints and Coatings", basePrice: 450000, variability: 0.18, unit: "SF" },
  
  // Division 10 - Specialties
  { csi: "10100", description: "Visual Display Boards", basePrice: 125000, variability: 0.20, unit: "SF" },
  { csi: "10200", description: "Louvers and Vents", basePrice: 185000, variability: 0.22, unit: "SF" },
  { csi: "10400", description: "Identification Devices", basePrice: 85000, variability: 0.25, unit: "EA" },
  { csi: "10500", description: "Lockers", basePrice: 150000, variability: 0.18, unit: "EA" },
  { csi: "10600", description: "Partitions", basePrice: 485000, variability: 0.22, unit: "SF" },
  { csi: "10700", description: "Exterior Protection", basePrice: 285000, variability: 0.25, unit: "SF" },
  { csi: "10800", description: "Toilet, Bath, and Laundry Accessories", basePrice: 125000, variability: 0.20, unit: "EA" },
  
  // Division 11 - Equipment
  { csi: "11100", description: "Vehicle and Pedestrian Equipment", basePrice: 385000, variability: 0.30, unit: "EA" },
  { csi: "11200", description: "Commercial Equipment", basePrice: 650000, variability: 0.25, unit: "LS" },
  { csi: "11400", description: "Food Service Equipment", basePrice: 485000, variability: 0.28, unit: "LS" },
  { csi: "11500", description: "Medical Equipment", basePrice: 750000, variability: 0.35, unit: "LS" },
  { csi: "11600", description: "Laboratory Equipment", basePrice: 950000, variability: 0.30, unit: "LS" },
  { csi: "11700", description: "Communications Equipment", basePrice: 285000, variability: 0.25, unit: "LS" },
  
  // Division 12 - Furnishings
  { csi: "12100", description: "Art", basePrice: 185000, variability: 0.40, unit: "LS" },
  { csi: "12300", description: "Manufactured Casework", basePrice: 650000, variability: 0.22, unit: "LF" },
  { csi: "12400", description: "Furnishings and Accessories", basePrice: 485000, variability: 0.25, unit: "LS" },
  { csi: "12500", description: "Furniture", basePrice: 750000, variability: 0.20, unit: "LS" },
  { csi: "12600", description: "Multiple Seating", basePrice: 285000, variability: 0.22, unit: "EA" },
  { csi: "12700", description: "Systems Furniture", basePrice: 850000, variability: 0.25, unit: "SF" },
  { csi: "12800", description: "Interior Plants and Planters", basePrice: 125000, variability: 0.30, unit: "LS" },
  
  // Division 13 - Special Construction
  { csi: "13100", description: "Pre-Engineered Structures", basePrice: 1850000, variability: 0.25, unit: "SF" },
  { csi: "13200", description: "Storage Tanks", basePrice: 650000, variability: 0.30, unit: "EA" },
  { csi: "13300", description: "Utility Control Systems", basePrice: 485000, variability: 0.28, unit: "LS" },
  { csi: "13400", description: "Industrial and Process Control Systems", basePrice: 950000, variability: 0.35, unit: "LS" },
  { csi: "13500", description: "Recording Instrumentation", basePrice: 285000, variability: 0.25, unit: "LS" },
  { csi: "13600", description: "Solar and Wind Energy Equipment", basePrice: 1250000, variability: 0.30, unit: "KW" },
  { csi: "13700", description: "Security Access and Surveillance", basePrice: 385000, variability: 0.25, unit: "LS" },
  { csi: "13800", description: "Building Automation and Control", basePrice: 750000, variability: 0.28, unit: "LS" },
  
  // Division 14 - Conveying Equipment
  { csi: "14100", description: "Dumbwaiters", basePrice: 185000, variability: 0.25, unit: "EA" },
  { csi: "14200", description: "Elevators", basePrice: 1250000, variability: 0.20, unit: "EA" },
  { csi: "14300", description: "Escalators and Moving Walks", basePrice: 850000, variability: 0.25, unit: "EA" },
  { csi: "14400", description: "Lifts", basePrice: 385000, variability: 0.22, unit: "EA" },
  { csi: "14500", description: "Material Handling", basePrice: 650000, variability: 0.28, unit: "LS" },
  { csi: "14600", description: "Hoists and Cranes", basePrice: 485000, variability: 0.30, unit: "EA" },
  
  // Division 21 - Fire Suppression
  { csi: "21100", description: "Water-Based Fire-Suppression Systems", basePrice: 1450000, variability: 0.22, unit: "SF" },
  { csi: "21200", description: "Fire-Suppression Standpipes", basePrice: 285000, variability: 0.20, unit: "LF" },
  { csi: "21300", description: "Fire Pumps", basePrice: 185000, variability: 0.25, unit: "EA" },
  { csi: "21400", description: "Fire-Suppression Water Storage", basePrice: 385000, variability: 0.28, unit: "GAL" },
  
  // Division 22 - Plumbing
  { csi: "22100", description: "Plumbing Piping and Pumps", basePrice: 1850000, variability: 0.25, unit: "LF" },
  { csi: "22200", description: "Plumbing Equipment", basePrice: 650000, variability: 0.22, unit: "EA" },
  { csi: "22300", description: "Water Supply and Treatment", basePrice: 485000, variability: 0.28, unit: "LS" },
  { csi: "22400", description: "Plumbing Fixtures", basePrice: 750000, variability: 0.20, unit: "EA" },
  { csi: "22500", description: "Pool and Fountain Equipment", basePrice: 385000, variability: 0.35, unit: "LS" },
  
  // Division 23 - Heating, Ventilating, and Air Conditioning (HVAC)
  { csi: "23100", description: "HVAC Ducts and Casings", basePrice: 1650000, variability: 0.22, unit: "LB" },
  { csi: "23200", description: "HVAC Piping and Pumps", basePrice: 1250000, variability: 0.25, unit: "LF" },
  { csi: "23300", description: "HVAC Air Distribution", basePrice: 850000, variability: 0.20, unit: "CFM" },
  { csi: "23400", description: "HVAC Fans", basePrice: 385000, variability: 0.22, unit: "EA" },
  { csi: "23500", description: "HVAC Air Cleaning Devices", basePrice: 285000, variability: 0.25, unit: "EA" },
  { csi: "23600", description: "HVAC Refrigerant Equipment", basePrice: 950000, variability: 0.28, unit: "TON" },
  { csi: "23700", description: "HVAC Terminal Units", basePrice: 485000, variability: 0.20, unit: "EA" },
  { csi: "23800", description: "HVAC Controls and Instrumentation", basePrice: 650000, variability: 0.25, unit: "LS" },
  
  // Division 25 - Integrated Automation
  { csi: "25100", description: "Integrated Automation Network Equipment", basePrice: 485000, variability: 0.30, unit: "LS" },
  { csi: "25200", description: "Integrated Automation Control and Monitoring", basePrice: 650000, variability: 0.28, unit: "LS" },
  { csi: "25300", description: "Integrated Automation Instrumentation", basePrice: 385000, variability: 0.25, unit: "LS" },
  
  // Division 26 - Electrical
  { csi: "26100", description: "Operation and Maintenance of Electrical Systems", basePrice: 185000, variability: 0.15, unit: "LS" },
  { csi: "26200", description: "Medium-Voltage Electrical Distribution", basePrice: 850000, variability: 0.25, unit: "LF" },
  { csi: "26300", description: "High-Voltage Electrical Transmission", basePrice: 1250000, variability: 0.30, unit: "LF" },
  { csi: "26400", description: "Low-Voltage Distribution", basePrice: 1850000, variability: 0.22, unit: "LF" },
  { csi: "26500", description: "Lighting", basePrice: 950000, variability: 0.20, unit: "SF" },
  { csi: "26600", description: "Special Systems", basePrice: 485000, variability: 0.28, unit: "LS" },
  
  // Division 27 - Communications
  { csi: "27100", description: "Structured Cabling", basePrice: 650000, variability: 0.20, unit: "LF" },
  { csi: "27200", description: "Data Communications", basePrice: 485000, variability: 0.25, unit: "LS" },
  { csi: "27300", description: "Voice Communications", basePrice: 285000, variability: 0.22, unit: "LS" },
  { csi: "27400", description: "Audio-Video Systems", basePrice: 750000, variability: 0.28, unit: "LS" },
  { csi: "27500", description: "Distributed Communications and Monitoring Systems", basePrice: 385000, variability: 0.30, unit: "LS" },
  
  // Division 28 - Electronic Safety and Security
  { csi: "28100", description: "Access Control", basePrice: 285000, variability: 0.25, unit: "LS" },
  { csi: "28200", description: "Video Surveillance", basePrice: 385000, variability: 0.28, unit: "LS" },
  { csi: "28300", description: "Intrusion Detection", basePrice: 185000, variability: 0.22, unit: "LS" },
  { csi: "28400", description: "Electronic Monitoring and Control", basePrice: 485000, variability: 0.30, unit: "LS" },
  { csi: "28500", description: "Fire Detection and Alarm", basePrice: 650000, variability: 0.20, unit: "SF" },
  
  // Division 31 - Earthwork
  { csi: "31100", description: "Site Clearing", basePrice: 285000, variability: 0.35, unit: "AC" },
  { csi: "31200", description: "Earth Moving", basePrice: 1850000, variability: 0.30, unit: "CY" },
  { csi: "31300", description: "Earthwork Methods", basePrice: 750000, variability: 0.28, unit: "LS" },
  { csi: "31400", description: "Shoring and Underpinning", basePrice: 1250000, variability: 0.35, unit: "SF" },
  { csi: "31500", description: "Excavation Support and Protection", basePrice: 485000, variability: 0.30, unit: "LF" },
  { csi: "31600", description: "Foundation and Load-Bearing Elements", basePrice: 1650000, variability: 0.25, unit: "CY" },
  
  // Division 32 - Exterior Improvements
  { csi: "32100", description: "Bases, Ballasts, and Paving", basePrice: 950000, variability: 0.22, unit: "SY" },
  { csi: "32200", description: "Retaining Walls", basePrice: 485000, variability: 0.28, unit: "SF" },
  { csi: "32300", description: "Site Improvements", basePrice: 650000, variability: 0.25, unit: "LS" },
  { csi: "32400", description: "Irrigation", basePrice: 285000, variability: 0.30, unit: "SF" },
  { csi: "32500", description: "Ponds and Reservoirs", basePrice: 750000, variability: 0.35, unit: "CF" },
  { csi: "32600", description: "Canals and Channels", basePrice: 1250000, variability: 0.40, unit: "LF" },
  { csi: "32700", description: "Wetlands", basePrice: 385000, variability: 0.35, unit: "AC" },
  { csi: "32800", description: "Exterior Furnishings", basePrice: 185000, variability: 0.25, unit: "LS" },
  { csi: "32900", description: "Planting", basePrice: 450000, variability: 0.22, unit: "SF" },
  
  // Division 33 - Utilities
  { csi: "33100", description: "Water Utilities", basePrice: 1450000, variability: 0.28, unit: "LF" },
  { csi: "33200", description: "Sanitary Sewerage Utilities", basePrice: 1250000, variability: 0.30, unit: "LF" },
  { csi: "33300", description: "Storm Drainage Utilities", basePrice: 850000, variability: 0.25, unit: "LF" },
  { csi: "33400", description: "Subdrainage", basePrice: 485000, variability: 0.28, unit: "LF" },
  { csi: "33500", description: "Gas Utilities", basePrice: 650000, variability: 0.22, unit: "LF" },
  { csi: "33600", description: "Fuel Distribution Utilities", basePrice: 385000, variability: 0.30, unit: "LF" },
  { csi: "33700", description: "Electrical Utilities", basePrice: 950000, variability: 0.25, unit: "LF" },
  { csi: "33800", description: "Communications Utilities", basePrice: 485000, variability: 0.22, unit: "LF" },
  
  // Allowances and Contingencies
  { csi: "A1000", description: "General Conditions Allowance", basePrice: 450000, variability: 0.10, unit: "LS", isAllowance: true },
  { csi: "A2000", description: "Site Work Allowance", basePrice: 285000, variability: 0.15, unit: "LS", isAllowance: true },
  { csi: "A3000", description: "Structural Allowance", basePrice: 385000, variability: 0.12, unit: "LS", isAllowance: true },
  { csi: "A4000", description: "MEP Systems Allowance", basePrice: 650000, variability: 0.18, unit: "LS", isAllowance: true },
  { csi: "A5000", description: "Finishes Allowance", basePrice: 325000, variability: 0.20, unit: "LS", isAllowance: true },
  { csi: "A6000", description: "Technology Allowance", basePrice: 185000, variability: 0.25, unit: "LS", isAllowance: true },
  { csi: "A7000", description: "Owner Contingency", basePrice: 750000, variability: 0.05, unit: "LS", isAllowance: true },
  { csi: "A8000", description: "Design Contingency", basePrice: 485000, variability: 0.08, unit: "LS", isAllowance: true }
];

// Generate realistic RFP projects
const generateRfpProjects = () => {
  const projects = [];
  const currentDate = new Date();
  
  for (let i = 0; i < 8; i++) {
    const projectType = PROJECT_TYPES[Math.floor(Math.random() * PROJECT_TYPES.length)];
    const projectSize = ['Small', 'Medium', 'Large'][Math.floor(Math.random() * 3)];
    const location = ['Downtown', 'Midtown', 'Uptown', 'Suburban', 'Waterfront'][Math.floor(Math.random() * 5)];
    
    // Generate dates
    const publishedDate = new Date(currentDate.getTime() - Math.random() * 60 * 24 * 60 * 60 * 1000); // Last 60 days
    const submissionDeadline = new Date(publishedDate.getTime() + 21 * 24 * 60 * 60 * 1000); // 3 weeks after published
    const evaluationStart = new Date(submissionDeadline.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days after deadline
    
    const status = currentDate > submissionDeadline ? 'evaluation' : 'open';
    
    projects.push({
      id: `rfp-${String(i + 1).padStart(3, '0')}-2024`,
      title: `${projectSize} ${location} ${projectType}`,
      description: `Construction of a state-of-the-art ${projectType.toLowerCase()} in the ${location.toLowerCase()} area. This ${projectSize.toLowerCase()}-scale project will feature sustainable design elements and modern construction techniques.`,
      rfp_number: `RFP-${currentDate.getFullYear()}-${String(i + 1).padStart(4, '0')}`,
      bid_type: 'lump_sum',
      estimated_value: Math.round((15000000 + Math.random() * 85000000) / 1000000) * 1000000, // $15M - $100M
      currency: 'USD',
      status,
      published_at: publishedDate.toISOString(),
      submission_deadline: submissionDeadline.toISOString(),
      evaluation_start: status === 'evaluation' ? evaluationStart.toISOString() : null,
      bond_required: Math.random() > 0.3,
      bond_percentage: Math.random() > 0.3 ? 10 : null,
      insurance_required: true,
      prequalification_required: Math.random() > 0.4,
      technical_weight: 30,
      commercial_weight: 70,
      created_by: 'owner-user-001',
      created_at: publishedDate.toISOString(),
      updated_at: new Date().toISOString()
    });
  }
  
  return projects;
};

// Generate vendor submissions for each RFP
const generateVendorSubmissions = (rfps: any[]) => {
  const submissions = [];
  
  rfps.forEach(rfp => {
    // Random number of submissions (3-8 vendors)
    const numSubmissions = 3 + Math.floor(Math.random() * 6);
    const selectedVendors = CONSTRUCTION_COMPANIES
      .sort(() => Math.random() - 0.5)
      .slice(0, numSubmissions);
    
    selectedVendors.forEach((vendor, index) => {
      const submissionDate = new Date(
        new Date(rfp.submission_deadline).getTime() - Math.random() * 14 * 24 * 60 * 60 * 1000
      );
      
      // Calculate base price with tier-based variation
      let priceMultiplier = 1.0;
      if (vendor.tier === 'tier1') {
        priceMultiplier = 1.05 + Math.random() * 0.1; // 5-15% premium for tier 1
      } else if (vendor.tier === 'tier2') {
        priceMultiplier = 0.95 + Math.random() * 0.15; // ±5-10% for tier 2
      } else {
        priceMultiplier = 0.8 + Math.random() * 0.25; // 20% discount to 5% premium for tier 3
      }
      
      const basePrice = Math.round(rfp.estimated_value * priceMultiplier);
      const contingency = Math.round(basePrice * (0.03 + Math.random() * 0.07)); // 3-10% contingency
      
      submissions.push({
        id: `sub-${rfp.id}-${String(index + 1).padStart(2, '0')}`,
        bid_id: rfp.id,
        vendor_id: `vendor-${vendor.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`,
        vendor_name: vendor.name,
        vendor_contact_email: `estimating@${vendor.name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}.com`,
        vendor_contact_phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        status: 'submitted',
        submitted_at: submissionDate.toISOString(),
        base_price: basePrice,
        contingency_amount: contingency,
        total_price: basePrice + contingency,
        price_sealed: true,
        bond_submitted: rfp.bond_required,
        insurance_submitted: rfp.insurance_required,
        prequalification_passed: rfp.prequalification_required ? Math.random() > 0.2 : null,
        created_at: submissionDate.toISOString(),
        updated_at: submissionDate.toISOString()
      });
    });
  });
  
  return submissions;
};

// Generate detailed bid line items for each submission
const generateBidLineItems = (submissions: any[]) => {
  const bidLineItems = [];
  
  submissions.forEach(submission => {
    // Select a subset of line items for this bid (60-90% of all items)
    const numItems = Math.floor(CSI_LINE_ITEMS.length * (0.6 + Math.random() * 0.3));
    const selectedItems = CSI_LINE_ITEMS
      .sort(() => Math.random() - 0.5)
      .slice(0, numItems);
    
    selectedItems.forEach((item, index) => {
      // Apply vendor-specific pricing strategy
      let priceVariation = 1.0;
      
      // Tier-based pricing strategy
      if (submission.vendor_name.includes('Turner') || submission.vendor_name.includes('Skanska')) {
        // Tier 1 companies: more conservative, consistent pricing
        priceVariation = 0.95 + Math.random() * 0.1;
      } else if (submission.vendor_name.includes('Regional') || submission.vendor_name.includes('Metro')) {
        // Tier 3 companies: more aggressive pricing with higher variance
        priceVariation = 0.7 + Math.random() * 0.4;
      } else {
        // Tier 2 companies: moderate pricing
        priceVariation = 0.85 + Math.random() * 0.3;
      }
      
      // Add some randomness for market conditions
      priceVariation *= (1 + (Math.random() - 0.5) * item.variability);
      
      // Occasionally create obvious outliers (5% chance)
      if (Math.random() < 0.05) {
        priceVariation *= Math.random() < 0.5 ? 0.5 : 2.0; // 50% lower or 100% higher
      }
      
      const quantity = Math.round(100 + Math.random() * 900); // 100-1000 units
      const unitPrice = Math.round(item.basePrice * priceVariation / quantity * 100) / 100;
      const extended = Math.round(unitPrice * quantity);
      
      bidLineItems.push({
        id: `bli-${submission.id}-${String(index + 1).padStart(3, '0')}`,
        submission_id: submission.id,
        vendor_name: submission.vendor_name,
        csi_code: item.csi,
        description: item.description,
        qty: quantity,
        uom: item.unit,
        unit_price: unitPrice,
        extended: extended,
        is_allowance: item.isAllowance || false,
        confidence_score: 0.85 + Math.random() * 0.15, // 85-100% confidence
        extracted_at: submission.created_at,
        created_at: submission.created_at,
        updated_at: submission.created_at
      });
    });
  });
  
  return bidLineItems;
};

// Generate leveling snapshots with sophisticated analysis
const generateLevelingSnapshots = (rfps: any[], submissions: any[], bidLineItems: any[]) => {
  const snapshots = [];
  
  rfps.forEach(rfp => {
    if (rfp.status === 'evaluation') {
      const rfpSubmissions = submissions.filter(s => s.bid_id === rfp.id);
      const rfpLineItems = bidLineItems.filter(bli => 
        rfpSubmissions.some(s => s.id === bli.submission_id)
      );
      
      // Group line items by CSI code + description
      const groupedItems = new Map();
      rfpLineItems.forEach(item => {
        const key = `${item.csi_code}-${item.description}`;
        if (!groupedItems.has(key)) {
          groupedItems.set(key, []);
        }
        groupedItems.get(key).push(item);
      });
      
      // Analyze each group for outliers
      const matrixData = [];
      let totalOutliers = 0;
      const outliersByGroup = {};
      const severityLevels = { mild: 0, moderate: 0, severe: 0 };
      
      groupedItems.forEach((items, groupKey) => {
        const [csiCode, description] = groupKey.split('-', 2);
        const extendedPrices = items.map(item => item.extended).filter(price => price > 0);
        
        if (extendedPrices.length < 2) return; // Skip if insufficient data
        
        // Calculate statistics
        const sorted = extendedPrices.sort((a, b) => a - b);
        const mean = sorted.reduce((sum, val) => sum + val, 0) / sorted.length;
        const median = sorted[Math.floor(sorted.length / 2)];
        const q1 = sorted[Math.floor(sorted.length * 0.25)];
        const q3 = sorted[Math.floor(sorted.length * 0.75)];
        const iqr = q3 - q1;
        const std = Math.sqrt(sorted.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / sorted.length);
        
        // Detect outliers using IQR method
        const lowerBound = q1 - 1.5 * iqr;
        const upperBound = q3 + 1.5 * iqr;
        const severeLowerBound = q1 - 3.0 * iqr;
        const severeUpperBound = q3 + 3.0 * iqr;
        
        const vendors = items.map(item => {
          let isOutlier = false;
          let outlierType = null;
          let outlierSeverity = null;
          
          if (item.extended < lowerBound || item.extended > upperBound) {
            isOutlier = true;
            outlierType = item.extended < lowerBound ? 'low' : 'high';
            
            if (item.extended < severeLowerBound || item.extended > severeUpperBound) {
              outlierSeverity = 'severe';
            } else {
              const zScore = Math.abs((item.extended - mean) / std);
              if (zScore > 2.5) {
                outlierSeverity = 'moderate';
              } else {
                outlierSeverity = 'mild';
              }
            }
            
            totalOutliers++;
            severityLevels[outlierSeverity]++;
          }
          
          const deviationFromMedian = ((item.extended - median) / median) * 100;
          const percentileRank = (sorted.filter(price => price <= item.extended).length / sorted.length) * 100;
          
          return {
            submissionId: item.submission_id,
            vendorName: item.vendor_name,
            quantity: item.qty,
            unitOfMeasure: item.uom,
            unitPrice: item.unit_price,
            extended: item.extended,
            isAllowance: item.is_allowance,
            isOutlier,
            outlierType,
            outlierSeverity,
            deviationFromMedian,
            percentileRank
          };
        });
        
        const outlierCount = vendors.filter(v => v.isOutlier).length;
        if (outlierCount > 0) {
          outliersByGroup[groupKey] = outlierCount;
        }
        
        matrixData.push({
          groupKey,
          description,
          csiCode,
          itemCount: items.length,
          statistics: {
            mean: Math.round(mean),
            median: Math.round(median),
            min: Math.min(...extendedPrices),
            max: Math.max(...extendedPrices),
            std: Math.round(std),
            q1: Math.round(q1),
            q3: Math.round(q3),
            iqr: Math.round(iqr)
          },
          vendors,
          hasOutliers: outlierCount > 0,
          outlierCount
        });
      });
      
      // Calculate vendor base bids
      const vendorTotals = {};
      rfpSubmissions.forEach(submission => {
        vendorTotals[submission.id] = {
          vendorName: submission.vendor_name,
          baseTotal: 0,
          allowanceTotal: 0,
          adjustedTotal: 0
        };
      });
      
      rfpLineItems.forEach(item => {
        if (vendorTotals[item.submission_id]) {
          if (item.is_allowance) {
            vendorTotals[item.submission_id].allowanceTotal += item.extended;
          } else {
            vendorTotals[item.submission_id].baseTotal += item.extended;
          }
        }
      });
      
      Object.values(vendorTotals).forEach((vendor: any) => {
        vendor.adjustedTotal = vendor.baseTotal - vendor.allowanceTotal;
      });
      
      const baseBids = Object.values(vendorTotals).map((v: any) => v.adjustedTotal);
      const baseBidsSorted = baseBids.sort((a, b) => a - b);
      const baseBidMean = baseBids.reduce((sum, val) => sum + val, 0) / baseBids.length;
      const baseBidStd = Math.sqrt(baseBids.reduce((sum, val) => sum + Math.pow(val - baseBidMean, 2), 0) / baseBids.length);
      
      const analysisDate = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000); // Last 7 days
      
      snapshots.push({
        id: `snapshot-${rfp.id}-${Date.now()}`,
        rfp_id: rfp.id,
        analysis_date: analysisDate.toISOString(),
        total_submissions: rfpSubmissions.length,
        total_line_items: matrixData.length,
        matrix_data: matrixData,
        summary_stats: {
          totalLineItems: matrixData.length,
          totalOutlierGroups: Object.keys(outliersByGroup).length,
          totalOutliers,
          outlierPercentage: (totalOutliers / (matrixData.length * rfpSubmissions.length)) * 100,
          vendorCount: rfpSubmissions.length,
          baseBidStatistics: {
            mean: Math.round(baseBidMean),
            median: Math.round(baseBidsSorted[Math.floor(baseBidsSorted.length / 2)]),
            min: Math.min(...baseBids),
            max: Math.max(...baseBids),
            std: Math.round(baseBidStd)
          },
          averageItemsPerGroup: rfpSubmissions.length
        },
        outlier_summary: {
          totalOutliers,
          outliersByGroup,
          severityLevels
        },
        processing_time_ms: 1500 + Math.random() * 2000,
        created_at: analysisDate.toISOString(),
        updated_at: analysisDate.toISOString()
      });
    }
  });
  
  return snapshots;
};

async function seedBidLevelingData() {
  console.log('🚀 Starting comprehensive bid leveling data seeding...');
  
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ SERVICE_ROLE_KEY environment variable is required');
    return;
  }
  
  try {
    console.log('🧹 Cleaning existing data...');
    
    // Clean existing data in dependency order
    await supabase.from('leveling_snapshots').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('bid_line_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('submissions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('bids').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    console.log('📋 Generating RFP projects...');
    const rfps = generateRfpProjects();
    
    console.log('🏢 Generating vendor submissions...');
    const submissions = generateVendorSubmissions(rfps);
    
    console.log('📊 Generating bid line items...');
    const bidLineItems = generateBidLineItems(submissions);
    
    console.log('🔍 Generating leveling snapshots...');
    const levelingSnapshots = generateLevelingSnapshots(rfps, submissions, bidLineItems);
    
    // Insert data in dependency order
    console.log('💾 Inserting RFPs...');
    const { error: rfpError } = await supabase.from('bids').insert(rfps);
    if (rfpError) {
      console.error('❌ Error inserting RFPs:', rfpError);
      return;
    }
    
    console.log('💾 Inserting submissions...');
    const { error: submissionError } = await supabase.from('submissions').insert(submissions);
    if (submissionError) {
      console.error('❌ Error inserting submissions:', submissionError);
      return;
    }
    
    console.log('💾 Inserting bid line items...');
    const { error: lineItemError } = await supabase.from('bid_line_items').insert(bidLineItems);
    if (lineItemError) {
      console.error('❌ Error inserting bid line items:', lineItemError);
      return;
    }
    
    console.log('💾 Inserting leveling snapshots...');
    const { error: snapshotError } = await supabase.from('leveling_snapshots').insert(levelingSnapshots);
    if (snapshotError) {
      console.error('❌ Error inserting leveling snapshots:', snapshotError);
      return;
    }
    
    console.log('✅ Successfully seeded comprehensive bid leveling data!');
    console.log('\n📊 Seeding Summary:');
    console.log(`• RFPs: ${rfps.length}`);
    console.log(`• Vendor Submissions: ${submissions.length}`);
    console.log(`• Bid Line Items: ${bidLineItems.length}`);
    console.log(`• Leveling Snapshots: ${levelingSnapshots.length}`);
    
    // Summary by RFP status
    const statusBreakdown = rfps.reduce((acc, rfp) => {
      acc[rfp.status] = (acc[rfp.status] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n📈 RFP Status Breakdown:');
    console.table(statusBreakdown);
    
    // Vendor tier distribution
    const tierBreakdown = submissions.reduce((acc, sub) => {
      const vendor = CONSTRUCTION_COMPANIES.find(v => v.name === sub.vendor_name);
      const tier = vendor?.tier || 'unknown';
      acc[tier] = (acc[tier] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n🏗️ Vendor Tier Distribution:');
    console.table(tierBreakdown);
    
    // Outlier statistics
    const totalOutliers = levelingSnapshots.reduce((sum, snapshot) => 
      sum + snapshot.outlier_summary.totalOutliers, 0
    );
    
    const severityBreakdown = levelingSnapshots.reduce((acc, snapshot) => {
      Object.entries(snapshot.outlier_summary.severityLevels).forEach(([severity, count]) => {
        acc[severity] = (acc[severity] || 0) + count;
      });
      return acc;
    }, {});
    
    console.log('\n🚨 Outlier Analysis:');
    console.log(`Total outliers detected: ${totalOutliers}`);
    console.table(severityBreakdown);
    
    console.log('\n🎉 Bid leveling data seeding completed successfully!');
    console.log('🌐 Your database now contains realistic construction industry bid data.');
    
  } catch (error) {
    console.error('❌ Unexpected error during seeding:', error);
  }
}

// Run the seeder
if (import.meta.main) {
  await seedBidLevelingData();
}

export { seedBidLevelingData };
