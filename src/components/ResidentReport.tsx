import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Camera, 
  MapPin, 
  Sparkles, 
  Send, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  FileText, 
  Check, 
  ArrowRight,
  RefreshCw,
  X
} from 'lucide-react';
import { AITriageResult, analyzeComplaintNLP } from '../services/aiEngine';
import { api } from '../services/api';
import { Category, Urgency, UserAccount } from '../types';
import confetti from 'canvas-confetti';

interface ResidentReportProps {
  currentUser: UserAccount;
  onSubmitSuccess: (caseId: string) => void;
  onViewCase: (caseId: string) => void;
}

const PRESET_PROMPTS = [
  {
    label: 'Lift + Elderly (Judge Demo 1)',
    text: 'Lift B subah se band hai aur 7th floor pe elderly log hain.',
    wing: 'B Wing',
    flat: 'B-702'
  },
  {
    label: 'Water Disruption (Hinglish)',
    text: 'B wing mein paani nahi aa raha 2 din se, taps are dry.',
    wing: 'B Wing',
    flat: 'B-402'
  },
  {
    label: 'Water Leakage (Hazard)',
    text: 'Water leakage from ceiling in B wing corridor right outside flat 402 near electric meter!',
    wing: 'B Wing',
    flat: 'B-402'
  },
  {
    label: 'Ambiguous (Low Confidence Test)',
    text: 'Car parked near security gate blocked guard\'s view and access barrier.',
    wing: 'C Wing',
    flat: 'C-102'
  }
];

const PRESET_PHOTOS = [
  {
    name: 'Water Leak',
    url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Elevator Outage',
    url: 'https://images.unsplash.com/photo-1546768292-fb12f6c92568?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Blocked Parking',
    url: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80'
  }
];

export const ResidentReport: React.FC<ResidentReportProps> = ({
  currentUser,
  onSubmitSuccess,
  onViewCase
}) => {
  const [complaintText, setComplaintText] = useState('');
  const [selectedWing, setSelectedWing] = useState(currentUser.wing || 'B Wing');
  const [selectedFlat, setSelectedFlat] = useState(currentUser.flat || 'B-402');
  const [attachedPhoto, setAttachedPhoto] = useState<string | null>(null);

  // Voice recording state
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // AI Pipeline sequence states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [aiResult, setAiResult] = useState<AITriageResult | null>(null);
  const [showDecisionFactors, setShowDecisionFactors] = useState(false);

  // Manual Edit override state
  const [isEditing, setIsEditing] = useState(false);
  const [overrideCategory, setOverrideCategory] = useState<Category | null>(null);
  const [overrideUrgency, setOverrideUrgency] = useState<Urgency | null>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCaseId, setSubmittedCaseId] = useState<string | null>(null);

  const analysisSteps = [
    'Understanding message',
    'Detecting language',
    'Identifying issue',
    'Checking similar complaints',
    'Assessing urgency',
    'Estimating impact',
    'Preparing recommended action'
  ];

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setComplaintText(prev => prev ? `${prev} ${transcript}` : transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your complaint.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleAnalyze = async () => {
    if (!complaintText.trim()) return;

    setIsAnalyzing(true);
    setAnalysisStep(0);
    setAiResult(null);
    setSubmittedCaseId(null);
    setIsEditing(false);

    // Sequence simulation for realistic visual polish
    for (let i = 0; i < analysisSteps.length; i++) {
      setAnalysisStep(i);
      await new Promise(r => setTimeout(r, 220));
    }

    try {
      const result = await api.triageComplaint(complaintText, {
        wing: selectedWing,
        flat: selectedFlat,
        resident_name: currentUser.name
      });
      setAiResult(result);
      setOverrideCategory(result.category);
      setOverrideUrgency(result.urgency);
    } catch (err) {
      // Local fallback
      const fallback = analyzeComplaintNLP(complaintText, {
        wing: selectedWing,
        flat: selectedFlat,
        resident_name: currentUser.name
      });
      setAiResult(fallback);
      setOverrideCategory(fallback.category);
      setOverrideUrgency(fallback.urgency);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!aiResult) return;
    setIsSubmitting(true);

    try {
      const created = await api.createComplaint({
        original_message: complaintText,
        resident_name: currentUser.name,
        resident_flat: selectedFlat,
        wing: selectedWing,
        location_detail: `${selectedWing} Floor`,
        photo_url: attachedPhoto || undefined,
        category_override: overrideCategory || aiResult.category,
        urgency_override: overrideUrgency || aiResult.urgency,
        ai_data: aiResult
      });

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });

      setSubmittedCaseId(created.case_id);
      onSubmitSuccess(created.case_id);
    } catch (err) {
      console.error(err);
      alert('Failed to submit complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setComplaintText('');
    setAiResult(null);
    setAttachedPhoto(null);
    setSubmittedCaseId(null);
    setIsEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      
      {/* Submitted Success Confirmation Screen */}
      {submittedCaseId ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-elevated text-center animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900">
            Complaint Registered Successfully
          </h2>
          
          <div className="inline-block mt-3 px-3 py-1 bg-violet-50 border border-violet-200 rounded-full font-mono text-sm font-bold text-violet-700">
            Case ID: {submittedCaseId}
          </div>

          <p className="mt-4 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Your complaint has been triaged by SHIKAYAT BOX AI, categorized as <strong className="text-slate-800">{overrideCategory || aiResult?.category}</strong> with <strong className="text-slate-800">{overrideUrgency || aiResult?.urgency}</strong> priority, and dispatched to the committee maintenance queue.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onViewCase(submittedCaseId)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Track Resolution Status</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={resetForm}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
            >
              Submit Another Issue
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Main Headline & Intro */}
          <div className="text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              What's wrong?
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Tell us in your own words. We'll organize the rest.
            </p>
          </div>

          {/* Quick-fill preset chips for quick evaluation */}
          <div className="bg-slate-100/70 p-3 rounded-xl border border-slate-200">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-violet-600" />
              <span>1-Click Test Prompts (English / Hindi / Hinglish)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESET_PROMPTS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setComplaintText(preset.text);
                    setSelectedWing(preset.wing);
                    setSelectedFlat(preset.flat);
                    setAiResult(null);
                  }}
                  className="px-2.5 py-1 text-xs bg-white hover:bg-violet-50 hover:text-violet-700 border border-slate-200/90 rounded-lg text-slate-700 transition-colors shadow-2xs font-medium text-left"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 relative">
            <textarea
              rows={4}
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
              placeholder="Describe what happened in English, Hindi, or Hinglish... (e.g. Lift subah se band hai aur 7th floor pe elderly log hain)"
              className="w-full text-slate-800 placeholder-slate-400 text-sm focus:outline-none resize-none"
            />

            {/* Attached Photo Preview */}
            {attachedPhoto && (
              <div className="relative inline-block mt-2 mb-3">
                <img 
                  src={attachedPhoto} 
                  alt="Attachment" 
                  className="w-24 h-24 object-cover rounded-xl border border-slate-200 shadow-xs"
                />
                <button
                  onClick={() => setAttachedPhoto(null)}
                  className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white p-0.5 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Action Bar: Mic, Photo, Location */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                
                {/* Voice Input */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isListening 
                      ? 'bg-red-50 text-red-700 border border-red-300 animate-pulse' 
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                  }`}
                  title="Speak in English or Hindi"
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5 text-red-600" /> : <Mic className="w-3.5 h-3.5 text-slate-600" />}
                  <span>{isListening ? 'Listening...' : 'Speak'}</span>
                </button>

                {/* Photo Dropdown preset */}
                <div className="relative group">
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200/80 text-slate-700 flex items-center gap-1.5 transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5 text-slate-600" />
                    <span>Add Photo</span>
                  </button>
                  <div className="hidden group-hover:block absolute left-0 bottom-full mb-1 w-44 bg-white border border-slate-200 rounded-xl shadow-elevated p-1 z-30">
                    <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase">Sample Evidence</div>
                    {PRESET_PHOTOS.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => setAttachedPhoto(p.url)}
                        className="w-full text-left px-2 py-1 text-xs text-slate-700 hover:bg-violet-50 hover:text-violet-700 rounded-md"
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Wing & Flat Location picker */}
                <div className="flex items-center gap-1 text-xs text-slate-600 bg-slate-100 px-2.5 py-1.5 rounded-lg">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <select 
                    value={selectedWing}
                    onChange={(e) => setSelectedWing(e.target.value)}
                    className="bg-transparent font-medium focus:outline-none cursor-pointer"
                  >
                    <option value="A Wing">A Wing</option>
                    <option value="B Wing">B Wing</option>
                    <option value="C Wing">C Wing</option>
                    <option value="D Wing">D Wing</option>
                  </select>
                  <span>•</span>
                  <input
                    type="text"
                    value={selectedFlat}
                    onChange={(e) => setSelectedFlat(e.target.value)}
                    className="w-14 bg-transparent font-medium focus:outline-none"
                    placeholder="B-402"
                  />
                </div>

              </div>

              {/* Analyze Button */}
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={!complaintText.trim() || isAnalyzing}
                className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold text-xs shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}</span>
              </button>
            </div>
          </div>

          {/* SECTION 15: AI Processing Sequence */}
          {isAnalyzing && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-6 rounded-full border-2 border-violet-600 border-t-transparent animate-spin" />
                <span className="text-sm font-bold text-slate-800">
                  Analyzing complaint...
                </span>
              </div>
              
              <div className="space-y-2">
                {analysisSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    {idx < analysisStep ? (
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : idx === analysisStep ? (
                      <span className="w-4 h-4 rounded-full border border-violet-600 border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-200 shrink-0" />
                    )}
                    <span className={idx <= analysisStep ? 'font-medium text-slate-800' : 'text-slate-400'}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 15 & 16: AI Understood Card */}
          {aiResult && !isAnalyzing && (
            <div className="space-y-4 animate-in fade-in duration-300">
              
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 text-left">
                
                {/* Header bar with language detection */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      AI UNDERSTOOD
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 capitalize">
                      Detected language: <span className="font-bold text-slate-900">{aiResult.language}</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-violet-50 text-violet-700 border border-violet-200/60">
                      Confidence: {aiResult.confidence}%
                    </span>
                  </div>
                </div>

                {/* SECTION 17: Low Confidence Override Warning */}
                {aiResult.low_confidence_options && (
                  <div className="my-4 p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>⚠ AI isn't fully certain</span>
                    </div>
                    <p className="text-amber-800 mb-3">
                      This complaint could refer to either Parking obstruction or Security barrier protocols. Please confirm:
                    </p>
                    <div className="flex items-center gap-2">
                      {aiResult.low_confidence_options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setOverrideCategory(opt.category);
                            setAiResult(prev => prev ? { ...prev, category: opt.category, confidence: 90 } : null);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            overrideCategory === opt.category 
                              ? 'bg-amber-600 text-white shadow-xs' 
                              : 'bg-white border border-amber-300 text-amber-900 hover:bg-amber-100'
                          }`}
                        >
                          Confirm {opt.category} ({opt.confidence}%)
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Primary AI Grid Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-4">
                  <div>
                    <div className="text-[11px] text-slate-500">Issue</div>
                    <div className="text-sm font-bold text-slate-900">{aiResult.normalized_summary}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500">Category</div>
                    <div className="text-sm font-bold text-slate-900">{overrideCategory || aiResult.category}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500">Urgency</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`px-2 py-0.5 rounded-md text-xs font-extrabold ${
                        (overrideUrgency || aiResult.urgency) === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                        (overrideUrgency || aiResult.urgency) === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                        (overrideUrgency || aiResult.urgency) === 'MEDIUM' ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {overrideUrgency || aiResult.urgency}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500">Affected Area</div>
                    <div className="text-sm font-bold text-slate-900">{selectedWing}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500">Estimated Impact</div>
                    <div className="text-sm font-bold text-slate-900">~{aiResult.estimated_affected_flats} flats</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500">Suggested SLA</div>
                    <div className="text-sm font-bold text-violet-700 font-mono">{aiResult.suggested_sla_hours} hours</div>
                  </div>
                </div>

                {/* SECTION 16: "Why HIGH?" Explanation */}
                <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs font-bold text-slate-900 mb-2 flex items-center justify-between">
                    <span>Why {aiResult.urgency}?</span>
                    <button
                      type="button"
                      onClick={() => setShowDecisionFactors(!showDecisionFactors)}
                      className="text-violet-600 hover:text-violet-800 text-[11px] flex items-center gap-0.5 font-medium"
                    >
                      <span>Why did AI decide this?</span>
                      {showDecisionFactors ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>
                  
                  <ul className="text-xs text-slate-600 space-y-1">
                    {aiResult.ai_action_plan.why_urgency.map((reason, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-600" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>

                  {showDecisionFactors && (
                    <div className="mt-3 pt-3 border-t border-slate-200/80 text-xs text-slate-600">
                      <div className="font-semibold text-slate-800 mb-1">User-Facing Decision Factors:</div>
                      {aiResult.ai_action_plan.decision_factors.map((factor, i) => (
                        <div key={i} className="text-slate-600 py-0.5">• {factor}</div>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 pt-3 border-t border-slate-200/80 text-xs text-slate-700">
                    <span className="font-semibold text-slate-900">Recommended Action: </span>
                    {aiResult.ai_action_plan.recommended_action}
                  </div>
                </div>

                {/* Optional Manual Edit Override section */}
                {isEditing && (
                  <div className="mt-4 p-4 bg-violet-50/50 rounded-xl border border-violet-200 text-xs space-y-3">
                    <div className="font-bold text-slate-900">Manual Correction / Override:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-600 text-[11px] mb-1">Category</label>
                        <select
                          value={overrideCategory || aiResult.category}
                          onChange={(e) => setOverrideCategory(e.target.value as Category)}
                          className="w-full bg-white p-2 rounded-lg border border-slate-200 font-medium"
                        >
                          {['Water', 'Lift', 'Parking', 'Cleaning', 'Security', 'Electricity', 'Noise', 'Other'].map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-600 text-[11px] mb-1">Urgency</label>
                        <select
                          value={overrideUrgency || aiResult.urgency}
                          onChange={(e) => setOverrideUrgency(e.target.value as Urgency)}
                          className="w-full bg-white p-2 rounded-lg border border-slate-200 font-medium"
                        >
                          {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(urg => (
                            <option key={urg} value={urg}>{urg}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* SECTION 18: Smart Confirmation */}
              <div className="bg-white rounded-2xl border border-violet-200 shadow-card p-5 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-violet-700 uppercase tracking-wider mb-1">
                    Smart Confirmation
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    Here's what we understood: {aiResult.normalized_summary}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Location: {selectedWing}, Flat {selectedFlat} • Urgency: {overrideUrgency || aiResult.urgency}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    {isEditing ? 'Done Editing' : 'Edit'}
                  </button>

                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting}
                    className="px-5 py-2 text-xs font-semibold rounded-xl bg-violet-600 hover:bg-violet-700 text-white transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    {isSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    <span>Looks right — Submit</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
