import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './db';
import { triageComplaintAI, composeResidentResponseAI, evaluateResolutionEvidenceAI } from './aiService';
import { Complaint, MasterIssue, Urgency, Status } from '../src/types';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    product: 'SHIKAYAT BOX',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Complaints
app.get('/api/complaints', (req, res) => {
  const complaints = db.getComplaints();
  res.json(complaints);
});

app.get('/api/complaints/:id', (req, res) => {
  const complaint = db.getComplaintById(req.params.id);
  if (!complaint) {
    return res.status(404).json({ error: 'Complaint not found' });
  }
  res.json(complaint);
});

// AI Triage standalone endpoint
app.post('/api/ai/triage', async (req, res) => {
  try {
    const { text, context } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    const result = await triageComplaintAI(text, context);
    res.json(result);
  } catch (err: any) {
    console.error('AI Triage error:', err);
    res.status(500).json({ error: err.message || 'AI Triage failed' });
  }
});

// Create Complaint
app.post('/api/complaints', async (req, res) => {
  try {
    const body = req.body;
    const now = new Date();
    
    // Auto-triage if not already triaged
    let aiData = body.ai_data;
    if (!aiData) {
      aiData = await triageComplaintAI(body.original_message, {
        wing: body.wing,
        flat: body.resident_flat,
        resident_name: body.resident_name
      });
    }

    const complaintCount = db.getComplaints().length + 1;
    const caseId = `WC-${String(complaintCount + 30).padStart(3, '0')}`;
    const slaHours = aiData.suggested_sla_hours || 4;
    const slaDeadline = new Date(now.getTime() + slaHours * 3600 * 1000).toISOString();

    const newComplaint: Complaint = {
      id: `c-${Date.now()}`,
      case_id: caseId,
      resident_id: body.resident_id || 'res-custom',
      resident_name: body.resident_name || 'Resident',
      resident_phone: body.resident_phone || '+91 98200 00000',
      resident_flat: body.resident_flat || 'B-402',
      building: 'Greenwood Heights',
      wing: body.wing || 'B Wing',
      location_detail: body.location_detail || `${body.wing || 'B Wing'} Floor`,
      original_message: body.original_message,
      normalized_summary: aiData.normalized_summary,
      language: aiData.language,
      category: body.category_override || aiData.category,
      urgency: body.urgency_override || aiData.urgency,
      confidence: aiData.confidence,
      low_confidence_options: aiData.low_confidence_options,
      impact_score: aiData.impact_score,
      impact_breakdown: aiData.impact_breakdown,
      sentiment: aiData.sentiment,
      photo_url: body.photo_url || undefined,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
      assigned_to: aiData.ai_action_plan?.suggested_owner || null,
      assigned_at: null,
      status: 'NEW',
      sla_hours: slaHours,
      sla_deadline: slaDeadline,
      sla_breached: false,
      escalation_status: 'NONE',
      duplicate_group_id: body.duplicate_group_id || null,
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
          actor: body.resident_name || 'Resident'
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

    const saved = db.createComplaint(newComplaint);
    res.status(201).json(saved);
  } catch (err: any) {
    console.error('Create complaint error:', err);
    res.status(500).json({ error: err.message || 'Failed creating complaint' });
  }
});

// Update Complaint Status / Assignment / Details
app.patch('/api/complaints/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const complaint = db.getComplaintById(id);

  if (!complaint) {
    return res.status(404).json({ error: 'Complaint not found' });
  }

  // Handle timeline entry for status change
  if (updates.status && updates.status !== complaint.status) {
    complaint.timeline.push({
      id: `t-${Date.now()}-status`,
      timestamp: new Date().toISOString(),
      type: 'STATUS_CHANGE',
      title: `Status changed to ${updates.status}`,
      description: updates.reason || `Status progressed from ${complaint.status} to ${updates.status}`,
      actor: updates.actor || 'Committee Member'
    });
  }

  // Handle timeline entry for assignment
  if (updates.assigned_to && updates.assigned_to !== complaint.assigned_to) {
    updates.assigned_at = new Date().toISOString();
    if (complaint.status === 'NEW') {
      updates.status = 'ASSIGNED';
    }
    complaint.timeline.push({
      id: `t-${Date.now()}-assign`,
      timestamp: new Date().toISOString(),
      type: 'ASSIGNED',
      title: `Assigned to ${updates.assigned_to}`,
      description: 'Ownership taken for issue resolution.',
      actor: updates.actor || 'Committee Member'
    });
  }

  const updated = db.updateComplaint(id, updates);
  res.json(updated);
});

// Resolve Complaint with Evidence (Section 36)
app.post('/api/complaints/:id/resolve', (req, res) => {
  const { id } = req.params;
  const { resolution_notes, resolution_before_photo, resolution_after_photo, actor } = req.body;
  
  const complaint = db.getComplaintById(id);
  if (!complaint) {
    return res.status(404).json({ error: 'Complaint not found' });
  }

  const evidenceAnalysis = evaluateResolutionEvidenceAI(resolution_before_photo, resolution_after_photo, complaint.category);
  const now = new Date().toISOString();

  const updates: Partial<Complaint> = {
    status: 'RESOLVED',
    resolution_notes: resolution_notes || 'Issue inspected, repaired, and operational tests completed.',
    resolution_before_photo: resolution_before_photo || complaint.photo_url,
    resolution_after_photo: resolution_after_photo || 'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=600&q=80',
    evidence_relevance_score: evidenceAnalysis.relevanceScore, // 91%
    resolved_at: now,
    resident_confirmation: 'PENDING'
  };

  complaint.timeline.push({
    id: `t-${Date.now()}-evidence`,
    timestamp: now,
    type: 'EVIDENCE_UPLOADED',
    title: 'Resolution Evidence Uploaded & Verified',
    description: `Before/After evidence verified by AI (${evidenceAnalysis.relevanceScore}% match relevance).`,
    actor: actor || 'Maintenance Team'
  });

  complaint.timeline.push({
    id: `t-${Date.now()}-resolved`,
    timestamp: now,
    type: 'RESOLVED',
    title: 'Marked RESOLVED by Committee',
    description: updates.resolution_notes!,
    actor: actor || 'Rohan Sharma'
  });

  const updated = db.updateComplaint(id, updates);
  res.json(updated);
});

// Resident Confirmation & Reopen (Section 37)
app.post('/api/complaints/:id/confirm', (req, res) => {
  const { id } = req.params;
  const { confirmation, feedback_note, resident_name } = req.body; // 'RESOLVED_CONFIRMED' | 'STILL_HAPPENING'

  const complaint = db.getComplaintById(id);
  if (!complaint) {
    return res.status(404).json({ error: 'Complaint not found' });
  }

  const now = new Date().toISOString();

  if (confirmation === 'STILL_HAPPENING') {
    // Reopen issue! Bump priority, preserve history, notify committee!
    const newUrgency: Urgency = complaint.urgency === 'LOW' ? 'MEDIUM' : complaint.urgency === 'MEDIUM' ? 'HIGH' : 'CRITICAL';

    const updates: Partial<Complaint> = {
      status: 'IN_PROGRESS',
      resident_confirmation: 'STILL_HAPPENING',
      reopened: true,
      reopened_reason: feedback_note || 'Resident reported issue was not fixed on ground.',
      reopened_at: now,
      urgency: newUrgency,
      escalation_status: 'ESCALATED'
    };

    complaint.timeline.push({
      id: `t-${Date.now()}-reopened`,
      timestamp: now,
      type: 'REOPENED',
      title: 'Issue Reopened by Resident: "Still Happening"',
      description: `Feedback: "${feedback_note || 'Still not resolved'}". Urgency auto-bumped to ${newUrgency}.`,
      actor: resident_name || complaint.resident_name
    });

    const updated = db.updateComplaint(id, updates);
    return res.json({ message: 'Complaint reopened', complaint: updated });
  } else {
    // Confirmed resolved
    const updates: Partial<Complaint> = {
      resident_confirmation: 'RESOLVED_CONFIRMED'
    };

    complaint.timeline.push({
      id: `t-${Date.now()}-confirmed`,
      timestamp: now,
      type: 'CONFIRMED',
      title: 'Resident Verified: "Yes, Resolved"',
      description: 'Resident confirmed repair completed satisfactorily.',
      actor: resident_name || complaint.resident_name
    });

    const updated = db.updateComplaint(id, updates);
    return res.json({ message: 'Complaint confirmed resolved', complaint: updated });
  }
});

// Escalate Complaint (Section 33)
app.post('/api/complaints/:id/escalate', (req, res) => {
  const { id } = req.params;
  const { reason, actor } = req.body;

  const complaint = db.getComplaintById(id);
  if (!complaint) {
    return res.status(404).json({ error: 'Complaint not found' });
  }

  const now = new Date().toISOString();
  const updates: Partial<Complaint> = {
    escalation_status: 'ESCALATED',
    urgency: complaint.urgency === 'LOW' ? 'HIGH' : 'CRITICAL'
  };

  complaint.timeline.push({
    id: `t-${Date.now()}-escalate`,
    timestamp: now,
    type: 'ESCALATED',
    title: 'Escalated to Maintenance Head',
    description: reason || 'SLA threshold reached or volunteer expedited issue.',
    actor: actor || 'Committee Lead'
  });

  const updated = db.updateComplaint(id, updates);
  res.json(updated);
});

// AI Response Composer endpoint (Section 34)
app.post('/api/ai/response-composer', async (req, res) => {
  try {
    const { complaint, tone, targetLanguage } = req.body;
    if (!complaint) {
      return res.status(400).json({ error: 'Complaint data required' });
    }
    const response = await composeResidentResponseAI(complaint, tone, targetLanguage);
    res.json({ draft: response });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed composing response' });
  }
});

// Send Response to Resident
app.post('/api/complaints/:id/response', (req, res) => {
  const { id } = req.params;
  const { message, actor } = req.body;

  const complaint = db.getComplaintById(id);
  if (!complaint) {
    return res.status(404).json({ error: 'Complaint not found' });
  }

  const now = new Date().toISOString();
  const updates: Partial<Complaint> = {
    ai_response: message,
    response_sent_at: now
  };

  complaint.timeline.push({
    id: `t-${Date.now()}-response`,
    timestamp: now,
    type: 'RESPONSE_SENT',
    title: 'Official Response Sent to Resident',
    description: `"${message.slice(0, 100)}..."`,
    actor: actor || 'Committee Member'
  });

  const updated = db.updateComplaint(id, updates);
  res.json(updated);
});

// Master Issues (Section 22 & 23)
app.get('/api/master-issues', (req, res) => {
  res.json(db.getMasterIssues());
});

app.post('/api/master-issues', (req, res) => {
  const master = req.body as MasterIssue;
  const saved = db.createMasterIssue(master);
  res.status(201).json(saved);
});

// Notifications
app.get('/api/notifications', (req, res) => {
  res.json(db.getNotifications());
});

app.post('/api/notifications/:id/read', (req, res) => {
  db.markNotificationRead(req.params.id);
  res.json({ success: true });
});

app.post('/api/notifications/mark-all-read', (req, res) => {
  db.markAllNotificationsRead();
  res.json({ success: true });
});

// Reset Demo Data
app.post('/api/demo/reset', (req, res) => {
  const refreshed = db.resetToSeed();
  res.json({ message: 'Database reset to demo state', count: refreshed.complaints.length });
});

app.listen(PORT, () => {
  console.log(`[SHIKAYAT BOX Backend] Server running on http://localhost:${PORT}`);
});
