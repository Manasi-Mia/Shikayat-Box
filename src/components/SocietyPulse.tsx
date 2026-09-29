import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  Wrench, 
  Calendar,
  Layers,
  CheckCircle2,
  Droplets,
  ArrowRight
} from 'lucide-react';
import { ROOT_CAUSE_INSIGHTS, PREVENTIVE_INSIGHTS } from '../data/seedData';
import { Complaint } from '../types';

interface SocietyPulseProps {
  complaints: Complaint[];
  onCreateMaintenanceTask: (title: string) => void;
}

export const SocietyPulse: React.FC<SocietyPulseProps> = ({
  complaints,
  onCreateMaintenanceTask
}) => {
  const waterCount = complaints.filter(c => c.category === 'Water').length;
  const liftCount = complaints.filter(c => c.category === 'Lift').length;
  const parkingCount = complaints.filter(c => c.category === 'Parking').length;
  const cleaningCount = complaints.filter(c => c.category === 'Cleaning').length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-left space-y-8">
      
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center">
            <BarChart3 className="w-4 h-4" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Society Pulse & AI Preventive Insights
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Automated pattern detection across Greenwood Heights (~104 flats) to catch systemic failures early.
        </p>
      </div>

      {/* SECTION 28: Society Pulse Metrics & Trends Strip */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
          <BarChart3 className="w-4 h-4 text-violet-600" />
          <span>Society Pulse Today</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-[11px] text-slate-500 font-medium">Complaints Today</div>
            <div className="text-2xl font-extrabold font-mono text-slate-900 mt-1">23</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Across all 4 wings</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-[11px] text-slate-500 font-medium">Urgent Issues</div>
            <div className="text-2xl font-extrabold font-mono text-red-600 mt-1">4</div>
            <div className="text-[10px] text-red-500 mt-0.5">Need immediate triage</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-[11px] text-slate-500 font-medium">SLA at Risk</div>
            <div className="text-2xl font-extrabold font-mono text-amber-600 mt-1">2</div>
            <div className="text-[10px] text-amber-600 mt-0.5">&lt; 1 hour remaining</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-[11px] text-slate-500 font-medium">Verified Resolved</div>
            <div className="text-2xl font-extrabold font-mono text-emerald-600 mt-1">7</div>
            <div className="text-[10px] text-emerald-600 mt-0.5">Evidence approved</div>
          </div>
        </div>

        {/* Category Trends */}
        <div className="pt-4 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-900 mb-3">7-Day Category Trajectory</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-red-50/60 rounded-xl border border-red-100 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900">Water</span>
                <span className="text-[10px] text-slate-500 ml-1">({waterCount} tickets)</span>
              </div>
              <span className="flex items-center text-red-700 font-bold font-mono text-xs">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                ↑ 31%
              </span>
            </div>

            <div className="p-3 bg-orange-50/60 rounded-xl border border-orange-100 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900">Lift</span>
                <span className="text-[10px] text-slate-500 ml-1">({liftCount} tickets)</span>
              </div>
              <span className="flex items-center text-orange-700 font-bold font-mono text-xs">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                ↑ 18%
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900">Parking</span>
                <span className="text-[10px] text-slate-500 ml-1">({parkingCount} tickets)</span>
              </div>
              <span className="flex items-center text-slate-600 font-bold font-mono text-xs">
                <Minus className="w-3.5 h-3.5 mr-0.5" />
                → Stable
              </span>
            </div>

            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900">Cleaning</span>
                <span className="text-[10px] text-slate-500 ml-1">({cleaningCount} tickets)</span>
              </div>
              <span className="flex items-center text-emerald-700 font-bold font-mono text-xs">
                <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                ↓ 12%
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 40 & 42: Root-Cause Detection & AI Weekly Insight */}
      <div className="bg-white rounded-2xl border-2 border-violet-200 shadow-card p-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-violet-600" />
          <h2 className="text-base font-extrabold text-slate-900">
            ✨ AI Weekly Insight & Root-Cause Pattern
          </h2>
        </div>

        <div className="p-4 bg-violet-50/70 rounded-xl border border-violet-100 mb-4">
          <p className="text-xs text-slate-800 leading-relaxed font-medium">
            "Water-related complaints increased <strong>31% this week</strong>, with <strong>68% of reports originating from B Wing</strong>. Seven complaints appear related to the same underlying supply line or booster manifold issue rather than isolated flat plumbing."
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <div>
            <span className="font-bold text-slate-900">Suggested Action: </span>
            <span className="text-slate-700">Inspect B Wing supply line, riser valve, and overhead tank manifold immediately.</span>
          </div>

          <button
            onClick={() => {
              onCreateMaintenanceTask('Inspect B Wing supply line and overhead tank');
              alert('Maintenance task created and assigned to Rohan Sharma (Maintenance Lead)!');
            }}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Create Maintenance Task</span>
          </button>
        </div>
      </div>

      {/* SECTION 41: Preventive Intelligence */}
      <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <h2 className="text-base font-extrabold text-slate-900">
            Preventive Maintenance Suggested
          </h2>
        </div>

        <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 mb-4">
          <div className="flex items-center gap-2 font-bold text-amber-900 text-xs mb-1">
            <span>Equipment Alert: Lift B</span>
            <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-mono text-[10px]">
              5 complaints in 14 days
            </span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            Lift B has experienced repeated breakdown events over the past two weeks. Consider scheduling a certified Otis comprehensive rope and mechanical interlock overhaul before another passenger stoppage occurs.
          </p>
        </div>

        <div className="flex items-center justify-end">
          <button
            onClick={() => {
              onCreateMaintenanceTask('Schedule Otis Lift B certified inspection');
              alert('Otis technician inspection request logged and scheduled in vendor calendar!');
            }}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Schedule Otis Inspection</span>
          </button>
        </div>
      </div>

    </div>
  );
};
