import React from 'react';
import { Globe, Building2, MapPin, LayoutDashboard, UserCheck, ShieldCheck, Calculator, Bot, FileText, Sparkles } from 'lucide-react';

export function Navbar({ lang, setLang, t, view, setView, isOnline, fontSize, setFontSize }) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Emblem */}
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setView('home')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 via-white to-green-600 p-0.5 shadow-sm">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-base tracking-tight text-slate-900 group-hover:text-blue-600 transition">
                {t.app_title || "SchemeConnect"}
              </span>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200/60">
                SIH26092
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium hidden md:block">
              {lang === 'ta' ? "சமூக நீதி அமைச்சகம் • குழு: டெக் டைட்டன்ஸ்" : (lang === 'hi' ? "सामाजिक न्याय मंत्रालय • टीम टेक टाइटन्स" : "MoSJE • Team TechTitans (SIH-9E972H)")}
            </p>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1 text-xs font-bold">
          <button
            onClick={() => setView('home')}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              view === 'home' 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {t.nav_home || "Home"}
          </button>
          
          <button
            onClick={() => setView('form')}
            className={`px-3.5 py-1.5 rounded-xl transition flex items-center space-x-1 ${
              view === 'form' || view === 'voice' || view === 'results'
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.nav_recommender || "AI Recommender"}</span>
          </button>

          <button
            onClick={() => setView('calc')}
            className={`px-3.5 py-1.5 rounded-xl transition flex items-center space-x-1 ${
              view === 'calc' 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-blue-500" />
            <span>{t.nav_calc || "Financial Calculator"}</span>
          </button>

          <button
            onClick={() => setView('locator')}
            className={`px-3.5 py-1.5 rounded-xl transition flex items-center space-x-1 ${
              view === 'locator' 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t.nav_locator || "Partner Locator"}</span>
          </button>

          <button
            onClick={() => setView('counselor')}
            className={`px-3.5 py-1.5 rounded-xl transition flex items-center space-x-1 ${
              view === 'counselor' 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-purple-500" />
            <span>{t.nav_mitra || "AI Mitra"}</span>
          </button>

          <button
            onClick={() => setView('ocr')}
            className={`px-3.5 py-1.5 rounded-xl transition flex items-center space-x-1 ${
              view === 'ocr' 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.nav_ocr || "OCR Auto-Fill"}</span>
          </button>

          <button
            onClick={() => setView('admin')}
            className={`px-3.5 py-1.5 rounded-xl transition flex items-center space-x-1 ${
              view === 'admin' 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-indigo-500" />
            <span>{t.nav_cms || "MoSJE CMS"}</span>
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
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
            </select>
            <Globe className="w-3.5 h-3.5 text-blue-600 absolute left-2 pointer-events-none" />
          </div>

        </div>

      </div>
    </header>
  );
}
