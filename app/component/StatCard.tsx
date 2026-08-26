import type { StatItem } from "@/lib/data";
import { StatIcon } from "./StatIcon";

const VARIANT_BG: Record<StatItem["variant"], string> = {
  primary: "bg-[var(--color-primary)] text-white",
  gold: "bg-[var(--color-gold)] text-white",
  red: "bg-[var(--color-red)] text-white",
  sage: "bg-[var(--color-primary-soft)] text-white",
};

export function StatTile({ stat }: { stat: StatItem }) {
  return (
    <div
      className={`relative flex flex-col justify-between rounded-[var(--radius-md)] p-4 h-28 ${VARIANT_BG[stat.variant]}`}
    >
      <StatIcon name={stat.icon} className="h-5 w-5 opacity-90" />
      <div>
        <p className="text-2xl font-bold leading-none">{stat.value}</p>
        <p className="text-xs mt-1 opacity-90">{stat.label}</p>
      </div>
    </div>
  );
}

export function StatRow({ stat }: { stat: StatItem }) {
  return (
    <div
      className={`rounded-[var(--radius-md)] p-4 shadow-sm ${VARIANT_BG[stat.variant]}`}
    >
      <div className="flex items-center gap-2 text-white/80 text-sm">
        <StatIcon name={stat.icon} className="h-4 w-4" />
        <span>{stat.label}</span>
      </div>
      <p className="text-2xl font-bold mt-1">{stat.value}</p>
      <div className="flex items-center justify-between mt-2">
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/20 text-white font-medium">
          {stat.status ?? "Normal"}
        </span>
        {stat.range && (
          <span className="text-[11px] text-white/70">{stat.range}</span>
        )}
      </div>
    </div>
  );
}