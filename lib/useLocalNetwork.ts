"use client";

import { useEffect, useState } from "react";
import { isSensorReading, type SensorReading } from "./sensorTypes";

const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL || "http://192.168.4.1";
const POLL_INTERVAL_MS = 5000;
const FETCH_TIMEOUT_MS = 2500;

export function useLocalNetwork(baseUrl: string = DEFAULT_BASE_URL) {
  const [reading, setReading] = useState<SensorReading | null>(null);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
      try {
        const res = await fetch(`${baseUrl}/api/sensors`, { signal: controller.signal });
        const data = await res.json();
        if (cancelled) return;
        if (isSensorReading(data)) {
          setReading(data);
          setIsAvailable(true);
        } else {
          setIsAvailable(false);
        }
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
  }, [baseUrl]);

  return { reading, isAvailable };
}
