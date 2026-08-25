import { AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react";
import type { HistoryItem } from "@/lib/data";

const TONE_ICON: Record<HistoryItem["tone"], React.ReactNode> = {
  warning: <AlertTriangle className="h-4 w-4 text-[var(--color-warning)]" />,
  success: <TrendingUp className="h-4 w-4 text-[var(--color-success)]" />,
  info: <CheckCircle2 className="h-4 w-4 text-[var(--color-info)]" />,
};

export function HistoryList({
  items,
  title = "History",
  className = "",
}: {
  items: HistoryItem[];
  title?: string;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-4 ${className}`}
    >
      <h3 className="text-sm font-semibold text-[var(--color-ink)] px-1 mb-2">
        {title}
      </h3>
      <ul>
        {items.map((item, i) => (
          <li
            key={item.key}
            className={`flex items-center justify-between gap-3 px-1 py-3 ${
              i !== items.length - 1 ? "border-b border-black/5" : ""
            }`}
          >
            <div>
              <p className="text-sm font-semibold text-[var(--color-ink)]">
                {item.title}
              </p>
              <p className="text-xs text-[var(--color-muted)]">{item.description}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-[var(--color-muted-2)]">{item.time}</span>
              {TONE_ICON[item.tone]}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}