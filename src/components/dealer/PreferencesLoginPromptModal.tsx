"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Check,
  X,
  SlidersHorizontal,
  Car,
  Calendar,
  TrendingUp,
  DollarSign,
  Gauge,
  RotateCcw,
  ArrowRight
} from "lucide-react";
import { useSyncStore } from "@/lib/syncStore";

interface PreferencesLoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMatchesReCalculated?: (newMatchCount: number) => void;
}

const AVAILABLE_POPULAR_MODELS = [
  "Aqua",
  "Prius",
  "C-HR",
  "Vezel",
  "Fit",
  "RAV4",
  "Corolla Cross",
  "CX-5",
  "Axela",
  "Demio",
  "Swift",
  "Harrier"
];

const AVAILABLE_MAKES = [
  "Toyota",
  "Honda",
  "Mazda",
  "Lexus",
  "Nissan",
  "Subaru"
];

const BUDGET_PRESETS = [18000, 24000, 30000, 38000];
const MARGIN_PRESETS = [2500, 3500, 4500, 5500];
const KM_PRESETS = [50000, 75000, 100000];

export default function PreferencesLoginPromptModal({
  isOpen,
  onClose,
  onMatchesReCalculated
}: PreferencesLoginPromptModalProps) {
  const { state: syncState, updateDealerWishlist } = useSyncStore();

  const [mode, setMode] = useState<"prompt" | "update">("prompt");
  const [selectedModels, setSelectedModels] = useState<string[]>(syncState.dealerModels || ["Aqua", "Fit", "C-HR", "Prius", "Vezel"]);
  const [selectedMakes, setSelectedMakes] = useState<string[]>(syncState.dealerMakes || ["Toyota", "Honda", "Mazda", "Lexus"]);
  const [targetBudget, setTargetBudget] = useState<number>(syncState.dealerTargetBudget || 24000);
  const [targetMargin, setTargetMargin] = useState<number>(syncState.dealerTargetMargin || 3500);
  const [maxKm, setMaxKm] = useState<number>(syncState.dealerMaxKm || 75000);
  const [isReRunning, setIsReRunning] = useState<boolean>(false);

  if (!isOpen) return null;

  const toggleModel = (model: string) => {
    if (selectedModels.includes(model)) {
      if (selectedModels.length > 1) {
        setSelectedModels(selectedModels.filter(m => m !== model));
      }
    } else {
      setSelectedModels([...selectedModels, model]);
    }
  };

  const toggleMake = (make: string) => {
    if (selectedMakes.includes(make)) {
      if (selectedMakes.length > 1) {
        setSelectedMakes(selectedMakes.filter(m => m !== make));
      }
    } else {
      setSelectedMakes([...selectedMakes, make]);
    }
  };

  const handleKeep = () => {
    onClose();
  };

  const handleUpdate = () => {
    setMode("update");
  };

  const handleApplyAndRerun = () => {
    setIsReRunning(true);
    updateDealerWishlist(selectedModels, selectedMakes, targetBudget, targetMargin, maxKm);

    setTimeout(() => {
      setIsReRunning(false);
      if (onMatchesReCalculated) {
        onMatchesReCalculated(selectedModels.length);
      }
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Header Banner */}
        <div className="bg-gradient-to-r from-[#0B1322] via-[#101C33] to-[#1B2A4A] p-5 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Weekly Buying Check-In
              </span>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              title="Dismiss"
            >
              <X size={16} />
            </button>
          </div>

          <h2 className="text-lg font-bold text-white mt-1.5 flex items-center gap-2">
            <span>Your current preferences:</span>
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Update for this week? Matches will refresh across all active Japanese auction lots.
          </p>
        </div>

        {/* Modal Body */}
        {mode === "prompt" ? (
          /* 1. Prompt / Summary Mode */
          <div className="p-5 sm:p-6 space-y-5">

            {/* Preferences Summary Box */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/90 space-y-3.5 text-xs">

              {/* Models */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Target Models ({selectedModels.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedModels.map((m) => (
                    <span
                      key={m}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-bold text-slate-800 text-[11px] shadow-2xs"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Grid with Budget, Margin, KM */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/80">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">Max Landed</span>
                  <span className="font-extrabold text-slate-900 text-xs block mt-0.5 font-mono">
                    ≤ NZ${targetBudget.toLocaleString("en-US")}
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">Min Margin</span>
                  <span className="font-extrabold text-emerald-700 text-xs block mt-0.5 font-mono">
                    +NZ${targetMargin.toLocaleString("en-US")}
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">Max Mileage</span>
                  <span className="font-extrabold text-slate-900 text-xs block mt-0.5 font-mono">
                    ≤ {(maxKm / 1000).toFixed(0)}k km
                  </span>
                </div>
              </div>

              {/* Makes */}
              <div className="text-[11px] text-slate-500 pt-1">
                <strong>Makes:</strong> {selectedMakes.join(", ")}
              </div>
            </div>

            {/* Prompt Question & Action Buttons */}
            <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-medium">
                Keep current targets or modify for this week?
              </span>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                {/* Keep Button */}
                <button
                  onClick={handleKeep}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors shadow-2xs"
                >
                  Keep
                </button>

                {/* Update Button */}
                <button
                  onClick={handleUpdate}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#B30D12] hover:bg-[#940B0F] text-white font-bold text-xs transition-all shadow-sm hover:shadow flex items-center justify-center gap-1.5"
                >
                  <SlidersHorizontal size={13} />
                  <span>Update</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* 2. Interactive Update Mode */
          <div className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">

            {/* Quick Model Selector */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-800">
                  Select Priority Models for This Week:
                </span>
                <span className="text-[10px] text-slate-400">
                  {selectedModels.length} selected
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_POPULAR_MODELS.map((model) => {
                  const isSelected = selectedModels.includes(model);
                  return (
                    <button
                      key={model}
                      onClick={() => toggleModel(model)}
                      type="button"
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${isSelected
                        ? "bg-slate-900 text-white shadow-2xs"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200"
                        }`}
                    >
                      {isSelected && <Check size={11} className="text-emerald-400" />}
                      <span>{model}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Landed Budget Presets */}
            <div>
              <span className="text-xs font-bold text-slate-800 block mb-1.5">
                Maximum Landed Cost (NZD):
              </span>
              <div className="grid grid-cols-4 gap-2">
                {BUDGET_PRESETS.map((b) => (
                  <button
                    key={b}
                    onClick={() => setTargetBudget(b)}
                    type="button"
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer font-mono ${targetBudget === b
                      ? "bg-[#B30D12] text-white shadow-2xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                      }`}
                  >
                    NZ${(b / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>

            {/* Target Margin Presets */}
            <div>
              <span className="text-xs font-bold text-slate-800 block mb-1.5">
                Minimum Target Gross Margin:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {MARGIN_PRESETS.map((m) => (
                  <button
                    key={m}
                    onClick={() => setTargetMargin(m)}
                    type="button"
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer font-mono ${targetMargin === m
                      ? "bg-emerald-700 text-white shadow-2xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                      }`}
                  >
                    +NZ${(m / 1000).toFixed(1)}k
                  </button>
                ))}
              </div>
            </div>

            {/* Max Mileage Presets */}
            <div>
              <span className="text-xs font-bold text-slate-800 block mb-1.5">
                Max Mileage (km):
              </span>
              <div className="grid grid-cols-3 gap-2">
                {KM_PRESETS.map((k) => (
                  <button
                    key={k}
                    onClick={() => setMaxKm(k)}
                    type="button"
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer font-mono ${maxKm === k
                      ? "bg-slate-900 text-white shadow-2xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                      }`}
                  >
                    {(k / 1000).toFixed(0)}k km
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                onClick={() => setMode("prompt")}
                type="button"
                className="px-3.5 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Back
              </button>

              <button
                onClick={handleApplyAndRerun}
                disabled={isReRunning}
                type="button"
                className="px-5 py-2.5 rounded-xl bg-[#B30D12] hover:bg-[#940B0F] text-white font-bold text-xs transition-all shadow-sm hover:shadow flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {isReRunning ? (
                  <>
                    <RotateCcw size={13} className="animate-spin" />
                    <span>Re-running Matches...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={13} />
                    <span>Save & Re-run Matches</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
