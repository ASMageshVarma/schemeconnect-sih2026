import React, { useState, useEffect } from 'react';
import { 
  Building2, Radio, ExternalLink, ShieldCheck, 
  Sparkles, Laptop, Landmark, RefreshCw, CheckCircle2 
} from 'lucide-react';
import { AlphaPortalConsole } from './components/AlphaPortalConsole';
import { AlphaGazetteModal } from './components/AlphaGazetteModal';
import { getAlphaSchemes } from './utils/realtimeSync';
import { PORTAL_URLS, navigateToBeta, navigateToSchemeConnect } from './config/portalConfig';

export function AlphaApp() {
  const [lang, setLang] = useState('en');
  const [gazetteScheme, setGazetteScheme] = useState(null);

  // Check URL params for ?scheme=... to display official gazette automatically
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const schemeId = params.get("scheme");
      if (schemeId) {
        const allSchemes = getAlphaSchemes();
        const found = allSchemes.find(s => s.scheme_id === schemeId);
        if (found) setGazetteScheme(found);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Gazette Modal if scheme selected */}
      {gazetteScheme && (
        <AlphaGazetteModal
          scheme={gazetteScheme}
          lang={lang}
          onClose={() => setGazetteScheme(null)}
        />
      )}

      {/* Official Government Header */}
      <header className="bg-slate-900 border-b border-indigo-900/60 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-base text-white tracking-tight">
                  ALPHA PORTAL
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-full">
                  alphagov.vercel.app
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <Radio className="w-2.5 h-2.5 animate-pulse" /> Live Broadcast Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Ministry of Social Justice & Empowerment • Government Welfare Policy & Scheme Administration Console
              </p>
            </div>
          </div>

          {/* Quick Cross-Portal Tabs Launcher */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateToSchemeConnect("/", true)}
              className="px-3.5 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
              title="Open SchemeConnect Citizen Engine in separate tab"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>SchemeConnect Tab ↗</span>
            </button>

            <button
              onClick={() => navigateToBeta("", "", true)}
              className="px-3.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
              title="Open Beta Portal Bank in separate tab"
            >
              <Landmark className="w-3.5 h-3.5 text-emerald-400" />
              <span>Beta Bank Tab ↗</span>
            </button>
          </div>

        </div>
      </header>

      {/* Hackathon Pitch Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-b border-indigo-900/40 py-2.5 px-4 text-center">
        <p className="text-xs text-indigo-200">
          <span className="font-black text-amber-300 mr-2">⚡ SEPARATE-TAB REALTIME SYNC:</span>
          Modify age or income parameters below ➔ Switch to the <b className="text-blue-300">SchemeConnect tab</b> to watch cards unlock live with sub-10ms latency!
        </p>
      </div>

      {/* Main Console Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AlphaPortalConsole lang={lang} />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        Alpha Portal (Gov Policy Engine) • Decoupled Triple-Portal Ecosystem • Team TechTitans (SIH-9E972H)
      </footer>

    </div>
  );
}
export default AlphaApp;
