"use client";

import React, { useState, useMemo } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Link from "next/link";
import { 
  ArrowRight, 
  Search, 
  ChevronDown, 
  Sparkles, 
  Clock, 
  LayoutGrid, 
  List, 
  Filter, 
  ShieldCheck, 
  CheckCircle2,
  DollarSign,
  Car as CarIcon,
  Flame,
  RotateCcw
} from "lucide-react";
import { VEHICLES } from "@/lib/data";
import { useSyncStore } from "@/lib/syncStore";
import { Bookmark, BookmarkCheck } from "lucide-react";

export default function VehiclesPage() {
  const { state: syncState, toggleShortlistVehicle } = useSyncStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMake, setSelectedMake] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedFuel, setSelectedFuel] = useState("All");
  const [sortBy, setSortBy] = useState<"score" | "priceAsc" | "yearDesc" | "kmAsc">("score");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredVehicles = useMemo(() => {
    return VEHICLES.filter((v) => {
      const matchesSearch = 
        v.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.lotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.badge.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesMake = selectedMake === "All" || v.make === selectedMake;
      const matchesStatus = selectedStatus === "All" || v.status === selectedStatus;
      const matchesFuel = selectedFuel === "All" || v.fuel.toLowerCase().includes(selectedFuel.toLowerCase());

      return matchesSearch && matchesMake && matchesStatus && matchesFuel;
    }).sort((a, b) => {
      const aLanded = Math.round(((a.fobJpy / syncState.fxRateJpyNzd) + syncState.freightPerUnitNzd + syncState.compliancePerUnitNzd) * 1.15);
      const bLanded = Math.round(((b.fobJpy / syncState.fxRateJpyNzd) + syncState.freightPerUnitNzd + syncState.compliancePerUnitNzd) * 1.15);
      if (sortBy === "score") return b.score - a.score;
      if (sortBy === "priceAsc") return aLanded - bLanded;
      if (sortBy === "yearDesc") return b.year - a.year;
      if (sortBy === "kmAsc") return a.km - b.km;
      return 0;
    });
  }, [searchTerm, selectedMake, selectedStatus, selectedFuel, sortBy, syncState.fxRateJpyNzd, syncState.freightPerUnitNzd, syncState.compliancePerUnitNzd]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedMake("All");
    setSelectedStatus("All");
    setSelectedFuel("All");
    setSortBy("score");
  };

  const makes = ["All", "Toyota", "Honda", "Mazda", "Nissan", "Lexus"];

  return (
    <AppLayout>
      <div className="space-y-6 pb-12">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#1B2A4A]/10 text-[#1B2A4A]">
                Japanese Auction Pipeline
              </span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                USS, TAA & CAA Live Sync
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Auction Vehicles Catalog
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-0.5">
              Filter by buying profile, review landed margin spreads, and lock in maximum bids before auction lanes close.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode("grid")}
                title="Grid View"
                className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "grid" 
                    ? "bg-white text-slate-900 shadow-xs" 
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                title="List View"
                className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "list" 
                    ? "bg-white text-slate-900 shadow-xs" 
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by make, model, lot #, badge or VIN..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#B30D12] focus:ring-2 focus:ring-[#B30D12]/20 text-xs font-medium outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Make Selector */}
            <div className="relative">
              <select
                value={selectedMake}
                onChange={(e) => setSelectedMake(e.target.value)}
                className="w-full appearance-none px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#B30D12] text-xs font-semibold text-slate-800 outline-none transition-all cursor-pointer"
              >
                {makes.map(m => (
                  <option key={m} value={m}>{m === "All" ? "All Makes" : m}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>

            {/* Sort Selector */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full appearance-none px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#B30D12] text-xs font-semibold text-slate-800 outline-none transition-all cursor-pointer"
              >
                <option value="score">Sort: AI Score (Highest)</option>
                <option value="priceAsc">Sort: Landed Cost (Lowest)</option>
                <option value="yearDesc">Sort: Year (Newest)</option>
                <option value="kmAsc">Sort: Mileage (Lowest)</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>
          </div>

          {/* Quick Filter Chips */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Status:</span>
              {["All", "Priority", "Consider", "Review"].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedStatus === st
                      ? "bg-[#1B2A4A] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {st === "All" ? "All Statuses" : st}
                </button>
              ))}

              <div className="h-4 w-px bg-slate-200 mx-2 hidden sm:block"></div>

              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Fuel:</span>
              {["All", "Hybrid", "Petrol"].map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFuel(f)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedFuel === f
                      ? "bg-[#1B2A4A] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {f}
                </button>
              ))}

              {(searchTerm || selectedMake !== "All" || selectedStatus !== "All" || selectedFuel !== "All") && (
                <button
                  onClick={resetFilters}
                  className="px-2.5 py-1 text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 transition-colors"
                >
                  <RotateCcw size={12} /> Reset
                </button>
              )}
            </div>

            <div className="text-xs font-bold text-slate-500">
              Showing <span className="text-slate-900 font-extrabold">{filteredVehicles.length}</span> matching auction lots
            </div>
          </div>
        </div>

        {/* Vehicle Results Grid View */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <div 
                key={vehicle.id} 
                className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col hover-lift group"
              >
                {/* Vehicle Image */}
                <div className="h-[210px] relative shrink-0 overflow-hidden bg-slate-100">
                  <img 
                    src={vehicle.image} 
                    alt={`${vehicle.make} ${vehicle.model}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1322]/80 via-transparent to-black/25" />
                  
                  {/* Grade Stamp */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-[#0B1322]/90 backdrop-blur-md text-white font-extrabold text-[11px] rounded-lg border border-white/20 shadow-sm">
                      GRADE {vehicle.grade} / {vehicle.interiorGrade}
                    </span>
                  </div>

                  {/* Countdown Timer */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 bg-[#B30D12] text-white font-bold text-[11px] rounded-lg flex items-center gap-1 shadow-sm">
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

                {/* Content */}
                {(() => {
                  const dynamicLanded = Math.round(((vehicle.fobJpy / syncState.fxRateJpyNzd) + syncState.freightPerUnitNzd + syncState.compliancePerUnitNzd) * 1.15);
                  const dynamicMaxBid = Math.round(vehicle.estRetailNzd - dynamicLanded);
                  const isWishlistMatch = syncState.dealerModels.some(m => vehicle.model.toLowerCase().includes(m.toLowerCase()));
                  const isShortlisted = syncState.shortlistedVehicleIds.includes(vehicle.id);

                  return (
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5 mb-0.5">
                              {isWishlistMatch && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-50 text-[#B30D12] border border-rose-200">
                                  Wishlist Match
                                </span>
                              )}
                              <span className="text-[10px] font-bold text-slate-400">
                                {vehicle.fuel}
                              </span>
                            </div>
                            <h3 className="text-base font-black text-slate-900 group-hover:text-[#B30D12] transition-colors">
                              {vehicle.year} {vehicle.make} {vehicle.model}
                            </h3>
                            <p className="text-xs font-semibold text-slate-500 mt-0.5">
                              {vehicle.badge}
                            </p>
                          </div>

                          {/* Score Badge & Shortlist Button */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => toggleShortlistVehicle(vehicle.id)}
                              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                isShortlisted 
                                  ? 'bg-rose-50 text-[#B30D12] border-rose-200' 
                                  : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-700'
                              }`}
                              title={isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
                            >
                              {isShortlisted ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                            </button>

                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                              vehicle.status === 'Priority' 
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

                        {/* Financial Mini Stack */}
                        <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Landed Cost</span>
                            <span className="font-black text-slate-900 text-sm mt-0.5 block font-mono">
                              NZ${dynamicLanded.toLocaleString('en-US')}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Est. Retail</span>
                            <span className="font-bold text-slate-900 text-sm mt-0.5 block font-mono">
                              NZ${(vehicle.estRetailNzd).toLocaleString('en-US')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Bottom CTA */}
                      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Est. Margin Spread</span>
                          <span className="text-base font-black text-emerald-700 block font-mono">
                            +NZ${Math.max(1500, vehicle.estRetailNzd - dynamicLanded).toLocaleString('en-US')}
                          </span>
                        </div>

                        <Link 
                          href={`/vehicles/${vehicle.id}`} 
                          className="px-4 py-2 bg-[#1B2A4A] hover:bg-[#0B1322] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                        >
                          Calculate <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ))}
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
                    <th className="px-5 py-3.5">Max Bid</th>
                    <th className="px-5 py-3.5">AI Score</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredVehicles.map((v) => (
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
                        NZ${(v.landedNzd).toLocaleString('en-US')}
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-900">
                        NZ${(v.estRetailNzd).toLocaleString('en-US')}
                      </td>
                      <td className="px-5 py-4 font-black text-[#B30D12]">
                        NZ${(v.maxBidNzd).toLocaleString('en-US')}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${
                          v.status === 'Priority' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          <Sparkles size={10} /> {v.score}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link 
                          href={`/vehicles/${v.id}`} 
                          className="px-3 py-1.5 bg-[#1B2A4A] hover:bg-[#0B1322] text-white rounded-lg text-xs font-bold inline-flex items-center gap-1"
                        >
                          Bid <ArrowRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
}
