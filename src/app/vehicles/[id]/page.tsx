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
  const fobPercent = Math.min(100, Math.max(0, ((fobJpy - 800000) / (2500000 - 800000)) * 100));
  const marginPercent = Math.min(100, Math.max(0, ((targetMargin - 1500) / (8000 - 1500)) * 100));

  // Hover state for interactive scatter points
  const [activeTooltip, setActiveTooltip] = useState<{
    title: string;
    subtitle: string;
    price: number;
    km: number;
    isThisLot?: boolean;
    x: number;
    y: number;
  } | null>(null);

  // Dynamic realistic comparable NZ yard listings & chart calculations
  const vehicleKm = vehicle.km || (vehicle.kms ? (vehicle.kms < 1000 ? vehicle.kms * 1000 : vehicle.kms) : 51000);
  const estRetail = vehicle.estRetailNzd || (totalLandedCost + (vehicle.targetMarginNzd || 4800));
  const currentSpread = estRetail - totalLandedCost;

  const compListings = React.useMemo(() => {
    return [
      { source: "Trade Me (Auckland)", dealer: "Giltrap Prestige", km: Math.max(12000, vehicleKm - 25000), price: Math.round(estRetail * 1.14) },
      { source: "Turners Cars (Penrose)", dealer: "Turners Auckland", km: Math.max(18000, vehicleKm - 15000), price: Math.round(estRetail * 1.08) },
      { source: "Trade Me (Christchurch)", dealer: "City Motor Group", km: Math.max(25000, vehicleKm - 7000), price: Math.round(estRetail * 1.03) },
      { source: "2CheapCars (Greenlane)", dealer: "2CheapCars Ltd", km: vehicleKm + 6000, price: Math.round(estRetail * 0.96) },
      { source: "AutoTrader (Wellington)", dealer: "Capital City Cars", km: vehicleKm + 18000, price: Math.round(estRetail * 0.90) },
      { source: "Trade Me (Hamilton)", dealer: "Waikato Vehicle Centre", km: vehicleKm + 28000, price: Math.round(estRetail * 0.84) },
      { source: "Turners (Tauranga)", dealer: "Turners Regional", km: vehicleKm + 40000, price: Math.round(estRetail * 0.78) },
    ];
  }, [vehicleKm, estRetail]);

  const chartW = 540;
  const chartH = 240;
  const padLeft = 65;
  const padRight = 25;
  const padTop = 24;
  const padBottom = 38;
  const plotW = chartW - padLeft - padRight;
  const plotH = chartH - padTop - padBottom;

  const allKm = [...compListings.map(c => c.km), vehicleKm];
  const allPrice = [...compListings.map(c => c.price), estRetail, totalLandedCost];

  const minKm = Math.max(0, Math.floor((Math.min(...allKm) * 0.85) / 10000) * 10000);
  const maxKm = Math.ceil((Math.max(...allKm) * 1.15) / 10000) * 10000;

  const minPrice = Math.floor((Math.min(...allPrice) * 0.88) / 2000) * 2000;
  const maxPrice = Math.ceil((Math.max(...allPrice) * 1.08) / 2000) * 2000;

  const kmRange = Math.max(1, maxKm - minKm);
  const priceRange = Math.max(1, maxPrice - minPrice);

  const getChartX = (km: number) => padLeft + ((km - minKm) / kmRange) * plotW;
  const getChartY = (price: number) => padTop + plotH - ((price - minPrice) / priceRange) * plotH;

  const yTicks = [
    minPrice,
    Math.round(minPrice + priceRange * 0.33),
    Math.round(minPrice + priceRange * 0.66),
    maxPrice
  ];

  const xTicks = [
    minKm,
    Math.round(minKm + kmRange * 0.33),
    Math.round(minKm + kmRange * 0.66),
    maxKm
  ];

  const regPriceMin = estRetail + ((vehicleKm - minKm) / kmRange) * (priceRange * 0.35);
  const regPriceMax = estRetail - ((maxKm - vehicleKm) / kmRange) * (priceRange * 0.35);
  const regP1 = { x: getChartX(minKm), y: getChartY(regPriceMin) };
  const regP2 = { x: getChartX(maxKm), y: getChartY(regPriceMax) };

  const thisLotX = getChartX(vehicleKm);
  const thisLotY = getChartY(totalLandedCost);
  const thisLotRetailY = getChartY(estRetail);

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
                  className={`h-24 rounded-xl overflow-hidden border cursor-pointer transition-all ${activePhoto === img
                    ? 'border-[#B30D12] ring-2 ring-[#B30D12]/40 scale-102'
                    : 'border-slate-200 hover:opacity-90'
                    }`}
                >
                  <img src={img} alt={`Angle ${i + 1}`} className="w-full h-full object-cover" />
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
        <div className="bg-gradient-to-r from-red-50/40 via-red-100 to-red-50/40 rounded-2xl border border-red-100 p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
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
                  style={{
                    background: `linear-gradient(to right, #B30D12 0%, #B30D12 ${fobPercent}%, #e2e8f0 ${fobPercent}%, #e2e8f0 100%)`
                  }}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#B30D12]"
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
                  style={{
                    background: `linear-gradient(to right, #059669 0%, #059669 ${marginPercent}%, #e2e8f0 ${marginPercent}%, #e2e8f0 100%)`
                  }}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-600"
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-black text-slate-900">Price vs Kilometres (NZ Yard Comp)</h3>
                <p className="text-xs text-slate-500 font-medium">This vehicle plotted against active NZ yard listings & depreciation curve.</p>
              </div>
              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1 shadow-2xs ${currentSpread > 0
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                  : "bg-amber-50 text-amber-700 border-amber-200/80"
                  }`}>
                  <TrendingUp size={12} />
                  <span>Arbitrage: {currentSpread > 0 ? `+NZ$${currentSpread.toLocaleString('en-US')}` : `-NZ$${Math.abs(currentSpread).toLocaleString('en-US')}`}</span>
                </span>
              </div>
            </div>

            {/* SVG Scatter Chart Container */}
            <div className="relative w-full bg-slate-50/50 rounded-xl p-3 border border-slate-100">
              <svg
                viewBox={`0 0 ${chartW} ${chartH}`}
                className="w-full h-auto max-h-[290px] overflow-visible select-none"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Horizontal Gridlines & Y-Axis Labels */}
                {yTicks.map((price, idx) => {
                  const y = getChartY(price);
                  return (
                    <g key={`y-tick-${idx}`}>
                      <line
                        x1={padLeft}
                        y1={y}
                        x2={padLeft + plotW}
                        y2={y}
                        stroke="#E2E8F0"
                        strokeWidth="1"
                        strokeDasharray={idx === 0 ? "none" : "3 3"}
                      />
                      <text
                        x={padLeft - 10}
                        y={y + 3.5}
                        textAnchor="end"
                        fontSize="10"
                        fontWeight="600"
                        fill="#64748B"
                      >
                        NZ${Math.round(price / 1000)}k
                      </text>
                    </g>
                  );
                })}

                {/* Vertical Gridlines & X-Axis Labels */}
                {xTicks.map((km, idx) => {
                  const x = getChartX(km);
                  return (
                    <g key={`x-tick-${idx}`}>
                      <line
                        x1={x}
                        y1={padTop}
                        x2={x}
                        y2={padTop + plotH}
                        stroke="#E2E8F0"
                        strokeWidth="1"
                        strokeDasharray="3 3"
                      />
                      <text
                        x={x}
                        y={padTop + plotH + 18}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="600"
                        fill="#64748B"
                      >
                        {Math.round(km / 1000)}k km
                      </text>
                    </g>
                  );
                })}

                {/* Axes Lines */}
                <line
                  x1={padLeft}
                  y1={padTop}
                  x2={padLeft}
                  y2={padTop + plotH}
                  stroke="#CBD5E1"
                  strokeWidth="1.5"
                />
                <line
                  x1={padLeft}
                  y1={padTop + plotH}
                  x2={padLeft + plotW}
                  y2={padTop + plotH}
                  stroke="#CBD5E1"
                  strokeWidth="1.5"
                />

                {/* Market Depreciation Regression Line */}
                <line
                  x1={regP1.x}
                  y1={regP1.y}
                  x2={regP2.x}
                  y2={regP2.y}
                  stroke="#94A3B8"
                  strokeWidth="2.5"
                  strokeDasharray="5 4"
                />

                {/* Arbitrage Spread Connector to Regression Line */}
                {currentSpread > 0 && (
                  <g>
                    <line
                      x1={thisLotX}
                      y1={thisLotRetailY}
                      x2={thisLotX}
                      y2={thisLotY}
                      stroke="#059669"
                      strokeWidth="1.5"
                      strokeDasharray="2 2"
                    />
                    <circle
                      cx={thisLotX}
                      cy={thisLotRetailY}
                      r="3.5"
                      fill="#94A3B8"
                    />
                  </g>
                )}

                {/* NZ Comparable Yard Listings Dots */}
                {compListings.map((comp, idx) => {
                  const cx = getChartX(comp.km);
                  const cy = getChartY(comp.price);
                  const isHovered = activeTooltip?.title === comp.source;

                  return (
                    <g
                      key={`comp-${idx}`}
                      className="cursor-pointer transition-transform"
                      onMouseEnter={() => setActiveTooltip({
                        title: comp.source,
                        subtitle: comp.dealer,
                        price: comp.price,
                        km: comp.km,
                        isThisLot: false,
                        x: cx,
                        y: cy
                      })}
                      onMouseLeave={() => setActiveTooltip(null)}
                    >
                      {isHovered && (
                        <circle cx={cx} cy={cy} r="10" fill="#3B82F6" opacity="0.2" />
                      )}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isHovered ? "6" : "4.5"}
                        fill={isHovered ? "#2563EB" : "#64748B"}
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                        className="transition-all duration-150"
                      />
                    </g>
                  );
                })}

                {/* Target Vehicle Point ("This Lot" Landed Cost) */}
                <g
                  className="cursor-pointer"
                  onMouseEnter={() => setActiveTooltip({
                    title: `This Lot: ${vehicle.year} ${vehicle.make} ${vehicle.model}`,
                    subtitle: `Auckland Landed Cost (${vehicle.auctionHouse})`,
                    price: totalLandedCost,
                    km: vehicleKm,
                    isThisLot: true,
                    x: thisLotX,
                    y: thisLotY
                  })}
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                  <circle cx={thisLotX} cy={thisLotY} r="12" fill="#10B981" opacity="0.35" className="animate-ping origin-center" />
                  <circle cx={thisLotX} cy={thisLotY} r="9" fill="#059669" stroke="#ECFDF5" strokeWidth="2.5" className="shadow-md" />
                  <text
                    x={thisLotX}
                    y={thisLotY + 3.5}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="9"
                    fontWeight="bold"
                  >
                    ★
                  </text>

                  {/* Static Callout Pill */}
                  <g transform={`translate(${Math.min(chartW - 130, Math.max(padLeft + 10, thisLotX - 60))}, ${thisLotY - 26})`}>
                    <rect width="120" height="20" rx="5" fill="#065F46" />
                    <text x="60" y="13.5" textAnchor="middle" fill="#FFFFFF" fontSize="9.5" fontWeight="bold">
                      This Lot: NZ${totalLandedCost.toLocaleString('en-US')}
                    </text>
                  </g>
                </g>

                {/* Interactive Tooltip Card Overlay (inside SVG) */}
                {activeTooltip && (
                  <g transform={`translate(${Math.min(chartW - 160, Math.max(padLeft + 10, activeTooltip.x - 75))}, ${Math.max(10, activeTooltip.y - 54)})`} pointerEvents="none">
                    <rect
                      width="150"
                      height="46"
                      rx="7"
                      fill="#0F172A"
                      opacity="0.95"
                      className="shadow-xl"
                    />
                    <text x="8" y="15" fill="#94A3B8" fontSize="8.5" fontWeight="bold">
                      {activeTooltip.title.length > 25 ? activeTooltip.title.slice(0, 23) + '...' : activeTooltip.title}
                    </text>
                    <text x="8" y="28" fill="#FFFFFF" fontSize="11" fontWeight="extrabold">
                      NZ${activeTooltip.price.toLocaleString('en-US')}
                    </text>
                    <text x="142" y="28" textAnchor="end" fill="#CBD5E1" fontSize="9.5" fontWeight="600">
                      {activeTooltip.km.toLocaleString('en-US')} km
                    </text>
                    <text x="8" y="40" fill={activeTooltip.isThisLot ? "#34D399" : "#94A3B8"} fontSize="8" fontWeight="medium">
                      {activeTooltip.isThisLot ? `★ +NZ$${currentSpread.toLocaleString('en-US')} vs market comp` : activeTooltip.subtitle || 'Active NZ dealer comp'}
                    </text>
                  </g>
                )}
              </svg>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-1 text-xs">
              <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                <span>Active NZ Yard Listings</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span className="w-5 h-0.5 border-t-2 border-dashed border-slate-400"></span>
                <span>Market Depreciation Curve</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px]">★</span>
                <span>This Lot (Landed: NZ${totalLandedCost.toLocaleString('en-US')})</span>
              </div>
            </div>

            {/* Callout Banner */}
            <div className={`p-3.5 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs ${currentSpread > 0
              ? "bg-emerald-50/90 border-emerald-200 text-emerald-900"
              : "bg-amber-50/90 border-amber-200 text-amber-900"
              }`}>
              <div className="flex items-center gap-2">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${currentSpread > 0 ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"
                  }`}>
                  ★
                </span>
                <div>
                  <strong>{currentSpread > 0 ? "Best Value vs NZ Market:" : "Market Price Alignment:"}</strong>{" "}
                  {currentSpread > 0
                    ? `Positioned NZ$${currentSpread.toLocaleString('en-US')} below market retail regression for ${Math.round(vehicleKm / 1000)}k km.`
                    : `Landed cost is within NZ$${Math.abs(currentSpread).toLocaleString('en-US')} of market comps.`}
                </div>
              </div>
              {currentSpread > 0 && (
                <span className="self-start sm:self-auto font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md text-[11px] shrink-0">
                  Target Margin: NZ${targetMargin.toLocaleString('en-US')}
                </span>
              )}
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
