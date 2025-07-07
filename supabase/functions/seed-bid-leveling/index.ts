import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

// Helper function to generate UUIDs
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('🚀 Starting bid leveling data seeding...');

    // Realistic construction company data
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
      "Mixed-Use Development", "Office Tower", "Healthcare Facility", 
      "Educational Complex", "Retail Center", "Residential High-Rise",
      "Industrial Warehouse", "Government Building", "Sports & Recreation Center",
      "Transportation Hub"
    ];

    // Sample CSI line items
    const CSI_LINE_ITEMS = [
      { csi: "03300", description: "Cast-in-Place Concrete", basePrice: 2850000, variability: 0.22, unit: "CY" },
      { csi: "05100", description: "Structural Metal Framing", basePrice: 3250000, variability: 0.22, unit: "LB" },
      { csi: "08400", description: "Entrances, Storefronts, and Curtain Walls", basePrice: 1850000, variability: 0.25, unit: "SF" },
      { csi: "09200", description: "Plaster and Gypsum Board", basePrice: 1450000, variability: 0.18, unit: "SF" },
      { csi: "23100", description: "HVAC Ducts and Casings", basePrice: 1650000, variability: 0.22, unit: "LB" },
      { csi: "26400", description: "Low-Voltage Distribution", basePrice: 1850000, variability: 0.22, unit: "LF" },
      { csi: "33100", description: "Water Utilities", basePrice: 1450000, variability: 0.28, unit: "LF" },
      { csi: "A1000", description: "General Conditions Allowance", basePrice: 450000, variability: 0.10, unit: "LS", isAllowance: true },
      { csi: "A7000", description: "Owner Contingency", basePrice: 750000, variability: 0.05, unit: "LS", isAllowance: true }
    ];

    // Clean existing data first
    console.log('🧹 Cleaning existing data...');
    await supabase.from('leveling_snapshot').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('bid_line_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('submissions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('bids').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Generate RFP projects
    console.log('📋 Generating RFP projects...');
    const rfps = [];
    const currentDate = new Date();

    for (let i = 0; i < 6; i++) {
      const projectType = PROJECT_TYPES[Math.floor(Math.random() * PROJECT_TYPES.length)];
      const projectSize = ['Medium', 'Large'][Math.floor(Math.random() * 2)];
      const location = ['Downtown', 'Midtown', 'Uptown', 'Suburban', 'Waterfront'][Math.floor(Math.random() * 5)];
      
      const publishedDate = new Date(currentDate.getTime() - Math.random() * 45 * 24 * 60 * 60 * 1000);
      const submissionDeadline = new Date(publishedDate.getTime() + 21 * 24 * 60 * 60 * 1000);
      const evaluationStart = new Date(submissionDeadline.getTime() + 3 * 24 * 60 * 60 * 1000);
      
      const status = currentDate > submissionDeadline ? 'evaluation' : 'open';
      
      rfps.push({
        id: generateUUID(),
        title: `${projectSize} ${location} ${projectType}`,
        description: `Construction of a state-of-the-art ${projectType.toLowerCase()} in the ${location.toLowerCase()} area.`,
        rfp_number: `RFP-${currentDate.getFullYear()}-${String(i + 1).padStart(4, '0')}`,
        bid_type: 'lump_sum',
        estimated_value: Math.round((25000000 + Math.random() * 75000000) / 1000000) * 1000000,
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
        created_by: '00000000-0000-0000-0000-000000000000',
        created_at: publishedDate.toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    // Generate vendor submissions
    console.log('🏢 Generating vendor submissions...');
    const submissions = [];
    
    rfps.forEach(rfp => {
      const numSubmissions = 4 + Math.floor(Math.random() * 4); // 4-7 vendors
      const selectedVendors = CONSTRUCTION_COMPANIES
        .sort(() => Math.random() - 0.5)
        .slice(0, numSubmissions);
      
      selectedVendors.forEach((vendor, index) => {
        const submissionDate = new Date(
          new Date(rfp.submission_deadline).getTime() - Math.random() * 14 * 24 * 60 * 60 * 1000
        );
        
        let priceMultiplier = 1.0;
        if (vendor.tier === 'tier1') {
          priceMultiplier = 1.05 + Math.random() * 0.1;
        } else if (vendor.tier === 'tier2') {
          priceMultiplier = 0.95 + Math.random() * 0.15;
        } else {
          priceMultiplier = 0.8 + Math.random() * 0.25;
        }
        
        const basePrice = Math.round(rfp.estimated_value * priceMultiplier);
        const contingency = Math.round(basePrice * (0.03 + Math.random() * 0.07));
        
        submissions.push({
          id: generateUUID(),
          bid_id: rfp.id,
          vendor_id: generateUUID(),
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

    // Generate bid line items
    console.log('📊 Generating bid line items...');
    const bidLineItems = [];
    
    submissions.forEach(submission => {
      const selectedItems = CSI_LINE_ITEMS.slice(); // Use all items for consistency
      
      selectedItems.forEach((item, index) => {
        let priceVariation = 1.0;
        
        if (submission.vendor_name.includes('Turner') || submission.vendor_name.includes('Skanska')) {
          priceVariation = 0.95 + Math.random() * 0.1;
        } else if (submission.vendor_name.includes('Regional') || submission.vendor_name.includes('Metro')) {
          priceVariation = 0.7 + Math.random() * 0.4;
        } else {
          priceVariation = 0.85 + Math.random() * 0.3;
        }
        
        priceVariation *= (1 + (Math.random() - 0.5) * item.variability);
        
        // Create some outliers
        if (Math.random() < 0.08) {
          priceVariation *= Math.random() < 0.5 ? 0.5 : 1.8;
        }
        
        const quantity = Math.round(100 + Math.random() * 900);
        const unitPrice = Math.round(item.basePrice * priceVariation / quantity * 100) / 100;
        const extended = Math.round(unitPrice * quantity);
        
        bidLineItems.push({
          id: generateUUID(),
          submission_id: submission.id,
          vendor_name: submission.vendor_name,
          csi_code: item.csi,
          description: item.description,
          qty: quantity,
          uom: item.unit,
          unit_price: unitPrice,
          extended: extended,
          is_allowance: item.isAllowance || false,
          confidence_score: 0.85 + Math.random() * 0.15,
          extracted_at: submission.created_at,
          created_at: submission.created_at,
          updated_at: submission.created_at
        });
      });
    });

    // Generate leveling snapshots
    console.log('🔍 Generating leveling snapshots...');
    const levelingSnapshots = [];
    
    rfps.forEach(rfp => {
      if (rfp.status === 'evaluation') {
        const rfpSubmissions = submissions.filter(s => s.bid_id === rfp.id);
        const rfpLineItems = bidLineItems.filter(bli => 
          rfpSubmissions.some(s => s.id === bli.submission_id)
        );
        
        // Group line items
        const groupedItems = new Map();
        rfpLineItems.forEach(item => {
          const key = `${item.csi_code}-${item.description}`;
          if (!groupedItems.has(key)) {
            groupedItems.set(key, []);
          }
          groupedItems.get(key).push(item);
        });
        
        const matrixData = [];
        let totalOutliers = 0;
        const outliersByGroup = {};
        const severityLevels = { mild: 0, moderate: 0, severe: 0 };
        
        groupedItems.forEach((items, groupKey) => {
          const [csiCode, description] = groupKey.split('-', 2);
          const extendedPrices = items.map(item => item.extended).filter(price => price > 0);
          
          if (extendedPrices.length < 2) return;
          
          // Calculate statistics
          const sorted = extendedPrices.sort((a, b) => a - b);
          const mean = sorted.reduce((sum, val) => sum + val, 0) / sorted.length;
          const median = sorted[Math.floor(sorted.length / 2)];
          const q1 = sorted[Math.floor(sorted.length * 0.25)];
          const q3 = sorted[Math.floor(sorted.length * 0.75)];
          const iqr = q3 - q1;
          const std = Math.sqrt(sorted.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / sorted.length);
          
          // Detect outliers
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
        
        const analysisDate = new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000);
        
        levelingSnapshots.push({
          id: generateUUID(),
          bid_id: rfp.id,
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
          processing_time_ms: Math.round(1500 + Math.random() * 2000),
          created_at: analysisDate.toISOString(),
          updated_at: analysisDate.toISOString()
        });
      }
    });

    // Insert data
    console.log('💾 Inserting data...');
    
    const { error: rfpError } = await supabase.from('bids').insert(rfps);
    if (rfpError) {
      console.error('Error inserting RFPs:', rfpError);
      throw rfpError;
    }
    
    const { error: submissionError } = await supabase.from('submissions').insert(submissions);
    if (submissionError) {
      console.error('Error inserting submissions:', submissionError);
      throw submissionError;
    }
    
    const { error: lineItemError } = await supabase.from('bid_line_items').insert(bidLineItems);
    if (lineItemError) {
      console.error('Error inserting bid line items:', lineItemError);
      throw lineItemError;
    }
    
    const { error: snapshotError } = await supabase.from('leveling_snapshot').insert(levelingSnapshots);
    if (snapshotError) {
      console.error('Error inserting leveling snapshots:', snapshotError);
      throw snapshotError;
    }

    const summary = {
      success: true,
      message: 'Bid leveling data seeded successfully',
      data: {
        rfps: rfps.length,
        submissions: submissions.length,
        bidLineItems: bidLineItems.length,
        levelingSnapshots: levelingSnapshots.length,
        totalOutliers: levelingSnapshots.reduce((sum, s) => sum + s.outlier_summary.totalOutliers, 0)
      }
    };

    console.log('✅ Seeding completed:', summary);

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Seeding error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
