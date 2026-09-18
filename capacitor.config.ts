import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.myapp',
  appName: 'HidroTrack',
  webDir: 'out',
  // App-nya dimuat dari origin https://localhost (default Capacitor), tapi
  // perlu fetch ke ESP32 lewat http:// polos (nggak ada SSL di device IoT-nya).
  // Tanpa ini, WebView nge-block semua fetch itu sebagai "mixed content" --
  // beda dari android:usesCleartextTraffic di Manifest, yang cuma ngatur izin
  // network stack, bukan kebijakan mixed-content WebView.
  android: {
    allowMixedContent: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
