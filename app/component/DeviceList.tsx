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
      className={`flex flex-col rounded-[10px] bg-[#0D2D1E] p-4 ${className}`}
    >
      <h3 className="text-xl font-bold text-white mb-3 shrink-0">Device Terhubung</h3>

      {devices.length === 0 && (
        <p className="text-sm text-white/60">Belum ada device yang terdeteksi.</p>
      )}

      <ul className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
        {devices.map((d) => (
          <li
            key={d.key}
            className="flex items-center justify-between gap-3 rounded-2xl bg-[#B7C9B9] px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span
                className={`h-3 w-3 rounded-full shrink-0 ${
                  d.status === "Online" ? "bg-[#759C7F]" : "bg-[#A7A7A7]"
                }`}
              />
              <div className="min-w-0">
                <p className="text-base font-bold text-[#0D2D1E] truncate">{d.name}</p>
                {d.ip && <p className="text-xs text-[#0D2D1E]/60 truncate">{d.ip}</p>}
              </div>
            </div>
            <span className="text-sm font-semibold text-[#0D2D1E]/80">
              {d.lastSeen}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}