"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import {
  HelpCircle,
  ShieldCheck,
  Database,
  Terminal,
  PhoneCall,
  FileText,
  CheckCircle2,
  Layers,
  ChevronDown,
  BookOpen,
  Info,
  Sparkles
} from "lucide-react";

export default function AdminHelpPage() {
  const [openSection, setOpenSection] = useState<number | null>(0);

  const guides = [
    {
      title: "Scraper Ingestion & Webhook Health",
      content: "AutoHub DIP pulls Japanese auction inventory via automated worker scrapers running against USS Tokyo, USS Yokohama, CAA Chubu, and HAA Kobe. Ingestion cycles execute at 02:00, 06:00, and 11:00 JST. If a scraper health check drops below 98%, the system alerts the on-duty broker on Telegram."
    },
    {
      title: "Dealer Margin Potential & Scoring Algorithm",
      content: "The Opportunity Score (1-100) measures: (1) Gross profit margin spread vs target, (2) Est. days to land in NZ (indicative shipping lead time), (3) Auction grade integrity (Grade 4.5/A receives a +12 score weight), (4) Distance from average market price regression line."
    },
    {
      title: "Manual Proxy Bidding Protocol",
      content: "When a dealer clicks 'Lock In Maximum Auto-Bid', the bid amount is logged in the Broker Ops queue. The designated floor bidder in Tokyo enters the proxy ceiling into the USS Auction terminal with an automatic safety buffer."
    },
    {
      title: "Clean Car Standard & Emission Credits Management",
      content: "Under NZTA Clean Car regulations, vehicles emitting over 112g CO2/km attract platform fee adjustments. AutoHub DIP checks the Japanese Ministry of Land, Infrastructure, Transport and Tourism (MLIT) database to pull verified vehicle emissions before calculating landed CIF."
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 pb-12 max-w-7xl mx-auto">
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
                  Brokerage Standard Operating Procedures
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-700 shadow-2xs">
                  <Sparkles size={11} className="text-emerald-600" />
                  AutoHub DIP Documentation
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Broker Ops &amp; System Architecture
              </h1>

              <p className="text-slate-500 text-xs sm:text-sm font-normal mt-1 leading-relaxed max-w-3xl">
                Operational procedures for Japanese auction floor coordination, automated scraper feeds, and client dealership onboarding.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Concierge Quick Action Cards matching Dealer Help */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] space-y-3 hover-lift">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#B30D12] flex items-center justify-center font-bold">
              <Database size={20} />
            </div>
            <h3 className="text-base font-black text-slate-900">Scraper Sync Engine</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Direct automated API connectors running against USS Tokyo, USS Yokohama, TAA, CAA, and ARAI auction platforms.
            </p>
            <div className="pt-2 text-xs font-bold text-[#B30D12]">
              Ingestion: 02:00, 06:00, 11:00 JST
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] space-y-3 hover-lift">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-base font-black text-slate-900">Compliance &amp; ODO Vault</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Automated JEVIC mileage verification, radiation inspection, and Japanese MLIT export certificate archiving.
            </p>
            <div className="pt-2 text-xs font-bold text-emerald-600">
              100% ODO Guarantee Verified
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] space-y-3 hover-lift">
            <div className="w-10 h-10 rounded-xl bg-[#1B2A4A]/10 text-[#1B2A4A] flex items-center justify-center font-bold">
              <Terminal size={20} />
            </div>
            <h3 className="text-base font-black text-slate-900">Broker Floor Terminal</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Direct electronic link to Tokyo bidding floor terminals for automated proxy bids and real-time lane monitoring.
            </p>
            <div className="pt-2 text-xs font-bold text-[#1B2A4A] font-mono">
              USS Lane Link Active
            </div>
          </div>
        </div>

        {/* Japanese Auction Grade Benchmark Card matching Dealer Help */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] p-6 sm:p-7">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={18} className="text-[#B30D12]" />
            <h2 className="text-base font-black text-slate-900">Japanese Auction Grade Benchmark</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs font-black text-slate-900 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Grade 5.0 / S
              </span>
              <p className="font-bold text-slate-800 pt-1">Near Showroom Condition</p>
              <p className="text-slate-500">Under 25,000 km, zero panel work, original factory paint, spotless interior.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs font-black text-slate-900 px-2 py-0.5 rounded bg-red-50 text-[#B30D12] border border-red-100">
                Grade 4.5
              </span>
              <p className="font-bold text-slate-800 pt-1">Gold Standard Dealer Grade</p>
              <p className="text-slate-500">Very clean condition, negligible blemishes, genuine verified mileage, high retail appeal.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs font-black text-slate-900 px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                Grade 4.0
              </span>
              <p className="font-bold text-slate-800 pt-1">Standard Good Condition</p>
              <p className="text-slate-500">Normal light wear for age, minor touch-ups or small stone chips easily groomed.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs font-black text-slate-900 px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                Grade 3.5 / R
              </span>
              <p className="font-bold text-slate-800 pt-1">Budget / Reconditioning</p>
              <p className="text-slate-500">Visible scratches or cosmetic repairs. AutoHub DIP adjusts market bid guides accordingly.</p>
            </div>
          </div>
        </div>

        {/* Operational Manual Accordion */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] p-6 sm:p-7 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-[#B30D12] border border-red-100 flex items-center justify-center font-bold shadow-2xs">
              <FileText size={16} />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">Broker Operational Manual &amp; Execution Protocols</h2>
              <p className="text-xs text-slate-500 font-medium">Standard procedures for proxy ceiling execution, FX buffering, and compliance.</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {guides.map((guide, idx) => (
              <div key={idx} className="py-4">
                <button
                  onClick={() => setOpenSection(openSection === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-xs font-bold text-slate-900 hover:text-[#B30D12] transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-mono font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-sm">{guide.title}</span>
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transform transition-transform ${openSection === idx ? 'rotate-180 text-[#B30D12]' : ''}`}
                  />
                </button>
                {openSection === idx && (
                  <p className="text-xs text-slate-600 mt-2.5 pl-7 leading-relaxed animate-in fade-in duration-150 font-medium">
                    {guide.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Small Disclaimer */}
        <div className="flex items-center justify-center gap-2 p-3 bg-white/70 border border-slate-200/70 rounded-xl text-center shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
          <Info size={13} className="text-slate-400 shrink-0" />
          <span className="text-[11px] text-slate-500 font-medium">
            Indicative figures based on current NZ market data. Final bid decisions rest with the dealer.
          </span>
        </div>
      </div>
    </AdminLayout>
  );
}
