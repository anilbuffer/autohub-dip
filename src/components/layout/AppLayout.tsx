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
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { GLOBAL_SETTINGS, VEHICLES } from '@/lib/data';
import RoleSwitcher from './RoleSwitcher';
import { useSyncStore } from '@/lib/syncStore';
import DealerChatAssistant from '@/components/chat/DealerChatAssistant';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Desktop sidebar collapse state
  // Large screens (1024px - 1279px): default collapsed (minside) with toggle buttons for openside
  // XLLarge screens (>= 1280px): default open with toggle buttons for minside
  // Mobile / Tablet (< 1024px): sidebar completely offset, toggle opens overlay drawer
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const lastBreakpointRef = React.useRef<'mobile' | 'lg' | 'xl' | null>(null);

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let currentBreakpoint: 'mobile' | 'lg' | 'xl' = 'mobile';
      if (width >= 1280) {
        currentBreakpoint = 'xl';
      } else if (width >= 1024) {
        currentBreakpoint = 'lg';
      } else {
        currentBreakpoint = 'mobile';
      }

      if (currentBreakpoint !== lastBreakpointRef.current) {
        lastBreakpointRef.current = currentBreakpoint;
        if (currentBreakpoint === 'lg') {
          setIsCollapsed(true);
          setMobileMenuOpen(false);
        } else if (currentBreakpoint === 'xl') {
          setIsCollapsed(false);
          setMobileMenuOpen(false);
        } else {
          setMobileMenuOpen(false);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMini = isCollapsed && !mobileMenuOpen;

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
    <div className="flex h-screen bg-[#EEF2F6] text-slate-800 font-sans antialiased overflow-hidden">
      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Sleek Deep Navy */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 bg-[#0b152e] text-slate-300 flex flex-col justify-between shrink-0 border-r border-[#1B2A4A]/50 transition-all duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0 shadow-2xl w-[264px]' : '-translate-x-full lg:translate-x-0'}
        ${!mobileMenuOpen && (isCollapsed ? 'lg:w-[72px]' : 'lg:w-[264px]')}
      `}>
        <div>
          {/* Brand Logo & Header */}
          <div className={`h-[70px] flex items-center border-b border-[#1B2A4A]/60 bg-[#060E22] transition-all ${
            isMini ? 'justify-center px-2' : 'justify-between px-4 sm:px-5'
          }`}>
            {isMini ? (
              <Link
                href="/"
                className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#B30D12] via-[#940B0F] to-[#1B2A4A] flex items-center justify-center shadow-md shadow-red-950/50 hover:scale-105 transition-all border border-red-400/30 shrink-0"
                title="AutoHub DIP"
              >
                <span className="text-white font-black text-xs tracking-wider">AH</span>
              </Link>
            ) : (
              <>
                <Link href="/" className="flex items-center gap-2.5 group min-w-0" title="AutoHub Dealer Intelligence Platform (DIP)">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#B30D12] via-[#940B0F] to-[#1B2A4A] flex items-center justify-center shadow-md shadow-red-950/50 group-hover:scale-105 transition-transform border border-red-400/30 shrink-0">
                    <span className="text-white font-black text-xs tracking-wider">AH</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[14px] font-black text-white tracking-wide leading-none">AUTOHUB</span>
                      <span className="text-[8.5px] px-1.5 py-0.2 rounded font-extrabold bg-[#B30D12]/25 text-red-300 border border-[#B30D12]/40">DIP</span>
                    </div>
                    <span className="block text-[8.5px] font-semibold text-slate-400 tracking-[0.08em] mt-0.5 truncate">DEALER INTELLIGENCE</span>
                  </div>
                </Link>

                {/* Mobile close button (visible only in mobile overlay drawer) */}
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="lg:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors shrink-0"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </>
            )}
          </div>

          {/* Navigation Links */}
          <nav className={`mt-4 space-y-2 transition-all ${isMini ? 'px-2' : 'px-3'}`}>
            {!isMini && (
              <div className="px-3 pb-1.5 text-[10px] font-bold text-slate-400/80 uppercase tracking-wider">
                Dealer Operations
              </div>
            )}
            {isMini && (
              <div className="w-8 mx-auto border-t border-[#1B2A4A]/60 my-2" />
            )}

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

              if (isMini) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    title={item.badge ? `${item.label} (${item.badge})` : item.label}
                    className={`group relative flex items-center justify-center w-11 h-11 mx-auto rounded-xl transition-all duration-150 ${
                      isActive
                        ? 'bg-[#B30D12] text-white shadow-md shadow-red-950/40 font-semibold'
                        : 'text-slate-400 hover:bg-white/[0.06] hover:text-slate-200'
                    }`}
                  >
                    <Icon size={19} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'} />
                    {item.badge && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#B30D12] ring-2 ring-[#0b152e]"></span>
                    )}
                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#060E22] text-white text-xs font-semibold rounded-lg shadow-2xl border border-[#1B2A4A] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50 flex items-center gap-2">
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-[#B30D12]/30 text-red-300 border border-[#B30D12]/40">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${isActive
                    ? 'bg-gradient-to-r from-[#B30D12]/80 via-[#B30D12]/80 to-[#B30D12]/80 text-white border-l-2 border-[#B30D12] font-medium shadow-2xs'
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
        {isMini ? (
          <div className="p-2 m-2 bg-[#0D1627] rounded-xl border border-[#1E2E4E]/80 flex flex-col items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1B2A4A] to-[#0E1A30] text-slate-200 flex items-center justify-center font-bold text-xs shrink-0 border border-[#2B406B]/60 shadow-2xs"
              title="David Miller - Auckland Auto Group"
            >
              DM
            </div>
            <Link
              href="/login"
              title="Switch User / Logout"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <LogOut size={14} />
            </Link>
          </div>
        ) : (
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
        )}
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Bar */}
        <header className="h-16 sm:h-[72px] bg-white border-b border-slate-200/90 px-3 sm:px-6 md:px-8 flex items-center justify-between shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.02)] z-20 gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            {/* Mobile / Tablet Toggle: Opens full overlay drawer (< lg) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 shrink-0 transition-colors"
              aria-label="Open mobile menu"
              title="Open menu"
            >
              <Menu size={20} />
            </button>

            {/* Desktop Sidebar Toggle: Toggles mini vs open sidebar (>= lg) */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex items-center justify-center p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 border border-slate-200/80 shrink-0 transition-all shadow-2xs hover:border-slate-300"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={isCollapsed ? "Expand sidebar (Open)" : "Collapse sidebar (Mini)"}
            >
              {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="text-sm sm:text-base md:text-xl font-black text-slate-900 tracking-tight truncate">
                Auckland Auto Group
              </h1>
            </div>
          </div>

          {/* Header Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Quick Search */}
            <div className="relative hidden md:flex items-center">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Toyota, Aqua, Hybrid, lot #..."
                className="pl-12 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#B30D12] focus:ring-2 focus:ring-[#B30D12]/20 outline-none transition-all w-[200px] lg:w-[280px] xl:w-[420px] text-sm placeholder:text-slate-400 font-medium"
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
                className="relative p-1.5 sm:p-2.5 text-slate-600 hover:text-slate-900 transition-colors border border-slate-200 rounded-xl hover:bg-slate-50 bg-white shrink-0"
                title="Sourcing & Intelligence Alerts"
              >
                <Bell size={17} />
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
              className="flex items-center gap-2 pl-0.5 sm:pl-2 cursor-pointer group shrink-0"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#1B2A4A] text-white flex items-center justify-center font-bold text-xs shadow-sm border border-slate-200">
                AG
              </div>
            </Link>
          </div>
        </header>

        {/* Main Content Viewport */}
        <div className="flex-1 flex min-h-0 overflow-hidden relative">
          {/* Scrollable Page Canvas - High contrast background */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#EEF2F6] p-3 sm:p-6 lg:p-8 min-w-0 w-full max-w-full">
            <div className="max-w-full mx-auto w-full min-w-0">
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
