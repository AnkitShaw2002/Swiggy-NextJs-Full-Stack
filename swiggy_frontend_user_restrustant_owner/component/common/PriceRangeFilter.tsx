"use client";

import { useState } from "react";
import { IndianRupee, RotateCcw } from "lucide-react";

export interface PriceRangeValue {
  min: string;
  max: string;
}

interface PriceRangeFilterProps {
  bounds: { min: number; max: number };
  value: PriceRangeValue;
  onApply: (min: string, max: string) => void;
  onReset: () => void;
}

export default function PriceRangeFilter({
  bounds,
  value,
  onApply,
  onReset,
}: PriceRangeFilterProps) {
  const [draftMin, setDraftMin] = useState(value.min);
  const [draftMax, setDraftMax] = useState(value.max);

  const span = Math.max(1, bounds.max - bounds.min);

  const clamp = (raw: string, fallback: number) => {
    const parsed = Number(raw);
    if (raw === "" || Number.isNaN(parsed)) return fallback;
    return Math.min(Math.max(parsed, bounds.min), bounds.max);
  };

  const sliderMin = clamp(draftMin, bounds.min);
  const sliderMax = clamp(draftMax, bounds.max);
  const pct = (v: number) => ((v - bounds.min) / span) * 100;

  const isActive = value.min !== "" || value.max !== "";
  const dirty = draftMin !== value.min || draftMax !== value.max;

  const handleSliderMin = (next: number) => {
    setDraftMin(String(Math.min(next, sliderMax)));
  };

  const handleSliderMax = (next: number) => {
    setDraftMax(String(Math.max(next, sliderMin)));
  };

  const apply = () => {
    if (draftMin === "" && draftMax === "") {
      onApply("", "");
      return;
    }
    const rawLo = Math.round(clamp(draftMin, bounds.min));
    const rawHi = Math.round(clamp(draftMax, bounds.max));
    const [lo, hi] = rawLo <= rawHi ? [rawLo, rawHi] : [rawHi, rawLo];
    setDraftMin(String(lo));
    setDraftMax(String(hi));
    onApply(String(lo), String(hi));
  };

  const reset = () => {
    setDraftMin("");
    setDraftMax("");
    onReset();
  };

  const minZ = sliderMin > bounds.max - span * 0.1 ? 4 : 5;
  const maxZ = sliderMax < bounds.min + span * 0.1 ? 4 : 5;

  const thumbBase =
    "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none " +
    "[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full " +
    "[&::-webkit-slider-thumb]:bg-[#fc8019] [&::-webkit-slider-thumb]:border-2 " +
    "[&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md " +
    "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 " +
    "[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#fc8019] " +
    "[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white";

  const inputClass =
    "w-16 text-xs font-semibold text-gray-700 outline-none placeholder:text-gray-400 placeholder:font-medium [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none";

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 flex flex-wrap items-center gap-x-4 gap-y-3">
      <span className="text-xs font-bold text-gray-800 whitespace-nowrap">Price Range</span>

      {/* Dual slider */}
      <div className="relative h-6 min-w-[180px] flex-1 sm:max-w-xs">
        <div className="absolute top-1/2 -translate-y-1/2 h-1.5 w-full rounded-full bg-gray-200" />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-[#fc8019]"
          style={{ left: `${pct(sliderMin)}%`, right: `${100 - pct(sliderMax)}%` }}
        />
        <input
          type="range"
          aria-label="Minimum price slider"
          min={bounds.min}
          max={bounds.max}
          step={1}
          value={sliderMin}
          onChange={(e) => handleSliderMin(Number(e.target.value))}
          className={`absolute inset-x-0 top-0 h-6 w-full appearance-none bg-transparent cursor-pointer pointer-events-none z-[var(--z)] [&::-webkit-slider-runnable-track]:bg-transparent ${thumbBase}`}
          style={{ zIndex: minZ }}
        />
        <input
          type="range"
          aria-label="Maximum price slider"
          min={bounds.min}
          max={bounds.max}
          step={1}
          value={sliderMax}
          onChange={(e) => handleSliderMax(Number(e.target.value))}
          className={`absolute inset-x-0 top-0 h-6 w-full appearance-none bg-transparent cursor-pointer pointer-events-none ${thumbBase}`}
          style={{ zIndex: maxZ }}
        />
      </div>

      {/* Number inputs */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 border border-gray-200 rounded-xl px-2 py-1.5 focus-within:border-[#fc8019] transition">
          <IndianRupee className="w-3.5 h-3.5 text-gray-400" />
          <input
            type="number"
            min={bounds.min}
            max={bounds.max}
            placeholder="Min"
            aria-label="Minimum price"
            value={draftMin}
            onChange={(e) => setDraftMin(e.target.value)}
            className={inputClass}
          />
        </div>
        <span className="text-xs text-gray-300">–</span>
        <div className="flex items-center gap-1 border border-gray-200 rounded-xl px-2 py-1.5 focus-within:border-[#fc8019] transition">
          <IndianRupee className="w-3.5 h-3.5 text-gray-400" />
          <input
            type="number"
            min={bounds.min}
            max={bounds.max}
            placeholder="Max"
            aria-label="Maximum price"
            value={draftMax}
            onChange={(e) => setDraftMax(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 ml-auto">
        <button
          onClick={apply}
          disabled={!dirty}
          className="px-4 py-2 rounded-xl bg-[#fc8019] hover:bg-[#e06f12] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition shadow-sm shadow-orange-200"
        >
          Apply
        </button>
        {isActive && (
          <button
            onClick={reset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
