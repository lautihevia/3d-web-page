"use client";

import { useEffect, useRef, useState } from "react";
import { Info } from "lucide-react";

/**
 * Ícono ⓘ junto al precio. Abre con hover en desktop y con tap en mobile
 * (donde no hay hover); se cierra tocando afuera.
 */
export function PriceInfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  return (
    <span
      ref={ref}
      className="relative inline-flex align-middle"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label={text}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex cursor-help items-center text-black/40 transition-colors hover:text-black/70"
      >
        <Info size={14} />
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#0b0d12] px-2.5 py-1.5 text-xs font-medium text-white shadow-lg"
        >
          {text}
          <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[#0b0d12]" />
        </span>
      )}
    </span>
  );
}
