"use client";

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Send, 
  Ship, 
  Warehouse, 
  Sparkles, 
  MapPin, 
  Clock, 
  DollarSign, 
  Building2, 
  SlidersHorizontal,
  ChevronRight,
  Anchor,
  Compass,
  ArrowRight,
  Zap,
  Info
} from 'lucide-react';
import { 
  IN_TRANSIT_RORO_SHIPMENTS, 
  MULTI_TIER_SUPPLY_MATCHES, 
  MultiTierSupplyMatch, 
  InTransitRoRoShipment 
} from '@/lib/demandIntelligenceData';
import { useSyncStore } from '@/lib/syncStore';

interface SupplyMatchingEngineProps {
  onNotifyToast: (msg: string) => void;
}

export default function SupplyMatchingEngine({ onNotifyToast }: SupplyMatchingEngineProps) {
  const [selectedTier, setSelectedTier] = useState<'All' | 'Yard Stock' | 'In-Transit Ro-Ro' | 'Upcoming Auction'>('All');
  const [minMatchScore, setMinMatchScore] = useState<number>(90);
  const [allocatingMatchId, setAllocatingMatchId] = useState<string | null>(null);
  const [allocatedIds, setAllocatedIds] = useState<string[]>([]);
  const [notifiedIds, setNotifiedIds] = useState<string[]>([]);

  const { notifyDealersFromAdmin } = useSyncStore();

  const filteredMatches = MULTI_TIER_SUPPLY_MATCHES.filter(m => {
    if (selectedTier !== 'All' && m.supplyTier !== selectedTier) return false;
    if (m.matchScore < minMatchScore) return false;
    return true;
  });

  const handleNotify = (match: MultiTierSupplyMatch) => {
    if (!notifiedIds.includes(match.id)) {
      setNotifiedIds(prev => [...prev, match.id]);
      notifyDealersFromAdmin(match.id, match.supplyAssetTitle, 1);
      onNotifyToast(`Notification sent to ${match.dealerName} for ${match.supplyAssetTitle}`);
    }
  };

  const handlePreAllocate = (match: MultiTierSupplyMatch) => {
    setAllocatingMatchId(match.id);
    setTimeout(() => {
      setAllocatingMatchId(null);
      setAllocatedIds(prev => [...prev, match.id]);
      onNotifyToast(`Pre-allocated ${match.supplyAssetTitle} on ${match.supplyIdentifier} for ${match.dealerName}`);
    }, 400);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      
      {/* 1. Header & Three-Tier Supply Pipeline Status Bar (Light Red Brand Gradient, Compact) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-50/70 via-rose-50/40 to-white border border-red-200/80 shadow-[0_2px_10px_-2px_rgba(179,13,18,0.05),0_1px_3px_rgba(0,0,0,0.02)] p-4 sm:p-4.5">
        {/* Top Brand Crimson Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#B30D12] via-[#E23B40] to-rose-400" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3.5 border-b border-red-100/90">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-100 text-[#B30D12] border border-red-200">
                Supply Matching Matrix
              </span>
              <span className="text-[10px] text-slate-400 font-medium">AutoHub 3-Tier Supply Engine</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
              Matched Against Supply: Yard Stock, Ro-Ro In-Transit &amp; Live Auctions
            </h3>
            <p className="text-[11px] text-slate-600 font-medium mt-0.5">
              Connecting qualified dealer demand signals to vehicles across all 3 stages of the AutoHub supply chain.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3 py-1.5 rounded-xl bg-white border border-red-200/80 text-xs shadow-2xs">
              <span className="text-slate-400 text-[9px] font-bold uppercase tracking-wider block">High Match Quality</span>
              <span className="text-xs sm:text-sm font-black text-slate-900">{filteredMatches.length} Opportunities</span>
            </div>
          </div>
        </div>

        {/* 3-Tier Supply Pipeline Summary Cards (Compact) */}
        <div className="pt-3.5 grid grid-cols-1 md:grid-cols-3 gap-3">
          
          {/* Tier 1: Local Yard Stock */}
          <div 
            onClick={() => setSelectedTier(selectedTier === 'Yard Stock' ? 'All' : 'Yard Stock')}
            className={`p-3 rounded-xl border transition-all cursor-pointer ${
              selectedTier === 'Yard Stock'
                ? 'bg-blue-50/70 border-blue-500 shadow-2xs ring-1 ring-blue-500/20'
                : 'bg-white/80 border-red-100/80 hover:bg-white hover:border-red-200 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <Warehouse size={13} />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Tier 1</span>
                  <h4 className="text-xs font-black text-slate-900">Yard Stock (NZ)</h4>
                </div>
              </div>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-blue-100 text-blue-800">
                Immediate
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-black text-slate-900">57</span>
              <span className="text-[10px] text-slate-500 font-medium">units ready in Auckland/Penrose</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5 truncate">
              Zero shipping wait. Instant settlement &amp; delivery.
            </p>
          </div>

          {/* Tier 2: In-Transit Ro-Ro Ships */}
          <div 
            onClick={() => setSelectedTier(selectedTier === 'In-Transit Ro-Ro' ? 'All' : 'In-Transit Ro-Ro')}
            className={`p-3 rounded-xl border transition-all cursor-pointer ${
              selectedTier === 'In-Transit Ro-Ro'
                ? 'bg-amber-50/70 border-amber-500 shadow-2xs ring-1 ring-amber-500/20'
                : 'bg-white/80 border-red-100/80 hover:bg-white hover:border-red-200 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Ship size={13} />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Tier 2</span>
                  <h4 className="text-xs font-black text-slate-900">In-Transit Ro-Ro (At Sea)</h4>
                </div>
              </div>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800">
                8–24 Days
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-black text-slate-900">382</span>
              <span className="text-[10px] text-slate-500 font-medium">units on 3 Ro-Ro vessels</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5 truncate">
              Pre-allocate before port arrival to lock in margin.
            </p>
          </div>

          {/* Tier 3: Japanese Auction Pipeline */}
          <div 
            onClick={() => setSelectedTier(selectedTier === 'Upcoming Auction' ? 'All' : 'Upcoming Auction')}
            className={`p-3 rounded-xl border transition-all cursor-pointer ${
              selectedTier === 'Upcoming Auction'
                ? 'bg-red-50/70 border-[#B30D12] shadow-2xs ring-1 ring-[#B30D12]/20'
                : 'bg-white/80 border-red-100/80 hover:bg-white hover:border-red-200 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-red-100 text-[#B30D12] flex items-center justify-center font-bold">
                  <Compass size={13} />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Tier 3</span>
                  <h4 className="text-xs font-black text-slate-900">Live Japan Auctions</h4>
                </div>
              </div>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-red-100 text-[#B30D12]">
                Next 48 Hours
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-black text-slate-900">1,420</span>
              <span className="text-[10px] text-slate-500 font-medium">lots at USS &amp; CAA</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5 truncate">
              Direct auction bidding with pre-cleared dealer demand.
            </p>
          </div>

        </div>
      </div>

      {/* 2. Active Ro-Ro Ships Strip (Light Red/Cyan Gradient, Compact) */}
      {(selectedTier === 'All' || selectedTier === 'In-Transit Ro-Ro') && (
        <div className="p-3.5 sm:p-4 bg-gradient-to-r from-red-50/80 via-rose-50/50 to-blue-50/30 rounded-2xl border border-red-200/80 text-slate-900 shadow-2xs">
          <div className="flex items-center justify-between pb-2.5 border-b border-red-100">
            <div className="flex items-center gap-1.5">
              <Anchor size={14} className="text-[#B30D12]" />
              <h4 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                Live Ro-Ro Vessel Tracking (Japan &rarr; New Zealand Fleet)
              </h4>
            </div>
            <span className="text-[10px] text-[#B30D12] font-bold">
              3 Vessels Sailing &bull; 81 Unreserved Units Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-2.5">
            {IN_TRANSIT_RORO_SHIPMENTS.map((vessel) => (
              <div 
                key={vessel.id}
                className="p-3 rounded-xl bg-white border border-red-100 shadow-2xs text-xs hover:border-red-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-slate-900 text-xs sm:text-[13px]">
                    {vessel.vesselName}
                  </span>
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-blue-100 text-blue-900 border border-blue-200">
                    ETA {vessel.daysToArrival} Days
                  </span>
                </div>

                <div className="text-[10px] text-slate-600 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span>Route:</span>
                    <span className="font-semibold text-slate-800">{vessel.originPort} &rarr; {vessel.destinationPort}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>ETA:</span>
                    <span className="text-blue-700 font-mono font-bold">{vessel.etaDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Units:</span>
                    <span className="font-bold text-slate-900">{vessel.totalUnitsOnboard} onboard</span>
                  </div>
                </div>

                {/* Top Manifest Models */}
                <div className="mt-2 pt-1.5 border-t border-slate-100">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">
                    Unallocated Manifest:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {vessel.manifestModels.map((m, idx) => (
                      <span key={idx} className="px-1.5 py-0.2 rounded bg-slate-50 border border-slate-200 text-[9px] text-slate-700">
                        {m.model}: <strong className="text-emerald-700 font-bold">{m.availableUnreserved}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Multi-Tier Supply Matching Table & Cards */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-5 sm:p-6">
        
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
          <div>
            <h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Pre-Qualified Demand Match Opportunities
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Showing supply assets matched against specific NZ dealer purchase criteria with 90%+ confidence.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Pills */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
              {(['All', 'Yard Stock', 'In-Transit Ro-Ro', 'Upcoming Auction'] as const).map(tier => (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    selectedTier === tier
                      ? 'bg-white text-slate-900 shadow-2xs font-black'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Match Cards Grid */}
        <div className="pt-5 space-y-4">
          {filteredMatches.map((match) => {
            const isAllocated = allocatedIds.includes(match.id) || match.status === 'Pre-Allocated';
            const isNotified = notifiedIds.includes(match.id) || match.status === 'Dealer Notified';
            const isAllocating = allocatingMatchId === match.id;

            return (
              <div
                key={match.id}
                className="p-3.5 sm:p-4 rounded-xl border border-slate-200/90 hover:border-red-200 bg-white hover:shadow-sm transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-3.5"
              >
                {/* Left Side: Vehicle Image & Supply Asset Details */}
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <div className="w-16 h-14 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200 relative">
                    <img 
                      src={match.image} 
                      alt={match.supplyAssetTitle} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-1 left-1">
                      <span className={`px-1 py-0.2 rounded text-[8.5px] font-black uppercase tracking-wider text-white shadow-xs ${
                        match.supplyTier === 'Yard Stock' 
                          ? 'bg-blue-600' 
                          : match.supplyTier === 'In-Transit Ro-Ro' 
                          ? 'bg-amber-600' 
                          : 'bg-[#B30D12]'
                      }`}>
                        {match.supplyTier === 'Yard Stock' ? 'Yard' : match.supplyTier === 'In-Transit Ro-Ro' ? 'Ro-Ro' : 'Auction'}
                      </span>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h5 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                        {match.supplyAssetTitle}
                      </h5>
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-800">
                        {match.matchScore}% Match
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium mt-0.5">
                      <span className="font-semibold text-slate-800">{match.supplyIdentifier}</span>
                      <span>&bull;</span>
                      <span>Grade {match.grade}</span>
                      <span>&bull;</span>
                      <span>{match.km.toLocaleString()} km</span>
                      <span>&bull;</span>
                      <span className="text-slate-600 font-bold">{match.supplyLocation}</span>
                    </div>

                    <div className="mt-1 text-[11px] flex items-center gap-2.5">
                      <span className="text-slate-500 font-medium">
                        Landed: <strong className="text-slate-900 font-bold">NZ${match.landedCostNzd.toLocaleString()}</strong>
                      </span>
                      <span className="text-emerald-800 font-extrabold">
                        +NZ${match.estimatedMarginNzd.toLocaleString()} Margin
                      </span>
                    </div>
                  </div>
                </div>

                {/* Center / Right: Matched Dealer Info & Criteria */}
                <div className="lg:w-72 p-2.5 bg-slate-50/90 rounded-lg border border-slate-200/70 text-xs shrink-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-slate-900 flex items-center gap-1 text-[11px]">
                      <Building2 size={11} className="text-[#B30D12]" />
                      {match.dealerName}
                    </span>
                    <span className="text-[9px] text-slate-500 font-medium">{match.region}</span>
                  </div>

                  <p className="text-[10px] text-slate-600 font-normal leading-normal line-clamp-2">
                    &ldquo;{match.wishlistCriteria}&rdquo;
                  </p>

                  <div className="mt-1 pt-1 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-500">
                    <span>Budget: <strong>NZ${match.targetBudgetNzd.toLocaleString()}</strong></span>
                    <span className="text-emerald-800 font-bold">In Budget (+NZ${match.targetBudgetNzd - match.landedCostNzd})</span>
                  </div>
                </div>

                {/* Actions Button Strip */}
                <div className="flex items-center gap-1.5 shrink-0 self-end lg:self-center">
                  
                  {/* If In-Transit Ro-Ro, allow Pre-Allocating */}
                  {match.supplyTier === 'In-Transit Ro-Ro' && (
                    <button
                      onClick={() => handlePreAllocate(match)}
                      disabled={isAllocated || isAllocating}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        isAllocated
                          ? 'bg-amber-100 text-amber-800 border border-amber-300 pointer-events-none'
                          : 'bg-amber-500 hover:bg-amber-600 text-white shadow-2xs'
                      }`}
                    >
                      <Ship size={12} />
                      <span>{isAllocated ? 'Pre-Allocated' : isAllocating ? 'Allocating...' : 'Pre-Allocate'}</span>
                    </button>
                  )}

                  {/* Notify Dealer Action */}
                  <button
                    onClick={() => handleNotify(match)}
                    disabled={isNotified}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs ${
                      isNotified
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 pointer-events-none'
                        : 'bg-gradient-to-r from-[#B30D12] to-[#940B0F] hover:from-[#940B0F] hover:to-[#7A080C] text-white active:scale-98'
                    }`}
                  >
                    {isNotified ? (
                      <>
                        <CheckCircle2 size={12} />
                        <span>Notified</span>
                      </>
                    ) : (
                      <>
                        <Send size={12} />
                        <span>Notify Dealer</span>
                      </>
                    )}
                  </button>

                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
