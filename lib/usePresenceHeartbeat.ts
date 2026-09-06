"use client";

import { useEffect } from "react";

const CLIENT_ID_KEY = "hidrotrack-client-id";
const HEARTBEAT_MS = 15_000;

function getClientId(): string | null {
  if (typeof window === "undefined") return null;

  let id = localStorage.getItem(CLIENT_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(CLIENT_ID_KEY, id);
  }
  return id;
}

export function usePresenceHeartbeat() {
  useEffect(() => {
    const clientId = getClientId();
    if (!clientId) return;

    const ping = () => {
      fetch("/api/presence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId }),
        keepalive: true,
      }).catch(() => {});
    };

    ping();
    const interval = setInterval(ping, HEARTBEAT_MS);
    return () => clearInterval(interval);
  }, []);
}
