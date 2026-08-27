import { Bell } from "lucide-react";

export const TABS = ["Overview", "Analytics", "Monitoring", "Perangkat"] as const;
export type Tab = (typeof TABS)[number];

export function Navbar({
  active = "Overview",
  onChange,
}: {
  active?: Tab;
  onChange?: (tab: Tab) => void;
}) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-[#0D2D1E] px-6 py-3">
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
        <button aria-label="Notifikasi" className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center">
          <Bell className="h-4 w-4 text-white" />
        </button>
        <div className="h-9 w-9 rounded-full bg-white" />
        <div className="flex flex-col items-end leading-tight text-xs">
          <span className="text-white font-semibold mb-2">Kamis, 10 Sep 2026</span>
          <span className="text-white/60">09.37 WIB</span>
        </div>
      </div>
    </div>
  );
}