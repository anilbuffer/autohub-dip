"use client";

import React, { useState } from 'react';
import { UPCOMING_AUCTION_MATCHES, AuctionMatchVehicle } from '@/lib/demandIntelligenceData';
import { Users, Send, CheckCircle2, Clock, MapPin, ChevronRight, Sparkles, Building2, BellRing } from 'lucide-react';
import MatchedDealersDrawer from './MatchedDealersDrawer';
import { useSyncStore } from '@/lib/syncStore';

interface UpcomingAuctionMatchSectionProps {
  onNotifyToast: (msg: string) => void;
}

export default function UpcomingAuctionMatchSection({ onNotifyToast }: UpcomingAuctionMatchSectionProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<AuctionMatchVehicle | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [animatingLot, setAnimatingLot] = useState<string | null>(null);

  const { state: syncState, notifyDealersFromAdmin } = useSyncStore();

  const handleOpenDrawer = (vehicle: AuctionMatchVehicle) => {
    setSelectedVehicle(vehicle);
    setDrawerOpen(true);
  };

  const handleNotifyMatched = (vehicle: AuctionMatchVehicle, e: React.MouseEvent) => {
    e.stopPropagation();
    setAnimatingLot(vehicle.id);

    setTimeout(() => {
      setAnimatingLot(null);
      notifyDealersFromAdmin(vehicle.id, `${vehicle.year} ${vehicle.model}`, vehicle.matchedDealersCount);
      onNotifyToast(`${vehicle.matchedDealersCount} dealers notified for ${vehicle.year} ${vehicle.model}`);
    }, 450);
  };

  return (
    <div className="relative rounded-2xl bg-gradient-to-br from-white via-white to-red-50/20 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-4 sm:p-5 overflow-hidden">
      {/* Top Subtle Red Brand Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#B30D12] via-[#E23B40] to-rose-300" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200">
              Auction Dispatch
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Next USS &amp; CAA Auctions</span>
          </div>
          <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-snug">
            Upcoming Auction: Dealer Match &amp; Instant Notification
          </h3>
          <p className="text-[11px] text-slate-500 font-medium leading-normal">
            Vehicles rolling onto Japanese auction blocks tomorrow with pre-qualified NZ dealer demand.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-700 font-bold bg-white px-2.5 py-1 rounded-lg border border-red-100 shadow-2xs">
            <Clock size={12} className="text-[#B30D12]" /> Next Auction in 02h 45m
          </span>
        </div>
      </div>

      {/* Grid of Vehicles (Compact) */}
      <div className="pt-3.5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {UPCOMING_AUCTION_MATCHES.map((vehicle) => {
          const isNotified = syncState.notifiedAuctionLotIds.includes(vehicle.id);
          const isAnimating = animatingLot === vehicle.id;

          return (
            <div
              key={vehicle.id}
              className="group rounded-xl border border-slate-200/80 bg-white hover:border-red-200 hover:shadow-sm transition-all flex flex-col overflow-hidden"
            >
              {/* Image & Badges */}
              <div className="relative h-36 w-full bg-slate-100 overflow-hidden">
                <img 
                  src={vehicle.image} 
                  alt={vehicle.model}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                
                {/* Auction House & Lot Tag */}
                <div className="absolute top-2 left-2 flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-slate-900/85 text-white backdrop-blur-xs border border-white/20">
                    {vehicle.auctionHouse}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-white/95 text-slate-800 backdrop-blur-xs border border-slate-200 shadow-2xs">
                    Lot #{vehicle.lotNumber}
                  </span>
                </div>

                {/* Grade Badge */}
                <div className="absolute top-2 right-2">
                  <span className="px-1.5 py-0.2 rounded-md text-[10px] font-black bg-emerald-500 text-white shadow-2xs">
                    Grade {vehicle.grade}
                  </span>
                </div>

                {/* Time Left Pill */}
                <div className="absolute bottom-2 left-2">
                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-black/70 text-red-300 flex items-center gap-1 backdrop-blur-xs">
                    <Clock size={9} /> {vehicle.timeLeft}
                  </span>
                </div>
              </div>

              {/* Body (Compact) */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-1.5">
                    <h4 className="font-extrabold text-slate-900 text-xs sm:text-[13px] leading-snug">
                      {vehicle.year} {vehicle.model}
                    </h4>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                    {vehicle.badge} &bull; {vehicle.km.toLocaleString('en-US')} km
                  </p>

                  {/* Pricing Dual Currency */}
                  <div className="mt-2 p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">FOB PRICE</span>
                      <span className="font-black text-slate-900 text-xs sm:text-[13px]">
                        NZ${vehicle.fobPriceNzd.toLocaleString('en-US')}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">YEN (JPY)</span>
                      <span className="font-bold text-slate-700 text-[11px]">
                        ¥{vehicle.fobPriceJpy.toLocaleString('en-US')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Matched Dealers Clickable Area */}
                <div className="mt-2.5 pt-2 border-t border-slate-100">
                  <div 
                    onClick={() => handleOpenDrawer(vehicle)}
                    className="flex items-center justify-between p-1.5 rounded-lg bg-red-50/50 hover:bg-red-50 border border-red-100 cursor-pointer transition-colors group/match"
                    title="Click to view detailed list of matched dealers"
                  >
                    <div className="flex items-center gap-1.5">
                      {/* Avatar stack */}
                      <div className="flex -space-x-1 overflow-hidden">
                        <span className="inline-block h-5 w-5 rounded-full ring-1.5 ring-white bg-[#B30D12] text-white font-bold text-[8px] flex items-center justify-center">AA</span>
                        <span className="inline-block h-5 w-5 rounded-full ring-1.5 ring-white bg-slate-700 text-white font-bold text-[8px] flex items-center justify-center">HM</span>
                        <span className="inline-block h-5 w-5 rounded-full ring-1.5 ring-white bg-blue-600 text-white font-bold text-[8px] flex items-center justify-center">CC</span>
                      </div>
                      <span className="text-[11px] font-extrabold text-slate-900">
                        Matched dealers: <strong className="text-[#B30D12]">{vehicle.matchedDealersCount}</strong>
                      </span>
                    </div>
                    <ChevronRight size={13} className="text-[#B30D12] group-hover/match:translate-x-0.5 transition-transform" />
                  </div>

                  {/* Notify Button (AutoHub Brand Red Gradient) */}
                  <div className="mt-2">
                    <button
                      onClick={(e) => handleNotifyMatched(vehicle, e)}
                      disabled={isNotified || isAnimating}
                      className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isNotified
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-gradient-to-r from-[#B30D12] to-[#940B0F] hover:from-[#940B0F] hover:to-[#7A080C] text-white shadow-2xs active:scale-98'
                      }`}
                    >
                      {isNotified ? (
                        <>
                          <CheckCircle2 size={12} className="text-emerald-600" />
                          <span>{vehicle.matchedDealersCount} Dealers Notified</span>
                        </>
                      ) : (
                        <>
                          <Send size={12} className={isAnimating ? 'animate-bounce' : ''} />
                          <span>Notify matched dealers</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Slide-over Drawer for Matched Dealers */}
      <MatchedDealersDrawer
        vehicle={selectedVehicle}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onNotifyToast={onNotifyToast}
      />
    </div>
  );
}
