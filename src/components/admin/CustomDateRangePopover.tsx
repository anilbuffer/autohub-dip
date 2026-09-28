"use client";

import React, { useState, useEffect, useRef } from "react";
import { Calendar, X, Check, Clock, RotateCcw, ArrowRight } from "lucide-react";

interface CustomDateRangePopoverProps {
  isOpen: boolean;
  onClose: () => void;
  startDate: string;
  endDate: string;
  onApply: (startDate: string, endDate: string) => void;
}

export function formatRangeLabel(startDateStr: string, endDateStr: string): string {
  if (!startDateStr || !endDateStr) return "Custom date";
  const [y1, m1, d1] = startDateStr.split("-").map(Number);
  const [y2, m2, d2] = endDateStr.split("-").map(Number);
  const dObj1 = new Date(y1, m1 - 1, d1);
  const dObj2 = new Date(y2, m2 - 1, d2);

  const m1Str = dObj1.toLocaleDateString("en-NZ", { month: "short" });
  const m2Str = dObj2.toLocaleDateString("en-NZ", { month: "short" });

  if (y1 === y2) {
    if (m1 === m2 && d1 === d2) {
      return `${d1} ${m1Str} ${y1}`;
    }
    return `${d1} ${m1Str} – ${d2} ${m2Str}`;
  }
  return `${d1} ${m1Str} ${y1} – ${d2} ${m2Str} ${y2}`;
}

export function formatFullDate(dateStr: string): string {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  const dateObj = new Date(y, m - 1, d);
  return dateObj.toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getDaysDifference(startStr: string, endStr: string): number {
  if (!startStr || !endStr) return 0;
  const [y1, m1, d1] = startStr.split("-").map(Number);
  const [y2, m2, d2] = endStr.split("-").map(Number);
  const date1 = new Date(y1, m1 - 1, d1);
  const date2 = new Date(y2, m2 - 1, d2);
  const diffTime = date2.getTime() - date1.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays + 1);
}

// System reference date for AutoHub DIP prototype: 28 September 2026
const REFERENCE_TODAY = "2026-09-28";

const PRESETS = [
  {
    label: "Last 7 days",
    start: "2026-09-21",
    end: "2026-09-28",
  },
  {
    label: "Last 14 days",
    start: "2026-09-14",
    end: "2026-09-28",
  },
  {
    label: "Last 30 days",
    start: "2026-08-29",
    end: "2026-09-28",
  },
  {
    label: "This Month (Sep)",
    start: "2026-09-01",
    end: "2026-09-28",
  },
  {
    label: "Last Month (Aug)",
    start: "2026-08-01",
    end: "2026-08-31",
  },
  {
    label: "Last 90 days",
    start: "2026-06-30",
    end: "2026-09-28",
  },
  {
    label: "Year to Date (2026)",
    start: "2026-01-01",
    end: "2026-09-28",
  },
];

export default function CustomDateRangePopover({
  isOpen,
  onClose,
  startDate,
  endDate,
  onApply,
}: CustomDateRangePopoverProps) {
  const [tempStart, setTempStart] = useState(startDate || "2026-08-01");
  const [tempEnd, setTempEnd] = useState(endDate || REFERENCE_TODAY);
  const [validationError, setValidationError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync state if opened with new props
  useEffect(() => {
    if (isOpen) {
      setTempStart(startDate || "2026-08-01");
      setTempEnd(endDate || REFERENCE_TODAY);
      setValidationError(null);
    }
  }, [isOpen, startDate, endDate]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const durationDays = getDaysDifference(tempStart, tempEnd);
  const isInvalid = !tempStart || !tempEnd || tempStart > tempEnd;

  const handleApply = () => {
    if (!tempStart || !tempEnd) {
      setValidationError("Please select both start and end dates.");
      return;
    }
    if (tempStart > tempEnd) {
      setValidationError("Start date cannot be after end date.");
      return;
    }
    setValidationError(null);
    onApply(tempStart, tempEnd);
  };

  const handlePresetSelect = (presetStart: string, presetEnd: string) => {
    setTempStart(presetStart);
    setTempEnd(presetEnd);
    setValidationError(null);
  };

  return (
    <div
      ref={containerRef}
      className="absolute right-0 top-full mt-2 w-[340px] sm:w-[390px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-4.5 z-50 animate-in fade-in zoom-in-95 duration-150 text-slate-800"
    >
      {/* Popover Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-50 text-[#B30D12] flex items-center justify-center font-bold">
            <Calendar size={14} />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 tracking-tight">
              Custom Date Range
            </h4>
            <p className="text-[10px] text-slate-400 font-medium">
              Filter demand telemetry and dealer signals
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-6 h-6 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          title="Close"
        >
          <X size={14} />
        </button>
      </div>

      {/* Preset Buttons */}
      <div className="mt-3 p-3">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span>Quick Presets</span>
          <span className="text-[9px] text-slate-400 font-normal">
            Ref: {formatFullDate(REFERENCE_TODAY)}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {PRESETS.map((p) => {
            const isSelected = tempStart === p.start && tempEnd === p.end;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => handlePresetSelect(p.start, p.end)}
                className={`px-2 py-1.5 rounded-lg text-[11px] font-bold transition-all text-left truncate cursor-pointer ${isSelected
                  ? "bg-[#B30D12] text-white shadow-2xs font-extrabold"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80"
                  }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Pickers (From / To) */}
      <div className="mt-3.5 p-3 pt-3 border-t border-slate-100">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
          Explicit Date Selection
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {/* Start Date */}
          <div>
            <label className="block text-[10px] font-bold text-slate-600 mb-1">
              Start Date (From)
            </label>
            <input
              type="date"
              value={tempStart}
              max={tempEnd || REFERENCE_TODAY}
              onChange={(e) => {
                setTempStart(e.target.value);
                setValidationError(null);
              }}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:bg-white focus:border-[#B30D12] outline-none cursor-pointer"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-[10px] font-bold text-slate-600 mb-1">
              End Date (To)
            </label>
            <input
              type="date"
              value={tempEnd}
              min={tempStart}
              max="2026-12-31"
              onChange={(e) => {
                setTempEnd(e.target.value);
                setValidationError(null);
              }}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:bg-white focus:border-[#B30D12] outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Selected Range Summary Box */}
      <div className="m-3 py-2 px-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
          <Clock size={13} className="text-[#B30D12]" />
          <span>Active Window:</span>
          <span className="font-extrabold text-slate-900">
            {isInvalid ? "Invalid range" : `${durationDays} ${durationDays === 1 ? "day" : "days"}`}
          </span>
        </div>
        {!isInvalid && (
          <span className="text-[11px] font-bold text-slate-500">
            {formatRangeLabel(tempStart, tempEnd)}
          </span>
        )}
      </div>

      {/* Validation Alert */}
      {validationError && (
        <div className="mt-2 text-xs font-bold text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
          {validationError}
        </div>
      )}

      {/* Popover Action Buttons */}
      <div className="flex items-center justify-between gap-2 mt-4 p-3 border-t border-slate-100">
        <button
          type="button"
          onClick={() => {
            setTempStart("2026-08-01");
            setTempEnd(REFERENCE_TODAY);
            setValidationError(null);
          }}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          title="Reset dates to initial custom window"
        >
          <RotateCcw size={11} />
          <span>Reset</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={isInvalid}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${isInvalid
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-[#B30D12] hover:bg-[#940B0F] text-white font-extrabold"
              }`}
          >
            <Check size={13} />
            <span>Apply range</span>
          </button>
        </div>
      </div>
    </div>
  );
}
