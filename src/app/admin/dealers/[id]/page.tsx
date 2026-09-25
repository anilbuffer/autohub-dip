"use client";

import React, { useState } from "react";
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
  CheckCircle2,
  Info,
  ChevronLeft,
  ChevronRight
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

  // Pagination for matched vehicles
  const MATCHED_PER_PAGE = 4;
  const [matchedPage, setMatchedPage] = useState(1);
  const totalMatchedPages = Math.ceil(matchedVehicles.length / MATCHED_PER_PAGE) || 1;
  const paginatedMatched = matchedVehicles.slice(
    (matchedPage - 1) * MATCHED_PER_PAGE,
    matchedPage * MATCHED_PER_PAGE
  );

  return (
    <AdminLayout>
      <div className="space-y-6 pb-12 max-w-7xl mx-auto">
        {/* Back Link Row */}
        <div className="flex items-center justify-between">
          <Link
            href="/admin/dealers"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200/90 shadow-2xs hover:bg-slate-50"
          >
            <ArrowLeft size={14} /> Back to Dealership Network
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Account ID:</span>
            <span className="text-xs font-mono font-bold text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
              #DLR-{dealer.id}
            </span>
          </div>
        </div>

        {/* Dealer Header Hero Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.06),0_1px_3px_rgba(15,23,42,0.03)] p-5 sm:p-6 transition-all">
          {/* Subtle Brand Crimson Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#B30D12] via-[#E23B40] to-rose-400/20" />

          {/* Ambient Background Glow */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-gradient-to-br from-rose-500/[0.04] to-transparent blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1B2A4A] to-[#0E1A30] text-slate-200 flex items-center justify-center font-black text-xl shadow-sm border border-[#2B406B]/60 shrink-0">
                {dealer.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    {dealer.name}
                  </h1>
                  <span className="text-xs font-bold text-[#1B2A4A] bg-[#1B2A4A]/10 px-2.5 py-0.5 rounded-full border border-[#1B2A4A]/20 shadow-2xs">
                    {dealer.tier}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium mt-1">
                  <span className="flex items-center gap-1"><MapPin size={13} className="text-slate-400" /> {dealer.location}</span>
                  <span className="flex items-center gap-1"><Mail size={13} className="text-slate-400" /> {dealer.email}</span>
                  <span className="flex items-center gap-1"><Phone size={13} className="text-slate-400" /> {dealer.phone}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>Active Bidding Account</span>
              </span>
            </div>
          </div>
        </div>

        {/* Buying Preferences & Sourcing Rules Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-[#B30D12] border border-red-100 flex items-center justify-center font-bold shadow-2xs">
                <Settings2 size={16} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Active Sourcing Rules &amp; Buying Criteria
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Synchronized with AutoHub DIP Japanese auction matching algorithm.
                </p>
              </div>
            </div>

            <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
              Rule Engine v2.4
            </span>
          </div>

          <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider block mb-2">Preferred Makes</span>
              <div className="flex flex-wrap gap-1.5">
                {activeMakes.map((m) => (
                  <span key={m} className="px-2.5 py-1 bg-slate-100 font-bold text-slate-800 rounded-lg border border-slate-200/60 shadow-2xs">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider block mb-2">Target Models (Wish List)</span>
              <div className="flex flex-wrap gap-1.5">
                {activeModels.map((md) => (
                  <span key={md} className="px-2.5 py-1 bg-red-50 font-bold text-[#B30D12] rounded-lg border border-red-100 shadow-2xs">
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
              <span className="text-sm font-black text-slate-900">
                {(dealer.id === 1 ? syncState.dealerMaxKm : dealer.preferences.maxKm).toLocaleString('en-US')} km
              </span>
            </div>

            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider block mb-2">Target Retail Bracket</span>
              <span className="text-sm font-black text-slate-900">
                {dealer.id === 1 ? `Up to NZ$${syncState.dealerTargetBudget.toLocaleString('en-US')}` : dealer.preferences.targetRetail}
              </span>
            </div>

            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider block mb-2">Target Profit Margin</span>
              <span className="text-sm font-black text-emerald-700 font-mono">
                {dealer.id === 1 ? `+NZ$${syncState.dealerTargetMargin.toLocaleString('en-US')}` : dealer.preferences.targetMargin}
              </span>
            </div>
          </div>
        </div>

        {/* Matched Live Opportunities Section */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-[#B30D12] border border-red-100 flex items-center justify-center font-bold shadow-2xs">
                <Car size={16} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Matched Japanese Auction Lots for {dealer.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Lots satisfying buyer criteria and target margin requirements.
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs self-start sm:self-auto">
              {matchedVehicles.length} Qualified Lots
            </span>
          </div>

          <div className="p-5 sm:p-6 bg-slate-50">
            {matchedVehicles.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200">
                No active lots currently assigned to this dealership.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paginatedMatched.map((v) => {
                  const dynamicLanded = Math.round(((v.fobJpy / syncState.fxRateJpyNzd) + syncState.freightPerUnitNzd + syncState.compliancePerUnitNzd) * 1.15);

                  return (
                    <div
                      key={v.id}
                      className="bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_4px_rgba(15,23,42,0.04)] hover:shadow-[0_6px_18px_-3px_rgba(15,23,42,0.08)] hover:border-slate-300/90 transition-all duration-200 p-4 flex gap-4 hover-lift"
                    >
                      <img
                        src={v.image}
                        alt={v.model}
                        className="w-28 h-24 object-cover rounded-xl shrink-0 border border-slate-200 bg-slate-100"
                      />
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="text-sm font-bold text-slate-900 truncate">{v.year} {v.make} {v.model}</h4>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                              Score {v.score}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-mono truncate">
                            {v.auctionHouse} • Lot #{v.lotNumber} • Grade {v.grade}
                          </p>
                          <p className="text-[11px] text-slate-500 font-medium">
                            {(v.km).toLocaleString('en-US')} km • {v.badge}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
                          <div>
                            <span className="text-slate-400 text-[9px] uppercase font-bold block">Landed Cost</span>
                            <span className="font-bold text-slate-900 font-mono">NZ${dynamicLanded.toLocaleString('en-US')}</span>
                          </div>
                          <Link
                            href={`/admin/vehicles/${v.id}`}
                            className="px-3 py-1.5 bg-[#B30D12] hover:bg-[#940B0F] text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all shadow-2xs"
                          >
                            Audit Sheet <ArrowRight size={12} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pagination Footer */}
          {totalMatchedPages > 1 && (
            <div className="px-5 py-3.5 bg-white border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                Page <strong className="text-slate-900">{matchedPage}</strong> of <strong className="text-slate-900">{totalMatchedPages}</strong>
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setMatchedPage(p => Math.max(1, p - 1))}
                  disabled={matchedPage === 1}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold transition-all shadow-2xs flex items-center gap-0.5 cursor-pointer"
                >
                  <ChevronLeft size={13} /> Prev
                </button>
                <button
                  onClick={() => setMatchedPage(p => Math.min(totalMatchedPages, p + 1))}
                  disabled={matchedPage === totalMatchedPages}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold transition-all shadow-2xs flex items-center gap-0.5 cursor-pointer"
                >
                  Next <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}
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
