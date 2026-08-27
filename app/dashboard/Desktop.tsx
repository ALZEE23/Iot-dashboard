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
    <div className="hidden lg:block min-h-dvh bg-[var(--color-bg)]">
      <Navbar active={active} onChange={setActive} />

      <div className="pt-24 px-8 pb-8">
        {active === "Overview" && <OverviewSection />}
        {active === "Analytics" && <AnalyticsSection />}
        {active === "Monitoring" && <MonitoringSection />}
        {active === "Perangkat" && <PerangkatSection />}
      </div>
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
        <HistoryList items={historyItems} title="Riwayat" />
      </div>
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