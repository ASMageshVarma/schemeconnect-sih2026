import React from 'react';
import { ShieldCheck, Phone, Mail, Clock, ExternalLink, Building2, CheckCircle2, Lock } from 'lucide-react';

export function OfficialPublicFooter({ lang = "en" }) {
  const isTa = lang === "ta";
  const isHi = lang === "hi";

  const L = (en, ta, hi) => isHi ? hi : (isTa ? ta : en);

  return (
    <footer className="bg-[#0f172a] text-slate-300 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* 3 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-10">
          
          {/* Column 1: About SchemeConnect */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5 text-white font-bold text-sm">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Building2 className="w-4 h-4" />
              </div>
              <span>{L("About JanSetu AI Prototype", "ஜன்சேது AI மாதிரி பற்றி", "जनसेतु AI प्रोटोटाइप के बारे में")}</span>
            </div>
            
            <p className="text-slate-400 text-xs leading-relaxed">
              {L(
                "JanSetu AI is an academic concept prototype empowering micro-entrepreneurs, street vendors, and Self-Help Groups (SHGs) to discover, verify, and access simulated concessional welfare credit with zero paperwork.",
                "ஜன்சேது AI என்பது சிறு வணிகர்கள் மற்றும் தெருவோர வியாபாரிகள் மாதிரி நலத்திட்ட சலுகைக் கடன்களை காகிதமில்லா முறையில் பெற உதவும் மாதிரி முன்மாதிரி தளம் ஆகும்.",
                "जनसेतु AI एक शैक्षणिक प्रोटोटाइप है जो सूक्ष्म उद्यमियों, सड़क विक्रेताओं और स्वयं सहायता समूहों (SHG) को शून्य कागजी कार्रवाई के साथ कल्याणकारी रियायती ऋण प्राप्त करने का अनुकरण करता है।"
              )}
            </p>

            <div className="pt-1 flex items-center space-x-2 text-[11px] text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{L("Academic Concept Prototype • Welfare Simulation", "கல்வி முன்மாதிரி • நலத்திட்ட மாதிரி", "अकादमिक प्रोटोटाइप • कल्याणकारी योजना अनुकरण")}</span>
            </div>
          </div>

          {/* Column 2: Helpline & Support */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-tight flex items-center space-x-2">
              <Phone className="w-4 h-4 text-blue-400" />
              <span>{L("Helpline & Prototype Support", "உதவி மையம் & மாதிரி ஆதரவு", "हेल्पलाइन एवं प्रोटोटाइप सहायता")}</span>
            </h4>

            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start space-x-2.5">
                <Phone className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-200 font-bold block text-sm">1800-111-2026</span>
                  <span className="text-[11px] text-slate-500">{L("Simulated Welfare Helpline (Demo)", "மாதிரி உதவி எண் (டெமோ)", "सिम्युलेटेड हेल्पलाइन (डेमो)")}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <a href="mailto:support@schemeconnect.dev" className="text-slate-300 hover:text-white transition underline">
                  support@schemeconnect.dev
                </a>
              </div>

              <div className="flex items-start space-x-2.5">
                <Clock className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                <span>{L("Operational Hours: Monday – Saturday, 9:00 AM – 6:00 PM IST", "செயல்படும் நேரம்: திங்கள் – சனி, காலை 9:00 – மாலை 6:00", "कार्य समय: सोमवार – शनिवार, सुबह 9:00 – शाम 6:00")}</span>
              </div>
            </div>
          </div>

          {/* Column 3: Important Links & Compliance */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-tight flex items-center space-x-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>{L("Important Links & Compliance", "முக்கிய இணைப்புகள் & இணக்கம்", "महत्वपूर्ण लिंक एवं अनुपालन")}</span>
            </h4>

            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="flex items-center space-x-2">
                <span className="text-blue-400">•</span>
                <span className="hover:text-white transition cursor-pointer">{L("Terms of Public Service & DPI Guidelines", "பொது சேவை விதிமுறைகள்", "सार्वजनिक सेवा शर्तें")}</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-blue-400">•</span>
                <span className="hover:text-white transition cursor-pointer">{L("Privacy Policy & DPDPA 2023 Compliance", "தரவு பாதுகாப்பு & தனியுரிமைக் கொள்கை", "गोपनीयता नीति एवं DPDPA 2023")}</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-blue-400">•</span>
                <span className="hover:text-white transition cursor-pointer">{L("DigiLocker & API Setu Verification Nodes", "டிஜிலாக்கர் & ஏபிஐ சேது ஒருங்கிணைப்பு", "डिजीलॉकर एवं एपीआई सेतु सत्यापन")}</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-blue-400">•</span>
                <span className="hover:text-white transition cursor-pointer">{L("National Open Welfare Interoperability Protocol", "தேசிய நலத்திட்ட இயங்குதன்மை வரைமுறை", "राष्ट्रीय कल्याण इंटरऑपरेबिलिटी प्रोटोकॉल")}</span>
              </li>
            </ul>

            <div className="pt-2 text-[11px] text-slate-500">
              Team TECH TITANS • Saranathan College of Engineering • JanSetu AI
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 text-center sm:text-left">
          <p>© 2026 JanSetu AI • Project Expo Concept Prototype. All rights reserved.</p>
          <p className="flex items-center justify-center space-x-2 text-amber-400 font-medium">
            <span>Concept Prototype</span>
            <span>•</span>
            <span>Not an official Government of India service</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
export default OfficialPublicFooter;
