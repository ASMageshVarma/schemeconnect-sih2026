import React from 'react';
import { Landmark, MapPin, CheckCircle2, ArrowRight, ShieldCheck, Zap, X, Star } from 'lucide-react';
import { PARTICIPATING_BANKS } from '../utils/bankStore';

/**
 * BankSelectionModal — Allows citizen to choose a partner bank/NBFC
 * before proceeding to that bank's parameterized application and sanction flow.
 */
export function BankSelectionModal({
  isOpen,
  onClose,
  scheme,
  userProfile,
  onSelectBank,
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
              `Applying for: "${scheme.scheme_name}". Choose an authorized banking partner to review your pre-verified ZKP credentials and issue concessional credit.`,
              `விண்ணப்பிக்கும் திட்டம்: "${scheme.scheme_name}". உங்கள் சரிபார்க்கப்பட்ட ZKP ஆவணங்களை மதிப்பாய்வு செய்து சலுகைக் கடன் வழங்க அனுமதிக்கப்பட்ட வங்கியைத் தேர்ந்தெடுக்கவும்.`,
              `आवेदन योजना: "${scheme.scheme_name}"। अपनी पूर्व-सत्यापित साख की समीक्षा और रियायती ऋण जारी करने के लिए अधिकृत बैंकिंग भागीदार चुनें।`
            )}
          </p>
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
                  <span>{L("Select & Proceed to Apply →", "தேர்ந்தெடுத்து விண்ணப்பிக்க →", "चुनें और आगे बढ़ें →")}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
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
