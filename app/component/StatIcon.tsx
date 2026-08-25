import { Droplet, Leaf, Thermometer, Wind, Gauge, LucideProps } from "lucide-react";
import type { StatItem } from "@/lib/data";

const ICONS: Record<StatItem["icon"], React.ComponentType<LucideProps>> = {
  droplet: Droplet,
  leaf: Leaf,
  thermometer: Thermometer,
  wind: Wind,
  gauge: Gauge,
};

export function StatIcon({
  name,
  className,
}: {
  name: StatItem["icon"];
  className?: string;
}) {
  const Icon = ICONS[name];
  return <Icon className={className} strokeWidth={2} />;
}