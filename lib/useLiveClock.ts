"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";

export function useLiveClock(): Date | null {
  const snapshotRef = useRef<number | null>(null);

  const subscribe = useCallback((callback: () => void) => {
    const tick = () => {
      snapshotRef.current = Date.now();
      callback();
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const getSnapshot = useCallback(() => snapshotRef.current, []);
  const getServerSnapshot = useCallback(() => null, []);

  const timestamp = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return timestamp === null ? null : new Date(timestamp);
}
