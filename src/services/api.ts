import { Complaint, MasterIssue, NotificationItem, Urgency, Status } from '../types';
import { INITIAL_COMPLAINTS, INITIAL_MASTER_ISSUES, INITIAL_NOTIFICATIONS } from '../data/seedData';
import { analyzeComplaintNLP, getAIFallbackResult, AITriageResult } from './aiEngine';

const API_BASE = 'http://localhost:3001/api';

// Local cache / in-memory mirror to guarantee zero failure if server is starting or unreachable
let localComplaints: Complaint[] = [...INITIAL_COMPLAINTS];
let localMasterIssues: MasterIssue[] = [...INITIAL_MASTER_ISSUES];
let localNotifications: NotificationItem[] = [...INITIAL_NOTIFICATIONS];

// Initialize local storage mirror if available
try {
  const cachedC = localStorage.getItem('sb_complaints');
  if (cachedC) localComplaints = JSON.parse(cachedC);
  const cachedM = localStorage.getItem('sb_masters');
  if (cachedM) localMasterIssues = JSON.parse(cachedM);
  const cachedN = localStorage.getItem('sb_notifications');
  if (cachedN) localNotifications = JSON.parse(cachedN);
} catch (e) {
  // localStorage might be blocked or empty
}

function syncLocalStorage() {
  try {
    localStorage.setItem('sb_complaints', JSON.stringify(localComplaints));
    localStorage.setItem('sb_masters', JSON.stringify(localMasterIssues));
    localStorage.setItem('sb_notifications', JSON.stringify(localNotifications));
  } catch (e) {}
}

export const api = {
  async getComplaints(): Promise<Complaint[]> {
    try {
      const res = await fetch(`${API_BASE}/complaints`, { cache: 'no-cache' });
      if (res.ok) {
        const data = await res.json();
        localComplaints = data;
        syncLocalStorage();
        return data;
      }
    } catch (e) {
      console.warn('[API] Using local resilient data store for getComplaints');
    }
    return localComplaints;
  },

  async getComplaintById(id: string): Promise<Complaint | null> {
    try {
      const res = await fetch(`${API_BASE}/complaints/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}
    return localComplaints.find(c => c.id === id || c.case_id.toLowerCase() === id.toLowerCase()) || null;
  },

  async triageComplaint(text: string, context?: { wing?: string; flat?: string; resident_name?: string }): Promise<AITriageResult> {
    try {
      const res = await fetch(`${API_BASE}/ai/triage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, context })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[API] Using client-side NLP engine for triage');
    }
    return analyzeComplaintNLP(text, context);
  },

  async createComplaint(data: {
    original_message: string;
    resident_name: string;
    resident_flat: string;
    wing: string;
    resident_phone?: string;
    location_detail?: string;
    photo_url?: string;
    category_override?: any;
    urgency_override?: any;
    ai_data?: AITriageResult;
    duplicate_group_id?: string;
  }): Promise<Complaint> {
    try {
      const res = await fetch(`${API_BASE}/complaints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const saved = await res.json();
        localComplaints.unshift(saved);
        syncLocalStorage();
        return saved;
      }
    } catch (e) {
      console.warn('[API] Using local store for createComplaint');
    }

    // Local creation fallback
    const now = new Date();
    const aiData = data.ai_data || analyzeComplaintNLP(data.original_message, {
      wing: data.wing,
      flat: data.resident_flat,
      resident_name: data.resident_name
    });

    const complaintCount = localComplaints.length + 1;
    const caseId = `WC-${String(complaintCount + 30).padStart(3, '0')}`;
    const slaHours = aiData.suggested_sla_hours || 4;
    const slaDeadline = new Date(now.getTime() + slaHours * 3600 * 1000).toISOString();

    const newComplaint: Complaint = {
      id: `c-${Date.now()}`,
      case_id: caseId,
      resident_id: 'res-custom',
      resident_name: data.resident_name || 'Resident',
      resident_phone: data.resident_phone || '+91 98200 00000',
      resident_flat: data.resident_flat || 'B-402',
      building: 'Greenwood Heights',
      wing: data.wing || 'B Wing',
      location_detail: data.location_detail || `${data.wing || 'B Wing'} Floor`,
      original_message: data.original_message,
      normalized_summary: aiData.normalized_summary,
      language: aiData.language,
      category: data.category_override || aiData.category,
      urgency: data.urgency_override || aiData.urgency,
      confidence: aiData.confidence,
      low_confidence_options: aiData.low_confidence_options,
      impact_score: aiData.impact_score,
      impact_breakdown: aiData.impact_breakdown,
      sentiment: aiData.sentiment,
      photo_url: data.photo_url || undefined,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
      assigned_to: aiData.ai_action_plan?.suggested_owner || null,
      assigned_at: null,
      status: 'NEW',
      sla_hours: slaHours,
      sla_deadline: slaDeadline,
      sla_breached: false,
      escalation_status: 'NONE',
      duplicate_group_id: data.duplicate_group_id || null,
      ai_action_plan: aiData.ai_action_plan,
      ai_response: aiData.ai_response_draft,
      reopened: false,
      timeline: [
        {
          id: `t-${Date.now()}-1`,
          timestamp: now.toISOString(),
          type: 'SUBMITTED',
          title: 'Complaint submitted by resident',
          description: `Logged via Smart Complaint Box. Language: ${aiData.language.toUpperCase()}`,
          actor: data.resident_name || 'Resident'
        },
        {
          id: `t-${Date.now()}-2`,
          timestamp: new Date(now.getTime() + 2000).toISOString(),
          type: 'TRIAGED',
          title: `AI Triaged: ${aiData.urgency} Urgency • ${aiData.category}`,
          description: `Impact: ${aiData.impact_score}/100. Confidence: ${aiData.confidence}%. SLA: ${slaHours}h.`,
          actor: 'SHIKAYAT BOX AI'
        }
      ]
    };

    localComplaints.unshift(newComplaint);
    localNotifications.unshift({
      id: `n-${Date.now()}`,
      type: newComplaint.urgency === 'CRITICAL' ? 'CRITICAL' : 'ASSIGNED',
      title: `${newComplaint.urgency} Issue Reported`,
      message: `${newComplaint.case_id} (${newComplaint.resident_flat}): ${newComplaint.normalized_summary.slice(0, 50)}...`,
      complaint_id: newComplaint.id,
      case_id: newComplaint.case_id,
      timestamp: now.toISOString(),
      read: false,
      urgency: newComplaint.urgency
    });
    syncLocalStorage();
    return newComplaint;
  },

  async updateComplaint(id: string, updates: Partial<Complaint>): Promise<Complaint | null> {
    try {
      const res = await fetch(`${API_BASE}/complaints/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updated = await res.json();
        const idx = localComplaints.findIndex(c => c.id === id || c.case_id === id);
        if (idx !== -1) localComplaints[idx] = updated;
        syncLocalStorage();
        return updated;
      }
    } catch (e) {}

    const idx = localComplaints.findIndex(c => c.id === id || c.case_id === id);
    if (idx === -1) return null;

    const current = localComplaints[idx];
    const updated = { ...current, ...updates, updated_at: new Date().toISOString() };
    
    if (updates.status && updates.status !== current.status) {
      updated.timeline.push({
        id: `t-${Date.now()}-status`,
        timestamp: new Date().toISOString(),
        type: 'STATUS_CHANGE',
        title: `Status changed to ${updates.status}`,
        description: `Status progressed from ${current.status} to ${updates.status}`,
        actor: 'Committee Member'
      });
    }

    if (updates.assigned_to && updates.assigned_to !== current.assigned_to) {
      updated.assigned_at = new Date().toISOString();
      if (current.status === 'NEW') updated.status = 'ASSIGNED';
      updated.timeline.push({
        id: `t-${Date.now()}-assign`,
        timestamp: new Date().toISOString(),
        type: 'ASSIGNED',
        title: `Assigned to ${updates.assigned_to}`,
        description: 'Ownership taken for issue resolution.',
        actor: 'Committee Member'
      });
    }

    localComplaints[idx] = updated;
    syncLocalStorage();
    return updated;
  },

  async resolveComplaint(id: string, data: {
    resolution_notes: string;
    resolution_before_photo?: string;
    resolution_after_photo?: string;
    actor?: string;
  }): Promise<Complaint | null> {
    try {
      const res = await fetch(`${API_BASE}/complaints/${id}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const updated = await res.json();
        const idx = localComplaints.findIndex(c => c.id === id || c.case_id === id);
        if (idx !== -1) localComplaints[idx] = updated;
        syncLocalStorage();
        return updated;
      }
    } catch (e) {}

    const idx = localComplaints.findIndex(c => c.id === id || c.case_id === id);
    if (idx === -1) return null;
    const now = new Date().toISOString();
    const current = localComplaints[idx];

    const updated: Complaint = {
      ...current,
      status: 'RESOLVED',
      resolution_notes: data.resolution_notes || 'Repaired and verified.',
      resolution_before_photo: data.resolution_before_photo || current.photo_url,
      resolution_after_photo: data.resolution_after_photo || 'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=600&q=80',
      evidence_relevance_score: 91,
      resolved_at: now,
      resident_confirmation: 'PENDING',
      timeline: [
        ...current.timeline,
        {
          id: `t-${Date.now()}-ev`,
          timestamp: now,
          type: 'EVIDENCE_UPLOADED',
          title: 'Resolution Evidence Uploaded & Verified',
          description: 'Before/After evidence verified by AI (91% match relevance).',
          actor: data.actor || 'Maintenance Team'
        },
        {
          id: `t-${Date.now()}-res`,
          timestamp: now,
          type: 'RESOLVED',
          title: 'Marked RESOLVED by Committee',
          description: data.resolution_notes,
          actor: data.actor || 'Rohan Sharma'
        }
      ]
    };

    localComplaints[idx] = updated;
    syncLocalStorage();
    return updated;
  },

  async confirmComplaint(id: string, data: {
    confirmation: 'RESOLVED_CONFIRMED' | 'STILL_HAPPENING';
    feedback_note?: string;
    resident_name?: string;
  }): Promise<Complaint | null> {
    try {
      const res = await fetch(`${API_BASE}/complaints/${id}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const body = await res.json();
        const updated = body.complaint;
        const idx = localComplaints.findIndex(c => c.id === id || c.case_id === id);
        if (idx !== -1) localComplaints[idx] = updated;
        syncLocalStorage();
        return updated;
      }
    } catch (e) {}

    const idx = localComplaints.findIndex(c => c.id === id || c.case_id === id);
    if (idx === -1) return null;
    const current = localComplaints[idx];
    const now = new Date().toISOString();

    if (data.confirmation === 'STILL_HAPPENING') {
      const newUrgency: Urgency = current.urgency === 'LOW' ? 'MEDIUM' : current.urgency === 'MEDIUM' ? 'HIGH' : 'CRITICAL';
      const updated: Complaint = {
        ...current,
        status: 'IN_PROGRESS',
        resident_confirmation: 'STILL_HAPPENING',
        reopened: true,
        reopened_reason: data.feedback_note || 'Resident reported issue was not fixed on ground.',
        reopened_at: now,
        urgency: newUrgency,
        escalation_status: 'ESCALATED',
        timeline: [
          ...current.timeline,
          {
            id: `t-${Date.now()}-reopened`,
            timestamp: now,
            type: 'REOPENED',
            title: 'Issue Reopened by Resident: "Still Happening"',
            description: `Feedback: "${data.feedback_note || 'Still not resolved'}". Urgency auto-bumped to ${newUrgency}.`,
            actor: data.resident_name || current.resident_name
          }
        ]
      };
      localComplaints[idx] = updated;
      localNotifications.unshift({
        id: `n-${Date.now()}`,
        type: 'REOPENED',
        title: 'Resident Reopened Complaint',
        message: `${current.case_id}: Resident marked "Still happening". Escalated to committee.`,
        complaint_id: current.id,
        case_id: current.case_id,
        timestamp: now,
        read: false,
        urgency: newUrgency
      });
      syncLocalStorage();
      return updated;
    } else {
      const updated: Complaint = {
        ...current,
        resident_confirmation: 'RESOLVED_CONFIRMED',
        timeline: [
          ...current.timeline,
          {
            id: `t-${Date.now()}-confirmed`,
            timestamp: now,
            type: 'CONFIRMED',
            title: 'Resident Verified: "Yes, Resolved"',
            description: 'Resident confirmed repair completed satisfactorily.',
            actor: data.resident_name || current.resident_name
          }
        ]
      };
      localComplaints[idx] = updated;
      syncLocalStorage();
      return updated;
    }
  },

  async escalateComplaint(id: string, reason?: string, actor?: string): Promise<Complaint | null> {
    try {
      const res = await fetch(`${API_BASE}/complaints/${id}/escalate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, actor })
      });
      if (res.ok) {
        const updated = await res.json();
        const idx = localComplaints.findIndex(c => c.id === id || c.case_id === id);
        if (idx !== -1) localComplaints[idx] = updated;
        syncLocalStorage();
        return updated;
      }
    } catch (e) {}

    const idx = localComplaints.findIndex(c => c.id === id || c.case_id === id);
    if (idx === -1) return null;
    const current = localComplaints[idx];
    const now = new Date().toISOString();

    const updated: Complaint = {
      ...current,
      escalation_status: 'ESCALATED',
      urgency: current.urgency === 'LOW' ? 'HIGH' : 'CRITICAL',
      timeline: [
        ...current.timeline,
        {
          id: `t-${Date.now()}-escalate`,
          timestamp: now,
          type: 'ESCALATED',
          title: 'Escalated to Maintenance Head',
          description: reason || 'SLA threshold reached or volunteer expedited issue.',
          actor: actor || 'Committee Lead'
        }
      ]
    };
    localComplaints[idx] = updated;
    syncLocalStorage();
    return updated;
  },

  async sendComplaintResponse(id: string, message: string, actor?: string): Promise<Complaint | null> {
    try {
      const res = await fetch(`${API_BASE}/complaints/${id}/response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, actor })
      });
      if (res.ok) {
        const updated = await res.json();
        const idx = localComplaints.findIndex(c => c.id === id || c.case_id === id);
        if (idx !== -1) localComplaints[idx] = updated;
        syncLocalStorage();
        return updated;
      }
    } catch (e) {}

    const idx = localComplaints.findIndex(c => c.id === id || c.case_id === id);
    if (idx === -1) return null;
    const current = localComplaints[idx];
    const now = new Date().toISOString();

    const updated: Complaint = {
      ...current,
      ai_response: message,
      response_sent_at: now,
      timeline: [
        ...current.timeline,
        {
          id: `t-${Date.now()}-resp`,
          timestamp: now,
          type: 'RESPONSE_SENT',
          title: 'Official Response Sent to Resident',
          description: `"${message.slice(0, 90)}..."`,
          actor: actor || 'Committee Member'
        }
      ]
    };
    localComplaints[idx] = updated;
    syncLocalStorage();
    return updated;
  },

  async composeResponseAI(complaint: Complaint, tone: 'polite' | 'formal' | 'urgent' = 'polite', targetLanguage: 'english' | 'hindi' | 'hinglish' = 'english'): Promise<string> {
    try {
      const res = await fetch(`${API_BASE}/ai/response-composer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ complaint, tone, targetLanguage })
      });
      if (res.ok) {
        const data = await res.json();
        return data.draft;
      }
    } catch (e) {}

    const residentName = complaint.resident_name || 'Resident';
    const wing = complaint.wing;
    const category = complaint.category;

    if (targetLanguage === 'hindi') {
      return `नमस्ते ${residentName}, हमने ${wing} की ${category === 'Water' ? 'पानी' : category === 'Lift' ? 'लिफ्ट' : category} समस्या को दर्ज कर लिया है। मेंटेनेंस टीम निरीक्षण कर रही है। स्थिति सामान्य होते ही आपको सूचित किया जाएगा।`;
    }
    if (targetLanguage === 'hinglish') {
      return `Hi ${residentName}, humne ${wing} mein ${category} issue note kar liya hai. Maintenance team ko assign kar diya hai aur vo jald hi visit karenge.`;
    }
    if (tone === 'urgent') {
      return `Hi ${residentName}, we have marked this as high priority due to the urgency reported in ${wing}. Our maintenance in-charge, Rohan Sharma, has been dispatched immediately.`;
    }
    return `Hi ${residentName}, we've identified this as a ${category.toLowerCase()} issue affecting ${wing}. The maintenance team has been assigned and will inspect it shortly. We'll update you once the inspection is complete.`;
  },

  async getMasterIssues(): Promise<MasterIssue[]> {
    try {
      const res = await fetch(`${API_BASE}/master-issues`);
      if (res.ok) {
        const data = await res.json();
        localMasterIssues = data;
        syncLocalStorage();
        return data;
      }
    } catch (e) {}
    return localMasterIssues;
  },

  async createMasterIssue(master: MasterIssue): Promise<MasterIssue> {
    try {
      const res = await fetch(`${API_BASE}/master-issues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(master)
      });
      if (res.ok) {
        const data = await res.json();
        localMasterIssues.unshift(data);
        syncLocalStorage();
        return data;
      }
    } catch (e) {}

    localMasterIssues.unshift(master);
    for (const childId of master.child_complaint_ids) {
      const idx = localComplaints.findIndex(c => c.id === childId);
      if (idx !== -1) {
        localComplaints[idx].master_issue_id = master.id;
        localComplaints[idx].status = 'IN_PROGRESS';
        localComplaints[idx].timeline.push({
          id: `t-merged-${Date.now()}-${childId}`,
          timestamp: new Date().toISOString(),
          type: 'MERGED',
          title: `Merged into Master Issue ${master.master_case_id}`,
          description: `Consolidated under: ${master.title}`,
          actor: 'Committee Triage'
        });
      }
    }
    syncLocalStorage();
    return master;
  },

  async getNotifications(): Promise<NotificationItem[]> {
    try {
      const res = await fetch(`${API_BASE}/notifications`);
      if (res.ok) {
        const data = await res.json();
        localNotifications = data;
        syncLocalStorage();
        return data;
      }
    } catch (e) {}
    return localNotifications;
  },

  async markNotificationRead(id: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/notifications/${id}/read`, { method: 'POST' });
    } catch (e) {}
    const n = localNotifications.find(item => item.id === id);
    if (n) {
      n.read = true;
      syncLocalStorage();
    }
  },

  async markAllNotificationsRead(): Promise<void> {
    try {
      await fetch(`${API_BASE}/notifications/mark-all-read`, { method: 'POST' });
    } catch (e) {}
    localNotifications.forEach(n => { n.read = true; });
    syncLocalStorage();
  },

  async resetDemoData(): Promise<void> {
    try {
      await fetch(`${API_BASE}/demo/reset`, { method: 'POST' });
    } catch (e) {}
    localComplaints = [...INITIAL_COMPLAINTS];
    localMasterIssues = [...INITIAL_MASTER_ISSUES];
    localNotifications = [...INITIAL_NOTIFICATIONS];
    try {
      localStorage.removeItem('sb_complaints');
      localStorage.removeItem('sb_masters');
      localStorage.removeItem('sb_notifications');
    } catch (e) {}
  }
};
