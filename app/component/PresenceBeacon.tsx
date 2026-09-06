"use client";

import { usePresenceHeartbeat } from "@/lib/usePresenceHeartbeat";

export function PresenceBeacon() {
  usePresenceHeartbeat();
  return null;
}
