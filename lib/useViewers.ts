"use client";

import { useEffect, useState } from "react";
import { subscribeViewers } from "./firebase";
import type { ViewerRecord } from "./sensorTypes";

export function useViewers() {
  const [viewers, setViewers] = useState<ViewerRecord[]>([]);

  useEffect(() => subscribeViewers(setViewers), []);

  return viewers;
}
