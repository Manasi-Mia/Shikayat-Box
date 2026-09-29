import React, { useState } from 'react';
import { 
  MapPin, 
  Building2, 
  AlertCircle, 
  Layers, 
  ExternalLink,
  Filter
} from 'lucide-react';
import { Complaint } from '../types';
import { getUrgencyBadgeClasses } from '../utils/formatters';

interface SocietyHeatmapProps {
  complaints: Complaint[];
  onSelectComplaint: (c: Complaint) => void;
}

const WINGS = ['A Wing', 'B Wing', 'C Wing', 'D Wing'];
const FLOORS = [7, 6, 5, 4, 3, 2, 1];

export const SocietyHeatmap: React.FC<SocietyHeatmapProps> = ({
  complaints,
  onSelectComplaint
}) => {
  const [selectedWing, setSelectedWing] = useState<string>('B Wing');

  // Compute issue density per Wing & Floor
  const getFloorIssues = (wing: string, floor: number) => {
    return complaints.filter(c => {
      if (c.status === 'RESOLVED') return false;
      if (c.wing !== wing) return false;
      const flatNum = parseInt(c.resident_flat.replace(/\D/g, ''), 10);
      const floorDerived = Math.floor(flatNum / 100);
      return floorDerived === floor;
    });
  };

  const getFloorStatus = (wing: string, floor: number): { color: string; label: string; count: number } => {
    const list = getFloorIssues(wing, floor);
    if (list.length === 0) return { color: 'bg-emerald-500', label: 'Normal', count: 0 };
    if (list.some(c => c.urgency === 'CRITICAL')) return { color: 'bg-red-500', label: 'Critical Alert', count: list.length };
    if (list.some(c => c.urgency === 'HIGH')) return { color: 'bg-orange-500', label: 'High Urgency', count: list.length };
    return { color: 'bg-amber-500', label: 'Medium', count: list.length };
  };

  const wingFilteredComplaints = complaints.filter(
    c => c.wing === selectedWing && c.status !== 'RESOLVED'
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-left">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Society Architectural Heatmap
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Visual floor matrix of Greenwood Heights (~104 flats). Click any wing to inspect cluster hot-spots.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200 text-xs shadow-2xs self-start sm:self-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600 text-[11px]">Normal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-600 text-[11px]">Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span className="text-slate-600 text-[11px]">High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-slate-600 text-[11px]">Critical</span>
          </div>
        </div>
      </div>

      {/* Grid of 4 Wings */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {WINGS.map(wing => {
          const isSelected = selectedWing === wing;
          const wingComplaints = complaints.filter(c => c.wing === wing && c.status !== 'RESOLVED');
          const hasCritical = wingComplaints.some(c => c.urgency === 'CRITICAL');

          return (
            <div
              key={wing}
              onClick={() => setSelectedWing(wing)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                isSelected 
                  ? 'bg-violet-50/70 border-violet-400 shadow-card' 
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Building2 className={`w-4 h-4 ${isSelected ? 'text-violet-600' : 'text-slate-500'}`} />
                  <span className="font-extrabold text-slate-900 text-sm">{wing}</span>
                </div>
                {hasCritical && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 animate-pulse">
                    CRITICAL
                  </span>
                )}
              </div>

              {/* Floor Matrix Indicators: 7 down to 1 */}
              <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 mb-3">
                {FLOORS.map(floor => {
                  const status = getFloorStatus(wing, floor);
                  return (
                    <div key={floor} className="flex items-center justify-between text-[11px]">
                      <span className="font-mono text-slate-400 font-semibold">F{floor}</span>
                      <div className="flex items-center gap-1.5">
                        {status.count > 0 && (
                          <span className="text-[10px] font-bold font-mono text-slate-600">
                            {status.count}
                          </span>
                        )}
                        <span className={`w-2.5 h-2.5 rounded-full ${status.color} shadow-2xs`} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-[11px] text-slate-500 font-medium flex items-center justify-between">
                <span>Active Issues:</span>
                <span className="font-bold text-slate-900">{wingComplaints.length}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Wing Issue Breakdown List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-violet-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Active Issues in {selectedWing} ({wingFilteredComplaints.length})
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Click any row to open Issue Intelligence
          </span>
        </div>

        {wingFilteredComplaints.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No active issues in {selectedWing} 🎉 All systems operational.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {wingFilteredComplaints.map(c => {
              const urgencyClasses = getUrgencyBadgeClasses(c.urgency);
              return (
                <div
                  key={c.id}
                  onClick={() => onSelectComplaint(c)}
                  className="p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-violet-700 w-16">
                      {c.case_id}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${urgencyClasses.bg} ${urgencyClasses.text} ${urgencyClasses.border}`}>
                      {c.urgency}
                    </span>
                    <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {c.resident_flat}
                    </span>
                    <span className="text-slate-700 font-medium truncate max-w-sm">
                      {c.normalized_summary}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] text-slate-400">
                      {c.assigned_to || 'Unassigned'}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
