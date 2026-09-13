const ESP32_AP_BASE_URL = "http://192.168.4.1";
const STATUS_TIMEOUT_MS = 3000;
const SCAN_TIMEOUT_MS = 10000;
const CONNECT_TIMEOUT_MS = 5000;

export interface WifiNetwork {
  ssid: string;
  rssi: number;
  secure: boolean;
}

export interface WifiStatus {
  connected: boolean;
  ssid: string;
}

async function fetchWithTimeout(path: string, init: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(`${ESP32_AP_BASE_URL}${path}`, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchEspWifiStatus(): Promise<WifiStatus | null> {
  try {
    const res = await fetchWithTimeout("/api/wifi/status", {}, STATUS_TIMEOUT_MS);
    if (!res.ok) return null;
    const data = await res.json();
    return { connected: Boolean(data.sta_connected), ssid: String(data.sta_ssid ?? "") };
  } catch {
    return null;
  }
}

export async function scanEspWifiNetworks(): Promise<WifiNetwork[]> {
  try {
    const res = await fetchWithTimeout("/api/wifi/scan", {}, SCAN_TIMEOUT_MS);
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    const sorted = data
      .filter((item): item is WifiNetwork => typeof item?.ssid === "string" && item.ssid.length > 0)
      .sort((a, b) => b.rssi - a.rssi);

    // ESP32 sering nangkep beberapa access point dengan SSID sama (mesh/repeater/
    // beberapa unit siaran nama yang sama) -- dedupe di sini, simpan yang sinyalnya
    // paling kuat aja, karena buat provisioning cukup satu SSID+password sekali.
    const seen = new Set<string>();
    const unique: WifiNetwork[] = [];
    for (const network of sorted) {
      if (seen.has(network.ssid)) continue;
      seen.add(network.ssid);
      unique.push(network);
    }
    return unique;
  } catch {
    return [];
  }
}

export async function connectEspToWifi(ssid: string, password: string): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(
      "/api/wifi/connect",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ssid, password }),
      },
      CONNECT_TIMEOUT_MS
    );
    return res.ok;
  } catch {
    return false;
  }
}
