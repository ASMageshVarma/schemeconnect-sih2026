import React from 'react';
import { Building2, Bot, Calculator } from 'lucide-react';

export function Navbar({ lang = "en", setLang, t, view, setView, isOnline, fontSize, setFontSize, onLogoClick }) {
  const isTa = lang === "ta";
  const isHi = lang === "hi";
  const L = (en, ta, hi) => isHi ? hi : (isTa ? ta : en);

  const navItems = [
    { id: 'calc',       emoji: null, icon: Calculator, label: L("Calculator", "கால்குலேட்டர்", "कैलकुलेटर"), iconClass: "text-emerald-400" },
    { id: 'counselor',  emoji: null, icon: Bot,        label: L("AI Mitra", "AI மித்ரா", "AI मित्रा"),       iconClass: "text-purple-400" },
    { id: 'csc-agent',  emoji: "🏘️", icon: null,      label: L("Gram Seva", "கிராம சேவை", "ग्राम सेवा"),    iconClass: null },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0c1424] border-b border-slate-800/80">

      {/* CSC Agent Mode sub-banner */}
      {view === 'csc-agent' && (
        <div className="bg-amber-400 text-slate-900 py-1.5 px-4 text-center text-[11px] font-black tracking-wide flex items-center justify-center gap-3">
          <span>🏘️ {L("GRAM SEVA VLE AGENT MODE — Village Batch Intake Active", "கிராம சேவை VLE முகவர் முறை செயலில்", "ग्राम सेवा VLE एजेंट मोड — बैच इनटेक सक्रिय")}</span>
          <button
            onClick={() => setView('find-schemes')}
            className="bg-slate-900/20 hover:bg-slate-900/40 px-2.5 py-0.5 rounded-full font-black cursor-pointer transition text-[10px]"
          >
            {L("Exit ✕", "வெளியேறு ✕", "बाहर ✕")}
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between gap-4 py-3">

        {/* Logo */}
        <button
          type="button"
          onClick={onLogoClick || (() => setView('find-schemes'))}
          className="flex items-center gap-3 group shrink-0 cursor-pointer"
          title="SchemeConnect — Return Home"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-900/40 shrink-0">
            <Building2 className="w-4.5 h-4.5 text-white w-5 h-5" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="font-black text-[15px] text-white tracking-tight group-hover:text-blue-400 transition leading-none">
                SchemeConnect
              </span>
              <span className="text-[9px] font-black bg-blue-900/70 text-blue-300 px-1.5 py-0.5 rounded-full border border-blue-700/60 leading-none">
                SIH26092
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5 leading-none">
              {L("Ministry of Social Justice & Empowerment", "சமூக நீதி மற்றும் அதிகாரமளித்தல் அமைச்சகம்", "सामाजिक न्याय एवं अधिकारिता मंत्रालय")}
            </p>
          </div>
        </button>

        {/* Right controls */}
        <div className="flex items-center gap-2 shrink-0">

          {navItems.map(({ id, emoji, icon: Icon, label, iconClass }) => (
            <button
              key={id}
              type="button"
              onClick={() => setView(id)}
              title={label}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                view === id
                  ? id === 'csc-agent'
                    ? 'bg-amber-400 text-slate-900 border-amber-400 font-black shadow-md shadow-amber-500/20'
                    : id === 'counselor'
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-blue-600 text-white border-blue-600'
                  : 'bg-transparent text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {emoji
                ? <span className="text-sm leading-none">{emoji}</span>
                : <Icon className={`w-3.5 h-3.5 ${view === id ? 'text-white' : iconClass}`} />
              }
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}

          {/* Divider */}
          <div className="w-px h-5 bg-slate-700 mx-1 hidden sm:block" />

          {/* Language */}
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            aria-label="Language"
            className="bg-slate-800 text-slate-200 border border-slate-700 text-[11px] font-semibold rounded-xl px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer hover:bg-slate-700 transition"
          >
            <option value="en">🇬🇧 EN</option>
            <option value="ta">🇮🇳 தமிழ்</option>
            <option value="hi">🇮🇳 हिंदी</option>
          </select>

        </div>
      </div>
    </header>
  );
}
export default Navbar;
