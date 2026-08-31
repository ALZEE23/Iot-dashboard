import type { HistoryRecord, SensorReading } from "./sensorTypes";

export type StatStatus = "Normal" | "Kurang" | "Tinggi" | "Belum tersedia";

export interface StatItem {
  key: string;
  label: string;
  value: string;
  range?: string;
  status?: StatStatus;
  icon: "droplet" | "leaf" | "thermometer" | "wind" | "gauge";
}

export interface HistoryItem {
  key: string;
  title: string;
  description: string;
  time: string;
  tone: "warning" | "alert" | "success" | "info";
}

export interface DeviceItem {
  key: string;
  name: string;
  status: "Online" | "Offline";
  lastSeen: string;
}

export const devices: DeviceItem[] = [
  { key: "d1", name: "Realme C12", status: "Online", lastSeen: "17.00" },
  { key: "d2", name: "Poco M3", status: "Online", lastSeen: "12.00" },
  { key: "d3", name: "Poco M3", status: "Offline", lastSeen: "19/08/2026 12.00" },
];

const RANGES = {
  water_temp_c: { min: 20, max: 28, label: "Range 20°C - 28°C" },
  air_temp_c: { min: 20, max: 30, label: "Range 20°C - 30°C" },
  air_humidity_pct: { min: 50, max: 80, label: "Range 50% - 80%" },
  ph: { min: 6.0, max: 7.0, label: "Range 6.0 - 7.0" },
  tds_ppm: { min: 600, max: 800, label: "Range 600 - 800 ppm" },
} as const;

function statusFor(value: number | null, range: { min: number; max: number }): StatStatus {
  if (value === null) return "Belum tersedia";
  if (value < range.min) return "Kurang";
  if (value > range.max) return "Tinggi";
  return "Normal";
}

function formatTemp(value: number | null): string {
  return value === null ? "—" : `${Math.round(value)}°C`;
}

function formatPercent(value: number | null): string {
  return value === null ? "—" : `${Math.round(value)}%`;
}

function formatPh(value: number | null): string {
  return value === null ? "—" : value.toFixed(1).replace(".", ",");
}

function formatPpm(value: number | null): string {
  return value === null ? "—" : `${Math.round(value)} ppm`;
}

const LEVEL_AIR_PLACEHOLDER: StatItem = {
  key: "level-air",
  label: "Level Air",
  value: "—",
  range: "Sensor belum tersedia",
  status: "Belum tersedia",
  icon: "wind",
};

export function buildDesktopStats(reading: SensorReading | null): StatItem[] {
  const ph = reading?.ph ?? null;
  const waterTemp = reading?.water_temp_c ?? null;
  const tds = reading?.tds_ppm ?? null;
  const airTemp = reading?.air_temp_c ?? null;
  const humidity = reading?.air_humidity_pct ?? null;

  return [
    {
      key: "ph-air",
      label: "pH Air",
      value: formatPh(ph),
      range: RANGES.ph.label,
      status: statusFor(ph, RANGES.ph),
      icon: "droplet",
    },
    {
      key: "suhu-air",
      label: "Suhu Air",
      value: formatTemp(waterTemp),
      range: RANGES.water_temp_c.label,
      status: statusFor(waterTemp, RANGES.water_temp_c),
      icon: "thermometer",
    },
    {
      key: "nutrisi",
      label: "Nutrisi (TDS)",
      value: formatPpm(tds),
      range: RANGES.tds_ppm.label,
      status: statusFor(tds, RANGES.tds_ppm),
      icon: "leaf",
    },
    LEVEL_AIR_PLACEHOLDER,
    {
      key: "suhu-udara",
      label: "Suhu Udara",
      value: formatTemp(airTemp),
      range: RANGES.air_temp_c.label,
      status: statusFor(airTemp, RANGES.air_temp_c),
      icon: "thermometer",
    },
    {
      key: "air-humidity",
      label: "Kelembapan",
      value: formatPercent(humidity),
      range: RANGES.air_humidity_pct.label,
      status: statusFor(humidity, RANGES.air_humidity_pct),
      icon: "gauge",
    },
  ];
}

export function buildMobileStats(reading: SensorReading | null): StatItem[] {
  const ph = reading?.ph ?? null;
  const waterTemp = reading?.water_temp_c ?? null;
  const tds = reading?.tds_ppm ?? null;
  const airTemp = reading?.air_temp_c ?? null;
  const humidity = reading?.air_humidity_pct ?? null;

  return [
    LEVEL_AIR_PLACEHOLDER,
    {
      key: "nutrisi",
      label: "Nutrisi (TDS)",
      value: formatPpm(tds),
      status: statusFor(tds, RANGES.tds_ppm),
      icon: "leaf",
    },
    {
      key: "suhu-air",
      label: "Suhu air",
      value: formatTemp(waterTemp),
      status: statusFor(waterTemp, RANGES.water_temp_c),
      icon: "thermometer",
    },
    {
      key: "ph-air",
      label: "pH air",
      value: formatPh(ph),
      status: statusFor(ph, RANGES.ph),
      icon: "droplet",
    },
    {
      key: "suhu-udara",
      label: "Suhu udara",
      value: formatTemp(airTemp),
      status: statusFor(airTemp, RANGES.air_temp_c),
      icon: "thermometer",
    },
    {
      key: "air-humidity",
      label: "RH udara",
      value: formatPercent(humidity),
      status: statusFor(humidity, RANGES.air_humidity_pct),
      icon: "gauge",
    },
  ];
}

function formatHistoryTime(timestamp: number): string {
  if (!timestamp) return "—";
  return new Date(timestamp * 1000).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function buildHistoryItems(history: HistoryRecord[], limit = 8): HistoryItem[] {
  const items: HistoryItem[] = [];

  for (const record of [...history].reverse()) {
    const time = formatHistoryTime(record.timestamp);
    const deviations: HistoryItem[] = [];

    if (record.ph !== null && statusFor(record.ph, RANGES.ph) !== "Normal") {
      deviations.push({
        key: `${record.id}-ph`,
        title: "pH air",
        description: statusFor(record.ph, RANGES.ph) === "Kurang" ? "Kekurangan pH air" : "Kelebihan pH air",
        time,
        tone: "warning",
      });
    }
    if (record.water_temp_c !== null && statusFor(record.water_temp_c, RANGES.water_temp_c) !== "Normal") {
      deviations.push({
        key: `${record.id}-suhu-air`,
        title: "Suhu air",
        description:
          statusFor(record.water_temp_c, RANGES.water_temp_c) === "Kurang"
            ? "Suhu air terlalu rendah"
            : "Kenaikan suhu air",
        time,
        tone: "warning",
      });
    }
    if (record.tds_ppm !== null && statusFor(record.tds_ppm, RANGES.tds_ppm) !== "Normal") {
      deviations.push({
        key: `${record.id}-nutrisi`,
        title: "Nutrisi",
        description:
          statusFor(record.tds_ppm, RANGES.tds_ppm) === "Kurang" ? "Nutrisi kurang tercukupi" : "Nutrisi berlebih",
        time,
        tone: "warning",
      });
    }

    if (deviations.length > 0) {
      items.push(...deviations);
    } else {
      items.push({
        key: `${record.id}-ok`,
        title: "Kondisi tanaman",
        description: "Semua parameter stabil",
        time,
        tone: "success",
      });
    }

    if (items.length >= limit) break;
  }

  return items.slice(0, limit);
}
