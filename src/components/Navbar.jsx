import React from 'react';
import { Building2 } from 'lucide-react';

export function Navbar({ lang = "en", setLang, t, view, setView, isOnline, fontSize, setFontSize, onLogoClick }) {
  const isTa = lang === "ta";
  const isHi = lang === "hi";

  const L = (en, ta, hi) => isHi ? hi : (isTa ? ta : en);

  return (
    <header className="sticky top-0 z-50 bg-[#0f172a] border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-3">

          {/* Brand Logo & Title — clicks to reset session */}
          <div
            className="flex items-center space-x-3 cursor-pointer group shrink-0"
            onClick={onLogoClick || (() => setView('home'))}
            title="JanSetu AI Home • Reset Session"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-base sm:text-lg text-white tracking-tight group-hover:text-blue-400 transition">
                  JanSetu AI
                </span>
                <span className="text-[10px] font-bold bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded-full border border-blue-700/60">
                  DPI Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Powered by SchemeConnect DPI Engine
              </p>
            </div>
          </div>

          {/* Center / Right: Sleek Prototype Status Pill */}
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center bg-slate-800/60 border border-slate-700 text-slate-300 text-xs px-2.5 py-1 rounded-full backdrop-blur-md font-mono">
              PROTOTYPE NODE • SIH 2026
            </span>

            {/* Language Selector */}
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              aria-label="Language Selector"
              className="bg-slate-800 text-slate-100 border border-slate-700 hover:border-slate-600 text-xs font-semibold rounded-lg px-2.5 sm:px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
            >
              <option value="en">English</option>
              <option value="ta">தமிழ்</option>
              <option value="hi">हिंदी</option>
            </select>
          </div>

        </div>
      </div>
    </header>
  );
}

export default Navbar;
