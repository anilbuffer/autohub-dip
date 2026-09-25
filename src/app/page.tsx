"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  ChevronRight,
  SlidersHorizontal,
  X,
  CheckCircle2
} from "lucide-react";
import { VEHICLES } from "@/lib/data";
import { useSyncStore } from "@/lib/syncStore";
import { triggerAutoHubCopilot } from "@/components/chat/DealerChatAssistant";
import PreferencesLoginPromptModal from "@/components/dealer/PreferencesLoginPromptModal";

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

  const [showPreferencesPrompt, setShowPreferencesPrompt] = useState(false);
  const [rerunNotification, setRerunNotification] = useState<string | null>(null);

  // Check on mount if user just logged in or is starting session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const isFromLogin = urlParams.get("login") === "true";
      const loginSessionFlag = sessionStorage.getItem("autohub_prompt_preferences_on_login");
      const alreadyDismissed = sessionStorage.getItem("autohub_preferences_dismissed_session");

      if (isFromLogin || loginSessionFlag === "true" || !alreadyDismissed) {
        setShowPreferencesPrompt(true);
        sessionStorage.removeItem("autohub_prompt_preferences_on_login");
        sessionStorage.setItem("autohub_preferences_dismissed_session", "true");
        if (isFromLogin) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    }
  }, []);

  // Dynamically re-run vehicle matches against dealer's active criteria
  const { bestMatches, otherVehicles } = useMemo(() => {
    const preferredModels = (syncState.dealerModels || []).map(m => m.toLowerCase());
    const preferredMakes = (syncState.dealerMakes || []).map(m => m.toLowerCase());
    const maxBudget = syncState.dealerTargetBudget || 26000;
    const minMargin = syncState.dealerTargetMargin || 3500;
    const maxKm = syncState.dealerMaxKm || 75000;

    const scoredVehicles = VEHICLES.map(v => {
      const landed = Math.round(((v.fobJpy / syncState.fxRateJpyNzd) + syncState.freightPerUnitNzd + syncState.compliancePerUnitNzd) * 1.15);
      const margin = Math.max(1500, v.estRetailNzd - landed);

      const matchesModel = preferredModels.some(m => v.model.toLowerCase().includes(m));
      const matchesMake = preferredMakes.length === 0 || preferredMakes.includes(v.make.toLowerCase());
      const matchesBudget = landed <= maxBudget * 1.25;
      const matchesKm = v.km <= maxKm * 1.25;
      const matchesMargin = margin >= minMargin * 0.8;

      let matchScore = v.score;
      if (matchesModel) matchScore += 10;
      if (matchesMake) matchScore += 4;
      if (matchesBudget) matchScore += 4;
      if (matchesMargin) matchScore += 6;

      const isPriority = (matchesModel || (matchesMake && matchesMargin)) && matchesBudget;

      return {
        ...v,
        dynamicLanded: landed,
        dynamicMargin: margin,
        matchScore,
        isPriority
      };
    });

    const priorityMatches = scoredVehicles.filter(v => v.isPriority).sort((a, b) => b.matchScore - a.matchScore);
    const qualifyingVehicles = scoredVehicles.filter(v => !v.isPriority).sort((a, b) => b.matchScore - a.matchScore);

    if (priorityMatches.length === 0) {
      return {
        bestMatches: VEHICLES.filter((v) => v.status === "Priority").sort((a, b) => b.score - a.score),
        otherVehicles: VEHICLES.filter((v) => v.status !== "Priority").sort((a, b) => b.score - a.score)
      };
    }

    return {
      bestMatches: priorityMatches,
      otherVehicles: qualifyingVehicles
    };
  }, [syncState]);

  const avgPriorityMargin = Math.round(
    bestMatches.reduce((acc, v) => acc + (v.targetMarginNzd || 3500), 0) / (bestMatches.length || 1)
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

  const handleMatchesRecalculated = (newCount: number) => {
    setBestPage(1);
    setOtherPage(1);
    setRerunNotification(`Weekly preferences updated! Re-ran matching across ${VEHICLES.length} auction lots (${bestMatches.length} priority matches ready).`);
    setTimeout(() => {
      setRerunNotification(null);
    }, 5500);
  };

  return (
    <AppLayout>
      {/* Weekly Preferences Login Prompt Modal */}
      <PreferencesLoginPromptModal
        isOpen={showPreferencesPrompt}
        onClose={() => setShowPreferencesPrompt(false)}
        onMatchesReCalculated={handleMatchesRecalculated}
      />

      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-7 pb-10 pt-1">

        {/* Dynamic Match Re-run Toast */}
        {rerunNotification && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-emerald-600" />
              <span>{rerunNotification}</span>
            </div>
            <button onClick={() => setRerunNotification(null)} className="text-emerald-600 hover:text-emerald-900 cursor-pointer">
              <X size={14} />
            </button>
          </div>
        )}

        {/* 1. Greeting and Top KPIs (Compact & Light Theme with Soft Shadows) */}
        <section className="space-y-4">
          {/* Enhanced Greeting Header Card */}
          <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.06),0_1px_3px_rgba(15,23,42,0.03)] p-5 sm:p-6 transition-all">
            {/* Subtle Brand Crimson Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#B30D12] via-[#E23B40] to-rose-400/20" />

            {/* Ambient Background Glow (Subtle Depth) */}
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-gradient-to-br from-rose-500/[0.04] to-transparent blur-3xl pointer-events-none" />

            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2.5">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/90 border border-slate-200/80 text-[11px] font-semibold text-slate-700 shadow-2xs">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B30D12] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B30D12]"></span>
                    </span>
                    Auckland Auto Group
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-[11px] text-amber-600 font-medium shadow-2xs">
                    <span className="text-amber-600">Live FX:</span>
                    <strong className="font-mono text-amber-800 font-bold">1 NZD = {syncState.fxRateJpyNzd} JPY</strong>
                  </span>
                  <button
                    onClick={() => setShowPreferencesPrompt(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 hover:bg-red-100 text-[11px] font-semibold text-red-600 hover:text-red-900 transition-colors cursor-pointer border border-red-200/80 hover:border-red-300 shadow-2xs group"
                    title="Review or update this week's buying criteria"
                  >
                    <SlidersHorizontal size={11} className="text-[#B30D12] transition-transform group-hover:rotate-45" />
                    <span>Update Preferences</span>
                  </button>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Good morning, David
                </h1>

                <p className="text-slate-500 text-xs sm:text-sm font-normal mt-1 leading-relaxed max-w-3xl">
                  <span className="font-semibold text-slate-700">{VEHICLES.length} qualifying Japanese auction lots</span> synced from Heiwa pipeline, with{" "}
                  <span className="font-semibold text-[#B30D12]">{bestMatches.length} high-margin priority lots</span> ready for review.
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
                <button
                  onClick={() => triggerAutoHubCopilot("I have $200k, prefer Toyota, 3 years old or newer. What fits?")}
                  className="px-4 py-2.5 bg-[#B30D12] hover:bg-[#940B0F] text-white rounded-xl text-sm font-semibold transition-all shadow-[0_2px_8px_-1px_rgba(179,13,18,0.3)] hover:shadow-[0_4px_14px_-2px_rgba(179,13,18,0.4)] flex items-center gap-2 active:scale-[0.99] cursor-pointer"
                  title="Try budget allocation query"
                >
                  <Sparkles size={14} className="text-white" />
                  <span>Ask AI Copilot</span>
                </button>
                <Link
                  href="/vehicles"
                  className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/90 hover:border-slate-300 rounded-xl text-sm font-semibold transition-all shadow-2xs hover:shadow-xs flex items-center gap-1.5 group"
                >
                  <span>Browse All ({VEHICLES.length})</span>
                  <ArrowRight size={13} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* Top 3 Compact KPIs with Soft Shadows */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
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

        {/* 2. The "Best matches for you" Section - Unified Card Container */}
        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.06),0_1px_3px_rgba(15,23,42,0.02)] overflow-hidden">
          {/* Card Header */}
          <div className="px-4 py-3.5 sm:px-6 sm:py-4.5 border-b border-slate-100 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-[#B30D12] border border-red-100 flex items-center justify-center shrink-0 shadow-2xs">
                <Sparkles size={16} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    Best matches for you
                  </h2>
                  <span className="px-2 py-0.5 bg-red-50 text-[#B30D12] text-[11px] font-bold rounded-md border border-red-100 shadow-2xs">
                    {bestMatches.length} Priority Lots
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
                  Japanese auction lots prioritized for highest dealer gross margin &amp; criteria match
                </p>
              </div>
            </div>

            <Link
              href="/vehicles?status=Priority"
              className="text-xs font-bold text-[#B30D12] hover:text-[#8B090E] bg-red-50/80 hover:bg-red-100/80 border border-red-200/80 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-2xs self-start sm:self-auto shrink-0"
            >
              <span>View All Priority</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {/* Card Body - Priority Vehicles List */}
          <div className="p-4 sm:p-5 sm:p-6 bg-slate-50 space-y-4">
            {paginatedBestMatches.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_4px_rgba(15,23,42,0.04)] hover:shadow-[0_6px_18px_-3px_rgba(15,23,42,0.08)] hover:border-slate-300/90 transition-all duration-200 overflow-hidden flex flex-col sm:flex-row group"
              >
                {/* Vehicle Thumbnail with Compact Overlay */}
                <div className="w-full sm:w-[220px] md:w-[280px] h-[160px] sm:h-auto min-h-[160px] relative shrink-0 overflow-hidden bg-slate-100">
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
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
                  <div>
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-4">
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
                    <div className="bg-slate-100/90 rounded-lg px-3 py-1.5 border-l-2 border-[#B30D12] text-[11px] text-slate-600 leading-relaxed font-medium mt-3.5">
                      {vehicle.aiAnalysis.summary}
                    </div>

                    {/* Financial Figures Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 text-xs mt-3.5">
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
                  <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-4">
                    <button
                      onClick={() =>
                        triggerAutoHubCopilot(
                          `Analyze landed margin, sheet condition, and bidding strategy for ${vehicle.year} ${vehicle.make} ${vehicle.model} (Lot #${vehicle.lotNumber})`
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold bg-red-50 hover:bg-red-100/80 text-[#B30D12] rounded-lg border border-red-200/90 transition-all cursor-pointer"
                    >
                      <Sparkles size={13} className="text-[#B30D12]" />
                      <span>Ask AI About This Lot</span>
                    </button>

                    <Link
                      href={`/vehicles/${vehicle.id}`}
                      className="px-4 py-2 bg-[#B30D12] hover:bg-[#940B0F] text-white text-xs sm:text-sm font-bold rounded-lg transition-all shadow-xs hover:shadow flex items-center gap-1.5"
                    >
                      <span>Calculate & Bid</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Card Footer - Integrated Pagination */}
          <div className="px-4 py-3 sm:px-6 sm:py-3.5 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[12px] font-semibold text-slate-500">
              Showing <strong className="text-slate-900 font-bold">{((bestPage - 1) * BEST_PER_PAGE) + 1}–{Math.min(bestPage * BEST_PER_PAGE, bestMatches.length)}</strong> of <strong className="text-slate-900 font-bold">{bestMatches.length}</strong> priority lots
            </span>

            {totalBestPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setBestPage(Math.max(1, bestPage - 1))}
                  disabled={bestPage === 1}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold transition-all shadow-2xs flex items-center gap-0.5 cursor-pointer"
                >
                  <ChevronLeft size={13} />
                  <span>Prev</span>
                </button>

                {getPaginationPages(bestPage, totalBestPages).map((p, idx) => (
                  typeof p === "number" ? (
                    <button
                      key={idx}
                      onClick={() => setBestPage(p)}
                      className={`min-w-[28px] h-7 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${bestPage === p
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
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold transition-all shadow-2xs flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* 3. The "Other qualifying vehicles" Section - Unified Card Container */}
        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.06),0_1px_3px_rgba(15,23,42,0.02)] overflow-hidden">
          {/* Card Header */}
          <div className="px-4 py-3.5 sm:px-6 sm:py-4.5 border-b border-slate-100 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-[#B30D12] border border-red-100 flex items-center justify-center shrink-0 shadow-2xs">
                <Car size={16} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    Other qualifying vehicles
                  </h2>
                  <span className="px-2 py-0.5 bg-red-50 text-[#B30D12] text-[11px] font-bold rounded-md border border-red-100 shadow-2xs">
                    {otherVehicles.length} Qualifying Lots
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
                  Japanese auction lots meeting target budget, condition grades, and mileage criteria
                </p>
              </div>
            </div>

            <Link
              href="/vehicles"
              className="text-xs font-bold text-[#B30D12] hover:text-[#8B090E] bg-red-50/80 hover:bg-red-100/80 border border-red-200/80 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-2xs self-start sm:self-auto shrink-0"
            >
              <span>Explore All ({otherVehicles.length})</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {/* Card Body - 2 Column Grid */}
          <div className="p-4 sm:p-5 sm:p-6 bg-slate-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {paginatedOtherVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_4px_rgba(15,23,42,0.04)] hover:shadow-[0_6px_18px_-3px_rgba(15,23,42,0.08)] hover:border-slate-300/90 transition-all duration-200 p-3.5 sm:p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-3">
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-slate-100 shrink-0 relative">
                        <img
                          src={vehicle.image}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-0.5 left-0.5 px-1 py-0.2 bg-black/75 text-[10px] font-bold text-white rounded">
                          Gr {vehicle.grade}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[12px] font-medium text-slate-500">
                            {vehicle.auctionHouse} #{vehicle.lotNumber}
                          </span>
                          <span className={`px-2.5 py-1 inline-flex items-center gap-1 rounded-lg text-base font-bold shadow-2xs ${vehicle.status === "Consider"
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            }`}>
                            <CheckCircle2 size={16} className="text-emerald-600" />
                            Score {vehicle.score}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 mt-0.5 truncate group-hover:text-[#B30D12] transition-colors">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                          {vehicle.badge} • {(vehicle.km).toLocaleString("en-US")} km
                        </p>
                      </div>
                    </div>

                    {/* Compact Financial Strip */}
                    <div className="grid grid-cols-3 gap-1.5 mt-3 p-2 bg-slate-50 rounded-lg border border-slate-200/70 text-[11px] text-center">
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
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-red-50 hover:bg-red-100/80 text-[#B30D12] rounded-lg border border-red-200 transition-all cursor-pointer"
                    >
                      <Sparkles size={12} className="text-[#B30D12]" />
                      <span>Quick Scan</span>
                    </button>

                    <Link
                      href={`/vehicles/${vehicle.id}`}
                      className="font-bold px-3 py-1.5 text-xs sm:text-sm bg-[#B30D12] hover:bg-[#940B0F] text-white rounded-lg flex items-center gap-1 transition-all"
                    >
                      <span>Inspect Lot</span>
                      <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card Footer - Seamless Integrated Pagination */}
          <div className="px-4 py-3 sm:px-6 sm:py-3.5 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[12px] font-semibold text-slate-500">
              Showing <strong className="text-slate-900 font-bold">{((otherPage - 1) * OTHER_PER_PAGE) + 1}–{Math.min(otherPage * OTHER_PER_PAGE, otherVehicles.length)}</strong> of <strong className="text-slate-900 font-bold">{otherVehicles.length}</strong> qualifying lots (Page {otherPage} of {totalOtherPages})
            </span>

            {totalOtherPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setOtherPage(Math.max(1, otherPage - 1))}
                  disabled={otherPage === 1}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold transition-all shadow-2xs flex items-center gap-0.5 cursor-pointer"
                >
                  <ChevronLeft size={13} />
                  <span>Prev</span>
                </button>

                {getPaginationPages(otherPage, totalOtherPages).map((p, idx) => (
                  typeof p === "number" ? (
                    <button
                      key={idx}
                      onClick={() => setOtherPage(p)}
                      className={`min-w-[28px] h-7 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${otherPage === p
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
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold transition-all shadow-2xs flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            )}
          </div>

          {/* Integrated Catalog Link Footer Strip */}
          <div className="py-2.5 px-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center text-center">
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#B30D12] hover:text-[#B30D12] transition-colors"
            >
              <span>Explore all {VEHICLES.length} qualified vehicles in full live catalog</span>
              <ArrowRight size={12} className="text-[#B30D12]" />
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
