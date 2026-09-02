import React from 'react';
import { 
  Globe, Building2, MapPin, LayoutDashboard, UserCheck, ShieldCheck, 
  Calculator, Bot, FileText, Sparkles, Radio, Laptop, Zap 
} from 'lucide-react';

export function Navbar({ lang, setLang, t, view, setView, isOnline, fontSize, setFontSize }) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Emblem */}
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setView('feed')}>
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
              Team TechTitans (SIH-9E972H) • MoSJE & Alpha Portal
            </p>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1 text-xs font-bold">
          
          {/* SchemeConnect Feed */}
          <button
            onClick={() => setView('feed')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1 ${
              view === 'feed' || view === 'home'
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>SchemeConnect Feed</span>
          </button>

          {/* Alpha Portal Console */}
          <button
            onClick={() => setView('alpha-portal')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 ${
              view === 'alpha-portal'
                ? 'bg-indigo-900 text-white shadow-xs' 
                : 'text-indigo-900 bg-indigo-50 hover:bg-indigo-100'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            <span>Alpha Portal</span>
          </button>

          {/* Split Demo Mode (Judge Pitch View) */}
          <button
            onClick={() => setView('split-demo')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 ${
              view === 'split-demo'
                ? 'bg-emerald-800 text-white shadow-xs' 
                : 'text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <Laptop className="w-3.5 h-3.5 text-emerald-600" />
            <span>Split Demo View</span>
          </button>

          {/* Financial Calculator */}
          <button
            onClick={() => setView('calc')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1 ${
              view === 'calc' 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-blue-500" />
            <span>Calculator</span>
          </button>

          {/* Partner Locator */}
          <button
            onClick={() => setView('locator')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1 ${
              view === 'locator' 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
            <span>Partner Locator</span>
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

        {/* Right Controls */}
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

          {/* Language Selector Dropdown */}
          <div className="relative flex items-center">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="appearance-none pl-7 pr-7 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 text-xs font-bold rounded-xl cursor-pointer outline-none transition shadow-xs"
            >
              <option value="en">English</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="hi">हिन्दी (Hindi)</option>
            </select>
            <Globe className="w-3.5 h-3.5 text-blue-600 absolute left-2 pointer-events-none" />
          </div>

        </div>

      </div>
    </header>
  );
}
