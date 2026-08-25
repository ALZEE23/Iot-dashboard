"use client";

import { useState } from "react";
import Image from "next/image";
import { Navbar, type Tab } from "../component/Navbar";
import { StatRow } from "../component/StatCard";
import { HistoryList } from "../component/HistoryList";
import { DeviceList } from "../component/DeviceList";
import { desktopStats, historyItems, devices } from "@/lib/data";

export function Desktop() {
  const [active, setActive] = useState<Tab>("Overview");

  return (
    <div className="hidden lg:block min-h-dvh bg-[var(--color-bg)] p-8">
      <Navbar active={active} onChange={setActive} />

      {active === "Overview" && <OverviewSection />}
      {active === "Analytics" && <AnalyticsSection />}
      {active === "Monitoring" && <MonitoringSection />}
      {active === "Perangkat" && <PerangkatSection />}
    </div>
  );
}

function OverviewSection() {
  return (
    <div className="grid grid-cols-[280px_1fr_300px] gap-6 items-start">
      <div className="space-y-3">
        {desktopStats.map((stat) => (
          <StatRow key={stat.key} stat={stat} />
        ))}
      </div>
      <div className="space-y-6">
        <div className="rounded-[var(--radius-lg)] bg-[var(--color-primary)] text-white p-6 overflow-hidden">
          <h2 className="text-2xl font-bold">
            Hidro<span className="font-light">Track</span>
          </h2>
          <p className="text-sm text-white/90 mt-1 max-w-md">
            Aplikasi untuk mencatat dan memantau perkembangan tanaman
            hidroponik, termasuk jadwal pemberian nutrisi dan pergantian air.
          </p>
          <div className="mt-4 rounded-[var(--radius-md)] overflow-hidden relative h-56 bg-[var(--color-primary-dark)]">
            <Image
              src="/images/hidroponik.jpg"
              alt="Instalasi hidroponik vertikal"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <HistoryList items={historyItems} title="Riwayat" />
      </div>

      <DeviceList devices={devices} />
    </div>
  );
}

function AnalyticsSection() {
  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-4">
      {desktopStats.map((stat) => (
        <StatRow key={stat.key} stat={stat} />
      ))}
    </div>
  );
}

function MonitoringSection() {
  return (
    <div className="w-full">
      <HistoryList items={historyItems} title="Riwayat" />
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