"use client";

import React, { useState, useMemo, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Clock,
  LayoutGrid,
  List,
  RotateCcw,
  Car,
  Building2,
  TrendingUp,
  Filter,
  SlidersHorizontal,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Flame,
  ShieldCheck,
  Fuel,
  Award,
  Minus,
  Plus,
  CheckCircle2,
  DollarSign
} from "lucide-react";
import { VEHICLES, DEALERS } from "@/lib/data";
import { useSyncStore } from "@/lib/syncStore";
import ModernVehicleCard, { EnrichedVehicle } from "@/components/dealer/ModernVehicleCard";
import { triggerAutoHubCopilot } from "@/components/chat/DealerChatAssistant";

function getPaginationPages(currentPage: number, totalPages: number) {
  if (totalPages <= 6) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (currentPage <= 3) {
    return [1, 2, 3, 4, "...", totalPages];
  }
  if (currentPage >= totalPages - 2) {
    return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
}

export default function AdminVehicles() {
  const { state: syncState, toggleShortlistVehicle } = useSyncStore();

  // Active Catalog Tab: "all" | "priority" | "available" | "shortlisted"
  const [activeTab, setActiveTab] = useState<"all" | "priority" | "available" | "shortlisted">("all");

  // Sidebar Collapse Controls
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDealer, setSelectedDealer] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedMakes, setSelectedMakes] = useState<string[]>([]);
  const [selectedFuels, setSelectedFuels] = useState<string[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [selectedPriceBrackets, setSelectedPriceBrackets] = useState<string[]>([]);
  const [maxBudget, setMaxBudget] = useState<number>(50000);
  const [sortBy, setSortBy] = useState<"score" | "marginDesc" | "priceAsc" | "endingSoon" | "yearDesc" | "kmAsc">("score");

  // View Mode: default is "grid" as requested
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Quick Recommended Filters
  const [quickFilter, setQuickFilter] = useState<"none" | "priority" | "highMargin" | "under20k" | "grade45" | "endingSoon" | "lowKm">("none");

  // Brand Search & Show More
  const [brandSearch, setBrandSearch] = useState("");
  const [showAllBrands, setShowAllBrands] = useState(false);

  // Separate Card Layouts Collapse State (false = expanded, true = collapsed)
  const [cardCollapse, setCardCollapse] = useState({
    dealer: false,
    recommended: false,
    budget: false,
    brand: false,
    powertrain: false,
    grade: false,
  });

  const toggleCardCollapse = (key: keyof typeof cardCollapse) => {
    setCardCollapse((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Pagination (12 items per page for clean 3-column grid)
  const ITEMS_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(1);

  // Auto-reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    activeTab,
    searchQuery,
    selectedDealer,
    selectedStatus,
    selectedMakes,
    selectedFuels,
    selectedGrades,
    selectedPriceBrackets,
    maxBudget,
    sortBy,
    quickFilter,
  ]);

  // Enriched Vehicles with dynamic Landed, Margin, Match Score
  const enrichedVehicles: EnrichedVehicle[] = useMemo(() => {
    return VEHICLES.map((v) => {
      const landed = Math.round(
        ((v.fobJpy / syncState.fxRateJpyNzd) +
          syncState.freightPerUnitNzd +
          syncState.compliancePerUnitNzd) *
        1.15
      );
      const margin = v.targetMarginNzd || Math.max(2500, v.estRetailNzd - landed);
      const isPriority = v.status === "Priority" || v.score >= 90;

      return {
        ...v,
        dynamicLanded: landed,
        dynamicMargin: margin,
        matchScore: v.score,
        isPriority,
      };
    });
  }, [syncState]);

  // Brand / Make Counts
  const availableMakes = useMemo(() => {
    const counts: Record<string, number> = {};
    enrichedVehicles.forEach((v) => {
      counts[v.make] = (counts[v.make] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [enrichedVehicles]);

  const filteredMakesList = useMemo(() => {
    if (!brandSearch.trim()) return availableMakes;
    return availableMakes.filter(([make]) =>
      make.toLowerCase().includes(brandSearch.toLowerCase().trim())
    );
  }, [availableMakes, brandSearch]);

  const displayedMakes = useMemo(() => {
    if (showAllBrands || brandSearch.trim()) return filteredMakesList;
    return filteredMakesList.slice(0, 5);
  }, [filteredMakesList, showAllBrands, brandSearch]);

  // Powertrain counts
  const powertrainCounts = useMemo(() => {
    const counts = { Hybrid: 0, Petrol: 0, Diesel: 0, Electric: 0 };
    enrichedVehicles.forEach((v) => {
      const f = (v.fuel || "").toLowerCase();
      if (f.includes("hybrid") || f.includes("phev")) counts.Hybrid++;
      else if (f.includes("diesel")) counts.Diesel++;
      else if (f.includes("electric") || f.includes("ev")) counts.Electric++;
      else counts.Petrol++;
    });
    return counts;
  }, [enrichedVehicles]);

  // Auction Grade counts
  const gradeCounts = useMemo(() => {
    return {
      "4.5+": enrichedVehicles.filter((v) => ["4.5", "5", "6"].includes(String(v.grade))).length,
      "4.0+": enrichedVehicles.filter((v) => ["4", "4.5", "5", "6"].includes(String(v.grade))).length,
      "3.5+": enrichedVehicles.filter((v) => ["3.5", "4", "4.5", "5", "6"].includes(String(v.grade))).length,
      "3.0-": enrichedVehicles.filter((v) => ["3", "3.0", "RA", "R"].includes(String(v.grade))).length,
    };
  }, [enrichedVehicles]);

  // Price bracket counts
  const priceBracketCounts = useMemo(() => {
    return {
      under16k: enrichedVehicles.filter((v) => v.dynamicLanded < 16000).length,
      from16kTo22k: enrichedVehicles.filter((v) => v.dynamicLanded >= 16000 && v.dynamicLanded <= 22000).length,
      from22kTo28k: enrichedVehicles.filter((v) => v.dynamicLanded > 22000 && v.dynamicLanded <= 28000).length,
      from28kTo35k: enrichedVehicles.filter((v) => v.dynamicLanded > 28000 && v.dynamicLanded <= 35000).length,
      over35k: enrichedVehicles.filter((v) => v.dynamicLanded > 35000).length,
    };
  }, [enrichedVehicles]);

  // Dealership allocation counts
  const dealerCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    enrichedVehicles.forEach((v) => {
      const d = v.dealer || "Unallocated";
      counts[d] = (counts[d] || 0) + 1;
    });
    return counts;
  }, [enrichedVehicles]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery.trim() !== "" ||
      selectedDealer !== "All" ||
      selectedStatus !== "All" ||
      selectedMakes.length > 0 ||
      selectedFuels.length > 0 ||
      selectedGrades.length > 0 ||
      selectedPriceBrackets.length > 0 ||
      maxBudget < 50000 ||
      quickFilter !== "none" ||
      activeTab !== "all"
    );
  }, [
    searchQuery,
    selectedDealer,
    selectedStatus,
    selectedMakes,
    selectedFuels,
    selectedGrades,
    selectedPriceBrackets,
    maxBudget,
    quickFilter,
    activeTab,
  ]);

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedDealer("All");
    setSelectedStatus("All");
    setSelectedMakes([]);
    setSelectedFuels([]);
    setSelectedGrades([]);
    setSelectedPriceBrackets([]);
    setMaxBudget(50000);
    setQuickFilter("none");
    setBrandSearch("");
    setActiveTab("all");
    setSortBy("score");
    setCurrentPage(1);
  };

  // Toggle helpers
  const toggleMake = (make: string) => {
    setSelectedMakes((prev) =>
      prev.includes(make) ? prev.filter((m) => m !== make) : [...prev, make]
    );
  };

  const toggleFuel = (fuel: string) => {
    setSelectedFuels((prev) =>
      prev.includes(fuel) ? prev.filter((f) => f !== fuel) : [...prev, fuel]
    );
  };

  const toggleGrade = (grade: string) => {
    setSelectedGrades((prev) =>
      prev.includes(grade) ? prev.filter((g) => g !== grade) : [...prev, grade]
    );
  };

  const togglePriceBracket = (bracket: string) => {
    setSelectedPriceBrackets((prev) =>
      prev.includes(bracket) ? prev.filter((b) => b !== bracket) : [...prev, bracket]
    );
  };

  // Filtered & Sorted catalog items
  const filteredVehicles = useMemo(() => {
    return enrichedVehicles
      .filter((v) => {
        // Tab Filter
        if (activeTab === "priority" && !v.isPriority) return false;
        if (activeTab === "available" && v.status === "Allocated") return false;
        if (activeTab === "shortlisted" && !syncState.shortlistedVehicleIds.includes(v.id)) return false;

        // Dealership Filter
        if (selectedDealer !== "All") {
          if (selectedDealer === "Unallocated" && v.dealer) return false;
          if (selectedDealer !== "Unallocated" && v.dealer !== selectedDealer) return false;
        }

        // Status Filter
        if (selectedStatus !== "All" && v.status !== selectedStatus) return false;

        // Quick Recommended Filter
        if (quickFilter === "priority" && !v.isPriority) return false;
        if (quickFilter === "highMargin" && v.dynamicMargin < 3500) return false;
        if (quickFilter === "under20k" && v.dynamicLanded > 20000) return false;
        if (quickFilter === "grade45" && !["4.5", "5", "6"].includes(String(v.grade))) return false;
        if (quickFilter === "endingSoon") {
          const t = v.timeLeft || "";
          const isClosingSoon = t.includes("m") && !t.includes("d");
          if (!isClosingSoon) return false;
        }
        if (quickFilter === "lowKm" && v.km > 50000) return false;

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            v.make.toLowerCase().includes(q) ||
            v.model.toLowerCase().includes(q) ||
            v.lotNumber.toLowerCase().includes(q) ||
            v.vin.toLowerCase().includes(q) ||
            v.auctionHouse.toLowerCase().includes(q) ||
            (v.badge && v.badge.toLowerCase().includes(q)) ||
            (v.engine && v.engine.toLowerCase().includes(q)) ||
            (v.dealer && v.dealer.toLowerCase().includes(q));
          if (!matches) return false;
        }

        // Makes (Multi-select)
        if (selectedMakes.length > 0 && !selectedMakes.includes(v.make)) {
          return false;
        }

        // Powertrain / Fuel (Multi-select)
        if (selectedFuels.length > 0) {
          const f = (v.fuel || "").toLowerCase();
          const matchesFuel = selectedFuels.some((sel) => {
            if (sel === "Hybrid") return f.includes("hybrid") || f.includes("phev");
            if (sel === "Petrol")
              return (
                f.includes("petrol") ||
                f.includes("gasoline") ||
                (!f.includes("hybrid") && !f.includes("diesel") && !f.includes("electric"))
              );
            if (sel === "Diesel") return f.includes("diesel");
            if (sel === "Electric") return f.includes("electric") || f.includes("ev");
            return false;
          });
          if (!matchesFuel) return false;
        }

        // Auction Grade (Multi-select)
        if (selectedGrades.length > 0) {
          const gStr = String(v.grade);
          const matchesGrade = selectedGrades.some((sel) => {
            if (sel === "4.5+") return ["4.5", "5", "6"].includes(gStr);
            if (sel === "4.0+") return ["4", "4.5", "5", "6"].includes(gStr);
            if (sel === "3.5+") return ["3.5", "4", "4.5", "5", "6"].includes(gStr);
            if (sel === "3.0-") return ["3", "3.0", "RA", "R"].includes(gStr);
            return false;
          });
          if (!matchesGrade) return false;
        }

        // Budget Slider
        if (maxBudget < 50000 && v.dynamicLanded > maxBudget) {
          return false;
        }

        // Price Brackets (Multi-select)
        if (selectedPriceBrackets.length > 0) {
          const l = v.dynamicLanded;
          const matchesBracket = selectedPriceBrackets.some((b) => {
            if (b === "under16k") return l < 16000;
            if (b === "from16kTo22k") return l >= 16000 && l <= 22000;
            if (b === "from22kTo28k") return l > 22000 && l <= 28000;
            if (b === "from28kTo35k") return l > 28000 && l <= 35000;
            if (b === "over35k") return l > 35000;
            return false;
          });
          if (!matchesBracket) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "score") return b.matchScore - a.matchScore;
        if (sortBy === "marginDesc") return b.dynamicMargin - a.dynamicMargin;
        if (sortBy === "priceAsc") return a.dynamicLanded - b.dynamicLanded;
        if (sortBy === "yearDesc") return b.year - a.year;
        if (sortBy === "kmAsc") return a.km - b.km;
        if (sortBy === "endingSoon") {
          const aTime = a.timeLeft || "";
          const bTime = b.timeLeft || "";
          return aTime.localeCompare(bTime);
        }
        return 0;
      });
  }, [
    enrichedVehicles,
    activeTab,
    selectedDealer,
    selectedStatus,
    quickFilter,
    searchQuery,
    selectedMakes,
    selectedFuels,
    selectedGrades,
    maxBudget,
    selectedPriceBrackets,
    sortBy,
    syncState.shortlistedVehicleIds,
  ]);

  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE) || 1;
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedVehicles = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredVehicles.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredVehicles, validCurrentPage, ITEMS_PER_PAGE]);

  // Header KPI calculations
  const priorityCount = useMemo(() => enrichedVehicles.filter((v) => v.isPriority).length, [enrichedVehicles]);
  const avgMargin = useMemo(() => {
    const total = enrichedVehicles.reduce((acc, v) => acc + v.dynamicMargin, 0);
    return Math.round(total / (enrichedVehicles.length || 1));
  }, [enrichedVehicles]);

  const renderPagination = (containerClass: string) => {
    if (totalPages <= 1) return null;
    return (
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 ${containerClass}`}>
        <span className="text-xs font-semibold text-slate-500">
          Showing{" "}
          <strong className="text-slate-900 font-bold">
            {(validCurrentPage - 1) * ITEMS_PER_PAGE + 1}–
            {Math.min(validCurrentPage * ITEMS_PER_PAGE, filteredVehicles.length)}
          </strong>{" "}
          of <strong className="text-slate-900 font-bold">{filteredVehicles.length}</strong> lots (Page{" "}
          <strong className="text-slate-900 font-bold">{validCurrentPage}</strong> of{" "}
          <strong className="text-slate-900 font-bold">{totalPages}</strong>)
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setCurrentPage((prev) => Math.max(1, prev - 1));
              window.scrollTo({ top: 340, behavior: "smooth" });
            }}
            disabled={validCurrentPage === 1}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
            title="Previous Page"
          >
            <ChevronLeft size={14} />
            <span>Prev</span>
          </button>

          {getPaginationPages(validCurrentPage, totalPages).map((p, idx) =>
            typeof p === "number" ? (
              <button
                key={idx}
                onClick={() => {
                  setCurrentPage(p);
                  window.scrollTo({ top: 340, behavior: "smooth" });
                }}
                className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${validCurrentPage === p
                  ? "bg-[#B30D12] hover:bg-[#940B0F] text-white shadow-2xs"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs"
                  }`}
              >
                {p}
              </button>
            ) : (
              <span key={idx} className="px-1 text-slate-400 font-bold text-xs">
                ...
              </span>
            )
          )}

          <button
            onClick={() => {
              setCurrentPage((prev) => Math.min(totalPages, prev + 1));
              window.scrollTo({ top: 340, behavior: "smooth" });
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
      <div className="space-y-6 pb-12 max-w-full mx-auto">
        {/* 1. Page Header Hero Card with Crimson Accent Line */}
        <div className="relative rounded-2xl bg-white border border-slate-200/90 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.06),0_1px_3px_rgba(15,23,42,0.03)] p-5 sm:p-6 transition-all">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#B30D12] via-[#E23B40] to-rose-400/20 rounded-t-2xl" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/90 border border-slate-200/80 text-[11px] font-semibold text-slate-700 shadow-2xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B30D12] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B30D12]"></span>
                  </span>
                  Brokerage Master Database
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-700 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  USS, TAA &amp; CAA Live Scraper
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Auction Inventory &amp; Dealer Allocations
              </h1>

              <p className="text-slate-500 text-xs sm:text-sm font-normal mt-1 leading-relaxed max-w-3xl">
                Review and manage all <span className="font-semibold text-slate-700">{VEHICLES.length} qualified Japanese auction lots</span>, margin parameters, and client dealership assignments.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
              <Link
                href="/admin/settings"
                className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/90 hover:border-slate-300 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-2xs flex items-center gap-1.5"
              >
                <span>Calculation Engine</span>
                <ArrowRight size={13} className="text-slate-400" />
              </Link>
            </div>
          </div>
        </div>

        {/* 2. Top 3 Compact KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Qualified Auction Lots
              </span>
              <div className="w-8 h-8 rounded-xl bg-red-50 text-[#B30D12] border border-red-100 flex items-center justify-center font-bold">
                <Car size={16} />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {VEHICLES.length}
                </span>
                <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60 shadow-2xs">
                  4 Live Feeds
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                USS Tokyo, USS Yokohama, CAA &amp; TAA lanes
              </p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Priority Dealer Allocations
              </span>
              <div className="w-8 h-8 rounded-xl bg-red-50 text-[#B30D12] border border-red-100 flex items-center justify-center font-bold">
                <Flame size={16} />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {priorityCount < 10 ? `0${priorityCount}` : priorityCount}
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60 shadow-2xs">
                  Score 90+
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                High-probability margin spread matches
              </p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Avg. Target Margin
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center font-bold">
                <TrendingUp size={16} />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight font-mono">
                  NZ${avgMargin.toLocaleString("en-US")}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                Top tier projected dealer gross profit
              </p>
            </div>
          </div>
        </div>

        {/* 3. Main Two-Column Layout: Sidebar Filter + Right Default Grids Layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Mobile Filter Toggle Button */}
          <div className="lg:hidden w-full flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="flex items-center gap-2 text-xs font-bold text-slate-800"
            >
              <Filter size={15} className="text-[#B30D12]" />
              <span>{mobileFilterOpen ? "Hide Filter Options" : "Show Sourcing Filters"}</span>
              {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-[#B30D12]" />}
            </button>
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="text-xs font-bold text-red-600 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw size={11} /> Reset
              </button>
            )}
          </div>

          {/* ========================================================================= */}
          {/* LEFT COLUMN: Modern Sourcing Filter Sidebar                               */}
          {/* ========================================================================= */}
          <aside
            className={`
              w-full lg:w-80 shrink-0 space-y-4
              ${isSidebarCollapsed ? "lg:hidden" : "lg:block"}
              ${mobileFilterOpen ? "block" : "hidden lg:block"}
            `}
          >
            {/* Top Control Bar: Title + Active Count + Reset All + Collapse */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter size={15} className="text-[#B30D12]" />
                  <span className="text-sm font-black text-slate-900 tracking-tight">
                    Sourcing Filters
                  </span>
                  {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-[#B30D12]" />}
                </div>

                <div className="flex items-center gap-2">
                  {hasActiveFilters && (
                    <button
                      onClick={resetAllFilters}
                      className="text-xs font-bold text-red-600 hover:text-red-800 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw size={11} />
                      <span>Reset All</span>
                    </button>
                  )}
                  <button
                    onClick={() => setIsSidebarCollapsed(true)}
                    className="hidden lg:flex items-center text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Collapse sidebar to expand grid"
                  >
                    <PanelLeftClose size={15} />
                  </button>
                </div>
              </div>

              {/* Applied Filter Chips */}
              {hasActiveFilters && (
                <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-medium border border-slate-200">
                      <span>"{searchQuery}"</span>
                      <X size={11} className="cursor-pointer hover:text-red-600" onClick={() => setSearchQuery("")} />
                    </span>
                  )}
                  {selectedDealer !== "All" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-[#B30D12] text-[11px] font-bold border border-red-200">
                      <span>Dealer: {selectedDealer}</span>
                      <X size={11} className="cursor-pointer hover:text-red-900" onClick={() => setSelectedDealer("All")} />
                    </span>
                  )}
                  {selectedStatus !== "All" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-medium border border-slate-200">
                      <span>Status: {selectedStatus}</span>
                      <X size={11} className="cursor-pointer hover:text-red-600" onClick={() => setSelectedStatus("All")} />
                    </span>
                  )}
                  {quickFilter !== "none" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-[#B30D12] text-[11px] font-bold border border-red-200">
                      <span>Quick: {quickFilter}</span>
                      <X size={11} className="cursor-pointer hover:text-red-900" onClick={() => setQuickFilter("none")} />
                    </span>
                  )}
                  {selectedMakes.map((m) => (
                    <span key={m} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-medium border border-slate-200">
                      <span>{m}</span>
                      <X size={11} className="cursor-pointer hover:text-red-600" onClick={() => toggleMake(m)} />
                    </span>
                  ))}
                  {selectedFuels.map((f) => (
                    <span key={f} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-medium border border-slate-200">
                      <span>{f}</span>
                      <X size={11} className="cursor-pointer hover:text-red-600" onClick={() => toggleFuel(f)} />
                    </span>
                  ))}
                  {selectedGrades.map((g) => (
                    <span key={g} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-medium border border-slate-200">
                      <span>Grade {g}</span>
                      <X size={11} className="cursor-pointer hover:text-red-600" onClick={() => toggleGrade(g)} />
                    </span>
                  ))}
                  {maxBudget < 50000 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-medium border border-slate-200">
                      <span>Under NZ${maxBudget.toLocaleString()}</span>
                      <X size={11} className="cursor-pointer hover:text-red-600" onClick={() => setMaxBudget(50000)} />
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* CARD 1: Dealership Allocation & Status (Admin Feature) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)] p-4 sm:p-5 space-y-3.5">
              <div
                className="flex items-center justify-between cursor-pointer select-none group"
                onClick={() => toggleCardCollapse("dealer")}
              >
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-slate-900 text-sm tracking-tight">Dealership Allocation</h3>
                  {(selectedDealer !== "All" || selectedStatus !== "All") && (
                    <span className="w-2 h-2 rounded-full bg-[#B30D12]" />
                  )}
                </div>
                <button
                  type="button"
                  className="text-slate-400 group-hover:text-slate-700 transition-colors p-0.5"
                >
                  {cardCollapse.dealer ? <Plus size={16} /> : <Minus size={16} />}
                </button>
              </div>

              {!cardCollapse.dealer && (
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Client Dealership
                    </label>
                    <div className="relative">
                      <select
                        value={selectedDealer}
                        onChange={(e) => setSelectedDealer(e.target.value)}
                        className="w-full appearance-none px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-[#B30D12] cursor-pointer"
                      >
                        <option value="All">All Dealerships ({enrichedVehicles.length})</option>
                        {DEALERS.map((d) => (
                          <option key={d.id} value={d.name}>
                            {d.name} ({dealerCounts[d.name] || 0})
                          </option>
                        ))}
                        <option value="Unallocated">Unallocated Lots ({dealerCounts["Unallocated"] || 0})</option>
                      </select>
                      <ChevronDown
                        size={13}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Allocation Status
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {["All", "Priority", "Available", "Allocated", "Reserved"].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setSelectedStatus(st)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${selectedStatus === st
                            ? "bg-[#B30D12] text-white shadow-2xs"
                            : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80"
                            }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* CARD 2: Quick Recommended Filters */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)] p-4 sm:p-5 space-y-3.5">
              <div
                className="flex items-center justify-between cursor-pointer select-none group"
                onClick={() => toggleCardCollapse("recommended")}
              >
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-slate-900 text-sm tracking-tight">Quick Filters</h3>
                  {quickFilter !== "none" && (
                    <span className="w-2 h-2 rounded-full bg-[#B30D12]" />
                  )}
                </div>
                <button
                  type="button"
                  className="text-slate-400 group-hover:text-slate-700 transition-colors p-0.5"
                >
                  {cardCollapse.recommended ? <Plus size={16} /> : <Minus size={16} />}
                </button>
              </div>

              {!cardCollapse.recommended && (
                <div className="space-y-1.5 pt-1">
                  {[
                    { id: "priority", label: "Priority (90+ Score)", count: priorityCount, icon: Flame },
                    { id: "highMargin", label: "High Margin ($3.5k+)", count: enrichedVehicles.filter(v => v.dynamicMargin >= 3500).length, icon: TrendingUp },
                    { id: "under20k", label: "Under NZ$20k Landed", count: enrichedVehicles.filter(v => v.dynamicLanded <= 20000).length, icon: DollarSign },
                    { id: "grade45", label: "Grade 4.5+ (Pristine)", count: gradeCounts["4.5+"], icon: Award },
                    { id: "endingSoon", label: "Ending Soon (<60m)", count: enrichedVehicles.filter(v => (v.timeLeft || "").includes("m") && !(v.timeLeft || "").includes("d")).length, icon: Clock },
                    { id: "lowKm", label: "Low Mileage (<50k km)", count: enrichedVehicles.filter(v => v.km <= 50000).length, icon: Car },
                  ].map((qf) => {
                    const isSelected = quickFilter === qf.id;
                    const IconComp = qf.icon;
                    return (
                      <button
                        key={qf.id}
                        type="button"
                        onClick={() => setQuickFilter(isSelected ? "none" : (qf.id as any))}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${isSelected
                          ? "bg-red-50 text-[#B30D12] border border-red-200 shadow-2xs font-bold"
                          : "hover:bg-slate-50 text-slate-700 border border-transparent"
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <IconComp size={13} className={isSelected ? "text-[#B30D12]" : "text-slate-400"} />
                          <span>{qf.label}</span>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-slate-400">
                          {qf.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* CARD 3: Landed Budget Ceiling */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)] p-4 sm:p-5 space-y-3.5">
              <div
                className="flex items-center justify-between cursor-pointer select-none group"
                onClick={() => toggleCardCollapse("budget")}
              >
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-slate-900 text-sm tracking-tight">Landed Budget</h3>
                  {(maxBudget < 50000 || selectedPriceBrackets.length > 0) && (
                    <span className="w-2 h-2 rounded-full bg-[#B30D12]" />
                  )}
                </div>
                <button
                  type="button"
                  className="text-slate-400 group-hover:text-slate-700 transition-colors p-0.5"
                >
                  {cardCollapse.budget ? <Plus size={16} /> : <Minus size={16} />}
                </button>
              </div>

              {!cardCollapse.budget && (
                <div className="space-y-3 pt-1">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-500 font-medium">Max Landed Ceiling:</span>
                      <span className="font-black text-slate-900 font-mono text-sm">
                        {maxBudget >= 50000 ? "Any Budget" : `NZ$${maxBudget.toLocaleString()}`}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={12000}
                      max={50000}
                      step={1000}
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(Number(e.target.value))}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#B30D12]"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
                      <span>NZ$12k</span>
                      <span>NZ$30k</span>
                      <span>No Limit</span>
                    </div>
                  </div>

                  {/* Price Bracket Pills */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    {[
                      { id: "under16k", label: "< NZ$16k", count: priceBracketCounts.under16k },
                      { id: "from16kTo22k", label: "NZ$16k – $22k", count: priceBracketCounts.from16kTo22k },
                      { id: "from22kTo28k", label: "NZ$22k – $28k", count: priceBracketCounts.from22kTo28k },
                      { id: "from28kTo35k", label: "NZ$28k – $35k", count: priceBracketCounts.from28kTo35k },
                      { id: "over35k", label: "> NZ$35k", count: priceBracketCounts.over35k },
                    ].map((b) => {
                      const isChecked = selectedPriceBrackets.includes(b.id);
                      return (
                        <label
                          key={b.id}
                          className="flex items-center justify-between text-xs text-slate-700 hover:text-slate-900 cursor-pointer py-0.5 group"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => togglePriceBracket(b.id)}
                              className="w-3.5 h-3.5 rounded text-[#B30D12] focus:ring-[#B30D12]/20 border-slate-300 accent-[#B30D12] cursor-pointer"
                            />
                            <span className={isChecked ? "font-bold text-slate-900" : "font-medium"}>
                              {b.label}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400 font-mono group-hover:text-slate-600">
                            {b.count}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* CARD 4: Brand / Makes */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)] p-4 sm:p-5 space-y-3.5">
              <div
                className="flex items-center justify-between cursor-pointer select-none group"
                onClick={() => toggleCardCollapse("brand")}
              >
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-slate-900 text-sm tracking-tight">Brand &amp; Make</h3>
                  {selectedMakes.length > 0 && (
                    <span className="px-1.5 py-0.5 bg-red-100 text-[#B30D12] rounded-full text-[10px] font-black">
                      {selectedMakes.length}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {selectedMakes.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMakes([]);
                      }}
                      className="text-[10px] font-bold text-red-600 hover:text-red-800 hover:underline"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="button"
                    className="text-slate-400 group-hover:text-slate-700 transition-colors p-0.5"
                  >
                    {cardCollapse.brand ? <Plus size={16} /> : <Minus size={16} />}
                  </button>
                </div>
              </div>

              {!cardCollapse.brand && (
                <div className="space-y-3 pt-1">
                  {/* Instant Brand Search */}
                  <div className="relative">
                    <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={brandSearch}
                      onChange={(e) => setBrandSearch(e.target.value)}
                      placeholder="Filter make (Toyota, Honda...)"
                      className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#B30D12] outline-none transition-all placeholder:text-slate-400"
                    />
                    {brandSearch && (
                      <button
                        onClick={() => setBrandSearch("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>

                  {/* Brand Checkbox List */}
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {displayedMakes.map(([make, count]) => {
                      const isChecked = selectedMakes.includes(make);
                      return (
                        <label
                          key={make}
                          className="flex items-center justify-between text-xs text-slate-700 hover:text-slate-900 cursor-pointer py-0.5 group"
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleMake(make)}
                              className="w-4 h-4 rounded text-[#B30D12] focus:ring-[#B30D12]/20 border-slate-300 accent-[#B30D12] cursor-pointer"
                            />
                            <span className={`font-medium ${isChecked ? "font-bold text-slate-900" : ""}`}>
                              {make}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400 font-mono group-hover:text-slate-600">
                            {count}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  {/* Show More toggle if more than 5 brands */}
                  {filteredMakesList.length > 5 && !brandSearch && (
                    <button
                      onClick={() => setShowAllBrands(!showAllBrands)}
                      className="text-xs font-bold text-[#B30D12] hover:text-[#940B0F] hover:underline cursor-pointer flex items-center gap-1 pt-0.5"
                    >
                      <span>
                        {showAllBrands ? "Show Less" : `Show More (${filteredMakesList.length - 5} more)`}
                      </span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* CARD 5: Powertrain */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)] p-4 sm:p-5 space-y-3.5">
              <div
                className="flex items-center justify-between cursor-pointer select-none group"
                onClick={() => toggleCardCollapse("powertrain")}
              >
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-slate-900 text-sm tracking-tight">Powertrain</h3>
                  {selectedFuels.length > 0 && (
                    <span className="px-1.5 py-0.5 bg-red-100 text-[#B30D12] rounded-full text-[10px] font-black">
                      {selectedFuels.length}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {selectedFuels.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFuels([]);
                      }}
                      className="text-[10px] font-bold text-red-600 hover:text-red-800 hover:underline"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="button"
                    className="text-slate-400 group-hover:text-slate-700 transition-colors p-0.5"
                  >
                    {cardCollapse.powertrain ? <Plus size={16} /> : <Minus size={16} />}
                  </button>
                </div>
              </div>

              {!cardCollapse.powertrain && (
                <div className="space-y-2 pt-1">
                  {[
                    { id: "Hybrid", label: "Hybrid / PHEV", count: powertrainCounts.Hybrid },
                    { id: "Petrol", label: "Petrol", count: powertrainCounts.Petrol },
                    { id: "Diesel", label: "Diesel", count: powertrainCounts.Diesel },
                    { id: "Electric", label: "Electric (EV)", count: powertrainCounts.Electric },
                  ].map((pt) => {
                    const isChecked = selectedFuels.includes(pt.id);
                    return (
                      <label
                        key={pt.id}
                        className="flex items-center justify-between text-xs text-slate-700 hover:text-slate-900 cursor-pointer py-0.5 group"
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleFuel(pt.id)}
                            className="w-4 h-4 rounded text-[#B30D12] focus:ring-[#B30D12]/20 border-slate-300 accent-[#B30D12] cursor-pointer"
                          />
                          <span className={`font-medium ${isChecked ? "font-bold text-slate-900" : ""}`}>
                            {pt.label}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 font-mono group-hover:text-slate-600">
                          {pt.count}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* CARD 6: Auction Sheet Grade */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)] p-4 sm:p-5 space-y-3.5">
              <div
                className="flex items-center justify-between cursor-pointer select-none group"
                onClick={() => toggleCardCollapse("grade")}
              >
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-slate-900 text-sm tracking-tight">Auction Sheet Grade</h3>
                  {selectedGrades.length > 0 && (
                    <span className="px-1.5 py-0.5 bg-red-100 text-[#B30D12] rounded-full text-[10px] font-black">
                      {selectedGrades.length}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {selectedGrades.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedGrades([]);
                      }}
                      className="text-[10px] font-bold text-red-600 hover:text-red-800 hover:underline"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="button"
                    className="text-slate-400 group-hover:text-slate-700 transition-colors p-0.5"
                  >
                    {cardCollapse.grade ? <Plus size={16} /> : <Minus size={16} />}
                  </button>
                </div>
              </div>

              {!cardCollapse.grade && (
                <div className="space-y-2 pt-1">
                  {[
                    { id: "4.5+", label: "Grade 4.5+ (Pristine)", count: gradeCounts["4.5+"] },
                    { id: "4.0+", label: "Grade 4.0+ (Clean Condition)", count: gradeCounts["4.0+"] },
                    { id: "3.5+", label: "Grade 3.5+ (Good Average)", count: gradeCounts["3.5+"] },
                    { id: "3.0-", label: "Grade 3.0 & Below (Trade)", count: gradeCounts["3.0-"] },
                  ].map((g) => {
                    const isChecked = selectedGrades.includes(g.id);
                    return (
                      <label
                        key={g.id}
                        className="flex items-center justify-between text-xs text-slate-700 hover:text-slate-900 cursor-pointer py-0.5 group"
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleGrade(g.id)}
                            className="w-4 h-4 rounded text-[#B30D12] focus:ring-[#B30D12]/20 border-slate-300 accent-[#B30D12] cursor-pointer"
                          />
                          <span className={`font-medium ${isChecked ? "font-bold text-slate-900" : ""}`}>
                            {g.label}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 font-mono group-hover:text-slate-600">
                          {g.count}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: Modern Vehicle Catalog & Default Grids Layout               */}
          {/* ========================================================================= */}
          <main className="flex-1 min-w-0 space-y-5">
            {/* Catalog Control Header */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)] p-4 sm:p-5 space-y-4">
              {/* Top Row: Title, Result Count, and Search Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  {isSidebarCollapsed && (
                    <button
                      onClick={() => setIsSidebarCollapsed(false)}
                      className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      title="Show sourcing filter sidebar"
                    >
                      <PanelLeftOpen size={14} />
                      <span>Filters</span>
                    </button>
                  )}

                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                      {activeTab === "all" && "All Japanese Auction Lots"}
                      {activeTab === "priority" && "Priority Dealer Allocations"}
                      {activeTab === "available" && "Available Live Stock"}
                      {activeTab === "shortlisted" && "Dealership Shortlisted Lots"}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Showing <strong className="text-slate-900 font-bold">{filteredVehicles.length}</strong> matching auction lots across Japanese lanes
                    </p>
                  </div>
                </div>

                {/* Instant Search Bar */}
                <div className="relative w-full sm:w-72">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search model, make, lot #, dealer..."
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#B30D12] text-xs font-medium outline-none transition-all placeholder:text-slate-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              </div>

              {/* Bottom Row: Tabs & Sort Dropdown + View Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                {/* Segmented Catalog Tabs */}
                <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === "all"
                      ? "bg-[#B30D12] text-white shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                      }`}
                  >
                    <span>All Lots ({enrichedVehicles.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("priority")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === "priority"
                      ? "bg-[#B30D12] text-white shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                      }`}
                  >
                    <Flame
                      size={12}
                      className={activeTab === "priority" ? "text-white" : "text-slate-400"}
                    />
                    <span>Priority ({priorityCount})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("available")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === "available"
                      ? "bg-[#B30D12] text-white shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                      }`}
                  >
                    <Car
                      size={12}
                      className={activeTab === "available" ? "text-white" : "text-slate-400"}
                    />
                    <span>Available ({enrichedVehicles.filter((v) => v.status !== "Allocated").length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("shortlisted")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === "shortlisted"
                      ? "bg-[#B30D12] text-white shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                      }`}
                  >
                    <ShieldCheck
                      size={12}
                      className={activeTab === "shortlisted" ? "text-white" : "text-slate-400"}
                    />
                    <span>Saved ({syncState.shortlistedVehicleIds.length})</span>
                  </button>
                </div>

                {/* Sort Selector & View Mode Switcher */}
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="appearance-none pl-3 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-[#B30D12] cursor-pointer"
                    >
                      <option value="score">Sort: AI Score (Highest)</option>
                      <option value="marginDesc">Sort: Margin Spread (Highest)</option>
                      <option value="priceAsc">Sort: Landed Cost (Lowest)</option>
                      <option value="endingSoon">Sort: Auction Ending Soonest</option>
                      <option value="yearDesc">Sort: Year (Newest)</option>
                      <option value="kmAsc">Sort: Mileage (Lowest)</option>
                    </select>
                    <ChevronDown
                      size={13}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                  </div>

                  {/* View Switcher: Default is Grid */}
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${viewMode === "grid"
                        ? "bg-white text-slate-900 shadow-2xs"
                        : "text-slate-500 hover:text-slate-800"
                        }`}
                      title="Card Grid View"
                    >
                      <LayoutGrid size={15} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${viewMode === "list"
                        ? "bg-white text-slate-900 shadow-2xs"
                        : "text-slate-500 hover:text-slate-800"
                        }`}
                      title="Table List View"
                    >
                      <List size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Empty State */}
            {filteredVehicles.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-2xs space-y-3">
                <div className="w-12 h-12 rounded-full bg-red-50 text-[#B30D12] flex items-center justify-center mx-auto">
                  <Car size={24} />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  No matching auction vehicles found
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  No lots match your current combination of filters. Try widening your budget ceiling, resetting specific makes, or clearing applied quick filters.
                </p>
                <button
                  onClick={resetAllFilters}
                  className="px-4 py-2 bg-[#B30D12] hover:bg-[#940B0F] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  Reset All Filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              /* DEFAULT GRIDS LAYOUT (3-Column Modern Cards) */
              <div className="space-y-6">
                <div
                  className={`grid grid-cols-1 gap-5 sm:gap-6 ${
                    isSidebarCollapsed
                      ? "sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                      : "sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3"
                  }`}
                >
                  {paginatedVehicles.map((vehicle) => (
                    <ModernVehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      isShortlisted={syncState.shortlistedVehicleIds.includes(vehicle.id)}
                      onToggleShortlist={toggleShortlistVehicle}
                      onAskCopilot={triggerAutoHubCopilot}
                      showDealerBadge={true}
                      detailHref={`/admin/vehicles/${vehicle.id}`}
                    />
                  ))}
                </div>

                {renderPagination(
                  "bg-white p-4 sm:px-6 rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                )}
              </div>
            ) : (
              /* TABLE / LIST VIEW (Detailed Admin Table) */
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="px-4 py-3.5">Vehicle</th>
                          <th className="px-4 py-3.5">Auction Specs</th>
                          <th className="px-4 py-3.5">Dealership Assignment</th>
                          <th className="px-4 py-3.5 text-right">Landed (NZD)</th>
                          <th className="px-4 py-3.5 text-right">Margin Spread</th>
                          <th className="px-4 py-3.5 text-center">Score</th>
                          <th className="px-4 py-3.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {paginatedVehicles.map((vehicle) => (
                          <tr key={vehicle.id} className="hover:bg-slate-50/70 transition-colors">
                            {/* Vehicle Column */}
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-3">
                                <Link href={`/admin/vehicles/${vehicle.id}`} className="shrink-0 block">
                                  <img
                                    src={vehicle.image}
                                    alt=""
                                    className="w-14 h-10 object-cover rounded-lg border border-slate-200 hover:opacity-90 transition-opacity"
                                  />
                                </Link>
                                <div>
                                  <Link
                                    href={`/admin/vehicles/${vehicle.id}`}
                                    className="font-bold text-slate-900 hover:text-[#B30D12] transition-colors leading-tight block"
                                  >
                                    {vehicle.year} {vehicle.make} {vehicle.model}
                                  </Link>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-[10px] text-slate-400 font-mono">
                                      Lot #{vehicle.lotNumber}
                                    </span>
                                    <span className="text-[10px] text-slate-300">•</span>
                                    <span className="text-[10px] text-slate-500">{vehicle.auctionHouse}</span>
                                    <span className="text-[10px] px-1 py-0.2 bg-slate-100 rounded text-slate-700 font-bold">
                                      Gr {vehicle.grade}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Auction Specs Column */}
                            <td className="px-4 py-3.5 text-slate-600">
                              <div className="space-y-0.5 text-[11px]">
                                <div>
                                  <span className="font-semibold">{vehicle.fuel}</span> • {vehicle.km.toLocaleString()} km
                                </div>
                                <div className="text-slate-400 flex items-center gap-1">
                                  <Clock size={10} /> {vehicle.timeLeft}
                                </div>
                              </div>
                            </td>

                            {/* Dealership Assignment */}
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-1.5">
                                <Building2 size={13} className="text-[#B30D12] shrink-0" />
                                <span className="font-bold text-slate-800 text-xs">
                                  {vehicle.dealer || "Unallocated"}
                                </span>
                              </div>
                              <span
                                className={`inline-block mt-1 text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${vehicle.status === "Priority"
                                  ? "bg-red-50 text-[#B30D12] border border-red-200"
                                  : vehicle.status === "Allocated"
                                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                                    : vehicle.status === "Consider"
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                      : "bg-slate-100 text-slate-700 border border-slate-200"
                                  }`}
                              >
                                {vehicle.status}
                              </span>
                            </td>

                            {/* Landed NZD */}
                            <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900 text-xs">
                              NZ${vehicle.dynamicLanded.toLocaleString("en-US")}
                            </td>

                            {/* Margin Spread */}
                            <td className="px-4 py-3.5 text-right font-mono font-black text-emerald-700 text-xs">
                              +NZ${vehicle.dynamicMargin.toLocaleString("en-US")}
                            </td>

                            {/* Score */}
                            <td className="px-4 py-3.5 text-center">
                              <span
                                className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg text-xs font-black ${vehicle.matchScore >= 90
                                  ? "bg-red-50 text-[#B30D12] border border-red-200"
                                  : "bg-slate-100 text-slate-700"
                                  }`}
                              >
                                <Sparkles size={11} /> {vehicle.matchScore}
                              </span>
                            </td>

                            {/* Action */}
                            <td className="px-4 py-3.5 text-right">
                              <Link
                                href={`/admin/vehicles/${vehicle.id}`}
                                className="px-3 py-1.5 bg-[#B30D12] hover:bg-[#940B0F] text-white rounded-lg text-xs font-bold transition-all shadow-2xs inline-flex items-center gap-1"
                              >
                                <span>Inspect</span>
                                <ArrowRight size={11} />
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {renderPagination(
                  "bg-white p-4 sm:px-6 rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </AdminLayout>
  );
}
