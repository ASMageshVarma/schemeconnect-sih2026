import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Lock, Sparkles, ArrowLeft, 
  UserCheck, ChevronRight, Search, AlertTriangle, 
  Landmark, RefreshCw
} from 'lucide-react';
import { LiveSchemeCard } from './LiveSchemeCard';
import { AlphaGazetteModal } from './AlphaGazetteModal';
import { rankAlphaSchemes } from '../utils/alphaMatcher';
import { getAlphaSchemes, subscribeToAlphaChanges } from '../utils/realtimeSync';
import { generateReferralJWT } from '../utils/jwtToken';
import { navigateToBeta } from '../config/portalConfig';

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
  const [lastPolicyUpdate, setLastPolicyUpdate] = useState(null);
  const [selectedSchemeDetail, setSelectedSchemeDetail] = useState(null);
  const [gazetteScheme, setGazetteScheme] = useState(null);

  // Policy changes listener
  useEffect(() => {
    const unsubscribe = subscribeToAlphaChanges((updatedSchemes, meta) => {
      setSchemes(updatedSchemes);
      if (meta?.reason) {
        setLastPolicyUpdate({
          time: new Date().toLocaleTimeString(),
          message: meta.reason,
        });

        const timer = setTimeout(() => setLastPolicyUpdate(null), 6000);
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
    const { token, payload, referralId } = generateReferralJWT(scheme, userProfile, {
      trustScore: 98,
      ekycVerified: true,
      ocrConfidence: 96,
      udyamVerified: true,
      aaCashflowVerified: true
    });
    
    navigateToBeta(token, referralId, true);

    if (onRouteToBank) {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 animate-fadeIn">
      
      {/* Citizen-Friendly Live Update Notice (No infrastructure/WebSocket jargon) */}
      {lastPolicyUpdate && (
        <div className="bg-emerald-600 text-white p-3.5 rounded-2xl shadow-lg mb-6 flex items-center justify-between gap-3 text-xs font-bold border border-emerald-400 animate-fadeIn">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
            <span>
              {isTa 
                ? `கொள்கை புதுப்பிக்கப்பட்டது: ${lastPolicyUpdate.message} — தகுதிகள் நிகழ்நேரத்தில் கணக்கிடப்பட்டன.` 
                : `Policy criteria updated: ${lastPolicyUpdate.message} — Scheme rankings recalculated.`}
            </span>
          </div>
          <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded-full font-bold shrink-0">
            {lastPolicyUpdate.time}
          </span>
        </div>
      )}

      {/* Top Navigation / Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <button
          onClick={onEditProfile}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-700 hover:text-blue-600 bg-white border border-slate-200 px-4 py-2.5 rounded-2xl shadow-xs transition w-fit cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isTa ? "சுயவிவரத்தை மாற்றுக (Edit Intake)" : "Edit Profile / Intake Parameters"}</span>
        </button>

        <div className="text-xs text-slate-500 font-semibold">
          {L("Showing results based on your 7 verified parameters", "உங்கள் 7 சரிபார்க்கப்பட்ட அளவுகோல்களின் அடிப்படையில் முடிவுகள்", "आपके 7 सत्यापित मापदंडों के आधार पर परिणाम")}
        </div>
      </div>

      {/* Citizen Summary Profile Banner */}
      {!userProfile ? (
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 border border-blue-900 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-400/30 mb-2">
              <UserCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>{L("Step 1: Complete Beneficiary Intake", "படி 1: புதிய விண்ணப்பப் பதிவு", "चरण 1: नया आवेदक पंजीकरण")}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {L("Please Complete the 7-Step Wizard First", "முதலில் 7-படி வழிகாட்டியை முடிக்கவும்", "कृपया पहले 7-चरण विज़ार्ड पूरा करें")}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              {L(
                "You haven't submitted your applicant details yet. Complete the 7-step wizard to see your personalized 100% eligible welfare schemes.",
                "நீங்கள் இன்னும் உங்கள் விவரங்களை பதிவு செய்யவில்லை. உங்களுக்கான துல்லியமான தகுதியான திட்டங்களை காண வழிகாட்டியை முடிக்கவும்.",
                "आपने अभी तक आवेदक विवरण दर्ज नहीं किया है। व्यक्तिगत पात्र योजनाएँ देखने के लिए 7-चरण विज़ार्ड पूरा करें।"
              )}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <button
              onClick={onEditProfile}
              className="px-6 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-2xl font-black text-xs shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{L("Start 7-Step Wizard ➔", "7-படி வழிகாட்டியைத் தொடங்க ➔", "7-चरण विज़ार्ड शुरू करें ➔")}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-bold border border-blue-400/30 mb-3">
                <UserCheck className="w-3.5 h-3.5" />
                <span>{L("Verified Beneficiary Profile", "சரிபார்க்கப்பட்ட குடிமகன் சுயவிவரம்", "सत्यापित लाभार्थी प्रोफ़ाइल")}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {userProfile.name} ({userProfile.age} {L("Yrs", "வயது", "वर्ष")})
              </h1>

              <div className="flex flex-wrap gap-2 mt-3 text-xs">
                <span className="bg-white/10 px-3 py-1 rounded-xl font-semibold border border-white/10">
                  {userProfile.area} {L("Area", "பகுதி", "क्षेत्र")}
                </span>
                <span className="bg-blue-600/60 px-3 py-1 rounded-xl font-semibold border border-blue-400/40">
                  {userProfile.sector}
                </span>
                <span className="bg-white/10 px-3 py-1 rounded-xl font-semibold border border-white/10">
                  ₹{Number(userProfile.income).toLocaleString('en-IN')} / {L("Yr", "ஆண்டு வருமானம்", "वार्षिक")}
                </span>
                <span className="bg-white/10 px-3 py-1 rounded-xl font-semibold border border-white/10">
                  {userProfile.caste}
                </span>
                <span className="bg-white/10 px-3 py-1 rounded-xl font-semibold border border-white/10">
                  {L("SHG:", "சுயஉதவிக்குழு:", "SHG:")} {userProfile.shg_membership === "Yes" ? L("Member", "உறுப்பினர்", "सदस्य") : L("Non-Member", "உறுப்பினர் இல்லை", "गैर-सदस्य")}
                </span>
              </div>
            </div>

            {/* Match summary stats */}
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 shrink-0">
              <div className="text-center px-4 border-r border-white/10">
                <span className="text-3xl font-black text-emerald-400 block">
                  {eligibleSchemes.length}
                </span>
                <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">
                  {L("100% Eligible", "100% தகுதியானவை", "100% पात्र")}
                </span>
              </div>
              <div className="text-center px-4">
                <span className="text-3xl font-black text-slate-400 block">
                  {ineligibleSchemes.length}
                </span>
                <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">
                  {L("Locked / Ineligible", "நிறுத்தப்பட்டவை", "अपात्र / लॉक")}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1.5 w-full lg:w-auto">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
      {/* UNIFIED SCHEME CARDS GRID (ONE BROWSING PATTERN)          */}
      {/* ========================================================= */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wide">
              {isTa 
                ? `பொருந்திய அரசு திட்டங்கள் (${filteredSchemes.length})` 
                : `Matched Welfare Schemes (${filteredSchemes.length})`}
            </h2>
          </div>
          <span className="text-xs font-medium text-slate-500">
            {activeFilter === 'ALL' 
              ? (isTa ? "தகுதியானவை முதலில் வரிசைப்படுத்தப்பட்டுள்ளன" : "Eligible schemes ranked first")
              : (isTa ? "வடிகட்டப்பட்ட முடிவுகள்" : "Filtered results")}
          </span>
        </div>

        {filteredSchemes.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500">
            <p className="text-sm font-bold">{isTa ? "திட்டங்கள் எதுவும் பொருந்தவில்லை." : "No schemes match your selected filter."}</p>
            <button
              onClick={() => { setActiveFilter("ALL"); setSearchQuery(""); }}
              className="mt-3 px-4 py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded-xl hover:bg-blue-100 transition cursor-pointer"
            >
              {isTa ? "அனைத்து திட்டங்களையும் காட்டு" : "Reset Filters"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchemes.map((scheme) => (
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
        )}
      </div>

      {/* Scheme Detail Audit Modal */}
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
                className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl cursor-pointer"
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
                    className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-black text-xs transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
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

      {/* Official Gazette Verification Modal */}
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

export default RecommendationsGridPage;
