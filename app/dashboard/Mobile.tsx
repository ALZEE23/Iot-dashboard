import { Bell } from "lucide-react";
import { HistoryList } from "../component/HistoryList";
import { StatTile } from "../component/StatCard";
import { DeviceList } from "../component/DeviceList";
import { mobileStats, historyItems, devices } from "@/lib/data";

export function Mobile() {
  return (
    <div className="lg:hidden min-h-dvh bg-[var(--color-bg)] px-4 pt-6 pb-10 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-[var(--color-muted)]">Kamis, 10 September 2026</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[var(--color-muted)]">09.37</span>
          <button
            aria-label="Notifikasi"
            className="h-9 w-9 rounded-full bg-[var(--color-ink)] flex items-center justify-center"
          >
            <Bell className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>

      <div className="rounded-[var(--radius-lg)] bg-[var(--color-primary)] text-white p-5">
        <h1 className="text-2xl font-bold">
          Hidro<span className="font-light">Track</span>
        </h1>
        <p className="text-sm mt-2 text-white/90 max-w-[85%]">
          Halo, sahabat lingkungan! Ingin melihat bagaimana tanamanmu tumbuh sehat?
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {mobileStats.map((stat) => (
          <StatTile key={stat.key} stat={stat} />
        ))}
      </div>

      <HistoryList items={historyItems} />
      <DeviceList devices={devices} />
    </div>
  );
}