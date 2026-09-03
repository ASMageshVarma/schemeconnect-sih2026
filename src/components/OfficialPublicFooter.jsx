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
              <span>{L("About SchemeConnect DPI", "திட்டங்கள் இணைப்பு (DPI) பற்றி", "स्कीमकनेक्ट डीपीआई के बारे में")}</span>
            </div>
            
            <p className="text-slate-400 text-xs leading-relaxed">
              {L(
                "SchemeConnect is an open Digital Public Infrastructure (DPI) empowering micro-entrepreneurs, street vendors, and Self-Help Groups (SHGs) to discover, verify, and access central & state concessional welfare credit with zero paperwork.",
                "ஸ்கீம்கனெக்ட் என்பது சிறு வணிகர்கள், தெருவோர வியாபாரிகள் மற்றும் சுயஉதவிக்குழுக்கள் மத்திய-மாநில நலத்திட்ட சலுகைக் கடன்களை காகிதமில்லா முறையில் நேரடியாகப் பெற உதவும் திறந்த டிஜிட்டல் பொது உள்கட்டமைப்பு ஆகும்.",
                "स्कीमकनेक्ट एक खुला डिजिटल पब्लिक इंफ्रास्ट्रक्चर (DPI) है जो सूक्ष्म उद्यमियों, सड़क विक्रेताओं और स्वयं सहायता समूहों (SHG) को शून्य कागजी कार्रवाई के साथ सरकारी कल्याणकारी रियायती ऋण प्राप्त करने में सक्षम बनाता है।"
              )}
            </p>

            <div className="pt-1 flex items-center space-x-2 text-[11px] text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{L("Authorized by Ministry of Social Justice & Empowerment", "சமூக நீதி & அதிகாரமளித்தல் அமைச்சகத்தால் அங்கீகரிக்கப்பட்டது", "सामाजिक न्याय एवं अधिकारिता मंत्रालय द्वारा अधिकृत")}</span>
            </div>
          </div>

          {/* Column 2: Helpline & Support */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-tight flex items-center space-x-2">
              <Phone className="w-4 h-4 text-blue-400" />
              <span>{L("Helpline & Citizen Support", "உதவி மையம் & பொது மக்கள் ஆதரவு", "हेल्पलाइन एवं नागरिक सहायता")}</span>
            </h4>

            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start space-x-2.5">
                <Phone className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-200 font-bold block text-sm">1800-111-2026</span>
                  <span className="text-[11px] text-slate-500">{L("National Welfare Toll-Free Helpline", "தேசிய கட்டணமில்லா உதவி எண்", "राष्ट्रीय कल्याण टोल-फ्री हेल्पलाइन")}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <a href="mailto:support.schemeconnect@gov.in" className="text-slate-300 hover:text-white transition underline">
                  support.schemeconnect@gov.in
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
              Problem Statement SIH26092 • Team TechTitans (SIH-9E972H)
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 text-center sm:text-left">
          <p>© 2026 SchemeConnect DPI Ecosystem. All rights reserved.</p>
          <p className="flex items-center justify-center space-x-2">
            <span>Ministry of Social Justice & Empowerment</span>
            <span>•</span>
            <span>Government of India</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
export default OfficialPublicFooter;
