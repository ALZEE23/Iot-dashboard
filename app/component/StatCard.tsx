import type { StatItem } from "@/lib/data";
import { STATUS_STYLE } from "@/lib/statusStyle";
import { StatIcon } from "./StatIcon";

function statusStyle(stat: StatItem) {
  return STATUS_STYLE[stat.status ?? "Normal"];
}

export function StatTile({ stat }: { stat: StatItem }) {
  const style = statusStyle(stat);

  return (
    <div
      className={`relative flex min-w-0 flex-col justify-between overflow-hidden rounded-[14px] p-4 h-45 ${style.bg} ${style.text}`}
    >
      <div>
        {style.iconCircle ? (
          <span className="float-right ml-1 h-6 w-6 shrink-0 rounded-full bg-white flex items-center justify-center">
            <StatIcon name={stat.icon} className="h-4 w-4 text-[var(--color-red)]" />
          </span>
        ) : (
          <StatIcon name={stat.icon} className="float-right ml-1 h-6 w-6 opacity-80 shrink-0" />
        )}

        <span className="text-[17px] font-semibold leading-tight">{stat.label}</span>
      </div>

      <p className="wrap-break-word text-[24px] font-bold leading-none">{stat.value}</p>
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