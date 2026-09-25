"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, ShieldCheck, Sparkles } from 'lucide-react';

interface RoleSwitcherProps {
  variant?: 'light' | 'dark';
}

export default function RoleSwitcher({ variant = 'light' }: RoleSwitcherProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <div className="flex items-center gap-2 bg-slate-100/90 p-1 rounded-xl border border-slate-200/90 shadow-2xs">
      <span className="text-[11px] font-bold text-slate-400 pl-2 pr-0.5 uppercase tracking-wider hidden sm:inline select-none">
        View as:
      </span>

      {/* Dealer Role Button */}
      <Link
        href="/"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all select-none ${
          !isAdmin
            ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
        }`}
        title="Switch to Dealer Portal View"
      >
        <Building2 
          size={14} 
          className={!isAdmin ? 'text-emerald-600' : 'text-slate-400'} 
        />
        <span>Dealer</span>
        {!isAdmin && (
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 hidden md:inline-block"></span>
        )}
      </Link>

      {/* Autohub Admin Role Button */}
      <Link
        href="/admin"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all select-none ${
          isAdmin
            ? 'bg-[#1B2A4A] text-white shadow-xs'
            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
        }`}
        title="Switch to Autohub / Heiwa Admin Command Center"
      >
        <ShieldCheck 
          size={14} 
          className={isAdmin ? 'text-blue-300' : 'text-slate-400'} 
        />
        <span>Autohub Admin</span>
        {isAdmin && (
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 hidden md:inline-block"></span>
        )}
      </Link>
    </div>
  );
}
