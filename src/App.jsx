import React, { useState, useEffect } from 'react';
import { Bot, Landmark, CheckCircle2, X } from 'lucide-react';
import confetti from 'canvas-confetti';

import { Navbar } from './components/Navbar';
import { AppShell } from './components/AppShell';
import { LandingPage } from './components/LandingPage';
import { FormVerificationPage } from './components/FormVerificationPage';
import { RecommendationsGridPage } from './components/RecommendationsGridPage';
import { AlphaPortalConsole } from './components/AlphaPortalConsole';
import { BetaPortalBank } from './components/BetaPortalBank';
import { BetaTokenGateway } from './components/BetaTokenGateway';
import { FinancialCalculator } from './components/FinancialCalculator';
import { CenterLocator } from './components/CenterLocator';
import { AdminCMS } from './components/AdminCMS';
import { AiCounselorChat } from './components/AiCounselorChat';
import { ConsentModal } from './components/ConsentModal';
import { AllSchemesCatalog } from './components/AllSchemesCatalog';
import { OfficialPublicFooter } from './components/OfficialPublicFooter';
import { AlphaApp } from './AlphaApp';
import { BetaApp } from './BetaApp';
import { PrototypeDisclaimerBanner } from './components/PrototypeDisclaimerBanner';
import { HelpPage } from './components/HelpPage';
import { ApplyTrackPage } from './components/ApplyTrackPage';

import { TRANSLATIONS } from './data/translations';
import { hasConsented, grantConsent, revokeConsent, detectActivePortal } from './config/portalConfig';

export default function App() {
  // ── Standalone Portal Detection for Separate Tabs/Domains ────────────────
  const activePortal = detectActivePortal();
  if (activePortal === 'alpha') {
    return <AlphaApp />;
  }
  if (activePortal === 'beta') {
    return <BetaApp />;
  }

  // ── Language: 'en' | 'ta' | 'hi' ─────────────────────────────────────────
  const [lang, setLang] = useState('en');

  // ── View Router ─────────────────────────────────────────────────────────────
  // Primary views:
  //   'home' → LandingPage with prominent AI Mitra Voice/Text search & 7-Step wizard CTA
  //   'find-schemes' → 7-Step Guided Wizard (FormVerificationPage)
  //   'recommendations' → scheme matches (My Matches tab)
  //   'apply-track' → calculator/locator hub (Apply & Track tab)
  //   'help' → FAQ + tech stack (Help tab)
  const [view, setView] = useState('home');

  // ── Zero Hardcoded: profile starts null until user fills the form ──────────
  const [currentProfile, setCurrentProfile] = useState(null);

  // ── Consent Gate (sessionStorage backed) ─────────────────────────────────
  const [consentGranted, setConsentGranted] = useState(hasConsented());
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [pendingViewAfterConsent, setPendingViewAfterConsent] = useState(null);

  // ── Beta Portal JWT State ─────────────────────────────────────────────────
  const [referredSchemeForBank, setReferredSchemeForBank] = useState(null);
  const [betaJWTPayload, setBetaJWTPayload] = useState(null);
  const [showJWTGateway, setShowJWTGateway] = useState(false);

  // ── Realtime Cross-Tab Sanction Callback from Beta Bank Portal ───────────
  const [sanctionNotification, setSanctionNotification] = useState(null);
  const [wizardInitialStep, setWizardInitialStep] = useState(1);
  const [wizardResumeStored, setWizardResumeStored] = useState(false);

  // ── Post-Sanction Return from Beta Portal Handler ──────────────────────────
  const [approvedSanction, setApprovedSanction] = useState(() => {
    try {
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('applicationApproved') === 'true' || urlParams.get('sanctionApproved') === 'true') {
          const saved = localStorage.getItem("jansetu_approved_sanction");
          if (saved) return JSON.parse(saved);
          return {
            scheme_name: "CGTMSE Collateral-Free Credit Guarantee",
            bank_name: "ZETA BANK",
            applicant_name: "Rajan S.",
            sanction_amount: 500000,
            reference_id: "SANCTION-2026-9921",
            timestamp: new Date().toISOString()
          };
        }
      }
    } catch (e) {}
    return null;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !("BroadcastChannel" in window)) return;
    const channel = new BroadcastChannel("schemeconnect_sanctions");
    channel.onmessage = (event) => {
      if (event.data) {
        setSanctionNotification(event.data);
        setApprovedSanction(event.data);
        try { confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } }); } catch {}
        const timer = setTimeout(() => setSanctionNotification(null), 12000);
        return () => clearTimeout(timer);
      }
    };
    return () => channel.close();
  }, []);

  // ── Support direct URL hash routing (#wizard, #matches, #apply-track, #help) ──
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('applicationApproved') === 'true') {
        try { confetti({ particleCount: 100, spread: 90, origin: { y: 0.5 } }); } catch {}
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") return;
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'wizard' || hash === 'find-schemes' || hash === 'form') {
        setView('find-schemes');
      } else if (hash === 'matches' || hash === 'recommendations') {
        setCurrentProfile({
          name: "Rajan S.",
          age: 38,
          area: "Urban",
          sector: "Street Vendor",
          income: 180000,
          shg_membership: "No",
          gender: "Male",
          caste: "SC/ST",
          district: "Tiruchirappalli",
          state: "Tamil Nadu"
        });
        setConsentGranted(true);
        setView('recommendations');
      } else if (hash === 'apply-track') {
        setView('apply-track');
      } else if (hash === 'help') {
        setView('help');
      } else if (hash === 'home' || hash === '') {
        setView('home');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const [fontSize, setFontSize] = useState('base');
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // ── Consent-gated navigation with explicit step control ───────────────────
  const navigateTo = (targetView, options = {}) => {
    if (targetView === 'find-schemes' || targetView === 'form') {
      if (options && options.resume) {
        setWizardResumeStored(true);
        if (options.step) setWizardInitialStep(options.step);
      } else {
        setWizardResumeStored(false);
        setWizardInitialStep(1);
        try {
          localStorage.removeItem('jansetu_wizard_step');
        } catch (e) {}
      }
    }
    if (targetView === 'recommendations' && !consentGranted && currentProfile) {
      setPendingViewAfterConsent(targetView);
      setShowConsentModal(true);
      return;
    }
    setView(targetView);
  };

  // ── Logo / brand click: reset session ─────────────────────────────────────
  const handleLogoClick = () => {
    setCurrentProfile(null);
    revokeConsent();
    setConsentGranted(false);
    setReferredSchemeForBank(null);
    setBetaJWTPayload(null);
    setView('find-schemes');
  };

  // ── Consent Modal handlers ────────────────────────────────────────────────
  const handleConsentAccepted = (consentLang) => {
    grantConsent();
    setConsentGranted(true);
    setShowConsentModal(false);
    if (consentLang && consentLang !== lang) setLang(consentLang);
    setView(pendingViewAfterConsent || 'find-schemes');
    setPendingViewAfterConsent(null);
  };

  const handleConsentDeclined = () => {
    setShowConsentModal(false);
    setPendingViewAfterConsent(null);
    setView('landing');
  };

  // ── Form submitted ─────────────────────────────────────────────────────────
  const handleProfileSubmitted = (profile) => {
    setCurrentProfile(profile);
    try { confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } }); } catch {}
    setView('recommendations');
  };

  // ── Prominent AI Mitra Search from Home ──────────────────────────────────
  const handleAiSearch = (query) => {
    if (!query || !query.trim()) {
      setView('find-schemes');
      return;
    }
    const lower = query.toLowerCase();
    let inferredSector = "Street Vendor";
    let inferredCaste = "SC/ST";
    let inferredIncome = 180000;

    if (lower.includes("vendor") || lower.includes("thela") || lower.includes("street") || lower.includes("svanidhi")) {
      inferredSector = "Street Vendor";
    } else if (lower.includes("artisan") || lower.includes("handicraft") || lower.includes("vishwakarma") || lower.includes("craft")) {
      inferredSector = "Handicraft/Artisan";
      inferredCaste = "OBC";
    } else if (lower.includes("manufactur") || lower.includes("pmegp") || lower.includes("factory")) {
      inferredSector = "Manufacturing";
      inferredCaste = "General";
    } else if (lower.includes("service") || lower.includes("repair") || lower.includes("mudra")) {
      inferredSector = "Services";
      inferredCaste = "OBC";
    }

    if (lower.includes("sc") || lower.includes("st") || lower.includes("nsfdc") || lower.includes("tahdco")) {
      inferredCaste = "SC/ST";
    }

    const aiProfile = {
      name: "Applicant (AI Match)",
      age: 38,
      area: "Urban",
      sector: inferredSector,
      income: inferredIncome,
      shg_membership: "No",
      gender: "Male",
      caste: inferredCaste,
      district: "Tiruchirappalli",
      state: "Tamil Nadu",
      _fromAiSearchQuery: query
    };

    setCurrentProfile(aiProfile);
    grantConsent();
    setConsentGranted(true);
    try { confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } }); } catch {}
    setView('recommendations');
  };

  // ── Route to Bank (with JWT gateway & relative routing) ─────────────────────
  const handleRouteToBank = (scheme) => {
    setReferredSchemeForBank(scheme);
    try {
      if (scheme._jwtToken) {
        sessionStorage.setItem("beta_jwt_token", scheme._jwtToken);
      }
      if (scheme._referralId) {
        sessionStorage.setItem("beta_referral_id", scheme._referralId);
      }
      sessionStorage.setItem("beta_selected_scheme", JSON.stringify(scheme));
      if (currentProfile) {
        sessionStorage.setItem("beta_applicant_profile", JSON.stringify(currentProfile));
      }
      if (scheme._jwtPayload) {
        sessionStorage.setItem("zkp_tokens", JSON.stringify({
          token: scheme._jwtToken,
          payload: scheme._jwtPayload,
          referralId: scheme._referralId
        }));
      }
    } catch (e) {}

    // Programmatically redirect to Beta Banking Portal with parameterized bankId
    const bankParam = scheme?.selectedBank?.id ? `?bankId=${scheme.selectedBank.id}` : '';
    window.location.href = `/beta.html${bankParam}`;
  };

  const handleJWTTokenAccepted = (jwtPayload) => {
    setBetaJWTPayload(jwtPayload);
    setShowJWTGateway(false);
    try { confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } }); } catch {}
    setView('beta-portal');
  };

  const getFontSizeClass = () => {
    if (fontSize === 'lg') return 'text-lg';
    if (fontSize === 'sm') return 'text-sm';
    return 'text-base';
  };

  return (
    <div className={`min-h-screen bg-slate-50/70 text-slate-900 flex flex-col ${getFontSizeClass()}`}>
      {/* Persistent Prototype Disclaimer Banner */}
      <PrototypeDisclaimerBanner />

      {/* Consent Modal Overlay */}
      {showConsentModal && (
        <ConsentModal
          initialLang={lang}
          onAccept={handleConsentAccepted}
          onDecline={handleConsentDeclined}
        />
      )}

      {/* JWT Token Gateway Overlay */}
      {showJWTGateway && referredSchemeForBank && (
        <BetaTokenGateway
          referredScheme={referredSchemeForBank}
          userProfile={currentProfile}
          lang={lang}
          onTokenAccepted={handleJWTTokenAccepted}
          onDismiss={() => { setShowJWTGateway(false); setView('beta-portal'); }}
        />
      )}

      {/* Real-time Cross-Tab Sanction Toast */}
      {sanctionNotification && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-950 text-white border-2 border-emerald-500 rounded-3xl p-4 shadow-2xl animate-bounce flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Landmark className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                Cross-Tab Callback (Beta Bank Portal)
              </span>
              <button
                onClick={() => setSanctionNotification(null)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer ml-2"
              >
                ✕
              </button>
            </div>
            <h4 className="text-sm font-black text-white mt-0.5">
              🎉 Loan Sanction Approved!
            </h4>
            <p className="text-xs text-slate-300 mt-1">
              Bank Officer approved <b>{sanctionNotification.schemeName || "Concessional Loan"}</b> for <b>{sanctionNotification.beneficiaryName || "Beneficiary"}</b>.
            </p>
            <div className="mt-2 text-[10px] font-mono text-emerald-300 bg-emerald-950/80 px-2 py-1 rounded-lg border border-emerald-800/60">
              Ref: {sanctionNotification.referralId || "SANCTION-CONFIRMED"} • 100% Disbursed
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* APPLICATION APPROVED & SANCTIONED DEDICATED NOTIFICATION BANNER           */}
      {/* ========================================================================= */}
      {approvedSanction && (
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 border-b-2 border-emerald-500 text-white px-4 py-4 sm:px-6 shadow-xl animate-fadeIn relative z-50">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg mt-0.5">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-black text-sm sm:text-base text-white tracking-tight">
                    🎉 Application Approved &amp; Concessional Credit Sanctioned!
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                    {approvedSanction.reference_id || "SANCTION-CONFIRMED"}
                  </span>
                  <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-full">
                    APB-DBT Transfer Initiated
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Submitted to Partner Bank: <b className="text-white">{approvedSanction.bank_name || "ZETA BANK"}</b> for Scheme: <b className="text-white">"{approvedSanction.scheme_name || "CGTMSE Collateral-Free Credit Guarantee"}"</b>.
                  Beneficiary: <b className="text-white">{approvedSanction.applicant_name || "Rajan S."}</b> • Sanction Amount: <b className="text-emerald-300">₹{Number(approvedSanction.sanction_amount || 200000).toLocaleString('en-IN')}</b>.
                </p>
                <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-2">
                  <span>✓ Zero-Knowledge Proof (ZKP) Verified</span>
                  <span>•</span>
                  <span>✓ Single-Use Nonce Permanently Burned</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
              <button
                onClick={() => setView('apply-track')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition shadow-sm cursor-pointer"
              >
                Track in Central Registry →
              </button>
              <button
                onClick={() => setApprovedSanction(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
                title="Dismiss Banner"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        lang={lang} setLang={setLang} t={t} view={view} setView={navigateTo}
        isOnline={true} fontSize={fontSize} setFontSize={setFontSize}
        onLogoClick={handleLogoClick}
      />

      {/* 4-Tab Persistent Shell (desktop secondary bar + mobile bottom bar) */}
      <AppShell
        view={view}
        onNavigate={navigateTo}
        lang={lang}
        hasProfile={!!currentProfile}
      />

      <main className="flex-1">

        {/* LANDING PAGE */}
        {(view === 'landing' || view === 'home') && (
          <LandingPage
            lang={lang}
            setLang={setLang}
            t={t}
            onNavigate={navigateTo}
            onAiSearch={handleAiSearch}
          />
        )}

        {/* FORM — Applicant Intake Wizard (Starts strictly on step 1 unless resume is explicitly passed) */}
        {(view === 'find-schemes' || view === 'form') && (
          <FormVerificationPage
            initialProfile={null}
            initialStep={wizardInitialStep}
            resumeStoredStep={wizardResumeStored}
            lang={lang}
            t={t}
            onSubmit={handleProfileSubmitted}
            onBack={() => setView('all-schemes')}
          />
        )}

        {/* ALL SCHEMES CATALOG */}
        {(view === 'all-schemes' || view === 'catalog') && (
          <AllSchemesCatalog
            lang={lang}
            t={t}
            onStartIntake={() => navigateTo('find-schemes')}
            onOpenCalculator={(scheme) => navigateTo('calc')}
            onOpenAlphaPortal={() => navigateTo('alpha-portal')}
          />
        )}

        {/* RECOMMENDATIONS */}
        {(view === 'recommendations' || view === 'feed' || view === 'results') && (
          <RecommendationsGridPage
            userProfile={currentProfile}
            lang={lang}
            t={t}
            onEditProfile={() => setView('find-schemes')}
            onOpenCalculator={() => setView('calc')}
            onOpenLocator={() => setView('locator')}
            onOpenCounselor={() => setView('counselor')}
            onOpenSplitDemo={() => setView('demo-split')}
            onOpenTrioDemo={() => setView('demo-trio')}
            onOpenAdmin={() => setView('alpha-portal')}
            onRouteToBank={handleRouteToBank}
          />
        )}

        {/* ALPHA PORTAL */}
        {view === 'alpha-portal' && (
          <AlphaApp />
        )}

        {/* BETA PORTAL */}
        {view === 'beta-portal' && (
          <BetaApp />
        )}

        {/* APPLY & TRACK HUB — new tab landing */}
        {view === 'apply-track' && (
          <ApplyTrackPage
            lang={lang}
            t={t}
            hasProfile={!!currentProfile}
            onOpenCalculator={() => setView('calc')}
            onOpenLocator={() => setView('locator')}
            onViewSchemes={() => setView('all-schemes')}
            onResumeWizard={(step) => {
              setWizardInitialStep(step || 1);
              navigateTo('find-schemes', { resume: true, step });
            }}
          />
        )}

        {/* FINANCIAL CALCULATOR (contextual, reached via Apply & Track) */}
        {view === 'calc' && (
          <div className="py-4">
            <FinancialCalculator
              initialProjectCost={currentProfile?.estimated_cost || null}
              lang={lang}
              t={t}
              onBack={() => setView(currentProfile ? 'apply-track' : 'find-schemes')}
            />
          </div>
        )}

        {/* GEO-SPATIAL LOCATOR (contextual, reached via Apply & Track) */}
        {view === 'locator' && (
          <div className="py-4">
            <CenterLocator
              lang={lang}
              t={t}
              defaultDistrict={currentProfile?.district || ""}
            />
          </div>
        )}

        {/* AI MITRA COUNSELOR (reached via Help tab > Chat Now) */}
        {view === 'counselor' && (
          <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center space-x-2 text-purple-700 font-bold text-sm mb-2">
                <Bot className="w-5 h-5" />
                <span>AI Mitra Welfare Counselor</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-4">
                Conversational Welfare Counselor (English / தமிழ் / हिंदी)
              </h2>
              <AiCounselorChat lang={lang} t={t} isEmbedded={true} currentProfile={currentProfile} />
            </div>
          </div>
        )}

        {/* HELP PAGE (Help tab) */}
        {view === 'help' && (
          <HelpPage
            lang={lang}
            t={t}
            onOpenCounselor={() => setView('counselor')}
          />
        )}

        {/* ADMIN CMS */}
        {view === 'admin' && (
          <AdminCMS lang={lang} t={t} />
        )}

      </main>

      {/* Floating AI Mitra (global, except where a full-page counselor is shown) */}
      {view !== 'counselor' && view !== 'demo-split' && view !== 'demo-trio' && (
        <AiCounselorChat lang={lang} t={t} currentProfile={currentProfile} />
      )}

      {/* Official Public Service Footer */}
      <OfficialPublicFooter lang={lang} />

    </div>
  );
}
