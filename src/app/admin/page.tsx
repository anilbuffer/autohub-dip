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
  DollarSign
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
import { useSyncStore } from "@/lib/syncStore";

export default function DemandIntelligencePage() {
  const { state: syncState } = useSyncStore();

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
            <div className="bg-[#0B1322] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-semibold">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <CheckCircle2 size={14} />
              </div>
              <span>{toastMessage}</span>
              <button 
                onClick={() => setToastMessage(null)}
                className="text-slate-400 hover:text-white ml-2 p-1"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* 1. Header & Filters Section */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              {/* Badge & Info Tooltip Trigger */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#B30D12]/10 text-[#B30D12] border border-[#B30D12]/20 shadow-2xs">
                  Autohub & Heiwa Sourcing Intelligence
                </span>
                
                {/* Where the data comes from info button */}
                <button
                  onClick={() => setIsDataSourceModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer group"
                  title="Where does this data come from?"
                >
                  <Info size={12} className="text-blue-600 group-hover:scale-110 transition-transform" />
                  <span>Data Sources & Telemetry</span>
                </button>
              </div>

              {/* Page Title & Subtitle */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                Demand Intelligence
              </h1>
              <p className="text-slate-600 text-sm sm:text-base font-medium mt-1 max-w-3xl">
                What NZ dealers are looking for, and what Heiwa should source next.
              </p>
            </div>

            {/* Live FX & Currency Context */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <div className="px-4 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">
                  GLOBAL FX SETTING
                </span>
                <span className="font-black text-slate-900 text-sm flex items-center gap-1 font-mono">
                  1 NZD = {syncState.fxRateJpyNzd} JPY
                  <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    Live Feed
                  </span>
                </span>
              </div>

              <div className="px-4 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">
                  PRE-AUCTION BATCH
                </span>
                <span className="font-black text-blue-900 text-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                  USS Tokyo Dispatch #39
                </span>
              </div>
            </div>
          </div>

          {/* Filters Bar: Time Range, NZ Region, Vehicle Segment */}
          <div className="pt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              
              {/* Time Range Filter */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
                <span className="text-slate-400 pl-2 text-[10px] font-bold uppercase tracking-wider hidden sm:inline">
                  Time:
                </span>
                <button
                  onClick={() => setTimeRange('7d')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    timeRange === '7d' 
                      ? 'bg-white text-slate-900 shadow-2xs font-black' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Last 7 days
                </button>
                <button
                  onClick={() => setTimeRange('30d')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    timeRange === '30d' 
                      ? 'bg-white text-slate-900 shadow-2xs font-black' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  30 days
                </button>
                <button
                  onClick={() => setTimeRange('90d')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    timeRange === '90d' 
                      ? 'bg-white text-slate-900 shadow-2xs font-black' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  90 days
                </button>
              </div>

              {/* NZ Region Dropdown / Selector */}
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider hidden lg:inline">
                  Region:
                </span>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold text-xs focus:bg-white focus:border-[#1B2A4A] outline-none cursor-pointer"
                >
                  {regionsList.map(r => (
                    <option key={r} value={r}>Region: {r}</option>
                  ))}
                </select>
              </div>

              {/* Vehicle Segment Dropdown / Selector */}
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider hidden lg:inline">
                  Segment:
                </span>
                <select
                  value={selectedSegment}
                  onChange={(e) => setSelectedSegment(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold text-xs focus:bg-white focus:border-[#1B2A4A] outline-none cursor-pointer"
                >
                  {segmentsList.map(s => (
                    <option key={s} value={s}>Segment: {s}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Quick Filter Reset if active */}
            {(selectedRegion !== 'All' || selectedSegment !== 'All' || timeRange !== '30d') && (
              <button
                onClick={() => {
                  setSelectedRegion('All');
                  setSelectedSegment('All');
                  setTimeRange('30d');
                }}
                className="text-xs font-bold text-[#B30D12] hover:underline self-end md:self-center"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* 2. KPI Cards (4 in a row) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: Active Dealers */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover-lift">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                Active Dealers
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-100">
                <Users size={16} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {kpiData.activeDealers}
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-0.5">
                <TrendingUp size={11} /> {kpiData.dealersTrend}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Dealerships with active telemetry & buying criteria
            </p>
          </div>

          {/* Card 2: Active Wish Lists */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover-lift">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                Active Wish Lists
              </span>
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs border border-rose-100">
                <Heart size={16} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {kpiData.activeWishLists}
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-0.5">
                <TrendingUp size={11} /> {kpiData.wishListsTrend}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Avg 2.2 target vehicle profiles per dealership
            </p>
          </div>

          {/* Card 3: Dealer Searches This Month */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover-lift">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                Dealer Searches This Month
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs border border-purple-100">
                <Search size={16} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {kpiData.searches.toLocaleString('en-US')}
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-0.5">
                <TrendingUp size={11} /> {kpiData.searchesTrend}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Natural language queries & vehicle filters logged
            </p>
          </div>

          {/* Card 4: Unmet Demand */}
          <div className="bg-gradient-to-br from-white to-red-50/40 p-5 sm:p-6 rounded-3xl border border-red-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover-lift">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-[#B30D12] uppercase tracking-wider">
                Unmet Demand
              </span>
              <div className="w-8 h-8 rounded-xl bg-red-100 text-[#B30D12] flex items-center justify-center font-bold text-xs">
                <AlertTriangle size={16} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-[#B30D12] tracking-tight">
                {kpiData.unmetDemand.toLocaleString('en-US')}
              </span>
              <span className="text-xs font-bold text-[#B30D12] bg-red-100/80 px-2 py-0.5 rounded-full border border-red-200 flex items-center gap-0.5">
                <TrendingUp size={11} /> {kpiData.unmetTrend}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-2 font-medium">
              Vehicles wanted but not currently in auction stock
            </p>
          </div>
        </div>

        {/* 3. AI Weekly Brief (Hero Card, Full Width) */}
        <AiWeeklyBriefCard onNotifyToast={showToast} />

        {/* 7. Supply vs Demand Gap (Table, The Most Important Section) */}
        {/* Placed prominently near the top as per design notes: "The AI Weekly Brief and the supply vs demand gap table should be the first things the eye lands on" */}
        <SupplyDemandGapTable />

        {/* 4. Most-Wanted Models & 5. Demand Trend (Two Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

        {/* Data Source Explanation Modal */}
        <DataSourceModal
          isOpen={isDataSourceModalOpen}
          onClose={() => setIsDataSourceModalOpen(false)}
        />

        {/* Footer Note */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-medium text-slate-600">
              Sample data for demonstration purposes
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            AutoHeiwa Intelligence Engine · Developed for Heiwa Auto Co., Ltd. & Autohub NZ Sourcing Board
          </span>
        </div>

      </div>
    </AdminLayout>
  );
}
