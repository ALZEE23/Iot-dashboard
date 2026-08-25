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
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-xl font-bold text-[var(--color-ink)]">
        Hidro<span className="font-light">Track</span>
      </h1>

      <nav className="flex items-center gap-1 rounded-full bg-white p-1 shadow-sm">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onChange?.(tab)}
            aria-current={tab === active ? "page" : undefined}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              tab === active
                ? "bg-[var(--color-primary)] text-white"
                : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <span className="text-xs text-[var(--color-muted)] text-right leading-tight">
          Kamis, 10 Sep 2026
          <br />
          09.37
        </span>
        <button
          aria-label="Notifikasi"
          className="h-9 w-9 rounded-full bg-white shadow-sm flex items-center justify-center"
        >
          <Bell className="h-4 w-4 text-[var(--color-ink)]" />
        </button>
        <div className="h-9 w-9 rounded-full bg-[var(--color-primary)]" />
      </div>
    </div>
  );
}