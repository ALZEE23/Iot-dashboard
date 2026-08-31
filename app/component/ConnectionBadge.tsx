import type { ConnectionSource } from "@/lib/sensorTypes";

function sourceLabel(source: ConnectionSource): string {
  if (source === "mqtt") return "MQTT";
  if (source === "local") return "Lokal (WiFi ESP32)";
  return "Offline";
}

export function ConnectionBadge({
  isOnline,
  source,
  className = "",
}: {
  isOnline: boolean;
  source: ConnectionSource;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${className}`}>
      <span
        className={`h-2 w-2 rounded-full ${isOnline ? "bg-[#759C7F]" : "bg-[#C85A5C]"}`}
        aria-hidden
      />
      {isOnline ? sourceLabel(source) : "Offline"}
    </span>
  );
}
