import { Loader2 } from "lucide-react";

export function ConnectingScreen() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-[var(--color-bg)] text-[var(--color-ink)]">
      <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
      <p className="text-sm font-semibold">Menghubungkan ke perangkat...</p>
    </div>
  );
}
