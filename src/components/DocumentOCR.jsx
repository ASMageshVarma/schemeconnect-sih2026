import React, { useState } from 'react';
import { Camera, FileText, CheckCircle2, Upload, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export function DocumentOCR({ lang, t, onProfileExtracted }) {
  const [selectedSample, setSelectedSample] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [extractedData, setExtractedData] = useState(null);

  const sampleCards = [
    {
      id: "aadhaar_rajan",
      title: "Aadhaar Card (Rajan S. - 55yr SC Vendor, TN)",
      type: "Aadhaar National Identity",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
      rawText: "GOVERNMENT OF INDIA / UIDAI\nName: Rajan S.\nDOB: 14/05/1971\nGender: Male / ஆண்\nAddress: Tiruchirappalli, Tamil Nadu - 620012\nAadhaar No: 4892 7812 9014",
      parsed: {
        name: "Rajan S.",
        age: 55,
        gender: "Male",
        caste: "SC",
        state: "Tamil Nadu",
        district: "Tiruchirappalli",
        occupation: "Street Vendor",
        annual_income: 72000
      }
    },
    {
      id: "caste_lakshmi",
      title: "Community Certificate (Lakshmi M. - 34yr Artisan, TN)",
      type: "State Community Certificate",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      rawText: "GOVERNMENT OF TAMIL NADU - REVENUE DEPARTMENT\nCOMMUNITY CERTIFICATE\nThis is to certify that Smt. Lakshmi M., residing at Madurai, Tamil Nadu belongs to Most Backward Class (OBC / Potter Artisan Community).\nAnnual Income: Rs. 1,10,000",
      parsed: {
        name: "Lakshmi M.",
        age: 34,
        gender: "Female",
        caste: "OBC",
        state: "Tamil Nadu",
        district: "Madurai",
        occupation: "Artisan",
        annual_income: 110000
      }
    },
    {
      id: "income_ramesh",
      title: "Tribal Welfare Certificate (Ramesh K. - 24yr ST Youth)",
      type: "Income & Tribal Category Proof",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
      rawText: "DISTRICT COLLECTORATE - TRIBAL WELFARE DEPT\nIncome Certificate\nApplicant: Ramesh K.\nCategory: Scheduled Tribe (ST / Malayali Tribal)\nAnnual Family Income: Rs. 48,000 /-\nEligible for PM-AJAY and NSFDC schemes.",
      parsed: {
        name: "Ramesh K.",
        age: 24,
        gender: "Male",
        caste: "ST",
        state: "Tamil Nadu",
        district: "Salem",
        occupation: "Micro-Entrepreneur",
        annual_income: 48000
      }
    }
  ];

  const handleScanSample = (sample) => {
    setSelectedSample(sample);
    setIsScanning(true);
    setExtractedData(null);

    setTimeout(() => {
      setIsScanning(false);
      setExtractedData(sample.parsed);
    }, 750);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 card-shadow overflow-hidden p-6 sm:p-8">
      
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-semibold border border-teal-200 mb-3">
          <Camera className="w-3.5 h-3.5" />
          <span>Google Document AI / Tesseract OCR</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {t.ocr_title}
        </h2>
        <p className="text-sm text-slate-500 mt-1 max-w-lg mx-auto">
          {t.ocr_desc}
        </p>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-teal-500 bg-slate-50/60 transition cursor-pointer mb-6 group">
        <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
          <Upload className="w-6 h-6" />
        </div>
        <p className="text-sm font-bold text-slate-800">
          Upload Aadhaar Card / Community / Income Certificate
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Supports PNG, JPG, PDF (Simulated OCR Auto-Parser)
        </p>
      </div>

      {/* Preset Demo Sample Cards */}
      <div className="mb-6">
        <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>{t.sample_cards}</span>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {sampleCards.map((c) => (
            <button
              key={c.id}
              onClick={() => handleScanSample(c)}
              className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
                selectedSample?.id === c.id
                  ? 'border-teal-600 bg-teal-50/50 shadow-sm ring-2 ring-teal-200'
                  : 'border-slate-200 bg-white hover:border-teal-300 hover:bg-slate-50'
              }`}
            >
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-block mb-1.5 ${c.badgeColor}`}>
                  {c.type}
                </span>
                <p className="text-xs font-bold text-slate-900 leading-snug">
                  {c.title}
                </p>
              </div>
              <span className="text-[11px] font-semibold text-teal-700 mt-3 flex items-center space-x-1">
                <span>Scan & Auto-Fill</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Scanning Animation */}
      {isScanning && (
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-6 text-center animate-pulse mb-6">
          <div className="w-10 h-10 rounded-full border-4 border-teal-600 border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-sm font-bold text-teal-900">Scanning Document with OCR Engine...</p>
          <p className="text-xs text-teal-600 mt-0.5">Extracting Name, DOB, Caste, Income, and Address in 5 seconds</p>
        </div>
      )}

      {/* Extracted Profile Result */}
      {extractedData && !isScanning && (
        <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200 animate-fadeIn">
          <div className="flex items-center space-x-2 text-emerald-800 text-xs font-bold mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Document Credentials Verified & Profile Auto-Filled</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
            <div className="bg-white p-2.5 rounded-lg border border-emerald-100 shadow-sm">
              <span className="text-slate-400 block text-[10px]">Beneficiary Name</span>
              <span className="font-bold text-slate-800">{extractedData.name} ({extractedData.age} yrs)</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-emerald-100 shadow-sm">
              <span className="text-slate-400 block text-[10px]">Caste & Gender</span>
              <span className="font-bold text-slate-800">{extractedData.caste} ({extractedData.gender})</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-emerald-100 shadow-sm">
              <span className="text-slate-400 block text-[10px]">Verified Occupation</span>
              <span className="font-bold text-slate-800">{extractedData.occupation}</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-emerald-100 shadow-sm">
              <span className="text-slate-400 block text-[10px]">Annual Income</span>
              <span className="font-bold text-emerald-700">₹{extractedData.annual_income.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={() => onProfileExtracted(extractedData)}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 shadow-sm transition"
          >
            <span>Proceed to Instant Scheme Matching</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
