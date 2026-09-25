"use client";

import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Link from "next/link";
import {
  ChevronDown,
  ArrowRight,
  Sparkles,
  Clock,
  TrendingUp,
  ShieldCheck,
  Flame,
  Filter,
  CheckCircle2,
  Car,
  DollarSign,
  Layers,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { VEHICLES, GLOBAL_SETTINGS } from "@/lib/data";
import { useSyncStore } from "@/lib/syncStore";
import { triggerHeiwaCopilot } from "@/components/chat/DealerChatAssistant";

export default function Dashboard() {
  const [filterTab, setFilterTab] = useState<'all' | 'priority' | 'under20k'>('priority');
  const { state: syncState, markNotificationAsRead } = useSyncStore();

  const latestSourcingMatch = syncState.dealerNotifications.find(n => n.type === 'sourcing_match');

  const filteredVehicles = VEHICLES.filter(v => {
    if (filterTab === 'priority') return v.status === 'Priority';
    if (filterTab === 'under20k') return v.landedNzd <= 20000;
    return true;
  });

  return (
    <AppLayout>
      <div className="space-y-8 pb-12">

        {/* Top Header Briefing */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#B30D12]/10 text-[#B30D12] border border-[#B30D12]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B30D12] animate-ping"></span>
                Tokyo Auctions Live
              </span>
              <span className="text-xs text-slate-400 font-medium">Updated 3 mins ago</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Good morning, David
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-0.5">
              We identified <strong className="text-slate-800">32 high-arbitrage vehicles</strong> matching Auckland Auto Group’s criteria across USS Tokyo & Yokohama.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-500 font-medium block text-[10px]">CURRENT FX BENCHMARK</span>
              <span className="font-bold text-slate-900 flex items-center gap-1 font-mono">
                1 NZD = {syncState.fxRateJpyNzd} JPY
                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1 rounded">▲ Live Feed</span>
              </span>
            </div>
            <button
              onClick={() => triggerHeiwaCopilot("Top Arbitrage Picks Today")}
              className="px-3.5 py-2.5 bg-gradient-to-r from-[#0B1322] to-[#1B2A4A] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <Sparkles size={14} className="text-[#e56168]" /> Ask AI Copilot
            </button>
            <Link
              href="/vehicles"
              className="px-4 py-2.5 bg-[#B30D12] hover:bg-[#940B0F] text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow flex items-center gap-1.5"
            >
              Browse All Lots <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Real-Time Live Sourcing Match Alert Banner from Heiwa Tokyo */}
        {latestSourcingMatch && !latestSourcingMatch.isRead && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-950 via-[#1B2A4A] to-[#0B1322] text-white border border-[#B30D12]/50 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#B30D12] text-white flex items-center justify-center shrink-0 shadow-md">
                <Sparkles size={20} className="animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="px-2 py-0.5 rounded font-black text-[10px] uppercase tracking-wider bg-white/20 text-red-200">
                    Real-Time Sourcing Alert
                  </span>
                  <span className="text-xs text-slate-300 font-medium">From Heiwa Auto Japan Desk</span>
                </div>
                <h4 className="font-black text-sm sm:text-base text-white">
                  {latestSourcingMatch.title}
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  {latestSourcingMatch.body}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
              <Link
                href="/vehicles"
                onClick={() => markNotificationAsRead(latestSourcingMatch.id)}
                className="px-4 py-2 bg-[#B30D12] hover:bg-[#8B090E] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>Inspect Lot & Landed Cost</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        )}

        {/* 4 Premium KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: Priority Buys */}
          <div className="bg-gradient-to-br from-white to-emerald-50/30 p-5 sm:p-6 rounded-2xl border border-emerald-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover-lift">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Priority Buys</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                <Flame size={16} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-black text-emerald-700 tracking-tight">06</span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded">Spread &gt; NZ$3.5k</span>
            </div>
            <p className="text-xs text-slate-600 mt-2 font-medium">Top 15% estimated dealer margin</p>
          </div>

          {/* Card 2: Qualified Lots */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover-lift">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Qualified Lots</span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#1B2A4A] flex items-center justify-center font-bold text-xs">
                <Car size={16} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900 tracking-tight">32</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+5 today</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">Matching Auckland target models</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover-lift">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Median Landed Cost</span>
              <div className="w-8 h-8 rounded-lg bg-[#1B2A4A]/10 text-[#1B2A4A] flex items-center justify-center font-bold text-xs">
                <DollarSign size={16} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900 tracking-tight">NZ$18,450</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">~NZ$4,800 below NZ yard retail avg</p>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover-lift">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Turnaround Velocity</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                <TrendingUp size={16} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900 tracking-tight">28 days</span>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">Fast-moving</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">Auckland hybrid listing turnaround</p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Recommended Vehicles Column (2 Spans) */}
          <div className="lg:col-span-2 space-y-5">
            {/* Sub-header with Filter Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  High-Margin Recommended Lots
                </h2>
                <span className="px-2 py-0.5 bg-red-600 text-white text-sm font-bold rounded-lg">
                  {filteredVehicles.length}
                </span>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setFilterTab('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${filterTab === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                  All Lots
                </button>
                <button
                  onClick={() => setFilterTab('under20k')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${filterTab === 'under20k'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                  Under NZ$20k
                </button>
                <button
                  onClick={() => setFilterTab('priority')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${filterTab === 'priority'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                  Priority Buys (Score 90+)
                </button>
              </div>
            </div>

            {/* Vehicle Cards List */}
            <div className="space-y-4">
              {filteredVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col md:flex-row hover-lift group"
                >
                  {/* Vehicle Image with Floating Badges */}
                  <div className="w-full md:w-[260px] h-[200px] md:h-auto relative shrink-0 overflow-hidden bg-slate-100">
                    <img
                      src={vehicle.image}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

                    {/* Top Grade Stamp */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 bg-[#0B1322]/90 backdrop-blur-md text-white font-extrabold text-[11px] rounded-md border border-white/20 shadow-sm">
                        GRADE {vehicle.grade} / {vehicle.interiorGrade}
                      </span>
                    </div>

                    {/* Time Left Badge */}
                    <div className="absolute top-2.5 right-2.5">
                      <span className="px-2 py-0.5 bg-[#B30D12] text-white font-bold text-[10px] rounded-md flex items-center gap-1 shadow-sm">
                        <Clock size={10} /> {vehicle.timeLeft}
                      </span>
                    </div>

                    {/* Bottom Lot and House */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-slate-200 font-medium">
                      <span>{vehicle.auctionHouse}</span>
                      <span className="font-mono text-white">#{vehicle.lotNumber}</span>
                    </div>
                  </div>

                  {/* Vehicle Content & Financial Stack */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-black text-slate-900 group-hover:text-[#B30D12] transition-colors">
                              {vehicle.year} {vehicle.make} {vehicle.model}
                            </h3>
                            <span className="text-xs font-semibold text-slate-500">
                              {vehicle.badge}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-slate-500 mt-0.5">
                            {(vehicle.km).toLocaleString('en-US')} km • {vehicle.engine} • {vehicle.color}
                          </p>
                        </div>

                        {/* AI Score Badge */}
                        <div className="text-right shrink-0">
                          <span className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-lg font-extrabold ${vehicle.status === 'Priority'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : vehicle.status === 'Consider'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                            <Sparkles size={16} />
                            Score {vehicle.score}
                          </span>
                        </div>
                      </div>

                      {/* Pricing Grid */}
                      <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">FOB (Tokyo)</span>
                          <span className="font-bold text-slate-800 text-sm font-mono mt-0.5 block">
                            ¥{(vehicle.fobJpy).toLocaleString('en-US')}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Est. Landed (NZD)</span>
                          <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                            NZ${(vehicle.landedNzd).toLocaleString('en-US')}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Est. NZ Retail</span>
                          <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                            NZ${(vehicle.estRetailNzd).toLocaleString('en-US')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-4 mt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recommended Max Bid</div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-black text-[#B30D12]">
                            NZ${(vehicle.maxBidNzd).toLocaleString('en-US')}
                          </span>
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                            +NZ${(vehicle.targetMarginNzd).toLocaleString('en-US')} Margin
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/vehicles/${vehicle.id}`}
                          className="px-4 py-2 bg-[#1B2A4A] hover:bg-[#111C30] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                        >
                          Calculate & Bid <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-2">
              <Link
                href="/vehicles"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#B30D12] hover:text-[#940B0F] bg-red-50 hover:bg-red-100/80 px-5 py-2.5 rounded-xl border border-red-200 transition-colors"
              >
                View all 32 Live Auction Lots <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Right Column: Opportunity Overview & Intelligence (1 Span) */}
          <div className="space-y-6">

            {/* Opportunity Radar Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-black text-slate-900 tracking-tight">
                  Opportunity Arbitrage
                </h2>
                <span className="text-xs font-bold text-slate-400">Total: 32</span>
              </div>

              {/* Minimalist SVG Gauge */}
              <div className="flex justify-center my-6">
                <div className="relative w-40 h-40">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#E2E8F0" strokeWidth="16" />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#10B981"
                      strokeWidth="16"
                      strokeDasharray="238.7"
                      strokeDashoffset="180"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#F59E0B"
                      strokeWidth="16"
                      strokeDasharray="238.7"
                      strokeDashoffset="110"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-3xl font-black text-slate-900 leading-none">32</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Live Matches</span>
                  </div>
                </div>
              </div>

              {/* Status Breakdown */}
              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="font-bold text-slate-800">Priority Buys (Score 90+)</span>
                  </div>
                  <div className="font-black text-emerald-700">06 Lots</div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50/50 border border-amber-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span className="font-bold text-slate-800">Consider (Score 75-89)</span>
                  </div>
                  <div className="font-black text-amber-700">14 Lots</div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                    <span className="font-bold text-slate-600">Review / Under Target</span>
                  </div>
                  <div className="font-black text-slate-700">12 Lots</div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mb-3">
                  <ShieldCheck size={14} className="text-[#1B2A4A] shrink-0" />
                  <span>Based on Auckland Auto Group margin criteria (&gt;NZ$3,500 target).</span>
                </div>
                <Link
                  href="/profile"
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors block text-center"
                >
                  Adjust Buying Preferences
                </Link>
              </div>
            </div>

            {/* Live Auction Session Card */}
            <div className="bg-[#0B1322] text-white rounded-2xl border border-[#1B2A4A] p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#B30D12] animate-pulse"></span>
                  Live Auction Lane
                </span>
                <span className="text-xs text-slate-400 font-mono">Tokyo (JST)</span>
              </div>
              <h3 className="text-base font-black text-white">USS Tokyo Premier Lane</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Lane 3 bidding closes in <strong>02 hours 45 mins</strong>. 8 Priority hybrid units are scheduled in this block.
              </p>

              <div className="mt-5 space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-[#1B2A4A] text-slate-300">
                  <span className="text-slate-400">Lot #40822 (Aqua S)</span>
                  <span className="font-bold text-emerald-400 font-mono">¥1,420,000 Target</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#1B2A4A] text-slate-300">
                  <span className="text-slate-400">Lot #18940 (Fit e:HEV)</span>
                  <span className="font-bold text-emerald-400 font-mono">¥1,350,000 Target</span>
                </div>
                <div className="flex justify-between py-1.5 text-slate-300">
                  <span className="text-slate-400">Lot #77215 (C-HR LED)</span>
                  <span className="font-bold text-emerald-400 font-mono">¥1,680,000 Target</span>
                </div>
              </div>

              <div className="mt-5 pt-3">
                <Link
                  href="/vehicles"
                  className="w-full py-2.5 bg-[#B30D12] hover:bg-[#940B0F] text-white text-xs font-bold rounded-xl transition-all shadow-sm block text-center"
                >
                  Open Live Auction Bidding Feed
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </AppLayout>
  );
}
