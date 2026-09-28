"use client";

import React, { useState } from "react";
import {
  FileText,
  X,
  Printer,
  CheckCircle2,
  Ship,
  ShieldCheck,
  Building2,
  Calendar,
  DollarSign,
  Copy,
  Download,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import { Vehicle } from "@/lib/data";
import { SyncState } from "@/lib/syncStore";
import PoTransmissionSuccessModal from "./PoTransmissionSuccessModal";

interface WrittenConfirmationPoModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  syncState: SyncState;
  onConfirmed?: (poNumber: string) => void;
}

export default function WrittenConfirmationPoModal({
  isOpen,
  onClose,
  vehicles,
  syncState,
  onConfirmed,
}: WrittenConfirmationPoModalProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>(() =>
    vehicles.map((v) => v.id)
  );
  const [isTransmitted, setIsTransmitted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync selectedIds when vehicles prop changes
  React.useEffect(() => {
    setSelectedIds(vehicles.map((v) => v.id));
  }, [vehicles]);

  if (!isOpen) return null;

  const poNumber = `PO-NZ-20260928-${vehicles.length > 0 ? vehicles[0].id : 101}`;
  const currentDate = new Date().toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const selectedVehicles = vehicles.filter((v) => selectedIds.includes(v.id));

  // Financial totals
  const totalFobJpy = selectedVehicles.reduce((sum, v) => sum + v.fobJpy, 0);
  const totalFobNzd = Math.round(totalFobJpy / syncState.fxRateJpyNzd);
  const totalFreightNzd = selectedVehicles.length * syncState.freightPerUnitNzd;
  const totalComplianceNzd = selectedVehicles.length * syncState.compliancePerUnitNzd;
  const totalGstNzd = Math.round((totalFobNzd + totalFreightNzd + totalComplianceNzd) * 0.15);
  const totalLandedNzd = totalFobNzd + totalFreightNzd + totalComplianceNzd + totalGstNzd;
  const totalEstRetailNzd = selectedVehicles.reduce((sum, v) => sum + v.estRetailNzd, 0);
  const totalEstimatedMargin = totalEstRetailNzd - totalLandedNzd;

  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === vehicles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(vehicles.map((v) => v.id));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleTransmit = () => {
    setIsTransmitted(true);
    setShowSuccessModal(true);
    if (onConfirmed) {
      onConfirmed(poNumber);
    }
  };

  const handleCopySummary = () => {
    const textSummary = `
AutoHub DIP × Heiwa Auto Japan - Purchase Order / Written Confirmation
PO Ref: ${poNumber} | Date: ${currentDate}
Buyer: Auckland Auto Group (LMVD #49821, Penrose, Auckland)
Supplier: Heiwa Auto Co., Ltd., Japan
Port of Discharge: Ports of Auckland (NZAKL)
Vessel: Direct Ro-Ro (Armacup / Toyofuji)

Units: ${selectedVehicles.length}
Total FOB: ¥${totalFobJpy.toLocaleString()} (≈ NZ$${totalFobNzd.toLocaleString()})
Total Landed Commitment: NZ$${totalLandedNzd.toLocaleString()}
Projected Total Margin: +NZ$${totalEstimatedMargin.toLocaleString()}
Applicable FX Benchmark: ¥${syncState.fxRateJpyNzd.toFixed(2)} / NZD

Selected Lots:
${selectedVehicles
  .map(
    (v, i) =>
      `${i + 1}. Lot #${v.lotNumber} | ${v.year} ${v.make} ${v.model} | Grade ${v.grade} | Landed: NZ$${v.landedNzd.toLocaleString()} | Margin: +NZ$${v.targetMarginNzd.toLocaleString()}`
  )
  .join("\n")}
    `.trim();

    navigator.clipboard.writeText(textSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 print:bg-white print:text-black print:border-b-2 print:border-slate-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#B30D12] to-[#80070B] flex items-center justify-center text-white font-black shadow-md print:border print:border-slate-800">
              <FileText size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white print:text-black">
                  Heiwa Auto Japan × AutoHub Written Confirmation
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    isTransmitted
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 print:text-emerald-700"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/40 print:text-amber-700"
                  }`}
                >
                  {isTransmitted ? "Transmitted to Heiwa Desk" : "Ready for Confirmation"}
                </span>
              </div>
              <p className="text-xs text-slate-300 print:text-slate-600 font-mono mt-0.5">
                Official Export Purchase Order · Ref: {poNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handleCopySummary}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1 font-semibold"
              title="Copy text summary"
            >
              <Copy size={15} />
              <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
            </button>
            <button
              onClick={handlePrint}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1 font-semibold"
              title="Print official PO"
            >
              <Printer size={15} />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 print:overflow-visible">
          {/* Success Banner if Transmitted */}
          {isTransmitted && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start justify-between gap-3 print:hidden">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-900">
                    Written Confirmation Transmitted to Heiwa Auto Japan
                  </h4>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Your purchase order reference <strong>{poNumber}</strong> has been logged with the Heiwa Japan Tokyo/Kobe export desk. A bilateral confirmation receipt has been dispatched to Auckland Auto Group.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSuccessModal(true)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 transition-colors shadow-xs cursor-pointer"
              >
                View Heiwa Receipt
              </button>
            </div>
          )}

          {/* Top Trading Parties & Terms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Buyer Details */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <Building2 size={13} className="text-slate-400" />
                <span>Buyer / Consignee (New Zealand)</span>
              </div>
              <div className="font-extrabold text-sm text-slate-900">
                Auckland Auto Group Limited
              </div>
              <div className="text-slate-600 space-y-0.5 leading-relaxed">
                <div>LMVD Registered Dealer: #49821</div>
                <div>142 Great South Road, Penrose, Auckland 1061</div>
                <div>Contact: David Chen (Head of Sourcing &amp; Bidding)</div>
                <div>Port of Discharge: <strong>Ports of Auckland (NZAKL)</strong></div>
              </div>
            </div>

            {/* Supplier Details */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <Ship size={13} className="text-[#B30D12]" />
                <span>Supplier / Exporter (Japan)</span>
              </div>
              <div className="font-extrabold text-sm text-slate-900">
                Heiwa Auto Co., Ltd.
              </div>
              <div className="text-slate-600 space-y-0.5 leading-relaxed">
                <div>Heiwa Building, Minato-ku, Kobe Port, Japan</div>
                <div>Japanese Auction Brokerage &amp; Export Division</div>
                <div>Shipping Logistics Partner: <strong>AutoHub New Zealand</strong></div>
                <div>Vessel Routing: Direct Ro-Ro (Armacup / Toyofuji Lines)</div>
              </div>
            </div>
          </div>

          {/* Sourcing Parameters & FX Benchmark Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-red-50/70 border border-red-100 rounded-xl text-xs">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  PO Issue Date
                </span>
                <span className="font-extrabold text-slate-900">{currentDate}</span>
              </div>
              <div className="h-6 w-px bg-red-200" />
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Benchmark FX Rate
                </span>
                <span className="font-extrabold text-slate-900 font-mono">
                  ¥{syncState.fxRateJpyNzd.toFixed(2)} JPY / NZD
                </span>
              </div>
              <div className="h-6 w-px bg-red-200" />
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Freight &amp; Compliance Rate
                </span>
                <span className="font-bold text-slate-900">
                  NZ${(syncState.freightPerUnitNzd + syncState.compliancePerUnitNzd).toLocaleString()} / unit
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-slate-600">
                Allocated stock: <strong>{selectedVehicles.length} of {vehicles.length}</strong>
              </span>
              <button
                onClick={handleSelectAll}
                className="text-xs font-bold text-[#B30D12] hover:underline cursor-pointer print:hidden"
              >
                {selectedIds.length === vehicles.length ? "Deselect All" : "Select All"}
              </button>
            </div>
          </div>

          {/* Vehicles Allocation Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100/90 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-3.5 py-3 w-8 text-center print:hidden">Select</th>
                    <th className="px-3.5 py-3">Vehicle Details</th>
                    <th className="px-3.5 py-3">Auction / Lot</th>
                    <th className="px-3.5 py-3">FOB JPY</th>
                    <th className="px-3.5 py-3">FOB NZD</th>
                    <th className="px-3.5 py-3">Freight &amp; MAF</th>
                    <th className="px-3.5 py-3">Total Landed</th>
                    <th className="px-3.5 py-3 text-right">Estimated Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {vehicles.map((v) => {
                    const isSelected = selectedIds.includes(v.id);
                    const fobNzd = Math.round(v.fobJpy / syncState.fxRateJpyNzd);
                    const landed = v.landedNzd;
                    const margin = v.targetMarginNzd;

                    return (
                      <tr
                        key={v.id}
                        className={`transition-colors ${
                          isSelected ? "bg-white" : "bg-slate-50/50 opacity-60"
                        }`}
                      >
                        <td className="px-3.5 py-3 text-center print:hidden">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(v.id)}
                            className="rounded text-[#B30D12] focus:ring-[#B30D12] cursor-pointer"
                          />
                        </td>
                        <td className="px-3.5 py-3">
                          <div className="font-black text-slate-900">
                            {v.year} {v.make} {v.model}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            Chassis: {v.chassis} · {v.km.toLocaleString()} km
                          </div>
                        </td>
                        <td className="px-3.5 py-3">
                          <div className="font-bold text-slate-800">{v.auctionHouse}</div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            Lot #{v.lotNumber} · Grade {v.grade}
                          </div>
                        </td>
                        <td className="px-3.5 py-3 font-mono font-bold text-slate-800">
                          ¥{v.fobJpy.toLocaleString()}
                        </td>
                        <td className="px-3.5 py-3 font-mono font-bold text-slate-800">
                          NZ${fobNzd.toLocaleString()}
                        </td>
                        <td className="px-3.5 py-3 font-mono text-slate-600">
                          NZ${(syncState.freightPerUnitNzd + syncState.compliancePerUnitNzd).toLocaleString()}
                        </td>
                        <td className="px-3.5 py-3 font-mono font-black text-slate-900">
                          NZ${landed.toLocaleString()}
                        </td>
                        <td className="px-3.5 py-3 font-mono font-black text-emerald-700 text-right">
                          +NZ${margin.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Totals Breakdown Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Total FOB Cost
              </span>
              <div className="text-sm sm:text-base font-black text-slate-900 font-mono mt-0.5">
                ¥{totalFobJpy.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-500 block font-medium">
                ≈ NZ${totalFobNzd.toLocaleString()}
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Logistics &amp; 15% GST
              </span>
              <div className="text-sm sm:text-base font-black text-slate-900 font-mono mt-0.5">
                NZ${(totalFreightNzd + totalComplianceNzd + totalGstNzd).toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-500 block font-medium">
                Ocean Ro-Ro &amp; Port fees
              </span>
            </div>

            <div className="p-3 bg-slate-900 text-white rounded-xl shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Landed Commitment
              </span>
              <div className="text-sm sm:text-base font-black text-[#FF6B6B] font-mono mt-0.5">
                NZ${totalLandedNzd.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-300 block font-medium">
                {selectedVehicles.length} Units All-Inclusive
              </span>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                Projected Net Margin
              </span>
              <div className="text-sm sm:text-base font-black text-emerald-700 font-mono mt-0.5">
                +NZ${totalEstimatedMargin.toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-700/80 block font-medium">
                {totalLandedNzd > 0 ? Math.round((totalEstimatedMargin / totalLandedNzd) * 100) : 0}% Projected Yield
              </span>
            </div>
          </div>

          {/* Heiwa Japan Terms & NZTA / MAF Biosecurity Clauses */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 uppercase text-[10px] tracking-wider">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Commercial Terms, Export Warranties &amp; Biosecurity Conditions</span>
            </div>
            <ul className="list-disc pl-4 space-y-1 text-slate-600 leading-relaxed">
              <li>
                <strong>Condition Guarantee:</strong> Heiwa Auto Co., Ltd. guarantees all selected units correspond directly to original Japanese auction inspection sheets (Grade 3.5 to 5.0) with verified odometer certifications.
              </li>
              <li>
                <strong>NZ MPI Biosecurity:</strong> Pre-export heat treatment and phytosanitary inspections performed at Kobe/Yokohama prior to Ro-Ro vessel loading.
              </li>
              <li>
                <strong>Landed Pricing &amp; Currency:</strong> Landed cost reflects live foreign exchange benchmark (¥{syncState.fxRateJpyNzd.toFixed(2)}/NZD). Final port settlement executed via AutoHub DIP clearance protocol.
              </li>
              <li>
                <strong>Estimated Transit / Indicative:</strong> Average ocean Ro-Ro transit is 18–22 calendar days port-to-port. Actual delivery dates are subject to maritime weather, shipping line scheduling, and Auckland biosecurity queue slots.
              </li>
            </ul>
          </div>

          {/* Signature Block (for Official PO Verification) */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs">
            <div className="space-y-4">
              <div className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                Authorized Dealer Representative
              </div>
              <div className="border-b border-slate-300 pb-1">
                <span className="font-serif italic text-base text-slate-800">David Chen</span>
              </div>
              <div className="text-[11px] text-slate-500">
                Auckland Auto Group · Penrose, NZ
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                Heiwa Auto Japan Export Desk
              </div>
              <div className="border-b border-slate-300 pb-1 flex items-center justify-between">
                <span className="font-serif italic text-base text-slate-800">Kenji Takahashi</span>
                <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1 rounded">STAMP VERIFIED</span>
              </div>
              <div className="text-[11px] text-slate-500">
                Heiwa Auto Co., Ltd. · Minato-ku, Kobe, Japan
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <AlertCircle size={14} className="text-slate-400" />
            <span>Indicative figures based on current NZ market data. Final bid decisions rest with the dealer.</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer size={13} />
              <span>Print PO Form</span>
            </button>
            <button
              onClick={() => {
                if (isTransmitted) {
                  setShowSuccessModal(true);
                } else {
                  handleTransmit();
                }
              }}
              disabled={selectedVehicles.length === 0}
              className={`px-5 py-2 rounded-xl text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ${
                isTransmitted
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-[#B30D12] hover:bg-[#940B0F] active:scale-[0.98]"
              }`}
            >
              <CheckCircle2 size={14} />
              <span>{isTransmitted ? "View Transmission Receipt" : "Confirm & Transmit PO to Heiwa"}</span>
            </button>
          </div>
        </div>

        {/* Heiwa PO Transmission Confirmation Modal */}
        <PoTransmissionSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          poNumber={poNumber}
          vehicles={selectedVehicles.length > 0 ? selectedVehicles : vehicles}
          syncState={syncState}
          onViewPoDocument={() => setShowSuccessModal(false)}
          onCompleteAndExit={() => {
            setShowSuccessModal(false);
            onClose();
          }}
        />
      </div>
    </div>
  );
}
