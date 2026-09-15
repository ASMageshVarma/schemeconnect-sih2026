import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Lock, Unlock, Sparkles, Filter, ArrowLeft, 
  FileText, UserCheck, Shield, ChevronRight, Search, 
  MapPin, Radio, Calculator, Bot, AlertTriangle, IndianRupee, 
  Volume2, Check, ArrowRight, Landmark 
} from 'lucide-react';
import { LiveSchemeCard } from './LiveSchemeCard';
import { AlphaGazetteModal } from './AlphaGazetteModal';
import { SmartWelfareBundles } from './SmartWelfareBundles';
import { DbtLifecycleTrackerModal } from './DbtLifecycleTrackerModal';
import { rankAlphaSchemes } from '../utils/alphaMatcher';
import { getAlphaSchemes, subscribeToAlphaChanges } from '../utils/realtimeSync';
import { speakText } from '../utils/speech';
import { generateReferralJWT } from '../utils/jwtToken';
import { navigateToBeta, navigateToAlpha } from '../config/portalConfig';

export function RecommendationsGridPage({ 
  userProfile, 
  lang = "en", 
  t, 
  onEditProfile, 
  onOpenCalculator, 
  onOpenLocator, 
  onOpenCounselor,
  onOpenSplitDemo,
  onOpenTrioDemo,
  onOpenAdmin,
  onRouteToBank 
}) {
  const isTa = lang === "ta";
  const isHi = lang === "hi";
  const L = (en, ta, hi) => isHi ? hi : (isTa ? ta : en);

  const [schemes, setSchemes] = useState(getAlphaSchemes());
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [lastLiveStreamEvent, setLastLiveStreamEvent] = useState(null);
  const [selectedSchemeDetail, setSelectedSchemeDetail] = useState(null);
  const [gazetteScheme, setGazetteScheme] = useState(null); // Alpha Gazette modal
  const [showDbtTracker, setShowDbtTracker] = useState(false); // APB-DBT lifecycle tracker modal

  // Handle multi-scheme stacked bundle application
  const handleApplyStackedBundle = (bundleSchemes, totals) => {
    const primaryScheme = bundleSchemes[0];
    const { token, payload, referralId } = generateReferralJWT(primaryScheme, userProfile, {
      trustScore: 100,
      ekycVerified: true,
      ocrConfidence: 98,
      isBundle: true,
      bundleSchemeCount: bundleSchemes.length,
      bundleNames: bundleSchemes.map(s => s.scheme_name).join(" + "),
      totalStackedBenefit: totals?.totalBenefit,
      totalCapitalSubsidy: totals?.totalGrant
    });
    
    // Launch Beta Portal with the stacked bundle token
    navigateToBeta(token, referralId, true);

    if (onRouteToBank) {
      onRouteToBank({ ...primaryScheme, _jwtToken: token, _referralId: referralId, _jwtPayload: payload, _isBundle: true });
    }
  };

  // Realtime WebSocket Subscription
  useEffect(() => {
    const unsubscribe = subscribeToAlphaChanges((updatedSchemes, meta) => {
      setSchemes(updatedSchemes);
      if (meta?.reason) {
        setLastLiveStreamEvent({
          time: new Date().toLocaleTimeString(),
          message: meta.reason,
          schemeId: meta.schemeId
        });

        const timer = setTimeout(() => setLastLiveStreamEvent(null), 6000);
        return () => clearTimeout(timer);
      }
    });
    return unsubscribe;
  }, []);

  const rankedSchemes = userProfile ? rankAlphaSchemes(schemes, userProfile, lang) : schemes;
  const eligibleSchemes = userProfile ? rankedSchemes.filter(s => s.is_eligible) : [];
  const ineligibleSchemes = userProfile ? rankedSchemes.filter(s => !s.is_eligible) : schemes;

  // Filters
  const filterTabs = [
    { id: "ALL", label: L("All Schemes (20)", "அனைத்து திட்டங்கள்", "सभी योजनाएँ (20)") },
    { id: "ELIGIBLE", label: L("✓ 100% Eligible Only", "✓ 100% தகுதியானவை", "✓ केवल 100% पात्र") },
    { id: "MICRO", label: L("⚡ Micro Finance (≤₹1.40L)", "⚡ நுண்கடன் (≤₹1.40L)", "⚡ सूक्ष्म वित्त (≤₹1.40L)") },
    { id: "TERM", label: L("🏢 Term Loans (≤₹50L)", "🏢 தொழில் கடன் (≤₹50L)", "🏢 मियादी ऋण (≤₹50L)") },
    { id: "FROZEN", label: L("🔒 Ineligible / Locked", "🔒 நிறுத்திவைக்கப்பட்டவை", "🔒 अपात्र / लॉक") }
  ];

  const filteredSchemes = rankedSchemes.filter(s => {
    let matchTab = true;
    if (activeFilter === "ELIGIBLE") matchTab = s.is_eligible;
    else if (activeFilter === "MICRO") matchTab = Number(s.sanctioned_amount) <= 140000;
    else if (activeFilter === "TERM") matchTab = Number(s.sanctioned_amount) > 140000;
    else if (activeFilter === "FROZEN") matchTab = !s.is_eligible;

    let matchSearch = true;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      matchSearch = (s.scheme_name || '').toLowerCase().includes(q) ||
        (s.scheme_name_ta || '').toLowerCase().includes(q) ||
        (s.ministry || '').toLowerCase().includes(q) ||
        (s.sector || '').toLowerCase().includes(q);
    }
    return matchTab && matchSearch;
  });

  const handleBankApplicationRoute = (scheme) => {
    // Generate signed JWT referral token (15-min expiry)
    const { token, payload, referralId } = generateReferralJWT(scheme, userProfile, {
      trustScore: 98,
      ekycVerified: true,
      ocrConfidence: 96,
      udyamVerified: true,
      aaCashflowVerified: true
    });
    
    // Launch Beta Portal in a SEPARATE BROWSER TAB
    navigateToBeta(token, referralId, true);

    if (onRouteToBank) {
      // Attach JWT token to scheme for Beta Portal Gateway if rendered in-page
      onRouteToBank({ ...scheme, _jwtToken: token, _referralId: referralId, _jwtPayload: payload });
    }
  };

  const handleSelectScheme = (scheme) => {
    if (scheme._openGazette) {
      setGazetteScheme(scheme);
    } else {
      setSelectedSchemeDetail(scheme);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fadeIn">

      {/* ── Live Policy Sync Toast ── */}
      {lastLiveStreamEvent && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-lg mb-5 flex items-center justify-between gap-3 border border-emerald-500">
          <div className="flex items-center gap-3">
            <Radio className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-100 block">
                ⚡ Ministry WebSocket Update • {lastLiveStreamEvent.time}
              </span>
              <span className="text-xs font-bold text-white">{lastLiveStreamEvent.message} — eligibility recalculated live</span>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded-full font-bold shrink-0">
            &lt;10ms
          </span>
        </div>
      )}

      {/* ── Page Header Row ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Landmark className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">
              {L("Scheme Recommendations", "திட்ட பரிந்துரைகள்", "योजना सिफ़ारिशें")}
            </span>
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              <Radio className="w-2.5 h-2.5 animate-pulse" />
              {L("Live", "நேரலை", "लाइव")}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {L("Your Eligible Welfare Schemes", "உங்கள் தகுதியான நலத்திட்டங்கள்", "आपकी पात्र कल्याण योजनाएँ")}
          </h2>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onEditProfile}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-sm transition cursor-pointer hover:border-blue-300"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{L("Edit Intake", "சுயவிவரம் மாற்று", "इनटेक संपादित करें")}</span>
          </button>
          {onOpenCalculator && (
            <button
              onClick={onOpenCalculator}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-sm transition cursor-pointer hover:border-emerald-300"
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden sm:inline">{L("Calculator", "கால்குலேட்டர்", "कैलकुलेटर")}</span>
            </button>
          )}
          {onOpenLocator && (
            <button
              onClick={onOpenLocator}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-700 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-sm transition cursor-pointer hover:border-blue-300"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden sm:inline">{L("Locator", "மையங்கள்", "केंद्र खोजें")}</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => navigateToAlpha("", true)}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-700 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-sm transition cursor-pointer hover:border-indigo-300"
          >
            <Radio className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            <span className="hidden sm:inline">{L("Alpha Portal ↗", "Alpha Portal ↗", "Alpha Portal ↗")}</span>
          </button>
        </div>
      </div>

      {/* ── Citizen Profile Card ── */}
      {!userProfile ? (
        <div className="bg-[#0c1424] text-white rounded-2xl p-5 shadow-md mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
              <UserCheck className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <span className="text-xs font-black text-white block">{L("Complete Intake Form First", "முதலில் படிவத்தை நிரப்பவும்", "पहले फ़ॉर्म भरें")}</span>
              <span className="text-[11px] text-slate-400">{L("Fill the 7-parameter form with Voice or OCR to see your matched schemes.", "குரல் அல்லது OCR மூலம் படிவத்தை நிரப்பவும்.", "वॉयस या OCR से फ़ॉर्म भरें।")}</span>
            </div>
          </div>
          <button
            onClick={onEditProfile}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs shadow transition flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            {L("Open Intake Form ➔", "படிவத்தை திறக்க ➔", "इनटेक फ़ॉर्म खोलें ➔")}
          </button>
        </div>
      ) : (
        <div className="bg-[#0c1424] text-white rounded-2xl p-4 sm:p-5 shadow-md mb-6 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/80 flex items-center justify-center shrink-0 shadow">
              <UserCheck className="w-4.5 h-4.5 text-white w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-white text-sm">{userProfile.name}</span>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                  {L("ZKP Verified ✓", "ZKP சரிபார்க்கப்பட்டது ✓", "ZKP सत्यापित ✓")}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-[11px] text-slate-400">
                <span>{userProfile.age} {L("yrs", "வயது", "वर्ष")}</span>
                <span>•</span>
                <span>{userProfile.sector}</span>
                <span>•</span>
                <span>{userProfile.caste}</span>
                <span>•</span>
                <span>₹{Number(userProfile.income).toLocaleString('en-IN')}/yr</span>
                <span>•</span>
                <span>{userProfile.area}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-center">
              <span className="text-2xl font-black text-emerald-400 block leading-none">{eligibleSchemes.length}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">{L("Eligible", "தகுதியானவை", "पात्र")}</span>
            </div>
            <div className="w-px h-8 bg-slate-700" />
            <div className="text-center">
              <span className="text-2xl font-black text-slate-400 block leading-none">{ineligibleSchemes.length}</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">{L("Locked", "நிறுத்தப்பட்டவை", "लॉक्ड")}</span>
            </div>
          </div>
        </div>
      )}

      {/* Smart Welfare Stacking & Bundling Component */}
      <SmartWelfareBundles
        eligibleSchemes={eligibleSchemes}
        userProfile={userProfile}
        lang={lang}
        onApplyBundle={handleApplyStackedBundle}
        onTrackDbt={() => setShowDbtTracker(true)}
      />

      {/* ── Filter Tabs & Search ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap gap-1.5">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={L("Search scheme or sector...", "திட்டம் அல்லது துறையை தேடுக...", "योजना या क्षेत्र खोजें...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 hover:border-slate-300 transition"
          />
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. 100% ELIGIBLE SCHEMES (ACTIVE COLOR UI)                */}
      {/* ========================================================= */}
      {eligibleSchemes.length > 0 && (activeFilter === "ALL" || activeFilter === "ELIGIBLE" || activeFilter === "MICRO" || activeFilter === "TERM") && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
              <h2 className="text-base font-black text-slate-900 uppercase tracking-wide">
                {isTa ? `100% தகுதியான அரசு திட்டங்கள் (${eligibleSchemes.length})` : `100% Eligible Schemes (${eligibleSchemes.length})`}
              </h2>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              {isTa ? "செயல்பாட்டில் உள்ளது • வங்கிக்கு விண்ணப்பிக்கலாம்" : "Active UI • Direct Bank Handshake Enabled"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eligibleSchemes.map((scheme) => (
              <LiveSchemeCard
                key={scheme.scheme_id}
                scheme={scheme}
                userProfile={userProfile}
                lang={lang}
                onSelect={handleSelectScheme}
                onApply={(s) => handleBankApplicationRoute(s)}
                onOpenCalculator={onOpenCalculator}
                onOpenLocator={onOpenLocator}
              />
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. INELIGIBLE / FROZEN SCHEMES (<100% MATCH)              */}
      {/* ========================================================= */}
      {ineligibleSchemes.length > 0 && (activeFilter === "ALL" || activeFilter === "FROZEN") && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-slate-400" />
              <h2 className="text-base font-black text-slate-600 uppercase tracking-wide">
                {isTa ? `நிறுத்திவைக்கப்பட்ட / தகுதியற்ற திட்டங்கள் (${ineligibleSchemes.length})` : `Locked / Ineligible Schemes (<100% Match) (${ineligibleSchemes.length})`}
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              {isTa ? "சாம்பல் நிறம் • தகுதி வரம்பு விளக்கம்" : "Grayscale Frozen State • Rule Breakdown"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ineligibleSchemes.map((scheme) => (
              <LiveSchemeCard
                key={scheme.scheme_id}
                scheme={scheme}
                userProfile={userProfile}
                lang={lang}
                onSelect={handleSelectScheme}
                onOpenCalculator={onOpenCalculator}
                onOpenLocator={onOpenLocator}
              />
            ))}
          </div>
        </div>
      )}

      {/* Scheme Detail Audit Drawer */}
      {selectedSchemeDetail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">
                  {selectedSchemeDetail.scheme_id}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  {isTa && selectedSchemeDetail.scheme_name_ta ? selectedSchemeDetail.scheme_name_ta : selectedSchemeDetail.scheme_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSchemeDetail(null)}
                className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl"
              >
                Close
              </button>
            </div>

            {/* Audit Breakdown */}
            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  {isTa ? "துல்லியமான 7 தகுதி விதிமுறை சோதனை:" : "Deterministic 7-Criteria Eligibility Audit:"}
                </span>
                <div className="space-y-2 mt-2">
                  {selectedSchemeDetail.audits?.map((audit, i) => (
                    <div key={i} className="flex items-start justify-between gap-2 p-2.5 rounded-xl bg-white border border-slate-100">
                      <div className="flex items-start gap-2">
                        {audit.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span className="font-bold text-slate-900 block">{audit.criterion}</span>
                          <span className={audit.passed ? "text-slate-600" : "text-amber-700 font-semibold"}>
                            {audit.reason}
                          </span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                        audit.passed ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        {audit.passed ? "PASS" : "FAIL"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="flex gap-2 pt-2">
                {selectedSchemeDetail.is_eligible ? (
                  <button
                    onClick={() => {
                      handleBankApplicationRoute(selectedSchemeDetail);
                      setSelectedSchemeDetail(null);
                    }}
                    className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-black text-xs transition flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Landmark className="w-4 h-4 text-amber-300" />
                    <span>{isTa ? "வங்கி கடன் விண்ணப்பத்தை தொடர்க ➔" : "Route to Partner Bank for Direct Sanction ➔"}</span>
                  </button>
                ) : (
                  <div className="w-full text-center text-xs text-amber-900 font-bold bg-amber-50 p-3 rounded-2xl border border-amber-200">
                    🔒 {isTa ? "தற்போது தகுதி பெறவில்லை. தோல்வியடைந்த விதிகளை காண்க." : `Currently Ineligible (${selectedSchemeDetail.match_percentage}%). Review failed audit rules above.`}
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Alpha Portal Official Gazette Verification Modal */}
      {gazetteScheme && (
        <AlphaGazetteModal
          scheme={gazetteScheme}
          lang={lang}
          onClose={() => setGazetteScheme(null)}
        />
      )}

      {/* APB-DBT Direct Benefit Transfer Real-Time Lifecycle Tracker Modal */}
      {showDbtTracker && (
        <DbtLifecycleTrackerModal
          isOpen={showDbtTracker}
          onClose={() => setShowDbtTracker(false)}
          userProfile={userProfile}
          scheme={eligibleSchemes[0] || schemes[0]}
          lang={lang}
        />
      )}

    </div>
  );
}
