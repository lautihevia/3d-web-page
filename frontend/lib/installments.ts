/**
 * Planes de pago con tarjeta (feature 015). La tienda publica el precio de
 * efectivo/transferencia; con tarjeta se le suma la comisión del procesador de
 * forma que, después de que la descuente, quede limpio el precio publicado:
 *
 *   total = precio / (1 - tasa)      cuota = total / n  (redondeada a la centena)
 *
 * Los porcentajes vienen en puntos porcentuales (4.28 = 4,28%).
 */

export interface InstallmentPlan {
  installments: number;
  variableRate: number;
  active: boolean;
}

export interface InstallmentSettings {
  creditFixedRate: number;
  debitRate: number;
  debitActive: boolean;
  plans: InstallmentPlan[];
}

export interface CreditOption {
  installments: number;
  /** Monto de cada cuota. */
  amount: number;
  /** amount × installments, para que la cuenta cierre a la vista. */
  total: number;
}

export interface PaymentOptions {
  debit: { total: number } | null;
  credit: CreditOption[];
}

/** Redondea hacia arriba a la centena; el epsilon evita que 391200.0000001 salte a 391300. */
export function ceil100(n: number): number {
  return Math.ceil(n / 100 - 1e-9) * 100;
}

/** Precio que hay que cobrar para que, descontada la comisión `ratePct`, quede `price`. */
export function grossUp(price: number, ratePct: number): number {
  return price / (1 - ratePct / 100);
}

export function computeOptions(price: number, s: InstallmentSettings): PaymentOptions {
  const debit = s.debitActive ? { total: ceil100(grossUp(price, s.debitRate)) } : null;
  const credit = s.plans
    .filter((p) => p.active)
    .sort((a, b) => a.installments - b.installments)
    .map((p) => {
      const amount = ceil100(grossUp(price, s.creditFixedRate + p.variableRate) / p.installments);
      return { installments: p.installments, amount, total: amount * p.installments };
    });
  return { debit, credit };
}

export async function fetchInstallments(apiUrl: string): Promise<InstallmentSettings | null> {
  try {
    const res = await fetch(`${apiUrl}/api/v1/installments`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as InstallmentSettings;
  } catch {
    return null;
  }
}
