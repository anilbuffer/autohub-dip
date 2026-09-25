"use client";

import React, { useState } from 'react';
import { 
  Radio, 
  Search, 
  Heart, 
  TrendingUp, 
  Zap, 
  ArrowUpRight, 
  Filter, 
  Sparkles, 
  Clock, 
  Building2, 
  MapPin, 
  ShieldCheck, 
  SlidersHorizontal,
  ChevronRight,
  Flame,
  Info
} from 'lucide-react';
import { 
  INGESTED_DEALER_ACTIVITIES, 
  SYNTHESIZED_DEMAND_SIGNALS, 
  IngestedDealerActivity, 
  SynthesizedDemandSignal 
} from '@/lib/demandIntelligenceData';

interface DemandSignalsEngineProps {
  onSelectSignal?: (signal: SynthesizedDemandSignal) => void;
  onFilterChange?: (segment: string) => void;
}

export default function DemandSignalsEngine({ onSelectSignal, onFilterChange }: DemandSignalsEngineProps) {
  const [filterSource, setFilterSource] = useState<'all' | 'wishlist' | 'search_spike' | 'filter_drop'>('all');
  const [selectedSignal, setSelectedSignal] = useState<SynthesizedDemandSignal>(SYNTHESIZED_DEMAND_SIGNALS[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredActivities = INGESTED_DEALER_ACTIVITIES.filter(act => {
    if (filterSource !== 'all' && act.type !== filterSource) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        act.dealerName.toLowerCase().includes(q) ||
        act.modelTarget.toLowerCase().includes(q) ||
        act.rawQueryOrCriteria.toLowerCase().includes(q) ||
        act.region.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* 1. Demand Signal Conversion Explainer Header (Light Red Brand Gradient, Compact) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-50/90 via-rose-50/60 to-white border border-red-200/80 text-slate-900 p-4 sm:p-5 shadow-[0_2px_10px_-2px_rgba(179,13,18,0.05),0_1px_3px_rgba(0,0,0,0.02)] transition-all">
        {/* Top Brand Crimson Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#B30D12] via-[#E23B40] to-rose-400" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-100 text-[#B30D12] border border-red-200 flex items-center gap-1 shadow-2xs">
                <Radio size={10} className="animate-pulse" /> Live Ingestion
              </span>
              <span className="text-[11px] text-slate-400 font-medium">AutoHub DIP Neural Engine</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight">
              Dealer Wish Lists &amp; Searches &rarr; Demand Signals
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-600 font-medium mt-0.5 leading-relaxed">
              Every keyword query, filter application, zero-result search, and structured wish list submitted by NZ dealerships is continuously ingested and weighted into verified demand signals.
            </p>
          </div>

          {/* Quick Metrics Bar (Compact, Light Brand Gradient) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 shrink-0">
            <div className="px-3 py-2 rounded-xl bg-white border border-red-200/80 shadow-2xs">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Raw Telemetry</span>
              <span className="text-base font-black text-slate-900">4,860</span>
              <span className="text-[9px] text-emerald-800 font-bold block mt-0.5 flex items-center gap-0.5">
                <ArrowUpRight size={9} /> +31% MoM
              </span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-white border border-red-200/80 shadow-2xs">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Wish List Backlog</span>
              <span className="text-base font-black text-slate-900">318 Orders</span>
              <span className="text-[9px] text-emerald-800 font-bold block mt-0.5 flex items-center gap-0.5">
                <ArrowUpRight size={9} /> 142 dealers
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1 px-3 py-2 rounded-xl bg-gradient-to-br from-red-50 to-rose-100/60 border border-red-200 shadow-2xs">
              <span className="text-[9px] text-[#B30D12] font-bold uppercase tracking-wider block">Signal Weighting</span>
              <span className="text-base font-black text-slate-900">3.0x Wishlist</span>
              <span className="text-[9px] text-[#B30D12] font-semibold block mt-0.5">1.2x Repeat Search</span>
            </div>
          </div>
        </div>

        {/* Neural Transformation Flow Bar (Compact) */}
        <div className="mt-3.5 pt-3 border-t border-red-100/90 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="flex items-start gap-2 p-2 rounded-lg bg-white/90 border border-red-100 shadow-2xs">
            <div className="w-5 h-5 rounded-md bg-blue-100 text-blue-800 flex items-center justify-center font-black text-[10px] shrink-0">1</div>
            <div className="min-w-0">
              <span className="font-extrabold text-slate-900 text-[11px] block">Wishlist Parsing</span>
              <span className="text-[10px] text-slate-500 truncate block">Grade, max km, budget</span>
            </div>
          </div>
          <div className="flex items-start gap-2 p-2 rounded-lg bg-white/90 border border-red-100 shadow-2xs">
            <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-[10px] shrink-0">2</div>
            <div className="min-w-0">
              <span className="font-extrabold text-slate-900 text-[11px] block">Search Extraction</span>
              <span className="text-[10px] text-slate-500 truncate block">Keywords &amp; zero results</span>
            </div>
          </div>
          <div className="flex items-start gap-2 p-2 rounded-lg bg-white/90 border border-red-100 shadow-2xs">
            <div className="w-5 h-5 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center font-black text-[10px] shrink-0">3</div>
            <div className="min-w-0">
              <span className="font-extrabold text-slate-900 text-[11px] block">Intent Weighting</span>
              <span className="text-[10px] text-slate-500 truncate block">Commitment multiplier</span>
            </div>
          </div>
          <div className="flex items-start gap-2 p-2 rounded-lg bg-red-100/80 border border-red-200 shadow-2xs">
            <div className="w-5 h-5 rounded-md bg-[#B30D12] text-white flex items-center justify-center font-black text-[10px] shrink-0">4</div>
            <div className="min-w-0">
              <span className="font-extrabold text-[#B30D12] text-[11px] block">Synthesized Signal</span>
              <span className="text-[10px] text-red-900 truncate block">0–100 buying priority</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Two-Column Layout: Left (Synthesized Demand Signals) + Right (Live Raw Telemetry Feed) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Synthesized Demand Signals (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Prioritized Demand Signals</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-[#B30D12]">
                  {SYNTHESIZED_DEMAND_SIGNALS.length} Top Signals
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Synthesized from active dealer demand, ranked by buying urgency and market scarcity.
              </p>
            </div>
          </div>

          <div className="space-y-3.5">
            {SYNTHESIZED_DEMAND_SIGNALS.map((signal) => {
              const isSelected = selectedSignal.id === signal.id;

              return (
                <div
                  key={signal.id}
                  onClick={() => {
                    setSelectedSignal(signal);
                    if (onSelectSignal) onSelectSignal(signal);
                  }}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-red-50/40 border-[#B30D12] shadow-md ring-1 ring-[#B30D12]/20'
                      : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Signal Score Circle */}
                      <div className="relative w-12 h-12 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center shrink-0 border border-slate-800 shadow-sm">
                        <span className="text-xs font-black leading-none text-emerald-400">
                          {signal.signalScore}
                        </span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                          SCORE
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-black text-slate-900 text-base">
                            {signal.model}
                          </h4>
                          <span className="text-xs text-slate-500 font-medium">
                            {signal.badge}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                            signal.momentumDirection === 'up'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            <Flame size={10} className="text-[#B30D12]" />
                            {signal.momentum}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                          <span>{signal.segment}</span>
                          <span>&bull;</span>
                          <span className="text-slate-700 font-semibold">{signal.fuel}</span>
                          <span>&bull;</span>
                          <span className="text-rose-600 font-bold">Unmet Deficit: -{signal.unmetDemandUnits} units</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 block">
                        +NZ${signal.avgExpectedMarginNzd.toLocaleString()} Margin
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium block mt-1">
                        Max: NZ${signal.avgTargetBudgetNzd.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Signal Ingestion Telemetry Breakdown */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">Wish Lists</span>
                      <span className="font-black text-slate-800 flex items-center gap-1">
                        <Heart size={11} className="text-[#B30D12]" /> {signal.wishlistCount} Active
                      </span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">Search Queries</span>
                      <span className="font-black text-slate-800 flex items-center gap-1">
                        <Search size={11} className="text-blue-600" /> {signal.searchQueriesCount} this wk
                      </span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">Dealers Seeking</span>
                      <span className="font-black text-slate-800 flex items-center gap-1">
                        <Building2 size={11} className="text-indigo-600" /> {signal.activeDealerCount} Yards
                      </span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">Prime Region</span>
                      <span className="font-black text-slate-800 flex items-center gap-1 truncate">
                        <MapPin size={11} className="text-amber-600" /> {signal.topRequestingRegion}
                      </span>
                    </div>
                  </div>

                  {/* Dealer Criteria Requirements Bar */}
                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-600 bg-white/80 p-2 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2 font-medium truncate">
                      <span className="text-slate-400 font-bold uppercase text-[9px]">Target Specs:</span>
                      <span>{signal.yearRange}</span>
                      <span>&bull;</span>
                      <span>&lt;{(signal.maxMileageKm / 1000).toFixed(0)}k km</span>
                      <span>&bull;</span>
                      <span className="font-bold text-slate-800">{signal.gradePreference}</span>
                    </div>
                    <span className="text-[#B30D12] font-black shrink-0 flex items-center gap-0.5">
                      Match Supply &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Raw Dealer Telemetry Stream (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-5 sm:p-6 flex flex-col h-full">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    Live Telemetry Stream
                  </h3>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Real-time dealer search logs &amp; wish list submissions.
                </p>
              </div>

              {/* Source Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
                <button
                  onClick={() => setFilterSource('all')}
                  className={`px-2 py-1 rounded-md transition-all ${
                    filterSource === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterSource('wishlist')}
                  className={`px-2 py-1 rounded-md transition-all ${
                    filterSource === 'wishlist' ? 'bg-white text-[#B30D12] shadow-2xs font-bold' : 'text-slate-500'
                  }`}
                >
                  Wishlists
                </button>
                <button
                  onClick={() => setFilterSource('search_spike')}
                  className={`px-2 py-1 rounded-md transition-all ${
                    filterSource === 'search_spike' ? 'bg-white text-blue-600 shadow-2xs font-bold' : 'text-slate-500'
                  }`}
                >
                  Searches
                </button>
              </div>
            </div>

            {/* Quick Search in stream */}
            <div className="pt-3 pb-2">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by dealer, model or region..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#B30D12]"
                />
              </div>
            </div>

            {/* Ingested Items Feed */}
            <div className="space-y-3 overflow-y-auto max-h-[560px] pr-1 pt-1">
              {filteredActivities.map((act) => {
                const isWishlist = act.type === 'wishlist';
                const isSearch = act.type === 'search_spike';
                const isDrop = act.type === 'filter_drop';

                return (
                  <div
                    key={act.id}
                    className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-slate-300 transition-all text-xs"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                          isWishlist 
                            ? 'bg-red-50 text-[#B30D12] border border-red-200' 
                            : isSearch 
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {isWishlist ? 'Wish List Order' : isSearch ? 'Search Spike' : 'Zero-Result Query'}
                        </span>
                        <span className="font-bold text-slate-800">
                          {act.dealerName}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                        <Clock size={10} /> {act.timestamp}
                      </span>
                    </div>

                    <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
                      <span>{act.modelTarget}</span>
                      <span className="text-slate-500 font-normal text-[11px]">{act.region}</span>
                    </div>

                    <p className="text-[11px] text-slate-600 font-normal leading-relaxed bg-white p-2 rounded-lg border border-slate-100">
                      &ldquo;{act.rawQueryOrCriteria}&rdquo;
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                      <span>Budget: <strong className="text-slate-800">NZ${act.targetBudgetNzd.toLocaleString()}</strong></span>
                      <span>Target Margin: <strong className="text-emerald-700 font-bold">+NZ${act.marginTargetNzd.toLocaleString()}</strong></span>
                      <span className="text-[#B30D12] font-black">Weight 3.0x</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Keyword Cluster Cloud */}
            <div className="mt-auto pt-4 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Top Dealer Search Keywords (Last 48 Hours)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'C-HR Two-Tone (680)',
                  'Vezel Sensing (540)',
                  'Aqua Grade 4.5 (890)',
                  'CX-5 AWD (420)',
                  'Note Medalist (380)',
                  'Takapuna Retail (210)',
                  'Christchurch Batch (190)',
                  'Budget <$22k (440)'
                ].map((kw, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
