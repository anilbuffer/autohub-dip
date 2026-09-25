"use client";

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  AlertTriangle, 
  DollarSign, 
  Sparkles, 
  Clock, 
  Building2, 
  ArrowUpRight, 
  Ship, 
  ChevronRight, 
  CheckCircle2, 
  Layers, 
  BarChart3,
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import { 
  DEMAND_FORECAST_ITEMS, 
  UNMET_DEMAND_METRICS, 
  UNMET_DEALER_REQUESTS, 
  DemandForecastItem 
} from '@/lib/demandIntelligenceData';

interface DemandForecastSectionProps {
  onOpenSourcingTarget?: (modelName: string) => void;
}

export default function DemandForecastSection({ onOpenSourcingTarget }: DemandForecastSectionProps) {
  const [selectedHorizon, setSelectedHorizon] = useState<'30d' | '60d' | '90d'>('30d');
  const [scenario, setScenario] = useState<'baseline' | 'hybrid_surge' | 'winter_awd'>('baseline');
  const [activeTab, setActiveTab] = useState<'forecast_table' | 'unmet_queue'>('forecast_table');

  // Scenario multipliers
  const getScenarioAdjustedItem = (item: DemandForecastItem) => {
    let multiplier = 1.0;
    if (scenario === 'hybrid_surge' && item.segment.includes('Hybrid')) {
      multiplier = 1.25;
    } else if (scenario === 'winter_awd' && item.segment.includes('AWD')) {
      multiplier = 1.35;
    }

    const currentDemand = Math.round(item.currentMonthlyDemand * multiplier);
    const forecastVal = selectedHorizon === '30d' 
      ? Math.round(item.forecast30d * multiplier)
      : selectedHorizon === '60d'
      ? Math.round(item.forecast60d * multiplier)
      : Math.round(item.forecast90d * multiplier);

    const unmetVal = Math.max(0, forecastVal - item.projectedSupplyUnits);

    return {
      ...item,
      currentMonthlyDemand: currentDemand,
      displayForecast: forecastVal,
      displayUnmet: unmetVal,
      recommendedIntake: Math.round(item.recommendedAuctionIntake * multiplier)
    };
  };

  const adjustedForecastItems = DEMAND_FORECAST_ITEMS.map(getScenarioAdjustedItem);

  return (
    <div className="space-y-4 sm:space-y-5">
      
      {/* 1. Demand Forecast & Unmet Demand Executive KPI Strip (Compact & Light Red Gradient) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
        
        {/* KPI 1: Total Unmet Demand Gap */}
        <div className="bg-gradient-to-br from-white via-red-50/50 to-rose-50/70 p-3.5 rounded-xl border border-red-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#B30D12] uppercase tracking-wider">
              Total Unmet Demand
            </span>
            <div className="w-6 h-6 rounded-md bg-red-100 text-[#B30D12] border border-red-200 flex items-center justify-center font-bold">
              <AlertTriangle size={13} />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-[#B30D12] tracking-tight">
                {UNMET_DEMAND_METRICS.totalUnmetUnits.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-slate-500">units deficit</span>
            </div>
            <p className="text-[10px] text-slate-600 font-medium mt-0.5 truncate">
              Orders exceeding stock &amp; in-transit Ro-Ro
            </p>
          </div>
        </div>

        {/* KPI 2: Uncaptured Dealer GMV */}
        <div className="bg-gradient-to-br from-white via-white to-red-50/20 p-3.5 rounded-xl border border-slate-200/90 hover:border-red-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Uncaptured Dealer GMV
            </span>
            <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center font-bold">
              <DollarSign size={13} />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                NZ${(UNMET_DEMAND_METRICS.lostGmvNzd / 1000000).toFixed(2)}M
              </span>
              <span className="text-[10px] font-bold text-slate-400">/ ¥156.9M</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5 truncate">
              Wholesale revenue lost to auction stockouts
            </p>
          </div>
        </div>

        {/* KPI 3: Severe Deficit Models */}
        <div className="bg-gradient-to-br from-white via-white to-red-50/20 p-3.5 rounded-xl border border-slate-200/90 hover:border-red-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Critical Shortage Models
            </span>
            <div className="w-6 h-6 rounded-md bg-red-50 text-[#B30D12] border border-red-100 flex items-center justify-center font-bold">
              <Compass size={13} />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                {UNMET_DEMAND_METRICS.criticalDeficitModelsCount} Models
              </span>
              <span className="text-[9px] font-black text-red-700 bg-red-100 px-1 py-0.2 rounded border border-red-200">
                &lt; 40% Stocked
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5 truncate">
              C-HR, Vezel, Aqua, CX-5, Note
            </p>
          </div>
        </div>

        {/* KPI 4: Turn Velocity of Shortage Models */}
        <div className="bg-gradient-to-br from-white via-white to-red-50/20 p-3.5 rounded-xl border border-slate-200/90 hover:border-red-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Avg Yard Turn Velocity
            </span>
            <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold">
              <Clock size={13} />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-800 tracking-tight">
                {UNMET_DEMAND_METRICS.avgTurnDaysForShortageModels} Days
              </span>
              <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                Fast Turn
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5 truncate">
              Sells immediately on compliance release
            </p>
          </div>
        </div>

      </div>

      {/* 2. Interactive Scenario Simulation & Horizon Controls (Compact, Light Red Gradient) */}
      <div className="p-4 sm:p-4.5 bg-gradient-to-r from-red-50/40 via-white to-white rounded-2xl border border-red-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3.5 border-b border-red-100">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="px-2 py-0.2 rounded font-black text-[9px] uppercase tracking-wider bg-[#B30D12] text-white">
                Predictive Model
              </span>
              <span className="text-[10px] text-slate-400 font-medium">AutoHub 30–90 Day Forecasting Engine</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
              AI Demand Forecast &amp; Sourcing Intake Schedule
            </h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Simulate forward vehicle intake requirements taking into account 21-day shipping lead times from Japan.
            </p>
          </div>

          {/* Horizon & Scenario Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Horizon Selector */}
            <div className="flex items-center gap-0.5 bg-white p-0.5 rounded-lg border border-red-200/80 text-[11px] font-bold shadow-2xs">
              <button
                onClick={() => setSelectedHorizon('30d')}
                className={`px-2.5 py-0.5 rounded-md transition-all cursor-pointer ${
                  selectedHorizon === '30d' ? 'bg-red-50 text-[#B30D12] font-black' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                30d
              </button>
              <button
                onClick={() => setSelectedHorizon('60d')}
                className={`px-2.5 py-0.5 rounded-md transition-all cursor-pointer ${
                  selectedHorizon === '60d' ? 'bg-red-50 text-[#B30D12] font-black' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                60d
              </button>
              <button
                onClick={() => setSelectedHorizon('90d')}
                className={`px-2.5 py-0.5 rounded-md transition-all cursor-pointer ${
                  selectedHorizon === '90d' ? 'bg-red-50 text-[#B30D12] font-black' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                90d
              </button>
            </div>

            {/* Scenario Dropdown */}
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value as any)}
              className="px-2.5 py-1 bg-white border border-red-200/80 rounded-lg text-slate-800 text-[11px] font-bold outline-none cursor-pointer focus:border-[#B30D12] shadow-2xs"
            >
              <option value="baseline">Baseline Forecast (+18% growth)</option>
              <option value="hybrid_surge">High Fuel / Green Rush (+25% Hybrid)</option>
              <option value="winter_awd">Winter AWD South Island Surge (+35% AWD)</option>
            </select>

          </div>
        </div>

        {/* View Switcher Tabs: Forecast Matrix vs Unmet Dealer Request Queue */}
        <div className="pt-4 flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('forecast_table')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'forecast_table'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Model Forecast &amp; Sourcing Quota
            </button>
            <button
              onClick={() => setActiveTab('unmet_queue')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'unmet_queue'
                  ? 'bg-[#B30D12] text-white shadow-sm'
                  : 'bg-red-50 text-[#B30D12] hover:bg-red-100 border border-red-200'
              }`}
            >
              <span>Unmet Dealer Request Queue</span>
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black">
                {UNMET_DEALER_REQUESTS.length}
              </span>
            </button>
          </div>

          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            Confidence Index: <strong className="text-emerald-700 font-bold">94.8% High</strong>
          </span>
        </div>

        {/* Content 1: Model Forecast & Sourcing Quota Table */}
        {activeTab === 'forecast_table' && (
          <div className="pt-4 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">
                  <th className="py-3 px-4">Vehicle Model</th>
                  <th className="py-3 px-3">Current Mo.</th>
                  <th className="py-3 px-3">{selectedHorizon.toUpperCase()} Forecast</th>
                  <th className="py-3 px-3">Projected Supply</th>
                  <th className="py-3 px-4">Forecast Gap</th>
                  <th className="py-3 px-4">Recommended Intake</th>
                  <th className="py-3 px-4">Target Auctions &amp; Window</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {adjustedForecastItems.map((item) => {
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 text-sm">
                          {item.model}
                        </div>
                        <span className="text-[11px] text-slate-400 font-normal">
                          {item.segment}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-semibold text-slate-700">
                        {item.currentMonthlyDemand} <span className="text-[10px] text-slate-400">units</span>
                      </td>

                      <td className="py-3 px-3 font-black text-slate-900 text-sm">
                        {item.displayForecast} <span className="text-[10px] text-slate-400">units</span>
                        <span className="block text-[10px] text-emerald-700 font-bold">
                          +{item.trendPct}% vs base
                        </span>
                      </td>

                      <td className="py-3 px-3 font-semibold text-slate-600">
                        {item.projectedSupplyUnits} <span className="text-[10px] text-slate-400">units</span>
                        <span className="block text-[10px] text-slate-400">Stock + Ro-Ro</span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-rose-600 text-sm">
                            -{item.displayUnmet} units
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                            Deficit
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Confidence: {item.confidenceScore}%
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                          +{item.recommendedIntake} units
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-1">
                          USS / CAA target quota
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-800 text-[11px] block">
                          {item.targetAuctionHouses.join(', ')}
                        </span>
                        <span className="text-[10px] text-[#B30D12] font-semibold flex items-center gap-1 mt-0.5">
                          <Clock size={10} /> Buy within: {item.procurementDeadline}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            if (onOpenSourcingTarget) onOpenSourcingTarget(item.model);
                          }}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#B30D12] hover:bg-[#940B0F] text-white shadow-2xs transition-all cursor-pointer"
                        >
                          Source Lots
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Content 2: Unmet Dealer Request Queue */}
        {activeTab === 'unmet_queue' && (
          <div className="pt-4 space-y-3">
            <div className="p-3 bg-red-50/60 border border-red-200 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle size={15} className="text-[#B30D12]" />
                <span className="font-bold text-slate-800">
                  Priority Backlog: Verified purchase requests awaiting matching Japan auction allocation.
                </span>
              </div>
              <span className="text-[#B30D12] font-black">
                {UNMET_DEALER_REQUESTS.length} Requests Pending
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Dealer &amp; Region</th>
                    <th className="py-3 px-4">Requested Vehicle Profile</th>
                    <th className="py-3 px-4">Specifications &amp; Criteria</th>
                    <th className="py-3 px-3">Waiting Days</th>
                    <th className="py-3 px-3">Max Landed Budget</th>
                    <th className="py-3 px-3">Priority Score</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium">
                  {UNMET_DEALER_REQUESTS.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 text-sm">
                          {req.dealerName}
                        </div>
                        <span className="text-[11px] text-slate-400 font-normal">
                          {req.region}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-bold text-slate-800">
                        {req.model}
                      </td>

                      <td className="py-3 px-4 text-slate-600 max-w-xs text-[11px]">
                        {req.specRequirements}
                      </td>

                      <td className="py-3 px-3 font-semibold text-slate-700">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          {req.daysWaiting} days waiting
                        </span>
                      </td>

                      <td className="py-3 px-3 font-black text-slate-900 text-sm">
                        NZ${req.maxBudgetNzd.toLocaleString()}
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-900 text-white">
                          {req.priorityScore}/100
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          req.status === 'Partially Matched'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : req.status === 'Auction Proxy Set'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-[#B30D12] border border-red-200'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
