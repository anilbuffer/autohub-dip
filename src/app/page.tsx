"use client";

import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Clock,
  TrendingUp,
  Car,
  Info,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { VEHICLES } from "@/lib/data";
import { useSyncStore } from "@/lib/syncStore";
import { triggerAutoHubCopilot } from "@/components/chat/DealerChatAssistant";

function getPaginationPages(currentPage: number, totalPages: number) {
  if (totalPages <= 6) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (currentPage <= 3) {
    return [1, 2, 3, 4, '...', totalPages];
  }
  if (currentPage >= totalPages - 2) {
    return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
}

export default function Dashboard() {
  const { state: syncState } = useSyncStore();

  // Categorize vehicles into Best Matches (Priority buys) and Other Qualifying
  const bestMatches = VEHICLES.filter((v) => v.status === "Priority").sort((a, b) => b.score - a.score);
  const otherVehicles = VEHICLES.filter((v) => v.status !== "Priority").sort((a, b) => b.score - a.score);
  const avgPriorityMargin = Math.round(
    bestMatches.reduce((acc, v) => acc + v.targetMarginNzd, 0) / (bestMatches.length || 1)
  );

  // Pagination states (2-3 cards per page for user friendly layout)
  const BEST_PER_PAGE = 3;
  const [bestPage, setBestPage] = useState(1);
  const totalBestPages = Math.ceil(bestMatches.length / BEST_PER_PAGE);
  const paginatedBestMatches = bestMatches.slice(
    (bestPage - 1) * BEST_PER_PAGE,
    bestPage * BEST_PER_PAGE
  );

  const OTHER_PER_PAGE = 4;
  const [otherPage, setOtherPage] = useState(1);
  const totalOtherPages = Math.ceil(otherVehicles.length / OTHER_PER_PAGE);
  const paginatedOtherVehicles = otherVehicles.slice(
    (otherPage - 1) * OTHER_PER_PAGE,
    otherPage * OTHER_PER_PAGE
  );

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-7 pb-10 pt-1">

        {/* 1. Greeting and Top KPIs (Compact & Light Theme with Soft Shadows) */}
        <section className="space-y-4">
          {/* Compact Greeting Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-1">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.04)] text-[11px] font-semibold text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B30D12] animate-pulse" />
                  Auckland Auto Group
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Live FX: <strong className="font-mono text-slate-700 font-bold">1 NZD = {syncState.fxRateJpyNzd} JPY</strong>
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Good morning, David
              </h1>

              <p className="text-slate-500 text-xs sm:text-sm font-normal mt-0.5">
                {VEHICLES.length} qualifying Japanese auction lots synced from Heiwa pipeline, with {bestMatches.length} high-margin priority lots ready for review.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => triggerAutoHubCopilot("Best Value vs NZ Market")}
                className="px-3.5 py-2 bg-[#B30D12] hover:bg-[#940B0F] text-white rounded-lg text-sm font-semibold transition-all shadow-[0_2px_8px_-1px_rgba(15,23,42,0.15)] hover:shadow-[0_4px_12px_-2px_rgba(15,23,42,0.25)] flex items-center gap-1.5 active:scale-[0.99]"
              >
                <Sparkles size={13} className="text-white" />
                <span>Ask AI Assistant</span>
              </button>
              <Link
                href="/vehicles"
                className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-[#B30D12] border border-slate-200/90 hover:border-[#B30D12]/30 rounded-lg text-sm font-semibold transition-all shadow-[0_1px_3px_rgba(15,23,42,0.04)] hover:shadow-[0_3px_8px_-1px_rgba(15,23,42,0.08)] flex items-center gap-1"
              >
                <span>Browse All ({VEHICLES.length})</span>
                <ArrowRight size={12} className="text-slate-400" />
              </Link>
            </div>
          </div>

          {/* Top 3 Compact KPIs with Soft Shadows */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
            {/* KPI 1: Best Matches */}
            <div className="bg-white p-4 sm:p-4.5 rounded-xl border border-slate-200/80 shadow-[0_2px_10px_-2px_rgba(15,23,42,0.05),0_1px_3px_rgba(15,23,42,0.02)] hover:shadow-[0_6px_16px_-3px_rgba(15,23,42,0.08),0_2px_6px_rgba(15,23,42,0.03)] hover:border-slate-300/80 transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Best Matches for You
                </span>
                <div className="w-7 h-7 rounded-lg bg-red-50 text-[#B30D12] border border-red-100 flex items-center justify-center font-bold shadow-2xs">
                  <Sparkles size={14} />
                </div>
              </div>
              <div className="mt-2.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {bestMatches.length < 10 ? `0${bestMatches.length}` : bestMatches.length}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60 shadow-2xs">
                    Score 90+
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">
                  High-conviction picks with spread &gt; NZ$3,500
                </p>
              </div>
            </div>

            {/* KPI 2: Qualifying Lots */}
            <div className="bg-white p-4 sm:p-4.5 rounded-xl border border-slate-200/80 shadow-[0_2px_10px_-2px_rgba(15,23,42,0.05),0_1px_3px_rgba(15,23,42,0.02)] hover:shadow-[0_6px_16px_-3px_rgba(15,23,42,0.08),0_2px_6px_rgba(15,23,42,0.03)] hover:border-slate-300/80 transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Other Qualifying Vehicles
                </span>
                <div className="w-7 h-7 rounded-lg bg-red-50 text-[#B30D12] border border-red-100 flex items-center justify-center font-bold shadow-2xs">
                  <Car size={14} />
                </div>
              </div>
              <div className="mt-2.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {otherVehicles.length}
                  </span>
                  <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60">
                    Heiwa Live Lots
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">
                  Meeting target budget and mileage caps
                </p>
              </div>
            </div>

            {/* KPI 3: Avg Margin Opportunity */}
            <div className="bg-white p-4 sm:p-4.5 rounded-xl border border-slate-200/80 shadow-[0_2px_10px_-2px_rgba(15,23,42,0.05),0_1px_3px_rgba(15,23,42,0.02)] hover:shadow-[0_6px_16px_-3px_rgba(15,23,42,0.08),0_2px_6px_rgba(15,23,42,0.03)] hover:border-slate-300/80 transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Avg. Target Margin
                </span>
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center font-bold shadow-2xs">
                  <TrendingUp size={14} />
                </div>
              </div>
              <div className="mt-2.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 tracking-tight">
                    NZ${avgPriorityMargin.toLocaleString("en-US")}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">
                  Top tier projected dealer gross profit
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. The "Best matches for you" list (Cards with Soft Shadows) */}
        <section className="space-y-3.5">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Best matches for you
              </h2>
              <span className="px-2 py-0.5 bg-red-50 text-[#B30D12] text-[11px] font-bold rounded-md border border-red-100 shadow-2xs">
                {bestMatches.length} Priority Lots
              </span>
            </div>

            <Link
              href="/vehicles?status=Priority"
              className="text-xs font-bold text-[#B30D12] hover:text-[#8B090E] flex items-center gap-1 transition-colors"
            >
              <span>View All Priority</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="space-y-3">
            {paginatedBestMatches.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white rounded-xl border border-slate-200/80 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.06),0_1px_3px_rgba(15,23,42,0.02)] hover:shadow-[0_8px_20px_-4px_rgba(15,23,42,0.1),0_2px_6px_rgba(15,23,42,0.03)] hover:border-slate-300/90 transition-all duration-200 overflow-hidden flex flex-col sm:flex-row group"
              >
                {/* Vehicle Thumbnail with Compact Overlay */}
                <div className="w-full sm:w-[220px] md:w-[240px] h-[150px] sm:h-auto min-h-[150px] relative shrink-0 overflow-hidden bg-slate-100">
                  <img
                    src={vehicle.image}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                  {/* Auction Grade Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 bg-black/75 backdrop-blur-xs text-white font-bold text-[10px] rounded border border-white/20 shadow-2xs">
                      Gr {vehicle.grade} / {vehicle.interiorGrade}
                    </span>
                  </div>

                  {/* Countdown Timer */}
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-0.5 bg-[#B30D12] text-white font-bold text-[10px] rounded flex items-center gap-1 shadow-xs">
                      <Clock size={10} /> {vehicle.timeLeft}
                    </span>
                  </div>

                  {/* Auction House and Lot */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-slate-200 font-medium">
                    <span>{vehicle.auctionHouse}</span>
                    <span className="font-mono text-white font-bold">#{vehicle.lotNumber}</span>
                  </div>
                </div>

                {/* Main Vehicle Information & Pricing */}
                <div className="p-4 sm:p-4.5 flex-1 flex flex-col justify-between gap-3">
                  <div>
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#B30D12] transition-colors">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </h3>
                          <span className="px-2 py-0.5 bg-red-50 text-[#B30D12] text-[11px] font-bold rounded-md border border-red-100 shadow-2xs">
                            {vehicle.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                          {(vehicle.km).toLocaleString("en-US")} km • {vehicle.engine} • {vehicle.transmission} • {vehicle.color}
                        </p>
                      </div>

                      {/* AI Score Badge */}
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-base font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shrink-0 shadow-2xs">
                        <Sparkles size={16} className="text-emerald-600" />
                        Score {vehicle.score}
                      </span>
                    </div>

                    {/* AI Summary Note */}
                    <div className="bg-slate-50/80 rounded-lg px-3 py-1.5 border-l-2 border-[#B30D12] text-[11px] text-slate-600 leading-relaxed font-medium mt-2.5">
                      {vehicle.aiAnalysis.summary}
                    </div>

                    {/* Financial Figures Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 bg-slate-50/80 rounded-lg border border-slate-200/60 text-xs mt-2.5">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">
                          Est. Landed (NZD)
                        </span>
                        <span className="font-bold text-slate-900 text-xs mt-0.5 block">
                          NZ${(vehicle.landedNzd).toLocaleString("en-US")}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">
                          Est. NZ Retail
                        </span>
                        <span className="font-bold text-slate-900 text-xs mt-0.5 block">
                          NZ${(vehicle.estRetailNzd).toLocaleString("en-US")}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">
                          Market-Based Bid Guide
                        </span>
                        <span className="font-bold text-[#B30D12] text-xs mt-0.5 block">
                          NZ${(vehicle.maxBidNzd).toLocaleString("en-US")}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">
                          Target Margin
                        </span>
                        <span className="font-bold text-emerald-700 text-xs mt-0.5 block">
                          +NZ${(vehicle.targetMarginNzd).toLocaleString("en-US")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() =>
                        triggerAutoHubCopilot(
                          `Analyze landed margin, sheet condition, and bidding strategy for ${vehicle.year} ${vehicle.make} ${vehicle.model} (Lot #${vehicle.lotNumber})`
                        )
                      }
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-[#B30D12] transition-colors"
                    >
                      <Sparkles size={12} className="text-[#B30D12]" />
                      <span>Ask AI About This Lot</span>
                    </button>

                    <Link
                      href={`/vehicles/${vehicle.id}`}
                      className="px-3.5 py-1.5 bg-[#B30D12] hover:bg-[#940B0F] text-white text-xs font-bold rounded-lg transition-all shadow-xs hover:shadow flex items-center gap-1"
                    >
                      <span>Calculate & Bid</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Best Matches Pagination Controls */}
          {totalBestPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1.5 bg-slate-50/60 p-2.5 rounded-xl border border-slate-200/60">
              <span className="text-[11px] font-semibold text-slate-500">
                Showing <strong className="text-slate-900 font-bold">{((bestPage - 1) * BEST_PER_PAGE) + 1}–{Math.min(bestPage * BEST_PER_PAGE, bestMatches.length)}</strong> of <strong className="text-slate-900 font-bold">{bestMatches.length}</strong> priority lots
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setBestPage(Math.max(1, bestPage - 1))}
                  disabled={bestPage === 1}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold transition-all shadow-2xs flex items-center gap-0.5"
                >
                  <ChevronLeft size={13} />
                  <span>Prev</span>
                </button>

                {getPaginationPages(bestPage, totalBestPages).map((p, idx) => (
                  typeof p === "number" ? (
                    <button
                      key={idx}
                      onClick={() => setBestPage(p)}
                      className={`min-w-[28px] h-7 px-2 rounded-lg text-xs font-bold transition-all ${
                        bestPage === p
                          ? "bg-[#B30D12] text-white shadow-2xs"
                          : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs"
                      }`}
                    >
                      {p}
                    </button>
                  ) : (
                    <span key={idx} className="px-1 text-slate-400 font-bold text-xs">...</span>
                  )
                ))}

                <button
                  onClick={() => setBestPage(Math.min(totalBestPages, bestPage + 1))}
                  disabled={bestPage === totalBestPages}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold transition-all shadow-2xs flex items-center gap-0.5"
                >
                  <span>Next</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* 3. The "Other qualifying vehicles" list (Cards with Soft Shadows) */}
        <section className="space-y-3.5">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Other qualifying vehicles
              </h2>
              <span className="px-2 py-0.5 bg-red-50 text-[#B30D12] text-[11px] font-bold rounded-md border border-red-100 shadow-2xs">
                {otherVehicles.length} Qualifying Lots
              </span>
            </div>

            <Link
              href="/vehicles"
              className="text-xs font-bold text-slate-600 hover:text-[#B30D12] flex items-center gap-1 transition-colors"
            >
              <span>Explore All ({otherVehicles.length})</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {paginatedOtherVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white rounded-xl border border-slate-200/80 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.06),0_1px_3px_rgba(15,23,42,0.02)] hover:shadow-[0_8px_20px_-4px_rgba(15,23,42,0.1),0_2px_6px_rgba(15,23,42,0.03)] hover:border-slate-300/90 transition-all duration-200 p-3.5 sm:p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-3">
                    <div className="w-20 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0 relative">
                      <img
                        src={vehicle.image}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0.5 left-0.5 px-1 py-0.2 bg-black/75 text-[8px] font-bold text-white rounded">
                        Gr {vehicle.grade}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-medium text-slate-500 font-mono">
                          {vehicle.auctionHouse} #{vehicle.lotNumber}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded shadow-2xs ${vehicle.status === "Consider"
                          ? "bg-amber-50 text-amber-700 border border-amber-200/60"
                          : "bg-slate-100 text-slate-600 border border-slate-200/50"
                          }`}>
                          Score {vehicle.score}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 mt-0.5 truncate group-hover:text-[#B30D12] transition-colors">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {vehicle.badge} • {(vehicle.km).toLocaleString("en-US")} km
                      </p>
                    </div>
                  </div>

                  {/* Compact Financial Strip */}
                  <div className="grid grid-cols-3 gap-1.5 mt-3 p-2 bg-slate-50/80 rounded-lg border border-slate-200/50 text-[11px] text-center">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">Landed NZD</span>
                      <span className="font-bold text-slate-900 block mt-0.5">
                        NZ${(vehicle.landedNzd).toLocaleString("en-US")}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">Bid Guide</span>
                      <span className="font-bold text-slate-900 block mt-0.5">
                        NZ${(vehicle.maxBidNzd).toLocaleString("en-US")}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">Margin</span>
                      <span className="font-bold text-emerald-700 block mt-0.5">
                        +NZ${(vehicle.targetMarginNzd).toLocaleString("en-US")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() =>
                      triggerAutoHubCopilot(
                        `Inspect condition sheet and estimate margin for ${vehicle.year} ${vehicle.make} ${vehicle.model}`
                      )
                    }
                    className="text-[11px] font-semibold text-slate-500 hover:text-[#B30D12] transition-colors flex items-center gap-1"
                  >
                    <Sparkles size={11} className="text-[#B30D12]" />
                    <span>Quick Scan</span>
                  </button>

                  <Link
                    href={`/vehicles/${vehicle.id}`}
                    className="text-xs font-bold text-slate-800 hover:text-[#B30D12] flex items-center gap-1 transition-colors"
                  >
                    <span>Inspect Lot</span>
                    <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Other Vehicles Pagination Controls */}
          {totalOtherPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 bg-slate-50/60 p-2.5 rounded-xl border border-slate-200/60">
              <span className="text-[11px] font-semibold text-slate-500">
                Showing <strong className="text-slate-900 font-bold">{((otherPage - 1) * OTHER_PER_PAGE) + 1}–{Math.min(otherPage * OTHER_PER_PAGE, otherVehicles.length)}</strong> of <strong className="text-slate-900 font-bold">{otherVehicles.length}</strong> qualifying lots (Page {otherPage} of {totalOtherPages})
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setOtherPage(Math.max(1, otherPage - 1))}
                  disabled={otherPage === 1}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold transition-all shadow-2xs flex items-center gap-0.5"
                >
                  <ChevronLeft size={13} />
                  <span>Prev</span>
                </button>

                {getPaginationPages(otherPage, totalOtherPages).map((p, idx) => (
                  typeof p === "number" ? (
                    <button
                      key={idx}
                      onClick={() => setOtherPage(p)}
                      className={`min-w-[28px] h-7 px-2 rounded-lg text-xs font-bold transition-all ${
                        otherPage === p
                          ? "bg-[#B30D12] text-white shadow-2xs"
                          : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs"
                      }`}
                    >
                      {p}
                    </button>
                  ) : (
                    <span key={idx} className="px-1 text-slate-400 font-bold text-xs">...</span>
                  )
                ))}

                <button
                  onClick={() => setOtherPage(Math.min(totalOtherPages, otherPage + 1))}
                  disabled={otherPage === totalOtherPages}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold transition-all shadow-2xs flex items-center gap-0.5"
                >
                  <span>Next</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}

          <div className="text-center pt-1">
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#B30D12] bg-white hover:bg-slate-50 px-4 py-2 rounded-lg border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.04)] hover:shadow-[0_3px_8px_-1px_rgba(15,23,42,0.08)] transition-all"
            >
              <span>Explore all {VEHICLES.length} qualified vehicles in full live catalog</span>
              <ArrowRight size={12} className="text-slate-400" />
            </Link>
          </div>
        </section>

        {/* Small Disclaimer */}
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
