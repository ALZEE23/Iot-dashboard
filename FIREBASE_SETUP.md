# Setup Firebase Realtime Database (Free/Spark Plan)

Panduan bikin & konek Firebase buat proyek HidroTrack — dipakai buat histori
sensor (`fetchHistory`) dan daftar device yang lagi connect ke dashboard
(`Device Terhubung`). Semua ini jalan di plan gratis **Spark**, nggak perlu
kartu kredit/upgrade billing.

> **Penting**: pakai **Realtime Database (RTDB)**, bukan **Firestore**.
> Firebase punya dua produk database yang mirip namanya — kode di proyek ini
> (`lib/firebase.ts`) pakai `firebase/database`, jadi harus RTDB.

## 1. Bikin Project Firebase

1. Buka [console.firebase.google.com](https://console.firebase.google.com),
   login pakai akun Google.
2. Klik **Add project** → kasih nama bebas (misal `hidrotrack`).
3. Google Analytics boleh di-disable (nggak dipakai proyek ini).
4. Tunggu project selesai dibuat → otomatis masuk plan **Spark (gratis)**.

## 2. Aktifkan Realtime Database

1. Di sidebar kiri, buka **Build → Realtime Database**.
2. Klik **Create Database**.
3. Pilih lokasi server — buat Indonesia biasanya paling deket **Singapore
   (asia-southeast1)**, biar latensi kecil.
4. Pas ditanya mode security, pilih **Start in locked mode** dulu (nanti
   rule-nya kita ganti manual di langkah berikutnya).

## 3. Buka Rules Jadi Publik

Proyek ini didesain tanpa auth — ESP32 nulis langsung, browser baca
langsung, keduanya nggak login. Jadi rules-nya perlu dibuka:

1. Di tab **Realtime Database**, klik tab **Rules**.
2. Ganti isinya jadi:

   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```

3. Klik **Publish**.

> ⚠️ Ini artinya **siapa pun yang tahu Database URL-nya bisa baca & nulis
> data**. Nggak masalah buat hobby project kayak gini (nggak ada data
> sensitif), tapi jangan simpen apa pun yang rahasia di database ini, dan
> jangan commit Database URL ke repo publik kalau mau lebih aman (walau
> URL doang tanpa rules terbuka sebenernya nggak banyak gunanya buat orang
> lain).

## 4. Ambil Database URL

1. Masih di tab **Data** (Realtime Database), URL-nya kelihatan di bagian
   atas, formatnya:

   ```
   https://<nama-project>-default-rtdb.asia-southeast1.firebasedatabase.app
   ```

2. Copy URL itu persis (termasuk `https://`).

## 5. Isi ke `.env.local` Proyek Ini

Buka [.env.local](.env.local) (bikin dari [.env.local.example](.env.local.example)
kalau belum ada), isi:

```bash
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://<nama-project>-default-rtdb.asia-southeast1.firebasedatabase.app
NEXT_PUBLIC_FIREBASE_PATH_PREFIX=sensors
```

`NEXT_PUBLIC_FIREBASE_PATH_PREFIX` bisa dibiarin `sensors` (default) kecuali
mau custom.

## 6. Samain ke Firmware ESP32

Firmware (`../softAP`) nulis ke Firebase pakai konfigurasi yang **harus
sama persis** dengan `.env.local` di atas. Jalanin:

```bash
cd ../softAP
idf.py menuconfig
```

Cari opsi Firebase (biasanya di bawah menu project-specific Kconfig), isi
`CONFIG_FIREBASE_DATABASE_URL` dan `CONFIG_FIREBASE_PATH_PREFIX` dengan
nilai yang sama, lalu flash ulang ESP32-nya. Detail ada di
`softAP/README.md`.

## 7. Struktur Data yang Bakal Muncul

Setelah konek, di tab **Data** Firebase console bakal keliatan struktur
kayak gini (di-generate otomatis, nggak perlu dibikin manual):

```
sensors/
├── latest/              ← snapshot pembacaan terakhir dari ESP32
├── history/
│   └── <unix_ts>/       ← satu entri per siklus baca ESP32
└── viewers/
    └── <clientId>/      ← device yang lagi buka dashboard (ip, label, lastSeen)
```

`viewers/*` diisi otomatis oleh dashboard sendiri (lewat `/api/presence`,
bukan oleh ESP32) — itu yang nge-drive daftar "Device Terhubung".

## 8. Tes Koneksi

1. `npm run dev`, buka dashboard di browser.
2. Bagian **Device Terhubung** harusnya langsung muncul entri buat browser
   kamu sendiri dalam ~15 detik (heartbeat dari dashboard, nggak perlu
   ESP32 nyala).
3. Buat tes data sensor tanpa nunggu ESP32: di Firebase console, tab
   **Data**, klik ikon **+** di sebelah node `sensors`, tambahin child
   `latest` dengan value JSON contoh:

   ```json
   {
     "water_temp_c": 26.4,
     "air_temp_c": 29.1,
     "air_humidity_pct": 68.5,
     "ph": 6.2,
     "tds_ppm": 720,
     "timestamp": 1798765432
   }
   ```

   Kartu sensor di dashboard harusnya update sendiri tanpa refresh (RTDB
   pakai realtime listener).

## Batasan Plan Gratis (Spark)

Buat referensi, batas plan Spark yang relevan buat proyek kecil kayak ini:

| Resource               | Limit Spark (gratis) |
| ----------------------- | --------------------- |
| Simultaneous connections | 100                   |
| Storage                 | 1 GB                  |
| Download (bandwidth)    | 10 GB/bulan           |

Buat satu instalasi hidroponik rumahan, ini jauh lebih dari cukup. Kalau
nanti `sensors/history` numpuk terus tanpa pernah dibersihin (ESP32 nulis
tiap beberapa detik, 24/7), storage-nya bisa pelan-pelan kepenuhan dalam
hitungan bulan — kalau udah kejadian, tinggal hapus manual node
`sensors/history` lama dari console, atau tambahin logic pruning di
firmware/dashboard nanti.
