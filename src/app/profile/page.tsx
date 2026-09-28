"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import {
  Building2,
  Settings2,
  CheckCircle2,
  SlidersHorizontal,
  Bell,
  ShieldCheck,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Zap,
  Car
} from "lucide-react";
import { DEALERS } from "@/lib/data";
import { useSyncStore } from "@/lib/syncStore";

export default function ProfilePage() {
  const dealer = DEALERS[0]; // Auckland Auto Group
  const { state: syncState, updateDealerWishlist } = useSyncStore();

  const [selectedMakes, setSelectedMakes] = useState<string[]>(syncState.dealerMakes);
  const [selectedModels, setSelectedModels] = useState<string[]>(syncState.dealerModels);
  const [selectedFuels, setSelectedFuels] = useState<string[]>(dealer.preferences.fuelTypes);
  const [maxKm, setMaxKm] = useState<number>(syncState.dealerMaxKm);
  const [targetMargin, setTargetMargin] = useState<number>(syncState.dealerTargetMargin);
  const [targetBudget, setTargetBudget] = useState<number>(syncState.dealerTargetBudget);
  const [autoAlerts, setAutoAlerts] = useState<boolean>(true);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    setSelectedMakes(syncState.dealerMakes);
    setSelectedModels(syncState.dealerModels);
    setMaxKm(syncState.dealerMaxKm);
    setTargetMargin(syncState.dealerTargetMargin);
    setTargetBudget(syncState.dealerTargetBudget);
  }, [syncState]);

  const kmPercent = Math.min(100, Math.max(0, ((maxKm - 40000) / (120000 - 40000)) * 100));
  const marginPercent = Math.min(100, Math.max(0, ((targetMargin - 2000) / (6000 - 2000)) * 100));

  const toggleMake = (make: string) => {
    if (selectedMakes.includes(make)) {
      setSelectedMakes(selectedMakes.filter(m => m !== make));
    } else {
      setSelectedMakes([...selectedMakes, make]);
    }
  };

  const toggleModel = (model: string) => {
    if (selectedModels.includes(model)) {
      setSelectedModels(selectedModels.filter(m => m !== model));
    } else {
      setSelectedModels([...selectedModels, model]);
    }
  };

  const toggleFuel = (fuel: string) => {
    if (selectedFuels.includes(fuel)) {
      setSelectedFuels(selectedFuels.filter(f => f !== fuel));
    } else {
      setSelectedFuels([...selectedFuels, fuel]);
    }
  };

  const handleSave = () => {
    updateDealerWishlist(selectedModels, selectedMakes, targetBudget, targetMargin);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const availableMakes = ["Toyota", "Honda", "Mazda", "Nissan", "Lexus", "Subaru", "Suzuki"];
  const availableModels = [
    "Aqua",
    "C-HR",
    "Prius",
    "Vezel",
    "Fit",
    "CX-5",
    "Note",
    "Axela",
    "NX300h",
    "Swift",
    "Corolla Fielder",
    "RAV4"
  ];
  const availableFuels = ["Hybrid", "Petrol", "Electric (EV)", "Plug-in Hybrid (PHEV)"];

  return (
    <AppLayout>
      <div className="space-y-8 pb-16 max-w-7xl mx-auto">

        {/* Profile Header */}
        <div className="bg-white p-4 sm:p-6 md:p-7 rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-5">
          <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0">
            <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-[#1B2A4A] text-white flex items-center justify-center font-black text-xl sm:text-2xl shadow-sm border border-[#2B406B] shrink-0">
              AAG
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  {dealer.name}
                </h1>
                <span className="text-[10px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shrink-0">
                  {dealer.tier}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-1 sm:gap-3 text-xs text-slate-500 font-medium mt-1.5">
                <span className="flex items-center gap-1.5 truncate"><MapPin size={12} className="text-slate-400 shrink-0" /> {dealer.location}</span>
                <span className="hidden sm:inline text-slate-300">•</span>
                <span className="flex items-center gap-1.5 truncate"><User size={12} className="text-slate-400 shrink-0" /> {dealer.contactName} (Dealer Principal)</span>
                <span className="hidden sm:inline text-slate-300">•</span>
                <span className="flex items-center gap-1.5 truncate"><Mail size={12} className="text-slate-400 shrink-0" /> {dealer.email}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full md:w-auto px-5 py-2.5 bg-[#B30D12] hover:bg-[#940B0F] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer shrink-0 active:scale-[0.99]"
          >
            <Save size={15} />
            <span>Save Preferences &amp; Sync</span>
          </button>
        </div>

        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>
              Buying preferences updated! Successfully synchronized with AutoHub procurement engine and demand intelligence.
            </span>
          </div>
        )}

        {/* Buying Preferences Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#B30D12]/10 text-[#B30D12] flex items-center justify-center font-bold shrink-0">
                <SlidersHorizontal size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm sm:text-base font-black text-slate-900 leading-snug">Active Sourcing &amp; Buying Criteria</h2>
                <p className="text-xs text-slate-400 font-medium">Controls which upcoming Japanese auction lots match your yard inventory.</p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shrink-0 self-start sm:self-auto">
              <Sparkles size={13} className="text-[#B30D12]" />
              <span>{selectedModels.length} Active Target Models</span>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-6">

            {/* Target Models Selector */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Target Vehicle Models (Wish List)
                </label>
                <span className="text-[11px] text-slate-400 font-medium">Click to add/remove models for AutoHub sourcing alerts</span>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {availableModels.map((model) => {
                  const isSelected = selectedModels.includes(model);
                  return (
                    <button
                      key={model}
                      onClick={() => toggleModel(model)}
                      className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer active:scale-95 ${isSelected
                        ? 'bg-[#B30D12] text-white border-[#B30D12] shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                    >
                      {model} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Manufacturers */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Target Makes
                </label>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {availableMakes.map((make) => {
                  const isSelected = selectedMakes.includes(make);
                  return (
                    <button
                      key={make}
                      onClick={() => toggleMake(make)}
                      className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer active:scale-95 ${isSelected
                        ? 'bg-[#1B2A4A] text-white border-[#1B2A4A] shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                    >
                      {make} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fuel Preferences */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Powertrain / Fuel Types
                </label>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {availableFuels.map((fuel) => {
                  const isSelected = selectedFuels.includes(fuel);
                  return (
                    <button
                      key={fuel}
                      onClick={() => toggleFuel(fuel)}
                      className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer active:scale-95 ${isSelected
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                    >
                      {fuel} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mileage & Margin Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-4 border-t border-slate-100">
              {/* Max Kilometers Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Maximum ODO Mileage
                  </label>
                  <span className="text-sm font-black text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                    {(maxKm).toLocaleString('en-US')} km
                  </span>
                </div>
                <input
                  type="range"
                  min={40000}
                  max={120000}
                  step={5000}
                  value={maxKm}
                  onChange={(e) => setMaxKm(parseInt(e.target.value))}
                  style={{
                    background: `linear-gradient(to right, #1B2A4A 0%, #1B2A4A ${kmPercent}%, #e2e8f0 ${kmPercent}%, #e2e8f0 100%)`
                  }}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#1B2A4A]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>40,000 km</span>
                  <span>80,000 km</span>
                  <span>120,000 km</span>
                </div>
              </div>

              {/* Target Margin Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Minimum Target Profit Margin
                  </label>
                  <span className="text-sm font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg">
                    +NZ${(targetMargin).toLocaleString('en-US')}
                  </span>
                </div>
                <input
                  type="range"
                  min={2000}
                  max={6000}
                  step={250}
                  value={targetMargin}
                  onChange={(e) => setTargetMargin(parseInt(e.target.value))}
                  style={{
                    background: `linear-gradient(to right, #059669 0%, #059669 ${marginPercent}%, #e2e8f0 ${marginPercent}%, #e2e8f0 100%)`
                  }}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>NZ$2,000</span>
                  <span>NZ$4,000</span>
                  <span>NZ$6,000+</span>
                </div>
              </div>
            </div>

            {/* Notification Automation */}
            <div className="pt-5 sm:pt-6 border-t border-slate-100">
              <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-4 bg-slate-50/90 rounded-2xl border border-slate-200/90">
                <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-100 text-[#B30D12] flex items-center justify-center font-bold shrink-0 mt-0.5 sm:mt-0">
                    <Zap size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 leading-snug">AutoHub Autonomous Match Notifications</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">Receive priority dispatch alerts when Japanese auctions list vehicles matching your Auckland yard criteria.</div>
                  </div>
                </div>

                <button
                  onClick={() => setAutoAlerts(!autoAlerts)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 mt-1 sm:mt-0 ${autoAlerts ? 'bg-emerald-600' : 'bg-slate-300'}`}
                  aria-label="Toggle autonomous match alerts"
                >
                  <span className={`block w-4 h-4 rounded-full bg-white shadow-xs transform transition-transform ${autoAlerts ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </AppLayout>
  );
}
