import React from 'react';
import { Building2, Globe } from 'lucide-react';

export function Navbar({ lang = "en", setLang, onLogoClick }) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          
          {/* Brand Logo & Title — Clicking resets active session and routes to / */}
          <div
            onClick={onLogoClick}
            className="flex items-center space-x-3 cursor-pointer group"
            title="Reset active session memory & return to homepage"
          >
            <div className="w-10 h-10 rounded-xl bg-[#1e3a8a] text-white flex items-center justify-center shadow-xs">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight group-hover:text-[#1e3a8a] transition">
                  SchemeConnect
                </span>
                <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                  SIH26092
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Ministry of Social Justice & Empowerment • Government of India
              </p>
            </div>
          </div>

          {/* Unified Global Language Dropdown (i18n Switcher) */}
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-slate-500 hidden sm:inline" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              aria-label="Select Language"
              className="bg-slate-100 border border-slate-300 text-slate-800 text-sm font-medium rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-slate-500 outline-none cursor-pointer hover:bg-slate-200 transition"
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
