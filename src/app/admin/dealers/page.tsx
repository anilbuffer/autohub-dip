"use client";

import React, { useState, useMemo, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Users,
  MapPin,
  Mail,
  Phone,
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
  Plus,
  Search,
  LayoutGrid,
  List,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  X,
  TrendingUp,
  Info
} from "lucide-react";
import { DEALERS } from "@/lib/data";
import { useSyncStore } from "@/lib/syncStore";

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

export default function AdminDealers() {
  const { state: syncState } = useSyncStore();
  const [dealersList, setDealersList] = useState(DEALERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTier, setSelectedTier] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Pagination (6 items per page)
  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  // Modal State
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [newDealerName, setNewDealerName] = useState("");
  const [newDealerEmail, setNewDealerEmail] = useState("");
  const [newDealerLocation, setNewDealerLocation] = useState("");
  const [invitedSuccess, setInvitedSuccess] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTier]);

  const filteredDealers = useMemo(() => {
    return dealersList.filter((d) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        d.name.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q) ||
        d.contactName.toLowerCase().includes(q) ||
        d.email.toLowerCase().includes(q);

      const matchesTier = selectedTier === "All" || d.tier === selectedTier;

      return matchesSearch && matchesTier;
    });
  }, [dealersList, searchTerm, selectedTier]);

  const totalPages = Math.ceil(filteredDealers.length / ITEMS_PER_PAGE) || 1;
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedDealers = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredDealers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredDealers, validCurrentPage]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedTier("All");
    setCurrentPage(1);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const newDealer = {
      id: dealersList.length + 1,
      name: newDealerName,
      location: newDealerLocation || "Auckland, New Zealand",
      tier: "Standard Dealer",
      activeOpportunities: 6,
      priorityBuys: 1,
      monthlyImportsTarget: 8,
      avgMargin: 3200,
      contactName: "Operations Manager",
      email: newDealerEmail,
      phone: "+64 9 000 0000",
      preferences: {
        makes: ["Toyota", "Honda"],
        models: ["Aqua", "Fit"],
        yearRange: "2018 – 2023",
        maxKm: 80000,
        fuelTypes: ["Hybrid"],
        targetRetail: "NZ$18,000 – NZ$26,000",
        targetMargin: "NZ$3,200+"
      }
    };

    setInvitedSuccess(true);
    setTimeout(() => {
      setDealersList([...dealersList, newDealer]);
      setInvitedSuccess(false);
      setInviteModalOpen(false);
      setNewDealerName("");
      setNewDealerEmail("");
      setNewDealerLocation("");
    }, 1200);
  };

  const renderPagination = (containerClass: string) => {
    if (totalPages <= 1) return null;
    return (
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 ${containerClass}`}>
        <span className="text-xs font-semibold text-slate-500">
          Showing <strong className="text-slate-900 font-bold">{((validCurrentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(validCurrentPage * ITEMS_PER_PAGE, filteredDealers.length)}</strong> of <strong className="text-slate-900 font-bold">{filteredDealers.length}</strong> dealerships (Page <strong className="text-slate-900 font-bold">{validCurrentPage}</strong> of <strong className="text-slate-900 font-bold">{totalPages}</strong>)
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setCurrentPage((prev) => Math.max(1, prev - 1));
              window.scrollTo({ top: 220, behavior: 'smooth' });
            }}
            disabled={validCurrentPage === 1}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
            title="Previous Page"
          >
            <ChevronLeft size={14} />
            <span>Prev</span>
          </button>

          {getPaginationPages(validCurrentPage, totalPages).map((p, idx) => (
            typeof p === "number" ? (
              <button
                key={idx}
                onClick={() => {
                  setCurrentPage(p);
                  window.scrollTo({ top: 220, behavior: 'smooth' });
                }}
                className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${validCurrentPage === p
                  ? "bg-[#B30D12] hover:bg-[#940B0F] text-white shadow-2xs"
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
            onClick={() => {
              setCurrentPage((prev) => Math.min(totalPages, prev + 1));
              window.scrollTo({ top: 220, behavior: 'smooth' });
            }}
            disabled={validCurrentPage === totalPages}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
            title="Next Page"
          >
            <span>Next</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6 pb-12">
        {/* Page Header Hero Card with Crimson Accent Line */}
        <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.06),0_1px_3px_rgba(15,23,42,0.03)] p-5 sm:p-6 transition-all">
          {/* Subtle Brand Crimson Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#B30D12] via-[#E23B40] to-rose-400/20" />

          {/* Ambient Background Glow */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-gradient-to-br from-rose-500/[0.04] to-transparent blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2.5">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/90 border border-slate-200/80 text-[11px] font-semibold text-slate-700 shadow-2xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B30D12] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B30D12]"></span>
                  </span>
                  Dealer Relationship CRM
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-[11px] text-amber-600 font-medium shadow-2xs">
                  <span>Active Network:</span>
                  <strong className="font-mono text-amber-800 font-bold">{dealersList.length} Dealerships</strong>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-700 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Real-Time Sourcing Telemetry
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                NZ Dealership Network &amp; Accounts
              </h1>

              <p className="text-slate-500 text-xs sm:text-sm font-normal mt-1 leading-relaxed max-w-3xl">
                Manage client dealer accounts, custom target margin criteria, and live Japanese auction lot allocations across New Zealand.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
              <button
                onClick={() => setInviteModalOpen(true)}
                className="px-4 py-2.5 bg-[#B30D12] hover:bg-[#940B0F] text-white rounded-xl text-sm font-semibold transition-all shadow-[0_2px_8px_-1px_rgba(179,13,18,0.3)] hover:shadow-[0_4px_14px_-2px_rgba(179,13,18,0.4)] flex items-center gap-2 active:scale-[0.99] cursor-pointer"
              >
                <Plus size={16} />
                <span>Onboard New Dealer</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 Compact KPIs with Soft Shadows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white p-4 sm:p-4.5 rounded-xl border border-slate-200/80 shadow-[0_2px_10px_-2px_rgba(15,23,42,0.05),0_1px_3px_rgba(15,23,42,0.02)] hover:shadow-[0_6px_16px_-3px_rgba(15,23,42,0.08),0_2px_6px_rgba(15,23,42,0.03)] hover:border-slate-300/80 transition-all duration-200 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Contracted Dealerships
              </span>
              <div className="w-7 h-7 rounded-lg bg-red-50 text-[#B30D12] border border-red-100 flex items-center justify-center font-bold shadow-2xs">
                <Building2 size={14} />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {dealersList.length < 10 ? `0${dealersList.length}` : dealersList.length}
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60 shadow-2xs">
                  Active &amp; Bidding
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                Verified dealer principals with buying rules
              </p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-4.5 rounded-xl border border-slate-200/80 shadow-[0_2px_10px_-2px_rgba(15,23,42,0.05),0_1px_3px_rgba(15,23,42,0.02)] hover:shadow-[0_6px_16px_-3px_rgba(15,23,42,0.08),0_2px_6px_rgba(15,23,42,0.03)] hover:border-slate-300/80 transition-all duration-200 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Monthly Import Target
              </span>
              <div className="w-7 h-7 rounded-lg bg-red-50 text-[#B30D12] border border-red-100 flex items-center justify-center font-bold shadow-2xs">
                <Users size={14} />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  57
                </span>
                <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60 shadow-2xs">
                  Units / mo
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                Across Auckland, Waikato &amp; Canterbury
              </p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-4.5 rounded-xl border border-slate-200/80 shadow-[0_2px_10px_-2px_rgba(15,23,42,0.05),0_1px_3px_rgba(15,23,42,0.02)] hover:shadow-[0_6px_16px_-3px_rgba(15,23,42,0.08),0_2px_6px_rgba(15,23,42,0.03)] hover:border-slate-300/80 transition-all duration-200 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Avg. Client Profit Spread
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center font-bold shadow-2xs">
                <TrendingUp size={14} />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 tracking-tight">
                  +NZ$3,580
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                Exceeds NZ wholesale benchmark spread
              </p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search dealership name, location, contact, or email..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#B30D12] focus:ring-2 focus:ring-[#B30D12]/20 text-xs font-medium outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Tier Selector */}
            <div className="relative">
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="w-full appearance-none px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#B30D12] text-xs font-semibold text-slate-800 outline-none transition-all cursor-pointer"
              >
                <option value="All">All Tiers</option>
                <option value="Premier Partner">Premier Partner</option>
                <option value="Standard Dealer">Standard Dealer</option>
              </select>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center justify-end">
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setViewMode("grid")}
                  title="Grid View"
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === "grid"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                    }`}
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  title="List View"
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === "list"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                    }`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Tiers:</span>
              {["All", "Premier Partner", "Standard Dealer"].map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTier(t)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${selectedTier === t
                    ? "bg-[#B30D12] hover:bg-[#940B0F] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                >
                  {t}
                </button>
              ))}

              {(searchTerm || selectedTier !== "All") && (
                <button
                  onClick={resetFilters}
                  className="px-2.5 py-1 text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RotateCcw size={12} /> Reset
                </button>
              )}
            </div>

            <div className="font-bold text-slate-500">
              Showing <span className="text-slate-900 font-extrabold">{((validCurrentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(validCurrentPage * ITEMS_PER_PAGE, filteredDealers.length)}</span> of <span className="text-slate-900 font-extrabold">{filteredDealers.length}</span> dealerships
            </div>
          </div>
        </div>

        {/* Results Area */}
        {filteredDealers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Building2 size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">No dealerships found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4 font-medium">
              No dealers match your active search and filter criteria. Try adjusting or resetting your search.
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-[#B30D12] hover:bg-[#940B0F] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedDealers.map((dealer) => (
                <div
                  key={dealer.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] p-6 flex flex-col justify-between hover-lift group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1B2A4A] to-[#0E1A30] text-slate-200 flex items-center justify-center font-black text-sm shrink-0 border border-[#2B406B]/60 shadow-2xs">
                          {dealer.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base font-black text-slate-900 group-hover:text-[#B30D12] transition-colors truncate">
                            {dealer.name}
                          </h3>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-medium truncate">
                            <MapPin size={12} className="shrink-0 text-slate-400" />
                            <span className="truncate">{dealer.location}</span>
                          </p>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#1B2A4A]/10 text-[#1B2A4A] border border-[#1B2A4A]/20 shrink-0">
                        {dealer.tier}
                      </span>
                    </div>

                    <div className="py-4 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Contact Person:</span>
                        <span className="font-bold text-slate-800">{dealer.contactName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Email:</span>
                        <span className="font-mono text-slate-700">{dealer.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Phone:</span>
                        <span className="font-mono text-slate-700">{dealer.phone}</span>
                      </div>
                    </div>

                    {/* Performance Mini-Stats */}
                    <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Live Matches</span>
                        <span className="font-black text-slate-900 text-sm mt-0.5 block">
                          {dealer.activeOpportunities} Lots
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Priority Buys</span>
                        <span className="font-black text-emerald-600 text-sm mt-0.5 block">
                          {dealer.priorityBuys} Priority
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Margin</span>
                      <span className="text-xs font-black text-slate-900 block font-mono">
                        {dealer.id === 1 ? `NZ$${syncState.dealerTargetMargin.toLocaleString('en-US')}+` : dealer.preferences.targetMargin}
                      </span>
                    </div>

                    <Link
                      href={`/admin/dealers/${dealer.id}`}
                      className="px-4 py-2 bg-[#B30D12] hover:bg-[#940B0F] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                    >
                      View Profile <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            {renderPagination("bg-white p-4 sm:px-6 rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)]")}
          </div>
        ) : (
          /* Table View matching Dealer panel */
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-5 py-3.5">Dealership</th>
                    <th className="px-5 py-3.5">Tier &amp; Status</th>
                    <th className="px-5 py-3.5">Location</th>
                    <th className="px-5 py-3.5">Contact Person</th>
                    <th className="px-5 py-3.5">Target Margin</th>
                    <th className="px-5 py-3.5">Live Matches</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {paginatedDealers.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[#1B2A4A] text-white flex items-center justify-center font-bold text-xs shrink-0 border border-slate-200">
                            {d.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-black text-slate-900">{d.name}</div>
                            <div className="text-[11px] text-slate-500 font-mono">{d.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#1B2A4A]/10 text-[#1B2A4A] border border-[#1B2A4A]/20">
                          {d.tier}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-700 font-medium">
                        {d.location}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900">{d.contactName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{d.phone}</div>
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-900 font-mono">
                        {d.id === 1 ? `NZ$${syncState.dealerTargetMargin.toLocaleString('en-US')}+` : d.preferences.targetMargin}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Sparkles size={11} /> {d.activeOpportunities} Lots
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/admin/dealers/${d.id}`}
                          className="px-3 py-1.5 bg-[#B30D12] hover:bg-[#940B0F] text-white rounded-lg text-xs font-bold inline-flex items-center gap-1 transition-all shadow-2xs"
                        >
                          View <ArrowRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {renderPagination("px-5 py-3.5 bg-slate-50/80 border-t border-slate-200")}
          </div>
        )}

        {/* Small Disclaimer */}
        <div className="flex items-center justify-center gap-2 p-3 bg-white/70 border border-slate-200/70 rounded-xl text-center shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
          <Info size={13} className="text-slate-400 shrink-0" />
          <span className="text-[11px] text-slate-500 font-medium">
            Indicative figures based on current NZ market data. Final bid decisions rest with the dealer.
          </span>
        </div>

        {/* Onboard Dealer Modal matching Dealer Prompt Modal style */}
        {inviteModalOpen && (
          <div className="fixed inset-0 bg-[#0B1322]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150 relative overflow-hidden">
              {/* Crimson Accent */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#B30D12] via-[#E23B40] to-rose-400/20" />

              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-[#B30D12] border border-red-100 flex items-center justify-center font-bold">
                    <Building2 size={16} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">Onboard New Dealership</h3>
                    <p className="text-[11px] text-slate-500">AutoHub DIP procurement network</p>
                  </div>
                </div>
                <button
                  onClick={() => setInviteModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X size={18} />
                </button>
              </div>

              {invitedSuccess ? (
                <div className="p-4 my-6 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in duration-150">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  Invitation dispatched! Dealership added to active directory.
                </div>
              ) : (
                <form onSubmit={handleInvite} className="space-y-4 my-5 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Dealership Legal Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tauranga Auto Hub Ltd"
                      value={newDealerName}
                      onChange={(e) => setNewDealerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#B30D12] focus:ring-2 focus:ring-[#B30D12]/20 font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Dealer Principal Email</label>
                    <input
                      type="email"
                      required
                      placeholder="principal@dealership.co.nz"
                      value={newDealerEmail}
                      onChange={(e) => setNewDealerEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#B30D12] focus:ring-2 focus:ring-[#B30D12]/20 font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Location / Yard City</label>
                    <input
                      type="text"
                      placeholder="e.g. Mount Maunganui, Tauranga"
                      value={newDealerLocation}
                      onChange={(e) => setNewDealerLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#B30D12] focus:ring-2 focus:ring-[#B30D12]/20 font-medium"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setInviteModalOpen(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#B30D12] hover:bg-[#940B0F] text-white rounded-xl font-bold shadow-xs cursor-pointer transition-colors"
                    >
                      Create &amp; Send Link
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
