import type { StatItem, StatStatus } from "@/lib/data";
import { StatIcon } from "./StatIcon";

const STATUS_STYLE: Record<StatStatus, { bg: string; text: string; badge: string; iconCircle: boolean }> = {
  Normal: {
    bg: "bg-[var(--color-success)]",
    text: "text-white",
    badge: "bg-white/20 text-white",
    iconCircle: false,
  },
  Kurang: {
    bg: "bg-[var(--color-warning)]",
    text: "text-[#0D2D1E]",
    badge: "bg-black/10 text-[#0D2D1E]",
    iconCircle: false,
  },
  Tinggi: {
    bg: "bg-[var(--color-red)]",
    text: "text-white",
    badge: "bg-white/20 text-white",
    iconCircle: true,
  },
  "Belum tersedia": {
    bg: "bg-[var(--color-muted)]",
    text: "text-white",
    badge: "bg-white/20 text-white",
    iconCircle: false,
  },
};

function statusStyle(stat: StatItem) {
  return STATUS_STYLE[stat.status ?? "Normal"];
}

export function StatTile({ stat }: { stat: StatItem }) {
  const style = statusStyle(stat);

  return (
    <div
      className={`relative flex flex-col justify-between rounded-[14px] p-4 h-45 ${style.bg} ${style.text}`}
    >
      <div className="flex items-start justify-between gap-1">
        <span className="text-[25px] font-semibold leading-tight">{stat.label}</span>

        {style.iconCircle ? (
          <span className="h-6 w-6 shrink-0 rounded-full bg-white flex items-center justify-center">
            <StatIcon name={stat.icon} className="h-4 w-4 text-[var(--color-red)]" />
          </span>
        ) : (
          <StatIcon name={stat.icon} className="h-6 w-6 opacity-80 shrink-0" />
        )}
      </div>

      <p className="text-[28px] font-bold leading-none">{stat.value}</p>
    </div>
  );
}

export function StatRow({ stat }: { stat: StatItem }) {
  const style = statusStyle(stat);

  return (
    <div className={`rounded-[10px] p-4 shadow-sm ${style.bg} ${style.text}`}>
      <div className="flex items-center gap-2 opacity-80 text-sm">
        <StatIcon name={stat.icon} className="h-4 w-4" />
        <span>{stat.label}</span>
      </div>
      <p className="text-2xl font-bold mt-1">{stat.value}</p>
      <div className="flex items-center justify-between mt-2">
        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${style.badge}`}>
          {stat.status ?? "Normal"}
        </span>
        {stat.range && <span className="text-[11px] opacity-70">{stat.range}</span>}
      </div>
    </div>
  );
}