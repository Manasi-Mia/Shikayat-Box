import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  ShieldCheck, 
  Zap, 
  Users,
  Compass,
  Check
} from 'lucide-react';

interface LandingPageProps {
  onStartReport: () => void;
  onOpenDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartReport, onOpenDashboard }) => {
  const [animStage, setAnimStage] = useState<'messy' | 'analyzing' | 'unified'>('messy');

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimStage('analyzing'), 2500);
    const timer2 = setTimeout(() => setAnimStage('unified'), 4500);
    const loop = setInterval(() => {
      setAnimStage('messy');
      setTimeout(() => setAnimStage('analyzing'), 2500);
      setTimeout(() => setAnimStage('unified'), 4500);
    }, 9000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearInterval(loop);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-[#0F172A]">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        
        {/* Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-200/70 text-violet-700 text-xs font-semibold uppercase tracking-wider mb-6 shadow-xs animate-subtle-pulse">
          <span className="w-2 h-2 rounded-full bg-violet-600 inline-block" />
          Turn messy complaints into clear action
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.15]">
          From complaint chaos <br />
          <span className="text-violet-600">to clear action.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          <span className="font-semibold text-slate-900">SHIKAYAT BOX</span> helps housing societies understand, prioritize, group, and resolve resident issues before important complaints get buried.
        </p>

        {/* Primary CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onStartReport}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm shadow-md shadow-violet-200 hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Report an Issue</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
          
          <button
            onClick={onOpenDashboard}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Building2 className="w-4 h-4 text-violet-600" />
            <span>Open Committee Command Center</span>
          </button>
        </div>

        {/* Quick Society Metric Strip */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle">
            <div className="text-2xl font-bold font-mono text-slate-900">~104</div>
            <div className="text-xs text-slate-500 font-medium">Flats Supported</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle">
            <div className="text-2xl font-bold font-mono text-violet-600">94%</div>
            <div className="text-xs text-slate-500 font-medium">AI Triage Accuracy</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle">
            <div className="text-2xl font-bold font-mono text-amber-600">2-Min</div>
            <div className="text-xs text-slate-500 font-medium">Volunteer Triage Mode</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle">
            <div className="text-2xl font-bold font-mono text-emerald-600">100%</div>
            <div className="text-xs text-slate-500 font-medium">Verified Resolution</div>
          </div>
        </div>

        {/* SECTION 61: Interactive Hero Showcase */}
        <div className="mt-16 max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200/90 shadow-elevated p-6 sm:p-8 text-left relative overflow-hidden">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-600 animate-pulse" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  Live Intelligence Transformation
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Watch how informal resident chat messages are synthesized into one actionable Master Issue.
              </p>
            </div>
            
            {/* Interactive stage controls */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs self-start sm:self-auto font-medium">
              <button
                onClick={() => setAnimStage('messy')}
                className={`px-3 py-1 rounded-md transition-colors ${animStage === 'messy' ? 'bg-white shadow-xs text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-800'}`}
              >
                1. Messy Chat
              </button>
              <button
                onClick={() => setAnimStage('analyzing')}
                className={`px-3 py-1 rounded-md transition-colors ${animStage === 'analyzing' ? 'bg-white shadow-xs text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-800'}`}
              >
                2. AI Triage
              </button>
              <button
                onClick={() => setAnimStage('unified')}
                className={`px-3 py-1 rounded-md transition-colors ${animStage === 'unified' ? 'bg-white shadow-xs text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-800'}`}
              >
                3. Master Issue
              </button>
            </div>
          </div>

          {/* Dynamic Stage Canvas */}
          <div className="min-h-[260px] flex items-center justify-center">
            {animStage === 'messy' && (
              <div className="w-full space-y-3 animate-in fade-in duration-300">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Unorganized Incoming WhatsApp & Informal Chat Messages:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                    <span className="font-semibold text-slate-900">B-302 (7:14 AM):</span> "Paani nahi aa raha B wing mein. Tank khali hai kya?"
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                    <span className="font-semibold text-slate-900">B-504 (7:22 AM):</span> "B wing water pressure is very low, taps are running dry!"
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                    <span className="font-semibold text-slate-900">B-701 (7:35 AM):</span> "Water supply problem on 5th and 7th floor. Kitchen dry."
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                    <span className="font-semibold text-slate-900">B-203 (7:48 AM):</span> "बी विंग में पानी नहीं आ रहा है सुबह से। कृपया ठीक करें।"
                  </div>
                </div>
              </div>
            )}

            {animStage === 'analyzing' && (
              <div className="w-full max-w-md mx-auto text-center space-y-4 py-4 animate-in fade-in duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-100 text-violet-600 animate-spin">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">SHIKAYAT BOX AI Clustered 7 Similar Reports</div>
                  <div className="text-xs text-slate-500 mt-1">Cross-referencing Wing B coordinates • Severity weighting • Root cause mapping</div>
                </div>
                <div className="flex justify-center gap-2 text-[11px] font-mono text-violet-700">
                  <span className="bg-violet-50 px-2 py-0.5 rounded border border-violet-100">Language: Multilingual</span>
                  <span className="bg-violet-50 px-2 py-0.5 rounded border border-violet-100">Category: Water (96%)</span>
                  <span className="bg-violet-50 px-2 py-0.5 rounded border border-violet-100">Impact: 78/100</span>
                </div>
              </div>
            )}

            {animStage === 'unified' && (
              <div className="w-full bg-violet-50/60 rounded-xl border-2 border-violet-200 p-5 animate-in zoom-in-95 duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-violet-200/80">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-violet-600 text-white">
                      WC-M024
                    </span>
                    <span className="font-bold text-slate-900 text-sm sm:text-base">
                      Water supply disruption — B Wing
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200">
                      HIGH URGENCY
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-violet-100 text-violet-800 font-mono">
                      Impact: 78
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-3 text-xs">
                  <div>
                    <div className="text-slate-500 text-[11px]">Consolidated</div>
                    <div className="font-semibold text-slate-900">7 complaints</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[11px]">Affected Radius</div>
                    <div className="font-semibold text-slate-900">23 flats</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[11px]">Assigned Owner</div>
                    <div className="font-semibold text-slate-900">Rohan Sharma</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[11px]">Target SLA</div>
                    <div className="font-semibold text-emerald-700 font-mono">01:42:17 left</div>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-violet-100 text-xs text-slate-700 flex items-start gap-2">
                  <Zap className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900">AI Action Plan: </span>
                    Inspect B Wing riser line pressure, check booster motor breaker, and bleed air from upper floor manifolds.
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Built specifically for volunteer managing committees
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Managing 100 flats in 5 minutes a day. Turn chaotic messages into clear, verified civic resolutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-background border border-slate-200 hover:shadow-card transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center mb-4">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">
                Multilingual Conversational Input
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Accepts natural complaints in English, Hindi, and Hinglish. Supports voice input, photo attachments, and extracts location automatically.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-background border border-slate-200 hover:shadow-card transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">
                Duplicate Clustering & Master Issues
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Detects multiple reports describing the same underlying problem. Combines them into one Master Issue with interactive visual galaxy clustering.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-background border border-slate-200 hover:shadow-card transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">
                Verified Resolution & Resident Confirmation
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Zero fake one-click resolution. Before/after photo evidence analyzed by AI (91% relevance score) with resident feedback and automatic reopen handling.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-background border-t border-slate-200 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">SHIKAYAT</span>
            <span className="font-bold text-violet-600">BOX</span>
            <span>— Society Issue Intelligence & Resolution Center</span>
          </div>
          <div>
            Built with React, TypeScript & Tailwind CSS • 100% Production Ready
          </div>
        </div>
      </footer>

    </div>
  );
};
