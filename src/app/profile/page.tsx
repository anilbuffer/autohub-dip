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
      <div className="space-y-8 pb-16 max-w-5xl mx-auto">
        
        {/* Profile Header */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#1B2A4A] text-white flex items-center justify-center font-black text-2xl shadow-sm border border-[#2B406B]">
              AAG
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {dealer.name}
                </h1>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {dealer.tier}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium mt-1">
                <span className="flex items-center gap-1"><MapPin size={13} /> {dealer.location}</span>
                <span className="flex items-center gap-1"><User size={13} /> {dealer.contactName} (Dealer Principal)</span>
                <span className="flex items-center gap-1"><Mail size={13} /> {dealer.email}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-[#B30D12] hover:bg-[#940B0F] text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
          >
            <Save size={14} /> Save Preferences & Sync
          </button>
        </div>

        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>
              Buying preferences updated! Successfully synchronized with Heiwa Auto Japan procurement engine and Autohub demand intelligence.
            </span>
          </div>
        )}

        {/* Buying Preferences Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#B30D12]/10 text-[#B30D12] flex items-center justify-center font-bold">
                <SlidersHorizontal size={18} />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900">Active Sourcing & Buying Criteria</h2>
                <p className="text-xs text-slate-400 font-medium">Controls which upcoming Japanese auction lots match your yard inventory.</p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <Sparkles size={13} className="text-[#B30D12]" />
              <span>{selectedModels.length} Active Target Models</span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Target Models Selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Target Vehicle Models (Wish List)
                </label>
                <span className="text-[11px] text-slate-400 font-medium">Click to add/remove models for Heiwa sourcing alerts</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableModels.map((model) => {
                  const isSelected = selectedModels.includes(model);
                  return (
                    <button
                      key={model}
                      onClick={() => toggleModel(model)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        isSelected 
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
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Target Makes
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableMakes.map((make) => {
                  const isSelected = selectedMakes.includes(make);
                  return (
                    <button
                      key={make}
                      onClick={() => toggleMake(make)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        isSelected 
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
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Powertrain / Fuel Types
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableFuels.map((fuel) => {
                  const isSelected = selectedFuels.includes(fuel);
                  return (
                    <button
                      key={fuel}
                      onClick={() => toggleFuel(fuel)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        isSelected 
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-100">
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
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#1B2A4A]"
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
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>NZ$2,000</span>
                  <span>NZ$4,000</span>
                  <span>NZ$6,000+</span>
                </div>
              </div>
            </div>

            {/* Notification Automation */}
            <div className="pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-[#B30D12] flex items-center justify-center font-bold">
                    <Zap size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Heiwa Autonomous Match Notifications</div>
                    <div className="text-[11px] text-slate-500">Receive priority dispatch alerts when Japanese auctions list vehicles matching your Auckland yard criteria.</div>
                  </div>
                </div>

                <button 
                  onClick={() => setAutoAlerts(!autoAlerts)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${autoAlerts ? 'bg-emerald-600' : 'bg-slate-300'}`}
                >
                  <span className={`block w-4 h-4 rounded-full bg-white shadow-xs transform transition-transform ${autoAlerts ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </AppLayout>
  );
}
