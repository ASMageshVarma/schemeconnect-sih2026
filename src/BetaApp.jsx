import React, { useState, useEffect } from 'react';
import { 
  Landmark, ShieldCheck, Sparkles, Building2, 
  ExternalLink, CheckCircle2, FileText, ArrowRight, UserCheck 
} from 'lucide-react';
import { BetaPortalBank } from './components/BetaPortalBank';
import { decodeReferralJWT } from './utils/jwtToken';
import { getAlphaSchemes } from './utils/realtimeSync';
import { navigateToAlpha, navigateToSchemeConnect } from './config/portalConfig';

export function BetaApp() {
  const [lang, setLang] = useState('en');
  const [jwtToken, setJwtToken] = useState(null);
  const [jwtPayload, setJwtPayload] = useState(null);
  const [referredScheme, setReferredScheme] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // Automatically read ?token=... and ?ref=... from URL on startup
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      if (token) {
        setJwtToken(token);
        const decoded = decodeReferralJWT(token);
        if (decoded && decoded.isValid && decoded.payload) {
          const payload = decoded.payload;
          setJwtPayload(payload);
          setUserProfile(payload.beneficiary);

          // Locate referred scheme
          const allSchemes = getAlphaSchemes();
          const match = allSchemes.find(s => s.scheme_id === payload.scheme_id);
          if (match) {
            setReferredScheme({
              ...match,
              _jwtToken: token,
              _referralId: payload.referral_id,
              _jwtPayload: payload
            });
          }
        }
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Banking Hub Header */}
      <header className="bg-slate-900 border-b border-emerald-900/60 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Landmark className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-base text-white tracking-tight">
                  BETA PORTAL
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full">
                  mybank.vercel.app
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Bank Officer Queue Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Partner Banking Consortium (SBI • Canara • Indian Bank • Bank of Baroda) • Credit Sanction & Disbursement Gateway
              </p>
            </div>
          </div>

          {/* Cross-Portal Quick Launchers */}
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
              onClick={() => navigateToAlpha("", true)}
              className="px-3.5 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
              title="Open Alpha Portal in separate tab"
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Alpha Portal Tab ↗</span>
            </button>
          </div>

        </div>
      </header>

      {/* Cross-Tab Bank Callback Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-b border-emerald-900/40 py-2.5 px-4 text-center">
        <p className="text-xs text-emerald-200">
          <span className="font-black text-amber-300 mr-2">⚡ SEPARATE-TAB BANK HANDSHAKE:</span>
          Applications referred from SchemeConnect appear here with signed JWT cryptographic verification. Click <b className="text-emerald-400">"1-Click Sanction"</b> to disburse!
        </p>
      </div>

      {/* Main Bank Officer Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <BetaPortalBank
          referredScheme={referredScheme}
          betaJWTPayload={jwtPayload}
          userProfile={userProfile}
          lang={lang}
          onBackToSchemeConnect={() => navigateToSchemeConnect("/", true)}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        Beta Portal (Partner Banking Hub) • Decoupled Triple-Portal Ecosystem • Team TechTitans (SIH-9E972H)
      </footer>

    </div>
  );
}
export default BetaApp;
