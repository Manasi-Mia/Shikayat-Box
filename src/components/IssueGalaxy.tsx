import React, { useMemo, useState } from 'react';
import { AlertTriangle, Info, Orbit, Star, X } from 'lucide-react';
import { MasterIssue, Complaint } from '../types';

interface IssueGalaxyProps {
  masterIssue: MasterIssue;
  allComplaints: Complaint[];
  onSelectComplaint: (c: Complaint) => void;
  onSelectMaster: (m: MasterIssue) => void;
}

export const IssueGalaxy: React.FC<IssueGalaxyProps> = ({ masterIssue, allComplaints, onSelectComplaint, onSelectMaster }) => {
  const childComplaints = allComplaints.filter(c => masterIssue.child_complaint_ids.includes(c.id));
  const [selected, setSelected] = useState<Complaint | null>(null);
  const stars = useMemo(() => Array.from({ length: 42 }, (_, i) => ({
    x: (i * 83 + 17) % 700,
    y: (i * 47 + 23) % 470,
    r: i % 9 === 0 ? 2 : i % 3 === 0 ? 1.5 : 1,
    delay: `${(i % 8) * 0.35}s`
  })), []);

  const centerX = 350;
  const centerY = 240;
  const radius = 155;
  const total = Math.max(childComplaints.length, 1);

  return (
    <div className="min-h-[calc(100vh-68px)] bg-[#030b1c] text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'radial-gradient(circle at 50% 45%, rgba(37,99,235,.20), transparent 34%), radial-gradient(circle at 15% 20%, rgba(14,165,233,.10), transparent 28%), radial-gradient(circle at 85% 80%, rgba(99,102,241,.12), transparent 30%)' }} />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-7 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-400/10 border border-blue-300/20 text-blue-200 text-[10px] font-black uppercase tracking-[.18em]"><Orbit className="w-3.5 h-3.5" /> Issue Galaxy</div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-3">Complaint Constellation</h1>
            <p className="text-sm text-blue-100/65 mt-1">Every complaint is a star. Connected reports reveal the larger society issue.</p>
          </div>
          <button onClick={() => onSelectMaster(masterIssue)} className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold text-blue-100">View master issue</button>
        </div>

        <div className="rounded-[30px] border border-blue-200/10 bg-[#06152f]/90 shadow-2xl shadow-blue-950/30 overflow-hidden">
          <div className="p-2 sm:p-5">
            <svg viewBox="0 0 700 480" className="w-full h-auto min-h-[430px] select-none">
              <defs>
                <radialGradient id="galaxyCore"><stop offset="0%" stopColor="#60a5fa" stopOpacity=".65"/><stop offset="45%" stopColor="#2563eb" stopOpacity=".20"/><stop offset="100%" stopColor="#2563eb" stopOpacity="0"/></radialGradient>
                <linearGradient id="galaxyLink" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#60a5fa" stopOpacity=".75"/><stop offset="1" stopColor="#38bdf8" stopOpacity=".08"/></linearGradient>
                <filter id="starGlow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>

              {stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#dbeafe" opacity={i % 4 === 0 ? .85 : .45} className="animate-subtle-pulse" style={{ animationDelay: s.delay }} />)}

              <circle cx={centerX} cy={centerY} r="105" fill="url(#galaxyCore)" className="animate-pulse" />
              <circle cx={centerX} cy={centerY} r="135" fill="none" stroke="#60a5fa" strokeOpacity=".12" strokeDasharray="2 9" />
              <circle cx={centerX} cy={centerY} r="180" fill="none" stroke="#38bdf8" strokeOpacity=".08" strokeDasharray="3 14" />

              {childComplaints.map((c, i) => {
                const angle = (i * 2 * Math.PI) / total - Math.PI / 2;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                return <line key={`link-${c.id}`} x1={centerX} y1={centerY} x2={x} y2={y} stroke="url(#galaxyLink)" strokeWidth="1.5" strokeDasharray="4 6" opacity=".7" />;
              })}

              <g onClick={() => onSelectMaster(masterIssue)} className="cursor-pointer">
                <circle cx={centerX} cy={centerY} r="63" fill="#0b2b61" stroke="#60a5fa" strokeWidth="2" filter="url(#starGlow)" />
                <circle cx={centerX} cy={centerY} r="48" fill="#0f3b82" opacity=".85" />
                <text x={centerX} y={centerY-8} textAnchor="middle" fill="white" fontSize="12" fontWeight="900">{masterIssue.master_case_id}</text>
                <text x={centerX} y={centerY+10} textAnchor="middle" fill="#bfdbfe" fontSize="10" fontWeight="800">MASTER ISSUE</text>
                <text x={centerX} y={centerY+26} textAnchor="middle" fill="#93c5fd" fontSize="8" fontWeight="700">{childComplaints.length} connected complaints</text>
              </g>

              {childComplaints.map((c, i) => {
                const angle = (i * 2 * Math.PI) / total - Math.PI / 2;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                const isSelected = selected?.id === c.id;
                return <g key={c.id} onClick={() => { setSelected(c); onSelectComplaint(c); }} className="cursor-pointer">
                  <circle cx={x} cy={y} r={isSelected ? 18 : 13} fill={isSelected ? '#fef08a' : '#dbeafe'} stroke={isSelected ? '#fde047' : '#60a5fa'} strokeWidth="2" filter="url(#starGlow)" className="transition-all duration-300" />
                  <circle cx={x} cy={y} r="4" fill="#2563eb" />
                  <text x={x} y={y+29} textAnchor="middle" fill="#bfdbfe" fontSize="8" fontWeight="800">{c.resident_flat || 'Flat'}</text>
                </g>;
              })}
            </svg>
          </div>

          <div className="border-t border-white/10 bg-black/10 p-4 sm:p-5">
            {selected ? <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><div className="flex items-center gap-2"><Star className="w-4 h-4 text-yellow-300"/><span className="font-black text-sm">Flat {selected.resident_flat} · {selected.resident_name}</span><span className="text-[10px] text-blue-200/50">{selected.case_id}</span></div><p className="text-xs text-blue-100/65 mt-1">{selected.original_message}</p></div><button onClick={() => setSelected(null)} className="p-2 rounded-xl bg-white/5 text-blue-100"><X className="w-4 h-4"/></button></div> : <div className="flex items-center gap-2 text-xs text-blue-100/60"><Info className="w-4 h-4 text-blue-300"/> Click a complaint star to inspect the resident case, flat and original report.</div>}
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 mt-4">
          <div className="rounded-2xl border border-blue-200/10 bg-white/[.03] p-4"><div className="text-[10px] uppercase tracking-wider text-blue-200/50 font-black">Connected complaints</div><div className="text-2xl font-black mt-1">{childComplaints.length}</div></div>
          <div className="rounded-2xl border border-blue-200/10 bg-white/[.03] p-4"><div className="text-[10px] uppercase tracking-wider text-blue-200/50 font-black">Unique flats</div><div className="text-2xl font-black mt-1">{new Set(childComplaints.map(c => c.resident_flat)).size}</div></div>
          <div className="rounded-2xl border border-blue-200/10 bg-white/[.03] p-4"><div className="text-[10px] uppercase tracking-wider text-blue-200/50 font-black">Priority</div><div className="text-2xl font-black mt-1 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-300"/>{masterIssue.urgency}</div></div>
        </div>
      </div>
    </div>
  );
};