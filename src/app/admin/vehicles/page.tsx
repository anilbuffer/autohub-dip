"use client";

import React, { useState, useMemo } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import Link from "next/link";
import { 
  ArrowRight, 
  Search, 
  ChevronDown, 
  Sparkles, 
  Filter, 
  SlidersHorizontal,
  ExternalLink,
  Car,
  Building2,
  Clock
} from "lucide-react";
import { VEHICLES, DEALERS } from "@/lib/data";

export default function AdminVehicles() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDealer, setSelectedDealer] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredVehicles = useMemo(() => {
    return VEHICLES.filter((v) => {
      const matchesSearch = 
        v.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.lotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.auctionHouse.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDealer = selectedDealer === "All" || v.dealer === selectedDealer;
      const matchesStatus = selectedStatus === "All" || v.status === selectedStatus;

      return matchesSearch && matchesDealer && matchesStatus;
    });
  }, [searchTerm, selectedDealer, selectedStatus]);

  return (
    <AdminLayout>
      <div className="space-y-6 pb-16">
        
        {/* Header */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1B2A4A]/10 text-[#1B2A4A] border border-[#1B2A4A]/20">
                Brokerage Master Database
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Auction Inventory & Dealer Allocations
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-0.5">
              Review and manage all Japanese auction lots, margin parameters, and dealer assignments.
            </p>
          </div>

          <div className="text-xs font-bold text-slate-500 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
            Total Scraped Lots: <span className="text-slate-900 font-extrabold">{VEHICLES.length} Qualified</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search vehicle, VIN, lot #, auction house..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#1B2A4A] text-xs font-medium outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="relative">
              <select
                value={selectedDealer}
                onChange={(e) => setSelectedDealer(e.target.value)}
                className="w-full appearance-none px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#1B2A4A] text-xs font-semibold text-slate-800 outline-none transition-all cursor-pointer"
              >
                <option value="All">All Dealerships</option>
                {DEALERS.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>

            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full appearance-none px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#1B2A4A] text-xs font-semibold text-slate-800 outline-none transition-all cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Priority">Priority Buy Only</option>
                <option value="Consider">Consider</option>
                <option value="Review">Under Review</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>
          </div>
        </div>

        {/* High Density Table */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Vehicle</th>
                  <th className="px-5 py-3.5">Auction House & Lot</th>
                  <th className="px-5 py-3.5">Matched Dealer</th>
                  <th className="px-5 py-3.5">FOB (JPY)</th>
                  <th className="px-5 py-3.5">Est. Landed (NZD)</th>
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
                          <div className="text-[11px] text-slate-500 font-mono">{v.vin}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-800">{v.auctionHouse}</div>
                      <div className="text-[11px] text-slate-400 font-mono">Lot #{v.lotNumber} • Grade {v.grade}</div>
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-800">
                      {v.dealer}
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
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                        v.status === 'Priority' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        <Sparkles size={11} /> {v.score}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link 
                        href={`/admin/vehicles/${v.id}`} 
                        className="px-3 py-1.5 bg-[#1B2A4A] hover:bg-[#0B1322] text-white rounded-lg text-xs font-bold inline-flex items-center gap-1"
                      >
                        Inspect <ArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
