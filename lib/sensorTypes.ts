export interface SensorReading {
  water_temp_c: number | null;
  air_temp_c: number | null;
  air_humidity_pct: number | null;
  ph: number | null;
  tds_ppm: number | null;
  timestamp: number;
}

export type ConnectionSource = "mqtt" | "local" | null;

export interface HistoryRecord extends SensorReading {
  id: string;
}

export function isSensorReading(value: unknown): value is SensorReading {
  if (typeof value !== "object" || value === null) return false;
  const r = value as Record<string, unknown>;
  return (
    ("water_temp_c" in r) &&
    ("air_temp_c" in r) &&
    ("air_humidity_pct" in r) &&
    ("ph" in r) &&
    ("tds_ppm" in r) &&
    typeof r.timestamp === "number"
  );
}
