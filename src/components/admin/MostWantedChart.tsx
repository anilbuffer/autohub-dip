"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { TOP_WANTED_MODELS, TopModelDemand } from '@/lib/demandIntelligenceData';
import {
  Users,
  TrendingUp,
  Sparkles,
  Filter,
  Trophy,
  Medal,
  Flame,
  Zap,
  Clock,
  LayoutGrid,
  List,
  ArrowUpRight,
  Car,
  Target,
  ArrowUpDown,
  Check
} from 'lucide-react';

interface MostWantedChartProps {
  segmentFilter?: string;
  activeDealersCount?: number;
}

// Vehicle photo and trim metadata mapping
const MODEL_METADATA: Record<string, { image: string; badge: string; gradient: string }> = {
  aqua: {
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=600&q=80',
    badge: '1.5L S / G Package',
    gradient: 'from-[#0284c7] to-[#38bdf8]',
  },
  chr: {
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=600&q=80',
    badge: '1.8L G LED Hybrid',
    gradient: 'from-[#B30D12] to-[#f43f5e]',
  },
  prius: {
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    badge: '1.8L S Touring / A Premium',
    gradient: 'from-[#0d9488] to-[#2dd4bf]',
  },
  vezel: {
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    badge: '1.5L e:HEV / Hybrid Z',
    gradient: 'from-[#6366f1] to-[#818cf8]',
  },
  fit: {
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80',
    badge: '1.5L e:HEV Home / Ness',
    gradient: 'from-[#8b5cf6] to-[#a78bfa]',
  },
  cx5: {
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80',
    badge: '2.5L / 2.2D L-Package AWD',
    gradient: 'from-[#d97706] to-[#fbbf24]',
  },
  note: {
    image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=600&q=80',
    badge: '1.2L e-POWER X / Medalist',
    gradient: 'from-[#0891b2] to-[#06b6d4]',
  },
  fielder: {
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    badge: '1.5L Hybrid G Edition',
    gradient: 'from-[#475569] to-[#64748b]',
  },
  swift: {
    image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=600&q=80',
    badge: '1.2L DualJet / Hybrid RS',
    gradient: 'from-[#ec4899] to-[#f472b6]',
  },
  axela: {
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80',
    badge: '20S Proactive Touring',
    gradient: 'from-[#64748b] to-[#94a3b8]',
  },
};

type SortField = 'demand' | 'turn' | 'margin';

export default function MostWantedChart({ segmentFilter = 'All', activeDealersCount = 142 }: MostWantedChartProps) {
  const [localSegment, setLocalSegment] = useState<string>(segmentFilter);
  const [sortBy, setSortBy] = useState<SortField>('demand');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Sync when prop changes
  useEffect(() => {
    if (segmentFilter) {
      setLocalSegment(segmentFilter);
    }
  }, [segmentFilter]);

  const segments = ['All', 'Hybrid', 'SUV', 'Compact', 'Sedan/Wagon'];

  // Filter models
  const filteredModels = useMemo(() => {
    let result = TOP_WANTED_MODELS.filter(item => {
      if (localSegment === 'All') return true;
      if (localSegment === 'Hybrid') return item.fuel.includes('Hybrid');
      return item.segment === localSegment;
    });

    // Sort models
    result.sort((a, b) => {
      if (sortBy === 'demand') return b.demandCount - a.demandCount;
      if (sortBy === 'turn') return a.turnDays - b.turnDays; // fastest first
      if (sortBy === 'margin') return b.avgMarginNzd - a.avgMarginNzd;
      return 0;
    });

    return result;
  }, [localSegment, sortBy]);

  const maxDemand = useMemo(() => {
    return Math.max(...TOP_WANTED_MODELS.map(m => m.demandCount), 1);
  }, []);

  const totalDemandUnits = useMemo(() => {
    return filteredModels.reduce((acc, curr) => acc + curr.demandCount, 0);
  }, [filteredModels]);

  const topPerformer = filteredModels[0];

  return (
    <div className="relative rounded-2xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-4 sm:p-6 overflow-hidden">

      {/* Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-[#B30D12] text-[10.5px] font-black uppercase tracking-wider border border-red-200/60">
              <Flame size={12} className="text-[#B30D12]" />
              Demand Leaderboard
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Updated 10m ago</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug">
            Most-wanted models
          </h3>
          <p className="text-xs text-slate-500 font-medium leading-normal mt-0.5 max-w-2xl">
            The top 10 models ranked by dealer demand across active wish lists, reservation requests, and verified buying interest.
          </p>
        </div>

        {/* Right Badges & View Switcher */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-center shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
            <Users size={13} className="text-[#B30D12]" />
            <span>{activeDealersCount} Active Dealers</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
            <Target size={13} className="text-emerald-600" />
            <span>{totalDemandUnits.toLocaleString()} Units Wanted</span>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 ml-1">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === 'grid'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
                }`}
              title="2-Column Card Grid"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === 'list'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
                }`}
              title="Compact Ranked List"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Control Strip: Segment Pills & Sorting */}
      <div className="pt-3.5 pb-2 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100/80">
        {/* Segment Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
            Segment:
          </span>
          {segments.map((seg) => {
            const count = TOP_WANTED_MODELS.filter(item => {
              if (seg === 'All') return true;
              if (seg === 'Hybrid') return item.fuel.includes('Hybrid');
              return item.segment === seg;
            }).length;

            const isActive = localSegment === seg;

            return (
              <button
                key={seg}
                type="button"
                onClick={() => setLocalSegment(seg)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${isActive
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600 hover:text-slate-900'
                  }`}
              >
                <span>{seg}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-slate-800 text-slate-200' : 'bg-slate-200/80 text-slate-500'
                  }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-1.5 self-start md:self-auto shrink-0">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Sort:
          </span>
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setSortBy('demand')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${sortBy === 'demand'
                ? 'bg-white text-slate-900 shadow-2xs font-black'
                : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              Demand
            </button>
            <button
              type="button"
              onClick={() => setSortBy('turn')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${sortBy === 'turn'
                ? 'bg-white text-slate-900 shadow-2xs font-black'
                : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              Fastest Turn
            </button>
            <button
              type="button"
              onClick={() => setSortBy('margin')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${sortBy === 'margin'
                ? 'bg-white text-slate-900 shadow-2xs font-black'
                : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              Top Margin
            </button>
          </div>
        </div>
      </div>

      {/* Highlights Strip */}
      {topPerformer && (
        <div className="my-3 px-3.5 py-2 rounded-xl bg-gradient-to-r from-slate-50/60 via-slate-50 to-slate-50/40 border border-slate-100/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#B30D12] text-white flex items-center justify-center shrink-0">
              <Trophy size={11} className="text-amber-300" />
            </span>
            <span className="text-slate-700 font-medium">
              <strong className="text-slate-900 font-extrabold">{topPerformer.fullName}</strong> is currently Heiwa&apos;s #1 requested vehicle with <strong className="text-[#B30D12] font-black">{topPerformer.demandCount} units</strong> in demand across <strong className="text-slate-900">{topPerformer.dealersCount} dealers</strong>.
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium shrink-0">
            <span className="flex items-center gap-1">
              <Clock size={11} className="text-amber-600" /> Avg Sell Speed: <strong className="text-slate-800">12–15 days</strong>
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp size={11} className="text-emerald-600" /> Top Model Margin: <strong className="text-emerald-700">NZ$4,100</strong>
            </span>
          </div>
        </div>
      )}

      {/* Main Content: Card Grid View (Responsive 2 Columns) */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 pt-1">
          {filteredModels.map((model, idx) => {
            const widthPct = Math.round((model.demandCount / maxDemand) * 100);
            const isHovered = hoveredId === model.id;
            const meta = MODEL_METADATA[model.id] || {
              image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=600&q=80',
              badge: `${model.fuel} Package`,
              gradient: 'from-[#B30D12] to-[#ef4444]'
            };

            const isTop1 = idx === 0 && sortBy === 'demand';
            const isTop2 = idx === 1 && sortBy === 'demand';
            const isTop3 = idx === 2 && sortBy === 'demand';

            return (
              <div
                key={model.id}
                onMouseEnter={() => setHoveredId(model.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`relative rounded-xl border transition-all duration-200 p-3.5 sm:p-4 flex flex-col justify-between overflow-hidden group ${isHovered
                  ? 'bg-white border-slate-300 shadow-md -translate-y-0.5'
                  : isTop1
                    ? 'bg-gradient-to-br from-red-50/25 via-white to-white border-red-200/90 shadow-2xs'
                    : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-[0_1px_2px_rgba(0,0,0,0.02)]'
                  }`}
              >
                {/* Top Corner Rank Glow for Top 3 */}
                {isTop1 && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-red-500/10 to-transparent pointer-events-none rounded-tr-xl" />
                )}

                {/* 1. Header Row of the Card */}
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Vehicle Thumbnail with Rank Overlay */}
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-300">
                        <img
                          src={meta.image}
                          alt={model.fullName}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {/* Rank Badge inside/over Thumbnail */}
                        <div className="absolute top-1 left-1">
                          <span className={`w-5 h-5 rounded-md flex items-center justify-center font-black text-[10px] shadow-xs ${isTop1
                            ? 'bg-gradient-to-br from-[#B30D12] to-[#800A0D] text-white'
                            : isTop2
                              ? 'bg-slate-800 text-white'
                              : isTop3
                                ? 'bg-amber-600 text-white'
                                : 'bg-black/70 backdrop-blur-xs text-white'
                            }`}>
                            {idx + 1}
                          </span>
                        </div>
                      </div>

                      {/* Title, Make, & Trim */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                            {model.make}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[10px] font-medium text-slate-500 truncate">
                            {meta.badge}
                          </span>
                        </div>

                        <h4 className="font-black text-slate-900 text-sm tracking-tight truncate group-hover:text-[#B30D12] transition-colors mt-0.5">
                          {model.fullName}
                        </h4>

                        {/* Attribute Badges */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                          <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold border flex items-center gap-1 ${model.fuel.includes('Hybrid')
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}>
                            {model.fuel.includes('Hybrid') && <Zap size={9} className="text-emerald-600 fill-emerald-600" />}
                            {model.fuel}
                          </span>

                          <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            {model.segment}
                          </span>

                          {model.turnDays <= 15 && (
                            <span className="px-1.5 py-0.5 rounded text-[9.5px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-0.5">
                              <Flame size={9} className="text-amber-600" /> Fast Mover
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Big Demand Number */}
                    <div className="text-right shrink-0">
                      <div className="flex items-baseline justify-end gap-1">
                        <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                          {model.demandCount}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          units
                        </span>
                      </div>
                      <div className="text-[10.5px] text-slate-500 font-semibold mt-1">
                        <strong className="text-slate-800">{model.dealersCount}</strong> dealers
                      </div>
                    </div>
                  </div>

                  {/* 2. Visual Progress Bar */}
                  <div className="mt-3.5 space-y-1">
                    <div className="flex items-center justify-between text-[10.5px] font-semibold text-slate-500">
                      <span>Demand Intensity</span>
                      <span className="font-extrabold text-slate-700">{widthPct}% index</span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-100">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r ${meta.gradient}`}
                        style={{
                          width: `${widthPct}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Bottom Intelligence Strip */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3 text-[11px] text-slate-600">
                    <div className="flex items-center gap-1 font-medium">
                      <Clock size={11} className="text-slate-400" />
                      <span>Turn: <strong className="text-slate-900 font-bold">{model.turnDays}d</strong></span>
                    </div>

                    <div className="flex items-center gap-1 font-medium">
                      <TrendingUp size={11} className="text-emerald-600" />
                      <span>Margin: <strong className="text-emerald-700 font-bold">+NZ${model.avgMarginNzd.toLocaleString()}</strong></span>
                    </div>
                  </div>

                  {/* Match Stock Action Link */}
                  <Link
                    href={`/admin/vehicles?search=${encodeURIComponent(model.name)}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold text-[#B30D12] bg-red-50 hover:bg-[#B30D12] hover:text-white border border-red-200/70 transition-all cursor-pointer group/btn"
                    title={`View stock and auction inventory for ${model.fullName}`}
                  >
                    <span>Match Stock</span>
                    <ArrowUpRight size={12} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Main Content: Compact Ranked List View */
        <div className="pt-2 space-y-1.5">
          {filteredModels.map((model, idx) => {
            const widthPct = Math.round((model.demandCount / maxDemand) * 100);
            const isHovered = hoveredId === model.id;
            const meta = MODEL_METADATA[model.id] || {
              image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=600&q=80',
              badge: `${model.fuel} Package`,
              gradient: 'from-[#B30D12] to-[#ef4444]'
            };

            return (
              <div
                key={model.id}
                onMouseEnter={() => setHoveredId(model.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`p-2.5 sm:p-3 rounded-xl transition-all duration-150 cursor-pointer border flex items-center justify-between gap-3 ${isHovered
                  ? 'bg-red-50/40 border-red-200 shadow-2xs'
                  : 'bg-white border-slate-100 hover:border-slate-200'
                  }`}
              >
                {/* Left: Rank, Image, Model Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center font-black text-[11px] shrink-0 ${idx === 0
                    ? 'bg-gradient-to-br from-[#B30D12] to-[#800A0D] text-white shadow-2xs'
                    : idx === 1
                      ? 'bg-slate-700 text-white'
                      : idx === 2
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                    {idx + 1}
                  </span>

                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0 hidden sm:block">
                    <img
                      src={meta.image}
                      alt={model.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">
                        {model.fullName}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                        {model.fuel}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium hidden md:inline">
                        {model.segment}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                      {meta.badge}
                    </div>
                  </div>
                </div>

                {/* Right: Metrics & Progress Bar */}
                <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                  <div className="hidden md:block text-right">
                    <span className="text-[10px] text-slate-400 font-medium block">Dealers</span>
                    <span className="font-black text-slate-800 text-xs">{model.dealersCount}</span>
                  </div>

                  <div className="hidden lg:block text-right">
                    <span className="text-[10px] text-slate-400 font-medium block">Avg Turn</span>
                    <span className="font-bold text-slate-700 text-xs">{model.turnDays} days</span>
                  </div>

                  <div className="hidden sm:block text-right">
                    <span className="text-[10px] text-slate-400 font-medium block">Est Margin</span>
                    <span className="font-bold text-emerald-700 text-xs">+NZ${model.avgMarginNzd.toLocaleString()}</span>
                  </div>

                  {/* Fixed Width Demand Bar */}
                  <div className="w-24 sm:w-36 text-right">
                    <div className="flex items-baseline justify-end gap-1 mb-1">
                      <span className="font-black text-slate-900 text-xs sm:text-sm">{model.demandCount}</span>
                      <span className="text-[10px] text-slate-500 font-medium">units</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${meta.gradient}`}
                        style={{
                          width: `${widthPct}%`,
                        }}
                      />
                    </div>
                  </div>

                  <Link
                    href={`/admin/vehicles?search=${encodeURIComponent(model.name)}`}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-[#B30D12] hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                    title="Match Stock"
                  >
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Info Note */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-medium">
        <span>Based on telemetry from {activeDealersCount} licensed NZ car dealerships</span>
        <span className="flex items-center gap-1.5">
          <Sparkles size={11} className="text-[#B30D12]" />
          Priority recommendation: Stock up on <strong>Toyota Aqua</strong> & <strong>Toyota C-HR</strong>
        </span>
      </div>
    </div>
  );
}

