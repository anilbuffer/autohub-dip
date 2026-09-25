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
      <div className="space-y-8 pb-20">
        
        {/* Floating Action Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-bold">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-300">
                <CheckCircle2 size={14} />
              </div>
              <span>{toastMessage}</span>
              <button 
                onClick={() => setToastMessage(null)}
                className="text-emerald-700 hover:text-emerald-900 ml-2 p-1 cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* 1. Header & Filters Section */}
        <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.06),0_1px_3px_rgba(15,23,42,0.03)] p-5 sm:p-6 transition-all">
          {/* Subtle Brand Crimson Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#B30D12] via-[#E23B40] to-rose-400/20" />

          {/* Ambient Background Glow */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-gradient-to-br from-rose-500/[0.04] to-transparent blur-3xl pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-5 border-b border-slate-100">
            <div>
              {/* Badge & Info Tooltip Trigger */}
              <div className="flex flex-wrap items-center gap-2 mb-2.5">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/90 border border-slate-200/80 text-[11px] font-semibold text-slate-700 shadow-2xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B30D12] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B30D12]"></span>
                  </span>
                  AutoHub Demand Intelligence Platform (DIP)
                </span>
                
                {/* Where the data comes from info button */}
                <button
                  onClick={() => setIsDataSourceModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 hover:bg-red-100 text-[11px] font-semibold text-red-600 hover:text-red-900 transition-colors cursor-pointer border border-red-200/80 shadow-2xs group"
                  title="Where does this data come from?"
                >
                  <Info size={11} className="text-[#B30D12] group-hover:scale-110 transition-transform" />
                  <span>Data Sources &amp; Telemetry</span>
                </button>
              </div>

              {/* Page Title & Subtitle */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Demand Intelligence &amp; Sourcing Matrix
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm font-normal mt-1 leading-relaxed max-w-3xl">
                Dealer wish lists and searches become demand signals, a forward demand forecast, and unmet demand, matched against supply.
              </p>
            </div>

            {/* Live FX & Currency Context */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <div className="px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs shadow-2xs">
                <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">
                  GLOBAL FX BENCHMARK
                </span>
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5 font-mono">
                  1 NZD = {syncState.fxRateJpyNzd} JPY
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    Live Feed
                  </span>
                </span>
              </div>

              <div className="px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs shadow-2xs">
                <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">
                  PRE-AUCTION BATCH
                </span>
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#B30D12] animate-pulse"></span>
                  USS Tokyo Dispatch #39
                </span>
              </div>
            </div>
          </div>

          {/* Workflow Pipeline Transformation Navigator */}
          <div className="pt-4 border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Demand Intelligence Pipeline Workflow
              </span>
              <span className="text-[10px] font-bold text-[#B30D12]">
                Interactive Stages
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {/* Step 1: Wishlists & Searches */}
              <button
                onClick={() => setActiveView('signals')}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  activeView === 'signals'
                    ? 'bg-red-50/70 border-[#B30D12] shadow-xs ring-1 ring-[#B30D12]/20'
                    : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Step 1</span>
                  <div className="w-6 h-6 rounded-lg bg-red-100 text-[#B30D12] flex items-center justify-center font-bold">
                    <Radio size={12} />
                  </div>
                </div>
                <div className="font-black text-slate-900 text-xs sm:text-sm">
                  Wish Lists &amp; Searches
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  4,860 searches &bull; 318 wishlists
                </div>
              </button>

              {/* Step 2: Demand Signals Engine */}
              <button
                onClick={() => setActiveView('signals')}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  activeView === 'signals'
                    ? 'bg-blue-50/70 border-blue-500 shadow-xs ring-1 ring-blue-500/20'
                    : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Step 2</span>
                  <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <Sparkles size={12} />
                  </div>
                </div>
                <div className="font-black text-slate-900 text-xs sm:text-sm">
                  Demand Signals Engine
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Weighted scoring (0-100) &bull; Intent
                </div>
              </button>

              {/* Step 3: Demand Forecast & Unmet Demand */}
              <button
                onClick={() => setActiveView('forecast')}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  activeView === 'forecast'
                    ? 'bg-amber-50/70 border-amber-500 shadow-xs ring-1 ring-amber-500/20'
                    : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Step 3</span>
                  <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <TrendingUp size={12} />
                  </div>
                </div>
                <div className="font-black text-slate-900 text-xs sm:text-sm">
                  Forecast &amp; Unmet Gap
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  30/60/90d AI &bull; -1,120 units gap
                </div>
              </button>

              {/* Step 4: Matched Against Supply */}
              <button
                onClick={() => setActiveView('matching')}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  activeView === 'matching'
                    ? 'bg-emerald-50/70 border-emerald-500 shadow-xs ring-1 ring-emerald-500/20'
                    : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Step 4</span>
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Ship size={12} />
                  </div>
                </div>
                <div className="font-black text-slate-900 text-xs sm:text-sm">
                  Matched Against Supply
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Yard Stock &bull; Ro-Ro &bull; Auctions
                </div>
              </button>
            </div>
          </div>

          {/* Primary View Switcher & Global Filters Bar */}
          <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* View Modes */}
            <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold shrink-0">
              <button
                onClick={() => setActiveView('overview')}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeView === 'overview'
                    ? 'bg-white text-slate-900 shadow-2xs font-black'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Executive Matrix
              </button>
              <button
                onClick={() => setActiveView('signals')}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                  activeView === 'signals'
                    ? 'bg-white text-[#B30D12] shadow-2xs font-black'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Radio size={12} />
                <span>Demand Signals</span>
              </button>
              <button
                onClick={() => setActiveView('forecast')}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                  activeView === 'forecast'
                    ? 'bg-white text-[#B30D12] shadow-2xs font-black'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <TrendingUp size={12} />
                <span>Forecast &amp; Unmet</span>
              </button>
              <button
                onClick={() => setActiveView('matching')}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                  activeView === 'matching'
                    ? 'bg-white text-emerald-800 shadow-2xs font-black'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Ship size={12} />
                <span>Supply Matching</span>
              </button>
            </div>

            {/* Filters Bar: Time Range, NZ Region, Vehicle Segment */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Time Range Filter */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                <button
                  onClick={() => setTimeRange('7d')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    timeRange === '7d' 
                      ? 'bg-white text-slate-900 shadow-2xs font-bold' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  7d
                </button>
                <button
                  onClick={() => setTimeRange('30d')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    timeRange === '30d' 
                      ? 'bg-white text-slate-900 shadow-2xs font-bold' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  30d
                </button>
                <button
                  onClick={() => setTimeRange('90d')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    timeRange === '90d' 
                      ? 'bg-white text-slate-900 shadow-2xs font-bold' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  90d
                </button>
              </div>

              {/* NZ Region Dropdown */}
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold text-xs focus:bg-white focus:border-[#B30D12] outline-none cursor-pointer"
              >
                {regionsList.map(r => (
                  <option key={r} value={r}>Region: {r}</option>
                ))}
              </select>

              {/* Vehicle Segment Dropdown */}
              <select
                value={selectedSegment}
                onChange={(e) => setSelectedSegment(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold text-xs focus:bg-white focus:border-[#B30D12] outline-none cursor-pointer"
              >
                {segmentsList.map(s => (
                  <option key={s} value={s}>Segment: {s}</option>
                ))}
              </select>

              {/* Quick Filter Reset */}
              {(selectedRegion !== 'All' || selectedSegment !== 'All' || timeRange !== '30d') && (
                <button
                  onClick={() => {
                    setSelectedRegion('All');
                    setSelectedSegment('All');
                    setTimeRange('30d');
                  }}
                  className="text-xs font-bold text-[#B30D12] hover:text-[#940B0F] cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: EXECUTIVE OVERVIEW MATRIX (DEFAULT COMPLETE DASHBOARD)           */}
        {/* ========================================================================= */}
        {activeView === 'overview' && (
          <div className="space-y-8">
            
            {/* 2. KPI Cards matching Dealer panel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Card 1: Active Dealers */}
              <div className="bg-white p-4 sm:p-4.5 rounded-xl border border-slate-200/80 shadow-[0_2px_10px_-2px_rgba(15,23,42,0.05),0_1px_3px_rgba(15,23,42,0.02)] hover:shadow-[0_6px_16px_-3px_rgba(15,23,42,0.08),0_2px_6px_rgba(15,23,42,0.03)] hover:border-slate-300/80 transition-all duration-200 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Active Dealers
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-red-50 text-[#B30D12] border border-red-100 flex items-center justify-center font-bold shadow-2xs">
                    <Users size={14} />
                  </div>
                </div>
                <div className="mt-2.5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      {kpiData.activeDealers}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60 shadow-2xs flex items-center gap-0.5">
                      <TrendingUp size={10} /> {kpiData.dealersTrend}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">
                    Active telemetry &amp; buying criteria
                  </p>
                </div>
              </div>

              {/* Card 2: Active Wish Lists */}
              <div className="bg-white p-4 sm:p-4.5 rounded-xl border border-slate-200/80 shadow-[0_2px_10px_-2px_rgba(15,23,42,0.05),0_1px_3px_rgba(15,23,42,0.02)] hover:shadow-[0_6px_16px_-3px_rgba(15,23,42,0.08),0_2px_6px_rgba(15,23,42,0.03)] hover:border-slate-300/80 transition-all duration-200 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Active Wish Lists
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-red-50 text-[#B30D12] border border-red-100 flex items-center justify-center font-bold shadow-2xs">
                    <Heart size={14} />
                  </div>
                </div>
                <div className="mt-2.5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      {kpiData.activeWishLists}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60 shadow-2xs flex items-center gap-0.5">
                      <TrendingUp size={10} /> {kpiData.wishListsTrend}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">
                    Avg 2.2 vehicle profiles per yard
                  </p>
                </div>
              </div>

              {/* Card 3: Dealer Searches This Month */}
              <div className="bg-white p-4 sm:p-4.5 rounded-xl border border-slate-200/80 shadow-[0_2px_10px_-2px_rgba(15,23,42,0.05),0_1px_3px_rgba(15,23,42,0.02)] hover:shadow-[0_6px_16px_-3px_rgba(15,23,42,0.08),0_2px_6px_rgba(15,23,42,0.03)] hover:border-slate-300/80 transition-all duration-200 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Dealer Searches
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-red-50 text-[#B30D12] border border-red-100 flex items-center justify-center font-bold shadow-2xs">
                    <Search size={14} />
                  </div>
                </div>
                <div className="mt-2.5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      {kpiData.searches.toLocaleString('en-US')}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60 shadow-2xs flex items-center gap-0.5">
                      <TrendingUp size={10} /> {kpiData.searchesTrend}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">
                    Natural queries &amp; filters logged
                  </p>
                </div>
              </div>

              {/* Card 4: Unmet Demand */}
              <div className="bg-white p-4 sm:p-4.5 rounded-xl border border-red-200/90 shadow-[0_2px_10px_-2px_rgba(179,13,18,0.06),0_1px_3px_rgba(179,13,18,0.03)] hover:shadow-[0_6px_16px_-3px_rgba(179,13,18,0.1)] hover:border-red-300 transition-all duration-200 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#B30D12] uppercase tracking-wider">
                    Unmet Demand
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-red-50 text-[#B30D12] border border-red-100 flex items-center justify-center font-bold shadow-2xs">
                    <AlertTriangle size={14} />
                  </div>
                </div>
                <div className="mt-2.5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#B30D12] tracking-tight">
                      {kpiData.unmetDemand.toLocaleString('en-US')}
                    </span>
                    <span className="text-[10px] font-bold text-[#B30D12] bg-red-100/80 px-1.5 py-0.5 rounded border border-red-200 flex items-center gap-0.5">
                      <TrendingUp size={10} /> {kpiData.unmetTrend}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 font-medium">
                    Lots wanted but missing in auction stock
                  </p>
                </div>
              </div>
            </div>

            {/* 3. AI Weekly Brief (Hero Card, Full Width) */}
            <AiWeeklyBriefCard onNotifyToast={showToast} />

            {/* 7. Supply vs Demand Gap (Table, The Central Piece with Expandable Breakdown) */}
            <SupplyDemandGapTable 
              onNotifyToast={showToast}
            />

            {/* 4. Most-Wanted Models & 5. Demand Trend (Two Columns) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Section 4: Most-Wanted Models (Horizontal Bar Chart) */}
              <MostWantedChart segmentFilter={selectedSegment} />

              {/* Section 5: Demand Trend (12-Week Multi-Line Chart) */}
              <DemandTrendLineChart />
            </div>

            {/* 6. Rising and Falling Demand (Two Side-by-Side Cards) */}
            <RisingCoolingCards />

            {/* 8. Upcoming Auction: Dealer Match and Notify */}
            <UpcomingAuctionMatchSection onNotifyToast={showToast} />

            {/* 9. Demand by Region (Bar Chart) */}
            <DemandByRegionChart 
              selectedRegion={selectedRegion}
              onSelectRegion={setSelectedRegion}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: DEMAND SIGNALS ENGINE (WISH LISTS & SEARCHES CONVERSION)          */}
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
        {/* VIEW 4: MATCHED AGAINST SUPPLY (YARD, RO-RO & LIVE JAPAN AUCTIONS)        */}
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
        <div className="flex items-center justify-center gap-2 p-3 bg-white/70 border border-slate-200/70 rounded-xl text-center shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
          <Info size={13} className="text-slate-400 shrink-0" />
          <span className="text-[11px] text-slate-500 font-medium">
            Indicative figures based on current NZ market data. Final bid decisions rest with the dealer.
          </span>
        </div>

      </div>
    </AdminLayout>
  );
}
