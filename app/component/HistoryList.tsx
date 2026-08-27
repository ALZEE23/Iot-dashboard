import { AlertTriangle, TrendingUp, LucideIcon } from "lucide-react";
import type { HistoryItem } from "@/lib/data";

type ToneMeta = {
  icon: LucideIcon | null;
  iconColor: string;
  bg: string;
  border?: string;
};

const TONE_META: Record<HistoryItem["tone"], ToneMeta> = {
  warning: {
    icon: AlertTriangle,
    iconColor: "text-[#C85A5C]",
    bg: "bg-white",
    border: "border border-[#C85A5C]/50",
  },
  alert: {
    icon: null,
    iconColor: "text-[#C8BD5A]",
    bg: "bg-[#E7EFDA]",
  },
  success: {
    icon: TrendingUp,
    iconColor: "text-[#0D2D1E]",
    bg: "bg-white/20",
  },
  info: {
    icon: TrendingUp,
    iconColor: "text-[#0D2D1E]",
    bg: "bg-white/20",
  },
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
      className={`rounded-[10px] bg-[#779B7F] p-4 ${className}`}
    >
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>

      <ul className="space-y-3">
        {items.map((item) => {
          const meta = TONE_META[item.tone];
          const Icon = meta.icon;
          return (
            <li
              key={item.key}
              className="flex items-start justify-between gap-3 rounded-2xl bg-[#B7C9B9] px-4 py-3"
            >
              <div>
                <p className="text-base font-bold text-[#0D2D1E]">
                  {item.title}
                </p>
                <p className="text-sm text-[#0D2D1E]/80 mt-0.5">
                  {item.description}
                </p>
              </div>
              <div className="flex flex-col items-center gap-1 shrink-0">
                <span
                  className={`h-9 w-9 rounded-full flex items-center justify-center ${meta.bg} ${meta.border ?? ""}`}
                >
                  {Icon ? (
                    <Icon className={`h-4 w-4 ${meta.iconColor}`} />
                  ) : (
                    <span className={`font-bold ${meta.iconColor}`}>!</span>
                  )}
                </span>
                <span className="text-xs text-[#0D2D1E]/70">{item.time}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}