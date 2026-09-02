import React from 'react';
import { 
  Globe, Building2, MapPin, LayoutDashboard, UserCheck, ShieldCheck, 
  Calculator, Bot, FileText, Sparkles, Radio, Laptop, Zap, Check, Landmark 
} from 'lucide-react';

export function Navbar({ lang = "en", setLang, t, view, setView, isOnline, fontSize, setFontSize }) {
  const isTa = lang === "ta";

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Emblem */}
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setView('landing')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 via-white to-green-600 p-0.5 shadow-sm">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-base tracking-tight text-slate-900 group-hover:text-blue-600 transition">
                SchemeConnect
              </span>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200/60">
                SIH26092
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium hidden md:block">
              {isTa ? "குழு: டெக் டைட்டன்ஸ் (SIH-9E972H)" : "Team TechTitans (SIH-9E972H)"}
            </p>
          </div>
        </div>

        {/* Center Multi-Portal Navigation Links */}
        <nav className="hidden xl:flex items-center space-x-1 text-xs font-bold">
          
          {/* Landing Page (/) */}
          <button
            onClick={() => setView('landing')}
            className={`px-3 py-1.5 rounded-xl transition ${
              view === 'landing' || view === 'home'
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {isTa ? "முகப்பு" : "Home"}
          </button>

          {/* Find Schemes (/find-schemes) */}
          <button
            onClick={() => setView('find-schemes')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1 ${
              view === 'find-schemes' || view === 'form'
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isTa ? "திட்டங்களை தேடுக" : "Find Schemes"}</span>
          </button>

          {/* Recommendations (/recommendations) */}
          <button
            onClick={() => setView('recommendations')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1 ${
              view === 'recommendations' || view === 'feed'
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>{isTa ? "பரிந்துரைகள்" : "Recommendations"}</span>
          </button>

          {/* Alpha Portal Console (/alpha-portal) */}
          <button
            onClick={() => setView('alpha-portal')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 ${
              view === 'alpha-portal'
                ? 'bg-indigo-900 text-white shadow-xs' 
                : 'text-indigo-900 bg-indigo-50 hover:bg-indigo-100'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            <span>{isTa ? "அரசு நிர்வாகம்" : "Alpha Portal"}</span>
          </button>

          {/* Beta Portal Bank Console (/beta-portal) */}
          <button
            onClick={() => setView('beta-portal')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 ${
              view === 'beta-portal'
                ? 'bg-emerald-900 text-white shadow-xs' 
                : 'text-emerald-900 bg-emerald-50 hover:bg-emerald-100'
            }`}
          >
            <Landmark className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isTa ? "வங்கி ஒப்புதல்" : "Beta Portal"}</span>
          </button>

          {/* Triple Demo View (/demo-trio) */}
          <button
            onClick={() => setView('demo-trio')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 ${
              view === 'demo-trio'
                ? 'bg-gradient-to-r from-emerald-600 to-indigo-600 text-white shadow-xs' 
                : 'text-slate-900 bg-gradient-to-r from-emerald-50 to-indigo-50 hover:from-emerald-100 hover:to-indigo-100 border border-slate-300'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{isTa ? "3-முகப்பு நேரலை" : "Trio Demo"}</span>
          </button>

          {/* Split Demo View (/demo-split) */}
          <button
            onClick={() => setView('demo-split')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 ${
              view === 'demo-split' || view === 'split-demo'
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Laptop className="w-3.5 h-3.5 text-slate-500" />
            <span>{isTa ? "இரட்டை திரை" : "Split"}</span>
          </button>

          {/* AI Mitra Counselor */}
          <button
            onClick={() => setView('counselor')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1 ${
              view === 'counselor' 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-purple-500" />
            <span>AI Mitra</span>
          </button>

        </nav>

        {/* Right Controls: Font Scaling & Language Switcher */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Font Scaler Accessibility */}
          <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-slate-600">
            <button
              onClick={() => setFontSize('sm')}
              title="Standard Font Size"
              className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition ${fontSize === 'sm' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'}`}
            >
              A-
            </button>
            <button
              onClick={() => setFontSize('base')}
              title="Default Font Size"
              className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition ${fontSize === 'base' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'}`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize('lg')}
              title="Large Font Size"
              className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition ${fontSize === 'lg' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'}`}
            >
              A+
            </button>
          </div>

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
              English
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

        </div>

      </div>
    </header>
  );
}
