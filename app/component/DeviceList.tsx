import type { DeviceItem } from "@/lib/data";

export function DeviceList({
  devices,
  className = "",
}: {
  devices: DeviceItem[];
  className?: string;
}) {
  return (
    <section
      className={`rounded-[var(--radius-lg)] bg-[var(--color-ink)] text-white p-4 ${className}`}
    >
      <h3 className="text-sm font-semibold px-1 mb-2">Device Terhubung</h3>
      <ul>
        {devices.map((d, i) => (
          <li
            key={d.key}
            className={`flex items-center justify-between gap-3 px-1 py-3 ${
              i !== devices.length - 1 ? "border-b border-white/10" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  d.status === "Online" ? "bg-[var(--color-success)]" : "bg-white/30"
                }`}
              />
              <span className="text-sm">{d.name}</span>
            </div>
            <span className="text-xs text-white/60">{d.lastSeen}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}