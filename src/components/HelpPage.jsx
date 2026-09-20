import React from 'react';
import { HelpCircle, Bot, BookOpen, Phone, Mail, Cpu, Shield, Zap, Globe } from 'lucide-react';

export function HelpPage({ lang = 'en', t, onOpenCounselor }) {
  const isTa = lang === 'ta';
  const isHi = lang === 'hi';
  const L = (en, ta, hi) => isHi ? hi : (isTa ? ta : en);

  const faqs = [
    {
      q: L('What is JanSetu AI?', 'JanSetu AI என்றால் என்ன?', 'JanSetu AI क्या है?'),
      a: L(
        'JanSetu AI is a project expo prototype that demonstrates an AI-powered welfare scheme matching platform for street vendors, artisans, and SC/ST micro-entrepreneurs.',
        'JanSetu AI ஒரு திட்ட மாதிரி — தெருவோர வியாபாரிகள் மற்றும் சிறு தொழில்முனைவோருக்கான நலத்திட்ட பொருத்தப்படுத்தல் தளம்.',
        'JanSetu AI एक प्रोजेक्ट प्रोटोटाइप है जो AI-आधारित कल्याण योजना मिलान का प्रदर्शन करता है।'
      ),
    },
    {
      q: L('Is this an official government service?', 'இது அதிகாரப்பூர்வ அரசு சேவையா?', 'क्या यह एक आधिकारिक सरकारी सेवा है?'),
      a: L(
        'No. This is an academic/expo prototype concept only — not an official Government of India service. No real funds are disbursed.',
        'இல்லை. இது ஒரு கல்வி/எக்ஸ்போ மாதிரி மட்டுமே — இந்திய அரசின் அதிகாரப்பூர்வ சேவை அல்ல.',
        'नहीं। यह केवल एक शैक्षणिक/एक्सपो प्रोटोटाइप है — भारत सरकार की आधिकारिक सेवा नहीं।'
      ),
    },
    {
      q: L('How does AI scheme matching work?', 'AI திட்ட பொருத்தம் எவ்வாறு செயல்படுகிறது?', 'AI योजना मिलान कैसे काम करता है?'),
      a: L(
        'The Gemini-powered AI reads your 7 eligibility parameters (sector, income, caste, SHG status, age, area, district) and cross-references them against 20+ scheme eligibility criteria using a weighted scoring engine.',
        'Gemini AI உங்கள் 7 தகுதி அளவுகோல்களை படித்து 20+ திட்டங்களுடன் ஒப்பிட்டு மிகவும் பொருத்தமான திட்டங்களை அளிக்கிறது.',
        'Gemini AI आपके 7 पात्रता मानदंडों को पढ़कर 20+ योजनाओं के साथ तुलना करता है।'
      ),
    },
    {
      q: L('What do the Alpha and Beta portals do?', 'Alpha மற்றும் Beta போர்டல்கள் என்ன செய்கின்றன?', 'Alpha और Beta पोर्टल क्या करते हैं?'),
      a: L(
        'Alpha Portal simulates the Ministry policy governance node (scheme approval, real-time broadcast). Beta Portal simulates bank sanction and DBT disbursement — all using demo/simulated data.',
        'Alpha Portal: அமைச்சகத்தின் கொள்கை நிர்வாக மாதிரி. Beta Portal: வங்கி அனுமதி மற்றும் DBT மாதிரி — அனைத்தும் சோதனை தரவுகளுடன்.',
        'Alpha Portal: मंत्रालय नीति सिमुलेशन। Beta Portal: बैंक अनुमोदन और DBT डिस्बर्समेंट सिमुलेशन।'
      ),
    },
  ];

  const techStack = [
    { icon: Cpu, label: 'Frontend', value: 'React.js + Tailwind CSS + Vite' },
    { icon: Globe, label: 'AI Engine', value: 'Google Gemini API (scheme matching)' },
    { icon: Shield, label: 'Auth', value: 'RS256 JWT + OCR Simulation (Tesseract.js)' },
    { icon: Zap, label: 'Realtime', value: 'BroadcastChannel + WebSocket simulation' },
    { icon: BookOpen, label: 'Maps', value: 'OpenStreetMap + Leaflet (geo-spatial routing)' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-fadeIn">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center">
          <HelpCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            {L('Help & How It Works', 'உதவி & இது எப்படி செயல்படுகிறது', 'सहायता & यह कैसे काम करता है')}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {L('JanSetu AI — Project Expo Prototype by TECH TITANS', 'JanSetu AI — TECH TITANS அணியின் திட்ட மாதிரி', 'JanSetu AI — TECH TITANS टीम का प्रोजेक्ट प्रोटोटाइप')}
          </p>
        </div>
      </div>

      {/* AI Mitra Counselor CTA */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-3xl p-6 mb-8 flex items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-black text-base">
              {L('AI Mitra Welfare Counselor', 'AI மித்ரா நலன்புரி ஆலோசகர்', 'AI मित्र कल्याण सलाहकार')}
            </div>
            <div className="text-xs text-purple-200 mt-0.5">
              {L('Ask about schemes, eligibility, and application process in English, Tamil, or Hindi.', 'திட்டங்கள், தகுதி மற்றும் விண்ணப்ப செயல்முறை பற்றி கேளுங்கள்.', 'योजनाओं, पात्रता और आवेदन प्रक्रिया के बारे में पूछें।')}
            </div>
          </div>
        </div>
        <button
          onClick={onOpenCounselor}
          className="shrink-0 px-5 py-2.5 bg-white text-purple-700 font-black text-sm rounded-xl shadow hover:bg-purple-50 transition cursor-pointer"
        >
          {L('Chat Now', 'இப்போது பேசுங்கள்', 'अभी चैट करें')}
        </button>
      </div>

      {/* FAQs */}
      <div className="mb-8">
        <h2 className="text-base font-black text-slate-900 mb-4">
          {L('Frequently Asked Questions', 'அடிக்கடி கேட்கப்படும் கேள்விகள்', 'अक्सर पूछे जाने वाले प्रश्न')}
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer font-semibold text-sm text-slate-800 hover:bg-slate-50 transition">
                {faq.q}
                <span className="text-slate-400 group-open:rotate-180 transition-transform text-lg leading-none">▾</span>
              </summary>
              <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Tech Stack — for judges */}
      <div className="mb-8">
        <h2 className="text-base font-black text-slate-900 mb-1">
          {L('Tech Stack', 'தொழில்நுட்ப அடுக்கு', 'टेक स्टैक')}
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          {L('For evaluators — technical architecture of this prototype.', 'மதிப்பீட்டாளர்களுக்கு — இந்த மாதிரியின் தொழில்நுட்ப கட்டமைப்பு.', 'मूल्यांकनकर्ताओं के लिए — इस प्रोटोटाइप की तकनीकी संरचना।')}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {techStack.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
                <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-[11px] font-black text-slate-500 uppercase tracking-wider">{item.label}</div>
                  <div className="text-xs font-semibold text-slate-800 mt-0.5">{item.value}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact */}
      <div className="bg-slate-800 text-white rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <div className="font-black text-sm mb-1">
            {L('Contact / Support', 'தொடர்பு / ஆதரவு', 'संपर्क / सहायता')}
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Mail className="w-3.5 h-3.5" /> support@schemeconnect.dev
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
            <Phone className="w-3.5 h-3.5" /> {L('Demo helpline: 1800-XXX-XXXX (not active)', 'சோதனை உதவி எண்: 1800-XXX-XXXX (செயலில் இல்லை)', 'डेमो हेल्पलाइन: 1800-XXX-XXXX (सक्रिय नहीं)')}
          </div>
        </div>
        <div className="text-[10px] text-slate-500 font-bold bg-slate-700 px-3 py-2 rounded-xl text-center">
          CARE InnoExpo '26<br />TECH TITANS
        </div>
      </div>
    </div>
  );
}

export default HelpPage;
