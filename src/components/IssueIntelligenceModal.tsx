import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  User, 
  MapPin, 
  Send, 
  RefreshCw, 
  Check, 
  Layers, 
  FileText, 
  CheckCircle2, 
  Flame, 
  Camera,
  Languages,
  ArrowRight
} from 'lucide-react';
import { Complaint, UserAccount, Urgency, Status } from '../types';
import { formatDateTime, formatSlaCountdown, getUrgencyBadgeClasses } from '../utils/formatters';
import { api } from '../services/api';

interface IssueIntelligenceModalProps {
  complaint: Complaint;
  currentUser: UserAccount;
  onClose: () => void;
  onOpenResolution: (c: Complaint) => void;
  onRefresh: () => void;
}

export const IssueIntelligenceModal: React.FC<IssueIntelligenceModalProps> = ({
  complaint,
  currentUser,
  onClose,
  onOpenResolution,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<'intelligence' | 'timeline'>('intelligence');
  
  // AI Response Composer State
  const [responseDraft, setResponseDraft] = useState(complaint.ai_response || '');
  const [responseTone, setResponseTone] = useState<'polite' | 'formal' | 'urgent'>('polite');
  const [responseLang, setResponseLang] = useState<'english' | 'hindi' | 'hinglish'>('english');
  const [isComposing, setIsComposing] = useState(false);
  const [isSendingResponse, setIsSendingResponse] = useState(false);
  const [isEscalating, setIsEscalating] = useState(false);

  // Assignment state
  const [assignedPerson, setAssignedPerson] = useState(complaint.assigned_to || '');

  const slaInfo = formatSlaCountdown(complaint.sla_deadline);
  const urgencyClasses = getUrgencyBadgeClasses(complaint.urgency);

  const handleRegenerateResponse = async () => {
    setIsComposing(true);
    try {
      const draft = await api.composeResponseAI(complaint, responseTone, responseLang);
      setResponseDraft(draft);
    } catch (e) {
      console.error(e);
    } finally {
      setIsComposing(false);
    }
  };

  const handleSendResponse = async () => {
    if (!responseDraft.trim()) return;
    setIsSendingResponse(true);
    try {
      await api.sendComplaintResponse(complaint.id, responseDraft, currentUser.name);
      onRefresh();
      alert('Response dispatched to resident via in-app message and SMS notification!');
    } catch (e) {
      alert('Failed sending response');
    } finally {
      setIsSendingResponse(false);
    }
  };

  const handleEscalate = async () => {
    setIsEscalating(true);
    try {
      await api.escalateComplaint(complaint.id, 'SLA target approaching, escalated by committee', currentUser.name);
      onRefresh();
    } catch (e) {
      alert('Failed escalating');
    } finally {
      setIsEscalating(false);
    }
  };

  const handleAssign = async (name: string) => {
    setAssignedPerson(name);
    try {
      await api.updateComplaint(complaint.id, {
        assigned_to: name,
        status: complaint.status === 'NEW' ? 'ASSIGNED' : complaint.status
      });
      onRefresh();
    } catch (e) {
      alert('Failed updating assignment');
    }
  };

  const handleStatusChange = async (newStatus: Status) => {
    if (newStatus === 'RESOLVED') {
      onOpenResolution(complaint);
      return;
    }
    try {
      await api.updateComplaint(complaint.id, { status: newStatus });
      onRefresh();
    } catch (e) {
      alert('Failed updating status');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200 text-left">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/60 shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-mono font-extrabold text-sm px-2.5 py-1 rounded-md bg-violet-600 text-white shadow-xs">
              {complaint.case_id}
            </span>
            <h2 className="text-base font-bold text-slate-900 truncate max-w-md">
              {complaint.normalized_summary}
            </h2>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${urgencyClasses.bg} ${urgencyClasses.text} ${urgencyClasses.border}`}>
              {complaint.urgency}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
              {complaint.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-200/70 p-0.5 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setActiveTab('intelligence')}
                className={`px-3 py-1 rounded-md transition-colors ${activeTab === 'intelligence' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'}`}
              >
                Issue Intelligence
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`px-3 py-1 rounded-md transition-colors ${activeTab === 'timeline' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'}`}
              >
                Event Timeline ({complaint.timeline.length})
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {activeTab === 'intelligence' ? (
          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT PANEL: Original Complaint (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                  <span>Resident & Origin</span>
                  <span className="text-slate-900 font-mono text-xs">{complaint.wing}</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Resident:</span>
                    <span className="font-semibold text-slate-900">{complaint.resident_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Flat / Location:</span>
                    <span className="font-semibold text-slate-900">{complaint.resident_flat} ({complaint.wing})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Phone:</span>
                    <span className="font-mono text-slate-700">{complaint.resident_phone || '+91 98201 44521'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Reported At:</span>
                    <span className="text-slate-700">{formatDateTime(complaint.created_at)}</span>
                  </div>
                </div>

                {/* Complaint Photo if present */}
                {complaint.photo_url && (
                  <div className="mt-4 pt-3 border-t border-slate-200">
                    <div className="text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5 text-slate-400" />
                      <span>Resident Photo Attachment:</span>
                    </div>
                    <img 
                      src={complaint.photo_url} 
                      alt="Attachment" 
                      className="w-full h-36 object-cover rounded-lg border border-slate-200 mt-1 shadow-xs"
                    />
                  </div>
                )}
              </div>

              {/* Original Message Box with Language Tag */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900">Original Complaint Text</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-violet-50 text-violet-700 border border-violet-100">
                    Detected: {complaint.language}
                  </span>
                </div>
                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed font-normal">
                  "{complaint.original_message}"
                </p>

                <div className="mt-3">
                  <span className="text-[11px] font-semibold text-slate-500">Normalized English Summary:</span>
                  <p className="text-xs font-semibold text-slate-900 mt-0.5">
                    {complaint.normalized_summary}
                  </p>
                </div>
              </div>

              {/* Status Controls */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
                <div className="text-xs font-bold text-slate-900 mb-2">Workflow Status</div>
                <div className="grid grid-cols-2 gap-2">
                  {(['NEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'] as Status[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-center ${
                        complaint.status === st
                          ? 'bg-violet-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CENTER PANEL: AI Analysis & Impact Radar (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-violet-700 mb-3">
                  <Sparkles className="w-4 h-4 text-violet-600" />
                  <span>AI Triage Intelligence</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="text-[10px] text-slate-400">AI Confidence</div>
                    <div className="text-base font-bold font-mono text-violet-700">{complaint.confidence}%</div>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="text-[10px] text-slate-400">Sentiment</div>
                    <div className="text-base font-bold text-slate-800">{complaint.sentiment}</div>
                  </div>
                </div>

                {/* SECTION 31: AI Impact Score Breakdown */}
                <div className="p-3.5 bg-violet-50/50 rounded-xl border border-violet-100 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900">AI Impact Estimate</span>
                    <span className="font-mono text-base font-extrabold text-violet-700">{complaint.impact_score} / 100</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mb-3 italic">
                    AI-assisted impact estimate based on severity, residents, duration & safety.
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] mb-0.5">
                        <span className="text-slate-600">Severity</span>
                        <span className="font-mono font-semibold">{complaint.impact_breakdown?.severity || 80}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-violet-600" style={{ width: `${complaint.impact_breakdown?.severity || 80}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-0.5">
                        <span className="text-slate-600">Affected Residents</span>
                        <span className="font-mono font-semibold">{complaint.impact_breakdown?.residents || 72}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600" style={{ width: `${complaint.impact_breakdown?.residents || 72}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-0.5">
                        <span className="text-slate-600">Duration Elapsed</span>
                        <span className="font-mono font-semibold">{complaint.impact_breakdown?.duration || 61}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: `${complaint.impact_breakdown?.duration || 61}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-0.5">
                        <span className="text-slate-600">Safety Hazard</span>
                        <span className="font-mono font-semibold">{complaint.impact_breakdown?.safety || 90}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500" style={{ width: `${complaint.impact_breakdown?.safety || 90}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decision Factors */}
                <div className="text-xs">
                  <div className="font-bold text-slate-900 mb-1.5">Decision Factors ("Why {complaint.urgency}?"):</div>
                  <ul className="space-y-1 text-slate-600">
                    {complaint.ai_action_plan?.why_urgency?.map((factor, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-600 mt-1 shrink-0" />
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Similar Complaints in Wing */}
              {complaint.similar_complaint_ids && complaint.similar_complaint_ids.length > 0 && (
                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                    <Layers className="w-4 h-4 text-amber-700" />
                    <span>{complaint.similar_complaint_ids.length} Related Reports in {complaint.wing}</span>
                  </div>
                  <p className="text-amber-800 text-[11px]">
                    Clustered with Master Issue <strong>WC-M024</strong>. Part of the active supply line disruption.
                  </p>
                </div>
              )}

            </div>

            {/* RIGHT PANEL: AI Action Plan & Response Composer (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Recommended Action & SLA */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Action Plan & SLA Target
                </div>
                
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs mb-3">
                  <div className="font-semibold text-slate-900 mb-1">Recommended Action:</div>
                  <p className="text-slate-700 leading-relaxed">
                    {complaint.ai_action_plan?.recommended_action}
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">SLA Timer:</span>
                    <span className={`font-mono font-bold ${
                      slaInfo.isBreached ? 'text-red-600 font-extrabold' : slaInfo.isWarning ? 'text-amber-600' : 'text-emerald-700'
                    }`}>
                      {slaInfo.text}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Assignee:</span>
                    <select
                      value={assignedPerson}
                      onChange={(e) => handleAssign(e.target.value)}
                      className="bg-slate-100 border border-slate-200 rounded p-1 font-semibold text-slate-800 text-xs focus:outline-none"
                    >
                      <option value="">Unassigned</option>
                      <option value="Rohan Sharma (Maintenance Lead)">Rohan Sharma (Maintenance)</option>
                      <option value="Sunil Patel (Security Supervisor)">Sunil Patel (Security)</option>
                      <option value="Asha Verma (Housekeeping Lead)">Asha Verma (Housekeeping)</option>
                      <option value="Priya Nair (Secretary)">Priya Nair (Secretary)</option>
                    </select>
                  </div>
                </div>

                {/* SECTION 33: SLA Approaching Escalation */}
                {(slaInfo.isWarning || slaInfo.isBreached || complaint.escalation_status === 'SUGGESTED') && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <div className="text-xs font-bold text-red-900 mb-1 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                      <span>⚠ Approaching SLA Breach</span>
                    </div>
                    <div className="text-[11px] text-red-700 mb-2">
                      Suggested action: Escalate to Maintenance Head Rohan Sharma immediately.
                    </div>
                    <button
                      onClick={handleEscalate}
                      disabled={isEscalating}
                      className="w-full py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
                    >
                      {isEscalating ? 'Escalating...' : 'Escalate Issue'}
                    </button>
                  </div>
                )}
              </div>

              {/* SECTION 34: AI Response Composer */}
              <div className="bg-white rounded-xl p-4 border border-violet-200 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                    <span>AI Resident Response Composer</span>
                  </div>
                  <button
                    onClick={handleRegenerateResponse}
                    disabled={isComposing}
                    className="text-[11px] text-violet-600 hover:text-violet-800 flex items-center gap-1 font-medium"
                  >
                    <RefreshCw className={`w-3 h-3 ${isComposing ? 'animate-spin' : ''}`} />
                    <span>Regenerate</span>
                  </button>
                </div>

                {/* Tone and Language selectors */}
                <div className="flex items-center justify-between gap-2 mb-2 text-[11px]">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">Tone:</span>
                    <select
                      value={responseTone}
                      onChange={(e) => setResponseTone(e.target.value as any)}
                      className="bg-slate-100 rounded px-1.5 py-0.5 text-slate-700 font-medium"
                    >
                      <option value="polite">Polite</option>
                      <option value="formal">Formal</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">Language:</span>
                    <select
                      value={responseLang}
                      onChange={(e) => setResponseLang(e.target.value as any)}
                      className="bg-slate-100 rounded px-1.5 py-0.5 text-slate-700 font-medium"
                    >
                      <option value="english">English</option>
                      <option value="hindi">Hindi</option>
                      <option value="hinglish">Hinglish</option>
                    </select>
                  </div>
                </div>

                <textarea
                  rows={4}
                  value={responseDraft}
                  onChange={(e) => setResponseDraft(e.target.value)}
                  placeholder="Draft response to resident..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-violet-500"
                />

                <div className="flex items-center justify-end gap-2 mt-2">
                  <button
                    onClick={handleSendResponse}
                    disabled={isSendingResponse || !responseDraft.trim()}
                    className="px-4 py-1.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSendingResponse ? 'Sending...' : 'Send to Resident'}</span>
                  </button>
                </div>
              </div>

              {/* Resolve Button */}
              {complaint.status !== 'RESOLVED' && (
                <button
                  onClick={() => onOpenResolution(complaint)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Resolve & Upload Resolution Evidence</span>
                </button>
              )}

            </div>

          </div>
        ) : (
          /* Event Timeline Tab */
          <div className="flex-1 overflow-y-auto p-6 max-w-2xl mx-auto w-full">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Audit Event Timeline</h3>
            <div className="relative pl-6 border-l-2 border-slate-200 space-y-5">
              {complaint.timeline.map((event, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full border-2 border-white bg-violet-600" />
                  <div className="flex items-center justify-between text-xs mb-0.5">
                    <span className="font-bold text-slate-900">{event.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formatDateTime(event.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {event.description}
                  </p>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Logged by: {event.actor}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
