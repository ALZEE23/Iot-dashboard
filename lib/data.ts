export type StatVariant = "primary" | "gold" | "red" | "sage";

export interface StatItem {
  key: string;
  label: string;
  value: string;
  range?: string;
  status?: "Normal" | "Kurang" | "Tinggi";
  icon: "droplet" | "leaf" | "thermometer" | "wind" | "gauge";
  variant: StatVariant;
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

export const mobileStats: StatItem[] = [
  { key: "level-air", label: "Level air", value: "90%", icon: "wind", variant: "primary" },
  { key: "nutrisi", label: "Nutrisi", value: "90%", icon: "leaf", variant: "primary" },
  { key: "suhu-air", label: "Suhu air", value: "100°", icon: "thermometer", variant: "gold" },
  { key: "ph-air", label: "pH air", value: "10ph", icon: "droplet", variant: "red" },
  { key: "suhu-udara", label: "Suhu udara", value: "25°", icon: "thermometer", variant: "sage" },
  { key: "rh-udara", label: "RH udara", value: "90%", icon: "gauge", variant: "sage" },
];

export const desktopStats: StatItem[] = [
  { key: "ph-air", label: "pH Air", value: "6,2", range: "Range 6.0 - 7.0", status: "Normal", icon: "droplet", variant: "red" },
  { key: "suhu-air", label: "Suhu Air", value: "24°C", range: "Range 20°C - 28°C", status: "Normal", icon: "thermometer", variant: "gold" },
  { key: "nutrisi", label: "Nutrisi", value: "1.35", range: "Range 1.2 - 1.6 mS/cm", status: "Normal", icon: "leaf", variant: "primary" },
  { key: "level-air", label: "Level Air", value: "75%", range: "Range 60% - 100%", status: "Normal", icon: "wind", variant: "primary" },
  { key: "suhu-udara", label: "Suhu Udara", value: "24°C", range: "Range 20°C - 30°C", status: "Normal", icon: "thermometer", variant: "sage" },
  { key: "kelembapan", label: "Kelembapan", value: "62%", range: "Range 50% - 80%", status: "Normal", icon: "gauge", variant: "sage" },
];

export const historyItems: HistoryItem[] = [
  { key: "h1", title: "pH air", description: "Kekurangan pH air 70ppm", time: "17.00", tone: "warning" },
  { key: "h2", title: "Suhu air", description: "Kenaikan suhu air", time: "16.59", tone: "warning" },
  { key: "h3", title: "Suhu udara", description: "Suhu udara sangat stabil", time: "16.59", tone: "success" },
  { key: "h4", title: "Nutrisi", description: "Nutrisi tanaman tercukupi", time: "16.59", tone: "success" },
];

export const devices: DeviceItem[] = [
  { key: "d1", name: "Realme C12", status: "Online", lastSeen: "17.00" },
  { key: "d2", name: "Poco M3", status: "Online", lastSeen: "12.00" },
  { key: "d3", name: "Poco M3", status: "Offline", lastSeen: "19/08/2026 12.00" },
];