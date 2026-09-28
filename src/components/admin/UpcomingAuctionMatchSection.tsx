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
      onNotifyToast(`${vehicle.matchedDealersCount} dealers notified`);
    }, 450);
  };

  return (
    <div className="relative rounded-2xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-4 sm:p-5 overflow-hidden">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
            Upcoming auction: dealer match and notify
          </h3>
          <p className="text-[11px] text-slate-500 font-medium leading-normal mt-0.5">
            Pre-qualified NZ dealer demand matched to vehicles appearing in tomorrow&apos;s Japanese auctions.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 font-bold bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <Clock size={12} className="text-[#B30D12]" /> Next Auction: Tomorrow 11:20 AM JST
          </span>
        </div>
      </div>

      {/* Grid of Vehicles (Equal size & Perfectly Aligned) */}
      <div className="pt-3.5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 items-stretch">
        {UPCOMING_AUCTION_MATCHES.map((vehicle) => {
          const isNotified = syncState.notifiedAuctionLotIds.includes(vehicle.id);
          const isAnimating = animatingLot === vehicle.id;

          return (
            <div
              key={vehicle.id}
              className="group rounded-2xl border border-slate-200/90 bg-white hover:border-red-200 hover:shadow-md transition-all flex flex-col h-full overflow-hidden"
            >
              {/* Image & Badges (Consistent Aspect Ratio & Overflow Hidden) */}
              <div className="relative w-full aspect-[16/10] bg-slate-100 overflow-hidden shrink-0">
                <img
                  src={vehicle.image}
                  alt={vehicle.model}
                  loading="lazy"
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
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-emerald-500 text-white shadow-2xs">
                    Grade {vehicle.grade}
                  </span>
                </div>

                {/* Time Left Pill */}
                <div className="absolute bottom-2 left-2">
                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-black/75 text-red-300 flex items-center gap-1 backdrop-blur-xs">
                    <Clock size={9} /> {vehicle.timeLeft}
                  </span>
                </div>
              </div>

              {/* Body (Aligned Flex Column) */}
              <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                <div>
                  {/* Title with Fixed Height for Perfect Alignment */}
                  <div className="h-10 flex items-start">
                    <h4
                      className="font-extrabold text-slate-900 text-xs sm:text-[13px] leading-snug line-clamp-2"
                      title={`${vehicle.year} ${vehicle.model}`}
                    >
                      {vehicle.year} {vehicle.model}
                    </h4>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate mt-0.5">
                    {vehicle.badge} &bull; {vehicle.km.toLocaleString('en-US')} km
                  </p>

                  {/* Pricing Dual Currency Block */}
                  <div className="mt-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">FOB PRICE</span>
                      <span className="font-black text-slate-900 text-xs sm:text-[13px]">
                        NZ${vehicle.fobPriceNzd.toLocaleString('en-US')}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">YEN (JPY)</span>
                      <span className="font-bold text-slate-700 text-[11px] font-mono">
                        ¥{vehicle.fobPriceJpy.toLocaleString('en-US')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Matched Dealers & Actions Block (Pinned to Bottom) */}
                <div className="mt-auto pt-3 border-t border-slate-100 flex flex-col gap-2">
                  {/* Matched Dealers Clickable Area */}
                  <div
                    onClick={() => handleOpenDrawer(vehicle)}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50/50 hover:bg-slate-100 border border-slate-200 cursor-pointer transition-colors group/match h-9"
                    title="Click to view detailed list of matched dealers"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      {/* Avatar stack */}
                      <div className="flex -space-x-1 overflow-hidden shrink-0">
                        <span className="inline-block h-5 w-5 rounded-full ring-1.5 ring-white bg-[#B30D12] text-white font-bold text-[8px] flex items-center justify-center">AA</span>
                        <span className="inline-block h-5 w-5 rounded-full ring-1.5 ring-white bg-slate-700 text-white font-bold text-[8px] flex items-center justify-center">HM</span>
                        <span className="inline-block h-5 w-5 rounded-full ring-1.5 ring-white bg-blue-600 text-white font-bold text-[8px] flex items-center justify-center">CC</span>
                      </div>
                      <span className="text-[11px] font-extrabold text-slate-900 truncate">
                        Matched dealers: <strong className="text-[#B30D12]">{vehicle.matchedDealersCount}</strong>
                      </span>
                    </div>
                    <ChevronRight size={13} className="text-[#333] group-hover/match:translate-x-0.5 transition-transform shrink-0" />
                  </div>

                  {/* Notify Button (AutoHub Brand Red Gradient) */}
                  <button
                    onClick={(e) => handleNotifyMatched(vehicle, e)}
                    disabled={isNotified || isAnimating}
                    className={`w-full h-9 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${isNotified
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-gradient-to-r from-[#B30D12] to-[#940B0F] hover:from-[#940B0F] hover:to-[#7A080C] text-white shadow-2xs active:scale-[0.98]'
                      }`}
                  >
                    {isNotified ? (
                      <>
                        <CheckCircle2 size={13} className="text-emerald-600" />
                        <span>{vehicle.matchedDealersCount} Dealers Notified</span>
                      </>
                    ) : (
                      <>
                        <Send size={13} className={isAnimating ? 'animate-bounce' : ''} />
                        <span>Notify matched dealers</span>
                      </>
                    )}
                  </button>
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
