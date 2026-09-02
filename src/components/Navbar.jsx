import React from 'react';
import { 
  Globe, Building2, MapPin, LayoutDashboard, UserCheck, ShieldCheck, 
  Calculator, Bot, FileText, Sparkles, Radio, Laptop, Zap, Check, Landmark, ChevronDown 
} from 'lucide-react';

export function Navbar({ lang = "en", setLang, t, view, setView, isOnline, fontSize, setFontSize }) {
  const isTa = lang === "ta";

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Row 1: Brand, Ecosystem Pill Switchers, and Controls */}
        <div className="h-16 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand Logo */}
          <div 
            className="flex items-center space-x-2.5 cursor-pointer group shrink-0" 
            onClick={() => setView('landing')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 via-white to-green-600 p-0.5 shadow-sm">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-base tracking-tight text-slate-900 group-hover:text-blue-600 transition">
                  SchemeConnect
                </span>
                <span className="text-[10px] font-black bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200/60">
                  SIH26092
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold hidden sm:block">
                {isTa ? "குழு: டெக் டைட்டன்ஸ் (SIH-9E972H)" : "Team TechTitans (SIH-9E972H)"}
              </p>
            </div>
          </div>

          {/* Primary Portal Navigation Switcher (Segmented Control Pill) */}
          <div className="flex items-center bg-slate-100/90 p-1 rounded-2xl border border-slate-200 overflow-x-auto max-w-full text-xs font-black">
            
            {/* 1. SchemeConnect */}
            <button
              onClick={() => setView('recommendations')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 shrink-0 ${
                view === 'recommendations' || view === 'landing' || view === 'find-schemes' || view === 'feed'
                  ? 'bg-white text-blue-900 shadow-xs border border-slate-200/60' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{isTa ? "திட்டங்கள் (Citizen)" : "SchemeConnect"}</span>
            </button>

            {/* 2. Financial Calculator */}
            <button
              onClick={() => setView('calc')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 shrink-0 ${
                view === 'calc' 
                  ? 'bg-white text-blue-900 shadow-xs border border-slate-200/60' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isTa ? "🧮 கால்குலேட்டர்" : "🧮 Calculator"}</span>
            </button>

            {/* 3. Alpha Portal */}
            <button
              onClick={() => setView('alpha-portal')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 shrink-0 ${
                view === 'alpha-portal'
                  ? 'bg-indigo-900 text-white shadow-xs' 
                  : 'text-indigo-900 hover:bg-indigo-100/60'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>{isTa ? "அரசு நிர்வாகம்" : "Alpha Portal"}</span>
            </button>

            {/* 4. Beta Portal Bank */}
            <button
              onClick={() => setView('beta-portal')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 shrink-0 ${
                view === 'beta-portal'
                  ? 'bg-emerald-800 text-white shadow-xs' 
                  : 'text-emerald-900 hover:bg-emerald-100/60'
              }`}
            >
              <Landmark className="w-3.5 h-3.5 text-emerald-500" />
              <span>{isTa ? "வங்கி ஒப்புதல்" : "Beta Portal"}</span>
            </button>

            {/* 5. Judge Demo Studio */}
            <button
              onClick={() => setView('demo-trio')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 shrink-0 ${
                view === 'demo-trio' || view === 'demo-split'
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span>{isTa ? "⚡ நடுவர் நேரலை" : "⚡ Judge Demo"}</span>
            </button>

          </div>

          {/* Right Controls: Font Scaling & Language Switcher */}
          <div className="flex items-center space-x-2 shrink-0">
            
            {/* Language Toggle Button (EN / தமிழ்) */}
            <div className="flex items-center bg-blue-50 p-1 rounded-2xl border border-blue-200 text-xs font-bold">
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-xl transition ${
                  lang === 'en' 
                    ? 'bg-blue-600 text-white shadow-xs font-black' 
                    : 'text-blue-900 hover:bg-blue-100'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('ta')}
                className={`px-2.5 py-1 rounded-xl transition ${
                  lang === 'ta' 
                    ? 'bg-blue-600 text-white shadow-xs font-black' 
                    : 'text-blue-900 hover:bg-blue-100'
                }`}
              >
                தமிழ்
              </button>
            </div>

            {/* Quick AI Mitra Button */}
            <button
              onClick={() => setView('counselor')}
              className={`p-2 rounded-xl transition ${
                view === 'counselor'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-purple-50 hover:text-purple-700'
              }`}
              title="AI Mitra Welfare Assistant"
            >
              <Bot className="w-4 h-4" />
            </button>

          </div>

        </div>

        {/* Row 2: Sub-Navigation Bar for SchemeConnect Views */}
        {(view === 'recommendations' || view === 'find-schemes' || view === 'locator' || view === 'calc' || view === 'landing') && (
          <div className="py-2 border-t border-slate-100 flex items-center justify-between overflow-x-auto gap-3 text-xs font-bold">
            <div className="flex items-center space-x-1 shrink-0">
              <button
                onClick={() => setView('recommendations')}
                className={`px-3 py-1 rounded-lg transition ${
                  view === 'recommendations' ? 'bg-blue-50 text-blue-700 font-black' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {isTa ? "அனைத்து 20 திட்டங்கள்" : "20 Direct Schemes"}
              </button>
              
              <button
                onClick={() => setView('find-schemes')}
                className={`px-3 py-1 rounded-lg transition flex items-center gap-1 ${
                  view === 'find-schemes' ? 'bg-blue-50 text-blue-700 font-black' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>{isTa ? "🎙️ குரல் / ஆவண பதிவு" : "🎙️ Voice & OCR Intake"}</span>
              </button>

              <button
                onClick={() => setView('calc')}
                className={`px-3 py-1 rounded-lg transition flex items-center gap-1 ${
                  view === 'calc' ? 'bg-emerald-50 text-emerald-700 font-black' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Calculator className="w-3 h-3 text-emerald-600" />
                <span>{isTa ? "நிதி கால்குலேட்டர் (EMI)" : "Financial Calculator (EMI & Moratorium)"}</span>
              </button>

              <button
                onClick={() => setView('locator')}
                className={`px-3 py-1 rounded-lg transition flex items-center gap-1 ${
                  view === 'locator' ? 'bg-blue-50 text-blue-700 font-black' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <MapPin className="w-3 h-3 text-emerald-600" />
                <span>{isTa ? "வங்கி வரைபடம் (NPA Filter)" : "Bank Partner Locator"}</span>
              </button>
            </div>

            {/* Quick Demo Mode Links */}
            <div className="flex items-center space-x-2 shrink-0">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Pitch Views:</span>
              <button
                onClick={() => setView('demo-split')}
                className="px-2.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-bold"
              >
                2-Pane Split
              </button>
              <button
                onClick={() => setView('demo-trio')}
                className="px-2.5 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-md text-[11px] font-bold"
              >
                3-Pane Trio
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
