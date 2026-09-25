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
    <div className="space-y-6">
      
      {/* 1. Header & Three-Tier Supply Pipeline Status Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                Supply Matching Matrix
              </span>
              <span className="text-xs text-slate-400 font-medium">AutoHub 3-Tier Supply Engine</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Matched Against Supply: Yard Stock, Ro-Ro In-Transit &amp; Live Auctions
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Connecting qualified dealer demand signals to vehicles across all 3 stages of the AutoHub supply chain.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Total High Matches</span>
              <span className="text-base font-black text-slate-900">{filteredMatches.length} Dealer Opportunities</span>
            </div>
          </div>
        </div>

        {/* 3-Tier Supply Pipeline Summary Cards */}
        <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Tier 1: Local Yard Stock */}
          <div 
            onClick={() => setSelectedTier(selectedTier === 'Yard Stock' ? 'All' : 'Yard Stock')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              selectedTier === 'Yard Stock'
                ? 'bg-blue-50/60 border-blue-500 shadow-sm'
                : 'bg-slate-50/70 border-slate-200/80 hover:bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <Warehouse size={15} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tier 1</span>
                  <h4 className="text-xs font-black text-slate-900">Yard Stock (NZ)</h4>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                Immediate
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-black text-slate-900">57</span>
              <span className="text-xs text-slate-500 font-medium">units ready in Auckland/Penrose</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Zero shipping wait. Instant settlement &amp; delivery.
            </p>
          </div>

          {/* Tier 2: In-Transit Ro-Ro Ships */}
          <div 
            onClick={() => setSelectedTier(selectedTier === 'In-Transit Ro-Ro' ? 'All' : 'In-Transit Ro-Ro')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              selectedTier === 'In-Transit Ro-Ro'
                ? 'bg-amber-50/60 border-amber-500 shadow-sm'
                : 'bg-slate-50/70 border-slate-200/80 hover:bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Ship size={15} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tier 2</span>
                  <h4 className="text-xs font-black text-slate-900">In-Transit Ro-Ro (At Sea)</h4>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                8–24 Days
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-black text-slate-900">382</span>
              <span className="text-xs text-slate-500 font-medium">units on 3 active Ro-Ro vessels</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Pre-allocate before port arrival to lock in dealer margin.
            </p>
          </div>

          {/* Tier 3: Japanese Auction Pipeline */}
          <div 
            onClick={() => setSelectedTier(selectedTier === 'Upcoming Auction' ? 'All' : 'Upcoming Auction')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              selectedTier === 'Upcoming Auction'
                ? 'bg-red-50/60 border-[#B30D12] shadow-sm'
                : 'bg-slate-50/70 border-slate-200/80 hover:bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-100 text-[#B30D12] flex items-center justify-center font-bold">
                  <Compass size={15} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tier 3</span>
                  <h4 className="text-xs font-black text-slate-900">Live Japan Auctions</h4>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-[#B30D12]">
                Next 48 Hours
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-black text-slate-900">1,420</span>
              <span className="text-xs text-slate-500 font-medium">candidate lots at USS &amp; CAA</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Direct auction bidding with pre-cleared dealer demand.
            </p>
          </div>

        </div>
      </div>

      {/* 2. Active Ro-Ro Ships Strip (Visible when looking at In-Transit or All) */}
      {(selectedTier === 'All' || selectedTier === 'In-Transit Ro-Ro') && (
        <div className="p-5 bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 rounded-3xl border border-blue-900/60 text-white shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Anchor size={16} className="text-cyan-400" />
              <h4 className="text-sm font-black text-white tracking-tight">
                Live Ro-Ro Vessel Tracking (Japan &rarr; New Zealand Fleet)
              </h4>
            </div>
            <span className="text-[11px] text-cyan-300 font-medium">
              3 Vessels Sailing &bull; 81 Unreserved High-Demand Units Available to Allocate
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-3.5">
            {IN_TRANSIT_RORO_SHIPMENTS.map((vessel) => (
              <div 
                key={vessel.id}
                className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs backdrop-blur-xs hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white text-sm">
                    {vessel.vesselName}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-400 text-slate-950">
                    ETA {vessel.daysToArrival} Days
                  </span>
                </div>

                <div className="text-[11px] text-slate-300 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span>Route:</span>
                    <span className="font-semibold text-white">{vessel.originPort} &rarr; {vessel.destinationPort}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>ETA Date:</span>
                    <span className="text-cyan-300 font-mono">{vessel.etaDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Onboard Units:</span>
                    <span className="font-bold text-white">{vessel.totalUnitsOnboard} total</span>
                  </div>
                </div>

                {/* Top Manifest Models */}
                <div className="mt-2.5 pt-2 border-t border-white/10">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                    Unallocated Manifest:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {vessel.manifestModels.map((m, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-white">
                        {m.model}: <strong className="text-emerald-400">{m.availableUnreserved} avail</strong>
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
                className="p-5 rounded-2xl border border-slate-200/90 hover:border-slate-300 bg-white hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                {/* Left Side: Vehicle Image & Supply Asset Details */}
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  <div className="w-20 h-18 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 relative">
                    <img 
                      src={match.image} 
                      alt={match.supplyAssetTitle} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-1 left-1">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider text-white shadow-xs ${
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
                    <div className="flex items-center gap-2 flex-wrap">
                      <h5 className="font-black text-slate-900 text-sm sm:text-base">
                        {match.supplyAssetTitle}
                      </h5>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                        {match.matchScore}% Match
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-1">
                      <span className="font-semibold text-slate-800">{match.supplyIdentifier}</span>
                      <span>&bull;</span>
                      <span>Grade {match.grade}</span>
                      <span>&bull;</span>
                      <span>{match.km.toLocaleString()} km</span>
                      <span>&bull;</span>
                      <span className="text-slate-600 font-bold">{match.supplyLocation}</span>
                    </div>

                    <div className="mt-2 text-xs flex items-center gap-3">
                      <span className="text-slate-500 font-medium">
                        Landed Cost: <strong className="text-slate-900 font-bold">NZ${match.landedCostNzd.toLocaleString()}</strong>
                      </span>
                      <span className="text-emerald-700 font-black">
                        +NZ${match.estimatedMarginNzd.toLocaleString()} Margin
                      </span>
                    </div>
                  </div>
                </div>

                {/* Center / Right: Matched Dealer Info & Criteria */}
                <div className="lg:w-80 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs shrink-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Building2 size={13} className="text-[#B30D12]" />
                      {match.dealerName}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">{match.region}</span>
                  </div>

                  <p className="text-[11px] text-slate-600 font-normal leading-relaxed line-clamp-2">
                    &ldquo;{match.wishlistCriteria}&rdquo;
                  </p>

                  <div className="mt-2 pt-1.5 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Target Budget: <strong>NZ${match.targetBudgetNzd.toLocaleString()}</strong></span>
                    <span className="text-emerald-700 font-bold">In Budget (+NZ${match.targetBudgetNzd - match.landedCostNzd})</span>
                  </div>
                </div>

                {/* Actions Button Strip */}
                <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                  
                  {/* If In-Transit Ro-Ro, allow Pre-Allocating */}
                  {match.supplyTier === 'In-Transit Ro-Ro' && (
                    <button
                      onClick={() => handlePreAllocate(match)}
                      disabled={isAllocated || isAllocating}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isAllocated
                          ? 'bg-amber-100 text-amber-800 border border-amber-300 pointer-events-none'
                          : 'bg-amber-500 hover:bg-amber-600 text-white shadow-2xs'
                      }`}
                    >
                      <Ship size={13} />
                      <span>{isAllocated ? 'Pre-Allocated' : isAllocating ? 'Allocating...' : 'Pre-Allocate Ro-Ro'}</span>
                    </button>
                  )}

                  {/* Notify Dealer Action */}
                  <button
                    onClick={() => handleNotify(match)}
                    disabled={isNotified}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isNotified
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 pointer-events-none'
                        : 'bg-[#B30D12] hover:bg-[#940B0F] text-white shadow-2xs'
                    }`}
                  >
                    {isNotified ? (
                      <>
                        <CheckCircle2 size={13} />
                        <span>Dealer Notified</span>
                      </>
                    ) : (
                      <>
                        <Send size={13} />
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
