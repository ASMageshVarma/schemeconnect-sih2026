import React, { useState } from 'react';
import { 
  ShieldCheck, FileText, ArrowRight, Lock, CheckCircle2, 
  Landmark, Calculator, MapPin, Sparkles, Building2, HelpCircle 
} from 'lucide-react';
import { grantConsent, hasConsented } from '../config/portalConfig';

export function LandingPage({ lang = "en", t, onNavigate }) {
  const isTa = lang === "ta";
  const isHi = lang === "hi";
  const L = (en, ta, hi) => isHi ? hi : (isTa ? ta : en);

  const [consent1, setConsent1] = useState(true);
  const [consent2, setConsent2] = useState(true);
  const [consent3, setConsent3] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const allConsented = consent1 && consent2 && consent3;

  const handleProceed = () => {
    if (!allConsented) {
      setErrorMsg(L(
        "Please accept all statutory consent terms to proceed.",
        "தொடர அனைத்து விதிமுறைகளையும் ஏற்கவும்.",
        "आगे बढ़ने के लिए कृपया सभी शर्तों को स्वीकार करें।"
      ));
      return;
    }
    grantConsent();
    onNavigate("find-schemes");
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-900 py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-between animate-fadeIn">
      
      <div className="max-w-4xl mx-auto w-full">
        
        {/* Ministry Emblem Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-slate-100 text-slate-700 px-3.5 py-1 rounded-full text-xs font-semibold border border-slate-200 mb-4">
            <Building2 className="w-3.5 h-3.5 text-slate-600" />
            <span>{L("Ministry of Social Justice & Empowerment • Government of India", "சமூக நீதி மற்றும் அதிகாரமளித்தல் அமைச்சகம் • இந்திய அரசு", "सामाजिक न्याय एवं अधिकारिता मंत्रालय • भारत सरकार")}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight mb-3">
            {L(
              "SchemeConnect: AI Welfare Scheme Discovery & Pre-Screening",
              "ஸ்கீம்கனெக்ட்: AI அரசு நலத்திட்ட கண்டுபிடிப்பு மற்றும் தகுதி சரிபார்ப்பு",
              "स्कीमकनेक्ट: AI कल्याणकारी योजना खोज एवं पूर्व-स्क्रीनिंग इंजन"
            )}
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {L(
              "Discover concessional micro-credit (≤₹1.40L), term loans (≤₹50L), and capital subsidies for street vendors, artisans, and marginalized entrepreneurs. Statutory zero-hardcoded policy rules engine.",
              "தெருவோர வியாபாரிகள், கைவினைஞர்கள் மற்றும் பட்டியலின தொழில்முனைவோருக்கான சலுகை கடன்களை துல்லியமாக கண்டறியுங்கள்.",
              "रेहड़ी-पटरी विक्रेताओं, कारीगरों एवं वंचित उद्यमियों के लिए रियायती सूक्ष्म-ऋण और मियादी ऋण योजनाएँ।"
            )}
          </p>
        </div>

        {/* Minimalist Rules, Terms & Privacy Consent Gate Container */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs mb-8">
          
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 mb-6">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#1e3a8a] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {L("DPDPA 2023 Statutory Privacy & Data Processing Agreement", "DPDPA 2023 சட்டப்பூர்வ தனியுரிமை மற்றும் தரவு செயலாக்க ஒப்பந்தம்", "DPDPA 2023 सांविधिक गोपनीयता एवं डेटा प्रसंस्करण सहमति")}
              </h2>
              <p className="text-xs text-slate-500">
                {L("Digital Personal Data Protection Act compliance • Session-scoped memory", "டிஜிட்டல் தனிநபர் தரவு பாதுகாப்பு சட்டம் 2023", "डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम अनुपालन")}
              </p>
            </div>
          </div>

          {/* Statutory Terms Checkboxes */}
          <div className="space-y-4 mb-6">
            
            <label className="flex items-start space-x-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition cursor-pointer">
              <input
                type="checkbox"
                checked={consent1}
                onChange={(e) => setConsent1(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-[#1e3a8a] rounded border-slate-300 focus:ring-[#1e3a8a]"
              />
              <div className="text-xs">
                <span className="font-semibold text-slate-800 block mb-0.5">
                  {L("1. Zero Persistent Data Retention Policy", "1. தரவு சேமிப்பு இல்லாத கொள்கை", "1. शून्य डेटा प्रतिधारण नीति")}
                </span>
                <span className="text-slate-500 leading-relaxed">
                  {L(
                    "All beneficiary details entered via Voice, OCR, or form are processed exclusively in active memory for this session and permanently cleared upon tab reset.",
                    "உள்ளீடு செய்யப்படும் விவரங்கள் இந்த அமர்வுக்கு மட்டுமே பயன்படுத்தப்படும்; சேமிக்கப்படாது.",
                    "दर्ज किए गए विवरण केवल इस सत्र के लिए संसाधित किए जाएंगे और स्थायी रूप से संग्रहीत नहीं होंगे।"
                  )}
                </span>
              </div>
            </label>

            <label className="flex items-start space-x-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition cursor-pointer">
              <input
                type="checkbox"
                checked={consent2}
                onChange={(e) => setConsent2(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-[#1e3a8a] rounded border-slate-300 focus:ring-[#1e3a8a]"
              />
              <div className="text-xs">
                <span className="font-semibold text-slate-800 block mb-0.5">
                  {L("2. Statutory Rule Evaluation & Pre-Screening", "2. சட்டப்பூர்வ விதி மதிப்பீடு", "2. सांविधिक नियम मूल्यांकन")}
                </span>
                <span className="text-slate-500 leading-relaxed">
                  {L(
                    "I authorize SchemeConnect to evaluate my input parameters against 20 central and state government scheme criteria published on Alpha Portal.",
                    "20 மத்திய மற்றும் மாநில திட்ட விதிகளின்படி தகுதியை கணக்கிட ஒப்புதல் அளிக்கிறேன்.",
                    "अल्फा पोर्टल पर प्रकाशित 20 सरकारी योजनाओं के नियमों के अनुसार मेरी पात्रता जाँचने की अनुमति है।"
                  )}
                </span>
              </div>
            </label>

            <label className="flex items-start space-x-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition cursor-pointer">
              <input
                type="checkbox"
                checked={consent3}
                onChange={(e) => setConsent3(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-[#1e3a8a] rounded border-slate-300 focus:ring-[#1e3a8a]"
              />
              <div className="text-xs">
                <span className="font-semibold text-slate-800 block mb-0.5">
                  {L("3. Cryptographic JWT Referral to Partner Banking Hub (Beta Portal)", "3. வங்கி கூட்டாளர்களுக்கு JWT பரிந்துரை", "3. सहयोगी बैंकों को JWT सिफ़ारिश")}
                </span>
                <span className="text-slate-500 leading-relaxed">
                  {L(
                    "Upon selecting an eligible scheme, a 15-minute signed JWT referral token may be transferred to partner public sector banks for credit sanctioning.",
                    "தகுதியான திட்டத்திற்கு விண்ணப்பிக்கும் போது, 15 நிமிட JWT டோக்கன் வங்கிக்கு பகிரப்படும்.",
                    "पात्र योजना चुनने पर 15 मिनट का हस्ताक्षरित JWT टोकन ऋण संस्वीकृति हेतु बैंक को भेजा जाएगा।"
                  )}
                </span>
              </div>
            </label>

          </div>

          {errorMsg && (
            <p className="text-xs font-semibold text-red-600 mb-4">{errorMsg}</p>
          )}

          {/* Primary Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>{L("Encrypted TLS 1.3 • MoSJE SIH26092", "பாதுகாப்பான இணைப்பு TLS 1.3", "सुरक्षित एन्क्रिप्शन TLS 1.3")}</span>
            </div>

            <button
              onClick={handleProceed}
              disabled={!allConsented}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition flex items-center justify-center space-x-2 shadow-xs cursor-pointer ${
                allConsented 
                  ? 'bg-[#1e3a8a] hover:bg-[#172554]' 
                  : 'bg-slate-300 cursor-not-allowed text-slate-500'
              }`}
            >
              <span>{L("Accept Terms & Begin Intake ➔", "விதிமுறைகளை ஏற்று தொடரவும் ➔", "शर्तें स्वीकार करें और पंजीकरण शुरू करें ➔")}</span>
            </button>
          </div>

        </div>

        {/* Clean Secondary Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Direct Link to Financial Calculator */}
          <div 
            onClick={() => onNavigate("calc")}
            className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition cursor-pointer flex items-center justify-between group shadow-xs"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-[#1e3a8a] transition">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-900">
                  {L("Financial Subsidy & EMI Calculator", "நிதி மானியம் & EMI கால்குலேட்டர்", "वित्तीय सब्सिडी एवं EMI कैलकुलेटर")}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {L("Simulate 35% capital subsidies and monthly repayments", "35% மானியம் மற்றும் தவணையை கணக்கிட", "35% सब्सिडी और मासिक किश्तों की गणना करें")}
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition" />
          </div>

          {/* Direct Link to Geo-Spatial Partner Locator */}
          <div 
            onClick={() => onNavigate("locator")}
            className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition cursor-pointer flex items-center justify-between group shadow-xs"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-[#1e3a8a] transition">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-900">
                  {L("Geo-Spatial Partner Bank Locator", "வங்கி மற்றும் உதவி மைய வரைபடம்", "भू-स्थानिक सहयोगी बैंक लोकेटर")}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {L("Locate nearest partner bank branches and CSC centers", "அருகிலுள்ள வங்கி கிளைகளை கண்டறிய", "निकटतम बैंक शाखाएं और केंद्र खोजें")}
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition" />
          </div>

        </div>

      </div>

      {/* Official Gov Footer */}
      <footer className="mt-12 text-center text-xs text-slate-500 border-t border-slate-200 pt-6">
        <p>SchemeConnect • Team TechTitans (SIH-9E972H) • Problem Statement SIH26092</p>
        <p className="text-[11px] text-slate-400 mt-1">Ministry of Social Justice & Empowerment, Government of India</p>
      </footer>

    </div>
  );
}
export default LandingPage;
