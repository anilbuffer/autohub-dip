"use client";

import React, { useState, useMemo } from 'react';
import { SUPPLY_DEMAND_GAP, SupplyGapItem, UPCOMING_AUCTION_MATCHES } from '@/lib/demandIntelligenceData';
import { 
  Zap, 
  ArrowUpDown, 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft,
  ChevronRight,
  Sparkles, 
  AlertCircle, 
  Clock, 
  DollarSign, 
  Search,
  Filter,
  CheckCircle2,
  Ship,
  ExternalLink,
  Warehouse,
  Radio,
  Building2,
  Send,
  Compass,
  Users
} from 'lucide-react';
import Image from 'next/image';
import MatchedDealersDrawer from './MatchedDealersDrawer';

interface SupplyDemandGapTableProps {
  onSelectModel?: (modelName: string) => void;
  onNotifyToast?: (msg: string) => void;
}

type SortField = 'unmetGap' | 'demandUnits' | 'currentStockUnits' | 'coveragePct' | 'avgDaysToSell' | 'avgDealerMarginNzd';

function getPaginationPages(currentPage: number, totalPages: number) {
  if (totalPages <= 6) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (currentPage <= 3) {
    return [1, 2, 3, 4, '...', totalPages];
  }
  if (currentPage >= totalPages - 2) {
    return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
}

export default function SupplyDemandGapTable({ onSelectModel, onNotifyToast }: SupplyDemandGapTableProps) {
  const [filterTag, setFilterTag] = useState<'All' | 'Source more' | 'Balanced' | 'Oversupplied'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('unmetGap');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [expandedModelId, setExpandedModelId] = useState<string | null>('chr');
  const [drawerVehicle, setDrawerVehicle] = useState<any | null>(null);

  // Pagination matching Dealer panel design system
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterTag, searchQuery, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const processedItems = useMemo(() => {
    let items = [...SUPPLY_DEMAND_GAP];

    // Filter by recommendation tag
    if (filterTag !== 'All') {
      items = items.filter(item => item.recommendation === filterTag);
    }

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      items = items.filter(item => 
        item.model.toLowerCase().includes(q) || 
        item.make.toLowerCase().includes(q) ||
        item.badge.toLowerCase().includes(q)
      );
    }

    // Sort
    items.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return items;
  }, [filterTag, searchQuery, sortField, sortDirection]);

  const totalPages = Math.ceil(processedItems.length / ITEMS_PER_PAGE) || 1;
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const paginatedItems = useMemo(() => {
    return processedItems.slice(
      (validCurrentPage - 1) * ITEMS_PER_PAGE,
      validCurrentPage * ITEMS_PER_PAGE
    );
  }, [processedItems, validCurrentPage]);

  // Coverage progress bar color helper
  const getCoverageBadge = (pct: number) => {
    if (pct < 40) {
      return {
        barColor: 'bg-rose-500',
        textColor: 'text-rose-700 bg-rose-50 border-rose-200',
        label: 'Severe Deficit'
      };
    } else if (pct <= 75) {
      return {
        barColor: 'bg-amber-500',
        textColor: 'text-amber-700 bg-amber-50 border-amber-200',
        label: 'Moderate'
      };
    } else {
      return {
        barColor: 'bg-emerald-500',
        textColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        label: 'Well Stocked'
      };
    }
  };

  // Recommendation tag badge helper
  const getRecBadge = (rec: SupplyGapItem['recommendation']) => {
    if (rec === 'Source more') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-[#B30D12]/10 text-[#B30D12] border border-[#B30D12]/20 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B30D12] animate-pulse"></span>
          Source more
        </span>
      );
    } else if (rec === 'Balanced') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Balanced
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
          Oversupplied
        </span>
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      
      {/* Callout Banner with Red Brand Light Gradient (Compact) */}
      <div className="p-3.5 sm:p-4 bg-gradient-to-r from-red-50/90 via-rose-50/60 to-orange-50/30 border-b border-red-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#B30D12] to-[#E23B40] text-white flex items-center justify-center shadow-md shadow-red-950/20 shrink-0">
            <Zap size={18} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="px-2 py-0.2 rounded font-black text-[9px] uppercase tracking-wider bg-[#B30D12] text-white">
                Opportunity Alert
              </span>
              <span className="text-[11px] text-slate-500 font-semibold">Immediate Sourcing Opportunity</span>
            </div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-snug">
              5 models would sell immediately if listed at auction
            </h3>
            <p className="text-[11px] text-slate-600 font-medium leading-normal">
              Over 429 verified dealer purchase orders are waiting without matching stock. High turnover (&lt; 19 days median turn).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
          <div className="px-3 py-1.5 rounded-xl bg-white/95 border border-red-200/80 shadow-2xs text-xs">
            <span className="text-slate-400 font-bold block text-[9px] uppercase tracking-wider">UNCAPTURED DEALER GMV</span>
            <span className="font-black text-slate-900 text-xs sm:text-sm">
              NZ$1,720,000 <span className="text-[10px] text-slate-400 font-medium">/ ¥156.9M</span>
            </span>
          </div>
        </div>
      </div>

      {/* Table Subheader & Filter Tools (Compact) */}
      <div className="p-3.5 sm:p-4 pb-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100">
        <div>
          <h4 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
            Supply vs Demand Gap Analysis
          </h4>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            Real-time supply &amp; margin opportunity matrix identifying where AutoHub is missing auction sales opportunities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search model or trim..."
              className="pl-7 pr-2.5 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#B30D12] outline-none w-[160px] sm:w-[190px]"
            />
          </div>

          {/* Filter Pills with Red Brand Touch */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
            {(['All', 'Source more', 'Balanced', 'Oversupplied'] as const).map(tag => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-2 py-0.5 rounded-lg transition-all text-[11px] cursor-pointer ${
                  filterTag === tag
                    ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider select-none">
              <th className="py-2.5 px-3.5">Model</th>
              
              <th 
                className="py-2.5 px-3 cursor-pointer hover:text-slate-900 transition-colors"
                onClick={() => handleSort('demandUnits')}
              >
                <div className="flex items-center gap-1">
                  <span>Demand</span>
                  {sortField === 'demandUnits' ? (
                    sortDirection === 'desc' ? <ChevronDown size={12} className="text-[#B30D12]" /> : <ChevronUp size={12} className="text-[#B30D12]" />
                  ) : (
                    <ArrowUpDown size={11} className="text-slate-400" />
                  )}
                </div>
              </th>

              <th 
                className="py-2.5 px-3 cursor-pointer hover:text-slate-900 transition-colors"
                onClick={() => handleSort('currentStockUnits')}
              >
                <div className="flex items-center gap-1">
                  <span>AutoHub Stock</span>
                  {sortField === 'currentStockUnits' ? (
                    sortDirection === 'desc' ? <ChevronDown size={12} className="text-[#B30D12]" /> : <ChevronUp size={12} className="text-[#B30D12]" />
                  ) : (
                    <ArrowUpDown size={11} className="text-slate-400" />
                  )}
                </div>
              </th>

              <th 
                className="py-2.5 px-3 cursor-pointer hover:text-slate-900 transition-colors min-w-[140px]"
                onClick={() => handleSort('coveragePct')}
              >
                <div className="flex items-center gap-1">
                  <span>Coverage %</span>
                  {sortField === 'coveragePct' ? (
                    sortDirection === 'desc' ? <ChevronDown size={12} className="text-[#B30D12]" /> : <ChevronUp size={12} className="text-[#B30D12]" />
                  ) : (
                    <ArrowUpDown size={11} className="text-slate-400" />
                  )}
                </div>
              </th>

              <th 
                className="py-2.5 px-3 cursor-pointer hover:text-slate-900 transition-colors"
                onClick={() => handleSort('avgDaysToSell')}
              >
                <div className="flex items-center gap-1">
                  <span>Est. Land Days</span>
                  {sortField === 'avgDaysToSell' ? (
                    sortDirection === 'desc' ? <ChevronDown size={12} className="text-[#B30D12]" /> : <ChevronUp size={12} className="text-[#B30D12]" />
                  ) : (
                    <ArrowUpDown size={11} className="text-slate-400" />
                  )}
                </div>
              </th>

              <th 
                className="py-2.5 px-3 cursor-pointer hover:text-slate-900 transition-colors"
                onClick={() => handleSort('avgDealerMarginNzd')}
              >
                <div className="flex items-center gap-1">
                  <span>Margin Potential</span>
                  {sortField === 'avgDealerMarginNzd' ? (
                    sortDirection === 'desc' ? <ChevronDown size={12} className="text-[#B30D12]" /> : <ChevronUp size={12} className="text-[#B30D12]" />
                  ) : (
                    <ArrowUpDown size={11} className="text-slate-400" />
                  )}
                </div>
              </th>

              <th className="py-2.5 px-3.5 text-right">Sourcing Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs font-medium">
            {paginatedItems.map((item) => {
              const coverage = getCoverageBadge(item.coveragePct);
              const isExpanded = expandedModelId === item.id;
              const matchingAuctionVehicle = UPCOMING_AUCTION_MATCHES.find(v => v.model.toLowerCase().includes(item.model.toLowerCase())) || UPCOMING_AUCTION_MATCHES[0];

              return (
                <React.Fragment key={item.id}>
                  <tr 
                    onClick={() => setExpandedModelId(isExpanded ? null : item.id)}
                    className={`hover:bg-slate-50/90 transition-colors cursor-pointer select-none ${
                      item.immediateSeller 
                        ? 'bg-amber-50/25 border-l-4 border-l-[#B30D12]' 
                        : ''
                    } ${isExpanded ? 'bg-slate-50/90 font-medium' : ''}`}
                  >
                    {/* Model Column */}
                    <td className="py-2.5 px-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200 relative">
                          <img 
                            src={item.image} 
                            alt={item.model}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-slate-900 text-xs sm:text-[13px]">
                              {item.model}
                            </span>
                            {item.immediateSeller && (
                              <span className="px-1.5 py-0.2 rounded font-black text-[8.5px] uppercase tracking-wider bg-red-100 text-[#B30D12] border border-red-200">
                                Immediate
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 font-medium truncate">
                            {item.badge}
                          </div>
                          <span className="text-[9px] text-slate-400 font-medium">
                            {item.segment}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Dealer Demand */}
                    <td className="py-2.5 px-3 font-extrabold text-slate-900 text-xs">
                      {item.demandUnits}
                      <span className="text-[10px] text-slate-400 font-normal ml-0.5">units</span>
                      <span className="text-[9px] text-emerald-800 font-bold block mt-0.5">
                        {item.unmetGap > 0 ? `${item.demandUnits - item.currentStockUnits} unfulfilled` : 'Covered'}
                      </span>
                    </td>

                    {/* Current AutoHub Stock */}
                    <td className="py-2.5 px-3 font-bold text-slate-700 text-xs">
                      {item.currentStockUnits}
                      <span className="text-[10px] text-slate-400 font-normal ml-0.5">avail</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">
                        Auckland
                      </span>
                    </td>

                    {/* Coverage % with Progress Bar */}
                    <td className="py-2.5 px-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-slate-800">
                            {item.coveragePct}%
                          </span>
                          <span className={`px-1 py-0.2 rounded text-[9px] font-bold border ${coverage.textColor}`}>
                            {coverage.label}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${coverage.barColor}`}
                            style={{ width: `${Math.min(100, item.coveragePct)}%` }}
                          />
                        </div>
                        {item.unmetGap > 0 && (
                          <span className="text-[9px] text-rose-600 font-bold block">
                            Deficit: -{item.unmetGap} units
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Est. days to land in NZ */}
                    <td className="py-2.5 px-3 font-bold text-slate-800 text-xs">
                      <div className="flex items-center gap-1 text-[11px]">
                        <Ship size={11} className="text-blue-600" />
                        <span>18–22d</span>
                      </div>
                      <span className="text-[9px] text-slate-400 block mt-0.5">
                        Japan &rarr; NZ
                      </span>
                    </td>

                    {/* Margin Potential */}
                    <td className="py-2.5 px-3">
                      <span className="font-extrabold text-emerald-800 text-xs">
                        +NZ${item.avgDealerMarginNzd.toLocaleString('en-US')}
                      </span>
                      <span className="block text-[9px] text-slate-400 font-medium">
                        ¥{item.avgDealerMarginJpy.toLocaleString('en-US')} JPY
                      </span>
                    </td>

                    {/* AI Recommendation Tag & Chevron */}
                    <td className="py-2.5 px-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {getRecBadge(item.recommendation)}
                        <span className={`p-0.5 rounded text-slate-400 transition-transform ${isExpanded ? 'rotate-180 text-slate-700 bg-slate-200/60' : ''}`}>
                          <ChevronDown size={13} />
                        </span>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Row Detail Drawer */}
                  {isExpanded && (
                    <tr className="bg-slate-50/95 border-b border-slate-200">
                      <td colSpan={7} className="p-3 sm:p-3.5">
                        <div className="rounded-xl bg-gradient-to-br from-white via-red-50/20 to-rose-50/30 border border-red-200/80 p-3 sm:p-3.5 shadow-2xs space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-red-100">
                            <div className="flex items-center gap-1.5">
                              <span className="px-2 py-0.2 rounded font-black text-[9px] uppercase tracking-wider bg-[#B30D12] text-white">
                                Intelligence
                              </span>
                              <h5 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                                {item.model} &mdash; Signal Ingestion &amp; Sourcing Breakdown
                              </h5>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDrawerVehicle(matchingAuctionVehicle);
                              }}
                              className="px-3 py-1 rounded-lg text-[11px] font-bold bg-gradient-to-r from-[#B30D12] to-[#940B0F] hover:from-[#940B0F] hover:to-[#7A080C] text-white shadow-2xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                            >
                              <Users size={12} />
                              <span>View Matched Dealers &amp; Notify</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                            {/* Card 1: Demand Signals */}
                            <div className="p-2.5 rounded-lg bg-white border border-red-200/60 shadow-2xs space-y-1.5">
                              <div className="flex items-center gap-1 text-slate-900 font-bold text-[11px]">
                                <Radio size={12} className="text-[#B30D12]" />
                                <span>Ingested Demand Signals</span>
                              </div>
                              <div className="space-y-0.5 text-slate-600 text-[10px]">
                                <div className="flex justify-between">
                                  <span>Wish Lists:</span>
                                  <strong className="text-slate-900">{Math.round(item.demandUnits * 0.25)} orders</strong>
                                </div>
                                <div className="flex justify-between">
                                  <span>Search Queries:</span>
                                  <strong className="text-slate-900">{Math.round(item.demandUnits * 4.2)} /wk</strong>
                                </div>
                                <div className="flex justify-between">
                                  <span>Specs:</span>
                                  <strong className="text-slate-900">Grade 4.5+ &bull; &lt;55k km</strong>
                                </div>
                              </div>
                            </div>

                            {/* Card 2: 30-Day Forecast & Deficit */}
                            <div className="p-2.5 rounded-lg bg-white border border-red-200/60 shadow-2xs space-y-1.5">
                              <div className="flex items-center gap-1 text-slate-900 font-bold text-[11px]">
                                <Sparkles size={12} className="text-amber-600" />
                                <span>30d Forecast &amp; Deficit</span>
                              </div>
                              <div className="space-y-0.5 text-slate-600 text-[10px]">
                                <div className="flex justify-between">
                                  <span>Forecast:</span>
                                  <strong className="text-slate-900">{Math.round(item.demandUnits * 1.18)} units (+18%)</strong>
                                </div>
                                <div className="flex justify-between">
                                  <span>Unmet Gap:</span>
                                  <strong className="text-rose-600 font-bold">-{item.unmetGap} units</strong>
                                </div>
                                <div className="flex justify-between">
                                  <span>Intake:</span>
                                  <strong className="text-emerald-800 font-bold">+{Math.max(20, Math.round(item.unmetGap * 0.5))} units</strong>
                                </div>
                              </div>
                            </div>

                            {/* Card 3: Supply Chain Matching */}
                            <div className="p-2.5 rounded-lg bg-white border border-red-200/60 shadow-2xs space-y-1.5">
                              <div className="flex items-center gap-1 text-slate-900 font-bold text-[11px]">
                                <Ship size={12} className="text-blue-600" />
                                <span>Multi-Tier Supply</span>
                              </div>
                              <div className="space-y-0.5 text-slate-600 text-[10px]">
                                <div className="flex justify-between">
                                  <span>Yard Stock:</span>
                                  <strong className="text-slate-900">{item.currentStockUnits} units</strong>
                                </div>
                                <div className="flex justify-between">
                                  <span>Ro-Ro Sailing:</span>
                                  <strong className="text-blue-800 font-bold">18 units (8d)</strong>
                                </div>
                                <div className="flex justify-between">
                                  <span>Auction Lots:</span>
                                  <strong className="text-[#B30D12] font-bold">14 candidate lots</strong>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer with Dealer-panel Pagination */}
      <div className="p-4 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <span className="text-slate-500 font-medium">
          Showing <strong className="text-slate-900 font-bold">{processedItems.length > 0 ? ((validCurrentPage - 1) * ITEMS_PER_PAGE) + 1 : 0}–{Math.min(validCurrentPage * ITEMS_PER_PAGE, processedItems.length)}</strong> of <strong className="text-slate-900 font-bold">{processedItems.length}</strong> prioritized Japanese auction model profiles
        </span>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={validCurrentPage === 1}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft size={13} />
              <span>Prev</span>
            </button>

            {getPaginationPages(validCurrentPage, totalPages).map((p, idx) => (
              typeof p === "number" ? (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(p)}
                  className={`min-w-[28px] h-7 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${validCurrentPage === p
                    ? "bg-[#B30D12] text-white shadow-2xs"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs"
                    }`}
                >
                  {p}
                </button>
              ) : (
                <span key={idx} className="px-1 text-slate-400 font-bold text-xs">...</span>
              )
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={validCurrentPage === totalPages}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Matched Dealers Drawer */}
      <MatchedDealersDrawer
        vehicle={drawerVehicle}
        isOpen={Boolean(drawerVehicle)}
        onClose={() => setDrawerVehicle(null)}
        onNotifyToast={(msg) => {
          if (onNotifyToast) onNotifyToast(msg);
        }}
      />
    </div>
  );
}
