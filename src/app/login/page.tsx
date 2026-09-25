"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Building2, 
  Shield, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp,
  Clock,
  Car
} from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingRole, setLoadingRole] = useState<'dealer' | 'admin' | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.toLowerCase().includes("admin")) {
      router.push("/admin");
    } else {
      router.push("/");
    }
  };

  const loginAsDemo = (role: 'dealer' | 'admin') => {
    setLoadingRole(role);
    if (role === 'admin') {
      setEmail("admin@autoheiwa.com");
      setPassword("brokerSecure2026");
      setTimeout(() => router.push("/admin"), 400);
    } else {
      setEmail("david@aucklandauto.co.nz");
      setPassword("dealerSecure2026");
      setTimeout(() => router.push("/"), 400);
    }
  };

  return (
    <div className="min-h-screen bg-[#080E1A] flex font-sans antialiased text-slate-800">
      
      {/* Left Column: Cinematic Brand Showcase (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0B1322] overflow-hidden flex-col justify-between p-12 text-white border-r border-[#1B2A4A]/50">
        {/* Background Image with Dark Navy Vignette */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-35 mix-blend-luminosity scale-105"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=80')` 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080E1A] via-[#0B1322]/85 to-[#080E1A]/50" />

        {/* Top Brand Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#B30D12] flex items-center justify-center shadow-lg shadow-[#B30D12]/40">
            <span className="text-white font-extrabold text-xl tracking-wider">和</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black text-white tracking-wider leading-none">AUTOHEIWA</span>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-[#B30D12]/20 text-red-300 border border-[#B30D12]/40">NZ</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 tracking-widest block mt-0.5">
              JAPANESE AUCTION INTELLIGENCE
            </span>
          </div>
        </div>

        {/* Mid Hero Value Proposition */}
        <div className="relative z-10 space-y-6 my-auto max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B30D12]/20 text-red-300 border border-[#B30D12]/40 text-xs font-bold">
            <Sparkles size={12} />
            Live Auction Lanes: Tokyo, Yokohama, Kobe & Nagoya
          </div>

          <h1 className="text-4xl font-black text-white tracking-tight leading-tight">
            Institutional Japanese vehicle sourcing & landed margin arbitrage.
          </h1>

          <p className="text-sm text-slate-300 font-medium leading-relaxed">
            Real-time Trade Me, Turners, and AutoTrader market intelligence calculated against live JPY/NZD exchange rates, ocean shipping tariffs, and entry compliance.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#1B2A4A]">
            <div>
              <span className="text-2xl font-black text-white block">48k+</span>
              <span className="text-xs text-slate-400 font-medium">Daily Auction Lots</span>
            </div>
            <div>
              <span className="text-2xl font-black text-emerald-400 block">+NZ$4.2k</span>
              <span className="text-xs text-slate-400 font-medium">Avg. Dealer Margin</span>
            </div>
            <div>
              <span className="text-2xl font-black text-white block">91.24</span>
              <span className="text-xs text-slate-400 font-medium font-mono">Live JPY/NZD</span>
            </div>
          </div>
        </div>

        {/* Bottom Testimonial */}
        <div className="relative z-10 p-4 rounded-xl bg-[#0E182A]/80 border border-[#1B2A4A] backdrop-blur-md">
          <p className="text-xs text-slate-300 italic">
            &ldquo;AutoHeiwa turned our import bidding from guesswork into precision arbitrage. We secured 18 Grade 4.5 hybrids last month with guaranteed margin.&rdquo;
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1B2A4A]/80 text-[11px]">
            <span className="font-bold text-white">David Miller</span>
            <span className="text-slate-400 font-medium">Auckland Auto Group</span>
          </div>
        </div>
      </div>

      {/* Right Column: Sleek Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-[#F6F8FB]">
        <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          
          <div>
            <div className="flex items-center gap-2 lg:hidden mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#B30D12] flex items-center justify-center text-white font-bold text-sm">
                和
              </div>
              <span className="font-black text-slate-900 tracking-wider">AUTOHEIWA</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sign In to AutoHeiwa</h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Select a demo portal below or enter your authorized dealer credentials.
            </p>
          </div>

          {/* 1-Click Demo Login Pills */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Instant Demo Access
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => loginAsDemo('dealer')}
                disabled={loadingRole !== null}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-[#1B2A4A] bg-slate-50 hover:bg-white transition-all text-left group"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                    <Building2 size={14} className="text-emerald-600" />
                    <span>Dealer Portal</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Auckland Auto Group</div>
                </div>
                <ArrowRight size={14} className="text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => loginAsDemo('admin')}
                disabled={loadingRole !== null}
                className="flex items-center justify-between p-3.5 rounded-xl border border-[#1B2A4A]/30 hover:border-[#1B2A4A] bg-[#1B2A4A]/5 hover:bg-white transition-all text-left group"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-black text-[#1B2A4A]">
                    <Shield size={14} className="text-[#B30D12]" />
                    <span>Admin Portal</span>
                  </div>
                  <div className="text-[10px] text-slate-600 mt-0.5">Broker Ops & Tariffs</div>
                </div>
                <ArrowRight size={14} className="text-[#1B2A4A] group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400">
              <span className="bg-white px-2">Or with credentials</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Commercial Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="david@aucklandauto.co.nz"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-[#B30D12] focus:ring-2 focus:ring-[#B30D12]/20"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Security Password</label>
                <a href="#" className="text-[11px] font-bold text-[#1B2A4A] hover:underline">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-[#B30D12] focus:ring-2 focus:ring-[#B30D12]/20"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#B30D12] hover:bg-[#940B0F] text-white font-bold text-xs rounded-xl transition-all shadow-sm hover:shadow flex items-center justify-center gap-1.5"
            >
              Sign In to Terminal <ArrowRight size={14} />
            </button>
          </form>

          <div className="pt-2 text-center text-[11px] text-slate-400 font-medium">
            Protected by AutoHeiwa 256-bit broker encryption & Tokyo exchange link.
          </div>

        </div>
      </div>

    </div>
  );
}
