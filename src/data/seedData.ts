import { Complaint, MasterIssue, UserAccount, NotificationItem, RootCauseInsight, PreventiveInsight } from '../types';

export const DEMO_USERS: UserAccount[] = [
  {
    id: 'user-resident-1',
    name: 'Mrs. Sunita Sharma',
    email: 'resident@shikayatbox.demo',
    role: 'resident',
    flat: 'B-402',
    wing: 'B Wing',
    title: 'Resident (B-402)'
  },
  {
    id: 'user-committee-1',
    name: 'Rohan Sharma',
    email: 'committee@shikayatbox.demo',
    role: 'committee',
    flat: 'A-501',
    wing: 'A Wing',
    title: 'Maintenance Lead & MC Member'
  },
  {
    id: 'user-admin-1',
    name: 'Priya Nair',
    email: 'admin@shikayatbox.demo',
    role: 'admin',
    flat: 'C-204',
    wing: 'C Wing',
    title: 'Society Secretary'
  }
];

const now = Date.now();
const hour = 3600 * 1000;

export const INITIAL_COMPLAINTS: Complaint[] = [
  // 1. Water issue B-Wing (Critical / Attention Required)
  {
    id: 'c-001',
    case_id: 'WC-024',
    resident_id: 'res-b402',
    resident_name: 'Sunita Sharma',
    resident_phone: '+91 98201 44521',
    resident_flat: 'B-402',
    building: 'Greenwood Heights',
    wing: 'B Wing',
    location_detail: '4th Floor Service Duct',
    original_message: 'Water leakage from ceiling in B wing corridor right outside flat 402. Paani lagatar tapak raha hai and electric meter box ke paas ja raha hai!',
    normalized_summary: 'Severe water leakage in B Wing 4th floor corridor near electrical meter box',
    language: 'hinglish',
    category: 'Water',
    urgency: 'CRITICAL',
    confidence: 96,
    impact_score: 86,
    impact_breakdown: { severity: 90, residents: 78, duration: 82, safety: 95 },
    sentiment: 'Urgent',
    photo_url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80',
    created_at: new Date(now - 2.2 * hour).toISOString(),
    updated_at: new Date(now - 0.5 * hour).toISOString(),
    assigned_to: 'Rohan Sharma (Maintenance Lead)',
    assigned_at: new Date(now - 1.8 * hour).toISOString(),
    status: 'IN_PROGRESS',
    sla_hours: 4,
    sla_deadline: new Date(now + 1.8 * hour).toISOString(), // ~1 hr 48 min remaining
    sla_breached: false,
    escalation_status: 'SUGGESTED',
    duplicate_group_id: 'cluster-water-b',
    duplicate_confidence: 94,
    similar_complaint_ids: ['c-002', 'c-003', 'c-004', 'c-005', 'c-006', 'c-007'],
    ai_action_plan: {
      recommended_action: 'Immediate inspection recommended. Shut off riser valve on 4th floor and isolate electric shaft.',
      suggested_owner: 'Rohan Sharma (Maintenance Lead)',
      suggested_sla_hours: 4,
      decision_factors: [
        'Water dripping near electrical meter represents severe short-circuit hazard',
        'Direct corridor hazard affecting all 4th floor residents',
        'Persistent leak reported for over 2 hours'
      ],
      why_urgency: [
        'Electrical fire risk due to adjacent electrical junction box',
        'Essential building infrastructure integrity affected'
      ]
    },
    ai_response: 'Hi Mrs. Sharma, we have flagged this as critical because of the electrical meter proximity. Rohan Sharma has been dispatched with the plumber and electrician.',
    response_sent_at: new Date(now - 1.7 * hour).toISOString(),
    reopened: false,
    timeline: [
      {
        id: 't-001-1',
        timestamp: new Date(now - 2.2 * hour).toISOString(),
        type: 'SUBMITTED',
        title: 'Complaint submitted by resident',
        description: 'Resident reported via smart chat with photo attachment.',
        actor: 'Sunita Sharma (B-402)'
      },
      {
        id: 't-001-2',
        timestamp: new Date(now - 2.2 * hour + 5000).toISOString(),
        type: 'TRIAGED',
        title: 'AI Triaged: CRITICAL Water Leak',
        description: 'AI analyzed Hinglish text, detected electrical hazard, and set 4h SLA.',
        actor: 'SHIKAYAT BOX AI'
      },
      {
        id: 't-001-3',
        timestamp: new Date(now - 1.8 * hour).toISOString(),
        type: 'ASSIGNED',
        title: 'Assigned to Rohan Sharma',
        description: 'Maintenance team took ownership of emergency response.',
        actor: 'Committee Triage'
      }
    ]
  },

  // 2. Water B-Wing: 5th floor
  {
    id: 'c-002',
    case_id: 'WC-025',
    resident_id: 'res-b504',
    resident_name: 'Anil Deshmukh',
    resident_phone: '+91 98334 11209',
    resident_flat: 'B-504',
    building: 'Greenwood Heights',
    wing: 'B Wing',
    location_detail: '5th Floor Bathrooms',
    original_message: 'B wing water pressure is very low, taps are running dry since morning. Office jane me problem ho rahi hai.',
    normalized_summary: 'Severe low water pressure and dry taps across 5th floor in B Wing',
    language: 'hinglish',
    category: 'Water',
    urgency: 'HIGH',
    confidence: 95,
    impact_score: 79,
    impact_breakdown: { severity: 82, residents: 76, duration: 75, safety: 70 },
    sentiment: 'Frustrated',
    created_at: new Date(now - 3.5 * hour).toISOString(),
    updated_at: new Date(now - 3.5 * hour).toISOString(),
    assigned_to: 'Rohan Sharma (Maintenance Lead)',
    assigned_at: new Date(now - 2.5 * hour).toISOString(),
    status: 'IN_PROGRESS',
    sla_hours: 4,
    sla_deadline: new Date(now + 0.5 * hour).toISOString(),
    sla_breached: false,
    escalation_status: 'NONE',
    duplicate_group_id: 'cluster-water-b',
    duplicate_confidence: 92,
    similar_complaint_ids: ['c-001', 'c-003', 'c-004'],
    ai_action_plan: {
      recommended_action: 'Check overhead B Wing distribution valve and booster pump pressure gauge.',
      suggested_owner: 'Rohan Sharma (Maintenance Lead)',
      suggested_sla_hours: 4,
      decision_factors: ['Widespread supply issue impacting morning hygiene', 'High building occupancy hour'],
      why_urgency: ['Essential daily necessity', 'Multiple floors in B Wing reporting same symptom']
    },
    ai_response: 'Dear Mr. Deshmukh, the committee is aware of the B Wing pressure drop and the pump technician is currently troubleshooting the overhead line.',
    reopened: false,
    timeline: [
      {
        id: 't-002-1',
        timestamp: new Date(now - 3.5 * hour).toISOString(),
        type: 'SUBMITTED',
        title: 'Complaint submitted',
        description: 'Resident reported water outage.',
        actor: 'Anil Deshmukh (B-504)'
      }
    ]
  },

  // 3. Water B-Wing: 3rd floor
  {
    id: 'c-003',
    case_id: 'WC-026',
    resident_id: 'res-b302',
    resident_name: 'Rajesh Kulkarni',
    resident_flat: 'B-302',
    building: 'Greenwood Heights',
    wing: 'B Wing',
    original_message: 'No water in B wing since 7 AM. Overhead tank khali hai kya?',
    normalized_summary: 'Complete water supply disruption in B Wing since early morning',
    language: 'hinglish',
    category: 'Water',
    urgency: 'HIGH',
    confidence: 94,
    impact_score: 78,
    impact_breakdown: { severity: 80, residents: 85, duration: 70, safety: 65 },
    sentiment: 'Concerned',
    created_at: new Date(now - 3.8 * hour).toISOString(),
    updated_at: new Date(now - 3.8 * hour).toISOString(),
    assigned_to: 'Rohan Sharma (Maintenance Lead)',
    status: 'IN_PROGRESS',
    sla_hours: 4,
    sla_deadline: new Date(now + 0.2 * hour).toISOString(),
    sla_breached: false,
    escalation_status: 'SUGGESTED',
    duplicate_group_id: 'cluster-water-b',
    duplicate_confidence: 96,
    ai_action_plan: {
      recommended_action: 'Verify main sump pump status and overhead feeder line.',
      suggested_owner: 'Rohan Sharma (Maintenance Lead)',
      suggested_sla_hours: 4,
      decision_factors: ['Repeated water outage reports from B Wing'],
      why_urgency: ['Essential utility']
    },
    reopened: false,
    timeline: [
      {
        id: 't-003-1',
        timestamp: new Date(now - 3.8 * hour).toISOString(),
        type: 'SUBMITTED',
        title: 'Complaint submitted',
        description: 'Reported water outage in B Wing.',
        actor: 'Rajesh Kulkarni (B-302)'
      }
    ]
  },

  // 4. Water B-Wing: 7th floor
  {
    id: 'c-004',
    case_id: 'WC-027',
    resident_id: 'res-b701',
    resident_name: 'Pooja Hegde',
    resident_flat: 'B-701',
    building: 'Greenwood Heights',
    wing: 'B Wing',
    original_message: 'Water supply problem on 7th floor. Kitchen and bathroom both dry.',
    normalized_summary: 'Complete lack of water supply on 7th floor B Wing',
    language: 'english',
    category: 'Water',
    urgency: 'HIGH',
    confidence: 93,
    impact_score: 75,
    impact_breakdown: { severity: 80, residents: 70, duration: 70, safety: 60 },
    sentiment: 'Frustrated',
    created_at: new Date(now - 4.1 * hour).toISOString(),
    updated_at: new Date(now - 4.1 * hour).toISOString(),
    status: 'IN_PROGRESS',
    sla_hours: 4,
    sla_deadline: new Date(now - 0.1 * hour).toISOString(),
    sla_breached: true,
    escalation_status: 'ESCALATED',
    duplicate_group_id: 'cluster-water-b',
    duplicate_confidence: 95,
    ai_action_plan: {
      recommended_action: 'Check 7th floor distribution bypass valve.',
      suggested_owner: 'Rohan Sharma (Maintenance Lead)',
      suggested_sla_hours: 4,
      decision_factors: ['Top floor gravity feed issue'],
      why_urgency: ['Zero water supply for several hours']
    },
    reopened: false,
    timeline: [
      {
        id: 't-004-1',
        timestamp: new Date(now - 4.1 * hour).toISOString(),
        type: 'SUBMITTED',
        title: 'Complaint submitted',
        description: 'Dry taps on 7th floor.',
        actor: 'Pooja Hegde (B-701)'
      },
      {
        id: 't-004-2',
        timestamp: new Date(now - 0.1 * hour).toISOString(),
        type: 'ESCALATED',
        title: 'SLA Breached: Auto Escalated',
        description: 'Issue exceeded 4-hour SLA target. Escalated to Maintenance Committee Head.',
        actor: 'SHIKAYAT BOX SLA Monitor'
      }
    ]
  },

  // 5. Water B-Wing Hindi Devanagari
  {
    id: 'c-005',
    case_id: 'WC-028',
    resident_id: 'res-b203',
    resident_name: 'Mahesh Verma',
    resident_flat: 'B-203',
    building: 'Greenwood Heights',
    wing: 'B Wing',
    original_message: 'बी विंग में पानी नहीं आ रहा है सुबह से। कृपया जल्दी ठीक करवाएं।',
    normalized_summary: 'Water disruption reported in Hindi for B Wing since morning',
    language: 'hindi',
    category: 'Water',
    urgency: 'HIGH',
    confidence: 97,
    impact_score: 77,
    impact_breakdown: { severity: 80, residents: 75, duration: 75, safety: 65 },
    sentiment: 'Concerned',
    created_at: new Date(now - 3.2 * hour).toISOString(),
    updated_at: new Date(now - 3.2 * hour).toISOString(),
    status: 'IN_PROGRESS',
    sla_hours: 4,
    sla_deadline: new Date(now + 0.8 * hour).toISOString(),
    sla_breached: false,
    escalation_status: 'NONE',
    duplicate_group_id: 'cluster-water-b',
    duplicate_confidence: 96,
    ai_action_plan: {
      recommended_action: 'Consolidate with B Wing master water issue.',
      suggested_owner: 'Rohan Sharma (Maintenance Lead)',
      suggested_sla_hours: 4,
      decision_factors: ['Hindi Devanagari matched to Water category', 'Same wing as WC-024'],
      why_urgency: ['Essential utility failure']
    },
    reopened: false,
    timeline: [
      {
        id: 't-005-1',
        timestamp: new Date(now - 3.2 * hour).toISOString(),
        type: 'SUBMITTED',
        title: 'Complaint submitted in Hindi',
        description: 'Resident used Devanagari script.',
        actor: 'Mahesh Verma (B-203)'
      }
    ]
  },

  // 6. Water B-Wing: 6th floor
  {
    id: 'c-006',
    case_id: 'WC-029',
    resident_id: 'res-b601',
    resident_name: 'Kavita Chawla',
    resident_flat: 'B-601',
    building: 'Greenwood Heights',
    wing: 'B Wing',
    original_message: 'Tank isn\'t supplying B wing, pressure completely dropped. Kitchen tap empty.',
    normalized_summary: 'Tank supply failure affecting B Wing 6th floor',
    language: 'english',
    category: 'Water',
    urgency: 'HIGH',
    confidence: 95,
    impact_score: 76,
    impact_breakdown: { severity: 80, residents: 75, duration: 70, safety: 60 },
    sentiment: 'Frustrated',
    created_at: new Date(now - 2.9 * hour).toISOString(),
    updated_at: new Date(now - 2.9 * hour).toISOString(),
    status: 'IN_PROGRESS',
    sla_hours: 4,
    sla_deadline: new Date(now + 1.1 * hour).toISOString(),
    sla_breached: false,
    escalation_status: 'NONE',
    duplicate_group_id: 'cluster-water-b',
    duplicate_confidence: 94,
    ai_action_plan: {
      recommended_action: 'Link to Master Issue WC-M024.',
      suggested_owner: 'Rohan Sharma (Maintenance Lead)',
      suggested_sla_hours: 4,
      decision_factors: ['Cluster correlation'],
      why_urgency: ['Household water cutoff']
    },
    reopened: false,
    timeline: [
      {
        id: 't-006-1',
        timestamp: new Date(now - 2.9 * hour).toISOString(),
        type: 'SUBMITTED',
        title: 'Complaint submitted',
        description: 'Dry kitchen taps.',
        actor: 'Kavita Chawla (B-601)'
      }
    ]
  },

  // 7. Water B-Wing: 1st floor
  {
    id: 'c-007',
    case_id: 'WC-030',
    resident_id: 'res-b104',
    resident_name: 'Harish Mehta',
    resident_flat: 'B-104',
    building: 'Greenwood Heights',
    wing: 'B Wing',
    original_message: 'Paani nahi aa raha B wing mein. Pipe rattling loud sound.',
    normalized_summary: 'Air lock and water disruption in B Wing lower floor',
    language: 'hinglish',
    category: 'Water',
    urgency: 'HIGH',
    confidence: 94,
    impact_score: 74,
    impact_breakdown: { severity: 75, residents: 70, duration: 70, safety: 65 },
    sentiment: 'Concerned',
    created_at: new Date(now - 2.5 * hour).toISOString(),
    updated_at: new Date(now - 2.5 * hour).toISOString(),
    status: 'IN_PROGRESS',
    sla_hours: 4,
    sla_deadline: new Date(now + 1.5 * hour).toISOString(),
    sla_breached: false,
    escalation_status: 'NONE',
    duplicate_group_id: 'cluster-water-b',
    duplicate_confidence: 95,
    ai_action_plan: {
      recommended_action: 'Bleed air from main line after pump restart.',
      suggested_owner: 'Rohan Sharma (Maintenance Lead)',
      suggested_sla_hours: 4,
      decision_factors: ['Airlock rattling sounds'],
      why_urgency: ['Wing-wide issue']
    },
    reopened: false,
    timeline: [
      {
        id: 't-007-1',
        timestamp: new Date(now - 2.5 * hour).toISOString(),
        type: 'SUBMITTED',
        title: 'Complaint submitted',
        description: 'Pipe rattling in flat 104.',
        actor: 'Harish Mehta (B-104)'
      }
    ]
  },

  // 8. Lift B Failure (Section 68 Judge Flow benchmark)
  {
    id: 'c-008',
    case_id: 'WC-031',
    resident_id: 'res-b702',
    resident_name: 'Dr. Ashok Singhal',
    resident_phone: '+91 99870 55112',
    resident_flat: 'B-702',
    building: 'Greenwood Heights',
    wing: 'B Wing',
    location_detail: 'Lift B Ground Floor',
    original_message: 'Lift B subah se band hai aur 7th floor pe elderly log hain. Heart patient resident needs to visit clinic!',
    normalized_summary: 'Lift B out of service since morning affecting elderly heart patient on 7th floor',
    language: 'hinglish',
    category: 'Lift',
    urgency: 'HIGH',
    confidence: 94,
    impact_score: 84,
    impact_breakdown: { severity: 88, residents: 80, duration: 80, safety: 88 },
    sentiment: 'Urgent',
    photo_url: 'https://images.unsplash.com/photo-1546768292-fb12f6c92568?auto=format&fit=crop&w=600&q=80',
    created_at: new Date(now - 1.5 * hour).toISOString(),
    updated_at: new Date(now - 0.2 * hour).toISOString(),
    assigned_to: 'Rohan Sharma (Maintenance Lead)',
    assigned_at: new Date(now - 1.1 * hour).toISOString(),
    status: 'ASSIGNED',
    sla_hours: 4,
    sla_deadline: new Date(now + 2.5 * hour).toISOString(),
    sla_breached: false,
    escalation_status: 'NONE',
    ai_action_plan: {
      recommended_action: 'Contact Otis lift technician immediately and inspect Lift B motor room. Notify affected residents if downtime exceeds one hour.',
      suggested_owner: 'Rohan Sharma (Maintenance Lead)',
      suggested_sla_hours: 4,
      decision_factors: [
        'Essential building service for higher floors',
        'Elderly residents and medical requirement mentioned explicitly',
        'Issue ongoing since morning hours',
        'Lift B has recorded 5 previous breakdown events this month'
      ],
      why_urgency: [
        'Accessibility block for elderly resident on 7th floor',
        'Vertical transit cutoff for B Wing'
      ]
    },
    ai_response: 'Hi Dr. Singhal, we have expedited Lift B maintenance due to the medical urgency on the 7th floor. The Otis field technician has been dispatched with priority.',
    response_sent_at: new Date(now - 1.0 * hour).toISOString(),
    reopened: false,
    timeline: [
      {
        id: 't-008-1',
        timestamp: new Date(now - 1.5 * hour).toISOString(),
        type: 'SUBMITTED',
        title: 'Complaint submitted',
        description: 'Resident highlighted elderly heart patient on 7th floor.',
        actor: 'Dr. Ashok Singhal (B-702)'
      },
      {
        id: 't-008-2',
        timestamp: new Date(now - 1.5 * hour + 4000).toISOString(),
        type: 'TRIAGED',
        title: 'AI Triaged: HIGH Urgency (Medical / Elderly Factor)',
        description: 'AI detected vulnerable resident context and prioritized ticket.',
        actor: 'SHIKAYAT BOX AI'
      },
      {
        id: 't-008-3',
        timestamp: new Date(now - 1.1 * hour).toISOString(),
        type: 'ASSIGNED',
        title: 'Assigned to Rohan Sharma',
        description: 'Maintenance head assigned for direct Otis vendor coordination.',
        actor: 'Committee Triage'
      }
    ]
  },

  // 9. Reopened Issue (Section 37 benchmark)
  {
    id: 'c-009',
    case_id: 'WC-019',
    resident_id: 'res-a204',
    resident_name: 'Deepak Chopra',
    resident_phone: '+91 98112 33441',
    resident_flat: 'A-204',
    building: 'Greenwood Heights',
    wing: 'A Wing',
    original_message: 'Lift door was supposedly fixed yesterday but it jammed again with 3 people inside today morning! Bahut dangerous hai.',
    normalized_summary: 'Lift door recurring jam with passengers trapped inside after recent repair',
    language: 'hinglish',
    category: 'Lift',
    urgency: 'CRITICAL',
    confidence: 97,
    impact_score: 92,
    impact_breakdown: { severity: 95, residents: 85, duration: 80, safety: 98 },
    sentiment: 'Frustrated',
    created_at: new Date(now - 28 * hour).toISOString(),
    updated_at: new Date(now - 1.2 * hour).toISOString(),
    assigned_to: 'Rohan Sharma (Maintenance Lead)',
    status: 'IN_PROGRESS',
    sla_hours: 2,
    sla_deadline: new Date(now + 0.8 * hour).toISOString(),
    sla_breached: false,
    escalation_status: 'ESCALATED',
    ai_action_plan: {
      recommended_action: 'Lock out Lift A immediately. Require certified Otis inspection of mechanical door interlocks before resuming operation.',
      suggested_owner: 'Rohan Sharma (Maintenance Lead)',
      suggested_sla_hours: 2,
      decision_factors: [
        'Resident trapped inside elevator',
        'Previous repair failed within 24 hours',
        'Life safety hazard'
      ],
      why_urgency: [
        'Trap event occurred',
        'Recurrence of critical safety defect'
      ]
    },
    resident_confirmation: 'STILL_HAPPENING',
    reopened: true,
    reopened_reason: 'Resident reported door jammed again after committee marked it resolved yesterday.',
    reopened_at: new Date(now - 2.0 * hour).toISOString(),
    timeline: [
      {
        id: 't-009-1',
        timestamp: new Date(now - 28 * hour).toISOString(),
        type: 'SUBMITTED',
        title: 'Initial complaint submitted',
        description: 'Door sensor jerky.',
        actor: 'Deepak Chopra (A-204)'
      },
      {
        id: 't-009-2',
        timestamp: new Date(now - 20 * hour).toISOString(),
        type: 'RESOLVED',
        title: 'Marked resolved by vendor',
        description: 'Technician adjusted optical door sensor.',
        actor: 'Otis Tech / Rohan Sharma'
      },
      {
        id: 't-009-3',
        timestamp: new Date(now - 2.0 * hour).toISOString(),
        type: 'REOPENED',
        title: 'Issue Reopened by Resident: "Still Happening"',
        description: 'Resident verified failure. Urgency bumped from HIGH to CRITICAL. Committee notified immediately.',
        actor: 'Deepak Chopra (Resident Verification)'
      }
    ]
  },

  // 10. Ambiguous / Low Confidence (Section 17 benchmark)
  {
    id: 'c-010',
    case_id: 'WC-032',
    resident_id: 'res-c102',
    resident_name: 'Meera Sengupta',
    resident_flat: 'C-102',
    building: 'Greenwood Heights',
    wing: 'C Wing',
    original_message: 'Car parked near security gate blocked guard\'s view and access barrier.',
    normalized_summary: 'Vehicle parked adjacent to security boom barrier restricting guard sightline',
    language: 'english',
    category: 'Parking',
    urgency: 'HIGH',
    confidence: 54, // Ambiguous! Parking 54% vs Security 46%
    low_confidence_options: [
      { category: 'Parking', confidence: 54 },
      { category: 'Security', confidence: 46 }
    ],
    impact_score: 65,
    impact_breakdown: { severity: 60, residents: 60, duration: 55, safety: 75 },
    sentiment: 'Neutral',
    created_at: new Date(now - 0.8 * hour).toISOString(),
    updated_at: new Date(now - 0.8 * hour).toISOString(),
    status: 'NEW',
    sla_hours: 4,
    sla_deadline: new Date(now + 3.2 * hour).toISOString(),
    sla_breached: false,
    escalation_status: 'NONE',
    ai_action_plan: {
      recommended_action: 'Human confirmation needed: Confirm Parking or Choose Security.',
      suggested_owner: 'Sunil Patel (Security Supervisor)',
      suggested_sla_hours: 4,
      decision_factors: [
        'Complaint contains both vehicle obstruction and security barrier keywords',
        'Confidence is below 70% threshold'
      ],
      why_urgency: ['Main gate visibility compromised']
    },
    reopened: false,
    timeline: [
      {
        id: 't-010-1',
        timestamp: new Date(now - 0.8 * hour).toISOString(),
        type: 'SUBMITTED',
        title: 'Complaint submitted (Ambiguous Classification)',
        description: 'Resident reported vehicle near gate. AI flagged low confidence for committee override.',
        actor: 'Meera Sengupta (C-102)'
      }
    ]
  },

  // 11. Parking conflict (Basement slot blocked)
  {
    id: 'c-011',
    case_id: 'WC-033',
    resident_id: 'res-a304',
    resident_name: 'Vikram Joshi',
    resident_flat: 'A-304',
    building: 'Greenwood Heights',
    wing: 'A Wing',
    original_message: 'Parking slot A-42 mein kisi ne white Fortuner park kar di hai. I am unable to park my car after returning from hospital.',
    normalized_summary: 'Unauthorized SUV parked in allotted slot A-42',
    language: 'hinglish',
    category: 'Parking',
    urgency: 'HIGH',
    confidence: 96,
    impact_score: 68,
    impact_breakdown: { severity: 70, residents: 40, duration: 60, safety: 40 },
    sentiment: 'Frustrated',
    created_at: new Date(now - 1.1 * hour).toISOString(),
    updated_at: new Date(now - 1.1 * hour).toISOString(),
    status: 'NEW',
    sla_hours: 2,
    sla_deadline: new Date(now + 0.9 * hour).toISOString(),
    sla_breached: false,
    escalation_status: 'NONE',
    ai_action_plan: {
      recommended_action: 'Cross-reference vehicle registration with MyGate database and request driver to vacate immediately.',
      suggested_owner: 'Sunil Patel (Security Supervisor)',
      suggested_sla_hours: 2,
      decision_factors: ['Direct resident property infringement', 'Returning from hospital context'],
      why_urgency: ['Resident stranded without parking access']
    },
    reopened: false,
    timeline: [
      {
        id: 't-011-1',
        timestamp: new Date(now - 1.1 * hour).toISOString(),
        type: 'SUBMITTED',
        title: 'Complaint submitted',
        description: 'Unauthorized car in slot A-42.',
        actor: 'Vikram Joshi (A-304)'
      }
    ]
  },

  // 12. Security: Main Gate left open at night
  {
    id: 'c-012',
    case_id: 'WC-034',
    resident_id: 'res-d101',
    resident_name: 'Col. Ranjit Roy',
    resident_flat: 'D-101',
    building: 'Greenwood Heights',
    wing: 'D Wing',
    original_message: 'Security gate has been left open with no guard stationed at rear perimeter entrance.',
    normalized_summary: 'Rear security gate unmanned and open during night shift',
    language: 'english',
    category: 'Security',
    urgency: 'HIGH',
    confidence: 95,
    impact_score: 82,
    impact_breakdown: { severity: 85, residents: 90, duration: 60, safety: 95 },
    sentiment: 'Urgent',
    created_at: new Date(now - 2.8 * hour).toISOString(),
    updated_at: new Date(now - 1.4 * hour).toISOString(),
    assigned_to: 'Sunil Patel (Security Supervisor)',
    status: 'IN_PROGRESS',
    sla_hours: 2,
    sla_deadline: new Date(now - 0.8 * hour).toISOString(),
    sla_breached: true,
    escalation_status: 'ESCALATED',
    ai_action_plan: {
      recommended_action: 'Instruct security agency supervisor to reposition relief guard immediately and conduct gate audit.',
      suggested_owner: 'Sunil Patel (Security Supervisor)',
      suggested_sla_hours: 2,
      decision_factors: ['Perimeter breach risk', 'Uncontrolled outsider entry possibility'],
      why_urgency: ['Society safety protocol breach']
    },
    reopened: false,
    timeline: [
      {
        id: 't-012-1',
        timestamp: new Date(now - 2.8 * hour).toISOString(),
        type: 'SUBMITTED',
        title: 'Complaint submitted',
        description: 'Rear gate unmanned.',
        actor: 'Col. Ranjit Roy (D-101)'
      },
      {
        id: 't-012-2',
        timestamp: new Date(now - 0.8 * hour).toISOString(),
        type: 'ESCALATED',
        title: 'SLA Breached — Escalated to Security In-charge',
        description: 'Auto escalated due to overdue 2h security SLA.',
        actor: 'SHIKAYAT BOX SLA Monitor'
      }
    ]
  },

  // 13. Cleaning: Garbage accumulation
  {
    id: 'c-013',
    case_id: 'WC-035',
    resident_id: 'res-c303',
    resident_name: 'Shalini Gupta',
    resident_flat: 'C-303',
    building: 'Greenwood Heights',
    wing: 'C Wing',
    original_message: 'Cleaning has not happened for 3 days on 3rd floor corridor. Kachra aur bad smell aa rahi hai.',
    normalized_summary: 'Uncollected garbage and foul odor on C Wing 3rd floor corridor for 3 days',
    language: 'hinglish',
    category: 'Cleaning',
    urgency: 'MEDIUM',
    confidence: 96,
    impact_score: 58,
    impact_breakdown: { severity: 60, residents: 55, duration: 80, safety: 45 },
    sentiment: 'Frustrated',
    created_at: new Date(now - 5.0 * hour).toISOString(),
    updated_at: new Date(now - 1.0 * hour).toISOString(),
    assigned_to: 'Asha Verma (Housekeeping Lead)',
    status: 'IN_PROGRESS',
    sla_hours: 12,
    sla_deadline: new Date(now + 7.0 * hour).toISOString(),
    sla_breached: false,
    escalation_status: 'NONE',
    ai_action_plan: {
      recommended_action: 'Direct floor supervisor to clear 3rd floor bins and mop corridor with disinfectant.',
      suggested_owner: 'Asha Verma (Housekeeping Lead)',
      suggested_sla_hours: 12,
      decision_factors: ['Sanitation issue spanning multiple days', 'Stink complaints'],
      why_urgency: ['Corridor hygiene']
    },
    reopened: false,
    timeline: [
      {
        id: 't-013-1',
        timestamp: new Date(now - 5.0 * hour).toISOString(),
        type: 'SUBMITTED',
        title: 'Complaint submitted',
        description: 'Corridor cleanliness neglected.',
        actor: 'Shalini Gupta (C-303)'
      }
    ]
  },

  // 14. Noise issue
  {
    id: 'c-014',
    case_id: 'WC-036',
    resident_id: 'res-d402',
    resident_name: 'Gaurav Khanna',
    resident_flat: 'D-402',
    building: 'Greenwood Heights',
    wing: 'D Wing',
    original_message: 'Excessive loud music and drilling after 11 PM from flat above.',
    normalized_summary: 'Late night drilling and loud music noise violation past 11 PM',
    language: 'english',
    category: 'Noise',
    urgency: 'MEDIUM',
    confidence: 94,
    impact_score: 52,
    impact_breakdown: { severity: 55, residents: 50, duration: 40, safety: 30 },
    sentiment: 'Concerned',
    created_at: new Date(now - 9.0 * hour).toISOString(),
    updated_at: new Date(now - 9.0 * hour).toISOString(),
    status: 'NEW',
    sla_hours: 12,
    sla_deadline: new Date(now + 3.0 * hour).toISOString(),
    sla_breached: false,
    escalation_status: 'NONE',
    ai_action_plan: {
      recommended_action: 'Issue formal reminder regarding society quiet hours (10 PM - 7 AM).',
      suggested_owner: 'Priya Nair (Secretary)',
      suggested_sla_hours: 12,
      decision_factors: ['Violation of society bye-laws for quiet hours'],
      why_urgency: ['Disturbance to neighbors']
    },
    reopened: false,
    timeline: [
      {
        id: 't-014-1',
        timestamp: new Date(now - 9.0 * hour).toISOString(),
        type: 'SUBMITTED',
        title: 'Complaint submitted',
        description: 'Night noise disturbance.',
        actor: 'Gaurav Khanna (D-402)'
      }
    ]
  },

  // 15. Electricity: Corridor lights fluctuating
  {
    id: 'c-015',
    case_id: 'WC-037',
    resident_id: 'res-c401',
    resident_name: 'Tanvi Shah',
    resident_flat: 'C-401',
    building: 'Greenwood Heights',
    wing: 'C Wing',
    original_message: 'Corridor lights fluctuating rapidly and mild burning smell near MCB box.',
    normalized_summary: 'Voltage fluctuation and burning smell near corridor MCB distribution panel',
    language: 'english',
    category: 'Electricity',
    urgency: 'CRITICAL',
    confidence: 96,
    impact_score: 89,
    impact_breakdown: { severity: 92, residents: 75, duration: 60, safety: 98 },
    sentiment: 'Urgent',
    created_at: new Date(now - 0.4 * hour).toISOString(),
    updated_at: new Date(now - 0.1 * hour).toISOString(),
    assigned_to: 'Rohan Sharma (Maintenance Lead)',
    status: 'IN_PROGRESS',
    sla_hours: 1,
    sla_deadline: new Date(now + 0.6 * hour).toISOString(),
    sla_breached: false,
    escalation_status: 'NONE',
    ai_action_plan: {
      recommended_action: 'Emergency electrician dispatch. Isolate phase and inspect breaker terminals for loose arching connection.',
      suggested_owner: 'Rohan Sharma (Maintenance Lead)',
      suggested_sla_hours: 1,
      decision_factors: ['Burning smell indicates overheating insulation or electrical arc', 'Critical fire hazard'],
      why_urgency: ['Immediate electrical safety hazard']
    },
    reopened: false,
    timeline: [
      {
        id: 't-015-1',
        timestamp: new Date(now - 0.4 * hour).toISOString(),
        type: 'SUBMITTED',
        title: 'Complaint submitted',
        description: 'Burning smell and lighting flicker.',
        actor: 'Tanvi Shah (C-401)'
      }
    ]
  },

  // 16. Resolved Issue with Before/After Evidence (Section 36 benchmark)
  {
    id: 'c-016',
    case_id: 'WC-012',
    resident_id: 'res-a102',
    resident_name: 'Aditya Kapoor',
    resident_flat: 'A-102',
    building: 'Greenwood Heights',
    wing: 'A Wing',
    original_message: 'Basement A pipe joint was gushing water onto walkway.',
    normalized_summary: 'Basement drainage pipeline joint fracture spraying water on walkway',
    language: 'english',
    category: 'Water',
    urgency: 'HIGH',
    confidence: 96,
    impact_score: 72,
    impact_breakdown: { severity: 75, residents: 65, duration: 70, safety: 70 },
    sentiment: 'Frustrated',
    created_at: new Date(now - 48 * hour).toISOString(),
    updated_at: new Date(now - 12 * hour).toISOString(),
    assigned_to: 'Rohan Sharma (Maintenance Lead)',
    status: 'RESOLVED',
    sla_hours: 4,
    sla_deadline: new Date(now - 44 * hour).toISOString(),
    sla_breached: false,
    escalation_status: 'NONE',
    ai_action_plan: {
      recommended_action: 'Replace fractured 2-inch PVC coupling and install new gasket.',
      suggested_owner: 'Rohan Sharma (Maintenance Lead)',
      suggested_sla_hours: 4,
      decision_factors: ['Basement flooding risk'],
      why_urgency: ['Water conservation and slip hazard']
    },
    resolution_notes: 'Replaced cracked 2-inch PVC coupler and pressure-tested the line for 30 minutes with zero leaks.',
    resolution_before_photo: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80',
    resolution_after_photo: 'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=600&q=80',
    evidence_relevance_score: 91, // Section 36 requirement: AI evidence relevance 91%!
    resolved_at: new Date(now - 12 * hour).toISOString(),
    resident_confirmation: 'RESOLVED_CONFIRMED',
    reopened: false,
    timeline: [
      {
        id: 't-016-1',
        timestamp: new Date(now - 48 * hour).toISOString(),
        type: 'SUBMITTED',
        title: 'Complaint submitted',
        description: 'Pipe spraying in basement.',
        actor: 'Aditya Kapoor (A-102)'
      },
      {
        id: 't-016-2',
        timestamp: new Date(now - 46 * hour).toISOString(),
        type: 'EVIDENCE_UPLOADED',
        title: 'Resolution Evidence Uploaded & Verified',
        description: 'Plumber uploaded repair photo. AI evidence match confirmed 91% relevance.',
        actor: 'Rohan Sharma (Maintenance Lead)'
      },
      {
        id: 't-016-3',
        timestamp: new Date(now - 45 * hour).toISOString(),
        type: 'RESOLVED',
        title: 'Marked RESOLVED by Committee',
        description: 'Leak successfully arrested.',
        actor: 'Rohan Sharma'
      },
      {
        id: 't-016-4',
        timestamp: new Date(now - 12 * hour).toISOString(),
        type: 'CONFIRMED',
        title: 'Resident Verified: "Yes, Resolved"',
        description: 'Resident confirmed repair via tracking link with 5-star satisfaction.',
        actor: 'Aditya Kapoor (A-102)'
      }
    ]
  },

  // 17. Resolved: Stray dogs entering through broken fence
  {
    id: 'c-017',
    case_id: 'WC-015',
    resident_id: 'res-d202',
    resident_name: 'Pooja Bhatt',
    resident_flat: 'D-202',
    building: 'Greenwood Heights',
    wing: 'D Wing',
    original_message: 'Garden fence wire was broken and street dogs were entering kids play area.',
    normalized_summary: 'Damaged perimeter wire netting allowing stray animals into children play park',
    language: 'english',
    category: 'Security',
    urgency: 'MEDIUM',
    confidence: 92,
    impact_score: 55,
    impact_breakdown: { severity: 60, residents: 50, duration: 50, safety: 70 },
    sentiment: 'Concerned',
    created_at: new Date(now - 72 * hour).toISOString(),
    updated_at: new Date(now - 30 * hour).toISOString(),
    assigned_to: 'Sunil Patel (Security Supervisor)',
    status: 'RESOLVED',
    sla_hours: 24,
    sla_deadline: new Date(now - 48 * hour).toISOString(),
    sla_breached: false,
    escalation_status: 'NONE',
    ai_action_plan: {
      recommended_action: 'Patch chainlink fence and weld steel braces.',
      suggested_owner: 'Sunil Patel (Security Supervisor)',
      suggested_sla_hours: 24,
      decision_factors: ['Children park safety'],
      why_urgency: ['Child safety']
    },
    resolution_notes: 'Installed heavy gauge wire mesh along 15 feet section and reinforced gate latch.',
    resolved_at: new Date(now - 30 * hour).toISOString(),
    resident_confirmation: 'RESOLVED_CONFIRMED',
    reopened: false,
    timeline: [
      {
        id: 't-017-1',
        timestamp: new Date(now - 72 * hour).toISOString(),
        type: 'SUBMITTED',
        title: 'Submitted by resident',
        description: 'Broken wire mesh reported.',
        actor: 'Pooja Bhatt (D-202)'
      },
      {
        id: 't-017-2',
        timestamp: new Date(now - 30 * hour).toISOString(),
        type: 'RESOLVED',
        title: 'Resolved with mesh repair',
        description: 'Welded and reinforced.',
        actor: 'Sunil Patel'
      }
    ]
  }
];

export const INITIAL_MASTER_ISSUES: MasterIssue[] = [
  {
    id: 'master-water-b',
    master_case_id: 'WC-M024',
    title: 'Water supply disruption — B Wing',
    category: 'Water',
    urgency: 'HIGH',
    impact_score: 78,
    affected_flats_count: 23,
    affected_locations: ['B Wing (Flats B-104, B-203, B-302, B-402, B-504, B-601, B-701)'],
    child_complaint_ids: ['c-001', 'c-002', 'c-003', 'c-004', 'c-005', 'c-006', 'c-007'],
    first_reported_at: new Date(now - 4.1 * hour).toISOString(),
    latest_report_at: new Date(now - 2.2 * hour).toISOString(),
    assigned_to: 'Rohan Sharma (Maintenance Lead)',
    status: 'IN_PROGRESS',
    sla_deadline: new Date(now + 1.8 * hour).toISOString(),
    created_at: new Date(now - 2.0 * hour).toISOString(),
    recommended_action: 'Inspect B Wing riser line pressure, check booster motor breaker, and bleed air from upper floor manifolds.'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-001',
    type: 'CRITICAL',
    title: 'Critical complaint received',
    message: 'WC-024 (B-402): Water leakage near electric meter in B Wing.',
    complaint_id: 'c-001',
    case_id: 'WC-024',
    timestamp: new Date(now - 2.2 * hour).toISOString(),
    read: false,
    urgency: 'CRITICAL'
  },
  {
    id: 'n-002',
    type: 'DUPLICATE',
    title: 'Similar complaints detected',
    message: '7 related complaints detected for Water in B Wing. Ready to merge.',
    complaint_id: 'c-001',
    case_id: 'WC-M024',
    timestamp: new Date(now - 2.0 * hour).toISOString(),
    read: false,
    urgency: 'HIGH'
  },
  {
    id: 'n-003',
    type: 'SLA_RISK',
    title: 'SLA Breached / Approaching target',
    message: 'WC-027 (7th Floor Water Outage) has passed target deadline.',
    complaint_id: 'c-004',
    case_id: 'WC-027',
    timestamp: new Date(now - 0.1 * hour).toISOString(),
    read: false,
    urgency: 'HIGH'
  },
  {
    id: 'n-004',
    type: 'REOPENED',
    title: 'Resident reopened issue',
    message: 'WC-019: Resident reported Lift door jammed again with people inside!',
    complaint_id: 'c-009',
    case_id: 'WC-019',
    timestamp: new Date(now - 2.0 * hour).toISOString(),
    read: false,
    urgency: 'CRITICAL'
  },
  {
    id: 'n-005',
    type: 'CONFIRMED',
    title: 'Resident confirmed resolution',
    message: 'WC-012 (Basement pipe leak) verified fixed by Aditya Kapoor.',
    complaint_id: 'c-016',
    case_id: 'WC-012',
    timestamp: new Date(now - 12 * hour).toISOString(),
    read: true,
    urgency: 'LOW'
  }
];

export const ROOT_CAUSE_INSIGHTS: RootCauseInsight[] = [
  {
    id: 'rc-001',
    category: 'Water',
    wing: 'B Wing',
    headline: 'Water complaints increased 31% this week.',
    percentage_increase: 31,
    percentage_wing: 68,
    related_count: 7,
    recommendation: 'Inspect B Wing supply line and overhead booster tank manifold.',
    action_label: 'Create Maintenance Task'
  }
];

export const PREVENTIVE_INSIGHTS: PreventiveInsight[] = [
  {
    id: 'prev-001',
    equipment: 'Lift B',
    complaint_count: 5,
    days_window: 14,
    message: 'Lift B has experienced 5 complaints in 14 days. Consider scheduling comprehensive cable & motor inspection before another failure occurs.',
    action_label: 'Schedule Otis Inspection'
  }
];
