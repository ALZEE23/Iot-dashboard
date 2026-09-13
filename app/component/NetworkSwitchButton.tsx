"use client";

import { useState } from "react";
import { Wifi, WifiOff, Lock, X, RefreshCw, Loader2 } from "lucide-react";
import type { ConnectionSource } from "@/lib/sensorTypes";
import { ConnectionBadge } from "./ConnectionBadge";
import { fetchEspWifiStatus, scanEspWifiNetworks, connectEspToWifi, type WifiNetwork, type WifiStatus } from "@/lib/espWifiControl";

export function NetworkSwitchButton({
  isOnline,
  source,
  className = "",
}: {
  isOnline: boolean;
  source: ConnectionSource;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [statusChecked, setStatusChecked] = useState(false);
  const [status, setStatus] = useState<WifiStatus | null>(null);

  const [scanning, setScanning] = useState(false);
  const [scanAttempted, setScanAttempted] = useState(false);
  const [networks, setNetworks] = useState<WifiNetwork[]>([]);

  const [selected, setSelected] = useState<WifiNetwork | null>(null);
  const [password, setPassword] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [connectResult, setConnectResult] = useState<"idle" | "sent" | "failed">("idle");

  const [manualMode, setManualMode] = useState(false);
  const [manualSsid, setManualSsid] = useState("");
  const [manualPassword, setManualPassword] = useState("");

  const checkStatus = async () => {
    setCheckingStatus(true);
    const result = await fetchEspWifiStatus();
    setStatus(result);
    setStatusChecked(true);
    setCheckingStatus(false);
  };

  const handleOpen = () => {
    setOpen(true);
    checkStatus();
  };

  const handleClose = () => {
    setOpen(false);
    setNetworks([]);
    setScanAttempted(false);
    setSelected(null);
    setPassword("");
    setConnectResult("idle");
    setManualMode(false);
    setManualSsid("");
    setManualPassword("");
  };

  const handleScan = async () => {
    setScanning(true);
    setSelected(null);
    setConnectResult("idle");
    const list = await scanEspWifiNetworks();
    setNetworks(list);
    setScanAttempted(true);
    setScanning(false);
  };

  const handleConnect = async (ssid: string, pass: string) => {
    setConnecting(true);
    const ok = await connectEspToWifi(ssid, pass);
    setConnectResult(ok ? "sent" : "failed");
    setConnecting(false);
    if (ok) setTimeout(checkStatus, 4000);
  };

  return (
    <>
      <button type="button" aria-label="Jaringan ESP32" onClick={handleOpen} className={className}>
        <Wifi className="h-6 w-6 text-white" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40" onClick={handleClose}>
          <div
            className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-t-[20px] bg-white p-5 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#0D2D1E]">Jaringan ESP32</h3>
              <button type="button" aria-label="Tutup" onClick={handleClose}>
                <X className="h-5 w-5 text-[#0D2D1E]/70" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-[#0D2D1E]/60 mb-1.5">Status dashboard</p>
                <ConnectionBadge isOnline={isOnline} source={source} className="text-[#0D2D1E]" />
              </div>

              <div className="rounded-[10px] bg-[#E7EFDA] p-3.5">
                <p className="text-xs font-semibold text-[#0D2D1E]/60 mb-1.5">ESP32 lagi konek ke WiFi mana</p>
                {checkingStatus ? (
                  <p className="flex items-center gap-2 text-sm text-[#0D2D1E]/70">
                    <Loader2 className="h-4 w-4 animate-spin" /> Mengecek...
                  </p>
                ) : !statusChecked ? null : status === null ? (
                  <p className="text-sm text-[#0D2D1E]/70">
                    Tidak bisa mengecek — pastikan HP/laptop kamu tersambung ke hotspot ESP32 dulu.
                  </p>
                ) : status.connected ? (
                  <p className="flex items-center gap-2 text-sm font-semibold text-[#0D2D1E]">
                    <Wifi className="h-4 w-4 text-[#3D5F3E]" /> {status.ssid || "(SSID tersembunyi)"}
                  </p>
                ) : (
                  <p className="flex items-center gap-2 text-sm text-[#0D2D1E]/70">
                    <WifiOff className="h-4 w-4" /> Belum tersambung ke WiFi manapun (masih mode hotspot)
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-[#0D2D1E]">Ganti jaringan ESP32</p>
                  <button
                    type="button"
                    onClick={handleScan}
                    disabled={scanning}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#3D5F3E] disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${scanning ? "animate-spin" : ""}`} />
                    {scanning ? "Nyari..." : "Cari WiFi"}
                  </button>
                </div>

                {scanAttempted && !scanning && networks.length === 0 && (
                  <p className="text-sm text-[#0D2D1E]/60">
                    Nggak ketemu WiFi di sekitar (atau ESP32 nggak bisa dijangkau).
                  </p>
                )}

                <ul className="space-y-1.5">
                  {networks.map((network) => (
                    <li key={network.ssid}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelected(network);
                          setPassword("");
                          setConnectResult("idle");
                        }}
                        className={`w-full flex items-center justify-between rounded-[10px] px-3 py-2.5 text-sm ${
                          selected?.ssid === network.ssid
                            ? "bg-[#3D5F3E] text-white"
                            : "bg-[#E7EFDA] text-[#0D2D1E]"
                        }`}
                      >
                        <span className="font-medium truncate">{network.ssid}</span>
                        {network.secure && <Lock className="h-3.5 w-3.5 shrink-0 ml-2 opacity-70" />}
                      </button>

                      {selected?.ssid === network.ssid && (
                        <div className="mt-2 space-y-2 px-1">
                          {network.secure && (
                            <input
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Password WiFi"
                              className="w-full rounded-[10px] border border-[#0D2D1E]/15 px-3 py-2 text-sm outline-none focus:border-[#3D5F3E]"
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => handleConnect(network.ssid, password)}
                            disabled={connecting || (network.secure && password.length === 0)}
                            className="w-full rounded-[10px] bg-[#0D2D1E] py-2 text-sm font-semibold text-white disabled:opacity-50"
                          >
                            {connecting ? "Menyambungkan..." : `Sambungkan ke ${network.ssid}`}
                          </button>
                          {connectResult === "sent" && (
                            <p className="text-xs text-[#3D5F3E]">
                              Perintah terkirim, ESP32 lagi coba konek. Cek status di atas beberapa detik lagi.
                            </p>
                          )}
                          {connectResult === "failed" && (
                            <p className="text-xs text-red-600">Gagal kirim perintah, coba lagi.</p>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => {
                    setManualMode((v) => !v);
                    setSelected(null);
                    setConnectResult("idle");
                  }}
                  className="mt-2 text-xs font-semibold text-[#3D5F3E] underline underline-offset-2"
                >
                  {manualMode ? "Sembunyikan input manual" : "Nggak ketemu? Isi SSID manual"}
                </button>

                {manualMode && (
                  <div className="mt-2 space-y-2 rounded-[10px] bg-[#E7EFDA] p-3">
                    <input
                      type="text"
                      value={manualSsid}
                      onChange={(e) => setManualSsid(e.target.value)}
                      placeholder="Nama WiFi (SSID)"
                      maxLength={32}
                      className="w-full rounded-[10px] border border-[#0D2D1E]/15 px-3 py-2 text-sm outline-none focus:border-[#3D5F3E]"
                    />
                    <input
                      type="password"
                      value={manualPassword}
                      onChange={(e) => setManualPassword(e.target.value)}
                      placeholder="Password WiFi (kosongkan kalau open)"
                      maxLength={64}
                      className="w-full rounded-[10px] border border-[#0D2D1E]/15 px-3 py-2 text-sm outline-none focus:border-[#3D5F3E]"
                    />
                    <button
                      type="button"
                      onClick={() => handleConnect(manualSsid, manualPassword)}
                      disabled={connecting || manualSsid.length === 0}
                      className="w-full rounded-[10px] bg-[#0D2D1E] py-2 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      {connecting ? "Menyambungkan..." : "Sambungkan"}
                    </button>
                    {connectResult === "sent" && (
                      <p className="text-xs text-[#3D5F3E]">
                        Perintah terkirim, ESP32 lagi coba konek. Cek status di atas beberapa detik lagi.
                      </p>
                    )}
                    {connectResult === "failed" && <p className="text-xs text-red-600">Gagal kirim perintah, coba lagi.</p>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
