"use client";

import React from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import Link from "next/link";
import { 
  ArrowLeft, 
  Settings2, 
  Building2, 
  MapPin, 
  Mail, 
  Phone, 
  Car, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { DEALERS, VEHICLES } from "@/lib/data";
import { useSyncStore } from "@/lib/syncStore";

export default function AdminDealerProfile({ params }: { params: { id: string } }) {
  const dealerId = parseInt(params?.id) || 1;
  const dealer = DEALERS.find(d => d.id === dealerId) || DEALERS[0];
  const { state: syncState } = useSyncStore();

  const activeModels = dealer.id === 1 ? syncState.dealerModels : dealer.preferences.models;
  const activeMakes = dealer.id === 1 ? syncState.dealerMakes : dealer.preferences.makes;
  const matchedVehicles = VEHICLES.filter(v => v.dealer === dealer.name);

  return (
    <AdminLayout>
      <div className="space-y-8 pb-16 max-w-5xl mx-auto">
        
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link 
            href="/admin/dealers" 
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs"
          >
            <ArrowLeft size={14} /> Back to Dealership Network
          </Link>
          <span className="text-xs font-bold text-slate-500">Account ID: #DLR-{dealer.id}</span>
        </div>

        {/* Dealer Header */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#1B2A4A] text-white flex items-center justify-center font-black text-xl shadow-sm border border-[#2B406B]">
              {dealer.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {dealer.name}
                </h1>
                <span className="text-xs font-bold text-[#1B2A4A] bg-[#1B2A4A]/10 px-2.5 py-0.5 rounded-full border border-[#1B2A4A]/20">
                  {dealer.tier}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium mt-1">
                <span className="flex items-center gap-1"><MapPin size={13} /> {dealer.location}</span>
                <span className="flex items-center gap-1"><Mail size={13} /> {dealer.email}</span>
                <span className="flex items-center gap-1"><Phone size={13} /> {dealer.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Buying Preferences Audit */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] p-6 sm:p-7 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Settings2 size={18} className="text-[#1B2A4A]" /> Client Buying Rules & Preferences
            </h2>
            <span className="text-xs text-slate-400 font-medium">Used by AutoHeiwa scraper match algorithm</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider block mb-2">Preferred Makes</span>
              <div className="flex flex-wrap gap-1.5">
                {activeMakes.map(m => (
                  <span key={m} className="px-2.5 py-1 bg-slate-100 font-bold text-slate-800 rounded-lg">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider block mb-2">Target Models (Wish List)</span>
              <div className="flex flex-wrap gap-1.5">
                {activeModels.map(md => (
                  <span key={md} className="px-2.5 py-1 bg-red-50 font-bold text-[#B30D12] rounded-lg border border-red-100">
                    {md}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider block mb-2">Year Range</span>
              <span className="text-sm font-black text-slate-900">{dealer.preferences.yearRange}</span>
            </div>

            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider block mb-2">Maximum Mileage</span>
              <span className="text-sm font-black text-slate-900">{(dealer.preferences.maxKm).toLocaleString('en-US')} km</span>
            </div>

            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider block mb-2">Target Retail Bracket</span>
              <span className="text-sm font-black text-slate-900">{dealer.preferences.targetRetail}</span>
            </div>

            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider block mb-2">Target Profit Margin</span>
              <span className="text-sm font-black text-emerald-700">{dealer.preferences.targetMargin}</span>
            </div>
          </div>
        </div>

        {/* Matched Live Opportunities */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Matched Auction Lots for {dealer.name}
            </h2>
            <span className="text-xs font-bold text-slate-500">
              {matchedVehicles.length} Qualified Opportunities
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matchedVehicles.map(v => (
              <div 
                key={v.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] p-4 flex gap-4 hover-lift"
              >
                <img 
                  src={v.image} 
                  alt={v.model} 
                  className="w-24 h-20 object-cover rounded-xl shrink-0 border border-slate-200" 
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-black text-slate-900">{v.year} {v.make} {v.model}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        Score {v.score}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                      {v.auctionHouse} • Lot #{v.lotNumber} • {(v.km).toLocaleString('en-US')} km
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Landed Cost</span>
                      <span className="font-bold text-slate-900">NZ${(v.landedNzd).toLocaleString('en-US')}</span>
                    </div>
                    <Link
                      href={`/admin/vehicles/${v.id}`}
                      className="px-3 py-1 bg-[#1B2A4A] hover:bg-[#0B1322] text-white rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      Audit Sheet <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
