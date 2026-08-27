import { HistoryList } from "../component/HistoryList";
import { StatTile } from "../component/StatCard";
import { DeviceList } from "../component/DeviceList";
import { mobileStats, historyItems, devices } from "@/lib/data";

export function Mobile() {
  return (
    <div className="lg:hidden min-h-dvh bg-[var(--color-bg)] px-4 pt-6 pb-10 space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-14 w-14 rounded-full bg-[var(--color-ink)]" />
        <div className="flex items-center gap-2.5">
          <div className="h-14 w-14 rounded-[10px] bg-[var(--color-ink)]" />
          <div className="h-14 w-14 rounded-[10px] bg-[var(--color-ink)]" />
        </div>
      </div>

      <div className="flex items-center justify-between px-0.5">
        <p className="text-sm font-semibold text-[var(--color-ink)]">Kamis, 10 September 2026</p>
        <span className="text-sm font-semibold text-[var(--color-ink)]">09.37</span>
      </div>

      <div className="rounded-[10px] bg-[var(--color-primary)] h-60 text-white overflow-hidden flex flex-col">
        <div className="p-5 pb-6 flex-1">
          <h1 className="text-2xl font-extrabold">
            <span className="text-[#E7EFDA]">Hidro</span>
            <span className="text-[#0D2D1E]">Track</span>
          </h1>
          <p className="text-md mt-3 font-semibold text-white/90 leading-snug max-w-[90%]">
            Halo, sahabat lingkungan!
            <br />
            ingin melihat bagaimana tanaman mu tumbuh sehat ?
          </p>
        </div>
        <div className="h-12 bg-[var(--color-primary-soft)]" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {mobileStats.map((stat) => (
          <StatTile key={stat.key} stat={stat} />
        ))}
      </div>

      <HistoryList items={historyItems} />
      <DeviceList devices={devices} />
    </div>
  );
}