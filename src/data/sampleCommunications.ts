// Sample data for construction project communications from building owner's perspective

export const sampleEmails = [
  {
    id: '1',
    from: 'mike.rodriguez@premiumbuilders.com',
    fromName: 'Mike Rodriguez',
    fromTitle: 'General Contractor',
    subject: 'Weekly Progress Report - Luxury Office Complex',
    body: `Dear Mr. Johnson,

I hope this email finds you well. Here's this week's progress update for your 12-story luxury office complex project:

**Current Status: Week 18 of 52**
- Foundation: 100% Complete ✓
- Structural steel: 85% Complete (ahead of schedule)
- Electrical rough-in: 45% Complete
- Plumbing rough-in: 40% Complete
- HVAC installation: 30% Complete

**This Week's Accomplishments:**
- Completed floors 1-6 structural steel installation
- Passed city inspection for foundation waterproofing
- Delivered and staged electrical panels for floors 1-8
- Coordinated crane scheduling for next week's steel delivery

**Upcoming Milestones:**
- Monday: Steel delivery for floors 7-9
- Wednesday: Electrical inspection for floors 1-3
- Friday: Concrete pour for floors 4-6

**Budget Update:**
- Current spend: $8.2M of $24M budget (34%)
- Contingency used: $180K of $1.2M (15%)
- On track for Q4 2024 completion

**Action Items Requiring Your Approval:**
1. Upgraded elevator system proposal (+$85K) - enhanced energy efficiency
2. Premium lobby marble selection - 3 options attached
3. Rooftop HVAC unit access approval needed by Friday

Please let me know if you'd like to schedule a site visit this week. I'm available Tuesday-Thursday mornings.

Best regards,
Mike Rodriguez
General Contractor, Premium Builders Inc.
Phone: (555) 234-5678
mike.rodriguez@premiumbuilders.com`,
    timestamp: '2 hours ago',
    read: false,
    starred: true,
    hasAttachment: true,
    priority: 'high',
    category: 'contractor'
  },
  {
    id: '2',
    from: 'sarah.chen@arcdesignstudio.com',
    fromName: 'Sarah Chen',
    fromTitle: 'Lead Architect',
    subject: 'Design Revision Approval Required - Lobby Layout',
    body: `Hi Mr. Johnson,

Following our meeting last Tuesday, I've incorporated your feedback regarding the main lobby design. The revised plans address your concerns about traffic flow and incorporate the requested premium finishes.

**Key Changes Made:**
- Expanded reception area by 200 sq ft
- Added executive lounge seating area
- Upgraded to Italian marble flooring (Calacatta Gold)
- Enhanced lighting design with custom chandeliers
- Improved elevator bank positioning for better flow

**Material Upgrades:**
- Flooring: Calacatta Gold marble ($45/sq ft)
- Wall panels: Walnut wood veneer with brass accents
- Reception desk: Custom curved design in matching marble
- Lighting: Crystal chandelier centerpiece ($28K)

**Timeline Impact:**
- Design approval needed by Monday to maintain schedule
- Material ordering requires 6-week lead time
- Installation can begin during week 24

The total upgrade cost is $125,000 above the original lobby budget, but will significantly enhance the building's premium positioning and tenant appeal.

I've attached the revised 3D renderings and material samples. Could we schedule a brief call tomorrow to review these changes?

Looking forward to your approval so we can move forward.

Best regards,
Sarah Chen, AIA, LEED AP
Lead Architect, Arc Design Studio
Phone: (555) 345-6789
sarah.chen@arcdesignstudio.com`,
    timestamp: '4 hours ago',
    read: false,
    starred: false,
    hasAttachment: true,
    priority: 'high',
    category: 'architect'
  },
  {
    id: '3',
    from: 'james.wright@structuraleng.com',
    fromName: 'James Wright',
    fromTitle: 'Structural Engineer',
    subject: 'Structural Analysis Complete - Foundation Reinforcement',
    body: `Mr. Johnson,

I'm pleased to report that our structural analysis for the additional rooftop equipment is complete. The building's foundation and steel framework can support the upgraded HVAC systems with minor reinforcement.

**Engineering Findings:**
- Current foundation: Adequate for base load
- Additional reinforcement needed: 4 steel columns (floors 8-12)
- Weight distribution: Within acceptable parameters
- Seismic calculations: Updated and approved

**Reinforcement Details:**
- Cost: $45,000 for steel and installation
- Timeline: 2 weeks (can be done parallel to other work)
- No impact to tenant spaces
- City permit filing: In progress

**Next Steps:**
- Structural drawings completed and ready for city submission
- Contractor can begin procurement of steel materials
- Installation scheduled for weeks 22-23

This enhancement will future-proof the building for any additional rooftop equipment needs and increase the overall structural rating.

Please let me know if you have any questions about the engineering specifications.

Best regards,
James Wright, PE, SE
Senior Structural Engineer
Wright & Associates Engineering
Phone: (555) 456-7890
james.wright@structuraleng.com`,
    timestamp: '6 hours ago',
    read: true,
    starred: false,
    hasAttachment: true,
    priority: 'normal',
    category: 'engineer'
  },
  {
    id: '4',
    from: 'lisa.martinez@cityplanning.gov',
    fromName: 'Lisa Martinez',
    fromTitle: 'City Building Inspector',
    subject: 'Inspection Passed ✓ - Electrical Rough-in Floors 1-3',
    body: `Dear Property Owner,

This is to confirm that the electrical rough-in inspection for floors 1-3 of your office complex project has been completed and PASSED.

**Inspection Details:**
- Date: Today, 10:30 AM
- Inspector: Lisa Martinez, License #CI-4567
- Areas: Floors 1-3, all units and common areas
- Electrical contractor: Metro Electric (License #EC-8901)

**Items Inspected & Approved:**
- Circuit panel installations and labeling
- Outlet and switch box positioning
- Wire routing and protection
- Fire alarm system rough-in
- Emergency lighting circuits
- Ground fault protection systems

**Compliance Notes:**
- All work meets NEC 2020 standards
- Fire safety requirements satisfied
- ADA compliance verified for switch heights
- Energy efficiency requirements met

**Next Inspection:**
- Insulation and drywall can now proceed
- Next electrical inspection: Final walkthrough (estimated week 35)
- Schedule 48 hours in advance via city portal

**Permit Status:**
- Building Permit #BP-2024-1847: Active
- Estimated completion: Q4 2024
- Certificate of Occupancy: On track

No violations found. Excellent work by your electrical contractor team.

Best regards,
Lisa Martinez
Senior Building Inspector
City of Metropolitan Planning Department
Phone: (555) 567-8901
lisa.martinez@cityplanning.gov`,
    timestamp: '8 hours ago',
    read: true,
    starred: true,
    hasAttachment: false,
    priority: 'normal',
    category: 'government'
  },
  {
    id: '5',
    from: 'robert.kim@steelsupply.com',
    fromName: 'Robert Kim',
    fromTitle: 'Account Manager',
    subject: 'Delivery Confirmation - Structural Steel Floors 7-9',
    body: `Mr. Johnson,

This email confirms the delivery schedule for structural steel beams for floors 7-9 of your office complex project.

**Delivery Details:**
- Date: Monday, 6:00 AM
- Location: Construction site - North entrance
- Crane: Available on-site (confirmed with contractor)
- Driver: Tony Sanchez (555) 678-9012

**Materials Being Delivered:**
- 24x W21x68 steel beams (30 ft length)
- 18x W18x50 steel beams (25 ft length)
- 36x W12x40 steel columns (12 ft length)
- Connection hardware and bolts
- Total weight: 47,500 lbs

**Quality Certifications:**
- Mill certificates included
- AISC certified fabrication
- All pieces tagged and numbered per drawings
- Protective coating applied per specifications

**Payment Terms:**
- Net 30 days from delivery
- Invoice total: $89,450
- 2% discount if paid within 10 days

Your contractor Mike Rodriguez has confirmed site readiness and crane availability. Weather forecast is clear for Monday's delivery.

Please contact me with any questions or concerns.

Best regards,
Robert Kim
Account Manager, Metropolitan Steel Supply
Phone: (555) 678-9012
robert.kim@steelsupply.com`,
    timestamp: '1 day ago',
    read: true,
    starred: false,
    hasAttachment: true,
    priority: 'normal',
    category: 'vendor'
  },
  {
    id: '6',
    from: 'amanda.foster@insurancecorp.com',
    fromName: 'Amanda Foster',
    fromTitle: 'Commercial Insurance Agent',
    subject: 'Policy Update Required - Increased Building Value',
    body: `Dear Mr. Johnson,

I hope you're doing well. I'm reaching out regarding your commercial property insurance policy for the office complex under construction.

**Current Policy Status:**
- Policy #: CP-2024-8847-JHN
- Coverage: $18M building value
- Premium: $2,840/month
- Effective: January 2024 - January 2025

**Required Update:**
Based on the recent appraisal and construction progress, the building's insured value needs to be increased to reflect current replacement cost.

**Recommended Changes:**
- New building value: $24M (+$6M)
- Updated contents coverage: $2M
- Enhanced liability: $5M per occurrence
- Builder's risk: Extended through completion
- Monthly premium adjustment: +$485/month

**Benefits of Updating:**
- Full replacement cost protection
- Enhanced weather damage coverage
- Construction equipment protection
- Delayed completion coverage

**Action Needed:**
Please review the attached updated policy terms and let me know if you'd like to proceed. The adjustment can be effective immediately to ensure continuous protection.

I'm available for a call this week to discuss any questions about coverage options.

Best regards,
Amanda Foster
Senior Commercial Agent
Metropolitan Insurance Corporation
Phone: (555) 789-0123
amanda.foster@insurancecorp.com`,
    timestamp: '2 days ago',
    read: true,
    starred: false,
    hasAttachment: true,
    priority: 'normal',
    category: 'insurance'
  },
  {
    id: '7',
    from: 'david.park@hvacpro.com',
    fromName: 'David Park',
    fromTitle: 'HVAC Project Manager',
    subject: 'Energy Efficiency Upgrade Proposal - 15% Savings',
    body: `Mr. Johnson,

Following our discussion about maximizing energy efficiency, I've prepared a comprehensive upgrade proposal for your HVAC systems.

**Current System Overview:**
- Standard efficiency units: 14 SEER rating
- Basic controls: Programmable thermostats
- Annual energy cost estimate: $185,000

**Proposed Upgrades:**
- High-efficiency units: 18 SEER rating
- Smart building controls with AI optimization
- Variable speed compressors
- Enhanced zoning for optimal comfort
- Real-time energy monitoring system

**Benefits:**
- Energy savings: 15-20% annually ($28K-37K/year)
- Improved tenant comfort and control
- LEED certification points
- Enhanced building value and marketability
- 10-year manufacturer warranty

**Investment Details:**
- Upgrade cost: $125,000 above standard
- Payback period: 3.8 years
- Available rebates: $18,000 from utility company
- Net investment: $107,000

**Timeline:**
- Equipment delivery: 4 weeks
- Installation: Weeks 28-32 (no delay to overall schedule)
- Commissioning: Week 33

The smart controls can be managed remotely and provide detailed energy analytics, helping you optimize operational costs long-term.

I'd be happy to schedule a presentation to walk through the technical specifications and ROI calculations.

Best regards,
David Park
HVAC Project Manager
Professional Climate Systems
Phone: (555) 890-1234
david.park@hvacpro.com`,
    timestamp: '3 days ago',
    read: true,
    starred: false,
    hasAttachment: true,
    priority: 'normal',
    category: 'vendor'
  }
];

export const sampleTeamsChats = [
  {
    id: '1',
    channelName: 'Project Management',
    participants: ['Mike Rodriguez', 'Sarah Chen', 'James Wright', 'You'],
    lastMessage: 'Steel delivery confirmed for Monday 6AM - crane ready',
    timestamp: '15 min ago',
    unread: 3,
    messages: [
      {
        id: '1',
        sender: 'Mike Rodriguez',
        content: 'Good morning everyone. Steel delivery is confirmed for Monday 6AM. Crane will be on-site and ready.',
        timestamp: '15 min ago',
        type: 'text'
      },
      {
        id: '2',
        sender: 'Sarah Chen',
        content: 'Perfect timing. The lobby design approvals should be finalized by then too.',
        timestamp: '12 min ago',
        type: 'text'
      },
      {
        id: '3',
        sender: 'James Wright',
        content: 'Structural drawings for the reinforcement are ready for city submission.',
        timestamp: '8 min ago',
        type: 'text'
      }
    ]
  },
  {
    id: '2',
    channelName: 'Weekly Owner Updates',
    participants: ['Mike Rodriguez', 'You'],
    lastMessage: 'Progress photos from this week attached',
    timestamp: '2 hours ago',
    unread: 1,
    messages: [
      {
        id: '1',
        sender: 'Mike Rodriguez',
        content: 'Weekly progress update is ready. We\'re 2 days ahead of schedule!',
        timestamp: '2 hours ago',
        type: 'text'
      },
      {
        id: '2',
        sender: 'Mike Rodriguez',
        content: 'Progress photos from this week',
        timestamp: '2 hours ago',
        type: 'file',
        fileName: 'Week18_Progress_Photos.zip'
      }
    ]
  },
  {
    id: '3',
    channelName: 'Design Team',
    participants: ['Sarah Chen', 'Lisa Wang', 'David Kim', 'You'],
    lastMessage: 'Lobby renderings are stunning! 🏢✨',
    timestamp: '4 hours ago',
    unread: 0,
    messages: [
      {
        id: '1',
        sender: 'Sarah Chen',
        content: 'Uploaded the revised lobby renderings with the premium finishes',
        timestamp: '5 hours ago',
        type: 'file',
        fileName: 'Lobby_Design_V3_Renderings.pdf'
      },
      {
        id: '2',
        sender: 'Lisa Wang',
        content: 'The Calacatta Gold marble looks incredible in the space!',
        timestamp: '4 hours ago',
        type: 'text'
      },
      {
        id: '3',
        sender: 'David Kim',
        content: 'Lobby renderings are stunning! 🏢✨',
        timestamp: '4 hours ago',
        type: 'text'
      }
    ]
  }
];

export const sampleSlackChannels = [
  {
    id: '1',
    name: 'construction-updates',
    purpose: 'Daily construction progress and updates',
    members: 24,
    lastActivity: '5 min ago',
    unread: 8,
    messages: [
      {
        id: '1',
        user: 'mike_rodriguez',
        displayName: 'Mike Rodriguez',
        content: 'Floor 6 concrete pour completed ✅ Moving to electrical rough-in next week',
        timestamp: '5 min ago',
        reactions: [{ emoji: '✅', count: 3 }, { emoji: '👍', count: 5 }]
      },
      {
        id: '2',
        user: 'electrical_foreman',
        displayName: 'Tom Wilson',
        content: 'Electrical panels for floors 1-8 are staged and ready for installation',
        timestamp: '22 min ago',
        reactions: [{ emoji: '⚡', count: 2 }]
      },
      {
        id: '3',
        user: 'safety_coordinator',
        displayName: 'Maria Santos',
        content: 'Daily safety briefing at 7 AM sharp tomorrow. New hard hat requirements in effect.',
        timestamp: '1 hour ago',
        reactions: [{ emoji: '⛑️', count: 8 }]
      }
    ]
  },
  {
    id: '2',
    name: 'owner-contractor',
    purpose: 'Direct communication between owner and general contractor',
    members: 2,
    lastActivity: '2 hours ago',
    unread: 2,
    messages: [
      {
        id: '1',
        user: 'mike_rodriguez',
        displayName: 'Mike Rodriguez',
        content: 'Budget update: We\'re at 34% spend with 35% work complete. Staying on track! 📊',
        timestamp: '2 hours ago',
        reactions: [{ emoji: '💰', count: 1 }, { emoji: '👌', count: 1 }]
      },
      {
        id: '2',
        user: 'mike_rodriguez',
        displayName: 'Mike Rodriguez',
        content: 'Need your approval on the elevator upgrade proposal by Friday. It\'s a great investment.',
        timestamp: '2 hours ago',
        reactions: []
      }
    ]
  },
  {
    id: '3',
    name: 'vendor-coordination',
    purpose: 'Coordinating with material suppliers and subcontractors',
    members: 15,
    lastActivity: '30 min ago',
    unread: 4,
    messages: [
      {
        id: '1',
        user: 'steel_supplier',
        displayName: 'Robert Kim',
        content: 'Monday 6 AM delivery confirmed. Driver will call 30 min before arrival.',
        timestamp: '30 min ago',
        reactions: [{ emoji: '🚛', count: 3 }]
      },
      {
        id: '2',
        user: 'hvac_manager',
        displayName: 'David Park',
        content: 'High-efficiency units are 15% more expensive but will save $30K annually in energy costs',
        timestamp: '1 hour ago',
        reactions: [{ emoji: '🌱', count: 2 }, { emoji: '💡', count: 4 }]
      }
    ]
  }
];

export const sampleZoomMeetings = [
  {
    id: '1',
    title: 'Weekly Project Review',
    host: 'Mike Rodriguez',
    time: 'Today 2:00 PM',
    duration: '60 min',
    participants: 8,
    status: 'upcoming',
    joinUrl: 'https://zoom.us/j/123456789',
    agenda: 'Review weekly progress, discuss upcoming milestones, approve change orders'
  },
  {
    id: '2',
    title: 'Lobby Design Presentation',
    host: 'Sarah Chen',
    time: 'Tomorrow 10:00 AM',
    duration: '45 min',
    participants: 5,
    status: 'upcoming',
    joinUrl: 'https://zoom.us/j/987654321',
    agenda: 'Present revised lobby designs, review material selections, get final approval'
  },
  {
    id: '3',
    title: 'Site Safety Training',
    host: 'Maria Santos',
    time: 'Monday 7:00 AM',
    duration: '30 min',
    participants: 25,
    status: 'upcoming',
    joinUrl: 'https://zoom.us/j/555666777',
    agenda: 'New hard hat requirements, equipment safety updates, Q&A session'
  },
  {
    id: '4',
    title: 'Structural Engineering Review',
    host: 'James Wright',
    time: 'Last Tuesday 3:00 PM',
    duration: '90 min',
    participants: 6,
    status: 'completed',
    recording: 'Available',
    summary: 'Reviewed foundation reinforcement plans, approved structural modifications for rooftop equipment'
  }
];

export const samplePhoneContacts = [
  {
    id: '1',
    name: 'Mike Rodriguez',
    title: 'General Contractor',
    company: 'Premium Builders Inc.',
    phone: '(555) 234-5678',
    mobile: '(555) 234-5679',
    email: 'mike.rodriguez@premiumbuilders.com',
    category: 'contractor',
    lastContact: '2 hours ago',
    notes: 'Primary project contact - available 6 AM - 8 PM weekdays'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    title: 'Lead Architect',
    company: 'Arc Design Studio',
    phone: '(555) 345-6789',
    mobile: '(555) 345-6790',
    email: 'sarah.chen@arcdesignstudio.com',
    category: 'architect',
    lastContact: '4 hours ago',
    notes: 'Design decisions and approvals - prefers morning meetings'
  },
  {
    id: '3',
    name: 'James Wright',
    title: 'Structural Engineer',
    company: 'Wright & Associates',
    phone: '(555) 456-7890',
    mobile: '(555) 456-7891',
    email: 'james.wright@structuraleng.com',
    category: 'engineer',
    lastContact: '6 hours ago',
    notes: 'PE, SE certified - handles all structural modifications'
  },
  {
    id: '4',
    name: 'Emergency Site Line',
    title: 'Construction Site',
    company: 'Premium Builders Inc.',
    phone: '(555) 999-0000',
    mobile: null,
    email: null,
    category: 'emergency',
    lastContact: 'Never',
    notes: '24/7 emergency line for urgent site issues'
  },
  {
    id: '5',
    name: 'Lisa Martinez',
    title: 'Building Inspector',
    company: 'City Planning Dept.',
    phone: '(555) 567-8901',
    mobile: '(555) 567-8902',
    email: 'lisa.martinez@cityplanning.gov',
    category: 'government',
    lastContact: '8 hours ago',
    notes: 'Schedule inspections 48 hours in advance'
  }
];

export const sampleWhatsAppChats = [
  {
    id: '1',
    name: 'Site Foreman - Tony',
    lastMessage: 'Crane is set up and ready for Monday delivery 👍',
    timestamp: '12 min ago',
    unread: 1,
    phone: '(555) 111-2222',
    online: true,
    messages: [
      {
        id: '1',
        sender: 'Tony',
        content: 'Crane is set up and ready for Monday delivery 👍',
        timestamp: '12 min ago',
        type: 'text'
      },
      {
        id: '2',
        sender: 'You',
        content: 'Perfect! What time should I expect the steel delivery?',
        timestamp: '10 min ago',
        type: 'text'
      },
      {
        id: '3',
        sender: 'Tony',
        content: '6 AM sharp. Driver will call you 30 minutes before arrival.',
        timestamp: '8 min ago',
        type: 'text'
      }
    ]
  },
  {
    id: '2',
    name: 'Electrical Crew Lead',
    lastMessage: 'Photo from today\'s work',
    timestamp: '1 hour ago',
    unread: 0,
    phone: '(555) 333-4444',
    online: false,
    lastSeen: '45 min ago',
    messages: [
      {
        id: '1',
        sender: 'Tom Wilson',
        content: 'Floors 1-3 electrical rough-in is complete and ready for inspection',
        timestamp: '2 hours ago',
        type: 'text'
      },
      {
        id: '2',
        sender: 'Tom Wilson',
        content: 'Photo from today\'s work',
        timestamp: '1 hour ago',
        type: 'image',
        imageUrl: '/demo-electrical-work.jpg'
      }
    ]
  },
  {
    id: '3',
    name: 'Project Investors Group',
    lastMessage: 'Quarterly report looks excellent! 📈',
    timestamp: '3 hours ago',
    unread: 2,
    participants: 4,
    messages: [
      {
        id: '1',
        sender: 'Michael Chen',
        content: 'Just reviewed the Q2 progress report. Very impressed with the timeline!',
        timestamp: '4 hours ago',
        type: 'text'
      },
      {
        id: '2',
        sender: 'Jennifer Liu',
        content: 'The budget management has been excellent. Staying under contingency.',
        timestamp: '3 hours ago',
        type: 'text'
      },
      {
        id: '3',
        sender: 'Robert Davis',
        content: 'Quarterly report looks excellent! 📈',
        timestamp: '3 hours ago',
        type: 'text'
      }
    ]
  }
];

// Company profile data
export const ownerCompanyProfile = {
  name: 'Johnson Development Group',
  owner: 'David Johnson',
  projects: [
    {
      name: 'Luxury Office Complex',
      type: 'Commercial Office Building',
      floors: 12,
      sqft: '450,000',
      budget: '$24M',
      timeline: '52 weeks',
      currentWeek: 18,
      completion: '35%',
      address: '123 Business District Ave',
      city: 'Metropolitan City'
    }
  ],
  team: {
    architect: 'Arc Design Studio',
    contractor: 'Premium Builders Inc.',
    engineer: 'Wright & Associates',
    projectManager: 'Mike Rodriguez'
  }
};
