"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Car,
  User,
  Bell,
  Search,
  Menu,
  X,
  TrendingUp,
  Building2,
  LogOut,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { GLOBAL_SETTINGS, VEHICLES } from '@/lib/data';
import RoleSwitcher from './RoleSwitcher';
import { useSyncStore } from '@/lib/syncStore';
import DealerChatAssistant from '@/components/chat/DealerChatAssistant';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatOpen, setChatOpen] = useState(false);

  React.useEffect(() => {
    const handleOpen = () => setChatOpen(true);
    window.addEventListener('open-autohub-copilot', handleOpen);
    window.addEventListener('open-heiwa-copilot', handleOpen);
    return () => {
      window.removeEventListener('open-autohub-copilot', handleOpen);
      window.removeEventListener('open-heiwa-copilot', handleOpen);
    };
  }, []);

  const { state: syncState, markNotificationAsRead } = useSyncStore();

  const navItems = [
    { label: 'Overview', href: '/', icon: LayoutDashboard, badge: null },
    { label: 'Live Vehicles', href: '/vehicles', icon: Car, badge: `${VEHICLES.length} Lots` },
    { label: 'Buying Criteria', href: '/profile', icon: User, badge: null },
  ];

  return (
    <div className="flex h-screen bg-[#F6F8FB] text-slate-800 font-sans antialiased overflow-hidden">
      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Sleek Deep Navy */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-[264px] bg-[#0b152e] text-slate-300 flex flex-col justify-between shrink-0 border-r border-[#1B2A4A]/50 transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div>
          {/* Brand Logo & Header */}
          <div className="h-[70px] flex items-center justify-between px-4 sm:px-5 border-b border-[#1B2A4A]/60 bg-[#060E22]">
            <Link href="/" className="flex items-center gap-2.5 group" title="AutoHub Dealer Intelligence Platform (DIP)">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#B30D12] via-[#940B0F] to-[#1B2A4A] flex items-center justify-center shadow-md shadow-red-950/50 group-hover:scale-105 transition-transform border border-red-400/30 shrink-0">
                <span className="text-white font-black text-xs tracking-wider">AH</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px] font-black text-white tracking-wide leading-none">AUTOHUB</span>
                  <span className="text-[8.5px] px-1.5 py-0.2 rounded font-extrabold bg-[#B30D12]/25 text-red-300 border border-[#B30D12]/40">DIP</span>
                </div>
                <span className="block text-[8.5px] font-semibold text-slate-400 tracking-[0.08em] mt-0.5">DEALER INTELLIGENCE</span>
              </div>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-slate-400 hover:text-white p-1"
            >
              <X size={18} />
            </button>
          </div>

          {/* Live JPY/NZD Rate Chip */}
          <div className="px-3.5 py-2 mx-3 mt-3 flex items-center justify-between bg-[#0D1627] rounded-xl border border-[#1E2E4E]/80 shadow-2xs text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium">
              <TrendingUp size={12} className="text-emerald-400 shrink-0" />
              <span className="text-slate-400">¥ / NZ$:</span>
              <span className="font-mono font-bold text-white text-xs">{syncState.fxRateJpyNzd}</span>
            </div>
            <span className="text-[9.5px] text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="mt-4 px-3 space-y-3">
            <div className="px-3 pb-1.5 text-[10px] font-bold text-slate-400/80 uppercase tracking-wider">
              Dealer Operations
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${isActive
                    ? 'bg-gradient-to-r from-[#B30D12]/20 via-[#B30D12]/10 to-transparent text-white border-l-2 border-[#B30D12] font-medium shadow-2xs'
                    : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className={isActive ? 'text-[#e56168]' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-[#B30D12]/25 text-red-300 border border-[#B30D12]/40">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User / Dealership Footer */}
        <div className="p-2.5 m-3 bg-[#0D1627] rounded-xl border border-[#1E2E4E]/80 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1B2A4A] to-[#0E1A30] text-slate-200 flex items-center justify-center font-bold text-xs shrink-0 border border-[#2B406B]/60 shadow-2xs">
              DM
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">David Miller</div>
              <div className="text-[10px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                <Building2 size={10} className="shrink-0" />
                <span className="truncate">Auckland Auto Group</span>
              </div>
            </div>
          </div>
          <Link
            href="/login"
            title="Switch User / Logout"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <LogOut size={13} />
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
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Auckland Auto Group
              </h1>
            </div>
          </div>

          {/* Header Right Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Search */}
            <div className="relative hidden md:flex items-center">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Toyota, Aqua, Hybrid, lot #..."
                className="pl-12 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#B30D12] focus:ring-2 focus:ring-[#B30D12]/20 outline-none transition-all w-[420px] text-sm placeholder:text-slate-400 font-medium"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-white border border-slate-200 text-slate-400 rounded px-1.5 py-0.5 text-[10px] font-bold shadow-2xs">
                ⌘K
              </span>
            </div>

            {/* Quick Role Switcher */}
            <RoleSwitcher />

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2.5 text-slate-600 hover:text-slate-900 transition-colors border border-slate-200 rounded-xl hover:bg-slate-50 bg-white"
                title="Sourcing & Intelligence Alerts"
              >
                <Bell size={18} />
                {syncState.dealerNotifications.some(n => !n.isRead) && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#B30D12] rounded-full border-2 border-white shadow-xs animate-pulse"></span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-84 bg-white rounded-2xl border border-slate-200 shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                    <span className="text-xs font-bold text-slate-900">AutoHub Sourcing & Auction Alerts</span>
                    <span className="text-[10px] font-bold text-[#B30D12] bg-red-50 px-2 py-0.5 rounded-full">
                      {syncState.dealerNotifications.filter(n => !n.isRead).length} New
                    </span>
                  </div>
                  <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                    {syncState.dealerNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationAsRead(notif.id)}
                        className={`p-2.5 rounded-xl border text-xs transition-colors cursor-pointer ${notif.isRead
                          ? 'bg-slate-50/60 border-slate-100'
                          : 'bg-red-50/30 border-red-100 hover:bg-red-50/50'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-slate-900 flex items-center gap-1.5">
                            <Sparkles size={12} className={notif.type === 'sourcing_match' ? 'text-[#B30D12]' : 'text-emerald-600'} />
                            <span>{notif.title}</span>
                          </p>
                          {!notif.isRead && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#B30D12]"></span>
                          )}
                        </div>
                        <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">{notif.body}</p>
                        <span className="text-[10px] text-slate-400 font-semibold mt-1.5 block">{notif.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            <Link
              href="/profile"
              className="flex items-center gap-2.5 pl-2 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-[#1B2A4A] text-white flex items-center justify-center font-bold text-xs shadow-sm border border-slate-200">
                AAG
              </div>
            </Link>
          </div>
        </header>

        {/* Main Content Viewport */}
        <div className="flex-1 flex min-h-0 overflow-hidden relative">
          {/* Scrollable Page Canvas - Always full width, never squeezed */}
          <main className="flex-1 overflow-y-auto bg-[#F6F8FB] p-4 sm:p-7 lg:p-9 min-w-0">
            <div className="max-w-[1520px] mx-auto">
              {children}
            </div>
          </main>

          {/* Right Side Chatbot Assistant - Opens OVER the page in an absolute/fixed way */}
          <DealerChatAssistant
            isOpen={chatOpen}
            onClose={() => setChatOpen(false)}
          />
        </div>

        {/* Floating Chat Trigger Button when closed */}
        {!chatOpen && (
          <button
            onClick={() => setChatOpen(true)}
            className="fixed bottom-6 right-6 z-30 flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#0B1322] via-[#101C33] to-[#1B2A4A] text-white shadow-2xl border border-white/15 hover:scale-105 hover:shadow-red-950/40 hover:border-[#B30D12]/40 transition-all duration-200 group"
            title="Open AutoHub DIP Assistant"
          >
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-[#B30D12] to-[#8B090E] flex items-center justify-center font-black text-xs text-white shadow-md shadow-[#B30D12]/40 group-hover:rotate-6 transition-transform border border-red-400/40">
              <Sparkles size={16} className="text-white" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0B1322] animate-pulse"></span>
            </div>
            <div className="text-left">
              <div className="text-xs font-black tracking-wide flex items-center gap-1.5">
                AutoHub DIP Assistant
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#B30D12]/30 text-red-200 border border-[#B30D12]/50 font-bold">Online</span>
              </div>
              <div className="text-[10px] text-slate-300">
                Landed cost · Sheet codes · Bid guide
              </div>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
