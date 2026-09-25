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
  ChevronDown
} from "lucide-react";

export default function AdminHelpPage() {
  const [openSection, setOpenSection] = useState<number | null>(0);

  const guides = [
    {
      title: "Scraper Ingestion & Webhook Health",
      content: "AutoHeiwa pulls Japanese auction inventory via automated worker scrapers running against USS Tokyo, USS Yokohama, CAA Chubu, and HAA Kobe. Ingestion cycles execute at 02:00, 06:00, and 11:00 JST. If a scraper health check drops below 98%, the system alerts the on-duty broker on Telegram."
    },
    {
      title: "Dealer Arbitrage & Scoring Algorithm",
      content: "The proprietary Opportunity Score (1-100) measures: (1) Gross profit margin spread vs target, (2) Historical NZ yard turnaround days for this exact make/badge, (3) Auction grade integrity (Grade 4.5/A receives a +12 score weight), (4) Distance from average market price regression line."
    },
    {
      title: "Manual Proxy Bidding Protocol",
      content: "When a dealer clicks 'Lock In Maximum Auto-Bid', the bid amount is logged in the Broker Ops queue. The designated floor bidder in Tokyo enters the proxy ceiling into the USS Auction terminal with an automatic safety buffer."
    },
    {
      title: "Clean Car Standard & Emission Credits Management",
      content: "Under NZTA Clean Car regulations, vehicles emitting over 112g CO2/km attract platform fee adjustments. AutoHeiwa checks the Japanese Ministry of Land, Infrastructure, Transport and Tourism (MLIT) database to pull verified vehicle emissions before calculating landed CIF."
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 pb-16 max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1B2A4A]/10 text-[#1B2A4A] border border-[#1B2A4A]/20">
              Brokerage Standard Operating Procedures
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Broker Ops & System Architecture
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-0.5">
            Operational procedures for auction floor coordination, scraper feeds, and client dealership onboarding.
          </p>
        </div>

        {/* 3 Quick Telemetry Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] space-y-2 hover-lift">
            <div className="w-10 h-10 rounded-xl bg-[#1B2A4A]/10 text-[#1B2A4A] flex items-center justify-center font-bold">
              <Database size={20} />
            </div>
            <h3 className="text-sm font-black text-slate-900">Scraper Sync Engine</h3>
            <p className="text-xs text-slate-500">
              Direct API connectors running against USS, TAA, CAA, and ARAI auction platforms.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] space-y-2 hover-lift">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-sm font-black text-slate-900">Compliance & ODO Vault</h3>
            <p className="text-xs text-slate-500">
              Automated JEVIC mileage verification and Japanese export certificate archiving.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] space-y-2 hover-lift">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#B30D12] flex items-center justify-center font-bold">
              <Terminal size={20} />
            </div>
            <h3 className="text-sm font-black text-slate-900">Broker Direct Floor Terminal</h3>
            <p className="text-xs text-slate-500">
              Direct electronic link to Tokyo bidding floor terminals for automated proxy bids.
            </p>
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] p-6 sm:p-7 space-y-4">
          <h2 className="text-base font-black text-slate-900">Broker Operational Manual</h2>

          <div className="divide-y divide-slate-100">
            {guides.map((guide, idx) => (
              <div key={idx} className="py-4">
                <button
                  onClick={() => setOpenSection(openSection === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-xs font-bold text-slate-900 hover:text-[#B30D12] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-mono">
                      {idx + 1}
                    </span>
                    {guide.title}
                  </span>
                  <ChevronDown 
                    size={16} 
                    className={`text-slate-400 transform transition-transform ${openSection === idx ? 'rotate-180 text-[#B30D12]' : ''}`} 
                  />
                </button>
                {openSection === idx && (
                  <p className="text-xs text-slate-600 mt-2.5 pl-7 leading-relaxed animate-in fade-in duration-150">
                    {guide.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
