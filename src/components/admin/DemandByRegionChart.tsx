"use client";

import React, { useState } from 'react';
import { DEMAND_BY_REGION, RegionDemand } from '@/lib/demandIntelligenceData';
import { MapPin, Users, PieChart, Sparkles, Compass, ArrowUpRight, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface DemandByRegionChartProps {
  selectedRegion?: string;
  onSelectRegion?: (region: string) => void;
}

export default function DemandByRegionChart({
  selectedRegion = 'All',
  onSelectRegion
}: DemandByRegionChartProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const maxUnits = Math.max(...DEMAND_BY_REGION.map(r => r.units));
  const totalUnits = DEMAND_BY_REGION.reduce((acc, r) => acc + r.units, 0);

  return (
    <div className="relative rounded-2xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-4 sm:p-5 overflow-hidden">
      {/* Top Accent Gradient Line in Light Blue / Sky */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 text-[10.5px] font-black uppercase tracking-wider border border-sky-200/60">
              <Compass size={12} className="text-sky-600" />
              Geographic Concentration
            </span>
            <span className="text-[12px] text-slate-400 font-medium">Telemetry across NZ</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
            Demand by region
          </h3>
          <p className="text-[12px] text-slate-500 font-medium leading-normal mt-0.5">
            Dealer buying interest across 5 key NZ territories. Click any region to filter dashboard insights.
          </p>
        </div>

        {/* Right Info Pills */}
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
            <MapPin size={13} className="text-sky-600" />
            <span>5 Key NZ Regions</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-sky-800 font-bold bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200/80 shadow-2xs">
            <span>{totalUnits.toLocaleString()} Total Units</span>
          </div>
        </div>
      </div>

      {/* Regional Bars List */}
      <div className="pt-3.5 space-y-2.5">
        {DEMAND_BY_REGION.map((item, idx) => {
          const isSelected = selectedRegion === item.region;
          const isHovered = hoveredRegion === item.region;
          const widthPct = Math.round((item.units / maxUnits) * 100);

          return (
            <div
              key={item.region}
              onMouseEnter={() => setHoveredRegion(item.region)}
              onMouseLeave={() => setHoveredRegion(null)}
              onClick={() => onSelectRegion && onSelectRegion(isSelected ? 'All' : item.region)}
              className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer ${isSelected
                ? 'bg-sky-50/60 border-sky-400 shadow-sm ring-1 ring-sky-400/40'
                : isHovered
                  ? 'bg-slate-50/80 border-sky-200 shadow-2xs -translate-y-0.5'
                  : 'bg-white border-slate-100 hover:border-slate-200'
                }`}
            >
              {/* Row Header Info */}
              <div className="flex items-center justify-between text-xs mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  {/* Rank badge */}
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center font-black text-[10px] shrink-0 ${idx === 0
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 border border-slate-200/60'
                    }`}>
                    {idx + 1}
                  </span>

                  <span className="font-black text-slate-900 text-xs sm:text-sm">
                    {item.region}
                  </span>

                  <span className="text-[12px] text-slate-400 font-medium hidden sm:inline">
                    ({item.activeDealers} dealers)
                  </span>

                  {/* Clean light blue top segment pill (replacing old purple badge) */}
                  <span className="text-[12px] text-sky-800 font-bold bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200/80 shrink-0">
                    {item.topSegment}
                  </span>

                  {isSelected && (
                    <span className="px-1.5 py-0.2 rounded text-[12px] font-black bg-sky-600 text-white shrink-0 flex items-center gap-0.5">
                      <Check size={9} /> Filter Active
                    </span>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span className="font-black text-slate-900 text-xs sm:text-sm">{item.units}</span>
                  <span className="text-slate-500 text-[12px] font-medium ml-1">units ({item.pct}%)</span>
                </div>
              </div>

              {/* Progress Bar Container: Light Blue & Sky Gradient (Replaced Purple) */}
              <div className="relative w-full bg-slate-100 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 transition-all duration-700 ease-out shadow-[0_1px_4px_rgba(14,165,233,0.35)]"
                  style={{ width: `${widthPct}%` }}
                />
              </div>

              {/* Segment Breakdown on Hover or Selection */}
              {(isHovered || isSelected) && (
                <div className="mt-2.5 pt-2.5 border-t border-slate-200/80 animate-in fade-in duration-150">
                  <div className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Segment Preference Distribution:</span>
                    <span className="text-sky-700 font-bold flex items-center gap-1">
                      <Sparkles size={10} className="text-sky-600" />
                      <span>{item.region} Territory Breakdown</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {/* Hybrid SUV */}
                    <div className="p-2 rounded-lg bg-white text-center border border-slate-100">
                      <span className="text-[12px] text-slate-400 block font-bold">HYBRID SUV</span>
                      <strong className="text-slate-900 text-base">{item.segments.hybrid}%</strong>
                      <div className="w-full bg-slate-200 rounded-full h-1 mt-1 overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${item.segments.hybrid}%` }} />
                      </div>
                    </div>

                    {/* Mid / AWD SUV */}
                    <div className="p-2 rounded-lg bg-white text-center border border-slate-100">
                      <span className="text-[12px] text-slate-400 block font-bold">MID / AWD SUV</span>
                      <strong className="text-slate-900 text-base">{item.segments.suv}%</strong>
                      <div className="w-full bg-slate-200 rounded-full h-1 mt-1 overflow-hidden">
                        <div className="bg-sky-500 h-full rounded-full" style={{ width: `${item.segments.suv}%` }} />
                      </div>
                    </div>

                    {/* Compact Hatch */}
                    <div className="p-2 rounded-lg bg-white text-center border border-slate-100">
                      <span className="text-[12px] text-slate-400 block font-bold">COMPACT HATCH</span>
                      <strong className="text-slate-900 text-base">{item.segments.compact}%</strong>
                      <div className="w-full bg-slate-200 rounded-full h-1 mt-1 overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: `${item.segments.compact}%` }} />
                      </div>
                    </div>

                    {/* Sedan / Wagon */}
                    <div className="p-2 rounded-lg bg-white text-center border border-slate-100">
                      <span className="text-[12px] text-slate-400 block font-bold">SEDAN / WAGON</span>
                      <strong className="text-slate-900 text-base">{item.segments.sedan}%</strong>
                      <div className="w-full bg-slate-200 rounded-full h-1 mt-1 overflow-hidden">
                        <div className="bg-slate-500 h-full rounded-full" style={{ width: `${item.segments.sedan}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Info Strip */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between text-[12px] text-slate-400 font-medium">
        <span>Auckland commands 46% of all verified dealer demand</span>
        <span className="text-sky-700 font-semibold">Tip: Click any region row to filter whole dashboard</span>
      </div>
    </div>
  );
}

