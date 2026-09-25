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
  FileCheck2
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
      <div className="space-y-8 pb-16 max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1B2A4A]/10 text-[#1B2A4A] border border-[#1B2A4A]/20">
                Core Financial Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Global Landed Calculation Engine
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-0.5">
              Configure baseline FX rates, shipping tariffs, compliance costs, and default dealer margin rules.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-[#B30D12] hover:bg-[#940B0F] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 self-start md:self-auto"
          >
            <Save size={14} /> Commit Engine Parameters
          </button>
        </div>

        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 size={16} className="text-emerald-600" />
            Global parameters saved! Landed cost engines across all dealer portals updated immediately.
          </div>
        )}

        {/* Global Variables Form */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1B2A4A]/10 text-[#1B2A4A] flex items-center justify-center font-bold">
                <Calculator size={18} />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900">Assumptions & Tariff Table</h2>
                <p className="text-xs text-slate-400 font-medium">Applied automatically to every auction lot across USS, TAA, CAA feeds.</p>
              </div>
            </div>

            <button 
              onClick={handleSyncFx}
              className="text-xs font-bold text-[#1B2A4A] hover:text-[#0B1322] flex items-center gap-1 bg-[#1B2A4A]/10 px-3 py-1.5 rounded-lg border border-[#1B2A4A]/20 transition-colors"
            >
              <RefreshCw size={12} className={isSyncing ? "animate-spin" : ""} /> Sync Live Bank FX
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* FX Rate Input */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="text-xs font-black text-slate-900 block">JPY / NZD Currency Conversion Rate</label>
                  <span className="text-[11px] text-slate-500">Base bank rate used to convert Japanese Yen FOB lots to NZD.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-500">1 NZD =</span>
                  <input 
                    type="number" 
                    step="0.05"
                    value={fxRate}
                    onChange={(e) => setFxRate(parseFloat(e.target.value) || 0)}
                    className="w-24 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 text-right outline-none focus:border-[#B30D12]"
                  />
                  <span className="text-xs font-bold text-slate-700">JPY</span>
                </div>
              </div>
            </div>

            {/* Logistics & Compliance Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              {/* Freight */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Ocean Freight (RORO Per Car)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">NZ$</span>
                  <input 
                    type="number"
                    value={freight}
                    onChange={(e) => setFreight(parseInt(e.target.value) || 0)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-[#B30D12]"
                  />
                </div>
                <p className="text-[11px] text-slate-400">Tokyo/Yokohama to Auckland port ocean carrier contract.</p>
              </div>

              {/* Compliance */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  NZ Compliance, Entry & MAF
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">NZ$</span>
                  <input 
                    type="number"
                    value={compliance}
                    onChange={(e) => setCompliance(parseInt(e.target.value) || 0)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-[#B30D12]"
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
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">NZ$</span>
                  <input 
                    type="number"
                    value={defaultMargin}
                    onChange={(e) => setDefaultMargin(parseInt(e.target.value) || 0)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-[#B30D12]"
                  />
                </div>
                <p className="text-[11px] text-slate-400">Fallback minimum profit spread for unconfigured dealers.</p>
              </div>

              {/* GST Rate */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  NZ Goods & Services Tax (GST)
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
            <div className="mt-6 p-4 rounded-2xl bg-[#1B2A4A]/5 border border-[#1B2A4A]/15 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-black text-[#1B2A4A]">
                <Info size={14} className="text-[#1B2A4A]" />
                <span>Live Sensitivity Test (Sample ¥1,500,000 Lot)</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-700 pt-1">
                <div>
                  <span className="text-slate-400 text-[10px] block">FOB NZD:</span>
                  <span className="font-bold text-slate-900">NZ${sampleFobNzd.toLocaleString('en-US')}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Freight + Comp:</span>
                  <span className="font-bold text-slate-900">NZ${(freight + compliance).toLocaleString('en-US')}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Landed (incl GST):</span>
                  <span className="font-black text-[#1B2A4A]">NZ${sampleLandedNzd.toLocaleString('en-US')}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Spread Delta:</span>
                  <span className="font-black text-emerald-700">Healthy Arbitrage</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
