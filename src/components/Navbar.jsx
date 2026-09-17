import React from 'react';
import { Building2, Bot, Calculator } from 'lucide-react';

export function Navbar({ lang = "en", setLang, t, view, setView, isOnline, fontSize, setFontSize, onLogoClick }) {
  const isTa = lang === "ta";
  const isHi = lang === "hi";

  const L = (en, ta, hi) => isHi ? hi : (isTa ? ta : en);

  return (
    <header className="sticky top-0 z-50 bg-[#0f172a] border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">

          {/* Brand Logo & Title — clicks to reset session */}
          <div
            className="flex items-center space-x-3 cursor-pointer group shrink-0"
            onClick={onLogoClick || (() => setView('find-schemes'))}
            title="SchemeConnect Home • Reset Session"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-lg text-white tracking-tight group-hover:text-blue-400 transition">
                  SchemeConnect
                </span>
                <span className="text-[10px] font-bold bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded-full border border-blue-700/60">
                  SIH26092
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                {L(
                  "Ministry of Social Justice & Empowerment • Government of India",
                  "சமூக நீதி மற்றும் அதிகாரமளித்தல் அமைச்சகம் • இந்திய அரசு",
                  "सामाजिक न्याय एवं अधिकारिता मंत्रालय • भारत सरकार"
                )}
              </p>
            </div>
          </div>

          {/* Right Controls: Calculator, AI Mitra, and Single Language Dropdown */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            
            {/* Financial Calculator Button */}
            <button
              type="button"
              onClick={() => setView('calc')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                view === 'calc'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
              }`}
              title="Financial Subsidy & EMI Calculator"
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{L("Calculator", "கால்குலேட்டர்", "कैलकुलेटर")}</span>
            </button>

            {/* AI Mitra Counselor Access */}
            <button
              type="button"
              onClick={() => setView('counselor')}
              className={`p-2 rounded-lg transition cursor-pointer ${
                view === 'counselor'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
              }`}
              title="AI Mitra Welfare Advisor"
            >
              <Bot className="w-4 h-4 text-purple-300" />
            </button>

            {/* Single Language Dropdown (i18n Switcher) */}
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              aria-label="Language Selector"
              className="bg-slate-800 text-slate-100 border border-slate-700 hover:border-slate-600 text-xs font-semibold rounded-lg px-2.5 sm:px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
            >
              <option value="en">English</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="hi">हिंदी (Hindi)</option>
            </select>

          </div>

        </div>
      </div>
    </header>
  );
}
export default Navbar;
