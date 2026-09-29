import React, { useMemo, useState } from 'react';
import { Activity, BarChart3, ChevronRight, Megaphone, MessageCircle, ListChecks, ShieldAlert, X, Orbit } from 'lucide-react';
import { Complaint, MasterIssue, UserAccount } from '../types';

interface CommandCenterProps {
  complaints: Complaint[];
  masterIssues: MasterIssue[];
  currentUser: UserAccount;
  onOpenIssue: (c: Complaint) => void;
  onOpenMaster: (m: MasterIssue) => void;
  onOpenTwoMinuteTriage: () => void;
  onOpenResolution: (c: Complaint) => void;
  onRefresh: () => void;
  tab?: string;
}

const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, ' ');

const go = (tab: string) => {
  document.body.dataset.page = tab === 'home' ? 'home' : tab;
  window.dispatchEvent(new CustomEvent('sb-admin-nav', { detail: tab }));
};

export const CommandCenter: React.FC<CommandCenterProps> = ({ complaints, onOpenIssue, tab }) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  // App currently mounts one CommandCenter for both admin Dashboard and Issues.
  // PortalNav sets body.dataset.page synchronously before calling onTab(), so use
  // that value when App does not pass the optional tab prop. This prevents the
  // Dashboard/Issues views from appearing one step behind or always showing Dashboard.
  const activeTab = tab || document.body.dataset.page || 'dashboard';
  const isIssues = activeTab === 'issues';

  const grouped = useMemo(() => {
    const map = new Map<string, { key: string; title: string; category: string; complaints: Complaint[] }>();
    complaints.forEach(c => {
      const title = (c.normalized_summary || c.original_message || c.category || 'Society issue').trim();
      const key = normalize(title);
      const existing = map.get(key);
      if (existing) existing.complaints.push(c);
      else map.set(key, { key, title, category: c.category || 'General', complaints: [c] });
    });
    return [...map.values()].sort((a, b) => b.complaints.length - a.complaints.length || a.category.localeCompare(b.category));
  }, [complaints]);

  const categories = useMemo(() => {
    const map = new Map<string, typeof grouped>();
    grouped.forEach(item => {
      const key = item.category || 'General';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    });
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [grouped]);

  const selected = grouped.find(g => g.key === selectedKey) || null;
  const active = complaints.filter(c => c.status !== 'RESOLVED').length;
  const resolved = complaints.filter(c => c.status === 'RESOLVED').length;

  if (isIssues) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-left">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 text-[11px] font-black uppercase tracking-wider"><ListChecks className="w-3.5 h-3.5" /> Society issues</div>
            <h1 className="text-3xl font-black text-slate-900 mt-3">Issues</h1>
            <p className="text-sm text-slate-500 mt-1">Grouped by type. Click an issue to see how many residents reported it and their flat numbers.</p>
          </div>
          <div className="flex gap-2 text-xs font-bold"><span className="px-3 py-2 rounded-xl bg-rose-50 text-rose-600">{active} ongoing</span><span className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-600">{resolved} solved</span></div>
        </div>
        <div className="space-y-7">
          {categories.map(([category, items]) => (
            <section key={category}>
              <div className="flex items-center gap-2 mb-2.5"><span className="w-2 h-2 rounded-full bg-rose-500" /><h2 className="text-sm font-black uppercase tracking-wider text-slate-700">{category}</h2><span className="text-[10px] font-bold text-slate-400">{items.length} issue types</span></div>
              <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
                {items.map(item => (
                  <button key={item.key} onClick={() => setSelectedKey(item.key)} className="w-full text-left px-4 sm:px-5 py-4 hover:bg-rose-50/50 transition-all flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0"><ShieldAlert className="w-5 h-5" /></div>
                    <div className="min-w-0 flex-1"><div className="font-bold text-sm text-slate-900 truncate">{item.title}</div><div className="text-xs text-slate-500 mt-1">{item.complaints.length} resident{item.complaints.length === 1 ? '' : 's'} reported this issue</div></div>
                    <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-slate-400 group-hover:text-rose-600">View residents <ChevronRight className="w-4 h-4" /></span><ChevronRight className="w-5 h-5 text-slate-300 sm:hidden" />
                  </button>
                ))}
              </div>
            </section>
          ))}
          {categories.length === 0 && <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-sm text-slate-500">No issues available yet.</div>}
        </div>
        {selected && <IssuePeopleModal issue={selected} onClose={() => setSelectedKey(null)} onOpenIssue={onOpenIssue} />}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-left">
      <div className="mb-7">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 text-[11px] font-black uppercase tracking-wider"><Activity className="w-3.5 h-3.5" /> Admin workspace</div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Choose a workspace. Detailed operational data stays inside its dedicated section.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminBox icon={<BarChart3 />} title="Insights" subtitle="AI patterns and analytics" onClick={() => go('insights')} />
        <AdminBox icon={<Orbit />} title="Issue Galaxy" subtitle="Complaints as a connected constellation" onClick={() => go('galaxy')} dark />
        <AdminBox icon={<Megaphone />} title="Society Notices" subtitle="Create and publish resident notices" onClick={() => go('notices')} />
        <AdminBox icon={<MessageCircle />} title="Society Chat" subtitle="Community conversation" onClick={() => go('chat')} />
      </div>
    </div>
  );
};

const AdminBox: React.FC<{ icon: React.ReactNode; title: string; subtitle: string; onClick: () => void; dark?: boolean }> = ({ icon, title, subtitle, onClick, dark }) => (
  <button onClick={onClick} className={`group text-left rounded-[28px] p-5 border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${dark ? 'bg-[#071a3d] border-[#17345f] text-white shadow-lg shadow-blue-950/20' : 'bg-white border-rose-100 text-slate-900 shadow-sm'}`}>
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${dark ? 'bg-blue-400/15 text-blue-200' : 'bg-rose-50 text-rose-600'}`}>{React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' })}</div>
    <div className="mt-6 flex items-center justify-between gap-3"><div><div className="font-black text-base">{title}</div><div className={`text-xs mt-1 ${dark ? 'text-blue-100/70' : 'text-slate-500'}`}>{subtitle}</div></div><ChevronRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${dark ? 'text-blue-200' : 'text-slate-300'}`} /></div>
  </button>
);

const IssuePeopleModal: React.FC<{ issue: { title: string; category: string; complaints: Complaint[] }; onClose: () => void; onOpenIssue: (c: Complaint) => void }> = ({ issue, onClose, onOpenIssue }) => (
  <div className="fixed inset-0 z-[80] bg-slate-950/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-3" onClick={onClose}>
    <div className="w-full max-w-2xl max-h-[88vh] overflow-y-auto bg-white rounded-[28px] shadow-2xl" onClick={e => e.stopPropagation()}>
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-100 p-5 flex items-start justify-between gap-4"><div><div className="text-[10px] uppercase tracking-wider font-black text-rose-500">{issue.category}</div><h2 className="text-xl font-black mt-1 text-slate-900">{issue.title}</h2><div className="text-xs text-slate-500 mt-1">{issue.complaints.length} resident{issue.complaints.length === 1 ? '' : 's'} reported this issue</div></div><button onClick={onClose} className="p-2 rounded-xl bg-slate-100 text-slate-600"><X className="w-5 h-5" /></button></div>
      <div className="p-5 space-y-2">{issue.complaints.map(c => <button key={c.id} onClick={() => onOpenIssue(c)} className="w-full text-left rounded-2xl border border-slate-100 p-4 hover:border-rose-200 hover:bg-rose-50/40 transition-all flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-black shrink-0">{c.resident_name?.charAt(0) || 'R'}</div><div className="min-w-0 flex-1"><div className="font-black text-sm text-slate-900">{c.resident_name || 'Resident'}</div><div className="text-xs text-slate-500 mt-1">{c.wing || '—'} · Flat {c.resident_flat || '—'} · {c.status}</div></div><ChevronRight className="w-4 h-4 text-slate-300" /></button>)}</div>
    </div>
  </div>
);