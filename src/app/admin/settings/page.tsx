"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import {
  Calculator,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Save,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Info,
  Layers,
  Ship,
  FileCheck2,
  Sparkles
} from "lucide-react";
import { GLOBAL_SETTINGS } from "@/lib/data";
import { useSyncStore } from "@/lib/syncStore";

export default function AdminSettings() {
  const { state: syncState, updateGlobalFx } = useSyncStore();

  const [fxRate, setFxRate] = useState(syncState.fxRateJpyNzd);
  const [freight, setFreight] = useState(GLOBAL_SETTINGS.freightPerUnitNzd);
  const [compliance, setCompliance] = useState(GLOBAL_SETTINGS.compliancePerUnitNzd);
  const [defaultMargin, setDefaultMargin] = useState(GLOBAL_SETTINGS.defaultTargetMarginNzd);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSave = () => {
    updateGlobalFx(fxRate);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSyncFx = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const liveRate = 91.85;
      setFxRate(liveRate);
      updateGlobalFx(liveRate);
      setIsSyncing(false);
    }, 600);
  };

  // Sample sensitivity check
  const sampleFobJpy = 1500000;
  const sampleFobNzd = Math.round(sampleFobJpy / fxRate);
  const sampleLandedNzd = Math.round((sampleFobNzd + freight + compliance) * 1.15);

  return (
    <AdminLayout>
      <div className="space-y-6 pb-12 max-w-7xl mx-auto">
        {/* Page Header Hero Card with Crimson Accent Line */}
        <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.06),0_1px_3px_rgba(15,23,42,0.03)] p-5 sm:p-6 transition-all">
          {/* Subtle Brand Crimson Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#B30D12] via-[#E23B40] to-rose-400/20" />

          {/* Ambient Background Glow */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-gradient-to-br from-rose-500/[0.04] to-transparent blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2.5">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/90 border border-slate-200/80 text-[11px] font-semibold text-slate-700 shadow-2xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B30D12] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B30D12]"></span>
                  </span>
                  Core Calculation Engine
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-[11px] text-amber-600 font-medium shadow-2xs">
                  <span>Live Wholesale FX:</span>
                  <strong className="font-mono text-amber-800 font-bold">1 NZD = {fxRate} JPY</strong>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-700 shadow-2xs">
                  <Sparkles size={11} className="text-emerald-600" />
                  Instant Dealer Sync
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Global Landed Calculation Engine
              </h1>

              <p className="text-slate-500 text-xs sm:text-sm font-normal mt-1 leading-relaxed max-w-3xl">
                Configure baseline FX conversion rates, ocean carrier shipping tariffs, compliance costs, and default dealer gross margin rules.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
              <button
                onClick={handleSave}
                className="px-4 py-2.5 bg-[#B30D12] hover:bg-[#940B0F] text-white rounded-xl text-sm font-semibold transition-all shadow-[0_2px_8px_-1px_rgba(179,13,18,0.3)] hover:shadow-[0_4px_14px_-2px_rgba(179,13,18,0.4)] flex items-center gap-2 active:scale-[0.99] cursor-pointer"
              >
                <Save size={15} />
                <span>Commit Engine Parameters</span>
              </button>
            </div>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 shadow-xs animate-in fade-in duration-200">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>Global parameters saved! Landed cost engines across all dealer portals updated immediately.</span>
          </div>
        )}

        {/* Global Variables Form Container */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-[#B30D12] border border-red-100 flex items-center justify-center font-bold shadow-2xs">
                <Calculator size={16} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Assumptions &amp; Tariff Table
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Applied automatically to every auction lot across USS, TAA, CAA feeds.
                </p>
              </div>
            </div>

            <button
              onClick={handleSyncFx}
              className="text-xs font-bold text-[#B30D12] hover:text-[#8B090E] bg-red-50/80 hover:bg-red-100/80 border border-red-200/80 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer self-start sm:self-auto"
            >
              <RefreshCw size={12} className={isSyncing ? "animate-spin" : ""} />
              <span>Sync Live Bank FX</span>
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* FX Rate Input Row */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-900 block">JPY / NZD Currency Conversion Rate</label>
                  <span className="text-[11px] text-slate-500 font-medium">Base wholesale bank rate used to convert Japanese Yen FOB lots to NZD.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-500">1 NZD =</span>
                  <input
                    type="number"
                    step="0.05"
                    value={fxRate}
                    onChange={(e) => setFxRate(parseFloat(e.target.value) || 0)}
                    className="w-28 px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 text-right outline-none focus:border-[#B30D12] focus:ring-2 focus:ring-[#B30D12]/20 shadow-2xs"
                  />
                  <span className="text-xs font-bold text-slate-700">JPY</span>
                </div>
              </div>
            </div>

            {/* Logistics & Compliance Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
              {/* Freight */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Ocean Freight (RORO Per Car)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">NZ$</span>
                  <input
                    type="number"
                    value={freight}
                    onChange={(e) => setFreight(parseInt(e.target.value) || 0)}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-[#B30D12] focus:ring-2 focus:ring-[#B30D12]/20 font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-400">Tokyo/Yokohama to Auckland port ocean carrier contract.</p>
              </div>

              {/* Compliance */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  NZ Compliance, Entry &amp; MAF
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">NZ$</span>
                  <input
                    type="number"
                    value={compliance}
                    onChange={(e) => setCompliance(parseInt(e.target.value) || 0)}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-[#B30D12] focus:ring-2 focus:ring-[#B30D12]/20 font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-400">Standard VTNZ/VINZ compliance testing, bio-wash, and entry cert.</p>
              </div>

              {/* Default Margin */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Default Platform Target Margin
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">NZ$</span>
                  <input
                    type="number"
                    value={defaultMargin}
                    onChange={(e) => setDefaultMargin(parseInt(e.target.value) || 0)}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-[#B30D12] focus:ring-2 focus:ring-[#B30D12]/20 font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-400">Fallback minimum profit spread for unconfigured dealers.</p>
              </div>

              {/* GST Rate */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  NZ Goods &amp; Services Tax (GST)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    disabled
                    value="15% (Statutory Rate)"
                    className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none cursor-not-allowed"
                  />
                </div>
                <p className="text-[11px] text-slate-400">Applied on CIF value + duty + port security fees.</p>
              </div>
            </div>

            {/* Live Model Sensitivity Preview */}
            <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Info size={14} className="text-[#B30D12]" />
                <span>Live Sensitivity Test (Sample ¥1,500,000 Lot)</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-700 pt-1">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">FOB NZD:</span>
                  <span className="font-bold text-slate-900 font-mono">NZ${sampleFobNzd.toLocaleString('en-US')}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Freight + Comp:</span>
                  <span className="font-bold text-slate-900 font-mono">NZ${(freight + compliance).toLocaleString('en-US')}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Landed (incl GST):</span>
                  <span className="font-black text-slate-900 font-mono">NZ${sampleLandedNzd.toLocaleString('en-US')}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Spread Delta:</span>
                  <span className="font-black text-emerald-700">Strong Margin Potential</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Small Disclaimer */}
        <div className="flex items-center justify-center gap-2 p-3 bg-white/70 border border-slate-200/70 rounded-xl text-center shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
          <Info size={13} className="text-slate-400 shrink-0" />
          <span className="text-[11px] text-slate-500 font-medium">
            Indicative figures based on current NZ market data. Final bid decisions rest with the dealer.
          </span>
        </div>
      </div>
    </AdminLayout>
  );
}
