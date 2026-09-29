import React from 'react';
import { 
  X, 
  Layers, 
  Clock, 
  Building2, 
  UserCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Droplets,
  ExternalLink
} from 'lucide-react';
import { MasterIssue, Complaint } from '../types';
import { formatDateTime, formatSlaCountdown, getUrgencyBadgeClasses } from '../utils/formatters';

interface MasterIssueModalProps {
  masterIssue: MasterIssue;
  allComplaints: Complaint[];
  onClose: () => void;
  onOpenComplaint: (c: Complaint) => void;
}

export const MasterIssueModal: React.FC<MasterIssueModalProps> = ({
  masterIssue,
  allComplaints,
  onClose,
  onOpenComplaint
}) => {
  const childComplaints = allComplaints.filter(c => masterIssue.child_complaint_ids.includes(c.id));
  const slaInfo = formatSlaCountdown(masterIssue.sla_deadline);
  const urgencyClasses = getUrgencyBadgeClasses(masterIssue.urgency);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 text-left animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-violet-600 text-white rounded-lg font-mono text-sm font-extrabold shadow-xs">
              {masterIssue.master_case_id}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-violet-700">MASTER ISSUE</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${urgencyClasses.bg} ${urgencyClasses.text} ${urgencyClasses.border}`}>
                  {masterIssue.urgency}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-violet-100 text-violet-800">
                  Impact: {masterIssue.impact_score}
                </span>
              </div>
              <h2 className="text-base font-extrabold text-slate-900 mt-0.5">
                {masterIssue.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Key Aggregated Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-500 font-medium">Consolidated Reports</div>
              <div className="text-xl font-mono font-extrabold text-slate-900 mt-1">
                {childComplaints.length} complaints
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-500 font-medium">Affected Scope</div>
              <div className="text-xl font-mono font-extrabold text-violet-700 mt-1">
                {masterIssue.affected_flats_count} flats
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-500 font-medium">First Reported</div>
              <div className="text-xs font-semibold text-slate-800 mt-2">
                {formatDateTime(masterIssue.first_reported_at)}
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-500 font-medium">Target SLA Deadline</div>
              <div className={`text-xs font-mono font-bold mt-2 ${
                slaInfo.isBreached ? 'text-red-600' : 'text-emerald-700'
              }`}>
                {slaInfo.text}
              </div>
            </div>
          </div>

          {/* Action Recommendation */}
          <div className="p-4 bg-violet-50/60 rounded-xl border border-violet-100 text-xs text-slate-700">
            <span className="font-bold text-slate-900">Unified Diagnosis & Recommended Action: </span>
            {masterIssue.recommended_action}
          </div>

          {/* Child Complaints Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-violet-600" />
                <span>Linked Child Complaints ({childComplaints.length})</span>
              </h3>
              <span className="text-[11px] text-slate-500">
                Click any ticket to open full case intelligence
              </span>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
              {childComplaints.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    onClose();
                    onOpenComplaint(c);
                  }}
                  className="p-3.5 hover:bg-violet-50/50 cursor-pointer transition-colors flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-violet-700 w-16">
                      {c.case_id}
                    </span>
                    <span className="font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {c.resident_flat}
                    </span>
                    <span className="text-slate-700 truncate max-w-md">
                      "{c.original_message}"
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-slate-400">
                      {formatDateTime(c.created_at)}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close Master View
          </button>
        </div>

      </div>
    </div>
  );
};
