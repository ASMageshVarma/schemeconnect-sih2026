import React from 'react';
import { ClipboardList, Calculator, MapPin, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';

/**
 * ApplyTrackPage — the "Apply & Track" tab destination.
 * Houses Financial Calculator and Find Channel Partners contextually
 * (moved out of Navbar per Priority 1 item 6).
 */
export function ApplyTrackPage({ lang = 'en', t, onOpenCalculator, onOpenLocator, onViewSchemes, hasProfile }) {
  const isTa = lang === 'ta';
  const isHi = lang === 'hi';
  const L = (en, ta, hi) => isHi ? hi : (isTa ? ta : en);

  const tools = [
    {
      icon: Calculator,
      color: 'emerald',
      title: L('Financial Calculator', 'நிதி கால்குலேட்டர்', 'वित्तीय कैलकुलेटर'),
      desc: L(
        'Calculate EMI, subsidy amounts, and loan repayment schedules for any matched scheme.',
        'ஒப்பிட்ட திட்டத்திற்கான EMI, மானிய தொகை மற்றும் கடன் திரும்பச் செலுத்தும் அட்டவணையை கணக்கிடுங்கள்.',
        'किसी भी मिलान योजना के लिए EMI, सब्सिडी राशि और ऋण पुनर्भुगतान शेड्यूल की गणना करें।'
      ),
      action: onOpenCalculator,
      btnLabel: L('Open Calculator', 'கால்குலேட்டரைத் திறக்க', 'कैलकुलेटर खोलें'),
    },
    {
      icon: MapPin,
      color: 'blue',
      title: L('Find Channel Partners', 'கால்வாய் கூட்டாளர்களைக் கண்டறியவும்', 'चैनल पार्टनर खोजें'),
      desc: L(
        'Locate nearby bank branches, CSC centers, and NBFC partners on the map for loan application.',
        'கடன் விண்ணப்பத்திற்காக அருகிலுள்ள வங்கி கிளைகள், CSC மையங்கள் மற்றும் NBFC கூட்டாளர்களை வரைபடத்தில் கண்டறியுங்கள்.',
        'ऋण आवेदन के लिए नज़दीकी बैंक शाखाएं, CSC केंद्र और NBFC भागीदार खोजें।'
      ),
      action: onOpenLocator,
      btnLabel: L('Open Map', 'வரைபடத்தைத் திறக்க', 'मानचित्र खोलें'),
    },
    {
      icon: FileText,
      color: 'violet',
      title: L('Browse All Schemes', 'அனைத்து திட்டங்களையும் பார்க்கவும்', 'सभी योजनाएँ देखें'),
      desc: L(
        'View the full catalog of 20+ central and state government welfare schemes available on this platform.',
        'இந்த தளத்தில் 20+ மத்திய மற்றும் மாநில அரசு நலத்திட்டங்களின் முழு பட்டியலைப் பாருங்கள்.',
        'इस प्लेटफ़ॉर्म पर उपलब्ध 20+ केंद्र और राज्य सरकारी कल्याण योजनाओं की पूरी सूची देखें।'
      ),
      action: onViewSchemes,
      btnLabel: L('View Catalog', 'பட்டியலைப் பார்க்க', 'कैटलॉग देखें'),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-fadeIn">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center">
          <ClipboardList className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            {L('Apply & Track', 'விண்ணப்பி & கண்காணி', 'आवेदन और ट्रैक')}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {L('Tools to apply for schemes and track your application status.', 'திட்டங்களுக்கு விண்ணப்பிக்கவும் மற்றும் உங்கள் விண்ணப்ப நிலையை கண்காணிக்கவும்.', 'योजनाओं के लिए आवेदन करें और अपनी आवेदन स्थिति ट्रैक करें।')}
          </p>
        </div>
      </div>

      {/* Profile check nudge */}
      {!hasProfile && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-sm text-amber-800">
              {L('Complete your profile first', 'முதலில் உங்கள் சுயவிவரத்தை நிரப்புங்கள்', 'पहले अपना प्रोफ़ाइल पूरा करें')}
            </div>
            <div className="text-xs text-amber-700 mt-0.5">
              {L('Go to Home → fill the 7-step wizard to get personalised scheme matches before applying.', 'முகப்பு → 7-படி வழிகாட்டியை நிரப்பவும் — தனிப்பட்ட திட்ட பொருத்தங்கள் பெறலாம்.', 'होम → 7-चरण विज़ार्ड भरें — आवेदन से पहले व्यक्तिगत योजना मिलान पाएं।')}
            </div>
          </div>
        </div>
      )}

      {/* Tool Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {tools.map((tool, i) => {
          const Icon = tool.icon;
          const colorMap = {
            emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'bg-emerald-100', iconText: 'text-emerald-700', btn: 'bg-emerald-600 hover:bg-emerald-700' },
            blue:    { bg: 'bg-blue-50',    border: 'border-blue-200',    icon: 'bg-blue-100',    iconText: 'text-blue-700',    btn: 'bg-blue-600 hover:bg-blue-700' },
            violet:  { bg: 'bg-violet-50',  border: 'border-violet-200',  icon: 'bg-violet-100',  iconText: 'text-violet-700',  btn: 'bg-violet-600 hover:bg-violet-700' },
          };
          const c = colorMap[tool.color] || colorMap.blue;
          return (
            <div key={i} className={`flex flex-col ${c.bg} border ${c.border} rounded-3xl p-5 shadow-xs`}>
              <div className={`w-11 h-11 ${c.icon} rounded-2xl flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${c.iconText}`} />
              </div>
              <h3 className="font-black text-sm text-slate-900 mb-2">{tool.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed flex-1 mb-5">{tool.desc}</p>
              <button
                onClick={tool.action}
                className={`w-full py-2.5 ${c.btn} text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs`}
              >
                {tool.btnLabel}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ApplyTrackPage;
