import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export -- dipakai Capacitor (webDir: "out" di capacitor.config.ts)
  // buat bundling jadi app Android/iOS. Aman karena seluruh app ini client-side
  // (semua komponen "use client", data-nya dari MQTT/Firebase/REST lokal ke ESP32),
  // nggak ada Route Handler server lagi setelah presence dipindah ke Firebase client SDK.
  output: "export",
};

export default nextConfig;
