"use client";

import { useEffect, useState } from "react";
import { isSensorReading, type SensorReading } from "./sensorTypes";

const ESP32_AP_URL = "http://192.168.4.1";
const CANDIDATE_URLS = Array.from(
  new Set([process.env.NEXT_PUBLIC_LOCAL_API_URL, ESP32_AP_URL].filter((url): url is string => Boolean(url)))
);
const POLL_INTERVAL_MS = 5000;
const FETCH_TIMEOUT_MS = 2500;

async function fetchReadingFrom(baseUrl: string, signal: AbortSignal): Promise<SensorReading> {
  const res = await fetch(`${baseUrl}/api/sensors`, { signal });
  const data = await res.json();
  if (!isSensorReading(data)) throw new Error("payload bukan sensor reading yang valid");
  return data;
}

export function useLocalNetwork() {
  const [reading, setReading] = useState<SensorReading | null>(null);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
      try {
        // Coba semua kandidat IP ESP32 bareng (IP hotspot AP & IP STA WiFi rumah
        // kalau dikonfigurasi) -- cuma satu yang bakal kejangkau tergantung
        // device ini lagi nyambung ke jaringan yang mana, jadi nggak perlu
        // ganti-ganti env var manual tiap pindah mode.
        const data = await Promise.any(CANDIDATE_URLS.map((url) => fetchReadingFrom(url, controller.signal)));
        if (cancelled) return;
        setReading(data);
        setIsAvailable(true);
      } catch {
        if (!cancelled) setIsAvailable(false);
      } finally {
        clearTimeout(timeout);
      }
    };

    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return { reading, isAvailable };
}
