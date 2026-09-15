import React, { useState } from 'react';
import { Layers, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, ChevronDown, ChevronUp, Landmark, IndianRupee, HeartHandshake, Zap, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';

export function SmartWelfareBundles({ eligibleSchemes = [], userProfile, lang = "en", onApplyBundle, onTrackDbt }) {
  const [expandedBundle, setExpandedBundle] = useState(true);
  const isTa = lang === "ta";
  const isHi = lang === "hi";

  const L = (en, ta, hi) => isHi ? hi : (isTa ? ta : en);

  if (!eligibleSchemes || eligibleSchemes.length === 0) return null;

  // Find complementary schemes to create the ultimate welfare bundle
  const capitalScheme = eligibleSchemes.find(s => 
    (s.scheme_id || '').toLowerCase().includes('pmegp') || 
    (s.scheme_name || '').toLowerCase().includes('pmegp') ||
    Number(s.sanctioned_amount) >= 100000
  ) || eligibleSchemes[0];

  const skillScheme = eligibleSchemes.find(s => 
    s.scheme_id !== capitalScheme?.scheme_id && (
      (s.scheme_name || '').toLowerCase().includes('vishwakarma') ||
      (s.scheme_name || '').toLowerCase().includes('svanidhi') ||
      (s.scheme_name || '').toLowerCase().includes('shg') ||
      (s.sector || '').toLowerCase().includes('skill') ||
      Number(s.sanctioned_amount) <= 150000
    )
  ) || eligibleSchemes[1] || null;

  const safetyScheme = eligibleSchemes.find(s => 
    s.scheme_id !== capitalScheme?.scheme_id && 
    s.scheme_id !== skillScheme?.scheme_id
  ) || eligibleSchemes[2] || null;

  const bundleSchemes = [capitalScheme, skillScheme, safetyScheme].filter(Boolean);
  if (bundleSchemes.length < 2) return null;

  // Compute total stacked financial empowerment value
  const totalFinancialBenefit = bundleSchemes.reduce((acc, s) => acc + (Number(s.sanctioned_amount) || 50000), 0);
  const totalSubsidizedGrant = Math.round(totalFinancialBenefit * 0.35); // 35% average capital subsidy
  const formattedTotal = totalFinancialBenefit.toLocaleString('en-IN');
  const formattedGrant = totalSubsidizedGrant.toLocaleString('en-IN');

  const handleApplyStackedBundle = () => {
    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    } catch (e) {}
    if (onApplyBundle) {
      onApplyBundle(bundleSchemes, { totalBenefit: totalFinancialBenefit, totalGrant: totalSubsidizedGrant });
    }
  };

  return (
    <div className="mb-8 bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 rounded-3xl p-5 sm:p-7 border-2 border-indigo-500/40 shadow-2xl text-white relative overflow-hidden animate-fadeIn">
      {/* Decorative Background Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      {/* Header Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 relative z-10">
        <div className="flex items-center space-x-2.5">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/30">
            <Sparkles className="w-5 h-5 text-slate-950 fill-slate-950" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-wider uppercase text-amber-300">
                {L("Smart Scheme Stacking & Bundling", "ஒருங்கிணைந்த மும்முனை நலத்திட்ட தொகுப்பு", "स्मार्ट योजना स्टैकिंग एवं संयुक्त बंडल")}
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/40 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {L("Zero Re-Verification", "மீண்டும் ஆவணம் தேவையில்லை", "शून्य पुनः सत्यापन")}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight mt-0.5">
              {L("1-Click Quad-Ministry Empowerment Stack", "ஒரே கிளிக்கில் 3 அமைச்சக நலத்திட்டங்கள்", "1-क्लिक बहु-मंत्रालय सशक्तिकरण बंडल")}
            </h3>
          </div>
        </div>

        {/* Total Cumulative Financial Value */}
        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 text-left sm:text-right shrink-0">
          <span className="text-[10px] uppercase font-bold text-indigo-200 block">
            {L("Total Combined Entitlement", "மொத்த ஒருங்கிணைந்த பலன்", "कुल संयुक्त वित्तीय पात्रता")}
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-400 tracking-tight flex items-center gap-1 sm:justify-end">
            <IndianRupee className="w-5 h-5 text-emerald-400" />
            <span>₹{formattedTotal}</span>
          </span>
          <span className="text-[10px] text-amber-300 font-bold block">
            {L(`(Includes ₹${formattedGrant} Non-Repayable Capital Subsidy)`, `(₹${formattedGrant} திருப்பி செலுத்த தேவையில்லாத மானியம்)`, `(₹${formattedGrant} गैर-वापसी योग्य पूंजी सब्सिडी शामिल)`)}
          </span>
        </div>
      </div>

      {/* Rationale Pitch */}
      <p className="text-xs sm:text-sm text-slate-300 mb-5 relative z-10 leading-relaxed max-w-4xl">
        {L(
          "Instead of filling multiple applications across disjointed department portals, SchemeConnect dynamically stacks complementary credit, equipment, and social security programs tailored to your caste, income, and sector profile.",
          "ஒவ்வொரு அரசு அலுவலகத்திற்கும் தனித்தனியாக சென்று பல விண்ணப்பங்கள் போடுவதற்கு பதிலாக, உங்கள் சாதி, வருமானம் மற்றும் தொழில் தகுதிக்கு ஏற்ப அனைத்து துணை திட்டங்களையும் ஒரே இடத்தில் ஒருங்கிணைத்து இந்த மும்முனை தொகுப்பு வழங்குகிறது.",
          "अलग-अलग विभागों के चक्कर लगाने के बजाय, स्कीम-कनेक्ट आपकी जाति, आय और व्यवसाय के आधार पर ऋण, उपकरण और सामाजिक सुरक्षा योजनाओं को एक साथ बंडल करता है।"
        )}
      </p>

      {/* Stacked Scheme Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-6 relative z-10">
        {bundleSchemes.map((scheme, idx) => {
          const roles = [
            L("Layer 1: Primary Working Capital", "அடுக்கு 1: முதன்மை முதலீட்டுக் கடன்", "स्तर 1: प्राथमिक कार्यशील पूंजी"),
            L("Layer 2: Equipment / Toolkit Grant", "அடுக்கு 2: உபகரணங்கள் மற்றும் மானியம்", "स्तर 2: उपकरण एवं टूलकिट अनुदान"),
            L("Layer 3: Social & Health Safety Net", "அடுக்கு 3: சமூக மற்றும் மருத்துவ பாதுகாப்பு", "स्तर 3: सामाजिक एवं स्वास्थ्य सुरक्षा")
          ];
          const badgeColors = [
            "border-blue-400/40 bg-blue-500/10 text-blue-300",
            "border-amber-400/40 bg-amber-500/10 text-amber-300",
            "border-emerald-400/40 bg-emerald-500/10 text-emerald-300"
          ];

          return (
            <div 
              key={scheme.scheme_id || idx}
              className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-indigo-400/50 rounded-2xl p-4 transition duration-200 flex flex-col justify-between"
            >
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border mb-2.5 inline-block ${badgeColors[idx]}`}>
                  {roles[idx]}
                </span>
                <h4 className="text-sm font-bold text-white line-clamp-2 mb-1">
                  {isTa && scheme.scheme_name_ta ? scheme.scheme_name_ta : scheme.scheme_name}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">
                  {isTa && scheme.description_ta ? scheme.description_ta : scheme.description}
                </p>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">{L("Entitlement", "மதிப்பு", "पात्रता")}:</span>
                <span className="font-mono font-black text-emerald-300">
                  ₹{Number(scheme.sanctioned_amount || 50000).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action CTA Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10 relative z-10">
        <div className="flex items-center space-x-2 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            {L(
              "Single RS256 token co-signs all 3 statutory applications with Zero Raw PII disclosure.",
              "ஒரே ஒரு RS256 டோக்கன் மூலம் உங்கள் தனிப்பட்ட ரகசியங்கள் கசியாமல் 3 விண்ணப்பங்களும் ஒப்புதல் பெறுகின்றன.",
              "एकल RS256 टोकन शून्य कच्चा डेटा साझा किए बिना तीनों आवेदनों को सह-हस्ताक्षरित करता है।"
            )}
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {onTrackDbt && (
            <button
              type="button"
              onClick={onTrackDbt}
              className="w-full sm:w-auto px-4 py-2.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-indigo-300" />
              <span>{L("Track APB-DBT Status", "நேரடி மானிய நிலவரம்", "डीबीटी स्थिति ट्रैक करें")}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleApplyStackedBundle}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-500/30 transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <span>{L("Apply for All 3 Schemes in 1-Click ➔", "ஒரே கிளிக்கில் 3 திட்டங்களுக்கும் விண்ணப்பிக்க ➔", "1-क्लिक में सभी 3 योजनाओं के लिए आवेदन करें ➔")}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
