"use client";

import React, { useState, useMemo } from 'react';
import { SUPPLY_DEMAND_GAP, SupplyGapItem } from '@/lib/demandIntelligenceData';
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
  ExternalLink
} from 'lucide-react';
import Image from 'next/image';

interface SupplyDemandGapTableProps {
  onSelectModel?: (modelName: string) => void;
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

export default function SupplyDemandGapTable({ onSelectModel }: SupplyDemandGapTableProps) {
  const [filterTag, setFilterTag] = useState<'All' | 'Source more' | 'Balanced' | 'Oversupplied'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('unmetGap');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

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
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      
      {/* Callout Banner: "5 models would sell immediately if listed at auction" */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-50 via-red-50/50 to-orange-50 border-b border-amber-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#B30D12] to-amber-500 text-white flex items-center justify-center shadow-md shadow-red-950/20 shrink-0">
            <Zap size={22} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="px-2 py-0.5 rounded font-black text-[10px] uppercase tracking-wider bg-[#B30D12] text-white">
                Opportunity Alert
              </span>
              <span className="text-xs text-slate-500 font-semibold">Immediate Sourcing Opportunity</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              5 models would sell immediately if listed at auction
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              Over 429 verified dealer purchase orders are waiting without matching stock. High turnover (&lt; 19 days median turn).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
          <div className="px-3.5 py-2 rounded-xl bg-white/90 border border-amber-200 shadow-2xs text-xs">
            <span className="text-slate-400 font-medium block text-[10px]">UNCAPTURED DEALER GMV</span>
            <span className="font-black text-slate-900 text-sm">
              NZ$1,720,000 <span className="text-[11px] text-slate-400 font-medium">/ ¥156.9M</span>
            </span>
          </div>
        </div>
      </div>

      {/* Table Subheader & Filter Tools */}
      <div className="p-6 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
        <div>
          <h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            Supply vs Demand Gap Analysis
          </h4>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Real-time supply & margin opportunity matrix identifying where AutoHub is missing auction sales opportunities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search model or trim..."
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#1B2A4A] outline-none w-[170px] sm:w-[200px]"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
            {(['All', 'Source more', 'Balanced', 'Oversupplied'] as const).map(tag => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterTag === tag
                    ? 'bg-white text-slate-900 shadow-2xs font-black'
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
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">
              <th className="py-3 px-5">Model</th>
              
              <th 
                className="py-3 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                onClick={() => handleSort('demandUnits')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Dealer Demand</span>
                  {sortField === 'demandUnits' ? (
                    sortDirection === 'desc' ? <ChevronDown size={14} className="text-[#B30D12]" /> : <ChevronUp size={14} className="text-[#B30D12]" />
                  ) : (
                    <ArrowUpDown size={12} className="text-slate-400" />
                  )}
                </div>
              </th>

              <th 
                className="py-3 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                onClick={() => handleSort('currentStockUnits')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Current AutoHub Stock</span>
                  {sortField === 'currentStockUnits' ? (
                    sortDirection === 'desc' ? <ChevronDown size={14} className="text-[#B30D12]" /> : <ChevronUp size={14} className="text-[#B30D12]" />
                  ) : (
                    <ArrowUpDown size={12} className="text-slate-400" />
                  )}
                </div>
              </th>

              <th 
                className="py-3 px-4 cursor-pointer hover:text-slate-900 transition-colors min-w-[170px]"
                onClick={() => handleSort('coveragePct')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Coverage %</span>
                  {sortField === 'coveragePct' ? (
                    sortDirection === 'desc' ? <ChevronDown size={14} className="text-[#B30D12]" /> : <ChevronUp size={14} className="text-[#B30D12]" />
                  ) : (
                    <ArrowUpDown size={12} className="text-slate-400" />
                  )}
                </div>
              </th>

              <th 
                className="py-3 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                onClick={() => handleSort('avgDaysToSell')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Est. days to land in NZ (indicative)</span>
                  {sortField === 'avgDaysToSell' ? (
                    sortDirection === 'desc' ? <ChevronDown size={14} className="text-[#B30D12]" /> : <ChevronUp size={14} className="text-[#B30D12]" />
                  ) : (
                    <ArrowUpDown size={12} className="text-slate-400" />
                  )}
                </div>
              </th>

              <th 
                className="py-3 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                onClick={() => handleSort('avgDealerMarginNzd')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Dealer Margin Potential</span>
                  {sortField === 'avgDealerMarginNzd' ? (
                    sortDirection === 'desc' ? <ChevronDown size={14} className="text-[#B30D12]" /> : <ChevronUp size={14} className="text-[#B30D12]" />
                  ) : (
                    <ArrowUpDown size={12} className="text-slate-400" />
                  )}
                </div>
              </th>

              <th className="py-3 px-5 text-right">Sourcing Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs font-medium">
            {paginatedItems.map((item) => {
              const coverage = getCoverageBadge(item.coveragePct);

              return (
                <tr 
                  key={item.id}
                  className={`hover:bg-slate-50/90 transition-colors ${
                    item.immediateSeller 
                      ? 'bg-amber-50/25 border-l-4 border-l-[#B30D12]' 
                      : ''
                  }`}
                >
                  {/* Model Column */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 relative">
                        <img 
                          src={item.image} 
                          alt={item.model}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900 text-sm">
                            {item.model}
                          </span>
                          {item.immediateSeller && (
                            <span className="px-1.5 py-0.5 rounded font-black text-[9px] uppercase tracking-wider bg-red-100 text-[#B30D12] border border-red-200">
                              Immediate Seller
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                          {item.badge}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {item.segment}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Dealer Demand */}
                  <td className="py-3.5 px-4 font-black text-slate-900 text-sm">
                    {item.demandUnits}
                    <span className="text-[11px] text-slate-400 font-medium ml-1">units</span>
                  </td>

                  {/* Current AutoHub Stock */}
                  <td className="py-3.5 px-4 font-bold text-slate-700">
                    {item.currentStockUnits}
                    <span className="text-[11px] text-slate-400 font-normal ml-1">available</span>
                  </td>

                  {/* Coverage % with Progress Bar */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-800">
                          {item.coveragePct}%
                        </span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${coverage.textColor}`}>
                          {coverage.label}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${coverage.barColor}`}
                          style={{ width: `${Math.min(100, item.coveragePct)}%` }}
                        />
                      </div>
                      {item.unmetGap > 0 && (
                        <span className="text-[10px] text-rose-600 font-bold block">
                          Unmet Gap: -{item.unmetGap} units
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Est. days to land in NZ (indicative) */}
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Ship size={13} className="text-blue-600" />
                      <span>18–22 days</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Direct Ro-Ro Japan → NZ
                    </span>
                  </td>

                  {/* Margin Potential */}
                  <td className="py-3.5 px-4">
                    <span className="font-black text-emerald-700 text-sm">
                      +NZ${item.avgDealerMarginNzd.toLocaleString('en-US')}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-medium">
                      ¥{item.avgDealerMarginJpy.toLocaleString('en-US')} JPY
                    </span>
                  </td>

                  {/* AI Recommendation Tag */}
                  <td className="py-3.5 px-5 text-right">
                    {getRecBadge(item.recommendation)}
                  </td>
                </tr>
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
    </div>
  );
}
