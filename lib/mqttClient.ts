import mqtt, { type MqttClient } from "mqtt";

export function connectSensorMqtt(): MqttClient | null {
  if (typeof window === "undefined") return null;

  const url = process.env.NEXT_PUBLIC_MQTT_WSS_URL;
  const topic = process.env.NEXT_PUBLIC_MQTT_TOPIC;
  if (!url || !topic) {
    console.warn("MQTT env vars missing (NEXT_PUBLIC_MQTT_WSS_URL / _TOPIC) — skipping MQTT connection.");
    return null;
  }

  const client = mqtt.connect(url, {
    username: process.env.NEXT_PUBLIC_MQTT_USERNAME || undefined,
    password: process.env.NEXT_PUBLIC_MQTT_PASSWORD || undefined,
    reconnectPeriod: 3000,
  });

  client.on("connect", () => client.subscribe(topic));

  return client;
}
