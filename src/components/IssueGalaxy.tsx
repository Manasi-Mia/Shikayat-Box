import React, { useState } from 'react';
import { 
  Compass, 
  Layers, 
  Droplets, 
  ArrowRight, 
  Info, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { MasterIssue, Complaint } from '../types';

interface IssueGalaxyProps {
  masterIssue: MasterIssue;
  allComplaints: Complaint[];
  onSelectComplaint: (c: Complaint) => void;
  onSelectMaster: (m: MasterIssue) => void;
}

export const IssueGalaxy: React.FC<IssueGalaxyProps> = ({
  masterIssue,
  allComplaints,
  onSelectComplaint,
  onSelectMaster
}) => {
  const childComplaints = allComplaints.filter(c => masterIssue.child_complaint_ids.includes(c.id));
  const [hoveredComplaint, setHoveredComplaint] = useState<Complaint | null>(null);

  // Layout math: Center node at (300, 200), radius = 130
  const centerX = 350;
  const centerY = 240;
  const radius = 150;
  const totalNodes = Math.max(childComplaints.length, 1);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-left">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Issue Galaxy Visualizer
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Interactive constellation showing connected reports converging into Master Issue <strong>{masterIssue.master_case_id}</strong>.
          </p>
        </div>

        <button
          onClick={() => onSelectMaster(masterIssue)}
          className="px-4 py-2 bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Layers className="w-4 h-4" />
          <span>Open Master Issue Details</span>
        </button>
      </div>

      {/* Galaxy SVG Canvas */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-elevated p-6 relative overflow-hidden">
        
        {/* Galaxy Canvas Background */}
        <div className="w-full flex items-center justify-center relative">
          <svg
            viewBox="0 0 700 480"
            className="w-full max-w-2xl h-auto select-none overflow-visible"
          >
            <defs>
              {/* Radial gradient for center glow */}
              <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="orbitLine" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Orbit ring guide */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <circle
              cx={centerX}
              cy={centerY}
              r={radius * 1.3}
              fill="none"
              stroke="#F1F5F9"
              strokeWidth="1"
              strokeDasharray="6 6"
            />

            {/* Pulsing center aura */}
            <circle
              cx={centerX}
              cy={centerY}
              r={80}
              fill="url(#centerGlow)"
              className="animate-pulse"
            />

            {/* Connecting lines from center to satellite complaints */}
            {childComplaints.map((c, i) => {
              const angle = (i * 2 * Math.PI) / totalNodes - Math.PI / 2;
              const x = centerX + radius * Math.cos(angle);
              const y = centerY + radius * Math.sin(angle);

              return (
                <g key={`line-${c.id}`}>
                  <line
                    x1={centerX}
                    y1={centerY}
                    x2={x}
                    y2={y}
                    stroke="url(#orbitLine)"
                    strokeWidth="2"
                    strokeDasharray={hoveredComplaint?.id === c.id ? 'none' : '3 3'}
                  />
                  {/* Small particle animated on line */}
                  <circle
                    cx={(centerX + x) / 2}
                    cy={(centerY + y) / 2}
                    r="2.5"
                    fill="#7C3AED"
                    className="animate-subtle-pulse"
                  />
                </g>
              );
            })}

            {/* Center Master Node */}
            <g
              className="cursor-pointer group"
              onClick={() => onSelectMaster(masterIssue)}
            >
              <circle
                cx={centerX}
                cy={centerY}
                r="45"
                fill="#7C3AED"
                className="filter drop-shadow-lg transition-transform group-hover:scale-105"
              />
              <text
                x={centerX}
                y={centerY - 8}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="11"
                fontWeight="800"
                fontFamily="JetBrains Mono"
              >
                {masterIssue.master_case_id}
              </text>
              <text
                x={centerX}
                y={centerY + 8}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="10"
                fontWeight="700"
              >
                WATER SUPPLY
              </text>
              <text
                x={centerX}
                y={centerY + 22}
                textAnchor="middle"
                fill="#DDD6FE"
                fontSize="8"
                fontWeight="600"
              >
                7 Complaints • 23 Flats
              </text>
            </g>

            {/* Orbiting Satellite Complaint Nodes */}
            {childComplaints.map((c, i) => {
              const angle = (i * 2 * Math.PI) / totalNodes - Math.PI / 2;
              const x = centerX + radius * Math.cos(angle);
              const y = centerY + radius * Math.sin(angle);
              const isHovered = hoveredComplaint?.id === c.id;

              return (
                <g
                  key={c.id}
                  className="cursor-pointer transition-transform"
                  onMouseEnter={() => setHoveredComplaint(c)}
                  onMouseLeave={() => setHoveredComplaint(null)}
                  onClick={() => onSelectComplaint(c)}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? '24' : '20'}
                    fill={isHovered ? '#1E293B' : '#FFFFFF'}
                    stroke={isHovered ? '#7C3AED' : '#CBD5E1'}
                    strokeWidth={isHovered ? '3' : '2'}
                    className="shadow-sm transition-all"
                  />
                  <text
                    x={x}
                    y={y + 3}
                    textAnchor="middle"
                    fill={isHovered ? '#FFFFFF' : '#0F172A'}
                    fontSize="9"
                    fontWeight="700"
                    fontFamily="JetBrains Mono"
                  >
                    {c.resident_flat}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Hovered Tooltip Card */}
        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          {hoveredComplaint ? (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono font-bold text-violet-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {hoveredComplaint.case_id}
                </span>
                <span className="font-bold text-slate-900">
                  Flat {hoveredComplaint.resident_flat} ({hoveredComplaint.resident_name})
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {hoveredComplaint.language.toUpperCase()}
                </span>
              </div>
              <p className="text-slate-600 italic">
                "{hoveredComplaint.original_message}"
              </p>
            </div>
          ) : (
            <div className="text-slate-500 flex items-center gap-2">
              <Info className="w-4 h-4 text-violet-600" />
              <span>Hover over any satellite flat node or click to inspect its complete AI case profile.</span>
            </div>
          )}

          {hoveredComplaint && (
            <button
              onClick={() => onSelectComplaint(hoveredComplaint)}
              className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors shadow-xs"
            >
              Open Ticket
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
