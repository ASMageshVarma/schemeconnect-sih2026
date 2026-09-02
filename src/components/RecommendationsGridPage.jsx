import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Lock, Unlock, Sparkles, Filter, ArrowLeft, 
  FileText, UserCheck, Shield, ChevronRight, Search, 
  MapPin, Radio, Calculator, Bot, AlertTriangle, IndianRupee, 
  Volume2, Check, ArrowRight 
} from 'lucide-react';
import { LiveSchemeCard } from './LiveSchemeCard';
import { rankAlphaSchemes } from '../utils/alphaMatcher';
import { getAlphaSchemes, subscribeToAlphaChanges } from '../utils/realtimeSync';
import { speakText } from '../utils/speech';

export function RecommendationsGridPage({ 
  userProfile, 
  lang = "en", 
  t, 
  onEditProfile, 
  onOpenCalculator, 
  onOpenLocator, 
  onOpenCounselor,
  onOpenSplitDemo,
  onOpenAdmin 
}) {
  const isTa = lang === "ta";
  const [schemes, setSchemes] = useState(getAlphaSchemes());
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [lastLiveStreamEvent, setLastLiveStreamEvent] = useState(null);
  const [voiceApplyScheme, setVoiceApplyScheme] = useState(null);
  const [isApplyingVoice, setIsApplyingVoice] = useState(false);
  const [selectedSchemeDetail, setSelectedSchemeDetail] = useState(null);

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

  const rankedSchemes = rankAlphaSchemes(schemes, userProfile, lang);
  const eligibleSchemes = rankedSchemes.filter(s => s.is_eligible);
  const ineligibleSchemes = rankedSchemes.filter(s => !s.is_eligible);

  // Filters
  const filterTabs = [
    { id: "ALL", label: isTa ? "அனைத்து திட்டங்கள்" : "All Schemes" },
    { id: "ELIGIBLE", label: isTa ? "✓ 100% தகுதியானவை" : "✓ 100% Eligible Only" },
    { id: "MICRO", label: isTa ? "⚡ நுண்கடன் (≤₹1.40L)" : "⚡ Micro Finance (≤₹1.40L)" },
    { id: "TERM", label: isTa ? "🏢 தொழில் கடன் (≤₹50L)" : "🏢 Term Loans (≤₹50L)" },
    { id: "FROZEN", label: isTa ? "🔒 நிறுத்திவைக்கப்பட்டவை" : "🔒 Ineligible / Frozen" }
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

  const handleVoiceApply = (scheme) => {
    setVoiceApplyScheme(scheme);
    setIsApplyingVoice(true);

    const spokenPrompt = isTa
      ? `${scheme.scheme_name_ta}. உங்கள் ஆதார் மற்றும் வங்கி கணக்கு விவரங்கள் இணைக்கப்பட்டுள்ளன. இத்திட்டத்திற்கு 100% அரசு மானியத்துடன் விண்ணப்பிக்க உறுதி செய்கிறீர்களா?`
      : `Applying for ${scheme.scheme_name}. Your verified KYC documents have been attached. Total Sanctioned Amount: ₹${Number(scheme.sanctioned_amount).toLocaleString('en-IN')}. Confirming application submission.`;

    speakText(spokenPrompt, lang);

    setTimeout(() => {
      setIsApplyingVoice(false);
    }, 4000);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <button
          onClick={onEditProfile}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-700 hover:text-blue-600 bg-white border border-slate-200 px-4 py-2.5 rounded-2xl shadow-xs transition w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isTa ? "சுயவிவரத்தை மாற்றுக (Edit Intake)" : "Edit Profile / Intake Parameters"}</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenSplitDemo && (
            <button
              onClick={onOpenSplitDemo}
              className="inline-flex items-center space-x-1.5 text-xs font-black bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-2xl shadow-sm transition"
            >
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>{isTa ? "நடுவர் நேரடி திரை (Split Demo)" : "Judge Split-Screen Demo"}</span>
            </button>
          )}

          {onOpenLocator && (
            <button
              onClick={onOpenLocator}
              className="inline-flex items-center space-x-1.5 text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-2xl shadow-xs transition"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isTa ? "அருகிலுள்ள வங்கிகள் (Partner Locator)" : "Find Channel Partners"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Citizen Summary Profile Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-bold border border-blue-400/30 mb-3">
              <UserCheck className="w-3.5 h-3.5" />
              <span>{isTa ? "சரிபார்க்கப்பட்ட குடிமகன் சுயவிவரம்" : "Verified Beneficiary Profile"}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {userProfile.name || "Rajan S."} ({userProfile.age || 39} {isTa ? "வயது" : "Yrs"})
            </h1>

            <div className="flex flex-wrap gap-2 mt-3 text-xs">
              <span className="bg-white/10 px-3 py-1 rounded-xl font-semibold border border-white/10">
                {userProfile.area || "Urban"} {isTa ? "பகுதி" : "Area"}
              </span>
              <span className="bg-blue-600/60 px-3 py-1 rounded-xl font-semibold border border-blue-400/40">
                {userProfile.sector || "Street Vendor"}
              </span>
              <span className="bg-white/10 px-3 py-1 rounded-xl font-semibold border border-white/10">
                ₹{Number(userProfile.income || 200000).toLocaleString('en-IN')} / {isTa ? "ஆண்டு வருமானம்" : "Yr"}
              </span>
              <span className="bg-white/10 px-3 py-1 rounded-xl font-semibold border border-white/10">
                {userProfile.caste || "SC/ST"}
              </span>
              <span className="bg-white/10 px-3 py-1 rounded-xl font-semibold border border-white/10">
                {isTa ? "சுயஉதவிக்குழு:" : "SHG Status:"} {userProfile.shg_membership === "Yes" ? (isTa ? "உறுப்பினர்" : "Member") : (isTa ? "உறுப்பினர் இல்லை" : "Non-Member")}
              </span>
            </div>
          </div>

          {/* Matches & Live Score Box */}
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 shrink-0">
            <div className="text-center px-4 border-r border-white/10">
              <span className="text-3xl font-black text-emerald-400 block">
                {eligibleSchemes.length}
              </span>
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">
                {isTa ? "100% தகுதியானவை" : "100% Eligible"}
              </span>
            </div>
            <div className="text-center px-4">
              <span className="text-3xl font-black text-amber-400 block">
                {ineligibleSchemes.length}
              </span>
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">
                {isTa ? "நிறுத்தப்பட்டவை" : "Locked / Frozen"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1.5 w-full lg:w-auto">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
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
              {isTa ? "செயல்பாட்டில் உள்ளது • விண்ணப்பிக்கலாம்" : "Active UI • Fast-Track Apply Enabled"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eligibleSchemes.map((scheme) => (
              <LiveSchemeCard
                key={scheme.scheme_id}
                scheme={scheme}
                userProfile={userProfile}
                lang={lang}
                onSelect={(s) => setSelectedSchemeDetail(s)}
                onApply={(s) => handleVoiceApply(s)}
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
                onSelect={(s) => setSelectedSchemeDetail(s)}
                onOpenCalculator={onOpenCalculator}
                onOpenLocator={onOpenLocator}
              />
            ))}
          </div>
        </div>
      )}

      {/* Voice Application Modal */}
      {voiceApplyScheme && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center">
            
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Bot className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-black text-slate-900 mb-1">
              {isTa ? "குரல் வழி விண்ணப்ப உதவி (Voice Apply)" : "Fast-Track Voice Application"}
            </h3>
            <p className="text-xs font-bold text-blue-700 mb-4">
              {isTa ? voiceApplyScheme.scheme_name_ta : voiceApplyScheme.scheme_name}
            </p>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2 mb-5">
              <div className="flex justify-between">
                <span className="text-slate-500">{isTa ? "விண்ணப்பதாரர்:" : "Applicant:"}</span>
                <span className="font-bold text-slate-900">{userProfile.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{isTa ? "கடன் தொகை:" : "Sanction Amount:"}</span>
                <span className="font-black text-blue-700">₹{Number(voiceApplyScheme.sanctioned_amount).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{isTa ? "அரசு சலுகை வட்டி:" : "Interest Rate:"}</span>
                <span className="font-black text-emerald-700">{voiceApplyScheme.concessional_interest_rate || 5.0}% p.a.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{isTa ? "தகுதி நிலை:" : "Eligibility Status:"}</span>
                <span className="font-bold text-emerald-700">100% {isTa ? "சரிபார்க்கப்பட்டது" : "Verified Match"}</span>
              </div>
            </div>

            {isApplyingVoice ? (
              <div className="text-xs font-bold text-slate-600 py-2 flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                <span>{isTa ? "விண்ணப்ப ஆவணம் உருவாக்கப்படுகிறது..." : "Generating digital voucher token..."}</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{isTa ? "விண்ணப்பம் வெற்றிகரமாக பதிவு செய்யப்பட்டது!" : "Application Submitted Successfully!"}</span>
                </div>
                <button
                  onClick={() => setVoiceApplyScheme(null)}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
                >
                  {isTa ? "மூடுக (Close)" : "Close"}
                </button>
              </div>
            )}

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
                      handleVoiceApply(selectedSchemeDetail);
                      setSelectedSchemeDetail(null);
                    }}
                    className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs transition flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <span>{isTa ? "குரல் வழியில் விண்ணப்பிக்க" : "Apply via Voice & Online"}</span>
                    <ArrowRight className="w-4 h-4" />
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

    </div>
  );
}
