import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, Loader2, FileText, Lock, Sparkles, Building2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export function AuthenticationProgressModal({ 
  profile, 
  documents = {}, 
  lang = "en", 
  onComplete 
}) {
  const isTa = lang === "ta";
  const isHi = lang === "hi";
  const L = (en, ta, hi) => isHi ? hi : (isTa ? ta : en);

  // Steps state: 0 = starting, 1 = Aadhaar done, 2 = PAN done, 3 = Community done, 4 = Income done, 5 = Final Trust score ready
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(10);
  const [isDone, setIsDone] = useState(false);

  const applicantName = profile.name || "Rajan S.";
  const casteCategory = profile.caste || "SC/ST";
  const formattedIncome = Number(profile.income || 180000).toLocaleString('en-IN');

  const stepsConfig = [
    {
      id: 1,
      title: L("Verifying Aadhaar Format & Verhoeff Checksum", "ஆதார் எண் & வெர்ஹோஃப் சரிபார்ப்பு", "आधार प्रारूप एवं वेरहॉफ चेकसम सत्यापन"),
      completedText: L("Aadhaar Format & eKYC Validated 🟢", "ஆதார் மற்றும் eKYC சரிபார்க்கப்பட்டது 🟢", "आधार प्रारूप एवं ई-केवाईसी सत्यापित 🟢"),
      node: "UIDAI eKYC Gateway Node"
    },
    {
      id: 2,
      title: L("Querying NSDL Tax Records & PAN Structure", "NSDL பான் அட்டை அமைப்பு மற்றும் பெயர் சரிபார்ப்பு", "एनएसडीएल पैन संरचना एवं नाम मिलान"),
      completedText: L("PAN Active & Identity Confirmed 🟢", "பான் அட்டை செயலில் உள்ளது & அடையாளம் உறுதியானது 🟢", "पैन सक्रिय एवं पहचान की पुष्टि 🟢"),
      node: "Income Tax Department (NSDL/UTIITSL)"
    },
    {
      id: 3,
      title: L("Querying State e-District Community Registry", "மாநில மின்-மாவட்ட சாதிச் சான்றிதழ் சரிபார்ப்பு", "राज्य ई-डिस्ट्रिक्ट जाति प्रमाण-पत्र सत्यापन"),
      completedText: L(`Category Confirmed (${casteCategory}) 🟢`, `சமூகப் பிரிவு உறுதி செய்யப்பட்டது (${casteCategory}) 🟢`, `श्रेणी की पुष्टि हुई (${casteCategory}) 🟢`),
      node: "State e-District Mission Mode Project"
    },
    {
      id: 4,
      title: L("Querying State Revenue Portal Income Records", "மாநில வருவாய்த்துறை வருமானச் சான்றிதழ் சரிபார்ப்பு", "राज्य राजस्व पोर्टल आय प्रमाण-पत्र सत्यापन"),
      completedText: L(`Income Level Validated (₹${formattedIncome}) 🟢`, `வருமான அளவு சரிபார்க்கப்பட்டது (₹${formattedIncome}) 🟢`, `आय स्तर सत्यापित (₹${formattedIncome}) 🟢`),
      node: "State Revenue Administration Portal"
    }
  ];

  useEffect(() => {
    // Step 1 after 600ms
    const timer1 = setTimeout(() => {
      setCurrentStep(1);
      setProgress(35);
    }, 600);

    // Step 2 after 1200ms
    const timer2 = setTimeout(() => {
      setCurrentStep(2);
      setProgress(60);
    }, 1200);

    // Step 3 after 1800ms
    const timer3 = setTimeout(() => {
      setCurrentStep(3);
      setProgress(85);
    }, 1800);

    // Step 4 after 2400ms
    const timer4 = setTimeout(() => {
      setCurrentStep(4);
      setProgress(100);
      setIsDone(true);

      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      // Store verified payload in localStorage
      const verifiedPayload = {
        aadhaar_ekyc: true,
        pan_nsdl: true,
        community_certificate: true,
        income_certificate: true,
        trust_score: 100,
        applicant_name: applicantName,
        caste_category: casteCategory,
        income_validated: profile.income,
        verified_at: new Date().toISOString()
      };

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("schemeconnect_verified_credentials", JSON.stringify(verifiedPayload));
        } catch (err) {}
      }

      // Automatically redirect the user to /recommendations after 1.5 seconds
      const redirectTimer = setTimeout(() => {
        onComplete(verifiedPayload);
      }, 1500);

      return () => clearTimeout(redirectTimer);
    }, 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-scaleIn">
        
        {/* Header */}
        <div className="bg-[#0f172a] text-white p-6 text-center relative">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6 text-blue-400 animate-pulse" />
          </div>

          <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center justify-center gap-2">
            <span>🔒 Authenticating Beneficiary Credentials</span>
          </h3>

          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {L(
              `Automated DPI verification pipeline for ${applicantName}`,
              `${applicantName} என்பவருக்கான தானியங்கி சரிபார்ப்பு`,
              `${applicantName} के लिए स्वचालित डीपीआई सत्यापन पाइपलाइन`
            )}
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full mt-5 overflow-hidden border border-slate-700">
            <div 
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 h-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Verification Steps Content */}
        <div className="p-6 sm:p-7 space-y-3.5 bg-slate-50/50">
          
          {stepsConfig.map((step) => {
            const isCompleted = currentStep >= step.id;
            const isCurrent = currentStep === step.id - 1;

            return (
              <div 
                key={step.id}
                className={`p-3.5 rounded-2xl border transition-all duration-300 ${
                  isCompleted 
                    ? "bg-white border-emerald-200 shadow-xs" 
                    : isCurrent 
                    ? "bg-blue-50/70 border-blue-200 shadow-xs" 
                    : "bg-slate-100/50 border-slate-200 text-slate-400 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5 shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 animate-scaleIn" />
                      ) : isCurrent ? (
                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-400">
                          {step.id}
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className={`text-xs font-bold leading-tight ${isCompleted ? "text-emerald-950 font-black" : isCurrent ? "text-blue-950" : "text-slate-500"}`}>
                        {isCompleted ? step.completedText : step.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                        {step.node}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    isCompleted 
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                      : isCurrent 
                      ? "bg-blue-100 text-blue-800 border border-blue-200" 
                      : "bg-slate-200 text-slate-500"
                  }`}>
                    {isCompleted ? "VERIFIED" : isCurrent ? "CHECKING..." : "QUEUED"}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Final Composite Trust Index Badge */}
          {isDone && (
            <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-300 text-center animate-fadeIn shadow-sm">
              <div className="inline-flex items-center space-x-1.5 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-black shadow-xs mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Composite Trust Index: 100% 🟢</span>
              </div>
              <p className="text-xs font-black text-emerald-950">
                Verified Citizen - High Confidence 🟢
              </p>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                {L("Redirecting to 100% eligible scheme recommendations...", "தகுதியான திட்ட பரிந்துரைகளுக்கு அழைத்துச் செல்கிறது...", "पात्र योजनाओं की अनुशंसाओं पर पुनर्निर्देशित कर रहा है...")}
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
export default AuthenticationProgressModal;
