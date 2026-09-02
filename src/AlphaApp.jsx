import React, { useState, useEffect } from 'react';
import { 
  Building2, Radio, ExternalLink, ShieldCheck, 
  Sparkles, Laptop, Landmark, RefreshCw, CheckCircle2,
  FileText, Settings, Lock
} from 'lucide-react';
import { AlphaPortalConsole } from './components/AlphaPortalConsole';
import { AllSchemesCatalog } from './components/AllSchemesCatalog';
import { AlphaGazetteModal } from './components/AlphaGazetteModal';
import { getAlphaSchemes } from './utils/realtimeSync';
import { PORTAL_URLS, navigateToBeta, navigateToSchemeConnect } from './config/portalConfig';

export function AlphaApp() {
  const [lang, setLang] = useState('en');
  const [activeTab, setActiveTab] = useState('gazette'); // 'gazette' (/) | 'admin' (/admin)
  const [gazetteScheme, setGazetteScheme] = useState(null);

  // Check URL params for ?scheme=... or path for /admin
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const schemeId = params.get("scheme");
      if (schemeId) {
        const allSchemes = getAlphaSchemes();
        const found = allSchemes.find(s => s.scheme_id === schemeId);
        if (found) setGazetteScheme(found);
      }
      if (window.location.pathname.includes("admin") || window.location.hash.includes("admin") || params.get("view") === "admin") {
        setActiveTab("admin");
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
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
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
                Ministry of Social Justice & Empowerment • Government Welfare Policy & Gazette Administration
              </p>
            </div>
          </div>

          {/* Tab Switcher: Public Gazette (/) vs Admin Policy Console (/admin) */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs font-bold">
            <button
              onClick={() => setActiveTab('gazette')}
              className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'gazette'
                  ? 'bg-indigo-600 text-white font-black shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Public Gazette (/)</span>
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-indigo-600 text-white font-black shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Admin Policy Console (/admin)</span>
            </button>
          </div>

        </div>
      </header>

      {/* Cross-Tab Synchronization Notice */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-b border-indigo-900/40 py-2.5 px-4 text-center">
        <p className="text-xs text-indigo-200">
          <span className="font-black text-amber-300 mr-2">⚡ SEPARATE-TAB REALTIME SYNC:</span>
          Policy modifications made in the Admin Console broadcast across browser tabs in &lt;10ms to dynamically unlock citizen cards in SchemeConnect without refresh.
        </p>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'gazette' ? (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Official Government Gazette Directory</h2>
                <p className="text-xs text-slate-400">Publicly verified statutory guidelines for 20 Central and State Concessional Welfare Schemes.</p>
              </div>
              <button
                onClick={() => setActiveTab('admin')}
                className="px-3.5 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 rounded-lg text-xs font-semibold transition"
              >
                Switch to Admin Policy Editor ➔
              </button>
            </div>
            <AllSchemesCatalog 
              lang={lang}
              onStartIntake={() => navigateToSchemeConnect("/find-schemes", true)}
              onOpenAlphaPortal={() => setActiveTab('admin')}
            />
          </div>
        ) : (
          <AlphaPortalConsole lang={lang} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        Alpha Portal (Official Gov Gazette & Policy Engine) • Decoupled Triple-Portal Ecosystem • Team TechTitans (SIH-9E972H)
      </footer>

    </div>
  );
}
export default AlphaApp;
