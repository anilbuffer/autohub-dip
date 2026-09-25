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
  ExternalLink,
  Calculator,
  Save,
  Layers,
  Car
} from "lucide-react";
import { VEHICLES, DEALERS, GLOBAL_SETTINGS } from "@/lib/data";

export default function AdminVehicleDetail({ params }: { params: { id: string } }) {
  const vehicleId = parseInt(params?.id) || 1;
  const vehicle = VEHICLES.find(v => v.id === vehicleId) || VEHICLES[0];

  const [assignedDealer, setAssignedDealer] = useState(vehicle.dealer);
  const [brokerNote, setBrokerNote] = useState("High probability winner at USS Tokyo Lane 3. Battery health report verified Grade 4.5 standard.");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <AdminLayout>
      <div className="space-y-8 pb-16 max-w-6xl mx-auto">
        
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link 
            href="/admin/vehicles" 
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs"
          >
            <ArrowLeft size={14} /> Back to All Lots
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Broker Sheet:</span>
            <span className="font-bold text-slate-900 text-xs bg-slate-100 px-2.5 py-1 rounded-lg">
              {vehicle.auctionHouse} • Lot #{vehicle.lotNumber}
            </span>
          </div>
        </div>

        {/* Vehicle Header Brief */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#1B2A4A]/10 text-[#1B2A4A] border border-[#1B2A4A]/20">
                Broker Audit Mode
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                Grade {vehicle.grade} / {vehicle.interiorGrade}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                AI Score {vehicle.score}/100
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.badge}
            </h1>
            <p className="text-slate-500 text-xs font-medium mt-1">
              VIN: <span className="font-mono text-slate-700 font-semibold">{vehicle.vin}</span> • {(vehicle.km).toLocaleString('en-US')} km • {vehicle.auctionDate}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="px-4 py-2.5 bg-[#B30D12] hover:bg-[#940B0F] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Save size={14} /> Update Broker Allocation
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 size={16} className="text-emerald-600" />
            Broker allocations and notes saved successfully!
          </div>
        )}

        {/* Top Grid: Photo & Broker Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Photo */}
          <div className="lg:col-span-2 h-[340px] rounded-2xl overflow-hidden relative shadow-sm border border-slate-200 bg-[#0B1322] group">
            <img 
              src={vehicle.image} 
              alt={vehicle.model} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1322]/80 via-transparent to-transparent" />
            
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
              <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg font-bold border border-white/20">
                {vehicle.auctionHouse} Floor Photo
              </span>
              <span className="font-mono text-slate-300">
                Lot #{vehicle.lotNumber} • Time Left: {vehicle.timeLeft}
              </span>
            </div>
          </div>

          {/* Broker Assignment & Overrides */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] p-6 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-base font-black text-slate-900 mb-3">Dealer Allocation</h3>
              
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Assigned Dealership</label>
                  <select 
                    value={assignedDealer}
                    onChange={(e) => setAssignedDealer(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none"
                  >
                    {DEALERS.map(d => (
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
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 text-xs outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="text-[11px] text-slate-500 font-medium">
                Assigned dealer will receive priority SMS alert 30 minutes before bidding commences.
              </div>
            </div>
          </div>
        </div>

        {/* Cost & Margin Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] p-6 sm:p-7 space-y-4">
            <h3 className="text-base font-black text-slate-900">CIF & Landed Margin Audit</h3>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>FOB in Japanese Yen</span>
                <span className="font-mono font-bold text-slate-900">¥{(vehicle.fobJpy).toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>FOB converted to NZD (@ 91.24)</span>
                <span className="font-mono font-medium">NZ${(vehicle.costBreakdown.fobConvertedNzd).toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>RORO Ocean Freight & Logistics</span>
                <span className="font-mono font-medium">NZ${(vehicle.costBreakdown.freightNzd).toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>NZ Entry Compliance & MAF</span>
                <span className="font-mono font-medium">NZ${(vehicle.costBreakdown.complianceNzd).toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-between text-slate-600 pb-2 border-b border-slate-200">
                <span>GST (15%)</span>
                <span className="font-mono font-medium">NZ${(vehicle.costBreakdown.gstAndFeesNzd).toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-between font-black text-slate-900 pt-1 text-sm">
                <span>Total Estimated Landed Cost</span>
                <span>NZ${(vehicle.landedNzd).toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-between font-black text-emerald-700 pt-1 text-sm">
                <span>Target Dealer Profit Spread</span>
                <span>+NZ${(vehicle.targetMarginNzd).toLocaleString('en-US')}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] p-6 sm:p-7 space-y-4">
            <h3 className="text-base font-black text-slate-900">Scraped NZ Market Proof</h3>
            <p className="text-xs text-slate-500 font-medium">Real-time Trade Me and Turners listings used to anchor retail valuation.</p>

            <div className="space-y-2.5">
              {vehicle.nzComparables.map((comp, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{comp.source}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{comp.year} • {(comp.km).toLocaleString('en-US')} km</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 block">NZ${(comp.price).toLocaleString('en-US')}</span>
                    <span className="text-[10px] text-slate-500">{comp.daysListed} days listed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
