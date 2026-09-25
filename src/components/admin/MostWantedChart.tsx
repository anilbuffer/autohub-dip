"use client";

import React, { useState } from 'react';
import { TOP_WANTED_MODELS, TopModelDemand } from '@/lib/demandIntelligenceData';
import { Users, TrendingUp, Sparkles, Filter } from 'lucide-react';

interface MostWantedChartProps {
  segmentFilter?: string;
}

export default function MostWantedChart({ segmentFilter = 'All' }: MostWantedChartProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filteredModels = TOP_WANTED_MODELS.filter(item => {
    if (segmentFilter === 'All') return true;
    if (segmentFilter === 'Hybrid') return item.fuel.includes('Hybrid');
    return item.segment === segmentFilter;
  });

  const maxDemand = Math.max(...TOP_WANTED_MODELS.map(m => m.demandCount), 1);

  return (
    <div className="relative rounded-2xl bg-gradient-to-br from-white via-white to-red-50/20 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-4 sm:p-4.5 overflow-hidden">
      {/* Top Subtle Red Brand Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#B30D12] via-[#E23B40] to-rose-300" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#B30D12] bg-red-50 px-2 py-0.2 rounded-full border border-red-100">
              Demand Leaderboard
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Top 10 NZ Dealer Preferences</span>
          </div>
          <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-snug">
            Most-Wanted Vehicle Models
          </h3>
          <p className="text-[11px] text-slate-500 font-medium leading-normal">
            Aggregated units wanted across active wish lists and reservation requests.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <div className="flex items-center gap-1 text-[11px] text-slate-600 font-bold bg-white px-2.5 py-1 rounded-lg border border-red-100 shadow-2xs">
            <Users size={12} className="text-[#B30D12]" />
            <span>142 Dealers Polled</span>
          </div>
        </div>
      </div>

      {/* Horizontal Bar Chart List (Compact) */}
      <div className="pt-3 space-y-2">
        {filteredModels.map((model, idx) => {
          const widthPct = Math.round((model.demandCount / maxDemand) * 100);
          const isHovered = hoveredId === model.id;

          return (
            <div
              key={model.id}
              onMouseEnter={() => setHoveredId(model.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`p-2 rounded-xl transition-all cursor-pointer border ${
                isHovered
                  ? 'bg-red-50/40 border-red-200 shadow-2xs'
                  : 'bg-white/80 border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  {/* Rank Badge */}
                  <span className={`w-4.5 h-4.5 rounded-md flex items-center justify-center font-black text-[10px] shrink-0 ${
                    idx === 0 
                      ? 'bg-gradient-to-br from-[#B30D12] to-[#940B0F] text-white shadow-2xs' 
                      : idx === 1 
                      ? 'bg-slate-200 text-slate-700' 
                      : idx === 2 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {idx + 1}
                  </span>

                  <span className="font-extrabold text-slate-900 text-xs truncate">
                    {model.fullName}
                  </span>

                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                    {model.fuel}
                  </span>

                  <span className="text-[9px] text-slate-400 font-medium hidden md:inline">
                    {model.segment}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-right">
                  <div className="hidden sm:block">
                    <span className="text-[10px] text-slate-400 font-medium">Dealers: </span>
                    <span className="font-bold text-slate-700 text-xs">{model.dealersCount}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium sm:hidden">Demand: </span>
                    <span className="font-black text-slate-900 text-xs">{model.demandCount}</span>
                    <span className="text-[10px] text-slate-500 font-medium ml-0.5">units</span>
                  </div>
                </div>
              </div>

              {/* Progress bar container */}
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: model.color,
                  }}
                />
              </div>

              {/* Micro telemetry on hover */}
              {isHovered && (
                <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex flex-wrap items-center justify-between text-[10px] text-slate-600 animate-in fade-in duration-150">
                  <div className="flex items-center gap-2.5">
                    <span>
                      <strong className="text-slate-900">Est. land:</strong> 18–22 days
                    </span>
                    <span>
                      <strong className="text-slate-900">Avg Margin:</strong> NZ${model.avgMarginNzd.toLocaleString('en-US')}
                    </span>
                  </div>
                  <span className="text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    High Liquidity
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
