"use client";

import type { ConnectionSource } from "@/lib/sensorTypes";
import { ConnectionBadge } from "./ConnectionBadge";
import { StatusLegendButton } from "./StatusLegend";
import { formatClockDate, formatClockTime } from "@/lib/data";
import { useLiveClock } from "@/lib/useLiveClock";

export const TABS = ["Overview", "Analytics", "Monitoring", "Perangkat"] as const;
export type Tab = (typeof TABS)[number];

export function Navbar({
  active = "Overview",
  onChange,
  isOnline = false,
  source = null,
}: {
  active?: Tab;
  onChange?: (tab: Tab) => void;
  isOnline?: boolean;
  source?: ConnectionSource;
}) {
  const now = useLiveClock();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#0D2D1E] px-6 py-3">
      <div className="flex max-w-6xl mx-auto items-center justify-between">
        <h1 className="text-xl font-bold">
          <span className="text-[#E7EFDA]">Hidro</span>
          <span className="text-[#3D5F3E]">Track</span>
        </h1>

        <nav className="flex items-center gap-1 rounded-full bg-[#3D5F3E]/40 p-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onChange?.(tab)}
              aria-current={tab === active ? "page" : undefined}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                tab === active
                  ? "bg-[#E7EFDA] text-[#0D2D1E]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ConnectionBadge isOnline={isOnline} source={source} className="text-white/80" />
          <StatusLegendButton className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center" />
          <div className="flex flex-col items-end leading-tight text-xs">
            <span className="text-white font-semibold mb-2">{now ? formatClockDate(now) : "—"}</span>
            <span className="text-white/60">{now ? `${formatClockTime(now)} WIB` : "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}