import React, { useState } from 'react';
import { 
  Zap, 
  X, 
  CheckCircle2, 
  Layers, 
  UserCheck, 
  Clock, 
  Eye, 
  BellOff, 
  ArrowRight,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { Complaint, UserAccount } from '../types';
import { getUrgencyBadgeClasses, formatSlaCountdown } from '../utils/formatters';

interface TwoMinuteTriageProps {
  complaints: Complaint[];
  currentUser: UserAccount;
  onClose: () => void;
  onOpenIssue: (c: Complaint) => void;
  onAssignQuick: (c: Complaint) => void;
  onResolveQuick: (c: Complaint) => void;
  onMergeQuick: (c: Complaint) => void;
}

export const TwoMinuteTriage: React.FC<TwoMinuteTriageProps> = ({
  complaints,
  currentUser,
  onClose,
  onOpenIssue,
  onAssignQuick,
  onResolveQuick,
  onMergeQuick
}) => {
  const [snoozedIds, setSnoozedIds] = useState<string[]>([]);

  // Get Today's 5 Most Important Unresolved Issues (sorted by Critical -> High -> Medium -> Low and Impact)
  const topIssues = complaints
    .filter(c => c.status !== 'RESOLVED' && !snoozedIds.includes(c.id))
    .sort((a, b) => {
      const urgencyWeight = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      const diff = urgencyWeight[b.urgency] - urgencyWeight[a.urgency];
      if (diff !== 0) return diff;
      return b.impact_score - a.impact_score;
    })
    .slice(0, 5);

  const handleSnooze = (id: string) => {
    setSnoozedIds(prev => [...prev, id]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 text-left animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-amber-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-amber-100 bg-amber-50/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900">
                  ⚡ 2-Minute Volunteer Triage
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                  Committee Fast-Lane
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Today's 5 highest-leverage issues. Act in seconds without opening full tickets.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Issue Cards Deck */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {topIssues.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">All Clear! 🎉</h3>
              <p className="text-xs text-slate-500 mt-1">No urgent issues require 2-minute triage right now.</p>
            </div>
          ) : (
            topIssues.map((issue, index) => {
              const urgencyClasses = getUrgencyBadgeClasses(issue.urgency);
              const slaInfo = formatSlaCountdown(issue.sla_deadline);

              return (
                <div 
                  key={issue.id}
                  className="bg-white rounded-xl border border-slate-200 hover:border-violet-300 p-4 shadow-subtle hover:shadow-card transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="font-mono text-xs font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded border border-violet-100">
                        {issue.case_id}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${urgencyClasses.bg} ${urgencyClasses.text} ${urgencyClasses.border}`}>
                        {issue.urgency}
                      </span>
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {issue.normalized_summary}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
                      <span className="text-slate-400 font-mono text-[11px]">{issue.wing} • Flat {issue.resident_flat}</span>
                      <span className={`font-mono text-[11px] font-bold ${
                        slaInfo.isBreached ? 'text-red-600' : 'text-amber-600'
                      }`}>
                        SLA: {slaInfo.text.split(' ')[0]}
                      </span>
                    </div>
                  </div>

                  <div className="my-3 text-xs text-slate-600 flex items-start gap-2">
                    <span className="font-semibold text-slate-800 shrink-0">AI Action:</span>
                    <span className="text-slate-700">{issue.ai_action_plan?.recommended_action}</span>
                  </div>

                  {/* 1-Click Action Buttons: Assign, Merge, Resolve, Snooze, View */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-400">Assigned:</span>
                      <span className="text-xs font-semibold text-slate-800">
                        {issue.assigned_to || 'Unassigned'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onAssignQuick(issue)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Assign</span>
                      </button>

                      {issue.duplicate_group_id && (
                        <button
                          onClick={() => onMergeQuick(issue)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 transition-colors flex items-center gap-1"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>Merge</span>
                        </button>
                      )}

                      <button
                        onClick={() => onResolveQuick(issue)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors flex items-center gap-1"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Resolve</span>
                      </button>

                      <button
                        onClick={() => handleSnooze(issue.id)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1"
                        title="Snooze for today"
                      >
                        <BellOff className="w-3.5 h-3.5" />
                        <span>Snooze</span>
                      </button>

                      <button
                        onClick={() => {
                          onClose();
                          onOpenIssue(issue);
                        }}
                        className="px-3 py-1 text-xs font-bold rounded-lg bg-violet-600 hover:bg-violet-700 text-white transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close Fast Triage
          </button>
        </div>

      </div>
    </div>
  );
};
