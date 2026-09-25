"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  Settings, 
  HelpCircle, 
  Bell, 
  Search, 
  Menu, 
  X,
  ChevronRight, 
  TrendingUp,
  Sliders,
  Database,
  RefreshCw,
  LogOut,
  Shield,
  Layers,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { GLOBAL_SETTINGS } from '@/lib/data';
import RoleSwitcher from './RoleSwitcher';
import { useSyncStore } from '@/lib/syncStore';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { state: syncState } = useSyncStore();

  const getBreadcrumbs = () => {
    if (pathname === '/admin') return [{ label: 'Demand Intelligence', href: '/admin' }];
    if (pathname === '/admin/vehicles') return [{ label: 'Auction Inventory', href: '/admin/vehicles' }];
    if (pathname.startsWith('/admin/vehicles/')) return [
      { label: 'Auction Inventory', href: '/admin/vehicles' },
      { label: 'Vehicle Broker Sheet', href: pathname }
    ];
    if (pathname === '/admin/dealers') return [{ label: 'Dealership Network', href: '/admin/dealers' }];
    if (pathname.startsWith('/admin/dealers/')) return [
      { label: 'Dealership Network', href: '/admin/dealers' },
      { label: 'Dealer Profile & Criteria', href: pathname }
    ];
    if (pathname === '/admin/settings') return [{ label: 'Global FX & Calculation Engine', href: '/admin/settings' }];
    return [{ label: 'Demand Intelligence', href: '/admin' }];
  };

  const navItems = [
    { label: 'Demand Intelligence', href: '/admin', icon: Sparkles, badge: 'Live AI' },
    { label: 'Auction Lots', href: '/admin/vehicles', icon: Car, badge: '38 Lots' },
    { label: 'Dealers CRM', href: '/admin/dealers', icon: Users, badge: '3 Active' },
    { label: 'Calculation Engine', href: '/admin/settings', icon: Settings, badge: null },
  ];

  const handleRefreshFeeds = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="flex h-screen bg-[#F6F8FB] text-slate-800 font-sans antialiased overflow-hidden">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-[#0B1322]/70 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Deep Navy */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-[275px] bg-[#0B1322] text-slate-300 flex flex-col justify-between shrink-0 border-r border-[#1B2A4A]/70 transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div>
          {/* Logo & Header */}
          <div className="h-[76px] flex items-center justify-between px-5 border-b border-[#1B2A4A]/80 bg-[#080E1A]">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-[#1B2A4A] flex items-center justify-center shadow-lg shadow-blue-950/50 group-hover:scale-105 transition-transform border border-[#2B406B]">
                <Shield size={20} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[15px] font-black text-white tracking-wider leading-none">AUTOHEIWA</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-[#B30D12] text-white border border-[#B30D12]">OPS</span>
                </div>
                <span className="block text-[10px] font-semibold text-slate-400 tracking-widest mt-1">BROKER & ADMIN</span>
              </div>
            </Link>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-slate-400 hover:text-white p-1"
            >
              <X size={20} />
            </button>
          </div>

          {/* Live Scraper Engine Status */}
          <div className="px-4 py-2 mx-3 mt-3 flex items-center justify-between bg-[#0E182A] rounded-lg border border-[#1B2A4A]/60 text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Database size={12} className="text-blue-400" />
              <span>Auction Feeds:</span>
              <span className="font-bold text-white">4 Online</span>
            </div>
            <button 
              onClick={handleRefreshFeeds}
              title="Sync Feeds"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <RefreshCw size={12} className={isRefreshing ? 'animate-spin text-blue-400' : ''} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-4 px-3 space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Management & Intelligence
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#B30D12]/25 to-[#B30D12]/5 text-white border-l-4 border-[#B30D12] font-bold shadow-sm'
                      : 'text-slate-400 hover:bg-[#111C30] hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? 'text-[#e56168]' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1B2A4A] text-blue-200 border border-[#2B406B]">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Super Admin Footer */}
        <div className="p-3 m-3 bg-[#080E1A] rounded-xl border border-[#1B2A4A] flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#1B2A4A] text-white flex items-center justify-center font-bold text-sm shrink-0 border border-[#2B406B]">
              AD
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-bold text-white truncate">Platform Admin</div>
              <div className="text-[11px] text-slate-400 truncate">Super Admin Role</div>
            </div>
          </div>
          <Link 
            href="/login" 
            title="Switch User / Logout"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-[#1B2A4A] rounded-lg transition-colors"
          >
            <LogOut size={14} />
          </Link>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Bar */}
        <header className="h-[72px] bg-white border-b border-slate-200/90 px-4 sm:px-8 flex items-center justify-between shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.02)] z-20">
          <div className="flex items-center gap-3 min-w-0">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              <Menu size={20} />
            </button>
            <div className="min-w-0">
              <div className="text-[12px] text-slate-500 font-medium flex items-center gap-1.5">
                <span className="font-semibold text-slate-700">Admin Operations</span>
                {getBreadcrumbs().map((b, idx) => (
                  <React.Fragment key={idx}>
                    <ChevronRight size={12} className="text-slate-400 shrink-0" />
                    <Link href={b.href} className="hover:text-slate-900 truncate">
                      {b.label}
                    </Link>
                  </React.Fragment>
                ))}
              </div>
              <div className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2 mt-0.5">
                {pathname === '/admin' ? 'Demand Intelligence' : 'Command Center'}
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                  <Shield size={11} className="text-[#B30D12]" /> 
                  {pathname === '/admin' ? 'Autohub & Heiwa Sourcing' : 'Brokerage Super Admin'}
                </span>
              </div>
            </div>
          </div>

          {/* Header Right Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Search */}
            <div className="relative hidden xl:flex items-center">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search models, dealers, VINs..." 
                className="pl-9 pr-12 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#1B2A4A] focus:ring-2 focus:ring-[#1B2A4A]/20 outline-none transition-all w-[240px] text-xs placeholder:text-slate-400 font-medium"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-white border border-slate-200 text-slate-400 rounded px-1.5 py-0.5 text-[10px] font-bold shadow-2xs">
                ⌘K
              </span>
            </div>

            {/* Role Switcher: View as: Dealer / Autohub Admin */}
            <RoleSwitcher />

            {/* Notification Bell */}
            <button className="relative p-2.5 text-slate-600 hover:text-slate-900 transition-colors border border-slate-200 rounded-xl hover:bg-slate-50 bg-white">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#B30D12] rounded-full border-2 border-white shadow-xs"></span>
            </button>

            {/* Settings Quick Icon */}
            <Link
              href="/admin/settings"
              className="p-2.5 text-slate-600 hover:text-slate-900 transition-colors border border-slate-200 rounded-xl hover:bg-slate-50 bg-white"
              title="Global Settings"
            >
              <Settings size={18} />
            </Link>
          </div>
        </header>

        {/* Scrollable Page Canvas */}
        <main className="flex-1 overflow-y-auto bg-[#F6F8FB] p-4 sm:p-7 lg:p-9">
          <div className="max-w-[1520px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
