"use client";

import { useState } from "react";
import { Navbar, type Tab } from "../component/Navbar";
import { ConnectingScreen } from "../component/ConnectingScreen";
import { StatRow } from "../component/StatCard";
import { HistoryList, HistoryItems } from "../component/HistoryList";
import { DeviceList } from "../component/DeviceList";
import { SensorChart, METRICS, type MetricKey } from "../component/SensorChart";
import { buildDesktopStats, buildHistoryItems, buildDevices, type DeviceItem, type HistoryItem, type StatItem } from "@/lib/data";
import type { HistoryRecord } from "@/lib/sensorTypes";
import { useSensorData } from "@/lib/useSensorData";
import { useViewers } from "@/lib/useViewers";

export function Desktop() {
  const [active, setActive] = useState<Tab>("Overview");
  const { reading, source, isOnline, history, isConnecting } = useSensorData();
  const viewers = useViewers();
  const desktopStats = buildDesktopStats(reading);
  const historyItems = buildHistoryItems(history);
  const deviceItems = buildDevices(viewers);

  if (isConnecting) {
    return (
      <div className="hidden lg:block min-h-dvh bg-[var(--color-bg)]">
        <ConnectingScreen />
      </div>
    );
  }

  return (
    <div className="hidden lg:block min-h-dvh bg-[var(--color-bg)]">
      <Navbar active={active} onChange={setActive} isOnline={isOnline} source={source} />

      <div className="pt-24 px-8 pb-8 max-w-6xl mx-auto">
        {active === "Overview" && (
          <OverviewSection stats={desktopStats} history={historyItems} rawHistory={history} devices={deviceItems} />
        )}
        {active === "Analytics" && <AnalyticsSection stats={desktopStats} />}
        {active === "Monitoring" && <MonitoringSection history={historyItems} />}
        {active === "Perangkat" && <PerangkatSection devices={deviceItems} />}
      </div>
    </div>
  );
}

function OverviewSection({
  stats,
  history,
  rawHistory,
  devices,
}: {
  stats: StatItem[];
  history: HistoryItem[];
  rawHistory: HistoryRecord[];
  devices: DeviceItem[];
}) {
  const [view, setView] = useState<"list" | "chart">("list");
  const [metric, setMetric] = useState<MetricKey>("ph");

  return (
    <div className="grid grid-cols-[280px_1fr_300px] grid-rows-[minmax(0,1fr)] gap-6 h-[calc(100dvh-8rem)]">
      <div className="self-start space-y-3">
        {stats.map((stat) => (
          <StatRow key={stat.key} stat={stat} />
        ))}
      </div>

      <div className="flex h-full min-h-0 flex-col">
        <div className="shrink-0 rounded-[10px] overflow-hidden">
          <div className="bg-[#779B7F] text-white p-6">
            <h2 className="text-2xl font-bold">
              <span className="text-[#E7EFDA]">Hidro</span>
              <span className="text-[#0D2D1E]">Track</span>
            </h2>
            <p className="text-sm font-semibold text-[#E7EFDA] mt-2 max-w-md">
              Halo, sahabat lingkungan! ingin melihat bagaimana tanamanmu tumbuh
              sehat?
            </p>
          </div>

          <div className="bg-[#B7C9B9] h-10" />
        </div>

        <div className="mt-4 flex flex-1 min-h-0 flex-col rounded-[10px] bg-[#779B7F] p-4">
          <div className="flex shrink-0 items-center justify-between gap-3">
            <h3 className="text-xl font-bold text-white">Riwayat</h3>
            <div className="flex items-center gap-1 rounded-full bg-white/10 p-1">
              <button
                type="button"
                onClick={() => setView("list")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  view === "list" ? "bg-[#E7EFDA] text-[#0D2D1E]" : "text-white/60 hover:text-white"
                }`}
              >
                List
              </button>
              <button
                type="button"
                onClick={() => setView("chart")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  view === "chart" ? "bg-[#E7EFDA] text-[#0D2D1E]" : "text-white/60 hover:text-white"
                }`}
              >
                Chart
              </button>
            </div>
          </div>

          {view === "chart" && (
            <select
              value={metric}
              onChange={(e) => setMetric(e.target.value as MetricKey)}
              className="mt-3 shrink-0 self-start rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#0D2D1E] outline-none"
            >
              {METRICS.map((m) => (
                <option key={m.key} value={m.key}>
                  {m.label}
                </option>
              ))}
            </select>
          )}

          <div className="mt-3 min-h-0 flex-1 overflow-y-auto pr-1">
            {view === "list" ? (
              <HistoryItems items={history} />
            ) : (
              <div className="h-full min-h-55 rounded-[10px] bg-[#E7EFDA] p-3">
                <SensorChart history={rawHistory} metric={metric} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-full min-h-0">
        <DeviceList devices={devices} className="h-full" />
      </div>
    </div>
  );
}

function AnalyticsSection({ stats }: { stats: StatItem[] }) {
  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-4">
      {stats.map((stat) => (
        <StatRow key={stat.key} stat={stat} />
      ))}
    </div>
  );
}

function MonitoringSection({ history }: { history: HistoryItem[] }) {
  return (
    <div className="w-full">
      <HistoryList items={history} title="Riwayat" />
    </div>
  );
}

function PerangkatSection({ devices }: { devices: DeviceItem[] }) {
  return (
    <div className="w-full">
      <DeviceList devices={devices} />
    </div>
  );
}