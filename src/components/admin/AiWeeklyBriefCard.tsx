"use client";

import React, { useState } from 'react';
import { Sparkles, Download, Share2, Globe2, Check, ArrowRight, ShieldCheck, Clock, Zap } from 'lucide-react';
import { AI_WEEKLY_BRIEF } from '@/lib/demandIntelligenceData';

interface AiWeeklyBriefCardProps {
  onNotifyToast: (message: string) => void;
}

export default function AiWeeklyBriefCard({ onNotifyToast }: AiWeeklyBriefCardProps) {
  const [lang, setLang] = useState<'en' | 'jp'>('en');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const brief = AI_WEEKLY_BRIEF[lang];

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      onNotifyToast(
        lang === 'en' 
          ? "PDF Executive Brief downloaded for AutoHub Sourcing Board"
          : "AutoHub DIP仕入れ役員会向けPDFブリーフをダウンロードしました"
      );
    }, 600);
  };

  const handleShare = () => {
    setIsSharing(true);
    setTimeout(() => {
      setIsSharing(false);
      onNotifyToast(
        lang === 'en'
          ? "Dispatched to AutoHub Japan procurement team (Tokyo & Yokohama offices)"
          : "AutoHub東京本社・横浜調達チームへ即時共有されました"
      );
    }, 600);
  };

  return (
    <div className="relative rounded-2xl bg-gradient-to-r from-red-50/90 via-rose-50/60 to-orange-50/30 border border-red-200/80 shadow-[0_2px_10px_-2px_rgba(179,13,18,0.06),0_1px_3px_rgba(0,0,0,0.02)] p-4 sm:p-5 overflow-hidden transition-all">
      {/* Top Brand Crimson Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#B30D12] via-[#E23B40] to-rose-400" />

      {/* Subtle Ambient Background Watermark Glow */}
      <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-gradient-to-bl from-red-500/10 via-rose-400/5 to-transparent blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 pb-3.5 border-b border-red-100/90">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#B30D12] to-[#E23B40] text-white flex items-center justify-center shadow-md shadow-red-950/20 shrink-0 border border-white/30">
            <Sparkles size={18} className="animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-100/90 text-[#B30D12] border border-red-200">
                {brief.badge}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
                <Zap size={10} className="text-emerald-600" /> {brief.confidenceText}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
              {brief.title}
            </h2>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5 max-w-2xl leading-normal">
              {brief.subtitle}
            </p>
          </div>
        </div>

        {/* Language Switcher & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-center shrink-0">
          {/* Japanese / English Toggle */}
          <div className="flex items-center p-0.5 rounded-xl bg-white/90 border border-red-200/90 text-xs font-bold shadow-2xs">
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 text-[11px] cursor-pointer ${
                lang === 'en'
                  ? 'bg-[#B30D12] text-white shadow-2xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe2 size={11} />
              <span>EN</span>
            </button>
            <button
              onClick={() => setLang('jp')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 text-[11px] cursor-pointer ${
                lang === 'jp'
                  ? 'bg-[#B30D12] text-white shadow-2xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="font-japanese">日本語</span>
            </button>
          </div>

          {/* Download PDF button */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-red-50 text-slate-700 hover:text-slate-900 text-xs font-bold border border-red-200/90 shadow-2xs transition-colors cursor-pointer"
            title="Download executive PDF briefing document"
          >
            <Download size={13} className={isDownloading ? 'animate-bounce' : ''} />
            <span className="hidden sm:inline">
              {lang === 'en' ? 'Download brief (PDF)' : 'PDFダウンロード'}
            </span>
            <span className="sm:hidden">PDF</span>
          </button>

          {/* Share with Japan team button */}
          <button
            onClick={handleShare}
            disabled={isSharing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#B30D12] to-[#940B0F] hover:from-[#940B0F] hover:to-[#7A080C] text-white text-xs font-bold shadow-sm hover:shadow transition-all cursor-pointer active:scale-98"
            title="Send real-time alert to AutoHub Japan procurement team"
          >
            <Share2 size={13} className={isSharing ? 'animate-spin' : ''} />
            <span>
              {lang === 'en' ? 'Share with Japan team' : '日本チームへ送信'}
            </span>
          </button>
        </div>
      </div>

      {/* Main AI Body Text */}
      <div className="relative z-10 py-3">
        <div className="p-3.5 sm:p-4 rounded-xl bg-white/95 border border-red-200/80 shadow-2xs">
          <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-black text-[#B30D12] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B30D12] animate-ping"></span>
            <span>{lang === 'en' ? 'AUTONOMOUS SOURCING RECOMMENDATION' : 'AI自律仕入れ推奨'}</span>
          </div>
          <p className="text-xs sm:text-[13px] text-slate-800 font-semibold leading-relaxed">
            &ldquo;{brief.body}&rdquo;
          </p>
        </div>
      </div>

      {/* Recommended Sourcing Targets breakdown pills */}
      <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
            {lang === 'en' ? 'Actionable Targets:' : '調達推奨ターゲット:'}
          </span>
          {brief.targets.map((target, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-red-200/70 text-slate-800 shadow-2xs text-[11px]"
            >
              <span className="font-bold text-slate-900">{target.model}</span>
              <span className="px-1.5 py-0.2 rounded font-black text-[10px] bg-red-100 text-[#B30D12] border border-red-200">
                {target.recommendation}
              </span>
              <span className="text-[10px] text-slate-400 hidden md:inline">
                ({target.house})
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1 text-slate-400 text-[10px] shrink-0 font-medium">
          <Clock size={11} className="text-[#B30D12]" />
          <span>{brief.timestamp}</span>
        </div>
      </div>
    </div>
  );
}
