"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  ShieldCheck,
  Ship,
  FileText,
  Copy,
  Printer,
  Download,
  X,
  Clock,
  ArrowRight,
  Radio,
  Send,
  Calendar,
  Building2,
  Check,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Award,
  Layers,
  MapPin,
  Anchor
} from "lucide-react";
import { Vehicle } from "@/lib/data";
import { SyncState } from "@/lib/syncStore";

interface PoTransmissionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  poNumber: string;
  vehicles: Vehicle[];
  syncState: SyncState;
  onViewPoDocument?: () => void;
  onCompleteAndExit?: () => void;
}

export default function PoTransmissionSuccessModal({
  isOpen,
  onClose,
  poNumber,
  vehicles,
  syncState,
  onViewPoDocument,
  onCompleteAndExit,
}: PoTransmissionSuccessModalProps) {
  const [isTransmitting, setIsTransmitting] = useState(true);
  const [transmissionStep, setTransmissionStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [ediToken] = useState(() => `HEIWA-EDI-${Math.floor(100000 + Math.random() * 900000)}-KOBE`);
  const [timestampStr] = useState(() => {
    const now = new Date();
    return now.toLocaleString("en-NZ", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short"
    });
  });

  // Transmission handshake sequence simulation (1.2 seconds)
  useEffect(() => {
    if (!isOpen) {
      setIsTransmitting(true);
      setTransmissionStep(1);
      return;
    }

    const t1 = setTimeout(() => setTransmissionStep(2), 300);
    const t2 = setTimeout(() => setTransmissionStep(3), 650);
    const t3 = setTimeout(() => setTransmissionStep(4), 1000);
    const t4 = setTimeout(() => {
      setTransmissionStep(5);
      setIsTransmitting(false);
    }, 1300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const primaryVehicle = vehicles[0] || null;

  // Financial totals
  const totalFobJpy = vehicles.reduce((sum, v) => sum + (v.fobJpy || v.jpy_fob || 0), 0);
  const totalFobNzd = Math.round(totalFobJpy / (syncState?.fxRateJpyNzd || 88.42));
  const totalFreightNzd = vehicles.length * (syncState?.freightPerUnitNzd || 1950);
  const totalComplianceNzd = vehicles.length * (syncState?.compliancePerUnitNzd || 850);
  const totalGstNzd = Math.round((totalFobNzd + totalFreightNzd + totalComplianceNzd) * 0.15);
  const totalLandedNzd = totalFobNzd + totalFreightNzd + totalComplianceNzd + totalGstNzd;
  const totalEstRetailNzd = vehicles.reduce((sum, v) => sum + (v.estRetailNzd || 0), 0);
  const totalEstimatedMargin = totalEstRetailNzd > totalLandedNzd ? totalEstRetailNzd - totalLandedNzd : 4800;

  const handleCopyPoRef = () => {
    navigator.clipboard.writeText(poNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyEdiToken = () => {
    navigator.clipboard.writeText(ediToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleCopyFullReceipt = () => {
    const summary = `
=====================================================
AUTOHUB DIP × HEIWA AUTO JAPAN - EDI DISPATCH RECEIPT
=====================================================
PO Reference:        ${poNumber}
Heiwa EDI Token:     ${ediToken}
Status:              ACKNOWLEDGED & EXPORT RESERVED
Transmission Date:   ${timestampStr}
Protocol:            EDI 256-bit Bilateral Dispatch (v2.4)

BUYER (NEW ZEALAND):
Auckland Auto Group (LMVD #49821)
62 Great South Road, Penrose, Auckland 1061
Authorized Rep: David Chen

EXPORTER (JAPAN):
Heiwa Auto Co., Ltd.
Minato-ku, Kobe, Hyogo 650-0033, Japan
Export Operations Desk: Kenji Takahashi

VEHICLE SUMMARY (${vehicles.length} unit${vehicles.length > 1 ? 's' : ''}):
${vehicles.map((v, i) => `[${i + 1}] Lot #${v.lotNumber} | ${v.year} ${v.make} ${v.model} ${v.badge || ''} | VIN: ${v.vin || v.chassis} | Grade: ${v.grade} | Landed NZ$: $${(v.landedNzd || totalLandedNzd).toLocaleString()}`).join('\n')}

FINANCIALS:
Total FOB JPY:       ¥${totalFobJpy.toLocaleString()} (≈ NZ$${totalFobNzd.toLocaleString()} @ ¥${(syncState?.fxRateJpyNzd || 88.42).toFixed(2)}/NZD)
Total Landed Commitment: NZ$${totalLandedNzd.toLocaleString()}
Projected Net Margin:    +NZ$${totalEstimatedMargin.toLocaleString()}

SHIPPING & BIOSECURITY:
Ro-Ro Carrier:       Toyofuji Lines / Armacup Maritime
Port of Loading:     Port of Kobe (Rokko Island), Japan
Port of Discharge:   Ports of Auckland (NZAKL), New Zealand
Est. Ro-Ro Voyage:   ETD 04 Oct 2026 ➔ ETA 24 Oct 2026
Biosecurity:         MPI Pre-Export Heat Treatment & Phytosanitary Clear
=====================================================
`.trim();
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Animated Background Mesh Header */}
        <div className="relative bg-gradient-to-r from-slate-950 via-slate-900 to-[#101b2f] text-white p-5 sm:p-6 border-b border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(#B30D12_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
          
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative flex items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black shadow-lg shadow-emerald-950/50">
                  {isTransmitting ? (
                    <Radio size={22} className="animate-spin text-white" />
                  ) : (
                    <CheckCircle2 size={24} className="text-white animate-in zoom-in-50 duration-300" />
                  )}
                </div>
                {!isTransmitting && (
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-900" />
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {isTransmitting ? "EDI Handshake In Progress" : "Bilateral EDI Confirmed"}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    AutoHub DIP × Heiwa Auto Japan
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight mt-1">
                  {isTransmitting ? "Transmitting PO to Heiwa Auto Japan..." : "Purchase Order Transmitted Successfully"}
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Official written export commitment registered for Lot #{primaryVehicle?.lotNumber || "1163311"}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors cursor-pointer shrink-0"
              title="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-800 bg-slate-50/50">
          
          {/* Real-time Handshake Visualizer if Transmitting */}
          {isTransmitting ? (
            <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span className="flex items-center gap-2">
                  <Send size={14} className="text-[#B30D12] animate-pulse" />
                  Secure EDI Dispatch Pipeline
                </span>
                <span className="font-mono text-emerald-600">
                  Step {transmissionStep} of 5
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/80">
                <div
                  className="bg-gradient-to-r from-[#B30D12] via-amber-500 to-emerald-500 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${(transmissionStep / 5) * 100}%` }}
                />
              </div>

              <div className="space-y-2 text-xs font-medium">
                <div className={`flex items-center gap-2 transition-colors ${transmissionStep >= 1 ? 'text-slate-800' : 'text-slate-400'}`}>
                  {transmissionStep > 1 ? <Check size={14} className="text-emerald-600 shrink-0" /> : <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin shrink-0" />}
                  <span>Formatting bilateral Purchase Order specification payload ({poNumber})</span>
                </div>
                <div className={`flex items-center gap-2 transition-colors ${transmissionStep >= 2 ? 'text-slate-800' : 'text-slate-400'}`}>
                  {transmissionStep > 2 ? <Check size={14} className="text-emerald-600 shrink-0" /> : transmissionStep === 2 ? <div className="w-3.5 h-3.5 border-2 border-[#B30D12] border-t-transparent rounded-full animate-spin shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />}
                  <span>Encrypted 256-bit handshake with Heiwa Auto Japan (Kobe Operations Desk)</span>
                </div>
                <div className={`flex items-center gap-2 transition-colors ${transmissionStep >= 3 ? 'text-slate-800' : 'text-slate-400'}`}>
                  {transmissionStep > 3 ? <Check size={14} className="text-emerald-600 shrink-0" /> : transmissionStep === 3 ? <div className="w-3.5 h-3.5 border-2 border-[#B30D12] border-t-transparent rounded-full animate-spin shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />}
                  <span>Locking ocean Ro-Ro manifest allocation (Toyofuji Lines / Armacup)</span>
                </div>
                <div className={`flex items-center gap-2 transition-colors ${transmissionStep >= 4 ? 'text-slate-800' : 'text-slate-400'}`}>
                  {transmissionStep > 4 ? <Check size={14} className="text-emerald-600 shrink-0" /> : transmissionStep === 4 ? <div className="w-3.5 h-3.5 border-2 border-[#B30D12] border-t-transparent rounded-full animate-spin shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />}
                  <span>Registering NZ MPI Biosecurity Pre-Inspection queue slot at Kobe port</span>
                </div>
                <div className={`flex items-center gap-2 transition-colors ${transmissionStep >= 5 ? 'text-slate-800' : 'text-slate-400'}`}>
                  {transmissionStep >= 5 ? <Check size={14} className="text-emerald-600 shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />}
                  <span>Bilateral EDI export acknowledgment receipt generation</span>
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => setIsTransmitting(false)}
                  className="text-[11px] font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  Skip animation &amp; view confirmation receipt
                </button>
              </div>
            </div>
          ) : (
            /* Transmitted Confirmed State Content */
            <>
              {/* Reference Audit Bar */}
              <div className="p-4 bg-white border border-emerald-200/80 rounded-2xl shadow-xs space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                      Export Order Confirmed &amp; Logged
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    {timestampStr}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* PO Reference */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Official PO Reference
                      </span>
                      <span className="font-mono font-extrabold text-slate-900 text-sm">
                        {poNumber}
                      </span>
                    </div>
                    <button
                      onClick={handleCopyPoRef}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                      title="Copy PO Number"
                    >
                      {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    </button>
                  </div>

                  {/* EDI Token */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Heiwa EDI Acknowledgment
                      </span>
                      <span className="font-mono font-extrabold text-emerald-700 text-sm">
                        {ediToken}
                      </span>
                    </div>
                    <button
                      onClick={handleCopyEdiToken}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                      title="Copy EDI Token"
                    >
                      {copiedToken ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Vehicle & Commitment Card */}
              {primaryVehicle && (
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Target Export Vehicle
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#B30D12]/10 text-[#B30D12] border border-[#B30D12]/20">
                      Lot #{primaryVehicle.lotNumber} · {primaryVehicle.auctionHouse || "CAA Chubu"}
                    </span>
                  </div>

                  <div className="flex items-start gap-3.5">
                    {/* Vehicle Image Thumbnail */}
                    <div className="w-20 h-16 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0 relative">
                      {primaryVehicle.image ? (
                        <img
                          src={primaryVehicle.image}
                          alt={primaryVehicle.model}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400 font-bold text-xs">
                          {primaryVehicle.make}
                        </div>
                      )}
                      <div className="absolute top-1 left-1 px-1 bg-slate-900/80 text-white text-[9px] font-black rounded">
                        G{primaryVehicle.grade}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-slate-900 truncate">
                        {primaryVehicle.year} {primaryVehicle.make} {primaryVehicle.model} {primaryVehicle.badge || ""}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        Chassis: <span className="font-mono text-slate-700 font-semibold">{primaryVehicle.vin || primaryVehicle.chassis}</span> • {(primaryVehicle.km || primaryVehicle.kms * 1000).toLocaleString()} km
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                          Grade {primaryVehicle.grade} / Int {primaryVehicle.interiorGrade || "A"}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                          {primaryVehicle.color} • {primaryVehicle.engine || `${primaryVehicle.cc}cc`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Financial Commitment Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">FOB JPY</span>
                      <span className="font-mono font-black text-slate-900 text-sm">
                        ¥{totalFobJpy.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-500 block">≈ NZ${totalFobNzd.toLocaleString()}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Landed NZD</span>
                      <span className="font-mono font-black text-[#B30D12] text-sm">
                        NZ${totalLandedNzd.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-500 block">All-inclusive port</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Est. Retail</span>
                      <span className="font-mono font-black text-slate-900 text-sm">
                        NZ${totalEstRetailNzd.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-500 block">Current market</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Proj. Margin</span>
                      <span className="font-mono font-black text-emerald-700 text-sm">
                        +NZ${totalEstimatedMargin.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-emerald-600/80 block">Dealer net yield</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Heiwa Shipping & Biosecurity Pipeline */}
              <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Ship size={15} className="text-blue-600" />
                    <span>Heiwa Japan Ro-Ro &amp; Biosecurity Pipeline</span>
                  </div>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    Armacup / Toyofuji Direct Ro-Ro
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  {/* Origin */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[10px] uppercase">
                      <MapPin size={11} className="text-[#B30D12]" />
                      <span>Loading Port</span>
                    </div>
                    <div className="font-extrabold text-slate-900">
                      Port of Kobe, Japan
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Rokko Island Export Terminal
                    </div>
                  </div>

                  {/* Voyage Schedule */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[10px] uppercase">
                      <Calendar size={11} className="text-amber-600" />
                      <span>Sailing Schedule</span>
                    </div>
                    <div className="font-extrabold text-slate-900">
                      ETD 04 Oct ➔ ETA 24 Oct
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Approx. 20 calendar days transit
                    </div>
                  </div>

                  {/* Discharge & Biosecurity */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[10px] uppercase">
                      <Anchor size={11} className="text-emerald-600" />
                      <span>Discharge Port &amp; MPI</span>
                    </div>
                    <div className="font-extrabold text-slate-900">
                      Ports of Auckland (NZAKL)
                    </div>
                    <div className="text-[11px] text-emerald-700 font-medium">
                      MPI Heat Treatment Pre-cleared
                    </div>
                  </div>
                </div>
              </div>

              {/* Bilateral Entities Confirmation */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-4 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Buyer (NZ)</span>
                  <span className="font-extrabold text-slate-900 block">Auckland Auto Group</span>
                  <span className="text-[11px] text-slate-500">LMVD #49821 · Rep: David Chen</span>
                </div>

                <div className="h-8 w-px bg-slate-200" />

                <div className="space-y-0.5 text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Supplier (Japan)</span>
                  <span className="font-extrabold text-slate-900 block">Heiwa Auto Co., Ltd.</span>
                  <span className="text-[11px] text-emerald-700 font-semibold">Desk: Kenji Takahashi [STAMP VERIFIED]</span>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Modal Action Footer */}
        <div className="px-5 sm:px-6 py-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyFullReceipt}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Copy EDI Receipt summary"
            >
              {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
              <span>{copied ? "Receipt Copied!" : "Copy Receipt"}</span>
            </button>

            <button
              onClick={handlePrintReceipt}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Print official receipt"
            >
              <Printer size={13} />
              <span>Print Receipt</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            {onViewPoDocument && (
              <button
                onClick={onViewPoDocument}
                className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileText size={13} className="text-amber-500" />
                <span>Review Full PO Form</span>
              </button>
            )}

            <button
              onClick={() => {
                if (onCompleteAndExit) {
                  onCompleteAndExit();
                } else {
                  onClose();
                }
              }}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
            >
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>Done &amp; Return</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
