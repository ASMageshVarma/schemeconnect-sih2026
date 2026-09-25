import React from 'react';
import { Landmark, MapPin, CheckCircle2, ArrowRight, ShieldCheck, Zap, X, Star, ExternalLink, Clock, Loader2 } from 'lucide-react';
import { PARTICIPATING_BANKS } from '../utils/bankStore';

/**
 * BankSelectionModal — Allows citizen to choose a partner bank/NBFC
 * before proceeding to that bank's parameterized application and sanction flow.
 *
 * Props:
 *  isOpen       — boolean
 *  onClose      — () => void
 *  scheme       — scheme object
 *  userProfile  — profile object
 *  onSelectBank — (bank, scheme) => void  (parent opens bank tab & sets pendingBank)
 *  pendingBank  — bank object | null  (set by parent while bank tab is open)
 *  lang         — 'en' | 'ta' | 'hi'
 */
export function BankSelectionModal({
  isOpen,
  onClose,
  scheme,
  userProfile,
  onSelectBank,
  pendingBank = null,
  lang = 'en'
}) {
  if (!isOpen || !scheme) return null;

  const isTa = lang === 'ta';
  const isHi = lang === 'hi';
  const L = (en, ta, hi) => isHi ? hi : (isTa ? ta : en);

  // Enriched metadata for participating banks including branch distance and rationale
  const enrichedBanks = [
    {
      id: "ZETA_BANK",
      name: "ZETA BANK",
      category: L("Cooperative Micro-Credit Node", "கூட்டுறவு மைக்ரோ-கிரெடிட் மையம்", "सहकारी सूक्ष्म-ऋण नोड"),
      branch: L("Trichy Main Commercial Hub", "திருச்சி முதன்மை வணிக மையம்", "त्रिची मुख्य वाणिज्यिक केंद्र"),
      distance: "0.8 km",
      rate: "4.5% - 5.0% p.a.",
      why: L(
        "Instant RS256 token verification with zero collateral and same-day direct APB-DBT disbursement.",
        "பூஜ்ஜிய பிணையத்துடன் உடனடி RS256 டோக்கன் சரிபார்ப்பு மற்றும் அதே நாளில் APB-DBT பரிமாற்றம்.",
        "शून्य संपार्श्विक के साथ त्वरित RS256 टोकन सत्यापन और उसी दिन प्रत्यक्ष APB-DBT संवितरण।"
      ),
      badge: L("⚡ Fast-Track Node", "⚡ அதிவேக மையம்", "⚡ फ़ास्ट-ट्रैक नोड"),
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      recommended: true
    },
    {
      id: "EPSILON_BANK",
      name: "EPSILON BANK",
      category: L("Women SHG & Artisan Special Desk", "மகளிர் SHG மற்றும் கைவினைஞர் சிறப்பு மையம்", "महिला एसएचजी एवं शिल्पकार विशेष डेस्क"),
      branch: L("Thillai Nagar Financial Center", "தில்லை நகர் நிதி மையம்", "थिल्लई नगर वित्तीय केंद्र"),
      distance: "1.4 km",
      rate: "4.5% - 5.5% p.a.",
      why: L(
        "Dedicated concession desk for women entrepreneurs, Self-Help Groups (SHGs), and traditional craftspeople.",
        "பெண் தொழில்முனைவோர், சுயஉதவிக்குழுக்கள் மற்றும் கைவினைஞர்களுக்கான பிரத்யேக சலுகை மையம்.",
        "महिला उद्यमियों, स्वयं सहायता समूहों (SHG) और पारंपरिक कारीगरों के लिए समर्पित रियायती डेस्क।"
      ),
      badge: L("🌸 Women & Artisan Hub", "🌸 மகளிர் & கைவினை மையம்", "🌸 महिला एवं शिल्प हब"),
      badgeColor: "bg-rose-100 text-rose-800 border-rose-300",
      recommended: false
    },
    {
      id: "MYBANK",
      name: "MYBANK (Lead MSME Hub)",
      category: L("Nationalized Lead Bank", "தேசியமயமாக்கப்பட்ட முதன்மை வங்கி", "राष्ट्रीयकृत लीड बैंक"),
      branch: L("Cantonment Lead District Branch", "கண்டோன்மென்ட் மாவட்ட தலைமை கிளை", "छावनी लीड जिला शाखा"),
      distance: "2.1 km",
      rate: "5.0% - 6.0% p.a.",
      why: L(
        "Official designated lead district bank with direct central subsidy escrow reconciliation.",
        "மத்திய அரசு மானிய தீர்வுடன் கூடிய அங்கீகரிக்கப்பட்ட முன்னணி மாவட்ட வங்கி.",
        "प्रत्यक्ष केंद्रीय सब्सिडी एस्क्रो समाधान वाला आधिकारिक नामित अग्रणी जिला बैंक।"
      ),
      badge: L("🏛️ Public Sector Lead", "🏛️ பொதுத்துறை முன்னணி", "🏛️ सार्वजनिक क्षेत्र लीड"),
      badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
      recommended: false
    },
    {
      id: "YOUR_BANK",
      name: "YOUR BANK (Gramin Inclusion)",
      category: L("Regional Rural & Inclusion Bank", "பிராந்திய கிராமப்புற & உள்ளடக்க வங்கி", "क्षेत्रीय ग्रामीण एवं समावेशी बैंक"),
      branch: L("Srirangam Agro & Micro Wing", "ஸ்ரீரங்கம் வேளாண் & மைக்ரோ பிரிவு", "श्रीरंगम कृषि एवं सूक्ष्म विंग"),
      distance: "3.2 km",
      rate: "4.0% - 4.5% p.a.",
      why: L(
        "Lowest statutory interest rate for SC/ST and rural micro-entrepreneurs with doorstep field verification.",
        "SC/ST மற்றும் கிராமப்புற தொழில்முனைவோருக்கான மிகக் குறைந்த வட்டி விகிதம் மற்றும் நேரடி கள ஆய்வு.",
        "एससी/एसटी और ग्रामीण सूक्ष्म उद्यमियों के लिए सबसे कम वैधानिक ब्याज दर एवं घर-द्वार सत्यापन।"
      ),
      badge: L("🌱 Priority Inclusion", "🌱 முன்னுரிமை உள்ளடக்கம்", "🌱 प्राथमिकता समावेशन"),
      badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
      recommended: false
    }
  ];

  // ── PENDING STATE: Bank tab opened, awaiting approval ──────────────────────
  if (pendingBank) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
        <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="bg-[#0f172a] text-white p-6">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center">
                  <ExternalLink className="w-4 h-4 text-white" />
                </div>
                <span className="font-black text-base text-white">
                  {L("Bank Portal Opened", "வங்கி போர்டல் திறக்கப்பட்டது", "बैंक पोर्टल खुला")}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {L(
                `Redirected to ${pendingBank.name} portal in a new tab.`,
                `${pendingBank.name} போர்டல் புதிய தாவலில் திறக்கப்பட்டது.`,
                `${pendingBank.name} पोर्टल नए टैब में खुला।`
              )}
            </p>
          </div>

          {/* Waiting body */}
          <div className="p-7 flex flex-col items-center text-center gap-5">
            {/* Animated spinner */}
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
              <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Landmark className="w-7 h-7 text-blue-600" />
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="font-black text-base text-slate-900">
                {L("Awaiting Bank Approval…", "வங்கி அனுமதிக்காக காத்திருக்கிறது…", "बैंक अनुमोदन की प्रतीक्षा…")}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                {L(
                  `Complete the sanction process in the ${pendingBank.name} tab. This page will update automatically once your loan is approved.`,
                  `${pendingBank.name} தாவலில் அனுமதி செயல்முறையை நிறைவு செய்யுங்கள். கடன் அனுமதிக்கப்பட்டவுடன் இந்தப் பக்கம் தானாகப் புதுப்பிக்கப்படும்.`,
                  `${pendingBank.name} टैब में स्वीकृति प्रक्रिया पूरी करें। ऋण स्वीकृत होते ही यह पेज स्वतः अपडेट होगा।`
                )}
              </p>
            </div>

            {/* Step trail */}
            <div className="w-full bg-slate-50 rounded-2xl border border-slate-100 p-4 text-left space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-slate-700 font-semibold">
                  {L("ZKP credentials forwarded via RS256 JWT", "RS256 JWT மூலம் ZKP நற்சான்றுகள் அனுப்பப்பட்டன", "RS256 JWT के माध्यम से ZKP क्रेडेंशियल भेजे गए")}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-slate-700 font-semibold">
                  {L(`Routing to: ${pendingBank.name}`, `${pendingBank.name}-க்கு திருப்பி விடப்பட்டது`, `${pendingBank.name} को रूट किया गया`)}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-xs">
                <Loader2 className="w-4 h-4 text-amber-500 shrink-0 animate-spin" />
                <span className="text-amber-700 font-semibold">
                  {L("Officer review & sanction in progress…", "அதிகாரி மதிப்பாய்வு & அனுமதி நடந்து வருகிறது…", "अधिकारी समीक्षा और स्वीकृति प्रगति में…")}
                </span>
              </div>
            </div>

            {/* Dismiss hint */}
            <p className="text-[11px] text-slate-400">
              {L(
                "You may switch to the bank tab or keep this window open. Do not refresh this page.",
                "வங்கி தாவலுக்கு மாறலாம் அல்லது இந்தச் சாளரத்தை திறந்து வைக்கலாம். இந்தப் பக்கத்தை புதுப்பிக்காதீர்கள்.",
                "आप बैंक टैब पर स्विच कर सकते हैं या यह विंडो खुला रख सकते हैं। इस पेज को रीफ्रेश न करें।"
              )}
            </p>
          </div>

          {/* Footer */}
          <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{L("JWT token valid for 15 minutes", "JWT டோக்கன் 15 நிமிடம் செல்லுபடியாகும்", "JWT टोकन 15 मिनट के लिए वैध")}</span>
            </div>
            <button
              onClick={onClose}
              className="font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
            >
              {L("Dismiss", "மூடு", "बंद करें")}
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ── DEFAULT STATE: Bank selection list ─────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-[#0f172a] text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-inner">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 block font-bold">
                  {L("STEP: CHOOSE A PARTNER BANK / NBFC", "படி: கூட்டாளி வங்கியைத் தேர்ந்தெடுக்கவும்", "चरण: पार्टनर बैंक / एनबीएफसी चुनें")}
                </span>
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {L("Select Loan Sanctioning Institution", "கடன் வழங்கும் வங்கியைத் தேர்ந்தெடுக்கவும்", "ऋण संवितरण संस्था का चयन करें")}
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-slate-300 mt-3 leading-relaxed">
            {L(
              `Applying for: "${scheme.scheme_name}". Choose an authorized banking partner to review your pre-verified ZKP credentials and issue concessional credit. The bank portal will open in a new tab — this page stays open.`,
              `விண்ணப்பிக்கும் திட்டம்: "${scheme.scheme_name}". வங்கி போர்டல் புதிய தாவலில் திறக்கும் — இந்தப் பக்கம் திறந்தே இருக்கும்.`,
              `आवेदन योजना: "${scheme.scheme_name}"। बैंक पोर्टल नए टैब में खुलेगा — यह पेज खुला रहेगा।`
            )}
          </p>

          {/* New-tab notice pill */}
          <div className="mt-3 inline-flex items-center gap-1.5 bg-blue-900/50 border border-blue-700/50 text-blue-300 text-[10px] font-bold px-2.5 py-1 rounded-full">
            <ExternalLink className="w-3 h-3" />
            <span>{L("Bank portal opens in a new tab — no page reload", "புதிய தாவலில் திறக்கும் — பக்க மறுஏற்றம் இல்லை", "नए टैब में खुलेगा — पेज रीलोड नहीं")}</span>
          </div>
        </div>

        {/* Bank Selection List */}
        <div className="p-5 sm:p-6 space-y-3.5 overflow-y-auto max-h-[62vh] bg-slate-50/50">
          {enrichedBanks.map((bank) => (
            <div
              key={bank.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 bg-white hover:border-blue-400 hover:shadow-md flex flex-col justify-between gap-3 ${
                bank.recommended ? 'border-blue-300 ring-2 ring-blue-400/20' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-base text-slate-900">{bank.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${bank.badgeColor}`}>
                      {bank.badge}
                    </span>
                    {bank.recommended && (
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        {L("Recommended", "பரிந்துரைக்கப்படுகிறது", "अनुशंसित")}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-slate-500">{bank.category}</p>
                </div>

                <div className="text-right shrink-0">
                  <div className="flex items-center justify-end gap-1 text-xs font-bold text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{bank.distance}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 block mt-0.5">{bank.branch}</span>
                </div>
              </div>

              {/* Rationale & Rate */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <p className="text-slate-600 text-[11px] leading-relaxed flex-1">
                  <span className="font-bold text-slate-700">{L("Why this partner: ", "இந்த வங்கி ஏன்: ", "यह बैंक क्यों: ")}</span>
                  {bank.why}
                </p>
                <div className="shrink-0 font-mono text-right bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                  <span className="text-[9px] uppercase text-slate-400 block font-sans font-bold">Rate</span>
                  <span className="font-bold text-emerald-700 text-xs">{bank.rate}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{L("RS256 ZKP Referral Token Bridged", "RS256 டோக்கன் இணைப்பு", "RS256 टोकन संबद्ध")}</span>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectBank(bank, scheme)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm hover:shadow cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{L("Select & Open in New Tab →", "தேர்ந்தெடுத்து புதிய தாவலில் திற →", "चुनें और नए टैब में खोलें →")}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>{L("All partners are RBI-regulated scheduled credit institutions", "அனைத்து வங்கிகளும் RBI ஒழுங்குமுறைக்கு உட்பட்டவை", "सभी भागीदार आरबीआई-विनियमित ऋण संस्थान हैं")}</span>
          <button
            onClick={onClose}
            className="font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            {L("Cancel", "ரத்து செய்", "रद्द करें")}
          </button>
        </div>

      </div>
    </div>
  );
}

export default BankSelectionModal;
