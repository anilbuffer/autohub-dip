"use client";

import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { 
  HelpCircle, 
  BookOpen, 
  FileCheck2, 
  ShieldCheck, 
  Calculator, 
  PhoneCall, 
  MessageSquare, 
  ChevronDown, 
  ExternalLink,
  Award,
  Sparkles
} from "lucide-react";

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does AutoHeiwa calculate Recommended Maximum Bids?",
      a: "Our engine starts from the estimated NZ retail market value (derived from real-time Trade Me, Turners, and AutoTrader listings), then subtracts your target dealer margin (e.g. NZ$3,500), ocean freight, NZ entry compliance, bio-security, MAF fees, and 15% GST. The remainder is converted at the live bank FX rate to give the exact maximum FOB ceiling in Japanese Yen."
    },
    {
      q: "What do the Japanese Auction Grades (4.5, 4.0, 3.5, R) signify?",
      a: "Grade 5.0 is practically brand new with under 15k km. Grade 4.5 is the Japanese gold standard with very minor grooming needed and verified low mileage. Grade 4.0 has normal wear commensurate with age. Grade 3.5 requires minor panel/reconditioning work. Grade R/RA denotes repaired past accident damage (which AutoHeiwa automatically flags with warnings)."
    },
    {
      q: "How are currency fluctuations (JPY/NZD) handled during bidding?",
      a: "AutoHeiwa syncs directly with wholesale institutional FX feeds every 15 minutes. When you place a maximum proxy bid, your bid is locked with a 1.5% volatility buffer to protect your gross margin against intra-day currency swings."
    },
    {
      q: "What happens after I win an auction lot?",
      a: "The AutoHeiwa broker team handles inland transport to Yokohama or Nagoya port, performs secondary independent radiation and ODO verification checks, arranges Roll-on/Roll-off (RORO) shipping to Auckland or Lyttelton, and manages customs clearance and entry certification."
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-8 pb-16 max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1B2A4A]/10 text-[#1B2A4A] border border-[#1B2A4A]/20">
              Dealer Support & Concierge
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Knowledge Base & Japanese Auction Guide
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-0.5">
            Operational guides, auction grade references, and direct contact with your dedicated Tokyo/Auckland broker.
          </p>
        </div>

        {/* 3 Concierge Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] space-y-3 hover-lift">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#B30D12] flex items-center justify-center font-bold">
              <PhoneCall size={20} />
            </div>
            <h3 className="text-base font-black text-slate-900">Tokyo Auction Floor Desk</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Direct line to our licensed USS Tokyo & Yokohama bidders for last-minute physical inspections.
            </p>
            <div className="pt-2 text-xs font-bold text-[#B30D12] font-mono">
              +81 3 5555 0192 (JST 08:00 - 19:00)
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] space-y-3 hover-lift">
            <div className="w-10 h-10 rounded-xl bg-[#1B2A4A]/10 text-[#1B2A4A] flex items-center justify-center font-bold">
              <MessageSquare size={20} />
            </div>
            <h3 className="text-base font-black text-slate-900">NZ Logistics & Compliance</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Updates on Ports of Auckland vessel schedules, MAF biosecurity inspections, and entry compliance.
            </p>
            <div className="pt-2 text-xs font-bold text-[#1B2A4A] font-mono">
              nzops@autoheiwa.com
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] space-y-3 hover-lift">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Award size={20} />
            </div>
            <h3 className="text-base font-black text-slate-900">Clean Car Intelligence</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Official NZTA Clean Car Standard CO2 emission targets, fee schedules, and credit balance tracking.
            </p>
            <div className="pt-2 text-xs font-bold text-emerald-600">
              Updated for 2026/27 Policies
            </div>
          </div>
        </div>

        {/* Auction Grades Reference Guide */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] p-6 sm:p-7">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={18} className="text-[#1B2A4A]" />
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
              <span className="text-xs font-black text-slate-900 px-2 py-0.5 rounded bg-[#1B2A4A]/10 text-[#1B2A4A]">
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
              <p className="text-slate-500">Visible scratches or cosmetic repairs. AutoHeiwa discounts max bids accordingly.</p>
            </div>
          </div>
        </div>

        {/* Interactive FAQ Accordion */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] p-6 sm:p-7 space-y-4">
          <h2 className="text-base font-black text-slate-900">Frequently Asked Questions</h2>

          <div className="divide-y divide-slate-100">
            {faqs.map((faq, i) => (
              <div key={i} className="py-3.5">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between text-left text-xs font-bold text-slate-900 hover:text-[#B30D12] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown 
                    size={16} 
                    className={`text-slate-400 transform transition-transform ${openFaq === i ? 'rotate-180 text-[#B30D12]' : ''}`} 
                  />
                </button>
                {openFaq === i && (
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed animate-in fade-in duration-150">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
