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
  Sparkles,
  CheckCircle2,
  X,
  Clock,
  ArrowUpRight,
  Calendar,
  ChevronDown
} from "lucide-react";

// Subcomponents
import DataSourceModal from "@/components/admin/DataSourceModal";
import AiWeeklyBriefCard from "@/components/admin/AiWeeklyBriefCard";
import MostWantedChart from "@/components/admin/MostWantedChart";
import DemandTrendLineChart from "@/components/admin/DemandTrendLineChart";
import RisingCoolingCards from "@/components/admin/RisingCoolingCards";
import SupplyDemandGapTable from "@/components/admin/SupplyDemandGapTable";
import UpcomingAuctionMatchSection from "@/components/admin/UpcomingAuctionMatchSection";
import DemandByRegionChart from "@/components/admin/DemandByRegionChart";
import CustomDateRangePopover, {
  formatRangeLabel,
  getDaysDifference
} from "@/components/admin/CustomDateRangePopover";

export default function DemandIntelligencePage() {
  // Filters State
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'custom'>('30d');
  const [customStartDate, setCustomStartDate] = useState<string>('2026-08-01');
  const [customEndDate, setCustomEndDate] = useState<string>('2026-09-28');
  const [isCustomDateOpen, setIsCustomDateOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedSegment, setSelectedSegment] = useState<string>('All');

  // Modals & Toasts
  const [isDataSourceModalOpen, setIsDataSourceModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 4000);
  };

  const customDays = getDaysDifference(customStartDate, customEndDate);

  // KPI Calculations adjusted dynamically by timeRange
  const kpiData = (() => {
    if (timeRange === '7d') {
      return {
        activeDealers: 138,
        dealersTrend: '+12%',
        activeWishLists: 295,
        wishListsTrend: '+16%',
        searches: 1420,
        searchesTrend: '+28%',
        unmetDemand: 980,
        unmetTrend: '+9%',
        periodLabel: 'last 7 days',
      };
    }
    if (timeRange === '90d') {
      return {
        activeDealers: 154,
        dealersTrend: '+22%',
        activeWishLists: 362,
        wishListsTrend: '+29%',
        searches: 14580,
        searchesTrend: '+42%',
        unmetDemand: 1340,
        unmetTrend: '+15%',
        periodLabel: 'last 90 days',
      };
    }
    if (timeRange === 'custom') {
      const scaledDealers = Math.min(168, Math.max(120, Math.round(130 + Math.sqrt(customDays) * 3.5)));
      const scaledWishLists = Math.min(420, Math.max(210, Math.round(240 + Math.sqrt(customDays) * 11)));
      const scaledSearches = Math.round(customDays * 162);
      const scaledUnmet = Math.min(1600, Math.max(750, Math.round(850 + Math.sqrt(customDays) * 42)));

      return {
        activeDealers: scaledDealers,
        dealersTrend: `+${Math.min(38, Math.max(6, Math.round(customDays * 0.4)))}%`,
        activeWishLists: scaledWishLists,
        wishListsTrend: `+${Math.min(40, Math.max(8, Math.round(customDays * 0.45)))}%`,
        searches: scaledSearches,
        searchesTrend: `+${Math.min(48, Math.max(10, Math.round(customDays * 0.6)))}%`,
        unmetDemand: scaledUnmet,
        unmetTrend: `+${Math.min(25, Math.max(5, Math.round(customDays * 0.25)))}%`,
        periodLabel: `${formatRangeLabel(customStartDate, customEndDate)} (${customDays}d)`,
      };
    }
    // Default '30d'
    return {
      activeDealers: 142,
      dealersTrend: '+18%',
      activeWishLists: 318,
      wishListsTrend: '+24%',
      searches: 4860,
      searchesTrend: '+31%',
      unmetDemand: 1120,
      unmetTrend: '+12%',
      periodLabel: 'last 30 days',
    };
  })();

  const regionsList = ['All', 'Auckland', 'Waikato', 'Wellington', 'Canterbury', 'Otago'];
  const segmentsList = ['All', 'Hybrid', 'SUV', 'Compact', 'Sedan/Wagon'];

  return (
    <AdminLayout>
      <div className="space-y-6 pb-12 max-w-full mx-auto">

        {/* Floating Action Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="bg-slate-900 text-white border border-slate-700 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-bold">
              <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 size={13} />
              </div>
              <span>{toastMessage}</span>
              <button
                onClick={() => setToastMessage(null)}
                className="text-slate-400 hover:text-white ml-2 p-0.5 cursor-pointer"
              >
                <X size={13} />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 1. HEADER AND FILTERS                                                    */}
        {/* ========================================================================= */}
        <div className="relative rounded-2xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-5 sm:p-6">

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              {/* Telemetry info tooltip */}
              <div className="flex items-center gap-2 mb-1.5">
                <div className="relative group inline-block">
                  <button
                    onClick={() => setIsDataSourceModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-600 text-[11px] font-semibold transition-colors cursor-pointer border border-slate-200"
                    title="Where does this data come from?"
                  >
                    <Info size={11} className="text-[#B30D12]" />
                    <span>Where the data comes from</span>
                  </button>

                  {/* Tooltip Hover Popover */}
                  <div className="absolute left-0 top-full mt-2 w-84 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-40 hidden group-hover:block animate-in fade-in duration-150">
                    <div className="text-xs font-black text-slate-900 mb-2 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                      <Sparkles size={13} className="text-[#B30D12]" />
                      <span>Demand Intelligence Sources</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
                      <li className="flex items-start gap-1.5">
                        <span className="text-[#B30D12] font-black">&bull;</span>
                        <span>Dealer wish lists</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-[#B30D12] font-black">&bull;</span>
                        <span>Dealer searches and &ldquo;Ask AI&rdquo; questions</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-[#B30D12] font-black">&bull;</span>
                        <span>Vehicles shortlisted and reservation requests</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-[#B30D12] font-black">&bull;</span>
                        <span>NZ market data: how fast each model is selling (days listed) and price trends</span>
                      </li>
                    </ul>
                    <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400 italic">
                      All numbers in the prototype are mock data. Click for details.
                    </div>
                  </div>
                </div>
              </div>

              {/* Title & Subtitle */}
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Demand Intelligence
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm font-medium mt-1 leading-normal max-w-2xl">
                What NZ dealers are looking for, and what Heiwa should source next
              </p>
            </div>

            {/* Filters: Time Range, NZ Region, Vehicle Segment */}
            <div className="w-full md:w-auto flex flex-wrap items-center gap-2.5 shrink-0">
              {/* Time Range Filter Pill Group */}
              <div className="w-full md:w-auto flex items-center gap-0.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setTimeRange('7d');
                    setIsCustomDateOpen(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${timeRange === '7d'
                    ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  last 7 days
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTimeRange('30d');
                    setIsCustomDateOpen(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${timeRange === '30d'
                    ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  30 days
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTimeRange('90d');
                    setIsCustomDateOpen(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${timeRange === '90d'
                    ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  90 days
                </button>

                {/* Custom Date Filter Option */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsCustomDateOpen((prev) => !prev)}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${timeRange === 'custom'
                      ? 'bg-white text-slate-900 shadow-2xs font-extrabold ring-1 ring-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                      }`}
                    title="Select custom date range"
                  >
                    <Calendar
                      size={13}
                      className={timeRange === 'custom' ? 'text-[#B30D12]' : 'text-slate-500'}
                    />
                    <span>
                      {timeRange === 'custom'
                        ? formatRangeLabel(customStartDate, customEndDate)
                        : 'Custom date'}
                    </span>
                    <ChevronDown
                      size={11}
                      className={`transition-transform duration-150 ${isCustomDateOpen ? 'rotate-180 text-slate-700' : 'text-slate-400'
                        }`}
                    />
                  </button>

                  {/* Custom Date Range Popover */}
                  <CustomDateRangePopover
                    isOpen={isCustomDateOpen}
                    onClose={() => setIsCustomDateOpen(false)}
                    startDate={customStartDate}
                    endDate={customEndDate}
                    onApply={(newStart, newEnd) => {
                      setCustomStartDate(newStart);
                      setCustomEndDate(newEnd);
                      setTimeRange('custom');
                      setIsCustomDateOpen(false);
                      const days = getDaysDifference(newStart, newEnd);
                      showToast(
                        `Date filter set to ${formatRangeLabel(newStart, newEnd)} (${days} ${days === 1 ? 'day' : 'days'
                        })`
                      );
                    }}
                  />
                </div>
              </div>

              {/* NZ Region Dropdown */}
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full md:w-auto px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 font-bold text-xs focus:border-[#B30D12] outline-none cursor-pointer shadow-2xs"
              >
                {regionsList.map(r => (
                  <option key={r} value={r}>NZ region: {r}</option>
                ))}
              </select>

              {/* Vehicle Segment Dropdown */}
              <select
                value={selectedSegment}
                onChange={(e) => setSelectedSegment(e.target.value)}
                className="w-full md:w-auto px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 font-bold text-xs focus:border-[#B30D12] outline-none cursor-pointer shadow-2xs"
              >
                {segmentsList.map(s => (
                  <option key={s} value={s}>Vehicle segment: {s}</option>
                ))}
              </select>

              {/* Reset if filtered */}
              {(selectedRegion !== 'All' || selectedSegment !== 'All' || timeRange !== '30d') && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRegion('All');
                    setSelectedSegment('All');
                    setTimeRange('30d');
                    setCustomStartDate('2026-08-01');
                    setCustomEndDate('2026-09-28');
                    setIsCustomDateOpen(false);
                  }}
                  className="text-xs font-bold text-[#B30D12] hover:text-[#940B0F] cursor-pointer ml-1 underline"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. KPI CARDS (4 IN A ROW)                                                */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">

          {/* Card 1: Active Dealers */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-slate-300 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Active dealers
              </span>
              <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 flex items-center justify-center font-bold">
                <Users size={16} />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 tracking-tight">
                  {kpiData.activeDealers}
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-0.5">
                  <TrendingUp size={11} /> {kpiData.dealersTrend}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                vs previous {timeRange === 'custom' ? `${customDays}d period` : 'period'}
              </p>
            </div>
          </div>

          {/* Card 2: Active Wish Lists */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-slate-300 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Active wish lists
              </span>
              <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 flex items-center justify-center font-bold">
                <Heart size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 tracking-tight">
                  {kpiData.activeWishLists}
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-0.5">
                  <TrendingUp size={12} /> {kpiData.wishListsTrend}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                vs previous {timeRange === 'custom' ? `${customDays}d period` : 'period'}
              </p>
            </div>
          </div>

          {/* Card 3: Dealer Searches */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-slate-300 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                {timeRange === 'custom'
                  ? `Dealer searches (${customDays}d)`
                  : timeRange === '7d'
                    ? 'Dealer searches (last 7 days)'
                    : timeRange === '90d'
                      ? 'Dealer searches (last 90 days)'
                      : 'Dealer searches this month'}
              </span>
              <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 flex items-center justify-center font-bold">
                <Search size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 tracking-tight">
                  {kpiData.searches.toLocaleString('en-US')}
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-0.5">
                  <TrendingUp size={12} /> {kpiData.searchesTrend}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                vs previous {timeRange === 'custom' ? `${customDays}d period` : 'period'}
              </p>
            </div>
          </div>

          {/* Card 4: Unmet Demand */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-red-200 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Unmet demand
              </span>
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#B30D12] border border-red-200 flex items-center justify-center font-bold">
                <AlertTriangle size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#B30D12] tracking-tight">
                  {kpiData.unmetDemand.toLocaleString('en-US')}
                  <span className="text-xs font-bold text-slate-600 ml-1">vehicles</span>
                </span>
                <span className="text-xs font-bold text-[#B30D12] bg-red-50 px-2 py-0.5 rounded-md border border-red-200 flex items-center gap-0.5">
                  <TrendingUp size={12} /> {kpiData.unmetTrend}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                Vehicles wanted but not currently in auction stock
              </p>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. AI WEEKLY BRIEF (HERO CARD, FULL WIDTH)                                */}
        {/* ========================================================================= */}
        <AiWeeklyBriefCard onNotifyToast={showToast} />

        {/* ========================================================================= */}
        {/* 4. MOST-WANTED MODELS (HORIZONTAL BAR CHART)                             */}
        {/* ========================================================================= */}
        <MostWantedChart
          segmentFilter={selectedSegment}
          activeDealersCount={kpiData.activeDealers}
        />

        {/* ========================================================================= */}
        {/* 5. DEMAND TREND (LINE CHART)                                             */}
        {/* ========================================================================= */}
        <DemandTrendLineChart />

        {/* ========================================================================= */}
        {/* 6. RISING AND FALLING DEMAND (TWO SIDE-BY-SIDE CARDS)                     */}
        {/* ========================================================================= */}
        <RisingCoolingCards />

        {/* ========================================================================= */}
        {/* 7. SUPPLY VS DEMAND GAP (TABLE, THE MOST IMPORTANT SECTION)               */}
        {/* ========================================================================= */}
        <SupplyDemandGapTable onNotifyToast={showToast} />

        {/* ========================================================================= */}
        {/* 8. UPCOMING AUCTION: DEALER MATCH AND NOTIFY                              */}
        {/* ========================================================================= */}
        <UpcomingAuctionMatchSection onNotifyToast={showToast} />

        {/* ========================================================================= */}
        {/* 9. DEMAND BY REGION (BAR CHART)                                          */}
        {/* ========================================================================= */}
        <DemandByRegionChart
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
        />

        {/* Footer Note */}
        <div className="pt-8 pb-4 text-center">
          <p className="text-xs text-slate-400 font-medium">
            Sample data for demonstration purposes
          </p>
        </div>

        {/* Full Telemetry Data Source Modal */}
        <DataSourceModal
          isOpen={isDataSourceModalOpen}
          onClose={() => setIsDataSourceModalOpen(false)}
        />

      </div>
    </AdminLayout>
  );
}
