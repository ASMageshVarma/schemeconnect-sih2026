import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Lock, Unlock, Sparkles, Filter, ArrowLeft, 
  FileText, UserCheck, Shield, ChevronRight, Search, 
  MapPin, Radio, Calculator, Bot, AlertTriangle, IndianRupee, 
  Volume2, Check, ArrowRight, Landmark 
} from 'lucide-react';
import { LiveSchemeCard } from './LiveSchemeCard';
import { AlphaGazetteModal } from './AlphaGazetteModal';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      
      {/* Live Stream Broadcast Toast */}
      {lastLiveStreamEvent && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white p-4 rounded-2xl shadow-xl mb-6 flex items-center justify-between gap-3 animate-bounce border border-emerald-400">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Radio className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-emerald-100">
                ⚡ Live Ministry WebSocket Stream Received [{lastLiveStreamEvent.time}]
              </div>
              <div className="text-xs sm:text-sm font-black text-white">
                {lastLiveStreamEvent.message} ➔ Real-time eligibility recalculated!
              </div>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-white/20 px-2.5 py-1 rounded-full font-bold">
            SYNC &lt; 10MS
          </span>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={onEditProfile}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-700 hover:text-[#1e3a8a] bg-white border border-slate-200 hover:border-slate-300 px-3.5 py-2 rounded-lg shadow-xs transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isTa ? "சுயவிவரத்தை மாற்றுக (Edit Intake)" : "← Edit Profile / Intake Parameters"}</span>
        </button>

        {onOpenLocator && (
          <button
            onClick={onOpenLocator}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3.5 py-2 rounded-lg shadow-xs transition"
          >
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span>{isTa ? "அருகிலுள்ள வங்கிகள்" : "Partner Bank Locator"}</span>
          </button>
        )}
      </div>

      {/* Citizen Summary Profile Banner */}
      {!userProfile ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs mb-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold border border-slate-200 mb-2">
              <UserCheck className="w-3.5 h-3.5 text-slate-600" />
              <span>{L("Step 1: Complete Beneficiary Intake", "படி 1: புதிய விண்ணப்பப் பதிவு", "चरण 1: नया आवेदक पंजीकरण")}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {L("Please Fill the Applicant Input Form First", "முதலில் புதிய விண்ணப்பதாரர் படிவத்தை நிரப்பவும்", "कृपया पहले नया आवेदक इनपुट फ़ॉर्म भरें")}
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
              {L(
                "You haven't submitted your applicant details yet. Complete the 7-parameter intake form with Voice or OCR to calculate your exact 100% eligible welfare schemes.",
                "நீங்கள் இன்னும் உங்கள் சுயவிவரத்தை பதிவு செய்யவில்லை. உங்களுக்கான துல்லியமான 100% தகுதியான திட்டங்களை கணக்கிட குரல் அல்லது OCR மூலம் பதிவு செய்யவும்.",
                "आपने अभी तक आवेदक विवरण दर्ज नहीं किया है। अपनी सटीक 100% पात्र योजनाएँ देखने के लिए वॉयस या OCR द्वारा फ़ॉर्म भरें।"
              )}
            </p>
          </div>
          <button
            onClick={onEditProfile}
            className="px-5 py-2.5 bg-[#1e3a8a] hover:bg-[#172554] text-white rounded-lg font-semibold text-xs shadow-xs transition flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>{L("Open Applicant Input Form ➔", "விண்ணப்ப படிவத்தை திறக்க ➔", "आवेदक इनपुट फ़ॉर्म खोलें ➔")}</span>
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold border border-slate-200 mb-2">
                <UserCheck className="w-3.5 h-3.5 text-slate-600" />
                <span>{L("Verified Beneficiary Profile", "சரிபார்க்கப்பட்ட குடிமகன் சுயவிவரம்", "सत्यापित लाभार्थी प्रोफ़ाइल")}</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {userProfile.name} ({userProfile.age} {L("Yrs", "வயது", "वर्ष")})
              </h1>

              <div className="flex flex-wrap gap-2 mt-2.5 text-xs">
                <span className="bg-slate-100 px-3 py-1 rounded-lg font-medium text-slate-700 border border-slate-200">
                  {userProfile.area} {L("Area", "பகுதி", "क्षेत्र")}
                </span>
                <span className="bg-slate-100 px-3 py-1 rounded-lg font-medium text-slate-700 border border-slate-200">
                  {userProfile.sector}
                </span>
                <span className="bg-slate-100 px-3 py-1 rounded-lg font-medium text-slate-700 border border-slate-200">
                  ₹{Number(userProfile.income).toLocaleString('en-IN')} / {L("Yr", "ஆண்டு வருமானம்", "वार्षिक")}
                </span>
                <span className="bg-slate-100 px-3 py-1 rounded-lg font-medium text-slate-700 border border-slate-200">
                  {userProfile.caste}
                </span>
                <span className="bg-slate-100 px-3 py-1 rounded-lg font-medium text-slate-700 border border-slate-200">
                  {L("SHG Status:", "சுயஉதவிக்குழு:", "SHG स्थिति:")} {userProfile.shg_membership === "Yes" ? L("Member", "உறுப்பினர்", "सदस्य") : L("Non-Member", "உறுப்பினர் இல்லை", "गैर-सदस्य")}
                </span>
              </div>
            </div>

            {/* Matches & Live Score Box */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-center px-4 py-2.5 rounded-lg bg-[#f0fdf4] border border-[#bbf7d0]">
                <span className="text-2xl font-bold text-[#166534] block">
                  {eligibleSchemes.length}
                </span>
                <span className="text-[10px] text-[#166534] font-semibold uppercase tracking-wider">
                  {L("100% Eligible", "100% தகுதியானவை", "100% पात्र")}
                </span>
              </div>
              <div className="text-center px-4 py-2.5 rounded-lg bg-[#fef2f2] border border-[#fecaca]">
                <span className="text-2xl font-bold text-[#991b1b] block">
                  {ineligibleSchemes.length}
                </span>
                <span className="text-[10px] text-[#991b1b] font-semibold uppercase tracking-wider">
                  {L("Locked / Ineligible", "நிறுத்தப்பட்டவை", "अपात्र / लॉक")}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs mb-6 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1.5 w-full lg:w-auto">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-[#1e3a8a] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={isTa ? "திட்டம் அல்லது துறையை தேடுக..." : "Search scheme or sector..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
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

    </div>
  );
}
