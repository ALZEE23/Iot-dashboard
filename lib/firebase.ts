import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, onValue, query, orderByKey, limitToLast, get, type Database } from "firebase/database";
import { isSensorReading, type HistoryRecord, type SensorReading } from "./sensorTypes";

function pathPrefix() {
  return process.env.NEXT_PUBLIC_FIREBASE_PATH_PREFIX || "sensors";
}

function getFirebaseDb(): Database | null {
  const databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
  if (!databaseURL) {
    console.warn("NEXT_PUBLIC_FIREBASE_DATABASE_URL missing — skipping Firebase.");
    return null;
  }

  const app = getApps().length ? getApp() : initializeApp({ databaseURL });
  return getDatabase(app);
}

export function subscribeLatest(onReading: (reading: SensorReading | null) => void): () => void {
  const db = getFirebaseDb();
  if (!db) return () => {};

  const latestRef = ref(db, `${pathPrefix()}/latest`);
  return onValue(latestRef, (snapshot) => {
    const value = snapshot.val();
    onReading(isSensorReading(value) ? value : null);
  });
}

export async function fetchHistory(limitCount = 20): Promise<HistoryRecord[]> {
  const db = getFirebaseDb();
  if (!db) return [];

  const historyQuery = query(ref(db, `${pathPrefix()}/history`), orderByKey(), limitToLast(limitCount));
  const snapshot = await get(historyQuery);
  if (!snapshot.exists()) return [];

  const records: HistoryRecord[] = [];
  snapshot.forEach((child) => {
    const value = child.val();
    if (isSensorReading(value)) {
      records.push({ ...value, id: child.key ?? String(value.timestamp) });
    }
  });

  return records.sort((a, b) => a.timestamp - b.timestamp);
}
