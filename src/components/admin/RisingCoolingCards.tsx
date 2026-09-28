"use client";

import React from 'react';
import { TrendingUp, TrendingDown, Flame, Snowflake, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { RISING_MODELS, COOLING_MODELS, TrendModel } from '@/lib/demandIntelligenceData';

export default function RisingCoolingCards() {
  const renderSparkline = (points: number[], isUp: boolean) => {
    const width = 90;
    const height = 28;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;

    const pathPoints = points.map((p, idx) => {
      const x = (idx / (points.length - 1)) * (width - 8) + 4;
      const y = height - 5 - ((p - min) / range) * (height - 10);
      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');

    const strokeColor = isUp ? '#10B981' : '#F43F5E';

    return (
      <svg width={width} height={height} className="overflow-visible shrink-0">
        <path
          d={pathPoints}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.length > 0 && (
          <circle
            cx={width - 4}
            cy={height - 5 - ((points[points.length - 1] - min) / range) * (height - 10)}
            r="2.5"
            fill={strokeColor}
          />
        )}
      </svg>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-4.5">
      
      {/* Rising Demand Card */}
      <div className="relative rounded-2xl bg-white border border-slate-200/90 p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-emerald-500" />

        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shrink-0">
              <TrendingUp size={16} />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5 leading-snug">
                Rising demand
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">
                Models with the biggest demand increase
              </p>
            </div>
          </div>
          <ArrowUpRight size={16} className="text-emerald-500 hidden sm:block" />
        </div>

        <div className="space-y-2">
          {RISING_MODELS.map((item, idx) => (
            <div 
              key={idx}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-emerald-50/30 hover:border-emerald-200 transition-all flex items-center justify-between gap-2.5"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 text-xs">{item.name}</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-0.5">
                    <TrendingUp size={9} /> +{item.pctChange}%
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium hidden md:inline">
                    {item.segment}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1 font-medium">
                  {item.driver}
                </p>
              </div>

              <div className="shrink-0">
                {renderSparkline(item.sparkline, true)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cooling Demand Card */}
      <div className="relative rounded-2xl bg-white border border-slate-200/90 p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-slate-400" />

        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center border border-slate-200 shrink-0">
              <TrendingDown size={16} />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5 leading-snug">
                Cooling demand
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">
                Models with falling demand
              </p>
            </div>
          </div>
          <ArrowDownRight size={16} className="text-slate-400 hidden sm:block" />
        </div>

        <div className="space-y-2">
          {COOLING_MODELS.map((item, idx) => (
            <div 
              key={idx}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-slate-100/60 hover:border-slate-300 transition-all flex items-center justify-between gap-2.5"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 text-xs">{item.name}</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-0.5">
                    <TrendingDown size={9} /> {item.pctChange}%
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium hidden md:inline">
                    {item.segment}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1 font-medium">
                  {item.driver}
                </p>
              </div>

              <div className="shrink-0">
                {renderSparkline(item.sparkline, false)}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
