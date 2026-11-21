"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { computeOptions, type InstallmentSettings } from "@/lib/installments";

function formatPrice(n: number): string {
  return "$" + n.toLocaleString("es-AR");
}

/**
 * "Ver planes de cuotas" desplegable dentro del bloque de precio de las
 * impresoras. Si no hay ningún plan activo no renderiza nada.
 */
export function InstallmentPlans({ price, settings }: { price: number; settings: InstallmentSettings }) {
  const [open, setOpen] = useState(false);
  const { debit, credit } = computeOptions(price, settings);
  if (!debit && credit.length === 0) return null;

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="inline-flex items-center gap-1 text-sm font-semibold text-[#3b82f6] hover:underline"
      >
        <ChevronRight size={16} className={`transition-transform duration-200 ${open ? "rotate-90" : ""}`} />
        Ver planes de cuotas
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="space-y-4 pt-3">
            {debit && (
              <section>
                <h3 className="mb-2 text-[11px] font-semibold tracking-wider text-black/45">DÉBITO</h3>
                <div className="rounded-lg border border-black/10 px-3.5 py-2.5 text-sm">
                  1 pago de <strong className="font-semibold">{formatPrice(debit.total)}</strong>
                </div>
              </section>
            )}
            {credit.length > 0 && (
              <section>
                <h3 className="mb-2 text-[11px] font-semibold tracking-wider text-black/45">CRÉDITO</h3>
                <ul className="space-y-2">
                  {credit.map((c) => (
                    <li
                      key={c.installments}
                      className="flex flex-col rounded-lg border border-black/10 px-3.5 py-2.5 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-3"
                    >
                      <span>
                        {c.installments} {c.installments === 1 ? "cuota" : "cuotas"} de{" "}
                        <strong className="font-semibold">{formatPrice(c.amount)}</strong>
                      </span>
                      {c.installments > 1 && (
                        <span className="text-xs text-black/50">Total {formatPrice(c.total)}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
