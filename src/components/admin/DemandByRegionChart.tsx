"use client";

import React, { useState } from 'react';
import { DEMAND_BY_REGION, RegionDemand } from '@/lib/demandIntelligenceData';
import { MapPin, Users, PieChart, Sparkles } from 'lucide-react';

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

  return (
    <div className="relative rounded-2xl bg-gradient-to-br from-white via-white to-red-50/20 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-4 sm:p-4.5 overflow-hidden">
      {/* Top Subtle Red Brand Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#B30D12] via-[#E23B40] to-rose-300" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.2 rounded-full border border-purple-100">
              Regional Geography
            </span>
            <span className="text-[11px] text-slate-400 font-medium">New Zealand Metro &amp; Regional Breakdown</span>
          </div>
          <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-snug">
            Vehicle Demand by NZ Region
          </h3>
          <p className="text-[11px] text-slate-500 font-medium leading-normal">
            Concentration of unmet vehicle demand across major New Zealand dealership clusters.
          </p>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-600 font-bold bg-white px-2.5 py-1 rounded-lg border border-red-100 shadow-2xs self-start sm:self-center shrink-0">
          <MapPin size={12} className="text-[#B30D12]" />
          <span>5 Key Territories</span>
        </div>
      </div>

      {/* Regional Bars (Compact) */}
      <div className="pt-3 space-y-2">
        {DEMAND_BY_REGION.map((item) => {
          const isSelected = selectedRegion === item.region;
          const isHovered = hoveredRegion === item.region;
          const widthPct = Math.round((item.units / maxUnits) * 100);

          return (
            <div
              key={item.region}
              onMouseEnter={() => setHoveredRegion(item.region)}
              onMouseLeave={() => setHoveredRegion(null)}
              onClick={() => onSelectRegion && onSelectRegion(isSelected ? 'All' : item.region)}
              className={`p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-red-50/50 border-[#B30D12] shadow-2xs ring-1 ring-[#B30D12]/20'
                  : isHovered
                  ? 'bg-slate-50 border-slate-300'
                  : 'bg-white/80 border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-xs">
                    {item.region}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                    ({item.activeDealers} dealers)
                  </span>
                  <span className="text-[9px] text-purple-700 font-bold bg-purple-50 px-1.5 py-0.2 rounded border border-purple-100">
                    {item.topSegment}
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-black text-slate-900 text-xs">{item.units}</span>
                  <span className="text-slate-500 text-[10px] ml-1">units ({item.pct}%)</span>
                </div>
              </div>

              {/* Bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-[#B30D12] transition-all duration-500"
                  style={{ width: `${widthPct}%` }}
                />
              </div>

              {/* Segment Breakdown on Hover or Selection */}
              {(isHovered || isSelected) && (
                <div className="mt-2 pt-1.5 border-t border-slate-200/80 animate-in fade-in duration-150">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Segment Preference Distribution:</span>
                    <span className="text-[#B30D12] font-semibold">{item.region} Yard Telemetry</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
                    <div className="p-1.5 rounded-lg bg-slate-50 text-center border border-slate-100">
                      <span className="text-[9px] text-slate-400 block font-bold">HYBRID SUV</span>
                      <strong className="text-slate-900 text-[11px]">{item.segments.hybrid}%</strong>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-50 text-center border border-slate-100">
                      <span className="text-[9px] text-slate-400 block font-bold">MID / AWD SUV</span>
                      <strong className="text-slate-900 text-[11px]">{item.segments.suv}%</strong>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-50 text-center border border-slate-100">
                      <span className="text-[9px] text-slate-400 block font-bold">COMPACT HATCH</span>
                      <strong className="text-slate-900 text-[11px]">{item.segments.compact}%</strong>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-50 text-center border border-slate-100">
                      <span className="text-[9px] text-slate-400 block font-bold">SEDAN / WAGON</span>
                      <strong className="text-slate-900 text-[11px]">{item.segments.sedan}%</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
