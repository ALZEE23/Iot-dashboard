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
      className={`rounded-[10px] bg-[#0D2D1E] p-4 ${className}`}
    >
      <h3 className="text-xl font-bold text-white mb-3">Device Terhubung</h3>

      <ul className="space-y-3">
        {devices.map((d) => (
          <li
            key={d.key}
            className="flex items-center justify-between gap-3 rounded-2xl bg-[#B7C9B9] px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span
                className={`h-3 w-3 rounded-full ${
                  d.status === "Online" ? "bg-[#759C7F]" : "bg-[#A7A7A7]"
                }`}
              />
              <span className="text-base font-bold text-[#0D2D1E]">
                {d.name}
              </span>
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