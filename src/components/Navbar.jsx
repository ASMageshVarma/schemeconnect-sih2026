import React from 'react';
import {
  Globe, Building2, MapPin, Calculator, Bot, Sparkles,
  Radio, Landmark, Zap, RefreshCw
} from 'lucide-react';

export function Navbar({ lang = "en", setLang, t, view, setView, isOnline, fontSize, setFontSize, onLogoClick }) {
  const isTa = lang === "ta";
  const isHi = lang === "hi";

  const L = (en, ta, hi) => isHi ? hi : (isTa ? ta : en);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Row 1: Brand + Portal Switcher + Controls */}
        <div className="h-16 flex items-center justify-between gap-2 sm:gap-3">

          {/* Brand Logo — clicks to reset session */}
          <div
            className="flex items-center space-x-2.5 cursor-pointer group shrink-0"
            onClick={onLogoClick || (() => setView('landing'))}
            title="Reset session & return home"
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
                <span className="text-[10px] font-black bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200/60 hidden sm:inline">
                  SIH26092
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold hidden lg:block">
                {L("Team TechTitans (SIH-9E972H)", "குழு: டெக் டைட்டன்ஸ் (SIH-9E972H)", "टीम टेकटाइटन्स (SIH-9E972H)")}
              </p>
            </div>
          </div>

          {/* ── Segmented Portal Workspace Switcher ── */}
          <div className="flex items-center bg-slate-100/90 p-1 rounded-2xl border border-slate-200 overflow-x-auto text-xs font-black gap-0.5">

            {/* SchemeConnect */}
            <button
              onClick={() => setView('recommendations')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 shrink-0 ${
                ['recommendations', 'landing', 'find-schemes', 'feed'].includes(view)
                  ? 'bg-white text-blue-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{L("SchemeConnect", "திட்டங்கள்", "स्कीमकनेक्ट")}</span>
            </button>

            {/* Calculator */}
            <button
              onClick={() => setView('calc')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 shrink-0 ${
                view === 'calc'
                  ? 'bg-white text-emerald-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-600" />
              <span>{L("🧮 Calculator", "🧮 கால்குலேட்டர்", "🧮 कैलकुलेटर")}</span>
            </button>

            {/* Alpha Portal */}
            <button
              onClick={() => setView('alpha-portal')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 shrink-0 ${
                view === 'alpha-portal'
                  ? 'bg-indigo-900 text-white shadow-xs'
                  : 'text-indigo-900 hover:bg-indigo-100/60'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
              <span>{L("Alpha Portal", "அரசு நிர்வாகம்", "अल्फा पोर्टल")}</span>
            </button>

            {/* Beta Portal */}
            <button
              onClick={() => setView('beta-portal')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 shrink-0 ${
                view === 'beta-portal'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-emerald-900 hover:bg-emerald-100/60'
              }`}
            >
              <Landmark className="w-3.5 h-3.5 text-emerald-600" />
              <span>{L("Beta Portal", "வங்கி அனுமதி", "बीटा पोर्टल")}</span>
            </button>

            {/* Judge Demo */}
            <button
              onClick={() => setView('demo-trio')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 shrink-0 ${
                view === 'demo-trio' || view === 'demo-split'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{L("⚡ Judge Demo", "⚡ நடுவர் நேரலை", "⚡ जज डेमो")}</span>
            </button>

          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-2 shrink-0">

            {/* 3-way Language Toggle */}
            <div className="flex items-center bg-blue-50 p-1 rounded-2xl border border-blue-200 text-xs font-bold">
              {[
                { code: "en", label: "EN" },
                { code: "ta", label: "தமிழ்" },
                { code: "hi", label: "हिं" }
              ].map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  className={`px-2.5 py-1 rounded-xl transition ${
                    lang === code
                      ? 'bg-blue-600 text-white shadow-xs font-black'
                      : 'text-blue-900 hover:bg-blue-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* AI Mitra Quick Access */}
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

        {/* Row 2: SchemeConnect Sub-Navigation */}
        {['recommendations', 'find-schemes', 'locator', 'calc', 'landing', 'counselor'].includes(view) && (
          <div className="py-2 border-t border-slate-100 flex items-center justify-between overflow-x-auto gap-3 text-xs font-bold">
            <div className="flex items-center space-x-1 shrink-0">
              <button
                onClick={() => setView('recommendations')}
                className={`px-3 py-1 rounded-lg transition ${view === 'recommendations' ? 'bg-blue-50 text-blue-700 font-black' : 'text-slate-500 hover:text-slate-900'}`}
              >
                {L("20 Schemes Grid", "20 திட்டங்கள்", "20 योजनाएँ")}
              </button>
              <button
                onClick={() => setView('find-schemes')}
                className={`px-3 py-1 rounded-lg transition flex items-center gap-1 ${view === 'find-schemes' ? 'bg-blue-50 text-blue-700 font-black' : 'text-slate-500 hover:text-slate-900'}`}
              >
                <span>🎙️ {L("Voice & OCR Intake", "குரல் / OCR பதிவு", "वॉयस और OCR")}</span>
              </button>
              <button
                onClick={() => setView('calc')}
                className={`px-3 py-1 rounded-lg transition flex items-center gap-1 ${view === 'calc' ? 'bg-emerald-50 text-emerald-700 font-black' : 'text-slate-500 hover:text-slate-900'}`}
              >
                <Calculator className="w-3 h-3 text-emerald-600" />
                <span>{L("Financial Calculator", "நிதி கால்குலேட்டர்", "वित्त कैलकुलेटर")}</span>
              </button>
              <button
                onClick={() => setView('locator')}
                className={`px-3 py-1 rounded-lg transition flex items-center gap-1 ${view === 'locator' ? 'bg-blue-50 text-blue-700 font-black' : 'text-slate-500 hover:text-slate-900'}`}
              >
                <MapPin className="w-3 h-3 text-emerald-600" />
                <span>{L("Bank Locator", "வங்கி வரைபடம்", "बैंक लोकेटर")}</span>
              </button>
            </div>

            {/* Demo Pitch Links */}
            <div className="flex items-center space-x-2 shrink-0">
              <span className="text-[10px] text-slate-400 font-bold uppercase hidden sm:block">
                {L("Pitch:", "நிகழ்வு:", "पिच:")}
              </span>
              <button onClick={() => setView('demo-split')}
                className="px-2.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-bold">
                2-Pane
              </button>
              <button onClick={() => setView('demo-trio')}
                className="px-2.5 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-md text-[11px] font-bold">
                3-Pane
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
