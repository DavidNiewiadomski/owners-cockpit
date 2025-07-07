import { createClient } from '@supabase/supabase-js';

// Types for bid data
interface ImportedBid {
  vendorName: string;
  totalBid: number;
  submissionDate: string;
  bondAmount?: number;
  bondRate?: number;
  contact?: {
    primary?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  lineItems: ImportedLineItem[];
  compliance?: {
    bidForm?: boolean;
    bond?: boolean;
    insurance?: boolean;
    references?: boolean;
    financials?: boolean;
    schedule?: boolean;
  };
  alternates?: Array<{
    number: number;
    description: string;
    price: number;
  }>;
  source?: string;
}

interface ImportedLineItem {
  id?: string;
  csiCode?: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

// Function to seed bid data into Supabase
export async function seedBidData(rfpId: string, importedBids: ImportedBid[]) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    // 1. Insert vendors
    const vendorInserts = importedBids.map((bid, index) => ({
      id: `VEN-${String(index + 100).padStart(3, '0')}`,
      name: bid.vendorName,
      email: bid.contact?.email || `contact@${bid.vendorName.toLowerCase().replace(/\s+/g, '')}.com`,
      phone: bid.contact?.phone || '(555) 000-0000',
      address: bid.contact?.address || '1234 Business St, City, ST 12345',
      bond_amount: bid.bondAmount || Math.round(bid.totalBid * 0.01),
      bond_rate: bid.bondRate || 1.0,
      prequalified: true,
      insurance_compliant: bid.compliance?.insurance ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    const { data: vendors, error: vendorError } = await supabase
      .from('vendors')
      .upsert(vendorInserts, { onConflict: 'name' })
      .select();

    if (vendorError) {
      console.error('Error inserting vendors:', vendorError);
      throw vendorError;
    }

    // 2. Insert bids
    const bidInserts = importedBids.map((bid, index) => ({
      id: `BID-${String(index + 100).padStart(3, '0')}`,
      rfp_id: rfpId,
      vendor_id: vendorInserts[index].id,
      total_amount: bid.totalBid,
      submission_date: bid.submissionDate,
      status: 'submitted',
      technical_score: 85 + Math.random() * 10, // Random score between 85-95
      commercial_score: 80 + Math.random() * 15, // Random score between 80-95
      compliance_score: bid.compliance ? 
        Object.values(bid.compliance).filter(Boolean).length / Object.keys(bid.compliance).length * 100 : 90,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    const { data: bids, error: bidError } = await supabase
      .from('bids')
      .upsert(bidInserts, { onConflict: 'id' })
      .select();

    if (bidError) {
      console.error('Error inserting bids:', bidError);
      throw bidError;
    }

    // 3. Insert line items and bid line items
    const allLineItems: any[] = [];
    const allBidLineItems: any[] = [];

    importedBids.forEach((bid, bidIndex) => {
      bid.lineItems.forEach((lineItem, lineIndex) => {
        const lineItemId = `LI-${String(bidIndex * 100 + lineIndex + 100).padStart(3, '0')}`;
        
        // Check if this line item already exists (by description or CSI code)
        const existingLineItem = allLineItems.find(li => 
          li.description === lineItem.description || 
          (lineItem.csiCode && li.csi_code === lineItem.csiCode)
        );

        if (!existingLineItem) {
          allLineItems.push({
            id: lineItemId,
            rfp_id: rfpId,
            csi_code: lineItem.csiCode || `99 ${String(lineIndex + 1).padStart(2, '0')} 00`,
            description: lineItem.description,
            quantity: lineItem.quantity,
            unit: lineItem.unit,
            category: inferCategory(lineItem.description, lineItem.csiCode),
            engineer_estimate: Math.round(lineItem.totalPrice * (0.95 + Math.random() * 0.1)), // +/- 5% variance
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }

        // Add bid line item
        allBidLineItems.push({
          id: `BLI-${String(bidIndex * 100 + lineIndex + 100).padStart(3, '0')}`,
          bid_id: bidInserts[bidIndex].id,
          line_item_id: existingLineItem?.id || lineItemId,
          unit_price: lineItem.unitPrice,
          total_price: lineItem.totalPrice,
          notes: lineItem.notes || '',
          is_alternate: false,
          has_exception: Math.random() > 0.8, // 20% chance of having an exception
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      });
    });

    // Insert line items
    const { error: lineItemError } = await supabase
      .from('line_items')
      .upsert(allLineItems, { onConflict: 'id' });

    if (lineItemError) {
      console.error('Error inserting line items:', lineItemError);
      throw lineItemError;
    }

    // Insert bid line items
    const { error: bidLineItemError } = await supabase
      .from('bid_line_items')
      .upsert(allBidLineItems, { onConflict: 'id' });

    if (bidLineItemError) {
      console.error('Error inserting bid line items:', bidLineItemError);
      throw bidLineItemError;
    }

    // 4. Insert alternates if any
    const alternateInserts: any[] = [];
    importedBids.forEach((bid, bidIndex) => {
      if (bid.alternates) {
        bid.alternates.forEach((alternate, altIndex) => {
          alternateInserts.push({
            id: `ALT-${String(bidIndex * 10 + altIndex + 100).padStart(3, '0')}`,
            bid_id: bidInserts[bidIndex].id,
            alternate_number: alternate.number,
            description: alternate.description,
            price_adjustment: alternate.price,
            created_at: new Date().toISOString()
          });
        });
      }
    });

    if (alternateInserts.length > 0) {
      const { error: alternateError } = await supabase
        .from('bid_alternates')
        .upsert(alternateInserts, { onConflict: 'id' });

      if (alternateError) {
        console.error('Error inserting alternates:', alternateError);
        throw alternateError;
      }
    }

    console.log(`Successfully seeded ${importedBids.length} bids with ${allLineItems.length} line items`);
    
    return {
      vendors: vendors,
      bids: bids,
      lineItems: allLineItems,
      bidLineItems: allBidLineItems,
      alternates: alternateInserts
    };

  } catch (error) {
    console.error('Error seeding bid data:', error);
    throw error;
  }
}

// Helper function to infer category from description or CSI code
function inferCategory(description: string, csiCode?: string): string {
  const desc = description.toLowerCase();
  
  if (csiCode) {
    const code = csiCode.substring(0, 2);
    switch (code) {
      case '23': return 'HVAC';
      case '26': return 'Electrical';
      case '22': return 'Plumbing';
      case '03': return 'Concrete';
      case '05': return 'Metals';
      case '06': return 'Wood';
      case '07': return 'Thermal/Moisture';
      case '08': return 'Openings';
      case '09': return 'Finishes';
      default: break;
    }
  }

  // Fallback to description-based inference
  if (desc.includes('hvac') || desc.includes('air') || desc.includes('duct') || desc.includes('heat') || desc.includes('cool')) {
    return 'HVAC';
  } else if (desc.includes('electrical') || desc.includes('power') || desc.includes('lighting') || desc.includes('panel')) {
    return 'Electrical';
  } else if (desc.includes('plumb') || desc.includes('water') || desc.includes('pipe') || desc.includes('drain')) {
    return 'Plumbing';
  } else if (desc.includes('concrete') || desc.includes('foundation') || desc.includes('slab')) {
    return 'Concrete';
  } else if (desc.includes('steel') || desc.includes('metal') || desc.includes('structural')) {
    return 'Metals';
  } else {
    return 'General';
  }
}

// Function to generate comprehensive seed data for testing
export function generateSeedBidData(rfpId: string, numberOfBids: number = 6): ImportedBid[] {
  const vendorNames = [
    'Advanced MEP Solutions LLC',
    'Premier HVAC Corporation',
    'Integrated Building Systems Inc',
    'Metro Mechanical Contractors',
    'Elite Electrical Systems',
    'ProTech Construction Services',
    'Precision Engineering Works',
    'Municipal Infrastructure Partners',
    'Consolidated Building Technologies',
    'Heritage Construction Group'
  ];

  const lineItemTemplates = [
    {
      csiCode: '23 05 00',
      description: 'HVAC System - Main Air Handling Units',
      quantity: 4,
      unit: 'EA',
      basePrice: 112500
    },
    {
      csiCode: '23 07 00',
      description: 'Ductwork and Distribution System',
      quantity: 15000,
      unit: 'LF',
      basePrice: 56.67
    },
    {
      csiCode: '26 05 00',
      description: 'Electrical Service and Distribution',
      quantity: 1,
      unit: 'LS',
      basePrice: 1250000
    },
    {
      csiCode: '26 24 00',
      description: 'LED Lighting Systems',
      quantity: 120,
      unit: 'EA',
      basePrice: 450
    },
    {
      csiCode: '22 11 00',
      description: 'Domestic Water Distribution',
      quantity: 2500,
      unit: 'LF',
      basePrice: 28.50
    },
    {
      csiCode: '22 13 00',
      description: 'Sanitary Waste and Vent Systems',
      quantity: 1800,
      unit: 'LF',
      basePrice: 42.75
    },
    {
      csiCode: '23 81 00',
      description: 'Building Control Systems',
      quantity: 1,
      unit: 'LS',
      basePrice: 185000
    },
    {
      csiCode: '26 27 00',
      description: 'Fire Alarm Systems',
      quantity: 1,
      unit: 'LS',
      basePrice: 95000
    }
  ];

  return Array.from({ length: numberOfBids }, (_, index) => {
    const vendorName = vendorNames[index % vendorNames.length];
    const competitivnessFactor = 0.85 + Math.random() * 0.3; // 85% to 115% of base price
    
    const lineItems = lineItemTemplates.map(template => {
      const unitPrice = template.basePrice * competitivnessFactor * (0.9 + Math.random() * 0.2);
      const totalPrice = unitPrice * template.quantity;
      
      return {
        id: `LI-${String(index * 100 + lineItemTemplates.indexOf(template)).padStart(3, '0')}`,
        csiCode: template.csiCode,
        description: template.description,
        quantity: template.quantity,
        unit: template.unit,
        unitPrice: Math.round(unitPrice * 100) / 100,
        totalPrice: Math.round(totalPrice),
        notes: Math.random() > 0.7 ? 'Includes 2-year warranty and maintenance package' : ''
      };
    });

    const totalBid = lineItems.reduce((sum, item) => sum + item.totalPrice, 0);

    return {
      vendorName,
      totalBid: Math.round(totalBid),
      submissionDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), // Random date within last week
      bondAmount: Math.round(totalBid * 0.01),
      bondRate: 1.0,
      contact: {
        primary: 'Project Manager',
        email: `contact@${vendorName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '')}.com`,
        phone: `(555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        address: `${Math.floor(Math.random() * 9999) + 1} Business Blvd, Metro City, ST ${Math.floor(Math.random() * 90000) + 10000}`
      },
      lineItems,
      compliance: {
        bidForm: true,
        bond: Math.random() > 0.1, // 90% have bonds
        insurance: Math.random() > 0.05, // 95% have insurance
        references: Math.random() > 0.15, // 85% have references
        financials: Math.random() > 0.2, // 80% have financials
        schedule: Math.random() > 0.05 // 95% submit schedule
      },
      alternates: Math.random() > 0.5 ? [
        {
          number: 1,
          description: 'Upgrade to premium efficiency equipment',
          price: Math.round(totalBid * (0.05 + Math.random() * 0.1)) // 5-15% of total bid
        }
      ] : [],
      source: 'generated'
    };
  });
}

// Migration function to create the necessary database schema
export const bidAnalysisSchema = {
  vendors: `
    CREATE TABLE IF NOT EXISTS vendors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      email TEXT,
      phone TEXT,
      address TEXT,
      bond_amount NUMERIC DEFAULT 0,
      bond_rate NUMERIC DEFAULT 1.0,
      prequalified BOOLEAN DEFAULT false,
      insurance_compliant BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  
  rfps: `
    CREATE TABLE IF NOT EXISTS rfps (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      budget_estimate NUMERIC,
      bid_due_date TIMESTAMP WITH TIME ZONE,
      status TEXT DEFAULT 'active',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  
  line_items: `
    CREATE TABLE IF NOT EXISTS line_items (
      id TEXT PRIMARY KEY,
      rfp_id TEXT REFERENCES rfps(id),
      csi_code TEXT,
      description TEXT NOT NULL,
      quantity NUMERIC NOT NULL,
      unit TEXT NOT NULL,
      category TEXT,
      engineer_estimate NUMERIC,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  
  bids: `
    CREATE TABLE IF NOT EXISTS bids (
      id TEXT PRIMARY KEY,
      rfp_id TEXT REFERENCES rfps(id),
      vendor_id TEXT REFERENCES vendors(id),
      total_amount NUMERIC NOT NULL,
      submission_date TIMESTAMP WITH TIME ZONE,
      status TEXT DEFAULT 'submitted',
      technical_score NUMERIC DEFAULT 0,
      commercial_score NUMERIC DEFAULT 0,
      compliance_score NUMERIC DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  
  bid_line_items: `
    CREATE TABLE IF NOT EXISTS bid_line_items (
      id TEXT PRIMARY KEY,
      bid_id TEXT REFERENCES bids(id),
      line_item_id TEXT REFERENCES line_items(id),
      unit_price NUMERIC NOT NULL,
      total_price NUMERIC NOT NULL,
      notes TEXT,
      is_alternate BOOLEAN DEFAULT false,
      has_exception BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  
  bid_alternates: `
    CREATE TABLE IF NOT EXISTS bid_alternates (
      id TEXT PRIMARY KEY,
      bid_id TEXT REFERENCES bids(id),
      alternate_number INTEGER NOT NULL,
      description TEXT NOT NULL,
      price_adjustment NUMERIC NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `
};
