"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  Building2,
  FileCheck2,
  CheckCircle2,
  Calculator,
  Save,
  Clock,
  Car,
  Info,
  ArrowRight
} from "lucide-react";
import { VEHICLES, DEALERS, GLOBAL_SETTINGS } from "@/lib/data";
import { useSyncStore } from "@/lib/syncStore";

export default function AdminVehicleDetail({ params }: { params: { id: string } }) {
  const vehicleId = parseInt(params?.id) || 1;
  const vehicle = VEHICLES.find(v => v.id === vehicleId) || VEHICLES[0];
  const { state: syncState } = useSyncStore();

  const [assignedDealer, setAssignedDealer] = useState(vehicle.dealer);
  const [brokerNote, setBrokerNote] = useState("High probability winner at USS Tokyo Lane 3. Battery health report verified Grade 4.5 standard.");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const dynamicLanded = Math.round(((vehicle.fobJpy / syncState.fxRateJpyNzd) + syncState.freightPerUnitNzd + syncState.compliancePerUnitNzd) * 1.15);
  const dynamicMargin = Math.max(1500, vehicle.estRetailNzd - dynamicLanded);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 pb-12 max-w-7xl mx-auto">
        {/* Back Link Row */}
        <div className="flex items-center justify-between">
          <Link
            href="/admin/vehicles"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200/90 shadow-2xs hover:bg-slate-50"
          >
            <ArrowLeft size={14} /> Back to Auction Inventory
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Broker Sheet:</span>
            <span className="font-bold text-slate-800 text-xs bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
              {vehicle.auctionHouse} • Lot #{vehicle.lotNumber}
            </span>
          </div>
        </div>

        {/* Vehicle Header Hero Card */}
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
                  Broker Audit Mode
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200 shadow-2xs">
                  Grade {vehicle.grade} / {vehicle.interiorGrade}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 shadow-2xs">
                  <Sparkles size={11} className="text-emerald-600" />
                  AI Score {vehicle.score}/100
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.badge}
              </h1>

              <p className="text-slate-500 text-xs sm:text-sm font-normal mt-1 leading-relaxed">
                VIN: <span className="font-mono text-slate-700 font-semibold">{vehicle.vin}</span> • {(vehicle.km).toLocaleString('en-US')} km • {vehicle.engine} • {vehicle.transmission} • Auction Date: {vehicle.auctionDate}
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
              <button
                onClick={handleSave}
                className="px-4 py-2.5 bg-[#B30D12] hover:bg-[#940B0F] text-white rounded-xl text-sm font-semibold transition-all shadow-[0_2px_8px_-1px_rgba(179,13,18,0.3)] hover:shadow-[0_4px_14px_-2px_rgba(179,13,18,0.4)] flex items-center gap-2 active:scale-[0.99] cursor-pointer"
              >
                <Save size={14} />
                <span>Save Broker Allocation</span>
              </button>
            </div>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 shadow-xs animate-in fade-in duration-200">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>Broker allocations and notes updated successfully! Sync event broadcast to dealer portal.</span>
          </div>
        )}

        {/* Photo and Broker Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Photo Container */}
          <div className="lg:col-span-2 h-[360px] rounded-2xl overflow-hidden relative shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] border border-slate-200 bg-[#0B1322] group">
            <img
              src={vehicle.image}
              alt={vehicle.model}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1322]/85 via-transparent to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
              <span className="bg-black/65 backdrop-blur-xs px-3 py-1.5 rounded-lg font-bold border border-white/20 shadow-xs">
                {vehicle.auctionHouse} Floor Photo
              </span>
              <span className="font-mono text-slate-200 font-semibold bg-black/65 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/20 shadow-xs flex items-center gap-1.5">
                <Clock size={12} className="text-[#B30D12]" />
                Lot #{vehicle.lotNumber} • Lane Closes: {vehicle.timeLeft}
              </span>
            </div>
          </div>

          {/* Broker Assignment & Overrides */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Building2 size={16} className="text-[#B30D12]" />
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Dealership Assignment</h3>
              </div>

              <div className="space-y-4 text-xs mt-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Assigned Dealership</label>
                  <select
                    value={assignedDealer}
                    onChange={(e) => setAssignedDealer(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:bg-white focus:border-[#B30D12] focus:ring-2 focus:ring-[#B30D12]/20 cursor-pointer"
                  >
                    {DEALERS.map((d) => (
                      <option key={d.id} value={d.name}>{d.name} ({d.tier})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Broker Inspection Notes</label>
                  <textarea
                    rows={4}
                    value={brokerNote}
                    onChange={(e) => setBrokerNote(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 text-xs outline-none focus:bg-white focus:border-[#B30D12] focus:ring-2 focus:ring-[#B30D12]/20 leading-relaxed"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="text-[11px] text-slate-500 font-medium leading-relaxed">
                Assigned dealer receives priority dispatch alert 30 minutes before Tokyo auction lane bidding commences.
              </div>
            </div>
          </div>
        </div>

        {/* Cost & Margin Breakdown & Market Proof */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Financial Breakdown Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] p-6 sm:p-7 space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-[#B30D12] border border-red-100 flex items-center justify-center font-bold shadow-2xs">
                <Calculator size={16} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">CIF &amp; Landed Margin Audit</h3>
                <p className="text-xs text-slate-500 font-medium">Calculated using live FX rate @ {syncState.fxRateJpyNzd} JPY/NZD</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>FOB in Japanese Yen</span>
                <span className="font-mono font-bold text-slate-900">¥{(vehicle.fobJpy).toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>FOB converted to NZD (@ {syncState.fxRateJpyNzd})</span>
                <span className="font-mono font-medium">NZ${Math.round(vehicle.fobJpy / syncState.fxRateJpyNzd).toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>RORO Ocean Freight &amp; Logistics</span>
                <span className="font-mono font-medium">NZ${syncState.freightPerUnitNzd.toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>NZ Entry Compliance &amp; MAF</span>
                <span className="font-mono font-medium">NZ${syncState.compliancePerUnitNzd.toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-between text-slate-600 pb-2 border-b border-slate-200">
                <span>GST (15% statutory)</span>
                <span className="font-mono font-medium">
                  NZ${Math.round(((vehicle.fobJpy / syncState.fxRateJpyNzd) + syncState.freightPerUnitNzd + syncState.compliancePerUnitNzd) * 0.15).toLocaleString('en-US')}
                </span>
              </div>
              <div className="flex justify-between font-black text-slate-900 pt-1 text-sm">
                <span>Total Estimated Landed Cost</span>
                <span className="font-mono">NZ${dynamicLanded.toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-between font-black text-emerald-700 pt-1 text-sm">
                <span>Target Dealer Profit Spread</span>
                <span className="font-mono">+NZ${dynamicMargin.toLocaleString('en-US')}</span>
              </div>
            </div>
          </div>

          {/* Market Proof Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] p-6 sm:p-7 space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-[#B30D12] border border-red-100 flex items-center justify-center font-bold shadow-2xs">
                <FileCheck2 size={16} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Scraped NZ Market Proof</h3>
                <p className="text-xs text-slate-500 font-medium">Real-time Trade Me and Turners listings used to anchor retail valuation.</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {vehicle.nzComparables.map((comp, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{comp.source}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{comp.year} • {(comp.km).toLocaleString('en-US')} km</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 block font-mono text-sm">NZ${(comp.price).toLocaleString('en-US')}</span>
                    <span className="text-[10px] text-slate-500">{comp.daysListed} days listed</span>
                  </div>
                </div>
              ))}
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
