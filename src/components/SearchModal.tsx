import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  ArrowRight, 
  Layers, 
  AlertCircle, 
  CheckCircle2, 
  Building2 
} from 'lucide-react';
import { Complaint } from '../types';
import { getUrgencyBadgeClasses } from '../utils/formatters';

interface SearchModalProps {
  complaints: Complaint[];
  isOpen: boolean;
  onClose: () => void;
  onSelectComplaint: (c: Complaint) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  complaints,
  isOpen,
  onClose,
  onSelectComplaint
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = complaints.filter(c => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      c.case_id.toLowerCase().includes(q) ||
      c.resident_name.toLowerCase().includes(q) ||
      c.resident_flat.toLowerCase().includes(q) ||
      c.wing.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.urgency.toLowerCase().includes(q) ||
      c.status.toLowerCase().includes(q) ||
      c.original_message.toLowerCase().includes(q) ||
      c.normalized_summary.toLowerCase().includes(q)
    );
  }).slice(0, 8);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4 text-left animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Case ID (WC-024), flat (B-402), resident, or complaint keywords..."
            className="w-full text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100">
          {results.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No matching complaints found for "{query}"
            </div>
          ) : (
            results.map(c => {
              const urgencyClasses = getUrgencyBadgeClasses(c.urgency);
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    onSelectComplaint(c);
                    onClose();
                  }}
                  className="p-3 hover:bg-violet-50/60 rounded-xl cursor-pointer transition-colors flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="font-mono font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded border border-violet-100">
                      {c.case_id}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${urgencyClasses.bg} ${urgencyClasses.text} ${urgencyClasses.border}`}>
                      {c.urgency}
                    </span>
                    <span className="font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {c.resident_flat}
                    </span>
                    <span className="text-slate-700 font-medium truncate">
                      {c.normalized_summary}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                    {c.status}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Press ESC to close</span>
          <span>{results.length} results</span>
        </div>

      </div>
    </div>
  );
};
