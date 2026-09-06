import type { StatStatus } from "./data";

export const STATUS_ORDER: StatStatus[] = ["Normal", "Kurang", "Tinggi", "Belum tersedia"];

export const STATUS_STYLE: Record<
  StatStatus,
  { bg: string; text: string; badge: string; iconCircle: boolean; description: string }
> = {
  Normal: {
    bg: "bg-[var(--color-success)]",
    text: "text-white",
    badge: "bg-white/20 text-white",
    iconCircle: false,
    description: "Nilai sensor ada di dalam range ideal — kondisi aman, tidak perlu tindakan.",
  },
  Kurang: {
    bg: "bg-[var(--color-warning)]",
    text: "text-[#0D2D1E]",
    badge: "bg-black/10 text-[#0D2D1E]",
    iconCircle: false,
    description: "Nilai sensor di bawah batas minimum range ideal — perlu dicek/ditambah.",
  },
  Tinggi: {
    bg: "bg-[var(--color-red)]",
    text: "text-white",
    badge: "bg-white/20 text-white",
    iconCircle: true,
    description: "Nilai sensor di atas batas maksimum range ideal — perlu segera dicek.",
  },
  "Belum tersedia": {
    bg: "bg-[var(--color-muted)]",
    text: "text-white",
    badge: "bg-white/20 text-white",
    iconCircle: false,
    description: "Sensor belum terpasang di firmware, atau bacaan gagal siklus ini.",
  },
};
