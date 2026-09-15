import React, { useState } from 'react';
import { 
  Users, CheckCircle2, ClipboardList, Printer, RefreshCw, 
  Phone, MapPin, ShieldCheck, ArrowRight, User, Layers, FileText, X
} from 'lucide-react';

// Sample batch queue for demo
const DEMO_QUEUE = [
  { id: "VLE-001", name: "Rajan Shanmugam", age: 34, sector: "Manufacturing", caste: "OBC", income: 180000, status: "verified", schemes: 4 },
  { id: "VLE-002", name: "Meenakshi Devi", age: 28, sector: "Agriculture", caste: "SC", income: 95000, status: "verified", schemes: 6 },
  { id: "VLE-003", name: "Arjunan Murugan", age: 52, sector: "Retail Trade", caste: "BC", income: 210000, status: "pending", schemes: 0 },
  { id: "VLE-004", name: "Selvi Krishnan", age: 41, sector: "Service", caste: "MBC", income: 145000, status: "pending", schemes: 0 },
];

export function GramSevaAgentMode({ lang = "en", onStartIntake, onBack }) {
  const isTa = lang === "ta";
  const isHi = lang === "hi";
  const L = (en, ta, hi) => isHi ? hi : (isTa ? ta : en);

  const [queue, setQueue] = useState(DEMO_QUEUE);
  const [campName, setCampName] = useState("Thayanur Gram Panchayat Welfare Camp");
  const [campDate] = useState(new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }));
  const [vleId] = useState("TN-VLE-CSC-04291");

  const verifiedCount = queue.filter(c => c.status === "verified").length;
  const pendingCount = queue.filter(c => c.status === "pending").length;
  const totalSchemes = queue.filter(c => c.status === "verified").reduce((sum, c) => sum + c.schemes, 0);

  const handleMarkComplete = (id) => {
    setQueue(q => q.map(c => c.id === id ? { ...c, status: "verified", schemes: Math.floor(Math.random() * 5) + 2 } : c));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-fadeIn">

      {/* Agent Mode Header */}
      <div className="bg-gradient-to-br from-amber-900 via-orange-900 to-slate-900 rounded-3xl p-6 mb-6 border-2 border-amber-500/40 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/40 text-2xl shrink-0">
              🏘️
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full">
                  {L("CSC / Gram Seva VLE Agent Mode", "கிராம சேவை முகவர் முறை", "CSC ग्राम सेवा VLE एजेंट मोड")}
                </span>
                <span className="text-[10px] font-mono text-amber-300 font-bold animate-pulse">● CAMP LIVE</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">{L("Village Batch Intake Console", "கிராம கூட்ட நுழைவு மேடை", "ग्राम बैच इनटेक कंसोल")}</h2>
            </div>
          </div>
          <button onClick={onBack} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5">
            <X className="w-3.5 h-3.5" />
            <span>{L("Exit Agent Mode", "வெளியேறு", "बाहर निकलें")}</span>
          </button>
        </div>

        {/* Camp Info Row */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
          <div className="bg-white/10 rounded-2xl px-3 py-2">
            <span className="text-[10px] text-amber-200 block">{L("Camp / Panchayat", "முகாம் / பஞ்சாயத்து", "शिविर / पंचायत")}</span>
            <span className="text-xs font-bold text-white truncate block">{campName}</span>
          </div>
          <div className="bg-white/10 rounded-2xl px-3 py-2">
            <span className="text-[10px] text-amber-200 block">{L("Date", "தேதி", "दिनांक")}</span>
            <span className="text-xs font-bold text-white">{campDate}</span>
          </div>
          <div className="bg-white/10 rounded-2xl px-3 py-2">
            <span className="text-[10px] text-amber-200 block">{L("VLE Agent ID", "முகவர் எண்", "VLE एजेंट ID")}</span>
            <span className="text-xs font-mono font-bold text-amber-300">{vleId}</span>
          </div>
          <div className="bg-white/10 rounded-2xl px-3 py-2">
            <span className="text-[10px] text-amber-200 block">{L("Status", "நிலை", "स्थिति")}</span>
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> {L("Authorized", "அங்கீகரிக்கப்பட்டது", "अधिकृत")}</span>
          </div>
        </div>
      </div>

      {/* Live Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center shadow-sm">
          <span className="text-3xl font-black text-slate-900">{queue.length}</span>
          <p className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-wider">{L("Beneficiaries in Queue", "பட்டியலில் பயனாளிகள்", "क्यू में लाभार्थी")}</p>
        </div>
        <div className="bg-white rounded-2xl border border-emerald-200 p-4 text-center shadow-sm">
          <span className="text-3xl font-black text-emerald-600">{verifiedCount}</span>
          <p className="text-[11px] font-bold text-emerald-600 mt-1 uppercase tracking-wider">{L("ZKP Verified", "ZKP சரிபார்க்கப்பட்டது", "ZKP सत्यापित")}</p>
        </div>
        <div className="bg-white rounded-2xl border border-blue-200 p-4 text-center shadow-sm">
          <span className="text-3xl font-black text-blue-600">{totalSchemes}</span>
          <p className="text-[11px] font-bold text-blue-600 mt-1 uppercase tracking-wider">{L("Schemes Matched", "திட்டங்கள் பொருத்தப்பட்டன", "मिलान योजनाएँ")}</p>
        </div>
      </div>

      {/* New Beneficiary + Batch Print Row */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        <button
          type="button"
          onClick={onStartIntake}
          className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/20"
        >
          <User className="w-4 h-4" />
          <span>{L("+ Add New Beneficiary to Queue", "+ புதிய பயனாளியை சேர்க்க", "+ नया लाभार्थी जोड़ें")}</span>
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Printer className="w-4 h-4 text-slate-600" />
          <span>{L("Print Camp QR Acknowledgement Slips", "முகாம் QR ஒப்புதல் சீட்டுகளை அச்சிடுக", "शिविर QR पावती पर्चे प्रिंट करें")}</span>
        </button>
      </div>

      {/* Beneficiary Queue Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-black text-slate-900">{L("Village Beneficiary Queue", "கிராம பயனாளி பட்டியல்", "ग्राम लाभार्थी कतार")}</h3>
          </div>
          <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-lg border border-slate-200">
            {verifiedCount}/{queue.length} {L("Processed", "செயலாக்கப்பட்டது", "प्रोसेस्ड")}
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {queue.map((citizen) => (
            <div key={citizen.id} className="px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 hover:bg-slate-50/60 transition">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-black ${
                  citizen.status === "verified" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                }`}>
                  {citizen.status === "verified" ? <CheckCircle2 className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-slate-900">{citizen.name}</span>
                    <span className="text-[10px] font-mono font-bold text-slate-400">{citizen.id}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-[11px] text-slate-500">
                    <span>Age {citizen.age}</span>
                    <span>•</span>
                    <span>{citizen.sector}</span>
                    <span>•</span>
                    <span>{citizen.caste}</span>
                    <span>•</span>
                    <span>₹{citizen.income.toLocaleString('en-IN')}/yr</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                {citizen.status === "verified" ? (
                  <>
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-lg flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      {citizen.schemes} {L("Schemes", "திட்டங்கள்", "योजनाएँ")}
                    </span>
                    <button
                      className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-[11px] font-bold cursor-pointer hover:bg-slate-200 transition flex items-center gap-1"
                      onClick={() => window.print()}
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{L("Print Slip", "சீட்டு அச்சிடு", "स्लिप प्रिंट")}</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleMarkComplete(citizen.id)}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold cursor-pointer transition flex items-center gap-1"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>{L("Process Now", "இப்போது செயலாக்கு", "अभी प्रोसेस करें")}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Summary */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>
            {L("Camp Session:", "முகாம் அமர்வு:", "शिविर सत्र:")} {campDate} • {vleId}
          </span>
          <span className="font-bold text-emerald-600">
            {verifiedCount} {L("Beneficiaries Enrolled", "பயனாளிகள் பதிவு செய்யப்பட்டனர்", "लाभार्थी नामांकित")}
          </span>
        </div>
      </div>

    </div>
  );
}
