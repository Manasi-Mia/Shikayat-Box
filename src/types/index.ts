export type Category = 
  | 'Water' 
  | 'Lift' 
  | 'Parking' 
  | 'Cleaning' 
  | 'Security' 
  | 'Noise' 
  | 'Electricity' 
  | 'Other';

export type Urgency = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type Status = 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';

export type Language = 'english' | 'hindi' | 'hinglish' | 'other';

export type ResidentConfirmation = 'PENDING' | 'RESOLVED_CONFIRMED' | 'STILL_HAPPENING';

export type EscalationStatus = 'NONE' | 'SUGGESTED' | 'ESCALATED';

export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: 'SUBMITTED' | 'TRIAGED' | 'ASSIGNED' | 'STATUS_CHANGE' | 'ESCALATED' | 'RESPONSE_SENT' | 'EVIDENCE_UPLOADED' | 'RESOLVED' | 'REOPENED' | 'CONFIRMED' | 'MERGED';
  title: string;
  description: string;
  actor: string;
}

export interface ImpactBreakdown {
  severity: number;    // 0 - 100
  residents: number;   // 0 - 100
  duration: number;    // 0 - 100
  safety: number;      // 0 - 100
}

export interface AIActionPlan {
  recommended_action: string;
  suggested_owner: string;
  suggested_sla_hours: number;
  decision_factors: string[];
  why_urgency: string[];
}

export interface Complaint {
  id: string;
  case_id: string;                  // e.g. WC-024
  resident_id: string;
  resident_name: string;
  resident_phone?: string;
  resident_flat: string;             // e.g. B-402
  building: string;                 // e.g. Greenwood Heights
  wing: string;                     // e.g. B Wing
  location_detail?: string;
  
  original_message: string;
  normalized_summary: string;
  language: Language;
  
  category: Category;
  urgency: Urgency;
  confidence: number;               // 0 - 100
  low_confidence_options?: { category: Category; confidence: number }[];
  
  impact_score: number;             // 0 - 100
  impact_breakdown: ImpactBreakdown;
  sentiment: 'Concerned' | 'Frustrated' | 'Neutral' | 'Urgent';
  
  photo_url?: string;
  
  created_at: string;
  updated_at: string;
  
  assigned_to?: string | null;      // e.g. 'Rohan Sharma (Maintenance)'
  assigned_at?: string | null;
  status: Status;
  
  sla_hours: number;
  sla_deadline: string;             // ISO string
  sla_breached: boolean;
  escalation_status: EscalationStatus;
  
  duplicate_group_id?: string | null;
  master_issue_id?: string | null;
  duplicate_confidence?: number | null;
  similar_complaint_ids?: string[];
  
  ai_action_plan: AIActionPlan;
  ai_response?: string;
  response_sent_at?: string | null;
  
  resolution_notes?: string | null;
  resolution_before_photo?: string | null;
  resolution_after_photo?: string | null;
  evidence_relevance_score?: number | null; // e.g. 91%
  resolved_at?: string | null;
  
  resident_confirmation?: ResidentConfirmation | null;
  reopened: boolean;
  reopened_reason?: string | null;
  reopened_at?: string | null;
  
  timeline: TimelineEvent[];
}

export interface MasterIssue {
  id: string;
  master_case_id: string;           // e.g. WC-M024
  title: string;
  category: Category;
  urgency: Urgency;
  impact_score: number;
  affected_flats_count: number;
  affected_locations: string[];
  child_complaint_ids: string[];
  first_reported_at: string;
  latest_report_at: string;
  assigned_to?: string | null;
  status: Status;
  sla_deadline: string;
  created_at: string;
  recommended_action: string;
}

export interface NotificationItem {
  id: string;
  type: 'CRITICAL' | 'SLA_RISK' | 'DUPLICATE' | 'ASSIGNED' | 'CONFIRMED' | 'REOPENED';
  title: string;
  message: string;
  complaint_id?: string;
  case_id?: string;
  timestamp: string;
  read: boolean;
  urgency: Urgency;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'resident' | 'committee' | 'admin';
  flat?: string;
  wing?: string;
  avatar?: string;
  title?: string;
}

export interface RootCauseInsight {
  id: string;
  category: Category;
  wing: string;
  headline: string;
  percentage_increase: number;
  percentage_wing: number;
  related_count: number;
  recommendation: string;
  action_label: string;
}

export interface PreventiveInsight {
  id: string;
  equipment: string;
  complaint_count: number;
  days_window: number;
  message: string;
  action_label: string;
}
