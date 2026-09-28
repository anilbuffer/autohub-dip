"use client";

import React, { useState, useMemo } from 'react';
import { TREND_TOP_5, WEEKS_LABELS } from '@/lib/demandIntelligenceData';
import {
  TrendingUp,
  Activity,
  Sparkles,
  Flame,
  Zap,
  Info,
  Calendar,
  Layers,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';

export default function DemandTrendLineChart() {
  const [hoveredWeekIdx, setHoveredWeekIdx] = useState<number>(11); // default to latest W12
  const [activeModelId, setActiveModelId] = useState<string | null>(null);

  // Chart dimensions & scaling (responsive viewBox)
  const chartWidth = 840;
  const chartHeight = 280;
  const paddingLeft = 45;
  const paddingRight = 30;
  const paddingTop = 30;
  const paddingBottom = 40;

  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  const minY = 50;
  const maxY = 200;

  const getX = (index: number) => {
    return paddingLeft + (index / (WEEKS_LABELS.length - 1)) * innerWidth;
  };

  const getY = (val: number) => {
    const clamped = Math.max(minY, Math.min(maxY, val));
    return paddingTop + innerHeight - ((clamped - minY) / (maxY - minY)) * innerHeight;
  };

  // Generate smooth cubic Bezier spline for natural curve aesthetics
  const getSmoothLinePath = (values: number[]) => {
    if (values.length === 0) return '';
    const pts = values.map((val, idx) => ({ x: getX(idx), y: getY(val) }));
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;

    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  };

  // Generate area fill path under the smooth curve
  const getSmoothAreaPath = (values: number[]) => {
    const linePath = getSmoothLinePath(values);
    const lastX = getX(values.length - 1);
    const firstX = getX(0);
    const bottomY = getY(minY);
    return `${linePath} L ${lastX.toFixed(1)} ${bottomY.toFixed(1)} L ${firstX.toFixed(1)} ${bottomY.toFixed(1)} Z`;
  };

  // Compute model stats (12-week % growth and difference)
  const modelsWithStats = useMemo(() => {
    return TREND_TOP_5.map((model) => {
      const startVal = model.values[0];
      const endVal = model.values[model.values.length - 1];
      const diff = endVal - startVal;
      const pctChange = Math.round(((endVal - startVal) / startVal) * 100);
      return {
        ...model,
        startVal,
        endVal,
        diff,
        pctChange,
      };
    });
  }, []);

  const totalAtHoveredWeek = useMemo(() => {
    return TREND_TOP_5.reduce((sum, m) => sum + m.values[hoveredWeekIdx], 0);
  }, [hoveredWeekIdx]);

  const sortedAtHoveredWeek = useMemo(() => {
    return [...TREND_TOP_5].sort((a, b) => b.values[hoveredWeekIdx] - a.values[hoveredWeekIdx]);
  }, [hoveredWeekIdx]);

  return (
    <div className="relative rounded-2xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-4 sm:p-6 overflow-hidden">

      {/* Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10.5px] font-black uppercase tracking-wider border border-blue-200/60">
              <Activity size={12} className="text-blue-600" />
              12-Week Velocity
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Weekly telemetry snapshot</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug">
            Demand trend
          </h3>
          <p className="text-xs text-slate-500 font-medium leading-normal mt-0.5 max-w-2xl">
            Weekly dealer buying interest over the last quarter for Heiwa&apos;s top 5 requested models. Hover over any week to inspect exact figures.
          </p>
        </div>

        {/* Interactive Model Legend Filters */}
        <div className="flex flex-wrap items-center gap-1.5 self-start lg:self-center">
          <button
            type="button"
            onClick={() => setActiveModelId(null)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${activeModelId === null
                ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
          >
            All Models
          </button>

          {modelsWithStats.map((model) => {
            const isSelected = activeModelId === model.id;
            return (
              <button
                key={model.id}
                type="button"
                onClick={() => setActiveModelId(isSelected ? null : model.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer ${isSelected
                    ? 'text-white shadow-2xs'
                    : activeModelId !== null
                      ? 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                style={{
                  backgroundColor: isSelected ? model.color : undefined,
                  borderColor: isSelected ? model.color : undefined,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: isSelected ? '#ffffff' : model.color }}
                />
                <span>{model.name}</span>
                <span className={`text-[10px] px-1 py-0.2 rounded font-extrabold ${isSelected ? 'bg-black/25 text-white' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                  +{model.pctChange}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inflection & Key Insights Ribbon */}
      <div className="my-3 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Sparkles size={11} className="text-blue-600" />
          </span>
          <span className="text-slate-700 font-medium">
            <strong className="text-slate-900 font-black">Honda Vezel</strong> is accelerating fastest with <strong className="text-emerald-700 font-black">+124% demand surge</strong>, while <strong className="text-slate-900 font-black">Toyota C-HR</strong> surpassed Prius in volume at Week 9.
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500">
          <span>Qtr Volume: <strong className="text-slate-800">7,280 total units</strong></span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">Qtr Growth: <strong className="text-emerald-700">+56.8%</strong></span>
        </div>
      </div>

      {/* SVG Chart Canvas */}
      <div className="relative pt-2">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[680px]">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-auto overflow-visible select-none"
            >
              {/* Gradients definition for smooth area fills */}
              <defs>
                {TREND_TOP_5.map((model) => (
                  <linearGradient
                    key={`grad-${model.id}`}
                    id={`area-grad-${model.id}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={model.color} stopOpacity="0.22" />
                    <stop offset="85%" stopColor={model.color} stopOpacity="0.02" />
                    <stop offset="100%" stopColor={model.color} stopOpacity="0" />
                  </linearGradient>
                ))}
              </defs>

              {/* Horizontal Grid lines & Y Axis labels */}
              {[50, 100, 150, 200].map((tickVal) => {
                const yPos = getY(tickVal);
                return (
                  <g key={tickVal}>
                    <line
                      x1={paddingLeft}
                      y1={yPos}
                      x2={chartWidth - paddingRight}
                      y2={yPos}
                      stroke="#E2E8F0"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      strokeOpacity="0.75"
                    />
                    <text
                      x={paddingLeft - 10}
                      y={yPos + 3.5}
                      textAnchor="end"
                      className="text-[10.5px] font-bold fill-slate-400"
                    >
                      {tickVal}
                    </text>
                  </g>
                );
              })}

              {/* X Axis Week Labels */}
              {WEEKS_LABELS.map((week, idx) => {
                const xPos = getX(idx);
                const isSelected = hoveredWeekIdx === idx;
                return (
                  <g key={week}>
                    {/* Active week pill marker */}
                    {isSelected && (
                      <rect
                        x={xPos - 16}
                        y={chartHeight - 24}
                        width="32"
                        height="18"
                        rx="6"
                        fill="#0F172A"
                        className="transition-all"
                      />
                    )}
                    <text
                      x={xPos}
                      y={chartHeight - 11}
                      textAnchor="middle"
                      className={`text-[10.5px] transition-all cursor-pointer ${isSelected
                          ? 'fill-white font-black'
                          : 'fill-slate-400 hover:fill-slate-900 font-bold'
                        }`}
                      onClick={() => setHoveredWeekIdx(idx)}
                    >
                      {week}
                    </text>
                  </g>
                );
              })}

              {/* Vertical Guide Line on Hover */}
              {hoveredWeekIdx !== null && (
                <g>
                  <line
                    x1={getX(hoveredWeekIdx)}
                    y1={paddingTop - 10}
                    x2={getX(hoveredWeekIdx)}
                    y2={chartHeight - paddingBottom}
                    stroke="#94A3B8"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    className="transition-all duration-150"
                  />
                </g>
              )}

              {/* Area Fills under active lines */}
              {TREND_TOP_5.map((model) => {
                const isFocused = activeModelId === model.id;
                // If single model is selected, or if none selected show top model area fill
                const showArea = isFocused || (activeModelId === null && model.id === 'aqua');
                if (!showArea) return null;

                const areaPath = getSmoothAreaPath(model.values);
                return (
                  <path
                    key={`area-${model.id}`}
                    d={areaPath}
                    fill={`url(#area-grad-${model.id})`}
                    className="transition-opacity duration-300 pointer-events-none"
                  />
                );
              })}

              {/* Smooth Spline Lines for each model */}
              {TREND_TOP_5.map((model) => {
                const isHighlighted = activeModelId === model.id;
                const isFaded = activeModelId && !isHighlighted;
                const pathData = getSmoothLinePath(model.values);

                return (
                  <g
                    key={model.id}
                    className="transition-opacity duration-200"
                    opacity={isFaded ? 0.2 : 1}
                  >
                    {/* Background glow stroke for active model */}
                    {isHighlighted && (
                      <path
                        d={pathData}
                        fill="none"
                        stroke={model.color}
                        strokeWidth="7"
                        strokeOpacity="0.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}

                    {/* Main Spline Path */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke={model.color}
                      strokeWidth={isHighlighted ? 3.5 : 2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-all duration-200"
                    />

                    {/* Data dots on the spline */}
                    {model.values.map((val, idx) => {
                      const cx = getX(idx);
                      const cy = getY(val);
                      const isHoveredCol = hoveredWeekIdx === idx;

                      return (
                        <g key={idx}>
                          {isHoveredCol && (
                            <circle
                              cx={cx}
                              cy={cy}
                              r="7"
                              fill={model.color}
                              fillOpacity="0.2"
                              className="animate-pulse"
                            />
                          )}
                          <circle
                            cx={cx}
                            cy={cy}
                            r={isHoveredCol ? 4.5 : 2.5}
                            fill={isHoveredCol ? '#ffffff' : model.color}
                            stroke={model.color}
                            strokeWidth={isHoveredCol ? 2.5 : 1.5}
                            className="transition-all duration-150"
                          />
                        </g>
                      );
                    })}
                  </g>
                );
              })}

              {/* Interactive columns for hover detection */}
              {WEEKS_LABELS.map((_, idx) => {
                const colWidth = innerWidth / (WEEKS_LABELS.length - 1);
                const colX = getX(idx) - colWidth / 2;

                return (
                  <rect
                    key={idx}
                    x={Math.max(0, colX)}
                    y={paddingTop - 10}
                    width={colWidth}
                    height={innerHeight + 20}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredWeekIdx(idx)}
                    onClick={() => setHoveredWeekIdx(idx)}
                  />
                );
              })}
            </svg>
          </div>
        </div>

        {/* 5 Interactive Model Telemetry Cards */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar size={12} className="text-slate-400" />
              <span>{WEEKS_LABELS[hoveredWeekIdx]} Demand Breakdown:</span>
            </span>
            <span className="text-xs font-bold text-slate-700">
              Week Total: <strong className="text-slate-900 font-black text-sm">{totalAtHoveredWeek} units</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {sortedAtHoveredWeek.map((model) => {
              const currentVal = model.values[hoveredWeekIdx];
              const isSelected = activeModelId === model.id;
              const meta = modelsWithStats.find(m => m.id === model.id);

              return (
                <div
                  key={model.id}
                  onClick={() => setActiveModelId(isSelected ? null : model.id)}
                  className={`p-3 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col justify-between ${isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md -translate-y-0.5'
                      : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-2xs'
                    }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                        style={{ backgroundColor: model.color }}
                      />
                      <span className={`text-xs font-black truncate ${isSelected ? 'text-white' : 'text-slate-900'
                        }`}>
                        {model.name.replace('Toyota ', '').replace('Honda ', '').replace('Mazda ', '')}
                      </span>
                    </div>

                    <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded ${isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
                      }`}>
                      +{meta?.pctChange}%
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mt-1">
                    <div>
                      <span className={`text-lg font-black tracking-tight leading-none ${isSelected ? 'text-white' : 'text-slate-900'
                        }`}>
                        {currentVal}
                      </span>
                      <span className={`text-[10px] font-medium ml-1 ${isSelected ? 'text-slate-300' : 'text-slate-400'
                        }`}>
                        units
                      </span>
                    </div>

                    <span className={`text-[9.5px] font-medium ${isSelected ? 'text-slate-400' : 'text-slate-400'
                      }`}>
                      {WEEKS_LABELS[hoveredWeekIdx]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

