"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import Link from "next/link";
import { 
  ArrowRight, 
  Building2, 
  Users, 
  MapPin, 
  Mail, 
  Phone, 
  Sparkles, 
  CheckCircle2, 
  SlidersHorizontal, 
  Plus, 
  ExternalLink 
} from "lucide-react";
import { DEALERS } from "@/lib/data";
import { useSyncStore } from "@/lib/syncStore";

export default function AdminDealers() {
  const { state: syncState } = useSyncStore();
  const [dealersList, setDealersList] = useState(DEALERS);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [newDealerName, setNewDealerName] = useState("");
  const [newDealerEmail, setNewDealerEmail] = useState("");
  const [newDealerLocation, setNewDealerLocation] = useState("");
  const [invitedSuccess, setInvitedSuccess] = useState(false);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const newDealer = {
      id: dealersList.length + 1,
      name: newDealerName,
      location: newDealerLocation || "New Zealand",
      tier: "Standard Dealer",
      activeOpportunities: 6,
      priorityBuys: 1,
      monthlyImportsTarget: 8,
      avgMargin: 3200,
      contactName: "Operations Manager",
      email: newDealerEmail,
      phone: "+64 9 000 0000",
      preferences: {
        makes: ["Toyota", "Honda"],
        models: ["Aqua", "Fit"],
        yearRange: "2018 – 2023",
        maxKm: 80000,
        fuelTypes: ["Hybrid"],
        targetRetail: "NZ$18,000 – NZ$26,000",
        targetMargin: "NZ$3,200+"
      }
    };

    setInvitedSuccess(true);
    setTimeout(() => {
      setDealersList([...dealersList, newDealer]);
      setInvitedSuccess(false);
      setInviteModalOpen(false);
      setNewDealerName("");
      setNewDealerEmail("");
      setNewDealerLocation("");
    }, 1200);
  };

  return (
    <AdminLayout>
      <div className="space-y-8 pb-16">
        
        {/* Header */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1B2A4A]/10 text-[#1B2A4A] border border-[#1B2A4A]/20">
                Dealer Relationship CRM
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              NZ Dealership Network
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-0.5">
              Manage client dealer accounts, custom target margin criteria, and live Japanese lot matches.
            </p>
          </div>

          <button
            onClick={() => setInviteModalOpen(true)}
            className="px-4 py-2.5 bg-[#B30D12] hover:bg-[#940B0F] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 self-start md:self-auto"
          >
            <Plus size={16} /> Onboard New Dealer
          </button>
        </div>

        {/* 3 Dealer Network Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Contracted Dealerships</span>
            <span className="text-3xl font-black text-slate-900 mt-1 block">0{dealersList.length} Accounts</span>
            <span className="text-xs text-emerald-600 font-semibold mt-1 block">All active & bidding</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Monthly Import Target</span>
            <span className="text-3xl font-black text-slate-900 mt-1 block">57 Units / mo</span>
            <span className="text-xs text-slate-500 mt-1 block">Across Auckland, Waikato & Canterbury</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Avg. Client Profit Spread</span>
            <span className="text-3xl font-black text-emerald-700 mt-1 block">+NZ$3,580</span>
            <span className="text-xs text-emerald-600 font-semibold mt-1 block">Exceeds NZ wholesale benchmark</span>
          </div>
        </div>

        {/* Dealers Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {dealersList.map((dealer) => (
            <div 
              key={dealer.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] p-6 flex flex-col justify-between hover-lift group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-[#B30D12] transition-colors">
                      {dealer.name}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                      <MapPin size={12} /> {dealer.location}
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#1B2A4A]/10 text-[#1B2A4A] border border-[#1B2A4A]/20">
                    {dealer.tier}
                  </span>
                </div>

                <div className="py-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Contact:</span>
                    <span className="font-bold text-slate-800">{dealer.contactName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Email:</span>
                    <span className="font-mono text-slate-700">{dealer.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Phone:</span>
                    <span className="font-mono text-slate-700">{dealer.phone}</span>
                  </div>
                </div>

                {/* Performance Mini-Stats */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Live Matches</span>
                    <span className="font-black text-slate-900 text-sm mt-0.5 block">
                      {dealer.activeOpportunities} Lots
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Priority Buys</span>
                    <span className="font-black text-emerald-600 text-sm mt-0.5 block">
                      {dealer.priorityBuys} Priority
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Margin</span>
                  <span className="text-xs font-black text-slate-900 block">
                    {dealer.id === 1 ? `NZ$${syncState.dealerTargetMargin.toLocaleString('en-US')}+` : dealer.preferences.targetMargin}
                  </span>
                </div>

                <Link
                  href={`/admin/dealers/${dealer.id}`}
                  className="px-4 py-2 bg-[#1B2A4A] hover:bg-[#0B1322] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  View Profile <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Invite Dealer Modal */}
        {inviteModalOpen && (
          <div className="fixed inset-0 bg-[#0B1322]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
              <h3 className="text-lg font-black text-slate-900">Onboard New Dealership</h3>
              <p className="text-xs text-slate-500 mt-1">Generate dealer portal login credentials and configure buying rules.</p>

              {invitedSuccess ? (
                <div className="p-4 my-6 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  Invitation dispatched! Dealership added to active directory.
                </div>
              ) : (
                <form onSubmit={handleInvite} className="space-y-4 my-6 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Dealership Legal Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Tauranga Auto Hub Ltd"
                      value={newDealerName}
                      onChange={(e) => setNewDealerName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#B30D12] font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Dealer Principal Email</label>
                    <input 
                      type="email" 
                      required
                      placeholder="principal@dealership.co.nz"
                      value={newDealerEmail}
                      onChange={(e) => setNewDealerEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#B30D12] font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Location / Yard City</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Mount Maunganui, Tauranga"
                      value={newDealerLocation}
                      onChange={(e) => setNewDealerLocation(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#B30D12] font-medium"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setInviteModalOpen(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#B30D12] hover:bg-[#940B0F] text-white rounded-xl font-bold shadow-xs"
                    >
                      Create & Send Link
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
