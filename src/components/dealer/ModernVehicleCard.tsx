"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Clock,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Ship,
  ChevronRight,
  Building2,
  Eye
} from "lucide-react";
import { Vehicle } from "@/lib/data";

export interface EnrichedVehicle extends Vehicle {
  dynamicLanded: number;
  dynamicMargin: number;
  matchScore: number;
  isPriority: boolean;
}

interface ModernVehicleCardProps {
  vehicle: EnrichedVehicle;
  isShortlisted: boolean;
  onToggleShortlist: (id: number) => void;
  onAskCopilot: (query: string) => void;
  showDealerBadge?: boolean;
  detailHref?: string;
  actionLabel?: string;
}

function formatTransmission(trans?: string) {
  if (!trans) return "Auto";
  const upper = trans.toUpperCase().trim();
  if (
    upper === "FAT" ||
    upper === "AT" ||
    upper === "IA" ||
    upper === "CAT" ||
    upper === "DAT" ||
    upper.includes("AUTO")
  ) {
    return "Auto";
  }
  if (
    upper === "MT" ||
    upper === "FMT" ||
    upper === "6MT" ||
    upper === "5MT" ||
    upper.includes("MANUAL")
  ) {
    return "Manual";
  }
  return trans;
}

export default function ModernVehicleCard({
  vehicle,
  isShortlisted,
  onToggleShortlist,
  onAskCopilot,
  showDealerBadge = false,
  detailHref,
  actionLabel,
}: ModernVehicleCardProps) {
  const targetHref = detailHref || `/vehicles/${vehicle.id}`;
  const resolvedActionLabel = actionLabel || (detailHref?.includes("/admin") ? "Audit Lot" : "Place Bid");

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 shadow-[0_4px_16px_-3px_rgba(15,23,42,0.08),0_2px_4px_-1px_rgba(15,23,42,0.03)] hover:shadow-[0_20px_35px_-8px_rgba(15,23,42,0.15)] hover:border-slate-300 transition-all duration-200 flex flex-col overflow-hidden h-full">
      {/* 1. Hero Image Container with Corner Badges */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 shrink-0">
        <img
          src={vehicle.image}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Ambient Dark Gradient for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

        {/* Top-Left: Auction Grade & Countdown Timer Badges */}
        <div className="absolute top-2 sm:top-2.5 left-2 sm:left-2.5 flex items-center gap-1 sm:gap-1.5 z-10 flex-wrap max-w-[calc(100%-48px)]">
          <span className="px-2 sm:px-2.5 py-0.5 bg-black/85 backdrop-blur-md text-white font-extrabold text-[10px] sm:text-[11px] rounded-lg border border-white/20 shadow-xs tracking-wide shrink-0">
            Gr {vehicle.grade} / {vehicle.interiorGrade || "B"}
          </span>
          <span className="px-2 sm:px-2.5 py-0.5 bg-[#B30D12] text-white font-bold text-[10px] sm:text-[10.5px] rounded-lg flex items-center gap-1 shadow-xs tracking-tight shrink-0 whitespace-nowrap">
            <Clock size={10} className="shrink-0" />
            <span>{vehicle.timeLeft}</span>
          </span>
        </div>

        {/* Top-Right: Floating Shortlist / Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleShortlist(vehicle.id);
          }}
          className={`absolute top-2 sm:top-2.5 right-2 sm:right-2.5 w-8 h-8 rounded-xl flex items-center justify-center transition-all z-10 cursor-pointer shadow-md backdrop-blur-md shrink-0 ${isShortlisted
            ? "bg-[#B30D12] text-white ring-2 ring-white/50"
            : "bg-white/90 hover:bg-white text-slate-700 hover:text-[#B30D12]"
            }`}
          title={isShortlisted ? "Remove from shortlist" : "Add to shortlist"}
        >
          {isShortlisted ? (
            <BookmarkCheck size={16} className="fill-current" />
          ) : (
            <Bookmark size={16} />
          )}
        </button>

        {/* Bottom Overlay: Auction House & Lot Number */}
        <div className="absolute bottom-2 sm:bottom-2.5 left-2.5 sm:left-3 right-2.5 sm:right-3 flex items-center justify-between text-[11px] text-white/95 font-medium z-10 gap-2">
          <span className="font-bold drop-shadow-sm truncate min-w-0 text-[10.5px] sm:text-[11px]">
            {vehicle.auctionHouse}
          </span>
          <span className="font-mono font-bold bg-black/75 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] sm:text-[10.5px] text-white border border-white/15 shrink-0 whitespace-nowrap">
            Lot #{vehicle.lotNumber}
          </span>
        </div>
      </div>

      {/* 2. Main Card Body with Clear Typographic Hierarchy */}
      <div className="p-3.5 sm:p-4.5 flex-1 flex flex-col justify-between gap-3.5">
        <div className="space-y-3">
          {/* Row 1: Vehicle Title + Projected Margin */}
          <div className="space-y-1">
            <div className="flex items-start justify-between gap-2">
              <Link
                href={targetHref}
                className="block group/link min-w-0 flex-1"
                title={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              >
                <h3 className="text-[15.5px] sm:text-[17px] font-black text-slate-900 group-hover/link:text-[#B30D12] transition-colors leading-snug">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h3>
              </Link>

              <div className="text-right shrink-0 pl-1.5">
                <div className="text-[16px] sm:text-[17.5px] font-black text-emerald-700 font-mono tracking-tight leading-tight whitespace-nowrap">
                  +NZ${vehicle.dynamicMargin.toLocaleString("en-US")}
                </div>
                <span className="text-[9px] sm:text-[9.5px] font-extrabold uppercase tracking-wider text-emerald-700/85 block mt-0.5 whitespace-nowrap">
                  Est. Margin
                </span>
              </div>
            </div>

            <p className="text-[11.5px] font-semibold text-slate-500 truncate">
              {vehicle.badge ? `${vehicle.badge} • ` : ""}{vehicle.engine}
            </p>
          </div>

          {/* Row 2: Secondary Financial Reference Strip (Full Width / Block Stack) */}
          <div className="p-2.5 sm:p-3 bg-slate-50/90 rounded-xl border border-slate-200/80 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Landed Cost
              </span>
              <span className="font-black text-slate-900 font-mono text-[13px] sm:text-[13.5px]">
                NZ${vehicle.dynamicLanded.toLocaleString("en-US")}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/70">
              <span className="text-[10.5px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                NZ Retail
              </span>
              <span className="font-bold text-slate-700 font-mono text-[13px] sm:text-[13.5px]">
                NZ${vehicle.estRetailNzd.toLocaleString("en-US")}
              </span>
            </div>
          </div>

          {/* Optional Admin Dealership Allocation Badge */}
          {showDealerBadge && (
            <div className="flex items-center justify-between gap-2 px-2.5 sm:px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-700 truncate min-w-0">
                <Building2 size={12} className="text-[#B30D12] shrink-0" />
                <span className="truncate text-[11px]">{vehicle.dealer ? `Allocated: ${vehicle.dealer}` : "Unallocated Lot"}</span>
              </div>
              <span className={`text-[9.5px] sm:text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md shrink-0 whitespace-nowrap ${vehicle.status === "Priority"
                ? "bg-red-50 text-[#B30D12] border border-red-200"
                : vehicle.status === "Allocated"
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : vehicle.status === "Consider"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-slate-100 text-slate-700 border border-slate-200"
                }`}>
                {vehicle.status || "Available"}
              </span>
            </div>
          )}

          {/* Row 3: Scannable Specification Pill Tags */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 pt-0.5">
            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10.5px] sm:text-[11px] font-semibold whitespace-nowrap">
              {(vehicle.km).toLocaleString("en-US")} km
            </span>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10.5px] sm:text-[11px] font-semibold whitespace-nowrap">
              {vehicle.fuel}
            </span>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10.5px] sm:text-[11px] font-semibold whitespace-nowrap">
              {formatTransmission(vehicle.trans)}
            </span>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10.5px] sm:text-[11px] font-semibold capitalize whitespace-nowrap">
              {vehicle.color}
            </span>
          </div>

          {/* Row 4: Decluttered Neutral Sourcing Intelligence Strip */}
          <div className="bg-slate-50/90 rounded-xl p-2.5 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center justify-between gap-1.5 flex-wrap">
              {/* Neutral label: Data confidence: High */}
              <div className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/70 text-[10px] sm:text-[10.5px] font-bold shrink-0 whitespace-nowrap">
                <Sparkles size={11} className="text-emerald-600 shrink-0" />
                <span>Data confidence: High</span>
              </div>
              <span className={`text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded border shrink-0 whitespace-nowrap ${vehicle.isPriority
                ? "bg-red-50 text-[#B30D12] border-red-200/70"
                : "bg-slate-100 text-slate-600 border-slate-200"
                }`}>
                {vehicle.isPriority ? "Best Match" : "Qualifying Lot"}
              </span>
            </div>

            {/* Est. days to land in NZ (indicative) */}
            <div className="flex items-center gap-1.5 text-[10.5px] text-slate-500 font-medium">
              <Ship size={11} className="text-blue-600 shrink-0" />
              <span className="truncate">Est. days to land: <strong className="text-slate-700">18–22d (indicative)</strong></span>
            </div>

            <p className="text-[11px] text-slate-600 font-medium leading-relaxed line-clamp-2">
              {vehicle.aiAnalysis.summary}
            </p>
          </div>
        </div>

        {/* 3. Action Buttons Row (Side by Side in One Row) */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
          <Link
            href={targetHref}
            className="w-full py-2.5 px-2 sm:px-3 bg-red-50 hover:bg-red-100 text-[#B30D12] text-xs font-bold rounded-xl border border-red-200/90 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.99]"
            title="View Vehicle Details"
          >
            <Eye size={13} className="text-[#B30D12] shrink-0" />
            <span className="font-bold whitespace-nowrap">View Details</span>
          </Link>

          <Link
            href={targetHref}
            className="w-full py-2.5 px-2 sm:px-3 bg-[#B30D12] hover:bg-[#940B0F] text-white text-xs font-bold rounded-xl transition-all shadow-xs hover:shadow flex items-center justify-center gap-1.5 active:scale-[0.99] group/btn"
          >
            <span className="font-bold whitespace-nowrap">{resolvedActionLabel}</span>
            <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  );
}
