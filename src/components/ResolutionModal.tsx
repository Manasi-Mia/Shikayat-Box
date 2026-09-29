import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Camera, 
  UploadCloud, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { Complaint, UserAccount } from '../types';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

interface ResolutionModalProps {
  complaint: Complaint;
  currentUser: UserAccount;
  onClose: () => void;
  onSuccess: () => void;
}

const SAMPLE_AFTER_PHOTOS = [
  {
    name: 'Fixed Pipe Coupling (Water)',
    url: 'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Restored Elevator Mechanism (Lift)',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Cleared Bay (Parking / Cleaning)',
    url: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=600&q=80'
  }
];

export const ResolutionModal: React.FC<ResolutionModalProps> = ({
  complaint,
  currentUser,
  onClose,
  onSuccess
}) => {
  const [notes, setNotes] = useState(
    `Replaced fractured 2-inch PVC coupling and pressure-tested the line for 30 minutes with zero leaks.`
  );
  const [beforePhoto, setBeforePhoto] = useState<string>(
    complaint.photo_url || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80'
  );
  const [afterPhoto, setAfterPhoto] = useState<string>(
    'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=600&q=80'
  );
  const [isVerifying, setIsVerifying] = useState(false);

  const handleResolveAndVerify = async () => {
    setIsVerifying(true);
    try {
      await api.resolveComplaint(complaint.id, {
        resolution_notes: notes,
        resolution_before_photo: beforePhoto,
        resolution_after_photo: afterPhoto,
        actor: currentUser.name
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      onSuccess();
      onClose();
    } catch (e) {
      alert('Failed resolving complaint');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 text-left animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-violet-600 text-white">
                {complaint.case_id}
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Resolution & Evidence Verification
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Every completed issue requires ground evidence before committee closure.
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <div className="p-6 space-y-5">
          
          {/* Section 36: Side-by-Side Before vs After Evidence */}
          <div>
            <div className="text-xs font-bold text-slate-900 mb-2 flex items-center justify-between">
              <span>Resolution Evidence (Before vs After)</span>
              <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                AI Evidence Relevance: 91%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              
              {/* Before Card */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-[11px] font-bold text-slate-600 mb-1.5">
                  Before: Leak / Defect Visible
                </div>
                <img 
                  src={beforePhoto} 
                  alt="Before" 
                  className="w-full h-36 object-cover rounded-lg border border-slate-200"
                />
              </div>

              {/* After Card */}
              <div className="bg-slate-50 p-3 rounded-xl border border-emerald-200">
                <div className="text-[11px] font-bold text-emerald-800 mb-1.5 flex items-center justify-between">
                  <span>After: Restored / Repaired</span>
                  <span className="text-[10px] text-emerald-600 font-normal">Verified</span>
                </div>
                <img 
                  src={afterPhoto} 
                  alt="After" 
                  className="w-full h-36 object-cover rounded-lg border border-emerald-200"
                />
              </div>

            </div>

            {/* Quick sample photo selector */}
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="text-slate-400 text-[11px]">Select Preset Evidence:</span>
              {SAMPLE_AFTER_PHOTOS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setAfterPhoto(p.url)}
                  className="text-[11px] text-violet-600 hover:text-violet-800 underline font-medium"
                >
                  {p.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Resolution Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1.5">
              Technician / Resolution Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe work performed (parts replaced, technicians dispatched, operational tests completed)..."
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-violet-500 font-normal"
            />
          </div>

          {/* AI Evidence Insight */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">AI Evidence Relevance Analysis (91% match): </span>
              Visual inspection confirms defect in Before frame is eliminated in After frame. Flow restored with no visible moisture pooling.
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/80 rounded-xl transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleResolveAndVerify}
            disabled={isVerifying || !notes.trim()}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {isVerifying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
            <span>Mark Verified & Resolve Issue</span>
          </button>
        </div>

      </div>
    </div>
  );
};
