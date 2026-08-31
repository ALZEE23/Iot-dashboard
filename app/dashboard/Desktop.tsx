"use client";

import { useState } from "react";
import Image from "next/image";
import { Navbar, type Tab } from "../component/Navbar";
import { StatRow } from "../component/StatCard";
import { HistoryList } from "../component/HistoryList";
import { DeviceList } from "../component/DeviceList";
import { buildDesktopStats, buildHistoryItems, devices, type HistoryItem, type StatItem } from "@/lib/data";
import { useSensorData } from "@/lib/useSensorData";

export function Desktop() {
  const [active, setActive] = useState<Tab>("Overview");
  const { reading, source, isOnline, history } = useSensorData();
  const desktopStats = buildDesktopStats(reading);
  const historyItems = buildHistoryItems(history);

  return (
    <div className="hidden lg:block min-h-dvh bg-[var(--color-bg)]">
      <Navbar active={active} onChange={setActive} isOnline={isOnline} source={source} />

      <div className="pt-24 px-8 pb-8">
        {active === "Overview" && <OverviewSection stats={desktopStats} history={historyItems} />}
        {active === "Analytics" && <AnalyticsSection stats={desktopStats} />}
        {active === "Monitoring" && <MonitoringSection history={historyItems} />}
        {active === "Perangkat" && <PerangkatSection />}
      </div>
    </div>
  );
}

function OverviewSection({ stats, history }: { stats: StatItem[]; history: HistoryItem[] }) {
  return (
    <div className="grid grid-cols-[280px_1fr_300px] gap-6 items-start">
      <div className="space-y-3">
        {stats.map((stat) => (
          <StatRow key={stat.key} stat={stat} />
        ))}
      </div>

      <div>
        <div className="rounded-[10px] overflow-hidden">
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

        <div className="mt-4 rounded-[var(--radius-md)] overflow-hidden relative h-100">
          <Image
            src="/images/hidroponik.jpg"
            alt="Instalasi hidroponik vertikal"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="space-y-6">
        <DeviceList devices={devices} />
        <HistoryList items={history} title="Riwayat" />
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

function PerangkatSection() {
  return (
    <div className="w-full">
      <DeviceList devices={devices} />
    </div>
  );
}