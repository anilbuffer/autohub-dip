"use client";

import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Link from "next/link";
import { 
  ArrowLeft, 
  Sparkles, 
  ChevronDown, 
  Info, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  ExternalLink, 
  Calculator, 
  HelpCircle,
  FileCheck2,
  Calendar,
  Layers,
  Download,
  Ship,
  FileText,
  X
} from "lucide-react";
import { VEHICLES, GLOBAL_SETTINGS } from "@/lib/data";
import { useSyncStore } from "@/lib/syncStore";
import { triggerAutoHubCopilot } from "@/components/chat/DealerChatAssistant";

export default function VehicleDetail({ params }: { params: { id: string } }) {
  const vehicleId = parseInt(params?.id) || 1;
  const vehicle = VEHICLES.find(v => v.id === vehicleId || v.stockid.toString() === params?.id) || VEHICLES[0];

  const { state: syncState, toggleShortlistVehicle } = useSyncStore();

  // Interactive Bid Simulator State
  const [fobJpy, setFobJpy] = useState(vehicle.fobJpy || vehicle.jpy_fob);
  const [targetMargin, setTargetMargin] = useState(vehicle.targetMarginNzd);
  const [bidPlaced, setBidPlaced] = useState(false);
  const [activePhoto, setActivePhoto] = useState(vehicle.image);
  const [downloadToast, setDownloadToast] = useState<{
    visible: boolean;
    title: string;
    lang: "Japanese" | "English – AI translated";
    filename: string;
  } | null>(null);

  // Dynamic calculations based on live inputs and Admin synced FX
  const fxRate = syncState.fxRateJpyNzd;
  const fobNzd = Math.round(fobJpy / fxRate);
  const freightNzd = syncState.freightPerUnitNzd;
  const complianceNzd = syncState.compliancePerUnitNzd;
  const landedBeforeGst = fobNzd + freightNzd + complianceNzd;
  const gst = Math.round(landedBeforeGst * GLOBAL_SETTINGS.gstRate);
  const totalLandedCost = landedBeforeGst + gst;
  const maxBidNzd = vehicle.estRetailNzd - targetMargin;
  const maxBidJpy = Math.round((maxBidNzd - freightNzd - complianceNzd - (maxBidNzd * 0.13)) * fxRate);
  const profitMarginPercent = Math.round((targetMargin / totalLandedCost) * 100);

  const handleDownloadSheet = (lang: "Japanese" | "English – AI translated") => {
    const url = lang === "Japanese" 
      ? "/sheets/sample_inspection_sheet_japanese.html"
      : "/sheets/sample_inspection_sheet_english.html";
    
    const filename = lang === "Japanese"
      ? `Inspection_Sheet_Japanese_${vehicle.stockid || vehicle.lotNumber}.html`
      : `Inspection_Sheet_English_AI_Translated_${vehicle.stockid || vehicle.lotNumber}.html`;

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadToast({
      visible: true,
      title: `Inspection sheet (${lang})`,
      lang,
      filename
    });

    setTimeout(() => {
      setDownloadToast(null);
    }, 5000);
  };

  const handlePlaceBid = () => {
    toggleShortlistVehicle(vehicle.id);
    setBidPlaced(true);
  };

  return (
    <AppLayout>
      <div className="space-y-8 pb-16 max-w-6xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link 
            href="/vehicles" 
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs"
          >
            <ArrowLeft size={14} /> Back to Auction Lots
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Japanese Auction Lane:</span>
            <span className="font-bold text-slate-900 text-xs bg-slate-100 px-2.5 py-1 rounded-lg">
              {vehicle.auctionHouse} • Lot #{vehicle.lotNumber}
            </span>
          </div>
        </div>

        {/* PDF Download Toast Notification */}
        {downloadToast && downloadToast.visible && (
          <div className="p-4 rounded-xl bg-[#1B2A4A] text-white text-xs font-bold flex items-center justify-between shadow-xl border border-white/10 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Download size={15} />
              </div>
              <div>
                <div className="text-white font-extrabold flex items-center gap-1.5">
                  <span>{downloadToast.title} downloaded</span>
                  {downloadToast.lang.includes("AI") && (
                    <span className="px-1.5 py-0.2 bg-red-600 text-white text-[9px] font-bold rounded">Prototype Sample</span>
                  )}
                </div>
                <div className="text-[11px] text-slate-300 font-medium mt-0.5 font-mono">
                  {downloadToast.filename} • Ready to view/print
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={downloadToast.lang === "Japanese" ? "/sheets/sample_inspection_sheet_japanese.html" : "/sheets/sample_inspection_sheet_english.html"}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold transition-colors"
              >
                Open in Tab
              </a>
              <button onClick={() => setDownloadToast(null)} className="text-slate-400 hover:text-white p-1">
                <X size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Vehicle Header Brief */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <Sparkles size={12} /> {vehicle.status.toUpperCase()} BUY (Score {vehicle.score}/100)
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                Grade {vehicle.grade} / {vehicle.interiorGrade}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#B30D12]/10 text-[#B30D12] border border-[#B30D12]/30 flex items-center gap-1">
                <Clock size={12} /> {vehicle.timeLeft} left
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.badge}
            </h1>
            <p className="text-slate-500 text-xs font-medium mt-1">
              VIN: <span className="font-mono text-slate-700 font-semibold">{vehicle.vin}</span> • {(vehicle.km).toLocaleString('en-US')} km verified • {vehicle.engine} • {vehicle.color}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => triggerAutoHubCopilot(`Analyze landed margin, sheet condition, and bidding strategy for ${vehicle.year} ${vehicle.make} ${vehicle.model} (Lot #${vehicle.lotNumber})`)}
              className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#0B1322] to-[#1B2A4A] text-white hover:bg-slate-800 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              title="Open AutoHub DIP Assistant for this vehicle"
            >
              <Sparkles size={14} className="text-blue-300" /> Ask AI Assistant
            </button>

            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">NZ Market Indicator</span>
              <span className="text-2xl font-black text-[#B30D12] block">
                NZ${maxBidNzd.toLocaleString('en-US')}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                ~¥{maxBidJpy.toLocaleString('en-US')} FOB guide
              </span>
            </div>
          </div>
        </div>

        {/* Gallery & Quick Bid Action Top Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Photo Gallery (2 Spans) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="h-[380px] rounded-2xl overflow-hidden relative shadow-sm border border-slate-200 bg-[#0B1322] group">
              <img 
                src={activePhoto} 
                alt={vehicle.model} 
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1322]/70 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-2">
                  <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg font-bold border border-white/20">
                    High-Definition Inspection Photo
                  </span>
                  <span className="bg-emerald-600/90 backdrop-blur-md px-2.5 py-1 rounded-lg font-bold">
                    Japanese ODO Verified
                  </span>
                </div>
                <span className="text-slate-300 font-mono text-[11px]">
                  Auction House: {vehicle.auctionHouse}
                </span>
              </div>
            </div>

            {/* Thumbnail Strip with Interactive Selector */}
            <div className="grid grid-cols-3 gap-3">
              {vehicle.gallery.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setActivePhoto(img)}
                  className={`h-24 rounded-xl overflow-hidden border cursor-pointer transition-all ${
                    activePhoto === img 
                      ? 'border-[#B30D12] ring-2 ring-[#B30D12]/40 scale-102' 
                      : 'border-slate-200 hover:opacity-90'
                  }`}
                >
                  <img src={img} alt={`Angle ${i+1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Bid Card & Action Box */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Landed Cost</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  +{profitMarginPercent}% Projected ROI
                </span>
              </div>

              <div className="mt-4">
                <span className="text-3xl font-black text-slate-900 block">
                  NZ${totalLandedCost.toLocaleString('en-US')}
                </span>
                <span className="text-xs text-slate-500 font-medium mt-1 block">
                  Includes CIF freight, NZ compliance & 15% GST
                </span>
              </div>

              <div className="mt-6 space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated NZ Retail</span>
                  <span className="font-bold text-slate-900">NZ${vehicle.estRetailNzd.toLocaleString('en-US')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Profit Margin</span>
                  <span className="font-bold text-emerald-600">+NZ${targetMargin.toLocaleString('en-US')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Est. days to land in NZ (indicative)</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Ship size={12} className="text-blue-600" />
                    18–22 days
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 font-bold">
                  <span className="text-slate-700">Market-Based Bid Guide</span>
                  <span className="text-[#B30D12] font-black">NZ${maxBidNzd.toLocaleString('en-US')}</span>
                </div>
                <div className="text-[10px] text-slate-400 italic pt-1 text-center">
                  Indicative figures based on current NZ market data. Final bid decisions rest with the dealer.
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2.5">
              {bidPlaced ? (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center animate-in fade-in duration-200 space-y-2">
                  <p className="text-xs font-black text-emerald-800 flex items-center justify-center gap-1.5">
                    <CheckCircle2 size={16} className="text-emerald-600" /> Auto-Bid Registered!
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    Broker proxy bid placed up to <strong>NZ${maxBidNzd.toLocaleString('en-US')}</strong> on USS Tokyo.
                  </p>
                  <button 
                    onClick={() => setBidPlaced(false)}
                    className="text-[11px] font-bold text-slate-600 hover:text-slate-900 underline"
                  >
                    Cancel / Modify Bid
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setBidPlaced(true)}
                  className="w-full py-3 bg-[#B30D12] hover:bg-[#940B0F] text-white font-bold text-xs rounded-xl transition-all shadow-sm hover:shadow"
                >
                  Submit Auto-Bid Guide
                </button>
              )}

              {/* Inspection Sheet Download Buttons */}
              <div className="pt-2 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Auction Inspection Documentation
                </span>
                
                {/* 1. Inspection sheet (Japanese) */}
                <button 
                  onClick={() => handleDownloadSheet("Japanese")}
                  className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-between border border-slate-200 shadow-2xs hover:shadow-xs group cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FileCheck2 size={15} className="text-slate-500 group-hover:text-slate-700 shrink-0" />
                    <span>Inspection sheet (Japanese)</span>
                  </div>
                  <Download size={13} className="text-slate-400 group-hover:text-slate-600 shrink-0" />
                </button>

                {/* 2. Inspection sheet (English – AI translated) */}
                <button 
                  onClick={() => handleDownloadSheet("English – AI translated")}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 text-[#B30D12] font-bold text-xs rounded-xl transition-all flex items-center justify-between border border-red-200/80 shadow-2xs hover:shadow-xs group cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles size={15} className="text-[#B30D12] shrink-0" />
                    <span>Inspection sheet (English – AI translated)</span>
                  </div>
                  <Download size={13} className="text-[#B30D12]/70 group-hover:text-[#B30D12] shrink-0" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AI Valuation & Opportunity Intelligence Card */}
        <div className="bg-gradient-to-r from-red-50/40 via-slate-50 to-[#1B2A4A]/5 rounded-2xl border border-red-100 p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#B30D12] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles size={20} />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                  AI Appraisal & Margin Potential Rationale
                </h3>
                <span className="text-xs font-bold text-slate-600 bg-white px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                  Data confidence: High
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {vehicle.aiAnalysis.summary}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {vehicle.aiAnalysis.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-800 bg-white/80 p-2.5 rounded-xl border border-slate-200/60">
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Calculator & Price-vs-KM Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Interactive Landed Cost & Bid Simulator */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] p-6 sm:p-7 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#1B2A4A]/10 text-[#1B2A4A] flex items-center justify-center font-bold">
                  <Calculator size={16} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Bid Simulator & Landed Engine</h3>
                  <p className="text-xs text-slate-400 font-medium">Tweak FOB or target margin to test sensitivities.</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-slate-400">FX: 1 NZD = {fxRate} JPY</span>
            </div>

            {/* Sliders / Interactive Inputs */}
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-700">FOB Auction Price (JPY)</span>
                  <span className="font-mono text-slate-900">¥{fobJpy.toLocaleString('en-US')}</span>
                </div>
                <input 
                  type="range" 
                  min={800000} 
                  max={2500000} 
                  step={20000}
                  value={fobJpy}
                  onChange={(e) => setFobJpy(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#B30D12]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-700">Target Dealer Margin (NZD)</span>
                  <span className="text-emerald-700 font-bold">NZ${targetMargin.toLocaleString('en-US')}</span>
                </div>
                <input 
                  type="range" 
                  min={1500} 
                  max={8000} 
                  step={250}
                  value={targetMargin}
                  onChange={(e) => setTargetMargin(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>
            </div>

            {/* Step-by-Step Cost Sheet Accordion / Details */}
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>FOB converted to NZD (¥{fobJpy.toLocaleString('en-US')})</span>
                <span className="font-mono font-medium">NZ${fobNzd.toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Ocean Freight (Roll-on / Roll-off)</span>
                <span className="font-mono font-medium">NZ${freightNzd.toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>NZ Compliance, Entry & Biosecurity</span>
                <span className="font-mono font-medium">NZ${complianceNzd.toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-between text-slate-600 pb-2 border-b border-slate-200">
                <span>GST (15% on CIF + duty)</span>
                <span className="font-mono font-medium">NZ${gst.toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 pt-1">
                <span>Total Landed Cost to Auckland Yard</span>
                <span className="text-sm">NZ${totalLandedCost.toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-between font-extrabold text-[#B30D12] pt-1 text-sm">
                <span>Market-Based Bid Guide (Target Margin)</span>
                <span>NZ${maxBidNzd.toLocaleString('en-US')}</span>
              </div>
              <div className="text-[10px] text-slate-400 italic pt-1.5 text-center border-t border-slate-100">
                Indicative figures based on current NZ market data. Final bid decisions rest with the dealer.
              </div>
            </div>
          </div>

          {/* Price vs KM NZ Market Scatter Chart */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] p-6 sm:p-7 space-y-4">
            <div>
              <h3 className="text-base font-black text-slate-900">Price vs Kilometres (NZ Yard Comp)</h3>
              <p className="text-xs text-slate-500 font-medium">This vehicle plotted against 40+ recent NZ listings.</p>
            </div>

            {/* SVG Scatter Chart */}
            <div className="h-56 w-full relative mt-4 pt-4 border-l border-b border-slate-300">
              {/* Y Axis Labels (Price) */}
              <span className="absolute -left-10 top-0 text-[10px] font-bold text-slate-400">NZ$28k</span>
              <span className="absolute -left-10 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">NZ$22k</span>
              <span className="absolute -left-10 bottom-0 text-[10px] font-bold text-slate-400">NZ$16k</span>

              {/* X Axis Labels (KM) */}
              <span className="absolute -bottom-5 left-0 text-[10px] font-bold text-slate-400">30k km</span>
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400">60k km</span>
              <span className="absolute -bottom-5 right-0 text-[10px] font-bold text-slate-400">90k km</span>

              {/* Regression Trend Line */}
              <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
                <line x1="5%" y1="20%" x2="95%" y2="80%" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4" />
              </svg>

              {/* NZ Comparable Dots */}
              <div className="absolute top-[25%] left-[30%] w-2.5 h-2.5 rounded-full bg-slate-400" title="Trade Me: NZ$26,000 (42k km)" />
              <div className="absolute top-[35%] left-[45%] w-2.5 h-2.5 rounded-full bg-slate-400" title="Turners: NZ$24,500 (55k km)" />
              <div className="absolute top-[42%] left-[60%] w-2.5 h-2.5 rounded-full bg-slate-400" title="Trade Me: NZ$23,990 (61k km)" />
              <div className="absolute top-[60%] left-[80%] w-2.5 h-2.5 rounded-full bg-slate-400" title="AutoTrader: NZ$21,500 (78k km)" />

              {/* Target Vehicle Spot - Glowing Arbitrage Point */}
              <div className="absolute top-[68%] left-[55%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-emerald-400 opacity-60"></span>
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md font-bold text-[10px] z-10">
                  ★
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 pt-4 text-xs">
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                <span>Active NZ Yard Listings</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <span className="w-3 h-3 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[8px]">★</span>
                <span>This Lot (Landed: NZ${totalLandedCost.toLocaleString('en-US')})</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-800 font-medium">
              ★ <strong>Best Value vs NZ Market:</strong> Positioned NZ$4,000 below market regression line for 58k km.
            </div>
          </div>

        </div>

        {/* Heiwa Japanese Auction Sheet Verified Data */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-[#B30D12] flex items-center justify-center font-bold shrink-0">
                <FileCheck2 size={16} />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Heiwa Japanese Auction Sheet Specifications</h3>
                <p className="text-xs text-slate-500 font-medium">Exact data fields extracted directly from the verified Heiwa auction inventory record.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-200">
                Stock #{vehicle.stockid}
              </span>

              <button
                onClick={() => handleDownloadSheet("Japanese")}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 border border-slate-200 cursor-pointer"
              >
                <Download size={13} />
                <span>Inspection sheet (Japanese)</span>
              </button>

              <button
                onClick={() => handleDownloadSheet("English – AI translated")}
                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-[#B30D12] border border-red-200 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Sparkles size={13} />
                <span>Inspection sheet (English – AI translated)</span>
              </button>
            </div>
          </div>

          <div className="p-5 sm:p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">stockid</span>
              <span className="font-mono font-bold text-slate-900 mt-1 block">{vehicle.stockid}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">make</span>
              <span className="font-bold text-slate-900 mt-1 block">{vehicle.make}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">model</span>
              <span className="font-bold text-slate-900 mt-1 block">{vehicle.model}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">grade</span>
              <span className="font-bold text-slate-900 mt-1 block">{vehicle.grade}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">chassis</span>
              <span className="font-mono font-bold text-slate-900 mt-1 block">{vehicle.chassis}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">year / month</span>
              <span className="font-bold text-slate-900 mt-1 block">{vehicle.year}{vehicle.month ? ` / M${vehicle.month}` : ''}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">kms (ODO)</span>
              <span className="font-bold text-slate-900 mt-1 block">{vehicle.kms}k km ({(vehicle.km).toLocaleString('en-US')} km)</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">color</span>
              <span className="font-bold text-slate-900 mt-1 capitalize block">{vehicle.color}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">doors</span>
              <span className="font-bold text-slate-900 mt-1 block">{vehicle.doors > 0 ? `${vehicle.doors} doors` : 'Standard'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">cc (Engine)</span>
              <span className="font-mono font-bold text-slate-900 mt-1 block">{vehicle.cc > 0 ? `${vehicle.cc} cc` : 'EV 0cc'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">trans</span>
              <span className="font-bold text-slate-900 mt-1 block">{vehicle.trans || 'AT'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">fueltype</span>
              <span className="font-bold text-slate-900 mt-1 block">{vehicle.fueltype || '-'} ({vehicle.fuel})</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">condition</span>
              <span className="font-bold text-emerald-700 mt-1 block">Grade {vehicle.condition}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ac</span>
              <span className="font-bold text-slate-900 mt-1 block">{vehicle.ac || 'AC'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 sm:col-span-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">equip</span>
              <span className="font-mono text-slate-900 mt-1 block">{vehicle.equip || 'ps, pw'}</span>
            </div>
            <div className="p-3 bg-red-50/60 rounded-xl border border-red-100">
              <span className="text-[10px] font-bold text-[#B30D12] uppercase tracking-wider block">jpy fob (Auction)</span>
              <span className="font-mono font-black text-slate-900 text-sm mt-1 block">¥{(vehicle.fobJpy).toLocaleString('en-US')}</span>
            </div>
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
              <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">Est. days to land in NZ (indicative)</span>
              <span className="font-bold text-slate-900 text-sm mt-1 flex items-center gap-1.5">
                <Ship size={14} className="text-blue-600" />
                18–22 days (Direct Ro-Ro)
              </span>
            </div>
          </div>
        </div>

        {/* Live NZ Market Evidence Table */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">Live NZ Market Evidence</h3>
              <p className="text-xs text-slate-500 font-medium">Similar active listings scraped from major NZ classifieds.</p>
            </div>
            <span className="text-xs font-bold text-slate-500">{vehicle.nzComparables.length} Verified Comparables</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Listing Platform</th>
                  <th className="px-5 py-3.5">Year</th>
                  <th className="px-5 py-3.5">Mileage</th>
                  <th className="px-5 py-3.5">Advertised Price</th>
                  <th className="px-5 py-3.5">Trade Me Days Listed</th>
                  <th className="px-5 py-3.5 text-right">Spread vs Landed Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {vehicle.nzComparables.map((comp, idx) => {
                  const spread = comp.price - totalLandedCost;
                  return (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="px-5 py-3.5 font-bold text-slate-900 flex items-center gap-1.5">
                        <ExternalLink size={12} className="text-slate-400" />
                        {comp.source}
                      </td>
                      <td className="px-5 py-3.5 text-slate-700">{comp.year}</td>
                      <td className="px-5 py-3.5 text-slate-700 font-mono">{(comp.km).toLocaleString('en-US')} km</td>
                      <td className="px-5 py-3.5 font-bold text-slate-900">NZ${(comp.price).toLocaleString('en-US')}</td>
                      <td className="px-5 py-3.5 text-slate-500">{comp.daysListed} days</td>
                      <td className="px-5 py-3.5 text-right font-extrabold text-emerald-600">
                        +NZ${spread.toLocaleString('en-US')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Small Disclaimer Bar */}
        <div className="flex items-center justify-center gap-2 p-3 bg-white/70 border border-slate-200/70 rounded-xl text-center shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
          <Info size={13} className="text-slate-400 shrink-0" />
          <span className="text-[11px] text-slate-500 font-medium">
            Indicative figures based on current NZ market data. Final bid decisions rest with the dealer.
          </span>
        </div>

      </div>
    </AppLayout>
  );
}
