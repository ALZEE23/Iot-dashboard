"use client";

import { useState } from "react";
import { Info, X } from "lucide-react";
import { STATUS_ORDER, STATUS_STYLE } from "@/lib/statusStyle";

export function StatusLegendButton({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Arti warna indikator"
        onClick={() => setOpen(true)}
        className={className}
      >
        <Info className="h-6 w-6 text-white" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-t-[20px] bg-white p-5 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#0D2D1E]">Arti Warna Indikator</h3>
              <button type="button" aria-label="Tutup" onClick={() => setOpen(false)}>
                <X className="h-5 w-5 text-[#0D2D1E]/70" />
              </button>
            </div>

            <ul className="space-y-4">
              {STATUS_ORDER.map((status) => (
                <li key={status} className="flex items-start gap-3">
                  <span className={`mt-1 h-4 w-4 rounded-full shrink-0 ${STATUS_STYLE[status].bg}`} />
                  <div>
                    <p className="font-semibold text-[#0D2D1E]">{status}</p>
                    <p className="text-sm text-[#0D2D1E]/70 mt-0.5">{STATUS_STYLE[status].description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
