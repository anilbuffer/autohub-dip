"use client";

import React, { useState, useEffect, useMemo } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Clock,
  TrendingUp,
  Car,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  CheckCircle2,
  Search,
  Filter,
  DollarSign,
  ShieldCheck,
  Flame,
  RotateCcw,
  LayoutGrid,
  List,
  ChevronDown,
  Layers,
  Fuel,
  Check,
  PanelLeftClose,
  PanelLeftOpen,
  FileText,
  Minus,
  Plus,
  Gauge,
  Award
} from "lucide-react";
import { VEHICLES } from "@/lib/data";
import { useSyncStore } from "@/lib/syncStore";
import { triggerAutoHubCopilot } from "@/components/chat/DealerChatAssistant";
import PreferencesLoginPromptModal from "@/components/dealer/PreferencesLoginPromptModal";
import ModernVehicleCard, { EnrichedVehicle } from "@/components/dealer/ModernVehicleCard";
import WrittenConfirmationPoModal from "@/components/dealer/WrittenConfirmationPoModal";

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

export default function Dashboard() {
  const { state: syncState, toggleShortlistVehicle } = useSyncStore();

  const [showPreferencesPrompt, setShowPreferencesPrompt] = useState(false);
  const [rerunNotification, setRerunNotification] = useState<string | null>(null);

  // Active Catalog Tab: "bestMatches" | "otherQualifying" | "all" | "shortlisted"
  const [activeTab, setActiveTab] = useState<"bestMatches" | "otherQualifying" | "all" | "shortlisted">("bestMatches");

  // Written Confirmation / PO Modal State
  const [isPoModalOpen, setIsPoModalOpen] = useState(false);
  const [poVehicles, setPoVehicles] = useState<EnrichedVehicle[]>([]);

  // Filter Sidebar Controls
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMakes, setSelectedMakes] = useState<string[]>([]);
  const [selectedFuels, setSelectedFuels] = useState<string[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [selectedPriceBrackets, setSelectedPriceBrackets] = useState<string[]>([]);
  const [maxBudget, setMaxBudget] = useState<number>(35000);
  const [sortBy, setSortBy] = useState<"score" | "marginDesc" | "priceAsc" | "yearDesc" | "kmAsc" | "endingSoon">("score");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Quick Recommended Filter Toggles
  const [quickFilter, setQuickFilter] = useState<"none" | "priority" | "highMargin" | "under20k" | "grade45" | "endingSoon" | "lowKm">("none");
  const [showMoreRecommended, setShowMoreRecommended] = useState(false);

  // Brand Search and Show More
  const [brandSearch, setBrandSearch] = useState("");
  const [showAllBrands, setShowAllBrands] = useState(false);

  // Separate Card Layouts Collapse State (false = expanded, true = collapsed)
  const [cardCollapse, setCardCollapse] = useState({
    recommended: false,
    budget: false,
    brand: false,
    powertrain: false,
    grade: false,
  });

  const toggleCardCollapse = (section: keyof typeof cardCollapse) => {
    setCardCollapse((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Pagination - top six matches per page
  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  // Check on mount if user just logged in or is starting session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const isFromLogin = urlParams.get("login") === "true";
      const loginSessionFlag = sessionStorage.getItem("autohub_prompt_preferences_on_login");
      const alreadyDismissed = sessionStorage.getItem("autohub_preferences_dismissed_session");

      if (isFromLogin || loginSessionFlag === "true" || !alreadyDismissed) {
        setShowPreferencesPrompt(true);
        sessionStorage.removeItem("autohub_prompt_preferences_on_login");
        sessionStorage.setItem("autohub_preferences_dismissed_session", "true");
        if (isFromLogin) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    }
  }, []);

  // Dynamically calculate landed, margin, and match scores against dealer preferences
  const enrichedVehicles: EnrichedVehicle[] = useMemo(() => {
    const preferredModels = (syncState.dealerModels || []).map((m) => m.toLowerCase());
    const preferredMakes = (syncState.dealerMakes || []).map((m) => m.toLowerCase());
    const targetBudget = syncState.dealerTargetBudget || 26000;
    const minMargin = syncState.dealerTargetMargin || 3500;
    const maxKm = syncState.dealerMaxKm || 75000;

    return VEHICLES.map((v) => {
      const landed = Math.round(
        (v.fobJpy / syncState.fxRateJpyNzd +
          syncState.freightPerUnitNzd +
          syncState.compliancePerUnitNzd) *
        1.15
      );
      const margin = Math.max(1500, v.estRetailNzd - landed);

      const matchesModel = preferredModels.some((m) => v.model.toLowerCase().includes(m));
      const matchesMake = preferredMakes.length === 0 || preferredMakes.includes(v.make.toLowerCase());
      const matchesBudget = landed <= targetBudget * 1.25;
      const matchesKm = v.km <= maxKm * 1.25;
      const matchesMargin = margin >= minMargin * 0.8;

      let matchScore = v.score;
      if (matchesModel) matchScore += 10;
      if (matchesMake) matchScore += 4;
      if (matchesBudget) matchScore += 4;
      if (matchesMargin) matchScore += 6;

      const isPriority = (matchesModel || (matchesMake && matchesMargin)) && matchesBudget;

      return {
        ...v,
        dynamicLanded: landed,
        dynamicMargin: margin,
        matchScore,
        isPriority,
      };
    });
  }, [syncState]);

  // Priority count & Other Qualifying count & Avg Priority Margin
  const priorityVehicles = useMemo(
    () => enrichedVehicles.filter((v) => v.isPriority),
    [enrichedVehicles]
  );

  const otherQualifyingVehicles = useMemo(
    () => enrichedVehicles.filter((v) => !v.isPriority),
    [enrichedVehicles]
  );

  const avgPriorityMargin = useMemo(() => {
    if (priorityVehicles.length === 0) return 3800;
    return Math.round(
      priorityVehicles.reduce((acc, v) => acc + v.dynamicMargin, 0) / priorityVehicles.length
    );
  }, [priorityVehicles]);

  // Unique makes with counts
  const availableMakes = useMemo(() => {
    const counts: Record<string, number> = {};
    enrichedVehicles.forEach((v) => {
      counts[v.make] = (counts[v.make] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [enrichedVehicles]);

  const filteredMakesList = useMemo(() => {
    if (!brandSearch.trim()) return availableMakes;
    const q = brandSearch.toLowerCase();
    return availableMakes.filter(([make]) => make.toLowerCase().includes(q));
  }, [availableMakes, brandSearch]);

  const displayedMakes = useMemo(() => {
    if (showAllBrands || brandSearch.trim()) return filteredMakesList;
    return filteredMakesList.slice(0, 5);
  }, [filteredMakesList, showAllBrands, brandSearch]);

  // Price bracket counts (aligned with reference UI)
  const priceBracketCounts = useMemo(() => {
    return {
      under16k: enrichedVehicles.filter((v) => v.dynamicLanded < 16000).length,
      from16kTo22k: enrichedVehicles.filter((v) => v.dynamicLanded >= 16000 && v.dynamicLanded <= 22000).length,
      from22kTo28k: enrichedVehicles.filter((v) => v.dynamicLanded > 22000 && v.dynamicLanded <= 28000).length,
      from28kTo35k: enrichedVehicles.filter((v) => v.dynamicLanded > 28000 && v.dynamicLanded <= 35000).length,
      over35k: enrichedVehicles.filter((v) => v.dynamicLanded > 35000).length,
    };
  }, [enrichedVehicles]);

  // Powertrain counts
  const powertrainCounts = useMemo(() => {
    const counts = {
      Hybrid: 0,
      Petrol: 0,
      Diesel: 0,
      Electric: 0,
    };
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

  // Filtered & Sorted catalog items
  const filteredVehicles = useMemo(() => {
    return enrichedVehicles.filter((v) => {
      // Tab Filter: Best matches for you vs Other qualifying vehicles
      if ((activeTab === "bestMatches" || (activeTab as any) === "priority") && !v.isPriority) return false;
      if (activeTab === "otherQualifying" && v.isPriority) return false;
      if (activeTab === "shortlisted" && !syncState.shortlistedVehicleIds.includes(v.id)) return false;

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
          (v.badge && v.badge.toLowerCase().includes(q)) ||
          (v.engine && v.engine.toLowerCase().includes(q));
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
          if (sel === "Petrol") return f.includes("petrol") || f.includes("gasoline") || (!f.includes("hybrid") && !f.includes("diesel") && !f.includes("electric"));
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

      // Price Brackets (Multi-select)
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

      return true;
    }).sort((a, b) => {
      if (sortBy === "score") return b.matchScore - a.matchScore;
      if (sortBy === "marginDesc") return b.dynamicMargin - a.dynamicMargin;
      if (sortBy === "priceAsc") return a.dynamicLanded - b.dynamicLanded;
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
    activeTab,
    quickFilter,
    searchQuery,
    selectedMakes,
    selectedFuels,
    selectedGrades,
    selectedPriceBrackets,
    maxBudget,
    sortBy,
    syncState.shortlistedVehicleIds,
  ]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    activeTab,
    quickFilter,
    searchQuery,
    selectedMakes,
    selectedFuels,
    selectedGrades,
    selectedPriceBrackets,
    maxBudget,
    sortBy,
  ]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE) || 1;
  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredVehicles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredVehicles, currentPage]);

  // Check if any filters are active
  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedMakes.length > 0 ||
    selectedFuels.length > 0 ||
    selectedGrades.length > 0 ||
    selectedPriceBrackets.length > 0 ||
    maxBudget < 35000 ||
    quickFilter !== "none";

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedMakes([]);
    setSelectedFuels([]);
    setSelectedGrades([]);
    setSelectedPriceBrackets([]);
    setMaxBudget(35000);
    setQuickFilter("none");
    setBrandSearch("");
    setCurrentPage(1);
  };

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

  const togglePriceBracket = (bracketId: string) => {
    setSelectedPriceBrackets((prev) =>
      prev.includes(bracketId) ? prev.filter((b) => b !== bracketId) : [...prev, bracketId]
    );
  };

  const handleMatchesRecalculated = () => {
    setCurrentPage(1);
    setRerunNotification(
      `Weekly preferences updated! Re-ran matching across ${VEHICLES.length} auction lots.`
    );
    setTimeout(() => {
      setRerunNotification(null);
    }, 5500);
  };

  return (
    <AppLayout>
      {/* Weekly Preferences Login Prompt Modal */}
      <PreferencesLoginPromptModal
        isOpen={showPreferencesPrompt}
        onClose={() => setShowPreferencesPrompt(false)}
        onMatchesReCalculated={handleMatchesRecalculated}
      />

      {/* Written Confirmation / PO Modal */}
      <WrittenConfirmationPoModal
        isOpen={isPoModalOpen}
        onClose={() => setIsPoModalOpen(false)}
        vehicles={poVehicles.length > 0 ? poVehicles : (priorityVehicles.length > 0 ? priorityVehicles.slice(0, 4) : VEHICLES.slice(0, 4))}
        syncState={syncState}
        onConfirmed={(poNum) => {
          setRerunNotification(`PO ${poNum} successfully registered & dispatched to Heiwa Japan desk!`);
          setTimeout(() => setRerunNotification(null), 5000);
        }}
      />

      <div className="space-y-6 pb-12 pt-1">
        {/* Toast Notification */}
        {rerunNotification && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-emerald-600" />
              <span>{rerunNotification}</span>
            </div>
            <button
              onClick={() => setRerunNotification(null)}
              className="text-emerald-600 hover:text-emerald-900 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* 1. Header Greeting & Quick Actions */}
        <section className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.06),0_1px_3px_rgba(15,23,42,0.03)] p-4 sm:p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#B30D12] via-[#E23B40] to-rose-400/20" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-2.5">
                <span className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-slate-100/90 border border-slate-200/80 text-[10.5px] sm:text-[11px] font-semibold text-slate-700 shadow-2xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B30D12] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B30D12]"></span>
                  </span>
                  Auckland Auto Group
                </span>

                <button
                  onClick={() => setShowPreferencesPrompt(true)}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-red-50 hover:bg-red-100 text-[10.5px] sm:text-[11px] font-semibold text-red-700 hover:text-red-900 transition-colors cursor-pointer border border-red-200/80 shadow-2xs group"
                >
                  <SlidersHorizontal size={11} className="text-[#B30D12] transition-transform group-hover:rotate-45" />
                  <span>Update Criteria</span>
                </button>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Japanese Auction Sourcing Overview
              </h1>

              <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-2xl">
                <span className="font-bold text-slate-800">{VEHICLES.length} qualifying auction lots</span> synced from USS, TAA &amp; CAA lanes, with{" "}
                <span className="font-bold text-[#B30D12]">{priorityVehicles.length} high-margin priority lots</span> matched to your weekly buying profile.
              </p>

              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2.5">
                <span className="inline-flex items-center gap-1 text-[10.5px] sm:text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80 shrink-0">
                  <Sparkles size={11} className="text-emerald-600" /> Data confidence: High
                </span>
                <span className="text-[10.5px] sm:text-[11px] text-slate-400 font-medium">
                  Verified Japanese Heiwa CSV auction feeds
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-2.5 w-full lg:w-auto shrink-0 pt-2 lg:pt-0 border-t border-slate-100 lg:border-t-0">
              <button
                onClick={() => triggerAutoHubCopilot("I have $200k, prefer Toyota, 3 years old or newer. What fits?")}
                className="px-3 sm:px-4 py-2.5 bg-[#B30D12] hover:bg-[#940B0F] text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-[0_2px_8px_-1px_rgba(179,13,18,0.35)] hover:shadow-[0_4px_14px_-2px_rgba(179,13,18,0.45)] flex items-center justify-center gap-1.5 sm:gap-2 active:scale-[0.99] cursor-pointer"
              >
                <Sparkles size={14} className="text-white shrink-0" />
                <span className="whitespace-nowrap">Ask AI Copilot</span>
              </button>

              <Link
                href="/vehicles"
                className="px-3 sm:px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/90 hover:border-slate-300 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 group"
              >
                <span className="whitespace-nowrap">Full Catalog</span>
                <ArrowRight size={13} className="text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </Link>
            </div>
          </div>
        </section>

        {/* 2. Top 4 High-Impact KPI Cards (Full Width / Block on Mobile & Small Tablet) */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 w-full">
          {/* Card 1: Best Matches For You */}
          <div
            onClick={() => setActiveTab("bestMatches")}
            className={`p-4 sm:p-4.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3.5 w-full ${activeTab === "bestMatches" || (activeTab as any) === "priority"
              ? "bg-white border-[#B30D12] shadow-sm ring-1 ring-[#B30D12]/20"
              : "bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-xs"
              }`}
          >
            <div className="min-w-0 flex-1 space-y-1">
              <span className="text-[10.5px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Best Matches For You
              </span>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">
                  {priorityVehicles.length}
                </span>
                <span className="text-[9.5px] sm:text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80 whitespace-nowrap">
                  High Confidence
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-snug">
                Target buy box &amp; high market spread
              </p>
            </div>
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-red-50 text-[#B30D12] flex items-center justify-center font-bold shrink-0 shadow-2xs">
              <Flame size={20} />
            </div>
          </div>

          {/* Card 2: Projected Margin */}
          <div className="p-4 sm:p-4.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between gap-3.5 w-full">
            <div className="min-w-0 flex-1 space-y-1">
              <span className="text-[10.5px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Avg. Estimated Margin
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono tracking-tight leading-none">
                +NZ${avgPriorityMargin.toLocaleString("en-US")}
              </div>
              <p className="text-xs text-slate-500 font-medium leading-snug">
                Average dealer margin spread
              </p>
            </div>
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0 shadow-2xs">
              <TrendingUp size={20} />
            </div>
          </div>

          {/* Card 3: Live Pipeline Lots */}
          <div
            onClick={() => setActiveTab("all")}
            className={`p-4 sm:p-4.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3.5 w-full ${activeTab === "all"
              ? "bg-white border-[#B30D12] shadow-sm ring-1 ring-[#B30D12]/20"
              : "bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-xs"
              }`}
          >
            <div className="min-w-0 flex-1 space-y-1">
              <span className="text-[10.5px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Live Japanese Lots
              </span>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">
                  {VEHICLES.length}
                </span>
                <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 whitespace-nowrap">
                  18–22d Ro-Ro
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-snug">
                Est. days to land in NZ (indicative)
              </p>
            </div>
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold shrink-0 shadow-2xs">
              <Car size={20} />
            </div>
          </div>

          {/* Card 4: Shortlisted Lots */}
          <div
            onClick={() => setActiveTab("shortlisted")}
            className={`p-4 sm:p-4.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3.5 w-full ${activeTab === "shortlisted"
              ? "bg-white border-[#B30D12] shadow-sm ring-1 ring-[#B30D12]/20"
              : "bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-xs"
              }`}
          >
            <div className="min-w-0 flex-1 space-y-1">
              <span className="text-[10.5px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Shortlisted by Yard
              </span>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">
                  {syncState.shortlistedVehicleIds.length}
                </span>
                <span className="text-[9.5px] sm:text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-md whitespace-nowrap">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-snug">
                Saved for auction team
              </p>
            </div>
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-rose-50 text-[#B30D12] flex items-center justify-center font-bold shrink-0 shadow-2xs">
              <ShieldCheck size={20} />
            </div>
          </div>
        </section>

        {/* 3. Main Two-Column Layout (Inspired by Reference 1 & Reference 2) */}
        <div className="flex flex-col lg:flex-row gap-6 w-full items-stretch lg:items-start min-w-0">
          {/* Mobile Filter Toggle Button */}
          <div className="lg:hidden w-full flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="flex items-center gap-2 text-xs font-bold text-slate-800"
            >
              <Filter size={15} className="text-[#B30D12]" />
              <span>{mobileFilterOpen ? "Hide Filter Options" : "Show Sourcing Filters"}</span>
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

          {/* LEFT COLUMN: Modern Sourcing Filter Sidebar (from Reference 1 & 2) */}
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
                    className="hidden lg:flex items-center text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 transition-colors"
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
                  {selectedPriceBrackets.map((b) => (
                    <span key={b} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-medium border border-slate-200">
                      <span>Bracket: {b}</span>
                      <X size={11} className="cursor-pointer hover:text-red-600" onClick={() => togglePriceBracket(b)} />
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
                      <span>Gr {g}</span>
                      <X size={11} className="cursor-pointer hover:text-red-600" onClick={() => toggleGrade(g)} />
                    </span>
                  ))}
                  {maxBudget < 35000 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-medium border border-slate-200">
                      <span>&le; NZ${maxBudget.toLocaleString()}</span>
                      <X size={11} className="cursor-pointer hover:text-red-600" onClick={() => setMaxBudget(35000)} />
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* CARD 1: Recommended Filters (2x2 Grid + Show More) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)] p-4 sm:p-5 space-y-3.5">
              <div
                className="flex items-center justify-between cursor-pointer select-none group"
                onClick={() => toggleCardCollapse("recommended")}
              >
                <h3 className="font-black text-slate-900 text-sm tracking-tight flex items-center gap-2">
                  <span>Recommended Filters</span>
                  {quickFilter !== "none" && (
                    <span className="w-2 h-2 rounded-full bg-[#B30D12]" />
                  )}
                </h3>
                <button
                  type="button"
                  className="text-slate-400 group-hover:text-slate-700 transition-colors p-0.5"
                  aria-label={cardCollapse.recommended ? "Expand Recommended Filters" : "Collapse Recommended Filters"}
                >
                  {cardCollapse.recommended ? <Plus size={16} /> : <Minus size={16} />}
                </button>
              </div>

              {!cardCollapse.recommended && (
                <div className="space-y-3 pt-1">
                  {/* 2x2 Grid */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* 1. Priority Picks */}
                    <button
                      onClick={() => setQuickFilter((prev) => (prev === "priority" ? "none" : "priority"))}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${quickFilter === "priority"
                        ? "bg-red-50/70 border-[#B30D12] text-[#B30D12] ring-1 ring-[#B30D12]/20 shadow-xs"
                        : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-2xs"
                        }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-red-100 text-[#B30D12] flex items-center justify-center mb-2">
                        <Flame size={15} />
                      </div>
                      <div>
                        <div className="font-extrabold text-xs text-slate-900 leading-snug">Priority Picks</div>
                        <div className="text-[10px] text-slate-500 font-medium mt-0.5 leading-tight">Score 90+ Lots</div>
                      </div>
                    </button>

                    {/* 2. High Margin */}
                    <button
                      onClick={() => setQuickFilter((prev) => (prev === "highMargin" ? "none" : "highMargin"))}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${quickFilter === "highMargin"
                        ? "bg-emerald-50/70 border-emerald-600 text-emerald-800 ring-1 ring-emerald-500/20 shadow-xs"
                        : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-2xs"
                        }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
                        <TrendingUp size={15} />
                      </div>
                      <div>
                        <div className="font-extrabold text-xs text-slate-900 leading-snug">High Margin</div>
                        <div className="text-[10px] text-slate-500 font-medium mt-0.5 leading-tight">&gt; NZ$3,500 Gross</div>
                      </div>
                    </button>

                    {/* 3. Under $20k */}
                    <button
                      onClick={() => setQuickFilter((prev) => (prev === "under20k" ? "none" : "under20k"))}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${quickFilter === "under20k"
                        ? "bg-blue-50/70 border-blue-600 text-blue-800 ring-1 ring-blue-500/20 shadow-xs"
                        : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-2xs"
                        }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-2">
                        <DollarSign size={15} />
                      </div>
                      <div>
                        <div className="font-extrabold text-xs text-slate-900 leading-snug">Under NZ$20k</div>
                        <div className="text-[10px] text-slate-500 font-medium mt-0.5 leading-tight">Fast-Turnover Tier</div>
                      </div>
                    </button>

                    {/* 4. Grade 4.5+ */}
                    <button
                      onClick={() => setQuickFilter((prev) => (prev === "grade45" ? "none" : "grade45"))}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${quickFilter === "grade45"
                        ? "bg-purple-50/70 border-purple-600 text-purple-800 ring-1 ring-purple-500/20 shadow-xs"
                        : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-2xs"
                        }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-2">
                        <ShieldCheck size={15} />
                      </div>
                      <div>
                        <div className="font-extrabold text-xs text-slate-900 leading-snug">Grade 4.5+</div>
                        <div className="text-[10px] text-slate-500 font-medium mt-0.5 leading-tight">Pristine Condition</div>
                      </div>
                    </button>

                    {/* Extended Cards when Show More is open */}
                    {showMoreRecommended && (
                      <>
                        {/* 5. Ending Soon */}
                        <button
                          onClick={() => setQuickFilter((prev) => (prev === "endingSoon" ? "none" : "endingSoon"))}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${quickFilter === "endingSoon"
                            ? "bg-amber-50/70 border-amber-600 text-amber-800 ring-1 ring-amber-500/20 shadow-xs"
                            : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-2xs"
                            }`}
                        >
                          <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-2">
                            <Clock size={15} />
                          </div>
                          <div>
                            <div className="font-extrabold text-xs text-slate-900 leading-snug">Ending Soon</div>
                            <div className="text-[10px] text-slate-500 font-medium mt-0.5 leading-tight">Closing Today</div>
                          </div>
                        </button>

                        {/* 6. Low Mileage */}
                        <button
                          onClick={() => setQuickFilter((prev) => (prev === "lowKm" ? "none" : "lowKm"))}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${quickFilter === "lowKm"
                            ? "bg-teal-50/70 border-teal-600 text-teal-800 ring-1 ring-teal-500/20 shadow-xs"
                            : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-2xs"
                            }`}
                        >
                          <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center mb-2">
                            <Gauge size={15} />
                          </div>
                          <div>
                            <div className="font-extrabold text-xs text-slate-900 leading-snug">Low Mileage</div>
                            <div className="text-[10px] text-slate-500 font-medium mt-0.5 leading-tight">&lt; 50,000 km</div>
                          </div>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Show More / Show Less Toggle */}
                  <button
                    onClick={() => setShowMoreRecommended(!showMoreRecommended)}
                    className="text-xs font-bold text-[#B30D12] hover:text-[#940B0F] hover:underline cursor-pointer flex items-center gap-1 pt-0.5"
                  >
                    <span>{showMoreRecommended ? "Show Less" : "Show More"}</span>
                  </button>
                </div>
              )}
            </div>

            {/* CARD 2: Landed Budget (NZD) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)] p-4 sm:p-5 space-y-4">
              <div
                className="flex items-center justify-between cursor-pointer select-none group"
                onClick={() => toggleCardCollapse("budget")}
              >
                <h3 className="font-black text-slate-900 text-sm tracking-tight flex items-center gap-2">
                  <span>Landed Budget (NZD)</span>
                  {(maxBudget < 35000 || selectedPriceBrackets.length > 0) && (
                    <span className="w-2 h-2 rounded-full bg-[#B30D12]" />
                  )}
                </h3>
                <button
                  type="button"
                  className="text-slate-400 group-hover:text-slate-700 transition-colors p-0.5"
                  aria-label={cardCollapse.budget ? "Expand Budget Filter" : "Collapse Budget Filter"}
                >
                  {cardCollapse.budget ? <Plus size={16} /> : <Minus size={16} />}
                </button>
              </div>

              {!cardCollapse.budget && (
                <div className="space-y-4 pt-1">
                  {/* Highlighted Price Range (like in reference image) */}
                  <div className="flex items-center justify-between font-black text-base text-[#B30D12]">
                    <span>NZ${maxBudget.toLocaleString()}</span>
                    <span>NZ$10,000</span>
                  </div>

                  {/* Range Slider */}
                  <div>
                    <input
                      type="range"
                      min={10000}
                      max={35000}
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

                  {/* Subheading: What is your price range? */}
                  <div className="pt-1 border-t border-slate-100">
                    <h4 className="text-xs font-black text-slate-800 mb-2.5">
                      What is your price range?
                    </h4>

                    {/* Checkbox List with Counts */}
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

            {/* CARD 3: Make / Brand */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)] p-4 sm:p-5 space-y-3.5">
              <div
                className="flex items-center justify-between cursor-pointer select-none group"
                onClick={() => toggleCardCollapse("brand")}
              >
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-slate-900 text-sm tracking-tight">Make / Brand</h3>
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
                    aria-label={cardCollapse.brand ? "Expand Brand Filter" : "Collapse Brand Filter"}
                  >
                    {cardCollapse.brand ? <Plus size={16} /> : <Minus size={16} />}
                  </button>
                </div>
              </div>

              {!cardCollapse.brand && (
                <div className="space-y-3 pt-1">
                  {/* Brand Instant Search Input */}
                  <div className="relative">
                    <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={brandSearch}
                      onChange={(e) => setBrandSearch(e.target.value)}
                      placeholder="Search brand (Toyota, Honda...)"
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
                        {showAllBrands
                          ? "Show Less"
                          : `Show More (${filteredMakesList.length - 5} more)`}
                      </span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* CARD 4: Powertrain */}
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
                    aria-label={cardCollapse.powertrain ? "Expand Powertrain Filter" : "Collapse Powertrain Filter"}
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
                      className="text-[10px] font-bold text-red-600 hover:text-red-800 hover:underline"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="button"
                    className="text-slate-400 group-hover:text-slate-700 transition-colors p-0.5"
                    aria-label={cardCollapse.grade ? "Expand Grade Filter" : "Collapse Grade Filter"}
                  >
                    {cardCollapse.grade ? <Plus size={16} /> : <Minus size={16} />}
                  </button>
                </div>
              </div>

              {!cardCollapse.grade && (
                <div className="space-y-2 pt-1">
                  {[
                    { id: "4.5+", label: "Grade 4.5+ (Pristine / Like New)", count: gradeCounts["4.5+"] },
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
          </aside>

          {/* RIGHT COLUMN: Modern Vehicle Catalog & 3-Column Card Grid (from Reference 2) */}
          <main className="flex-1 min-w-0 w-full max-w-full space-y-5">
            {/* Catalog Control Header */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)] p-4 sm:p-5 space-y-4 w-full max-w-full min-w-0 overflow-hidden">
              {/* Top Row: Title, Result Count, and Search Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  {isSidebarCollapsed && (
                    <button
                      onClick={() => setIsSidebarCollapsed(false)}
                      className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      title="Show filter sidebar"
                    >
                      <PanelLeftOpen size={14} />
                      <span>Filters</span>
                    </button>
                  )}

                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                      {(activeTab === "bestMatches" || (activeTab as any) === "priority") && "Best Matches For You"}
                      {activeTab === "otherQualifying" && "Other Qualifying Vehicles"}
                      {activeTab === "all" && "All Live Japanese Auction Lots"}
                      {activeTab === "shortlisted" && "Dealership Shortlisted Lots"}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      {(activeTab === "bestMatches" || (activeTab as any) === "priority") && (
                        <>Showing <strong className="text-slate-900 font-bold">{filteredVehicles.length}</strong> top AI-scored matches tailored to your yard</>
                      )}
                      {activeTab === "otherQualifying" && (
                        <>Showing <strong className="text-slate-900 font-bold">{filteredVehicles.length}</strong> secondary qualifying Japanese lots with landed margins</>
                      )}
                      {activeTab === "all" && (
                        <>Showing <strong className="text-slate-900 font-bold">{filteredVehicles.length}</strong> total auction lots across USS, TAA &amp; CAA</>
                      )}
                      {activeTab === "shortlisted" && (
                        <>Showing <strong className="text-slate-900 font-bold">{filteredVehicles.length}</strong> shortlisted lots saved for auction bidding</>
                      )}
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
                    placeholder="Search model, make, lot #..."
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

              {/* Bottom Row: Tabs & Sort Dropdown */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-3 border-t border-slate-100 w-full max-w-full min-w-0">
                {/* Segmented Catalog Tabs (Self-contained scrollable container that NEVER expands the card) */}
                <div className="w-full md:w-auto overflow-x-auto no-scrollbar min-w-0 max-w-full">
                  <div className="inline-flex items-center gap-1 sm:gap-1.5 bg-slate-100 p-1 rounded-xl w-max">
                    {/* Filter 1: Best matches for you */}
                    <button
                      onClick={() => setActiveTab("bestMatches")}
                      className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${activeTab === "bestMatches" || (activeTab as any) === "priority"
                        ? "bg-[#B30D12] text-white shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                      <Flame size={12} className={(activeTab === "bestMatches" || (activeTab as any) === "priority") ? "text-white" : "text-slate-400"} />
                      <span><span className="hidden sm:inline">Best matches for you</span><span className="sm:hidden">Best Matches</span> ({priorityVehicles.length})</span>
                    </button>

                    {/* Filter 2: Other qualifying vehicles */}
                    <button
                      onClick={() => setActiveTab("otherQualifying")}
                      className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${activeTab === "otherQualifying"
                        ? "bg-[#B30D12] text-white shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                      <Car size={12} className={activeTab === "otherQualifying" ? "text-white" : "text-slate-400"} />
                      <span><span className="hidden sm:inline">Other qualifying vehicles</span><span className="sm:hidden">Other Qualifying</span> ({otherQualifyingVehicles.length})</span>
                    </button>

                    {/* Filter 3: All Lots */}
                    <button
                      onClick={() => setActiveTab("all")}
                      className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${activeTab === "all"
                        ? "bg-[#B30D12] text-white shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                      <span>All Lots ({enrichedVehicles.length})</span>
                    </button>

                    {/* Filter 4: Saved */}
                    <button
                      onClick={() => setActiveTab("shortlisted")}
                      className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${activeTab === "shortlisted"
                        ? "bg-[#B30D12] text-white shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                      <ShieldCheck size={12} className={activeTab === "shortlisted" ? "text-white" : "text-slate-400"} />
                      <span>Saved ({syncState.shortlistedVehicleIds.length})</span>
                    </button>
                  </div>
                </div>

                {/* Sort Selector & View Mode Switcher */}
                <div className="flex items-center justify-between sm:justify-end gap-2 w-full md:w-auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full sm:w-auto appearance-none pl-3 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-[#B30D12] cursor-pointer"
                    >
                      <option value="score">Sort: AI Score (Highest)</option>
                      <option value="marginDesc">Sort: Margin Spread (Highest)</option>
                      <option value="priceAsc">Sort: Landed Cost (Lowest)</option>
                      <option value="endingSoon">Sort: Auction Ending Soonest</option>
                      <option value="yearDesc">Sort: Year (Newest)</option>
                      <option value="kmAsc">Sort: Mileage (Lowest)</option>
                    </select>
                    <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>

                  {/* View Switcher */}
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 shrink-0">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${viewMode === "grid"
                        ? "bg-white text-slate-900 shadow-2xs"
                        : "text-slate-500 hover:text-slate-800"
                        }`}
                      title="3-Column Grid View"
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

            {/* Shortlisted Banner for PO Generation */}
            {activeTab === "shortlisted" && filteredVehicles.length > 0 && (
              <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md border border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#B30D12] flex items-center justify-center text-white shrink-0 shadow-sm">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Heiwa Auto Japan · Export Written Confirmation / PO</span>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] rounded-full font-bold">
                        Ready to Transmit
                      </span>
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Issue an official export purchase order for your {filteredVehicles.length} shortlisted stock units with locked CIF Auckland landed calculations.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setPoVehicles(filteredVehicles);
                    setIsPoModalOpen(true);
                  }}
                  className="px-4 py-2.5 bg-[#B30D12] hover:bg-[#940B0F] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto cursor-pointer active:scale-[0.98]"
                >
                  <FileText size={14} />
                  <span>Generate Written PO ({filteredVehicles.length} Units)</span>
                </button>
              </div>
            )}

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
                  No lots match your current combination of filters. Try widening your budget slider, resetting specific makes, or clearing applied quick filters.
                </p>
                <button
                  onClick={resetAllFilters}
                  className="px-4 py-2 bg-[#B30D12] hover:bg-[#940B0F] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  Reset All Filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              /* THE 3-COLUMN CARD GRID (From Reference 2) */
              <div className="space-y-6 w-full max-w-full min-w-0">
                <div
                  className={`grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5 sm:gap-6 w-full max-w-full min-w-0 ${isSidebarCollapsed
                    ? "sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                    : "sm:grid-cols-1 md:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3"
                    }`}
                >
                  {paginatedVehicles.map((vehicle) => (
                    <ModernVehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      isShortlisted={syncState.shortlistedVehicleIds.includes(vehicle.id)}
                      onToggleShortlist={toggleShortlistVehicle}
                      onAskCopilot={triggerAutoHubCopilot}
                    />
                  ))}
                </div>

                {/* Integrated Pagination Controls */}
                <div className="bg-white px-5 py-3.5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-slate-500">
                    Showing <strong className="text-slate-900 font-bold">{(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredVehicles.length)}</strong> of <strong className="text-slate-900 font-bold">{filteredVehicles.length}</strong> matching lots
                  </span>

                  {totalPages > 1 && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setCurrentPage((p) => Math.max(1, p - 1));
                          window.scrollTo({ top: 320, behavior: "smooth" });
                        }}
                        disabled={currentPage === 1}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                      >
                        <ChevronLeft size={13} />
                        <span>Prev</span>
                      </button>

                      {getPaginationPages(currentPage, totalPages).map((p, idx) =>
                        typeof p === "number" ? (
                          <button
                            key={idx}
                            onClick={() => {
                              setCurrentPage(p);
                              window.scrollTo({ top: 320, behavior: "smooth" });
                            }}
                            className={`min-w-[30px] h-7 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${currentPage === p
                              ? "bg-[#B30D12] text-white shadow-2xs"
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
                          setCurrentPage((p) => Math.min(totalPages, p + 1));
                          window.scrollTo({ top: 320, behavior: "smooth" });
                        }}
                        disabled={currentPage === totalPages}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                      >
                        <span>Next</span>
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Alternative Structured Table/List View */
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="px-4 py-3.5">Vehicle</th>
                        <th className="px-4 py-3.5">Auction Lot</th>
                        <th className="px-4 py-3.5">Specs</th>
                        <th className="px-4 py-3.5">Est. Landed (NZD)</th>
                        <th className="px-4 py-3.5">Estimated Margin</th>
                        <th className="px-4 py-3.5">AI Score</th>
                        <th className="px-4 py-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {paginatedVehicles.map((v) => (
                        <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <img
                                src={v.image}
                                alt={v.model}
                                className="w-12 h-10 object-cover rounded-lg shrink-0 border border-slate-200"
                              />
                              <div>
                                <div className="font-extrabold text-slate-900 text-xs">
                                  {v.year} {v.make} {v.model}
                                </div>
                                <div className="text-[11px] text-slate-500">{v.badge}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="font-bold text-slate-800">{v.auctionHouse}</div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              Lot #{v.lotNumber} • Gr {v.grade}
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="text-slate-800 font-semibold">{v.km.toLocaleString()} km</div>
                            <div className="text-[11px] text-slate-400">{v.fuel} • {v.trans}</div>
                          </td>
                          <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                            NZ${v.dynamicLanded.toLocaleString()}
                          </td>
                          <td className="px-4 py-3.5 font-mono font-black text-emerald-700">
                            +NZ${v.dynamicMargin.toLocaleString()}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <Sparkles size={10} className="text-emerald-600" /> {v.matchScore}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <Link
                              href={`/vehicles/${v.id}`}
                              className="px-3 py-1.5 bg-[#B30D12] hover:bg-[#940B0F] text-white rounded-lg text-xs font-bold inline-flex items-center gap-1"
                            >
                              Place Bid <ArrowRight size={11} />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* List View Pagination */}
                <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredVehicles.length)} of {filteredVehicles.length}
                  </span>
                  {totalPages > 1 && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-2 py-1 rounded border border-slate-200 bg-white text-slate-700 disabled:opacity-40"
                      >
                        Prev
                      </button>
                      <span className="px-2 font-bold">{currentPage} / {totalPages}</span>
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-2 py-1 rounded border border-slate-200 bg-white text-slate-700 disabled:opacity-40"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </AppLayout>
  );
}
