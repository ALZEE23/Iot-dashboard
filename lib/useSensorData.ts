"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { MqttClient } from "mqtt";
import { connectSensorMqtt } from "./mqttClient";
import { fetchHistory } from "./firebase";
import { useLocalNetwork } from "./useLocalNetwork";
import { isSensorReading, type ConnectionSource, type HistoryRecord, type SensorReading } from "./sensorTypes";

const STALE_AFTER_SECONDS = 30;
const HISTORY_POLL_MS = 30_000;
const HISTORY_LIMIT = 20;

export function useSensorData() {
  const [mqttReading, setMqttReading] = useState<SensorReading | null>(null);
  const [mqttConnected, setMqttConnected] = useState(false);
  const { reading: localReading, isAvailable: localAvailable } = useLocalNetwork();

  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const clientRef = useRef<MqttClient | null>(null);

  useEffect(() => {
    const client = connectSensorMqtt();
    clientRef.current = client;
    if (!client) return;

    client.on("connect", () => setMqttConnected(true));
    client.on("close", () => setMqttConnected(false));
    client.on("message", (_topic, payload) => {
      try {
        const data = JSON.parse(payload.toString());
        if (isSensorReading(data)) setMqttReading(data);
      } catch {
        // ignore malformed payloads
      }
    });

    return () => {
      client.end(true);
      clientRef.current = null;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadHistory = async () => {
      const records = await fetchHistory(HISTORY_LIMIT);
      if (!cancelled) {
        setHistory(records);
        setIsLoadingHistory(false);
      }
    };

    loadHistory();
    const interval = setInterval(loadHistory, HISTORY_POLL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const { reading, source } = useMemo<{ reading: SensorReading | null; source: ConnectionSource }>(() => {
    if (mqttReading && localReading) {
      return mqttReading.timestamp >= localReading.timestamp
        ? { reading: mqttReading, source: "mqtt" }
        : { reading: localReading, source: "local" };
    }
    if (mqttReading) return { reading: mqttReading, source: "mqtt" };
    if (localReading) return { reading: localReading, source: "local" };
    return { reading: null, source: null };
  }, [mqttReading, localReading]);

  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const evaluate = () => {
      if (mqttConnected || localAvailable) {
        setIsOnline(true);
        return;
      }
      if (!reading || !reading.timestamp) {
        setIsOnline(false);
        return;
      }
      setIsOnline(Date.now() / 1000 - reading.timestamp < STALE_AFTER_SECONDS);
    };

    evaluate();
    const interval = setInterval(evaluate, 5000);
    return () => clearInterval(interval);
  }, [mqttConnected, localAvailable, reading]);

  return { reading, source, isOnline, history, isLoadingHistory };
}
