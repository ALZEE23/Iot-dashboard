# HidroTrack — Dashboard Monitoring Hidroponik

Web dashboard (+ Android via Capacitor) buat monitoring realtime sistem hidroponik
IoT: suhu air, suhu & kelembaban udara, pH, dan TDS nutrisi. Konsumsi data dari
firmware ESP32 di repo terpisah: [`softAP`](../softAP) (baca `Architecture.MD` &
`README.md` di situ buat detail hardware/firmware).

## Status Sekarang

- ✅ UI shell udah jadi: layout Desktop (`app/dashboard/Desktop.tsx`) & Mobile
  (`app/dashboard/Mobile.tsx`), komponen `StatCard`, `DeviceList`, `HistoryList`,
  `Navbar`.
- ❌ **Semua data masih mock/hardcode** di `lib/data.ts` (`desktopStats`,
  `mobileStats`, `historyItems`, `devices`) — belum konek ke sumber data real
  sama sekali.
- ❌ Belum ada MQTT client wiring (package `mqtt` udah keinstall di
  `package.json`, tapi belum dipakai di kode manapun).
- ❌ Firebase SDK **belum jadi dependency** (belum di-`npm install`).
- ❌ Belum ada file `.env` buat kredensial broker/Firebase.

**Tugas berikutnya**: ganti isi `lib/data.ts` dari static export jadi hook yang
narik data real dari MQTT/Firebase (lihat bagian "Sumber Data" & "Yang Perlu
Dikerjakan" di bawah).

## Sumber Data

Firmware ESP32 nulis JSON yang **sama persis** ke 3 tempat (satu schema, satu
sumber kebenaran — didefinisikan di `components/sensor_hub/sensor_hub.c` di
repo `softAP`):

```json
{
  "water_temp_c": 26.4,
  "air_temp_c": 29.1,
  "air_humidity_pct": 68.5,
  "ph": 6.2,
  "tds_ppm": 812.3,
  "timestamp": 1798765432
}
```

- Field numerik jadi `null` (bukan hilang) kalau sensor itu gagal dibaca siklus
  itu — cek `data.ph === null`, jangan andalkan `"ph" in data`.
- `timestamp`: unix time detik (UTC). `0` kalau ESP32 belum sempat SNTP sync.

### 1. MQTT (realtime) — `mqtt.js`, sudah terinstall

- Broker: HiveMQ Cloud, **WSS port 8884** (bukan TCP 8883 — browser nggak bisa
  buka koneksi TCP mentah, wajib lewat WebSocket).
- URL koneksi: `wss://<broker-host>:8884/mqtt`
- Topic: default `hidroponik/sensor` (`CONFIG_MQTT_TOPIC` di firmware Kconfig).
- Payload: persis JSON di atas, dipublish tiap beberapa detik (`CONFIG_SENSOR_READ_INTERVAL_SEC`).
- Ini jalan dari **mana pun ada internet** (nggak perlu di WiFi yang sama kayak
  ESP32) — cocok buat deploy di Vercel.

Contoh pakai `mqtt.js` di client:
```ts
import mqtt from "mqtt";

const client = mqtt.connect(process.env.NEXT_PUBLIC_MQTT_WSS_URL!, {
  username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
  password: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
});

client.on("connect", () => client.subscribe(process.env.NEXT_PUBLIC_MQTT_TOPIC!));
client.on("message", (_topic, payload) => {
  const reading = JSON.parse(payload.toString());
  // update state
});
```

### 2. Firebase Realtime Database (histori) — **belum di-install**

- `npm install firebase`
- Path: `<Database URL>/<path-prefix>/latest.json` (snapshot terakhir) dan
  `.../history/<unix_ts>.json` (tiap entri histori, key = unix timestamp).
  Default path prefix: `sensors`.
- Rules Firebase dibuat terbuka (`.read`/`.write`: true) — cukup buat baca
  langsung dari client tanpa auth, tapi jangan expose database secret di kode
  publik.
- Ini juga jalan dari mana pun (bukan cuma jaringan yang sama kayak ESP32).

### 3. REST lokal (`/api/sensors`) — cuma kalau device & ESP32 satu jaringan

- `GET http://192.168.4.1/api/sensors` (lewat hotspot ESP32) atau IP STA-nya.
- **Nggak reliable buat dipakai di web yang di-deploy ke Vercel** — ESP32 nggak
  reachable dari internet kalau lagi nggak di jaringan lokal yang sama. Cuma
  masuk akal buat mode Capacitor/Android pas user beneran di lokasi yang sama
  dengan device (misal langsung connect ke hotspot ESP32 di greenhouse).

## ⚠️ Mismatch yang Perlu Direkonsiliasi

Mock data yang ada sekarang di `lib/data.ts` beda dari data yang beneran
dikirim firmware — perlu diputusin gimana nanganinnya pas wiring data real:

- **`level-air` (Level Air) nggak ada sensornya di firmware sama sekali** —
  firmware cuma punya 4 sensor: suhu air, suhu+kelembaban udara, pH, TDS. Nggak
  ada sensor level air/water level. Perlu diputusin: hapus stat ini dulu, atau
  jadiin placeholder "belum tersedia" sampai sensor fisiknya beneran ditambahin.
- **`nutrisi` di mock pakai satuan `mS/cm` (range 1.2-1.6)**, tapi firmware
  ngirim TDS dalam **ppm** (`tds_ppm`, bukan mS/cm) — beda satuan pengukuran.
  Jangan asal convert, mending relabel UI-nya jadi ppm biar sesuai apa yang
  beneran dikirim firmware.
- **Field naming beda antara mobile (`rh-udara`) & desktop (`kelembapan`)** —
  keduanya sama-sama harus mapping ke `air_humidity_pct`, tapi key/label-nya
  perlu disamain biar konsisten.
- **`DeviceItem` (daftar "Realme C12", "Poco M3", dst.)** itu konsepnya beda
  total — itu kayak daftar HP yang connect buat lihat dashboard, bukan data
  sensor. Firmware nggak nge-track ini sama sekali. Perlu diputusin apa fitur
  ini masih relevan atau di-drop dari scope v1.

## Environment Variables

Bikin `.env.local` (jangan commit ke git):

```bash
NEXT_PUBLIC_MQTT_WSS_URL=wss://xxxxxxxx.s1.eu.hivemq.cloud:8884/mqtt
NEXT_PUBLIC_MQTT_USERNAME=
NEXT_PUBLIC_MQTT_PASSWORD=
NEXT_PUBLIC_MQTT_TOPIC=hidroponik/sensor

NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://xxx-default-rtdb.asia-southeast1.firebasedatabase.app
NEXT_PUBLIC_FIREBASE_PATH_PREFIX=sensors
```

(Kredensial di atas harus **sama persis** sama yang diisi di `idf.py menuconfig`
buat firmware ESP32-nya — lihat `softAP/README.md`.)

## Yang Perlu Dikerjakan

1. `npm install firebase` (buat baca histori RTDB).
2. Bikin `.env.local` dari template di atas.
3. Bikin data layer (misal `lib/useSensorData.ts`) yang subscribe MQTT buat live
   reading + fetch Firebase buat histori, ganti static export di `lib/data.ts`.
4. Wiring `Desktop.tsx` / `Mobile.tsx` / `StatCard` dkk buat pakai data dari hook
   itu, bukan import langsung dari `lib/data.ts`.
5. Tambahin indikator connection status (online/offline) — bisa dari status
   koneksi `mqtt.js` client, atau bandingin `timestamp` terakhir vs waktu sekarang.
6. Selesaikan mismatch di atas (drop/placeholder `level-air`, relabel `nutrisi`
   ke ppm, samain naming humidity, putusin nasib `DeviceList`).
7. Test manual: nyalain firmware ESP32 (STA mode, connect WiFi + HiveMQ), lihat
   data masuk realtime di dashboard.

## Deploy

Target: **Vercel** (`npx vercel` atau connect repo GitHub ke Vercel dashboard).
Karena data sumber utamanya MQTT WSS + Firebase (bukan REST ke ESP32 langsung),
deployment ini jalan independen dari lokasi fisik ESP32 — user bisa buka
dashboard dari mana aja selama ESP32-nya lagi online (STA mode, connect ke
HiveMQ Cloud).

---

*Bagian di bawah ini boilerplate asli dari `create-next-app`, dibiarin buat referensi command dasar:*

## Getting Started

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
