"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  TrendingDown, 
  Flame, 
  Snowflake, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  AlertCircle,
  Zap,
  ShieldAlert
} from 'lucide-react';
import { RISING_MODELS, COOLING_MODELS, TrendModel } from '@/lib/demandIntelligenceData';

export default function RisingCoolingCards() {
  const [hoveredRisingIdx, setHoveredRisingIdx] = useState<number | null>(null);
  const [hoveredCoolingIdx, setHoveredCoolingIdx] = useState<number | null>(null);

  // Render high-fidelity smooth sparkline with gradient area and glowing endpoint
  const renderEnhancedSparkline = (
    points: number[], 
    isUp: boolean, 
    idPrefix: string,
    isHovered: boolean
  ) => {
    const width = 120;
    const height = 40;
    const padX = 6;
    const padY = 6;

    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;

    // Calculate normalized point coordinates
    const pts = points.map((p, idx) => {
      const x = padX + (idx / (points.length - 1)) * (width - padX * 2);
      const y = height - padY - ((p - min) / range) * (height - padY * 2);
      return { x, y };
    });

    // Generate smooth cubic Bezier spline
    let linePath = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      linePath += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }

    const lastPt = pts[pts.length - 1];
    const firstPt = pts[0];
    const areaPath = `${linePath} L ${lastPt.x.toFixed(1)} ${height} L ${firstPt.x.toFixed(1)} ${height} Z`;

    const strokeColor = isUp ? '#10B981' : '#F43F5E';
    const gradId = `spark-grad-${idPrefix}`;

    return (
      <div className="relative flex flex-col items-end">
        <svg 
          width={width} 
          height={height} 
          className="overflow-visible select-none transition-transform duration-200"
          style={{ transform: isHovered ? 'scale(1.04)' : 'scale(1)' }}
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity={isHovered ? 0.35 : 0.22} />
              <stop offset="85%" stopColor={strokeColor} stopOpacity={0.03} />
              <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Faint baseline guide */}
          <line
            x1={padX}
            y1={height - 2}
            x2={width - padX}
            y2={height - 2}
            stroke="#E2E8F0"
            strokeWidth="1"
            strokeDasharray="2 2"
          />

          {/* Gradient Area Fill */}
          <path
            d={areaPath}
            fill={`url(#${gradId})`}
            className="transition-opacity duration-300"
          />

          {/* Main Curved Spline Line */}
          <path
            d={linePath}
            fill="none"
            stroke={strokeColor}
            strokeWidth={isHovered ? 2.5 : 2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-200"
          />

          {/* Pulsing endpoint glow */}
          <circle
            cx={lastPt.x}
            cy={lastPt.y}
            r={isHovered ? 7 : 5}
            fill={strokeColor}
            fillOpacity="0.25"
            className="animate-pulse"
          />

          {/* Solid endpoint marker */}
          <circle
            cx={lastPt.x}
            cy={lastPt.y}
            r={isHovered ? 3.5 : 2.5}
            fill={strokeColor}
            stroke="#ffffff"
            strokeWidth="1.5"
            className="transition-all duration-150"
          />
        </svg>

        {/* Start and End values */}
        <div className="flex items-center justify-between w-full text-[9px] font-semibold text-slate-400 mt-0.5 px-1">
          <span>{points[0]}</span>
          <span className={isUp ? 'text-emerald-700 font-extrabold' : 'text-rose-600 font-extrabold'}>
            {points[points.length - 1]}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
      
      {/* 1. Rising Demand Card */}
      <div className="relative rounded-2xl bg-white border border-slate-200/90 p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col justify-between">
        {/* Top Accent Gradient */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/80 shadow-2xs shrink-0">
              <TrendingUp size={16} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-base font-black text-slate-900 tracking-tight leading-snug">
                  Rising demand
                </h4>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-black bg-emerald-100/80 text-emerald-800 border border-emerald-200">
                  Surging
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Models with the highest 30-day velocity surges and dealer search acceleration.
              </p>
            </div>
          </div>
          <ArrowUpRight size={18} className="text-emerald-500 hidden sm:block shrink-0" />
        </div>

        {/* Model Rows */}
        <div className="space-y-2.5">
          {RISING_MODELS.map((item, idx) => {
            const isHovered = hoveredRisingIdx === idx;
            return (
              <div 
                key={idx}
                onMouseEnter={() => setHoveredRisingIdx(idx)}
                onMouseLeave={() => setHoveredRisingIdx(null)}
                className={`p-3 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                  isHovered
                    ? 'bg-gradient-to-r from-emerald-50/50 via-white to-white border-emerald-200 shadow-sm -translate-y-0.5'
                    : 'bg-slate-50/60 border-slate-100 hover:border-slate-200'
                }`}
              >
                {/* Vehicle Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className="font-black text-slate-900 text-xs sm:text-sm">
                      {item.name}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-0.5 shadow-2xs">
                      <TrendingUp size={10} /> +{item.pctChange}%
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-white text-slate-600 border border-slate-200">
                      {item.segment}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed line-clamp-1">
                    {item.driver}
                  </p>

                  {/* Recommendation action link */}
                  <div className="mt-1.5 flex items-center gap-2">
                    <Link
                      href={`/admin/vehicles?search=${encodeURIComponent(item.name)}`}
                      className="text-[10px] font-extrabold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-0.5 transition-colors cursor-pointer"
                    >
                      <Zap size={10} className="fill-emerald-600 text-emerald-600" />
                      <span>Source More Stock</span>
                      <ArrowUpRight size={11} />
                    </Link>
                  </div>
                </div>

                {/* Graph Sparkline */}
                <div className="shrink-0 pl-2">
                  {renderEnhancedSparkline(item.sparkline, true, `rising-${idx}`, isHovered)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Guidance */}
        <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10.5px] text-slate-500 font-medium">
          <span className="flex items-center gap-1 text-emerald-800 font-bold">
            <Sparkles size={11} className="text-emerald-600" /> Recommendation: Increase auction bids by 3–5%
          </span>
          <span className="text-slate-400">9-pt rolling index</span>
        </div>
      </div>

      {/* 2. Cooling Demand Card */}
      <div className="relative rounded-2xl bg-white border border-slate-200/90 p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col justify-between">
        {/* Top Accent Gradient */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-rose-500 via-rose-400 to-slate-400" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200/80 shadow-2xs shrink-0">
              <TrendingDown size={16} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-base font-black text-slate-900 tracking-tight leading-snug">
                  Cooling demand
                </h4>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-black bg-rose-100/80 text-rose-800 border border-rose-200">
                  Slowing
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Models facing local yard saturation, longer listing days, or seasonal drops.
              </p>
            </div>
          </div>
          <ArrowDownRight size={18} className="text-rose-400 hidden sm:block shrink-0" />
        </div>

        {/* Model Rows */}
        <div className="space-y-2.5">
          {COOLING_MODELS.map((item, idx) => {
            const isHovered = hoveredCoolingIdx === idx;
            return (
              <div 
                key={idx}
                onMouseEnter={() => setHoveredCoolingIdx(idx)}
                onMouseLeave={() => setHoveredCoolingIdx(null)}
                className={`p-3 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                  isHovered
                    ? 'bg-gradient-to-r from-rose-50/50 via-white to-white border-rose-200 shadow-sm -translate-y-0.5'
                    : 'bg-slate-50/60 border-slate-100 hover:border-slate-200'
                }`}
              >
                {/* Vehicle Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className="font-black text-slate-900 text-xs sm:text-sm">
                      {item.name}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-0.5 shadow-2xs">
                      <TrendingDown size={10} /> {item.pctChange}%
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-white text-slate-600 border border-slate-200">
                      {item.segment}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed line-clamp-1">
                    {item.driver}
                  </p>

                  {/* Advisory action tag */}
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="text-[10px] font-extrabold text-rose-700 inline-flex items-center gap-1">
                      <ShieldAlert size={10} className="text-rose-600" />
                      <span>Caution: Yard inventory ample</span>
                    </span>
                  </div>
                </div>

                {/* Graph Sparkline */}
                <div className="shrink-0 pl-2">
                  {renderEnhancedSparkline(item.sparkline, false, `cooling-${idx}`, isHovered)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Guidance */}
        <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10.5px] text-slate-500 font-medium">
          <span className="flex items-center gap-1 text-slate-600 font-bold">
            <AlertCircle size={11} className="text-rose-500" /> Action: Lower purchase target or pause bidding
          </span>
          <span className="text-slate-400">9-pt rolling index</span>
        </div>
      </div>

    </div>
  );
}

