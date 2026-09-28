"use client";

import React, { useState, useEffect, useMemo } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Clock,
  Car as CarIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Search,
  Filter,
  DollarSign,
  ShieldCheck,
  Flame,
  RotateCcw,
  LayoutGrid,
  List,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  Minus,
  Plus,
  Info,
  Bookmark,
  BookmarkCheck
} from "lucide-react";
import { VEHICLES } from "@/lib/data";
import { useSyncStore } from "@/lib/syncStore";

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

export default function VehiclesPage() {
  const { state: syncState, toggleShortlistVehicle } = useSyncStore();

  // Sidebar Controls
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters State matching existing catalog
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedMake, setSelectedMake] = useState<string>("All");
  const [selectedFuel, setSelectedFuel] = useState<string>("All");
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [selectedPriceBrackets, setSelectedPriceBrackets] = useState<string[]>([]);
  const [maxBudget, setMaxBudget] = useState<number>(45000);
  const [onlyWishlist, setOnlyWishlist] = useState<boolean>(false);
  const [onlyShortlisted, setOnlyShortlisted] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"score" | "priceAsc" | "marginDesc" | "yearDesc" | "kmAsc" | "endingSoon">("score");

  // View Mode: Default to "grid" as requested
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Brand Search within Filter Sidebar
  const [brandSearch, setBrandSearch] = useState("");
  const [showAllBrands, setShowAllBrands] = useState(false);

  // Filter Cards Collapsible Accordion State
  const [cardCollapse, setCardCollapse] = useState({
    status: false,
    make: false,
    fuel: false,
    budget: false,
    grade: false,
  });

  const toggleCardCollapse = (section: keyof typeof cardCollapse) => {
    setCardCollapse((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Pagination (10 entries max per page matching existing catalog)
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Auto-reset page when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    selectedStatus,
    selectedMake,
    selectedFuel,
    selectedGrades,
    selectedPriceBrackets,
    maxBudget,
    onlyWishlist,
    onlyShortlisted,
    sortBy,
  ]);

  // Pre-calculate enriched financial metrics for all vehicles
  const enrichedVehicles = useMemo(() => {
    return VEHICLES.map((v) => {
      const dynamicLanded = Math.round(
        ((v.fobJpy / syncState.fxRateJpyNzd) +
          syncState.freightPerUnitNzd +
          syncState.compliancePerUnitNzd) *
        1.15
      );
      const dynamicMargin = Math.max(1500, v.estRetailNzd - dynamicLanded);
      const isWishlistMatch = (syncState.dealerModels || []).some((m) =>
        v.model.toLowerCase().includes(m.toLowerCase())
      );
      const isShortlisted = syncState.shortlistedVehicleIds.includes(v.id);

      return {
        ...v,
        dynamicLanded,
        dynamicMargin,
        isWishlistMatch,
        isShortlisted,
      };
    });
  }, [syncState]);

  // Dynamic filter options & count aggregates
  const statusCounts = useMemo(() => {
    return {
      All: enrichedVehicles.length,
      Priority: enrichedVehicles.filter((v) => v.status === "Priority").length,
      Consider: enrichedVehicles.filter((v) => v.status === "Consider").length,
      Review: enrichedVehicles.filter((v) => v.status === "Review").length,
    };
  }, [enrichedVehicles]);

  const makesWithCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    enrichedVehicles.forEach((v) => {
      counts[v.make] = (counts[v.make] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [enrichedVehicles]);

  const filteredMakesList = useMemo(() => {
    if (!brandSearch.trim()) return makesWithCounts;
    const q = brandSearch.toLowerCase();
    return makesWithCounts.filter(([m]) => m.toLowerCase().includes(q));
  }, [makesWithCounts, brandSearch]);

  const displayedMakes = useMemo(() => {
    if (showAllBrands || brandSearch.trim()) return filteredMakesList;
    return filteredMakesList.slice(0, 6);
  }, [filteredMakesList, showAllBrands, brandSearch]);

  const fuelCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: enrichedVehicles.length,
      Petrol: 0,
      Hybrid: 0,
      Diesel: 0,
      "Electric (EV)": 0,
      Gasoline: 0,
      "Petrol / Hybrid": 0,
    };

    enrichedVehicles.forEach((v) => {
      const f = (v.fuel || "").toLowerCase();
      if (f.includes("hybrid") && f.includes("petrol")) {
        counts["Petrol / Hybrid"] = (counts["Petrol / Hybrid"] || 0) + 1;
        counts["Hybrid"] = (counts["Hybrid"] || 0) + 1;
      } else if (f.includes("hybrid") || f.includes("phev")) {
        counts["Hybrid"] = (counts["Hybrid"] || 0) + 1;
      } else if (f.includes("diesel")) {
        counts["Diesel"] = (counts["Diesel"] || 0) + 1;
      } else if (f.includes("electric") || f.includes("ev")) {
        counts["Electric (EV)"] = (counts["Electric (EV)"] || 0) + 1;
      } else if (f.includes("gasoline")) {
        counts["Gasoline"] = (counts["Gasoline"] || 0) + 1;
      } else {
        counts["Petrol"] = (counts["Petrol"] || 0) + 1;
      }
    });

    return counts;
  }, [enrichedVehicles]);

  const priceBracketCounts = useMemo(() => {
    return {
      under16k: enrichedVehicles.filter((v) => v.dynamicLanded < 16000).length,
      from16kTo22k: enrichedVehicles.filter((v) => v.dynamicLanded >= 16000 && v.dynamicLanded <= 22000).length,
      from22kTo28k: enrichedVehicles.filter((v) => v.dynamicLanded > 22000 && v.dynamicLanded <= 28000).length,
      from28kTo35k: enrichedVehicles.filter((v) => v.dynamicLanded > 28000 && v.dynamicLanded <= 35000).length,
      over35k: enrichedVehicles.filter((v) => v.dynamicLanded > 35000).length,
    };
  }, [enrichedVehicles]);

  const gradeCounts = useMemo(() => {
    return {
      "5.0+": enrichedVehicles.filter((v) => ["5", "6", "S"].includes(String(v.grade))).length,
      "4.5+": enrichedVehicles.filter((v) => ["4.5", "5", "6", "S"].includes(String(v.grade))).length,
      "4.0+": enrichedVehicles.filter((v) => ["4", "4.5", "5", "6", "S"].includes(String(v.grade))).length,
      "3.5+": enrichedVehicles.filter((v) => ["3.5", "4", "4.5", "5", "6", "S"].includes(String(v.grade))).length,
      "3.0-": enrichedVehicles.filter((v) => ["3", "3.0", "RA", "R"].includes(String(v.grade))).length,
    };
  }, [enrichedVehicles]);

  // Main Filtering Logic
  const filteredVehicles = useMemo(() => {
    return enrichedVehicles
      .filter((v) => {
        // Search Input Match
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchesSearch =
            v.make.toLowerCase().includes(q) ||
            v.model.toLowerCase().includes(q) ||
            v.lotNumber.toLowerCase().includes(q) ||
            v.vin.toLowerCase().includes(q) ||
            v.badge.toLowerCase().includes(q) ||
            (v.stockid && v.stockid.toString().toLowerCase().includes(q)) ||
            (v.chassis && v.chassis.toLowerCase().includes(q)) ||
            (v.color && v.color.toLowerCase().includes(q)) ||
            (v.equip && v.equip.toLowerCase().includes(q));
          if (!matchesSearch) return false;
        }

        // Status Match
        if (selectedStatus !== "All" && v.status !== selectedStatus) {
          return false;
        }

        // Make Match
        if (selectedMake !== "All" && v.make !== selectedMake) {
          return false;
        }

        // Fuel Match
        if (selectedFuel !== "All") {
          const f = (v.fuel || "").toLowerCase();
          const sf = selectedFuel.toLowerCase();
          if (selectedFuel === "Petrol / Hybrid") {
            if (!(f.includes("hybrid") && f.includes("petrol"))) return false;
          } else if (selectedFuel === "Hybrid") {
            if (!(f.includes("hybrid") || f.includes("phev"))) return false;
          } else if (selectedFuel === "Diesel") {
            if (!f.includes("diesel")) return false;
          } else if (selectedFuel === "Electric (EV)") {
            if (!(f.includes("electric") || f.includes("ev"))) return false;
          } else if (selectedFuel === "Gasoline") {
            if (!f.includes("gasoline")) return false;
          } else if (selectedFuel === "Petrol") {
            if (!f.includes("petrol") || f.includes("hybrid")) return false;
          } else {
            if (!f.includes(sf)) return false;
          }
        }

        // Grade Match
        if (selectedGrades.length > 0) {
          const gStr = String(v.grade);
          const matchesGrade = selectedGrades.some((sel) => {
            if (sel === "5.0+") return ["5", "6", "S"].includes(gStr);
            if (sel === "4.5+") return ["4.5", "5", "6", "S"].includes(gStr);
            if (sel === "4.0+") return ["4", "4.5", "5", "6", "S"].includes(gStr);
            if (sel === "3.5+") return ["3.5", "4", "4.5", "5", "6", "S"].includes(gStr);
            if (sel === "3.0-") return ["3", "3.0", "RA", "R"].includes(gStr);
            return false;
          });
          if (!matchesGrade) return false;
        }

        // Price Bracket Match
        if (selectedPriceBrackets.length > 0) {
          const landed = v.dynamicLanded;
          const matchesBracket = selectedPriceBrackets.some((b) => {
            if (b === "under16k") return landed < 16000;
            if (b === "16k-22k") return landed >= 16000 && landed <= 22000;
            if (b === "22k-28k") return landed > 22000 && landed <= 28000;
            if (b === "28k-35k") return landed > 28000 && landed <= 35000;
            if (b === "over35k") return landed > 35000;
            return false;
          });
          if (!matchesBracket) return false;
        }

        // Max Budget Slider
        if (v.dynamicLanded > maxBudget) {
          return false;
        }

        // Wishlist Only
        if (onlyWishlist && !v.isWishlistMatch) {
          return false;
        }

        // Shortlisted Only
        if (onlyShortlisted && !v.isShortlisted) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "score") return b.score - a.score;
        if (sortBy === "priceAsc") return a.dynamicLanded - b.dynamicLanded;
        if (sortBy === "marginDesc") return b.dynamicMargin - a.dynamicMargin;
        if (sortBy === "yearDesc") return b.year - a.year;
        if (sortBy === "kmAsc") return a.km - b.km;
        if (sortBy === "endingSoon") {
          const getHours = (t: string) => {
            if (t.includes("h")) return parseInt(t) || 99;
            if (t.includes("d")) return (parseInt(t) || 99) * 24;
            return 99;
          };
          return getHours(a.timeLeft) - getHours(b.timeLeft);
        }
        return 0;
      });
  }, [
    enrichedVehicles,
    searchTerm,
    selectedStatus,
    selectedMake,
    selectedFuel,
    selectedGrades,
    selectedPriceBrackets,
    maxBudget,
    onlyWishlist,
    onlyShortlisted,
    sortBy,
  ]);

  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE) || 1;
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedVehicles = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredVehicles.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredVehicles, validCurrentPage]);

  const toggleGrade = (gradeId: string) => {
    setSelectedGrades((prev) =>
      prev.includes(gradeId) ? prev.filter((g) => g !== gradeId) : [...prev, gradeId]
    );
  };

  const togglePriceBracket = (bracketId: string) => {
    setSelectedPriceBrackets((prev) =>
      prev.includes(bracketId) ? prev.filter((b) => b !== bracketId) : [...prev, bracketId]
    );
  };

  const resetAllFilters = () => {
    setSearchTerm("");
    setSelectedStatus("All");
    setSelectedMake("All");
    setSelectedFuel("All");
    setSelectedGrades([]);
    setSelectedPriceBrackets([]);
    setMaxBudget(45000);
    setOnlyWishlist(false);
    setOnlyShortlisted(false);
    setBrandSearch("");
    setSortBy("score");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    selectedStatus !== "All" ||
    selectedMake !== "All" ||
    selectedFuel !== "All" ||
    selectedGrades.length > 0 ||
    selectedPriceBrackets.length > 0 ||
    maxBudget < 45000 ||
    onlyWishlist ||
    onlyShortlisted;

  const renderPagination = (containerClass: string) => {
    if (totalPages <= 1) return null;
    return (
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 ${containerClass}`}>
        <span className="text-xs font-semibold text-slate-500">
          Showing <strong className="text-slate-900 font-bold">{((validCurrentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(validCurrentPage * ITEMS_PER_PAGE, filteredVehicles.length)}</strong> of <strong className="text-slate-900 font-bold">{filteredVehicles.length}</strong> vehicles (Page <strong className="text-slate-900 font-bold">{validCurrentPage}</strong> of <strong className="text-slate-900 font-bold">{totalPages}</strong>)
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setCurrentPage((prev) => Math.max(1, prev - 1));
              window.scrollTo({ top: 180, behavior: 'smooth' });
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
                  window.scrollTo({ top: 180, behavior: 'smooth' });
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
              window.scrollTo({ top: 180, behavior: 'smooth' });
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
    <AppLayout>
      <div className="space-y-6 pb-12">

        {/* Page Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#1B2A4A]/10 text-[#1B2A4A]">
                Japanese Auction Pipeline
              </span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                USS, TAA & CAA Live Sync
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Auction Vehicles Catalog
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
              Filter by buying profile, review landed margin spreads, and check NZ market indicators before auction lanes close.
            </p>
          </div>

          {/* Quick Financial Parameter Ticker */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-2">
              <span className="text-slate-400 font-bold text-[10px] uppercase">FX</span>
              <span>1 NZD = ¥{syncState.fxRateJpyNzd.toFixed(1)}</span>
            </div>
            <div className="px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-2">
              <span className="text-slate-400 font-bold text-[10px] uppercase">Freight</span>
              <span>NZ${syncState.freightPerUnitNzd.toLocaleString()}</span>
            </div>
            <div className="px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-2">
              <span className="text-slate-400 font-bold text-[10px] uppercase">Compliance</span>
              <span>NZ${syncState.compliancePerUnitNzd.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex items-center gap-2 text-xs font-bold text-slate-800"
          >
            <Filter size={15} className="text-[#B30D12]" />
            <span>{mobileFilterOpen ? "Hide Filter Options" : "Show Side Filters"}</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[#B30D12]" />
            )}
          </button>
          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="text-xs font-bold text-red-600 flex items-center gap-1"
            >
              <RotateCcw size={11} /> Reset
            </button>
          )}
        </div>

        {/* 2-COLUMN MAIN CATALOG LAYOUT: Left Side Filter + Right Existing Catalog Grid */}
        <div className="flex flex-col lg:flex-row items-start gap-6">

          {/* LEFT COLUMN: Dedicated Side Filter Panel */}
          <aside
            className={`
              w-full lg:w-72 xl:w-80 shrink-0 space-y-4
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
                    Catalog Filters
                  </span>
                  {hasActiveFilters && (
                    <span className="w-2 h-2 rounded-full bg-[#B30D12]" />
                  )}
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
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-medium border border-slate-200">
                      <span>"{searchTerm}"</span>
                      <X size={11} className="cursor-pointer hover:text-red-600" onClick={() => setSearchTerm("")} />
                    </span>
                  )}
                  {selectedStatus !== "All" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-[#B30D12] text-[11px] font-bold border border-red-200">
                      <span>{selectedStatus}</span>
                      <X size={11} className="cursor-pointer hover:text-red-900" onClick={() => setSelectedStatus("All")} />
                    </span>
                  )}
                  {selectedMake !== "All" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-medium border border-slate-200">
                      <span>{selectedMake}</span>
                      <X size={11} className="cursor-pointer hover:text-red-600" onClick={() => setSelectedMake("All")} />
                    </span>
                  )}
                  {selectedFuel !== "All" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-medium border border-slate-200">
                      <span>{selectedFuel}</span>
                      <X size={11} className="cursor-pointer hover:text-red-600" onClick={() => setSelectedFuel("All")} />
                    </span>
                  )}
                  {selectedGrades.map((g) => (
                    <span key={g} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-medium border border-slate-200">
                      <span>Gr {g}</span>
                      <X size={11} className="cursor-pointer hover:text-red-600" onClick={() => toggleGrade(g)} />
                    </span>
                  ))}
                  {selectedPriceBrackets.map((b) => (
                    <span key={b} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-medium border border-slate-200">
                      <span>{b}</span>
                      <X size={11} className="cursor-pointer hover:text-red-600" onClick={() => togglePriceBracket(b)} />
                    </span>
                  ))}
                  {onlyWishlist && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-[#B30D12] text-[11px] font-bold border border-rose-200">
                      <span>Wishlist Match</span>
                      <X size={11} className="cursor-pointer hover:text-red-900" onClick={() => setOnlyWishlist(false)} />
                    </span>
                  )}
                  {onlyShortlisted && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-[#B30D12] text-[11px] font-bold border border-rose-200">
                      <span>Saved Lots</span>
                      <X size={11} className="cursor-pointer hover:text-red-900" onClick={() => setOnlyShortlisted(false)} />
                    </span>
                  )}
                  {maxBudget < 45000 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-medium border border-slate-200">
                      <span>&le; NZ${maxBudget.toLocaleString()}</span>
                      <X size={11} className="cursor-pointer hover:text-red-600" onClick={() => setMaxBudget(45000)} />
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* CARD 1: Sourcing Status Filter */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)] p-4 sm:p-5 space-y-3.5">
              <div
                className="flex items-center justify-between cursor-pointer select-none group"
                onClick={() => toggleCardCollapse("status")}
              >
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-slate-900 text-sm tracking-tight">Status</h3>
                  {selectedStatus !== "All" && (
                    <span className="px-1.5 py-0.5 bg-red-100 text-[#B30D12] rounded-full text-[10px] font-black">
                      1
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {selectedStatus !== "All" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStatus("All");
                      }}
                      className="text-[10px] font-bold text-red-600 hover:text-red-800 hover:underline cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                  <button
                    type="button"
                    className="text-slate-400 group-hover:text-slate-700 transition-colors p-0.5 cursor-pointer"
                    aria-label={cardCollapse.status ? "Expand Status Filter" : "Collapse Status Filter"}
                  >
                    {cardCollapse.status ? <Plus size={16} /> : <Minus size={16} />}
                  </button>
                </div>
              </div>

              {!cardCollapse.status && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {[
                    { id: "All", label: "All Statuses", count: statusCounts.All },
                    { id: "Priority", label: "Priority", count: statusCounts.Priority },
                    { id: "Consider", label: "Consider", count: statusCounts.Consider },
                    { id: "Review", label: "Review", count: statusCounts.Review },
                  ].map((st) => {
                    const isSelected = selectedStatus === st.id;
                    return (
                      <button
                        key={st.id}
                        onClick={() => setSelectedStatus(st.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer border ${isSelected
                          ? "bg-[#B30D12] text-white border-[#B30D12] shadow-2xs"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80"
                          }`}
                      >
                        <span>{st.label}</span>
                        <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${isSelected ? "bg-white/20 text-white" : "bg-white text-slate-500 border border-slate-200"
                          }`}>
                          {st.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* CARD 2: Make / Brand Filter */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)] p-4 sm:p-5 space-y-3.5">
              <div
                className="flex items-center justify-between cursor-pointer select-none group"
                onClick={() => toggleCardCollapse("make")}
              >
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-slate-900 text-sm tracking-tight">Make / Brand</h3>
                  {selectedMake !== "All" && (
                    <span className="px-1.5 py-0.5 bg-red-100 text-[#B30D12] rounded-full text-[10px] font-black">
                      1
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {selectedMake !== "All" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMake("All");
                      }}
                      className="text-[10px] font-bold text-red-600 hover:text-red-800 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="button"
                    className="text-slate-400 group-hover:text-slate-700 transition-colors p-0.5 cursor-pointer"
                    aria-label={cardCollapse.make ? "Expand Make Filter" : "Collapse Make Filter"}
                  >
                    {cardCollapse.make ? <Plus size={16} /> : <Minus size={16} />}
                  </button>
                </div>
              </div>

              {!cardCollapse.make && (
                <div className="space-y-3 pt-1">
                  {/* Brand Instant Search Input */}
                  <div className="relative">
                    <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={brandSearch}
                      onChange={(e) => setBrandSearch(e.target.value)}
                      placeholder="Search make (Toyota, Honda...)"
                      className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#B30D12] outline-none transition-all placeholder:text-slate-400"
                    />
                    {brandSearch && (
                      <button
                        onClick={() => setBrandSearch("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>

                  {/* Make List */}
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {/* All Makes Option */}
                    <button
                      onClick={() => setSelectedMake("All")}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${selectedMake === "All"
                        ? "bg-red-50 text-[#B30D12] font-bold"
                        : "hover:bg-slate-50 text-slate-700"
                        }`}
                    >
                      <span>All Makes</span>
                      <span className="text-xs text-slate-400 font-mono">
                        {enrichedVehicles.length}
                      </span>
                    </button>

                    {displayedMakes.map(([make, count]) => {
                      const isSelected = selectedMake === make;
                      return (
                        <button
                          key={make}
                          onClick={() => setSelectedMake(isSelected ? "All" : make)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${isSelected
                            ? "bg-red-50 text-[#B30D12] font-bold"
                            : "hover:bg-slate-50 text-slate-700"
                            }`}
                        >
                          <span className="truncate">{make}</span>
                          <span className="text-xs text-slate-400 font-mono shrink-0 ml-2">
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Show More toggle */}
                  {filteredMakesList.length > 6 && !brandSearch && (
                    <button
                      onClick={() => setShowAllBrands(!showAllBrands)}
                      className="text-xs font-bold text-[#B30D12] hover:text-[#940B0F] hover:underline cursor-pointer flex items-center gap-1 pt-0.5"
                    >
                      <span>
                        {showAllBrands
                          ? "Show Less"
                          : `Show More (${filteredMakesList.length - 6} more)`}
                      </span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* CARD 3: Fuel / Powertrain Filter */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)] p-4 sm:p-5 space-y-3.5">
              <div
                className="flex items-center justify-between cursor-pointer select-none group"
                onClick={() => toggleCardCollapse("fuel")}
              >
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-slate-900 text-sm tracking-tight">Fuel Type</h3>
                  {selectedFuel !== "All" && (
                    <span className="px-1.5 py-0.5 bg-red-100 text-[#B30D12] rounded-full text-[10px] font-black">
                      1
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {selectedFuel !== "All" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFuel("All");
                      }}
                      className="text-[10px] font-bold text-red-600 hover:text-red-800 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="button"
                    className="text-slate-400 group-hover:text-slate-700 transition-colors p-0.5 cursor-pointer"
                    aria-label={cardCollapse.fuel ? "Expand Fuel Filter" : "Collapse Fuel Filter"}
                  >
                    {cardCollapse.fuel ? <Plus size={16} /> : <Minus size={16} />}
                  </button>
                </div>
              </div>

              {!cardCollapse.fuel && (
                <div className="space-y-1.5 pt-1">
                  {[
                    "All",
                    "Petrol",
                    "Hybrid",
                    "Diesel",
                    "Electric (EV)",
                    "Gasoline",
                    "Petrol / Hybrid",
                  ].map((fuel) => {
                    const isSelected = selectedFuel === fuel;
                    const count = fuelCounts[fuel] || 0;
                    return (
                      <button
                        key={fuel}
                        onClick={() => setSelectedFuel(fuel)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${isSelected
                          ? "bg-red-50 text-[#B30D12] font-bold"
                          : "hover:bg-slate-50 text-slate-700"
                          }`}
                      >
                        <span>{fuel}</span>
                        <span className="text-xs text-slate-400 font-mono">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* CARD 4: Landed Budget (NZD) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)] p-4 sm:p-5 space-y-4">
              <div
                className="flex items-center justify-between cursor-pointer select-none group"
                onClick={() => toggleCardCollapse("budget")}
              >
                <h3 className="font-black text-slate-900 text-sm tracking-tight flex items-center gap-2">
                  <span>Landed Budget (NZD)</span>
                  {(maxBudget < 45000 || selectedPriceBrackets.length > 0) && (
                    <span className="w-2 h-2 rounded-full bg-[#B30D12]" />
                  )}
                </h3>
                <button
                  type="button"
                  className="text-slate-400 group-hover:text-slate-700 transition-colors p-0.5 cursor-pointer"
                  aria-label={cardCollapse.budget ? "Expand Budget Filter" : "Collapse Budget Filter"}
                >
                  {cardCollapse.budget ? <Plus size={16} /> : <Minus size={16} />}
                </button>
              </div>

              {!cardCollapse.budget && (
                <div className="space-y-4 pt-1">
                  {/* Highlighted Price Range */}
                  <div className="flex items-center justify-between font-black text-base text-[#B30D12]">
                    <span>NZ${maxBudget.toLocaleString()}</span>
                    <span>NZ$10,000</span>
                  </div>

                  {/* Range Slider */}
                  <div>
                    <input
                      type="range"
                      min={10000}
                      max={45000}
                      step={1000}
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#B30D12]"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
                      <span>Max Landed Cap</span>
                      <span>Min Baseline</span>
                    </div>
                  </div>

                  {/* Price Range Checkboxes */}
                  <div className="pt-1 border-t border-slate-100">
                    <h4 className="text-xs font-black text-slate-800 mb-2.5">
                      Price Range
                    </h4>

                    <div className="space-y-2">
                      {[
                        { id: "under16k", label: "Under NZ$16,000", count: priceBracketCounts.under16k },
                        { id: "16k-22k", label: "NZ$16,000 – NZ$22,000", count: priceBracketCounts.from16kTo22k },
                        { id: "22k-28k", label: "NZ$22,000 – NZ$28,000", count: priceBracketCounts.from22kTo28k },
                        { id: "28k-35k", label: "NZ$28,000 – NZ$35,000", count: priceBracketCounts.from28kTo35k },
                        { id: "over35k", label: "Above NZ$35,000", count: priceBracketCounts.over35k },
                      ].map((bracket) => {
                        const isChecked = selectedPriceBrackets.includes(bracket.id);
                        return (
                          <label
                            key={bracket.id}
                            className="flex items-center justify-between text-xs text-slate-700 hover:text-slate-900 cursor-pointer py-0.5 group"
                          >
                            <div className="flex items-center gap-2.5">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => togglePriceBracket(bracket.id)}
                                className="w-4 h-4 rounded text-[#B30D12] focus:ring-[#B30D12]/20 border-slate-300 accent-[#B30D12] cursor-pointer"
                              />
                              <span className={`font-medium ${isChecked ? "font-bold text-slate-900" : ""}`}>
                                {bracket.label}
                              </span>
                            </div>
                            <span className="text-xs text-slate-400 font-mono group-hover:text-slate-600">
                              {bracket.count}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* CARD 5: Auction Sheet Grade */}
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
                      className="text-[10px] font-bold text-red-600 hover:text-red-800 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="button"
                    className="text-slate-400 group-hover:text-slate-700 transition-colors p-0.5 cursor-pointer"
                    aria-label={cardCollapse.grade ? "Expand Grade Filter" : "Collapse Grade Filter"}
                  >
                    {cardCollapse.grade ? <Plus size={16} /> : <Minus size={16} />}
                  </button>
                </div>
              </div>

              {!cardCollapse.grade && (
                <div className="space-y-2 pt-1">
                  {[
                    { id: "5.0+", label: "Grade 5.0+ (Like New / Showroom)", count: gradeCounts["5.0+"] },
                    { id: "4.5+", label: "Grade 4.5+ (Pristine Condition)", count: gradeCounts["4.5+"] },
                    { id: "4.0+", label: "Grade 4.0+ (Clean Condition)", count: gradeCounts["4.0+"] },
                    { id: "3.5+", label: "Grade 3.5+ (Good Average)", count: gradeCounts["3.5+"] },
                    { id: "3.0-", label: "Grade 3.0 & Below (Trade / Value)", count: gradeCounts["3.0-"] },
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

            {/* Quick Sourcing Match Toggles */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)] p-4 space-y-2.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Quick Dealership Filters
              </span>
              <label className="flex items-center justify-between text-xs text-slate-700 hover:text-slate-900 cursor-pointer py-0.5 group">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={onlyWishlist}
                    onChange={(e) => setOnlyWishlist(e.target.checked)}
                    className="w-4 h-4 rounded text-[#B30D12] focus:ring-[#B30D12]/20 border-slate-300 accent-[#B30D12] cursor-pointer"
                  />
                  <span className={`font-medium ${onlyWishlist ? "font-bold text-[#B30D12]" : ""}`}>
                    Wishlist Matches Only
                  </span>
                </div>
              </label>

              <label className="flex items-center justify-between text-xs text-slate-700 hover:text-slate-900 cursor-pointer py-0.5 group">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={onlyShortlisted}
                    onChange={(e) => setOnlyShortlisted(e.target.checked)}
                    className="w-4 h-4 rounded text-[#B30D12] focus:ring-[#B30D12]/20 border-slate-300 accent-[#B30D12] cursor-pointer"
                  />
                  <span className={`font-medium ${onlyShortlisted ? "font-bold text-[#B30D12]" : ""}`}>
                    Saved / Shortlisted Lots ({syncState.shortlistedVehicleIds.length})
                  </span>
                </div>
              </label>
            </div>
          </aside>

          {/* RIGHT COLUMN: Catalog Top Control Bar & 3-Column Vehicle Grid (Matching Existing Design) */}
          <main className="flex-1 min-w-0 space-y-5">

            {/* Catalog Top Control Header (Clean single-row header without duplicate filter chips) */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Expand sidebar button if collapsed */}
                {isSidebarCollapsed && (
                  <button
                    onClick={() => setIsSidebarCollapsed(false)}
                    className="hidden lg:flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
                    title="Show filter sidebar"
                  >
                    <PanelLeftOpen size={14} />
                    <span>Filters</span>
                  </button>
                )}

                <div className="text-xs font-bold text-slate-500">
                  {filteredVehicles.length > 0 ? (
                    <>
                      Showing <span className="text-slate-900 font-extrabold">{((validCurrentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(validCurrentPage * ITEMS_PER_PAGE, filteredVehicles.length)}</span> of <span className="text-slate-900 font-extrabold">{filteredVehicles.length}</span> matching auction lots
                    </>
                  ) : (
                    <>Showing <span className="text-slate-900 font-extrabold">0</span> matching auction lots</>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                {/* Search Input */}
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by make, model, lot #, badge or VIN..."
                    className="w-full pl-9 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#B30D12] text-xs font-medium outline-none transition-all placeholder:text-slate-400"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* Sort Selector Dropdown */}
                <div className="relative w-full sm:w-56 shrink-0">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full appearance-none pl-3.5 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#B30D12] text-xs font-semibold text-slate-800 outline-none transition-all cursor-pointer"
                  >
                    <option value="score">Sort: AI Score (Highest)</option>
                    <option value="priceAsc">Sort: Landed Cost (Lowest)</option>
                    <option value="marginDesc">Sort: Margin Spread (Highest)</option>
                    <option value="yearDesc">Sort: Year (Newest)</option>
                    <option value="kmAsc">Sort: Mileage (Lowest)</option>
                    <option value="endingSoon">Sort: Auction Ending Soonest</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={13} />
                </div>

                {/* View Switcher: Grid (Default) vs List */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 shrink-0 self-end sm:self-auto">
                  <button
                    onClick={() => setViewMode("grid")}
                    title="Grid View (Default)"
                    className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${viewMode === "grid"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                      }`}
                  >
                    <LayoutGrid size={15} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    title="List View"
                    className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${viewMode === "list"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                      }`}
                  >
                    <List size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Vehicle Results: Existing 3-Column Card Grid */}
            {filteredVehicles.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <CarIcon size={24} />
                </div>
                <h3 className="text-base font-bold text-slate-900">No auction vehicles found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                  No vehicles match your active search and filter criteria. Try adjusting or resetting your filters.
                </p>
                <button
                  onClick={resetAllFilters}
                  className="px-4 py-2 bg-[#B30D12] hover:bg-[#940B0F] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              /* THE EXACT EXISTING 3-COLUMN CARD GRID */
              <div className="space-y-6">
                <div
                  className={`grid grid-cols-1 gap-5 sm:gap-6 ${
                    isSidebarCollapsed
                      ? "sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                      : "sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3"
                  }`}
                >
                  {paginatedVehicles.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col hover:shadow-md transition-shadow group"
                    >
                      {/* Vehicle Image with Stamps */}
                      <div className="h-[210px] relative shrink-0 overflow-hidden bg-slate-100">
                        <img
                          src={vehicle.image}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1322]/80 via-transparent to-black/25" />

                        {/* Grade Stamp */}
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 bg-[#0B1322]/90 backdrop-blur-md text-white font-extrabold text-[11px] rounded-lg border border-white/20 shadow-sm uppercase">
                            GRADE {vehicle.grade} / {vehicle.interiorGrade || "A"}
                          </span>
                        </div>

                        {/* Countdown Timer */}
                        <div className="absolute top-3 right-3">
                          <span className="px-2.5 py-1 bg-slate-500/90 text-white font-bold text-[11px] rounded-lg flex items-center gap-1 shadow-sm">
                            <Clock size={11} /> {vehicle.timeLeft}
                          </span>
                        </div>

                        {/* Bottom Lot & Auction House */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-200 font-medium">
                          <span className="font-semibold text-white">{vehicle.auctionHouse}</span>
                          <span className="font-mono bg-black/40 px-2 py-0.5 rounded text-[11px] text-white">
                            Lot #{vehicle.lotNumber}
                          </span>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                {vehicle.isWishlistMatch && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-50 text-[#B30D12] border border-rose-200">
                                    Wishlist Match
                                  </span>
                                )}
                                <span className="text-[10px] font-bold text-slate-400 truncate">
                                  {vehicle.fuel}
                                </span>
                              </div>
                              <h3 className="text-base font-black text-slate-900 group-hover:text-[#B30D12] transition-colors leading-snug">
                                {vehicle.year} {vehicle.make} {vehicle.model}
                              </h3>
                              <p className="text-xs font-semibold text-slate-500 mt-0.5 truncate">
                                {vehicle.badge}
                              </p>
                            </div>

                            {/* Score Badge & Shortlist Bookmark */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => toggleShortlistVehicle(vehicle.id)}
                                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${vehicle.isShortlisted
                                  ? 'bg-rose-50 text-[#B30D12] border-rose-200'
                                  : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-700'
                                  }`}
                                title={vehicle.isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
                              >
                                {vehicle.isShortlisted ? (
                                  <BookmarkCheck size={14} className="fill-current" />
                                ) : (
                                  <Bookmark size={14} />
                                )}
                              </button>

                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-extrabold ${vehicle.status === 'Priority'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : vehicle.status === 'Consider'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                                }`}>
                                <Sparkles size={11} />
                                {vehicle.score}
                              </span>
                            </div>
                          </div>

                          <div className="text-[11px] text-slate-500 font-medium mt-2 flex items-center gap-2">
                            <span>{(vehicle.km).toLocaleString('en-US')} km</span>
                            <span>•</span>
                            <span>{vehicle.engine}</span>
                            <span>•</span>
                            <span>{vehicle.color}</span>
                          </div>

                          {/* Financial Stack (Full Width / Block Rows) */}
                          <div className="mt-4 p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10.5px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                Landed Cost
                              </span>
                              <span className="font-black text-slate-900 font-mono text-[13px] sm:text-[13.5px]">
                                NZ${vehicle.dynamicLanded.toLocaleString('en-US')}
                              </span>
                            </div>
                            <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/70">
                              <span className="text-[10.5px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                Est. Retail
                              </span>
                              <span className="font-bold text-slate-700 font-mono text-[13px] sm:text-[13.5px]">
                                NZ${(vehicle.estRetailNzd).toLocaleString('en-US')}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Card Bottom CTA (Full Width Block Stack) */}
                        <div className="pt-3 mt-3 border-t border-slate-100 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
                              Est. Margin Spread
                            </span>
                            <span className="text-base font-black text-emerald-700 font-mono">
                              +NZ${vehicle.dynamicMargin.toLocaleString('en-US')}
                            </span>
                          </div>

                          <Link
                            href={`/vehicles/${vehicle.id}`}
                            className="w-full py-2.5 px-3 bg-[#B30D12] hover:bg-[#940B0F] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                          >
                            <span>Calculate Landed Cost</span>
                            <ArrowRight size={13} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {renderPagination("bg-white p-4 sm:px-6 rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)]")}
              </div>
            ) : (
              /* Vehicle Results List/Table View */
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="px-5 py-3.5">Vehicle</th>
                        <th className="px-5 py-3.5">Auction Info</th>
                        <th className="px-5 py-3.5">Mileage & Specs</th>
                        <th className="px-5 py-3.5">FOB (JPY)</th>
                        <th className="px-5 py-3.5">Landed (NZD)</th>
                        <th className="px-5 py-3.5">Est. Retail</th>
                        <th className="px-5 py-3.5">Est. Margin</th>
                        <th className="px-5 py-3.5">AI Score</th>
                        <th className="px-5 py-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {paginatedVehicles.map((v) => (
                        <tr key={v.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={v.image}
                                alt={v.model}
                                className="w-12 h-10 object-cover rounded-lg shrink-0 border border-slate-200"
                              />
                              <div>
                                <div className="font-black text-slate-900">{v.year} {v.make} {v.model}</div>
                                <div className="text-[11px] text-slate-500">{v.badge}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="font-bold text-slate-800">{v.auctionHouse}</div>
                            <div className="text-[11px] text-slate-400 font-mono">Lot #{v.lotNumber} • Grade {v.grade}</div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="text-slate-800 font-semibold">{(v.km).toLocaleString('en-US')} km</div>
                            <div className="text-[11px] text-slate-400">{v.engine}</div>
                          </td>
                          <td className="px-5 py-4 font-mono font-bold text-slate-800">
                            ¥{(v.fobJpy).toLocaleString('en-US')}
                          </td>
                          <td className="px-5 py-4 font-bold text-slate-900">
                            NZ${(v.dynamicLanded).toLocaleString('en-US')}
                          </td>
                          <td className="px-5 py-4 font-bold text-slate-900">
                            NZ${(v.estRetailNzd).toLocaleString('en-US')}
                          </td>
                          <td className="px-5 py-4 font-black text-emerald-700 font-mono">
                            +NZ${v.dynamicMargin.toLocaleString('en-US')}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${v.status === 'Priority' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                              }`}>
                              <Sparkles size={10} /> {v.score}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => toggleShortlistVehicle(v.id)}
                                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${v.isShortlisted
                                  ? 'bg-rose-50 text-[#B30D12] border-rose-200'
                                  : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-700'
                                  }`}
                                title={v.isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
                              >
                                {v.isShortlisted ? <BookmarkCheck size={14} className="fill-current" /> : <Bookmark size={14} />}
                              </button>
                              <Link
                                href={`/vehicles/${v.id}`}
                                className="px-3 py-1.5 bg-[#B30D12] hover:bg-[#940B0F] text-white rounded-lg text-xs font-bold inline-flex items-center gap-1"
                              >
                                <span>Calculate</span>
                                <ArrowRight size={12} />
                              </Link>
                            </div>
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
                Indicative landed pricing and margin figures calculated using active NZD/JPY exchange rate and compliance profiles. Final bid decisions rest with the dealer.
              </span>
            </div>
          </main>
        </div>

      </div>
    </AppLayout>
  );
}
