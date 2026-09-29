import React, { useMemo, useState } from 'react';
import { Activity, Building2, CheckCircle2, ChevronDown, ChevronRight, MapPin, Users, UserRound, Wrench } from 'lucide-react';
import { Complaint, UserAccount } from '../types';

interface Props { complaints: Complaint[]; currentUser: UserAccount; mode: 'ongoing'|'solved'; onOpenIssue: (complaint: Complaint) => void; }

const normalize = (s:string) => s.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

export const SocietyIssueDirectory: React.FC<Props> = ({ complaints, currentUser, mode, onOpenIssue }) => {
  const [selectedGroup, setSelectedGroup] = useState<string|null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<string|null>(null);
  const list = useMemo(() => complaints.filter(c => mode === 'ongoing' ? c.status !== 'RESOLVED' : c.status === 'RESOLVED'), [complaints, mode]);
  const groups = useMemo(() => {
    const map = new Map<string, Complaint[]>();
    list.forEach(c => {
      const key = c.category || 'Other';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(c);
    });
    return [...map.entries()].sort((a,b)=>b[1].length-a[1].length);
  }, [list]);
  const title = mode === 'ongoing' ? 'Ongoing Issues' : 'Solved Issues';
  const subtitle = mode === 'ongoing' ? 'See what residents are currently facing across the society.' : 'See issues that have been resolved and verified or are awaiting resident confirmation.';
  const accent = mode === 'ongoing' ? 'rose' : 'emerald';
  const group = selectedGroup ? groups.find(([key])=>key===selectedGroup)?.[1] || [] : [];
  const selected = selectedComplaint ? list.find(c=>c.id===selectedComplaint) : null;

  return <div className="motion-page max-w-6xl mx-auto px-4 sm:px-6 py-7 sm:py-10">
    <section className={`rounded-[30px] p-6 sm:p-8 text-white shadow-[0_20px_60px_rgba(244,63,94,.14)] bg-gradient-to-br ${mode==='ongoing'?'from-rose-600 via-rose-500 to-pink-500':'from-emerald-600 via-emerald-500 to-teal-500'}`}>
      <div className="flex items-center gap-3"><div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center"><Activity className="w-6 h-6"/></div><div><div className="text-[10px] uppercase tracking-widest font-black text-white/75">Society overview</div><h1 className="text-2xl sm:text-3xl font-black">{title}</h1></div></div>
      <p className="mt-4 text-sm text-white/80 max-w-2xl">{subtitle}</p>
      <div className="mt-5 flex flex-wrap gap-2"><span className="px-3 py-1.5 rounded-full bg-white/15 text-xs font-bold">{list.length} total reports</span><span className="px-3 py-1.5 rounded-full bg-white/15 text-xs font-bold">{groups.length} issue types</span></div>
    </section>

    <section className="mt-6">
      <div className="flex items-end justify-between gap-3 mb-4"><div><div className="text-[10px] uppercase tracking-widest font-black text-rose-500">Issue boxes</div><h2 className="text-xl font-black mt-1">Issues reported by residents</h2></div><div className="text-xs text-slate-400">Click an issue to see affected residents</div></div>
      {groups.length===0 ? <div className="bg-white rounded-[26px] border border-rose-100 p-12 text-center"><CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500"/><h3 className="font-black mt-3">No {mode} issues</h3><p className="text-sm text-slate-500 mt-1">There are no reports in this section right now.</p></div> : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{groups.map(([category,items])=> <button key={category} onClick={()=>{setSelectedGroup(category);setSelectedComplaint(null)}} className={`text-left bg-white rounded-[26px] border p-5 card-lift transition-all ${selectedGroup===category?'border-rose-400 ring-2 ring-rose-100':'border-rose-100 hover:border-rose-200'}`}><div className="flex items-center justify-between"><div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${mode==='ongoing'?'bg-rose-50 text-rose-600':'bg-emerald-50 text-emerald-600'}`}><Wrench className="w-5 h-5"/></div><ChevronRight className="w-5 h-5 text-slate-300"/></div><h3 className="mt-5 font-black text-slate-900">{category}</h3><div className="flex items-center gap-2 mt-2 text-sm text-slate-500"><Users className="w-4 h-4"/><span><strong className="text-slate-900">{items.length}</strong> {items.length===1?'person':'people'} reported this issue</span></div><div className="mt-4 h-2 rounded-full bg-slate-100 overflow-hidden"><div className={`h-full rounded-full ${mode==='ongoing'?'bg-rose-500':'bg-emerald-500'}`} style={{width:`${Math.min(100,items.length*18+18)}%`}}/></div></button>)}</div>}
    </section>

    {selectedGroup && <section className="mt-6 bg-white rounded-[28px] border border-rose-100 shadow-sm overflow-hidden"><div className="p-5 border-b border-rose-100 flex items-center justify-between gap-3"><div><div className="text-[10px] uppercase tracking-widest font-black text-rose-500">{selectedGroup}</div><h2 className="text-lg font-black mt-1">{group.length} affected {group.length===1?'resident':'residents'}</h2></div><button onClick={()=>setSelectedGroup(null)} className="text-xs font-bold text-slate-400 hover:text-rose-600">Close</button></div><div className="divide-y divide-slate-100">{group.map(c=><button key={c.id} onClick={()=>setSelectedComplaint(c.id)} className="w-full text-left p-4 sm:p-5 hover:bg-rose-50/40 transition-colors flex items-center gap-4"><div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0"><UserRound className="w-5 h-5"/></div><div className="min-w-0 flex-1"><div className="font-bold text-sm text-slate-900">{c.resident_name}</div><div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-2"><span>{c.wing}</span><span>•</span><span>Flat {c.resident_flat}</span><span>•</span><span>{c.location_detail || `${c.wing}, Flat ${c.resident_flat}`}</span></div><div className="text-xs text-slate-600 mt-2 line-clamp-1">{c.normalized_summary}</div></div><ChevronRight className="w-4 h-4 text-slate-300"/></button>)}</div></section>}

    {selected && <section className="mt-4 bg-white rounded-[26px] border-2 border-rose-200 p-5 sm:p-6 shadow-[0_14px_45px_rgba(244,63,94,.08)]"><div className="flex flex-wrap items-start justify-between gap-4"><div><div className="text-[10px] uppercase tracking-widest font-black text-rose-500">Resident & issue details</div><h2 className="text-lg font-black mt-1">{selected.normalized_summary}</h2></div><button onClick={()=>onOpenIssue(selected)} className="px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-black">Open full issue</button></div><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5"><div className="rounded-2xl bg-rose-50 p-4"><UserRound className="w-4 h-4 text-rose-600"/><div className="text-[10px] uppercase font-black text-slate-400 mt-3">Resident</div><div className="text-sm font-black mt-1">{selected.resident_name}</div></div><div className="rounded-2xl bg-rose-50 p-4"><Building2 className="w-4 h-4 text-rose-600"/><div className="text-[10px] uppercase font-black text-slate-400 mt-3">Address</div><div className="text-sm font-black mt-1">{selected.wing}, Flat {selected.resident_flat}</div></div><div className="rounded-2xl bg-rose-50 p-4"><MapPin className="w-4 h-4 text-rose-600"/><div className="text-[10px] uppercase font-black text-slate-400 mt-3">Location</div><div className="text-sm font-black mt-1">{selected.location_detail || 'Society premises'}</div></div><div className="rounded-2xl bg-rose-50 p-4"><Activity className="w-4 h-4 text-rose-600"/><div className="text-[10px] uppercase font-black text-slate-400 mt-3">Status</div><div className="text-sm font-black mt-1">{selected.status.replace('_',' ')}</div></div></div><div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-100"><div className="text-xs font-black text-slate-700">Original report</div><p className="text-sm text-slate-600 mt-2 leading-6">{selected.original_message}</p></div></section>}
  </div>;
};