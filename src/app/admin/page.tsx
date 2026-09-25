"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { 
  Users, 
  Heart, 
  Search, 
  AlertTriangle, 
  TrendingUp, 
  Info, 
  HelpCircle, 
  Sparkles, 
  Calendar, 
  Filter, 
  MapPin, 
  Layers, 
  Clock, 
  CheckCircle2, 
  X,
  Database,
  Building2,
  DollarSign,
  Radio,
  ArrowRight,
  Compass,
  Ship,
  Warehouse,
  BarChart3,
  SlidersHorizontal
} from "lucide-react";
import { GLOBAL_SETTINGS } from "@/lib/data";

// Subcomponents
import DataSourceModal from "@/components/admin/DataSourceModal";
import AiWeeklyBriefCard from "@/components/admin/AiWeeklyBriefCard";
import MostWantedChart from "@/components/admin/MostWantedChart";
import DemandTrendLineChart from "@/components/admin/DemandTrendLineChart";
import RisingCoolingCards from "@/components/admin/RisingCoolingCards";
import SupplyDemandGapTable from "@/components/admin/SupplyDemandGapTable";
import UpcomingAuctionMatchSection from "@/components/admin/UpcomingAuctionMatchSection";
import DemandByRegionChart from "@/components/admin/DemandByRegionChart";
import DemandSignalsEngine from "@/components/admin/DemandSignalsEngine";
import DemandForecastSection from "@/components/admin/DemandForecastSection";
import SupplyMatchingEngine from "@/components/admin/SupplyMatchingEngine";
import { useSyncStore } from "@/lib/syncStore";

export default function DemandIntelligencePage() {
  const { state: syncState } = useSyncStore();

  // Navigation View Tab: 'overview' | 'signals' | 'forecast' | 'matching'
  const [activeView, setActiveView] = useState<'overview' | 'signals' | 'forecast' | 'matching'>('overview');

  // Filters State
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedSegment, setSelectedSegment] = useState<string>('All');

  // Modals & Toasts
  const [isDataSourceModalOpen, setIsDataSourceModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 4500);
  };

  // KPI Calculations adjusted slightly by timeRange for dynamic demo feel
  const kpiData = {
    '7d': {
      activeDealers: 138,
      dealersTrend: '+12%',
      activeWishLists: Math.max(280, syncState.activeWishListsCount - 23),
      wishListsTrend: '+16%',
      searches: 1420,
      searchesTrend: '+28%',
      unmetDemand: Math.max(850, syncState.unmetDemandCount - 140),
      unmetTrend: '+9%',
    },
    '30d': {
      activeDealers: 142,
      dealersTrend: '+18%',
      activeWishLists: syncState.activeWishListsCount,
      wishListsTrend: '+24%',
      searches: syncState.dealerSearchesCount,
      searchesTrend: '+31%',
      unmetDemand: syncState.unmetDemandCount,
      unmetTrend: '+12%',
    },
    '90d': {
      activeDealers: 154,
      dealersTrend: '+22%',
      activeWishLists: syncState.activeWishListsCount + 44,
      wishListsTrend: '+29%',
      searches: syncState.dealerSearchesCount * 3,
      searchesTrend: '+42%',
      unmetDemand: syncState.unmetDemandCount + 220,
      unmetTrend: '+15%',
    }
  }[timeRange];

  const regionsList = ['All', 'Auckland', 'Waikato', 'Wellington', 'Canterbury', 'Otago'];
  const segmentsList = ['All', 'Hybrid', 'SUV', 'Compact', 'Sedan/Wagon'];

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-5 pb-12">
        
        {/* Floating Action Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-3.5 py-2.5 rounded-xl shadow-lg flex items-center gap-2.5 text-xs font-bold">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-300">
                <CheckCircle2 size={13} />
              </div>
              <span>{toastMessage}</span>
              <button 
                onClick={() => setToastMessage(null)}
                className="text-emerald-700 hover:text-emerald-900 ml-1.5 p-0.5 cursor-pointer"
              >
                <X size={13} />
              </button>
            </div>
          </div>
        )}

        {/* 1. Header & Filters Section (Light Red Brand Gradient, Compact) */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-50/70 via-rose-50/40 to-white border border-red-200/80 shadow-[0_2px_10px_-2px_rgba(179,13,18,0.05),0_1px_3px_rgba(0,0,0,0.02)] p-4 sm:p-4.5 transition-all">
          {/* Subtle Brand Crimson Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#B30D12] via-[#E23B40] to-rose-400" />

          {/* Ambient Subtle Glow */}
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-red-500/5 blur-3xl pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 pb-3.5 border-b border-red-100/90">
            <div>
              {/* Badge & Info Tooltip Trigger */}
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/90 border border-red-200 text-[10px] font-bold text-slate-800 shadow-2xs">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B30D12] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#B30D12]"></span>
                  </span>
                  AutoHub Demand Intelligence Platform (DIP)
                </span>
                
                {/* Where the data comes from info button */}
                <button
                  onClick={() => setIsDataSourceModalOpen(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100/70 hover:bg-red-100 text-[10px] font-bold text-[#B30D12] transition-colors cursor-pointer border border-red-200 shadow-2xs group"
                  title="Where does this data come from?"
                >
                  <Info size={10} className="text-[#B30D12]" />
                  <span>Telemetry Sources</span>
                </button>
              </div>

              {/* Page Title & Subtitle (Compact) */}
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                Demand Intelligence &amp; Sourcing Matrix
              </h1>
              <p className="text-slate-600 text-[11px] sm:text-xs font-medium mt-0.5 leading-normal max-w-2xl">
                Dealer wish lists and searches become demand signals, a forward forecast, and unmet demand, matched against supply.
              </p>
            </div>

            {/* Live FX & Currency Context */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <div className="px-3 py-1.5 bg-white/90 rounded-xl border border-red-200/80 text-xs shadow-2xs">
                <span className="text-slate-400 font-bold block text-[9px] uppercase tracking-wider">
                  FX BENCHMARK
                </span>
                <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1 font-mono">
                  1 NZD = {syncState.fxRateJpyNzd} JPY
                  <span className="text-[9px] text-emerald-800 font-bold bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                    Live
                  </span>
                </span>
              </div>

              <div className="px-3 py-1.5 bg-white/90 rounded-xl border border-red-200/80 text-xs shadow-2xs">
                <span className="text-slate-400 font-bold block text-[9px] uppercase tracking-wider">
                  PRE-AUCTION BATCH
                </span>
                <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B30D12] animate-pulse"></span>
                  USS Tokyo #39
                </span>
              </div>
            </div>
          </div>

          {/* Workflow Pipeline Transformation Navigator (Compact, Light Brand Gradient) */}
          <div className="pt-3 border-b border-red-100/90 pb-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {/* Step 1: Wishlists & Searches */}
              <button
                onClick={() => setActiveView('signals')}
                className={`p-2 sm:p-2.5 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-2.5 ${
                  activeView === 'signals'
                    ? 'bg-gradient-to-r from-red-100/80 via-white to-white border-[#B30D12] shadow-2xs ring-1 ring-[#B30D12]/20'
                    : 'bg-white/70 border-red-100/90 hover:bg-white hover:border-red-200'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-red-100 text-[#B30D12] flex items-center justify-center font-black shrink-0">
                  <Radio size={13} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Step 1</span>
                    <span className="text-[9px] text-slate-300">&bull;</span>
                    <span className="font-extrabold text-slate-900 text-xs truncate">Wish Lists &amp; Searches</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium truncate">
                    4,860 searches &bull; 318 orders
                  </div>
                </div>
              </button>

              {/* Step 2: Demand Signals Engine */}
              <button
                onClick={() => setActiveView('signals')}
                className={`p-2 sm:p-2.5 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-2.5 ${
                  activeView === 'signals'
                    ? 'bg-gradient-to-r from-red-100/80 via-white to-white border-[#B30D12] shadow-2xs ring-1 ring-[#B30D12]/20'
                    : 'bg-white/70 border-red-100/90 hover:bg-white hover:border-red-200'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-black shrink-0">
                  <Sparkles size={13} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Step 2</span>
                    <span className="text-[9px] text-slate-300">&bull;</span>
                    <span className="font-extrabold text-slate-900 text-xs truncate">Demand Signals</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium truncate">
                    Weighted 0–100 &bull; Scarcity
                  </div>
                </div>
              </button>

              {/* Step 3: Demand Forecast & Unmet Demand */}
              <button
                onClick={() => setActiveView('forecast')}
                className={`p-2 sm:p-2.5 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-2.5 ${
                  activeView === 'forecast'
                    ? 'bg-gradient-to-r from-red-100/80 via-white to-white border-[#B30D12] shadow-2xs ring-1 ring-[#B30D12]/20'
                    : 'bg-white/70 border-red-100/90 hover:bg-white hover:border-red-200'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-black shrink-0">
                  <TrendingUp size={13} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Step 3</span>
                    <span className="text-[9px] text-slate-300">&bull;</span>
                    <span className="font-extrabold text-slate-900 text-xs truncate">Forecast &amp; Unmet</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium truncate">
                    30/60/90d &bull; -1,120 deficit
                  </div>
                </div>
              </button>

              {/* Step 4: Matched Against Supply */}
              <button
                onClick={() => setActiveView('matching')}
                className={`p-2 sm:p-2.5 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-2.5 ${
                  activeView === 'matching'
                    ? 'bg-gradient-to-r from-red-100/80 via-white to-white border-[#B30D12] shadow-2xs ring-1 ring-[#B30D12]/20'
                    : 'bg-white/70 border-red-100/90 hover:bg-white hover:border-red-200'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-black shrink-0">
                  <Ship size={13} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Step 4</span>
                    <span className="text-[9px] text-slate-300">&bull;</span>
                    <span className="font-extrabold text-slate-900 text-xs truncate">Matched Supply</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium truncate">
                    Yard &bull; Ro-Ro &bull; Auctions
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Primary View Switcher & Filters Bar (Compact) */}
          <div className="pt-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* View Mode Pills with Red Brand Highlight */}
            <div className="flex items-center p-0.5 bg-slate-100/90 rounded-xl border border-slate-200/80 text-xs font-bold shrink-0">
              <button
                onClick={() => setActiveView('overview')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeView === 'overview'
                    ? 'bg-[#B30D12] text-white shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Executive Matrix
              </button>
              <button
                onClick={() => setActiveView('signals')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  activeView === 'signals'
                    ? 'bg-[#B30D12] text-white shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Radio size={11} />
                <span>Demand Signals</span>
              </button>
              <button
                onClick={() => setActiveView('forecast')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  activeView === 'forecast'
                    ? 'bg-[#B30D12] text-white shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TrendingUp size={11} />
                <span>Forecast &amp; Unmet</span>
              </button>
              <button
                onClick={() => setActiveView('matching')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  activeView === 'matching'
                    ? 'bg-[#B30D12] text-white shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Ship size={11} />
                <span>Supply Matching</span>
              </button>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Time Range Filter */}
              <div className="flex items-center gap-0.5 bg-white p-0.5 rounded-lg border border-red-200/80 text-[11px] font-bold shadow-2xs">
                {(['7d', '30d', '90d'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeRange(t)}
                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                      timeRange === t 
                        ? 'bg-red-50 text-[#B30D12] font-black' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Region Dropdown */}
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-2.5 py-1 bg-white border border-red-200/80 rounded-lg text-slate-800 font-bold text-[11px] focus:bg-white focus:border-[#B30D12] outline-none cursor-pointer shadow-2xs"
              >
                {regionsList.map(r => (
                  <option key={r} value={r}>Region: {r}</option>
                ))}
              </select>

              {/* Segment Dropdown */}
              <select
                value={selectedSegment}
                onChange={(e) => setSelectedSegment(e.target.value)}
                className="px-2.5 py-1 bg-white border border-red-200/80 rounded-lg text-slate-800 font-bold text-[11px] focus:bg-white focus:border-[#B30D12] outline-none cursor-pointer shadow-2xs"
              >
                {segmentsList.map(s => (
                  <option key={s} value={s}>Segment: {s}</option>
                ))}
              </select>

              {/* Quick Reset */}
              {(selectedRegion !== 'All' || selectedSegment !== 'All' || timeRange !== '30d') && (
                <button
                  onClick={() => {
                    setSelectedRegion('All');
                    setSelectedSegment('All');
                    setTimeRange('30d');
                  }}
                  className="text-[11px] font-bold text-[#B30D12] hover:text-[#940B0F] cursor-pointer ml-1"
                >
                  Reset
                </button>
              )}
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: EXECUTIVE OVERVIEW MATRIX (COMPACT)                               */}
        {/* ========================================================================= */}
        {activeView === 'overview' && (
          <div className="space-y-4 sm:space-y-5">
            
            {/* 2. Compact KPI Cards with Brand Red Light Gradients */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
              {/* Card 1: Active Dealers */}
              <div className="bg-gradient-to-br from-white via-white to-red-50/20 p-3 sm:p-3.5 rounded-xl border border-slate-200/90 hover:border-red-200 shadow-2xs transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Active Dealers
                  </span>
                  <div className="w-6 h-6 rounded-md bg-red-50 text-[#B30D12] border border-red-100 flex items-center justify-center font-bold">
                    <Users size={12} />
                  </div>
                </div>
                <div className="mt-1.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {kpiData.activeDealers}
                    </span>
                    <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200 flex items-center gap-0.5">
                      <TrendingUp size={9} /> {kpiData.dealersTrend}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-medium truncate">
                    Active telemetry &amp; buying criteria
                  </p>
                </div>
              </div>

              {/* Card 2: Active Wish Lists */}
              <div className="bg-gradient-to-br from-white via-white to-red-50/20 p-3 sm:p-3.5 rounded-xl border border-slate-200/90 hover:border-red-200 shadow-2xs transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Active Wish Lists
                  </span>
                  <div className="w-6 h-6 rounded-md bg-red-50 text-[#B30D12] border border-red-100 flex items-center justify-center font-bold">
                    <Heart size={12} />
                  </div>
                </div>
                <div className="mt-1.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {kpiData.activeWishLists}
                    </span>
                    <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200 flex items-center gap-0.5">
                      <TrendingUp size={9} /> {kpiData.wishListsTrend}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-medium truncate">
                    Avg 2.2 vehicle profiles per yard
                  </p>
                </div>
              </div>

              {/* Card 3: Dealer Searches This Month */}
              <div className="bg-gradient-to-br from-white via-white to-red-50/20 p-3 sm:p-3.5 rounded-xl border border-slate-200/90 hover:border-red-200 shadow-2xs transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Dealer Searches
                  </span>
                  <div className="w-6 h-6 rounded-md bg-red-50 text-[#B30D12] border border-red-100 flex items-center justify-center font-bold">
                    <Search size={12} />
                  </div>
                </div>
                <div className="mt-1.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {kpiData.searches.toLocaleString('en-US')}
                    </span>
                    <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200 flex items-center gap-0.5">
                      <TrendingUp size={9} /> {kpiData.searchesTrend}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-medium truncate">
                    Natural queries &amp; filters logged
                  </p>
                </div>
              </div>

              {/* Card 4: Unmet Demand (Light Red Gradient Highlight) */}
              <div className="bg-gradient-to-br from-white via-red-50/50 to-rose-50/70 p-3 sm:p-3.5 rounded-xl border border-red-200 shadow-2xs transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#B30D12] uppercase tracking-wider">
                    Unmet Demand
                  </span>
                  <div className="w-6 h-6 rounded-md bg-red-100 text-[#B30D12] border border-red-200 flex items-center justify-center font-bold">
                    <AlertTriangle size={12} />
                  </div>
                </div>
                <div className="mt-1.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-2xl font-black text-[#B30D12] tracking-tight">
                      {kpiData.unmetDemand.toLocaleString('en-US')}
                    </span>
                    <span className="text-[9px] font-bold text-[#B30D12] bg-red-100/90 px-1 py-0.2 rounded border border-red-200 flex items-center gap-0.5">
                      <TrendingUp size={9} /> {kpiData.unmetTrend}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600 mt-0.5 font-medium truncate">
                    Lots wanted but missing in auction stock
                  </p>
                </div>
              </div>
            </div>

            {/* 3. AI Weekly Brief (Light Red Brand Gradient) */}
            <AiWeeklyBriefCard onNotifyToast={showToast} />

            {/* 7. Supply vs Demand Gap (Table, Compact & Expandable) */}
            <SupplyDemandGapTable 
              onNotifyToast={showToast}
            />

            {/* 4. Most-Wanted Models & 5. Demand Trend (Two Columns, Compact) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4">
              <MostWantedChart segmentFilter={selectedSegment} />
              <DemandTrendLineChart />
            </div>

            {/* 6. Rising and Falling Demand */}
            <RisingCoolingCards />

            {/* 8. Upcoming Auction: Dealer Match and Notify */}
            <UpcomingAuctionMatchSection onNotifyToast={showToast} />

            {/* 9. Demand by Region */}
            <DemandByRegionChart 
              selectedRegion={selectedRegion}
              onSelectRegion={setSelectedRegion}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: DEMAND SIGNALS ENGINE                                             */}
        {/* ========================================================================= */}
        {activeView === 'signals' && (
          <DemandSignalsEngine />
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: DEMAND FORECAST & UNMET DEMAND MATRIX                             */}
        {/* ========================================================================= */}
        {activeView === 'forecast' && (
          <DemandForecastSection 
            onOpenSourcingTarget={(model) => {
              setActiveView('matching');
              showToast(`Navigated to supply matching for ${model}`);
            }}
          />
        )}

        {/* ========================================================================= */}
        {/* VIEW 4: MATCHED AGAINST SUPPLY                                            */}
        {/* ========================================================================= */}
        {activeView === 'matching' && (
          <SupplyMatchingEngine 
            onNotifyToast={showToast}
          />
        )}

        {/* Data Source Explanation Modal */}
        <DataSourceModal
          isOpen={isDataSourceModalOpen}
          onClose={() => setIsDataSourceModalOpen(false)}
        />

        {/* Small Disclaimer */}
        <div className="flex items-center justify-center gap-1.5 p-2.5 bg-white/70 border border-slate-200/70 rounded-xl text-center shadow-2xs">
          <Info size={12} className="text-slate-400 shrink-0" />
          <span className="text-[10px] text-slate-500 font-medium">
            Indicative figures based on current NZ market data. Final bid decisions rest with the dealer.
          </span>
        </div>

      </div>
    </AdminLayout>
  );
}
