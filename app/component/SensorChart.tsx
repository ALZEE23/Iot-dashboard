"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { formatHistoryTime } from "@/lib/data";
import type { HistoryRecord } from "@/lib/sensorTypes";

export type MetricKey = "ph" | "water_temp_c" | "tds_ppm" | "air_temp_c" | "air_humidity_pct";

export const METRICS: { key: MetricKey; label: string; unit: string; decimals: number }[] = [
  { key: "ph", label: "pH Air", unit: "", decimals: 1 },
  { key: "water_temp_c", label: "Suhu Air", unit: "°C", decimals: 1 },
  { key: "tds_ppm", label: "Nutrisi (TDS)", unit: " ppm", decimals: 0 },
  { key: "air_temp_c", label: "Suhu Udara", unit: "°C", decimals: 1 },
  { key: "air_humidity_pct", label: "Kelembapan", unit: "%", decimals: 0 },
];

const PAD_LEFT = 38;
const PAD_RIGHT = 12;
const PAD_TOP = 16;
const PAD_BOTTOM = 24;
const LINE_COLOR = "#0D2D1E";
const SURFACE = "#E7EFDA";
const MIN_SIZE = { width: 520, height: 260 };

function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState(MIN_SIZE);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setSize({ width, height });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, size };
}

function niceTicks(min: number, max: number, count = 4): number[] {
  const ticks: number[] = [];
  const step = (max - min) / (count - 1);
  for (let i = 0; i < count; i++) ticks.push(min + step * i);
  return ticks;
}

export function SensorChart({ history, metric }: { history: HistoryRecord[]; metric: MetricKey }) {
  const meta = METRICS.find((m) => m.key === metric)!;
  const { ref: containerRef, size } = useElementSize<HTMLDivElement>();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const WIDTH = size.width;
  const HEIGHT = size.height;
  const INNER_W = WIDTH - PAD_LEFT - PAD_RIGHT;
  const INNER_H = HEIGHT - PAD_TOP - PAD_BOTTOM;

  const points = useMemo(
    () => history.filter((r) => r[metric] !== null),
    [history, metric]
  );

  const scale = useMemo(() => {
    if (points.length === 0) return null;
    const values = points.map((p) => p[metric] as number);
    const rawMin = Math.min(...values);
    const rawMax = Math.max(...values);
    const pad = (rawMax - rawMin) * 0.2 || 1;
    const min = rawMin - pad;
    const max = rawMax + pad;
    const x = (i: number) => PAD_LEFT + (points.length === 1 ? INNER_W / 2 : (i / (points.length - 1)) * INNER_W);
    const y = (v: number) => PAD_TOP + INNER_H - ((v - min) / (max - min)) * INNER_H;
    return { min, max, x, y };
  }, [points, metric, INNER_W, INNER_H]);

  if (!scale) {
    return (
      <div ref={containerRef} className="flex h-full min-h-40 items-center justify-center text-sm text-[#0D2D1E]/60">
        Belum ada data untuk ditampilkan.
      </div>
    );
  }

  const { x, y, min, max } = scale;
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p[metric] as number).toFixed(1)}`)
    .join(" ");
  const yTicks = niceTicks(min, max, 4);
  const last = points[points.length - 1];
  const hovered = hoverIndex !== null ? points[hoverIndex] : null;
  const labelStep = Math.max(1, Math.ceil(points.length / 4));

  function handlePointerMove(e: PointerEvent<SVGSVGElement>) {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * WIDTH;
    let nearest = 0;
    let nearestDist = Infinity;
    points.forEach((_, i) => {
      const d = Math.abs(x(i) - relX);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = i;
      }
    });
    setHoverIndex(nearest);
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={containerRef} className="min-h-0 flex-1">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width="100%"
        height="100%"
        className="touch-none"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setHoverIndex(null)}
      >
        {yTicks.map((t, i) => (
          <g key={i}>
            <line
              x1={PAD_LEFT}
              x2={WIDTH - PAD_RIGHT}
              y1={y(t)}
              y2={y(t)}
              stroke={LINE_COLOR}
              strokeOpacity={0.12}
              strokeWidth={1}
            />
            <text x={PAD_LEFT - 6} y={y(t)} textAnchor="end" dominantBaseline="middle" fontSize={9} fill={LINE_COLOR} fillOpacity={0.5}>
              {t.toFixed(meta.decimals)}
            </text>
          </g>
        ))}

        <path d={path} fill="none" stroke={LINE_COLOR} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

        {hoverIndex !== null && (
          <line
            x1={x(hoverIndex)}
            x2={x(hoverIndex)}
            y1={PAD_TOP}
            y2={HEIGHT - PAD_BOTTOM}
            stroke={LINE_COLOR}
            strokeOpacity={0.25}
            strokeWidth={1}
          />
        )}

        {points.map((p, i) => {
          const isEnd = i === points.length - 1;
          const isHovered = i === hoverIndex;
          if (!isEnd && !isHovered) return null;
          return (
            <circle
              key={p.id}
              cx={x(i)}
              cy={y(p[metric] as number)}
              r={4}
              fill={LINE_COLOR}
              stroke={SURFACE}
              strokeWidth={2}
            />
          );
        })}

        <text
          x={x(points.length - 1)}
          y={y(last[metric] as number) - 10}
          textAnchor="end"
          fontSize={11}
          fontWeight={700}
          fill={LINE_COLOR}
        >
          {(last[metric] as number).toFixed(meta.decimals)}
          {meta.unit}
        </text>

        {points.map((p, i) => {
          const isLast = i === points.length - 1;
          if (!isLast && i % labelStep !== 0) return null;
          return (
            <text key={p.id} x={x(i)} y={HEIGHT - 6} textAnchor="middle" fontSize={9} fill={LINE_COLOR} fillOpacity={0.5}>
              {formatHistoryTime(p.timestamp)}
            </text>
          );
        })}
      </svg>
      </div>

      <div className="mt-1 h-6 text-xs text-[#0D2D1E]/70">
        {hovered ? (
          <>
            <strong className="font-bold text-[#0D2D1E]">
              {(hovered[metric] as number).toFixed(meta.decimals)}
              {meta.unit}
            </strong>{" "}
            · {formatHistoryTime(hovered.timestamp)}
          </>
        ) : (
          "Arahkan kursor ke grafik untuk detail."
        )}
      </div>
    </div>
  );
}
