import { Complaint, MasterIssue, Category, Urgency } from '../types';

export interface DuplicateClusterSuggestion {
  master_title: string;
  category: Category;
  urgency: Urgency;
  confidence: number;
  complaint_ids: string[];
  complaints: Complaint[];
  affected_flats: string[];
  affected_flats_count: number;
  suggested_action: string;
  existing_master_id?: string;
}

export function detectDuplicateClusters(complaints: Complaint[]): DuplicateClusterSuggestion[] {
  const suggestions: DuplicateClusterSuggestion[] = [];
  
  // Group non-resolved complaints by Category and Wing
  const groups: Record<string, Complaint[]> = {};
  
  for (const c of complaints) {
    if (c.status === 'RESOLVED') continue;
    const key = `${c.category}_${c.wing}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(c);
  }

  for (const [key, list] of Object.entries(groups)) {
    if (list.length >= 2) {
      const [categoryStr, ...wingParts] = key.split('_');
      const category = categoryStr as Category;
      const wing = wingParts.join('_');
      
      const uniqueFlats = Array.from(new Set(list.map(c => c.resident_flat)));
      const hasCritical = list.some(c => c.urgency === 'CRITICAL');
      const hasHigh = list.some(c => c.urgency === 'HIGH');
      const urgency: Urgency = hasCritical ? 'CRITICAL' : hasHigh ? 'HIGH' : 'MEDIUM';

      // Check if any complaint already belongs to a master issue
      const existingMasterId = list.find(c => c.master_issue_id)?.master_issue_id || undefined;

      suggestions.push({
        master_title: `${category} supply disruption — ${wing}`,
        category,
        urgency,
        confidence: Math.min(98, 80 + list.length * 4),
        complaint_ids: list.map(c => c.id),
        complaints: list,
        affected_flats: uniqueFlats,
        affected_flats_count: Math.max(uniqueFlats.length, 12 + list.length * 2), // realistic society estimation
        suggested_action: `Consolidate ${list.length} reports into unified task for ${wing} maintenance inspection.`,
        existing_master_id: existingMasterId
      });
    }
  }

  return suggestions;
}

export function createMasterIssueFromComplaints(
  masterCaseId: string,
  title: string,
  complaints: Complaint[]
): MasterIssue {
  const category = complaints[0]?.category || 'Water';
  const hasCritical = complaints.some(c => c.urgency === 'CRITICAL');
  const hasHigh = complaints.some(c => c.urgency === 'HIGH');
  const urgency: Urgency = hasCritical ? 'CRITICAL' : hasHigh ? 'HIGH' : 'MEDIUM';
  
  const flats = Array.from(new Set(complaints.map(c => c.resident_flat)));
  const locations = Array.from(new Set(complaints.map(c => c.wing)));
  
  const timestamps = complaints.map(c => new Date(c.created_at).getTime());
  const minTime = new Date(Math.min(...timestamps)).toISOString();
  const maxTime = new Date(Math.max(...timestamps)).toISOString();

  // Average impact score + bonus for multi-flat impact
  const avgImpact = Math.round(
    complaints.reduce((acc, c) => acc + c.impact_score, 0) / complaints.length
  );
  const compositeImpact = Math.min(99, avgImpact + Math.round(complaints.length * 3));

  // Determine earliest SLA
  const slaDeadlines = complaints.map(c => new Date(c.sla_deadline).getTime());
  const earliestSla = new Date(Math.min(...slaDeadlines)).toISOString();

  return {
    id: `master-${Date.now()}`,
    master_case_id: masterCaseId,
    title,
    category,
    urgency,
    impact_score: compositeImpact,
    affected_flats_count: Math.max(flats.length, 18),
    affected_locations: locations,
    child_complaint_ids: complaints.map(c => c.id),
    first_reported_at: minTime,
    latest_report_at: maxTime,
    assigned_to: complaints.find(c => c.assigned_to)?.assigned_to || 'Rohan Sharma (Maintenance Lead)',
    status: 'IN_PROGRESS',
    sla_deadline: earliestSla,
    created_at: new Date().toISOString(),
    recommended_action: `System-level diagnosis of ${category.toLowerCase()} line in ${locations.join(', ')}.`
  };
}
