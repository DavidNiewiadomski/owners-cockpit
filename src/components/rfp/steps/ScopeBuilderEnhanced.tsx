import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Target, 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  Save, 
  AlertCircle, 
  Zap, 
  DollarSign,
  Building,
  Lightbulb,
  FileText,
  Loader2
} from 'lucide-react';
import type { RfpWizardData } from '../RfpWizardEnhanced';
import { useDraftScopeOfWork } from '@/hooks/useRfpDrafter';

interface ScopeBuilderEnhancedProps {
  data: RfpWizardData;
  onDataChange: (data: Partial<RfpWizardData>) => void;
  errors?: string[];
}

// Common CSI divisions and codes
const CSI_DIVISIONS = {
  '01': 'General Requirements',
  '02': 'Existing Conditions',
  '03': 'Concrete',
  '04': 'Masonry',
  '05': 'Metals',
  '06': 'Wood, Plastics, and Composites',
  '07': 'Thermal and Moisture Protection',
  '08': 'Openings',
  '09': 'Finishes',
  '10': 'Specialties',
  '11': 'Equipment',
  '12': 'Furnishings',
  '13': 'Special Construction',
  '14': 'Conveying Equipment',
  '21': 'Fire Suppression',
  '22': 'Plumbing',
  '23': 'Heating, Ventilating, and Air Conditioning (HVAC)',
  '25': 'Integrated Automation',
  '26': 'Electrical',
  '27': 'Communications',
  '28': 'Electronic Safety and Security',
  '31': 'Earthwork',
  '32': 'Exterior Improvements',
  '33': 'Utilities',
};

// Comprehensive CSI MasterFormat 2020 Divisions and Common Sections
const CSI_SECTIONS = [
  // Division 00 - Procurement and Contracting Requirements
  { code: '00 01 00', description: 'Project Title Page', division: '00', divisionName: 'Procurement and Contracting Requirements' },
  { code: '00 11 00', description: 'Advertisement for Bids', division: '00', divisionName: 'Procurement and Contracting Requirements' },
  { code: '00 21 00', description: 'Instructions to Bidders', division: '00', divisionName: 'Procurement and Contracting Requirements' },
  { code: '00 41 00', description: 'Bid Forms', division: '00', divisionName: 'Procurement and Contracting Requirements' },
  { code: '00 52 00', description: 'Agreement Forms', division: '00', divisionName: 'Procurement and Contracting Requirements' },
  { code: '00 72 00', description: 'General Conditions', division: '00', divisionName: 'Procurement and Contracting Requirements' },
  { code: '00 73 00', description: 'Supplementary Conditions', division: '00', divisionName: 'Procurement and Contracting Requirements' },

  // Division 01 - General Requirements
  { code: '01 10 00', description: 'Summary', division: '01', divisionName: 'General Requirements' },
  { code: '01 20 00', description: 'Price and Payment Procedures', division: '01', divisionName: 'General Requirements' },
  { code: '01 25 00', description: 'Substitution Procedures', division: '01', divisionName: 'General Requirements' },
  { code: '01 30 00', description: 'Administrative Requirements', division: '01', divisionName: 'General Requirements' },
  { code: '01 40 00', description: 'Quality Requirements', division: '01', divisionName: 'General Requirements' },
  { code: '01 50 00', description: 'Temporary Facilities and Controls', division: '01', divisionName: 'General Requirements' },
  { code: '01 60 00', description: 'Product Requirements', division: '01', divisionName: 'General Requirements' },
  { code: '01 70 00', description: 'Execution and Closeout Requirements', division: '01', divisionName: 'General Requirements' },
  { code: '01 78 00', description: 'Closeout Submittals', division: '01', divisionName: 'General Requirements' },
  { code: '01 91 00', description: 'Commissioning', division: '01', divisionName: 'General Requirements' },

  // Division 02 - Existing Conditions
  { code: '02 20 00', description: 'Assessment', division: '02', divisionName: 'Existing Conditions' },
  { code: '02 30 00', description: 'Subsurface Investigation', division: '02', divisionName: 'Existing Conditions' },
  { code: '02 40 00', description: 'Demolition and Structure Moving', division: '02', divisionName: 'Existing Conditions' },
  { code: '02 41 00', description: 'Demolition', division: '02', divisionName: 'Existing Conditions' },
  { code: '02 50 00', description: 'Site Remediation', division: '02', divisionName: 'Existing Conditions' },
  { code: '02 60 00', description: 'Contaminated Site Material Removal', division: '02', divisionName: 'Existing Conditions' },
  { code: '02 70 00', description: 'Water and Sewer Utilities', division: '02', divisionName: 'Existing Conditions' },
  { code: '02 80 00', description: 'Facility Remediation', division: '02', divisionName: 'Existing Conditions' },

  // Division 03 - Concrete
  { code: '03 10 00', description: 'Concrete Forming and Accessories', division: '03', divisionName: 'Concrete' },
  { code: '03 20 00', description: 'Concrete Reinforcing', division: '03', divisionName: 'Concrete' },
  { code: '03 30 00', description: 'Cast-in-Place Concrete', division: '03', divisionName: 'Concrete' },
  { code: '03 40 00', description: 'Precast Concrete', division: '03', divisionName: 'Concrete' },
  { code: '03 50 00', description: 'Cast Decks and Underlayment', division: '03', divisionName: 'Concrete' },
  { code: '03 60 00', description: 'Grouting', division: '03', divisionName: 'Concrete' },
  { code: '03 70 00', description: 'Mass Concrete', division: '03', divisionName: 'Concrete' },
  { code: '03 80 00', description: 'Concrete Cutting and Boring', division: '03', divisionName: 'Concrete' },

  // Division 04 - Masonry
  { code: '04 20 00', description: 'Unit Masonry', division: '04', divisionName: 'Masonry' },
  { code: '04 21 00', description: 'Clay Unit Masonry', division: '04', divisionName: 'Masonry' },
  { code: '04 22 00', description: 'Concrete Unit Masonry', division: '04', divisionName: 'Masonry' },
  { code: '04 40 00', description: 'Stone', division: '04', divisionName: 'Masonry' },
  { code: '04 50 00', description: 'Refractory Masonry', division: '04', divisionName: 'Masonry' },
  { code: '04 60 00', description: 'Corrosion-Resistant Masonry', division: '04', divisionName: 'Masonry' },
  { code: '04 70 00', description: 'Manufactured Masonry', division: '04', divisionName: 'Masonry' },

  // Division 05 - Metals
  { code: '05 10 00', description: 'Structural Metal Framing', division: '05', divisionName: 'Metals' },
  { code: '05 20 00', description: 'Metal Joists', division: '05', divisionName: 'Metals' },
  { code: '05 30 00', description: 'Metal Decking', division: '05', divisionName: 'Metals' },
  { code: '05 40 00', description: 'Cold-Formed Metal Framing', division: '05', divisionName: 'Metals' },
  { code: '05 50 00', description: 'Metal Fabrications', division: '05', divisionName: 'Metals' },
  { code: '05 70 00', description: 'Decorative Metal', division: '05', divisionName: 'Metals' },
  { code: '05 80 00', description: 'Expansion Control', division: '05', divisionName: 'Metals' },

  // Division 06 - Wood, Plastics, and Composites
  { code: '06 10 00', description: 'Rough Carpentry', division: '06', divisionName: 'Wood, Plastics, and Composites' },
  { code: '06 20 00', description: 'Finish Carpentry', division: '06', divisionName: 'Wood, Plastics, and Composites' },
  { code: '06 40 00', description: 'Architectural Woodwork', division: '06', divisionName: 'Wood, Plastics, and Composites' },
  { code: '06 50 00', description: 'Structural Plastics', division: '06', divisionName: 'Wood, Plastics, and Composites' },
  { code: '06 60 00', description: 'Plastic Fabrications', division: '06', divisionName: 'Wood, Plastics, and Composites' },
  { code: '06 70 00', description: 'Structural Composites', division: '06', divisionName: 'Wood, Plastics, and Composites' },

  // Division 07 - Thermal and Moisture Protection
  { code: '07 10 00', description: 'Dampproofing and Waterproofing', division: '07', divisionName: 'Thermal and Moisture Protection' },
  { code: '07 20 00', description: 'Thermal Protection', division: '07', divisionName: 'Thermal and Moisture Protection' },
  { code: '07 21 00', description: 'Thermal Insulation', division: '07', divisionName: 'Thermal and Moisture Protection' },
  { code: '07 30 00', description: 'Steep Slope Roofing', division: '07', divisionName: 'Thermal and Moisture Protection' },
  { code: '07 40 00', description: 'Roofing and Siding Panels', division: '07', divisionName: 'Thermal and Moisture Protection' },
  { code: '07 50 00', description: 'Membrane Roofing', division: '07', divisionName: 'Thermal and Moisture Protection' },
  { code: '07 60 00', description: 'Flashing and Sheet Metal', division: '07', divisionName: 'Thermal and Moisture Protection' },
  { code: '07 70 00', description: 'Roof and Wall Specialties and Accessories', division: '07', divisionName: 'Thermal and Moisture Protection' },
  { code: '07 80 00', description: 'Fire and Smoke Protection', division: '07', divisionName: 'Thermal and Moisture Protection' },
  { code: '07 90 00', description: 'Joint Protection', division: '07', divisionName: 'Thermal and Moisture Protection' },

  // Division 08 - Openings
  { code: '08 10 00', description: 'Doors and Frames', division: '08', divisionName: 'Openings' },
  { code: '08 11 00', description: 'Metal Doors and Frames', division: '08', divisionName: 'Openings' },
  { code: '08 14 00', description: 'Wood Doors', division: '08', divisionName: 'Openings' },
  { code: '08 30 00', description: 'Specialty Doors and Frames', division: '08', divisionName: 'Openings' },
  { code: '08 40 00', description: 'Entrances, Storefronts, and Curtain Walls', division: '08', divisionName: 'Openings' },
  { code: '08 50 00', description: 'Windows', division: '08', divisionName: 'Openings' },
  { code: '08 60 00', description: 'Roof Windows and Skylights', division: '08', divisionName: 'Openings' },
  { code: '08 70 00', description: 'Hardware', division: '08', divisionName: 'Openings' },
  { code: '08 80 00', description: 'Glazing', division: '08', divisionName: 'Openings' },
  { code: '08 90 00', description: 'Louvers and Vents', division: '08', divisionName: 'Openings' },

  // Division 09 - Finishes
  { code: '09 20 00', description: 'Plaster and Gypsum Board', division: '09', divisionName: 'Finishes' },
  { code: '09 30 00', description: 'Tiling', division: '09', divisionName: 'Finishes' },
  { code: '09 50 00', description: 'Ceilings', division: '09', divisionName: 'Finishes' },
  { code: '09 51 00', description: 'Acoustical Ceilings', division: '09', divisionName: 'Finishes' },
  { code: '09 60 00', description: 'Flooring', division: '09', divisionName: 'Finishes' },
  { code: '09 65 00', description: 'Resilient Flooring', division: '09', divisionName: 'Finishes' },
  { code: '09 68 00', description: 'Carpeting', division: '09', divisionName: 'Finishes' },
  { code: '09 70 00', description: 'Wall Finishes', division: '09', divisionName: 'Finishes' },
  { code: '09 80 00', description: 'Acoustic Treatment', division: '09', divisionName: 'Finishes' },
  { code: '09 90 00', description: 'Painting and Coating', division: '09', divisionName: 'Finishes' },
  { code: '09 91 00', description: 'Painting', division: '09', divisionName: 'Finishes' },

  // Division 10 - Specialties
  { code: '10 10 00', description: 'Information Specialties', division: '10', divisionName: 'Specialties' },
  { code: '10 20 00', description: 'Interior Specialties', division: '10', divisionName: 'Specialties' },
  { code: '10 30 00', description: 'Fireplaces and Stoves', division: '10', divisionName: 'Specialties' },
  { code: '10 40 00', description: 'Safety Specialties', division: '10', divisionName: 'Specialties' },
  { code: '10 50 00', description: 'Storage Specialties', division: '10', divisionName: 'Specialties' },
  { code: '10 70 00', description: 'Exterior Specialties', division: '10', divisionName: 'Specialties' },
  { code: '10 80 00', description: 'Other Specialties', division: '10', divisionName: 'Specialties' },

  // Division 11 - Equipment
  { code: '11 10 00', description: 'Vehicle and Pedestrian Equipment', division: '11', divisionName: 'Equipment' },
  { code: '11 20 00', description: 'Commercial Equipment', division: '11', divisionName: 'Equipment' },
  { code: '11 30 00', description: 'Residential Equipment', division: '11', divisionName: 'Equipment' },
  { code: '11 40 00', description: 'Foodservice Equipment', division: '11', divisionName: 'Equipment' },
  { code: '11 50 00', description: 'Educational and Scientific Equipment', division: '11', divisionName: 'Equipment' },
  { code: '11 60 00', description: 'Entertainment Equipment', division: '11', divisionName: 'Equipment' },
  { code: '11 70 00', description: 'Healthcare Equipment', division: '11', divisionName: 'Equipment' },
  { code: '11 80 00', description: 'Collection and Disposal Equipment', division: '11', divisionName: 'Equipment' },

  // Division 12 - Furnishings
  { code: '12 10 00', description: 'Art', division: '12', divisionName: 'Furnishings' },
  { code: '12 20 00', description: 'Window Treatments', division: '12', divisionName: 'Furnishings' },
  { code: '12 30 00', description: 'Casework', division: '12', divisionName: 'Furnishings' },
  { code: '12 40 00', description: 'Furnishings and Accessories', division: '12', divisionName: 'Furnishings' },
  { code: '12 50 00', description: 'Furniture', division: '12', divisionName: 'Furnishings' },
  { code: '12 60 00', description: 'Multiple Seating', division: '12', divisionName: 'Furnishings' },
  { code: '12 90 00', description: 'Other Furnishings', division: '12', divisionName: 'Furnishings' },

  // Division 13 - Special Construction
  { code: '13 10 00', description: 'Special Facility Components', division: '13', divisionName: 'Special Construction' },
  { code: '13 20 00', description: 'Special Purpose Rooms', division: '13', divisionName: 'Special Construction' },
  { code: '13 30 00', description: 'Special Structures', division: '13', divisionName: 'Special Construction' },
  { code: '13 40 00', description: 'Integrated Construction', division: '13', divisionName: 'Special Construction' },
  { code: '13 50 00', description: 'Special Instrumentation', division: '13', divisionName: 'Special Construction' },

  // Division 14 - Conveying Equipment
  { code: '14 10 00', description: 'Dumbwaiters', division: '14', divisionName: 'Conveying Equipment' },
  { code: '14 20 00', description: 'Elevators', division: '14', divisionName: 'Conveying Equipment' },
  { code: '14 30 00', description: 'Escalators and Moving Walks', division: '14', divisionName: 'Conveying Equipment' },
  { code: '14 40 00', description: 'Lifts', division: '14', divisionName: 'Conveying Equipment' },
  { code: '14 70 00', description: 'Turntables', division: '14', divisionName: 'Conveying Equipment' },
  { code: '14 80 00', description: 'Scaffolding', division: '14', divisionName: 'Conveying Equipment' },
  { code: '14 90 00', description: 'Other Conveying Equipment', division: '14', divisionName: 'Conveying Equipment' },

  // Division 21 - Fire Suppression
  { code: '21 10 00', description: 'Water-Based Fire-Suppression Systems', division: '21', divisionName: 'Fire Suppression' },
  { code: '21 20 00', description: 'Fire-Extinguishing Systems', division: '21', divisionName: 'Fire Suppression' },
  { code: '21 30 00', description: 'Fire Pumps', division: '21', divisionName: 'Fire Suppression' },

  // Division 22 - Plumbing
  { code: '22 10 00', description: 'Plumbing Piping and Pumps', division: '22', divisionName: 'Plumbing' },
  { code: '22 11 00', description: 'Facility Water Distribution', division: '22', divisionName: 'Plumbing' },
  { code: '22 13 00', description: 'Facility Sanitary Sewerage', division: '22', divisionName: 'Plumbing' },
  { code: '22 30 00', description: 'Plumbing Equipment', division: '22', divisionName: 'Plumbing' },
  { code: '22 40 00', description: 'Plumbing Fixtures', division: '22', divisionName: 'Plumbing' },
  { code: '22 50 00', description: 'Pool and Fountain Equipment', division: '22', divisionName: 'Plumbing' },

  // Division 23 - HVAC
  { code: '23 05 00', description: 'Common Work Results for HVAC', division: '23', divisionName: 'HVAC' },
  { code: '23 07 00', description: 'HVAC Insulation', division: '23', divisionName: 'HVAC' },
  { code: '23 09 00', description: 'Instrumentation and Control for HVAC', division: '23', divisionName: 'HVAC' },
  { code: '23 20 00', description: 'HVAC Piping and Pumps', division: '23', divisionName: 'HVAC' },
  { code: '23 30 00', description: 'HVAC Air Distribution', division: '23', divisionName: 'HVAC' },
  { code: '23 40 00', description: 'HVAC Air Cleaning Devices', division: '23', divisionName: 'HVAC' },
  { code: '23 50 00', description: 'Central Heating Equipment', division: '23', divisionName: 'HVAC' },
  { code: '23 60 00', description: 'Central Cooling Equipment', division: '23', divisionName: 'HVAC' },
  { code: '23 70 00', description: 'Central HVAC Equipment', division: '23', divisionName: 'HVAC' },
  { code: '23 80 00', description: 'Decentralized HVAC Equipment', division: '23', divisionName: 'HVAC' },

  // Division 25 - Integrated Automation
  { code: '25 10 00', description: 'Integrated Automation Network Equipment', division: '25', divisionName: 'Integrated Automation' },
  { code: '25 30 00', description: 'Integrated Automation Instrumentation and Terminal Devices', division: '25', divisionName: 'Integrated Automation' },
  { code: '25 50 00', description: 'Integrated Automation Facility Controls', division: '25', divisionName: 'Integrated Automation' },

  // Division 26 - Electrical
  { code: '26 05 00', description: 'Common Work Results for Electrical', division: '26', divisionName: 'Electrical' },
  { code: '26 09 00', description: 'Instrumentation and Control for Electrical Systems', division: '26', divisionName: 'Electrical' },
  { code: '26 20 00', description: 'Low-Voltage Electrical Transmission', division: '26', divisionName: 'Electrical' },
  { code: '26 24 00', description: 'Switchboards and Panelboards', division: '26', divisionName: 'Electrical' },
  { code: '26 27 00', description: 'Low-Voltage Distribution Equipment', division: '26', divisionName: 'Electrical' },
  { code: '26 28 00', description: 'Low-Voltage Circuit Protective Devices', division: '26', divisionName: 'Electrical' },
  { code: '26 29 00', description: 'Low-Voltage Controllers', division: '26', divisionName: 'Electrical' },
  { code: '26 30 00', description: 'Facility Electrical Power Generating and Storing Equipment', division: '26', divisionName: 'Electrical' },
  { code: '26 40 00', description: 'Electrical and Cathodic Protection', division: '26', divisionName: 'Electrical' },
  { code: '26 50 00', description: 'Lighting', division: '26', divisionName: 'Electrical' },

  // Division 27 - Communications
  { code: '27 10 00', description: 'Structured Cabling', division: '27', divisionName: 'Communications' },
  { code: '27 20 00', description: 'Data Communications', division: '27', divisionName: 'Communications' },
  { code: '27 30 00', description: 'Voice Communications', division: '27', divisionName: 'Communications' },
  { code: '27 40 00', description: 'Audio-Video Communications', division: '27', divisionName: 'Communications' },
  { code: '27 50 00', description: 'Distributed Communications and Monitoring Systems', division: '27', divisionName: 'Communications' },

  // Division 28 - Electronic Safety and Security
  { code: '28 10 00', description: 'Electronic Access Control and Intrusion Detection', division: '28', divisionName: 'Electronic Safety and Security' },
  { code: '28 20 00', description: 'Electronic Surveillance', division: '28', divisionName: 'Electronic Safety and Security' },
  { code: '28 30 00', description: 'Electronic Detection and Alarm', division: '28', divisionName: 'Electronic Safety and Security' },
  { code: '28 40 00', description: 'Electronic Monitoring and Control', division: '28', divisionName: 'Electronic Safety and Security' },
  { code: '28 50 00', description: 'Electronic Information and Communication Technology Infrastructure', division: '28', divisionName: 'Electronic Safety and Security' },

  // Division 31 - Earthwork
  { code: '31 10 00', description: 'Site Clearing', division: '31', divisionName: 'Earthwork' },
  { code: '31 20 00', description: 'Earth Moving', division: '31', divisionName: 'Earthwork' },
  { code: '31 30 00', description: 'Earthwork Methods', division: '31', divisionName: 'Earthwork' },
  { code: '31 40 00', description: 'Shoring and Underpinning', division: '31', divisionName: 'Earthwork' },
  { code: '31 50 00', description: 'Excavation Support and Protection', division: '31', divisionName: 'Earthwork' },
  { code: '31 60 00', description: 'Special Foundations and Load-Bearing Elements', division: '31', divisionName: 'Earthwork' },
  { code: '31 70 00', description: 'Tunneling and Mining', division: '31', divisionName: 'Earthwork' },

  // Division 32 - Exterior Improvements
  { code: '32 10 00', description: 'Bases, Ballasts, and Paving', division: '32', divisionName: 'Exterior Improvements' },
  { code: '32 30 00', description: 'Site Improvements', division: '32', divisionName: 'Exterior Improvements' },
  { code: '32 70 00', description: 'Wetlands', division: '32', divisionName: 'Exterior Improvements' },
  { code: '32 80 00', description: 'Irrigation', division: '32', divisionName: 'Exterior Improvements' },
  { code: '32 90 00', description: 'Planting', division: '32', divisionName: 'Exterior Improvements' },

  // Division 33 - Utilities
  { code: '33 10 00', description: 'Water Utilities', division: '33', divisionName: 'Utilities' },
  { code: '33 20 00', description: 'Wells', division: '33', divisionName: 'Utilities' },
  { code: '33 30 00', description: 'Sanitary Sewerage Utilities', division: '33', divisionName: 'Utilities' },
  { code: '33 40 00', description: 'Storm Drainage Utilities', division: '33', divisionName: 'Utilities' },
  { code: '33 50 00', description: 'Fuel Distribution Utilities', division: '33', divisionName: 'Utilities' },
  { code: '33 60 00', description: 'Hydronic and Steam Energy Utilities', division: '33', divisionName: 'Utilities' },
  { code: '33 70 00', description: 'Electrical Utilities', division: '33', divisionName: 'Utilities' },
  { code: '33 80 00', description: 'Communications Utilities', division: '33', divisionName: 'Utilities' },

  // Division 34 - Transportation
  { code: '34 10 00', description: 'Guideways', division: '34', divisionName: 'Transportation' },
  { code: '34 20 00', description: 'Traction Power', division: '34', divisionName: 'Transportation' },
  { code: '34 40 00', description: 'Transportation Signaling and Control Equipment', division: '34', divisionName: 'Transportation' },
  { code: '34 70 00', description: 'Transportation Construction and Equipment', division: '34', divisionName: 'Transportation' },

  // Division 35 - Waterway and Marine Construction
  { code: '35 20 00', description: 'Waterway and Marine Construction and Equipment', division: '35', divisionName: 'Waterway and Marine Construction' },
  { code: '35 50 00', description: 'Marine Construction and Equipment', division: '35', divisionName: 'Waterway and Marine Construction' },

  // Division 40 - Process Integration
  { code: '40 10 00', description: 'Gas and Liquid Process Piping', division: '40', divisionName: 'Process Integration' },
  { code: '40 20 00', description: 'Process Heating, Cooling, and Drying Equipment', division: '40', divisionName: 'Process Integration' },
  { code: '40 30 00', description: 'Industrial Process Gas and Liquid Equipment', division: '40', divisionName: 'Process Integration' },
  { code: '40 40 00', description: 'Industrial Process Storage Equipment', division: '40', divisionName: 'Process Integration' },
  { code: '40 90 00', description: 'Other Process Integration Systems', division: '40', divisionName: 'Process Integration' },

  // Division 41 - Material Processing and Handling Equipment
  { code: '41 10 00', description: 'Bulk Material Processing Equipment', division: '41', divisionName: 'Material Processing and Handling Equipment' },
  { code: '41 20 00', description: 'Bulk Material Handling Equipment', division: '41', divisionName: 'Material Processing and Handling Equipment' },
  { code: '41 30 00', description: 'Manufacturing Equipment', division: '41', divisionName: 'Material Processing and Handling Equipment' },

  // Division 42 - Process Heating, Cooling, and Drying Equipment
  { code: '42 10 00', description: 'Process Heating Equipment', division: '42', divisionName: 'Process Heating, Cooling, and Drying Equipment' },
  { code: '42 20 00', description: 'Process Cooling Equipment', division: '42', divisionName: 'Process Heating, Cooling, and Drying Equipment' },
  { code: '42 30 00', description: 'Process Drying Equipment', division: '42', divisionName: 'Process Heating, Cooling, and Drying Equipment' },

  // Division 43 - Process Gas and Liquid Handling, Purification, and Storage Equipment
  { code: '43 10 00', description: 'Gas Handling Equipment', division: '43', divisionName: 'Process Gas and Liquid Handling, Purification, and Storage Equipment' },
  { code: '43 20 00', description: 'Liquid Handling Equipment', division: '43', divisionName: 'Process Gas and Liquid Handling, Purification, and Storage Equipment' },
  { code: '43 30 00', description: 'Gas and Liquid Purification Equipment', division: '43', divisionName: 'Process Gas and Liquid Handling, Purification, and Storage Equipment' },
  { code: '43 40 00', description: 'Gas and Liquid Storage Equipment', division: '43', divisionName: 'Process Gas and Liquid Handling, Purification, and Storage Equipment' },

  // Division 44 - Pollution and Waste Control Equipment
  { code: '44 10 00', description: 'Air Pollution Control Equipment', division: '44', divisionName: 'Pollution and Waste Control Equipment' },
  { code: '44 20 00', description: 'Noise Pollution Control Equipment', division: '44', divisionName: 'Pollution and Waste Control Equipment' },
  { code: '44 30 00', description: 'Water Pollution Control Equipment', division: '44', divisionName: 'Pollution and Waste Control Equipment' },
  { code: '44 40 00', description: 'Solid Waste Control Equipment', division: '44', divisionName: 'Pollution and Waste Control Equipment' },

  // Division 45 - Industry-Specific Manufacturing Equipment
  { code: '45 10 00', description: 'Food and Beverage Manufacturing Equipment', division: '45', divisionName: 'Industry-Specific Manufacturing Equipment' },
  { code: '45 20 00', description: 'Pharmaceutical Manufacturing Equipment', division: '45', divisionName: 'Industry-Specific Manufacturing Equipment' },
  { code: '45 30 00', description: 'Pulp and Paper Manufacturing Equipment', division: '45', divisionName: 'Industry-Specific Manufacturing Equipment' },
  { code: '45 40 00', description: 'Textile Manufacturing Equipment', division: '45', divisionName: 'Industry-Specific Manufacturing Equipment' },

  // Division 46 - Water and Wastewater Equipment
  { code: '46 10 00', description: 'Water Treatment Equipment', division: '46', divisionName: 'Water and Wastewater Equipment' },
  { code: '46 20 00', description: 'Wastewater Treatment Equipment', division: '46', divisionName: 'Water and Wastewater Equipment' },
  { code: '46 70 00', description: 'Packaged Water and Wastewater Treatment Equipment', division: '46', divisionName: 'Water and Wastewater Equipment' },

  // Division 47 - Water Generation Equipment
  { code: '47 10 00', description: 'Water Generation Equipment', division: '47', divisionName: 'Water Generation Equipment' },

  // Division 48 - Electrical Power Generation
  { code: '48 10 00', description: 'Electrical Power Generation Equipment', division: '48', divisionName: 'Electrical Power Generation' },
  { code: '48 20 00', description: 'Electrical Power Transmission Equipment', division: '48', divisionName: 'Electrical Power Generation' },
];

const PRIORITY_OPTIONS = [
  { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
];

export function ScopeBuilderEnhanced({ data, onDataChange, errors = [] }: ScopeBuilderEnhancedProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({
    csi_code: '',
    description: '',
    estimated_cost: '',
    priority: 'medium' as const
  });
  const [showAIGeneration, setShowAIGeneration] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  const { draftScopeOfWork, loading: aiLoading, error: aiError } = useDraftScopeOfWork();

  const filteredCSICodes = CSI_SECTIONS.filter(item => 
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.divisionName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addScopeItem = () => {
    if (!newItem.csi_code || !newItem.description) return;

    const scopeItem = {
      id: Date.now().toString(),
      csi_code: newItem.csi_code,
      description: newItem.description,
      estimated_cost: newItem.estimated_cost ? parseFloat(newItem.estimated_cost) : undefined,
      priority: newItem.priority,
      ai_generated: false
    };

    const updatedScopeItems = [...(data.scope_items || []), scopeItem];
    onDataChange({ scope_items: updatedScopeItems });

    // Reset form
    setNewItem({
      csi_code: '',
      description: '',
      estimated_cost: '',
      priority: 'medium'
    });
  };

  const updateScopeItem = (id: string, updates: Partial<typeof data.scope_items[0]>) => {
    const updatedItems = data.scope_items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    onDataChange({ scope_items: updatedItems });
    setEditingItem(null);
  };

  const deleteScopeItem = (id: string) => {
    const updatedItems = data.scope_items.filter(item => item.id !== id);
    onDataChange({ scope_items: updatedItems });
  };

  const generateAIScope = async () => {
    if (!aiPrompt.trim()) return;

    try {
      const projectMeta = {
        title: data.title,
        facility_id: data.facility_id,
        project_type: data.project_type,
        budget_cap: data.budget_cap,
        project_size_sqft: data.project_size_sqft,
        compliance: data.compliance
      };

      const result = await draftScopeOfWork(projectMeta, data.scope_items);
      
      // Parse AI response and create scope items
      // This is a simplified version - in reality, you'd parse the AI response more sophisticatedly
      const aiGeneratedItems = [
        {
          id: Date.now().toString(),
          csi_code: '00 00 00',
          description: aiPrompt,
          priority: 'medium' as const,
          ai_generated: true
        }
      ];

      const updatedScopeItems = [...data.scope_items, ...aiGeneratedItems];
      onDataChange({ 
        scope_items: updatedScopeItems,
        ai_generated_content: {
          ...data.ai_generated_content,
          scope_of_work: result.markdown
        }
      });
      
      setAiPrompt('');
      setShowAIGeneration(false);
    } catch (error) {
      console.error('AI generation failed:', error);
    }
  };

  const quickAddCSI = (csiItem: typeof CSI_SECTIONS[0]) => {
    const scopeItem = {
      id: Date.now().toString(),
      csi_code: csiItem.code,
      description: csiItem.description,
      priority: 'medium' as const,
      ai_generated: false
    };

    const updatedScopeItems = [...(data.scope_items || []), scopeItem];
    onDataChange({ scope_items: updatedScopeItems });
  };

  const getTotalEstimatedCost = () => {
    return data.scope_items
      .filter(item => item.estimated_cost)
      .reduce((total, item) => total + (item.estimated_cost || 0), 0);
  };

  const getPriorityColor = (priority: string) => {
    const option = PRIORITY_OPTIONS.find(p => p.value === priority);
    return option?.color || 'bg-gray-100 text-gray-800';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Scope of Work Builder</h2>
        <p className="text-muted-foreground">
          Define project scope using CSI codes with AI assistance
        </p>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {errors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{data.scope_items.length}</div>
              <div className="text-sm text-muted-foreground">Scope Items</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ${getTotalEstimatedCost().toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Est. Cost</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {data.scope_items.filter(item => item.priority === 'critical').length}
              </div>
              <div className="text-sm text-muted-foreground">Critical Items</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {data.scope_items.filter(item => item.ai_generated).length}
              </div>
              <div className="text-sm text-muted-foreground">AI Generated</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Generation Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            AI Scope Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!showAIGeneration ? (
            <div className="text-center py-6">
              <Lightbulb className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Let AI help you generate scope items based on your project description
              </p>
              <Button onClick={() => setShowAIGeneration(true)}>
                <Zap className="w-4 h-4 mr-2" />
                Generate with AI
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="ai-prompt">Describe your project scope requirements</Label>
                <Textarea
                  id="ai-prompt"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g., Hospital emergency department renovation including new patient rooms, nurse stations, and medical gas systems..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={generateAIScope} 
                  disabled={!aiPrompt.trim() || aiLoading}
                >
                  {aiLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4 mr-2" />
                  )}
                  Generate Scope
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAIGeneration(false)}
                >
                  Cancel
                </Button>
              </div>
              {aiError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>AI generation failed: {aiError}</AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add New Scope Item */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Scope Item
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="csi-code">CSI Code</Label>
              <Input
                id="csi-code"
                value={newItem.csi_code}
                onChange={(e) => setNewItem({ ...newItem, csi_code: e.target.value })}
                placeholder="e.g., 03 30 00"
              />
            </div>
            
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={newItem.priority} onValueChange={(value: any) => setNewItem({ ...newItem, priority: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              placeholder="Detailed description of the work to be performed..."
              rows={2}
            />
          </div>
          
          <div>
            <Label htmlFor="estimated-cost">Estimated Cost (Optional)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="estimated-cost"
                type="number"
                value={newItem.estimated_cost}
                onChange={(e) => setNewItem({ ...newItem, estimated_cost: e.target.value })}
                placeholder="50000"
                className="pl-10"
              />
            </div>
          </div>
          
          <Button onClick={addScopeItem} disabled={!newItem.csi_code || !newItem.description}>
            <Plus className="w-4 h-4 mr-2" />
            Add Scope Item
          </Button>
        </CardContent>
      </Card>

      {/* CSI Code Quick Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            CSI Quick Reference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search CSI sections by code, description, or division..."
              className="max-w-md"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-96 overflow-y-auto">
            {filteredCSICodes.map((item) => (
              <div
                key={item.code}
                onClick={() => quickAddCSI(item)}
                className="p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors hover:shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium text-sm">{item.code}</div>
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    Div {item.division}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mb-1">{item.description}</div>
                <div className="text-xs text-muted-foreground font-medium">{item.divisionName}</div>
              </div>
            ))}
          </div>
          {filteredCSICodes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No CSI sections found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Scope Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Current Scope Items ({data.scope_items.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.scope_items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Building className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No scope items added yet. Start by adding your first scope item above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.scope_items.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{item.csi_code}</Badge>
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                        {item.ai_generated && (
                          <Badge variant="secondary">
                            <Zap className="w-3 h-3 mr-1" />
                            AI Generated
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm mb-2">{item.description}</p>
                      {item.estimated_cost && (
                        <div className="text-sm text-muted-foreground">
                          Est. Cost: ${item.estimated_cost.toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingItem(item.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteScopeItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
