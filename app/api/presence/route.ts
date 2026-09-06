import { NextResponse } from "next/server";
import { upsertViewer } from "@/lib/firebase";

function guessLabel(userAgent: string): string {
  const os = /android/i.test(userAgent)
    ? "Android"
    : /iphone|ipad|ipod/i.test(userAgent)
      ? "iOS"
      : /windows/i.test(userAgent)
        ? "Windows"
        : /macintosh|mac os x/i.test(userAgent)
          ? "Mac"
          : /linux/i.test(userAgent)
            ? "Linux"
            : null;

  const browser = /edg\//i.test(userAgent)
    ? "Edge"
    : /chrome\//i.test(userAgent)
      ? "Chrome"
      : /firefox\//i.test(userAgent)
        ? "Firefox"
        : /safari\//i.test(userAgent)
          ? "Safari"
          : null;

  if (os && browser) return `${os} · ${browser}`;
  return os || browser || "";
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const clientId = body?.clientId;

  if (typeof clientId !== "string" || clientId.length === 0) {
    return NextResponse.json({ error: "clientId required" }, { status: 400 });
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  const label = guessLabel(request.headers.get("user-agent") || "");

  await upsertViewer(clientId, { ip, label, lastSeen: Math.floor(Date.now() / 1000) });

  return NextResponse.json({ ok: true });
}
