"use client";

import { useEffect } from "react";
import { upsertViewer } from "./firebase";

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

function guessLabel(): string {
  if (typeof navigator === "undefined") return "";
  const userAgent = navigator.userAgent;

  const os = /android/i.test(userAgent)
    ? "Android"
    : /iphone|ipad|ipod/i.test(userAgent)
      ? "iOS"
      : /windows/i.test(userAgent)
        ? "Windows"
        : /macintosh|mac os x/i.test(userAgent)
          ? "Mac"
          : /linux/i.test(userAgent)
            ? "Linux"
            : null;

  const browser = /edg\//i.test(userAgent)
    ? "Edge"
    : /chrome\//i.test(userAgent)
      ? "Chrome"
      : /firefox\//i.test(userAgent)
        ? "Firefox"
        : /safari\//i.test(userAgent)
          ? "Safari"
          : null;

  if (os && browser) return `${os} · ${browser}`;
  return os || browser || "";
}

export function usePresenceHeartbeat() {
  useEffect(() => {
    const clientId = getClientId();
    if (!clientId) return;

    const ping = () => {
      upsertViewer(clientId, { ip: "", label: guessLabel(), lastSeen: Math.floor(Date.now() / 1000) });
    };

    ping();
    const interval = setInterval(ping, HEARTBEAT_MS);
    return () => clearInterval(interval);
  }, []);
}
