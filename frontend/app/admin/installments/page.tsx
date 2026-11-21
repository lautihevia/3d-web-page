"use client";

import { useEffect, useState } from "react";
import { Save, CheckCircle2, AlertCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { adminFetch, AdminSessionExpiredError } from "@/lib/adminAuth";
import { computeOptions, type InstallmentSettings } from "@/lib/installments";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const PRIMARY = "#3b82f6";
const EXAMPLE_PRICE = 1_000_000;

/** Los inputs guardan texto para permitir escribir "10,5" o dejar el campo vacío mientras se edita. */
interface FormState {
  creditFixedRate: string;
  debitRate: string;
  debitActive: boolean;
  plans: { installments: number; variableRate: string; active: boolean }[];
}

const toForm = (s: InstallmentSettings): FormState => ({
  creditFixedRate: String(s.creditFixedRate),
  debitRate: String(s.debitRate),
  debitActive: s.debitActive,
  plans: s.plans.map((p) => ({ ...p, variableRate: String(p.variableRate) })),
});

const parseRate = (v: string) => Number(v.replace(",", "."));

const fromForm = (f: FormState): InstallmentSettings => ({
  creditFixedRate: parseRate(f.creditFixedRate),
  debitRate: parseRate(f.debitRate),
  debitActive: f.debitActive,
  plans: f.plans.map((p) => ({ ...p, variableRate: parseRate(p.variableRate) })),
});

/** Mismo cálculo que ve el cliente, pero ignorando "activo" para previsualizar cada fila. */
function preview(settings: InstallmentSettings, installments: number | "debit"): string {
  const all = {
    ...settings,
    debitActive: true,
    plans: settings.plans.map((p) => ({ ...p, active: true })),
  };
  const rates = [all.creditFixedRate, all.debitRate, ...all.plans.map((p) => p.variableRate)];
  if (rates.some((r) => !Number.isFinite(r))) return "—";
  const o = computeOptions(EXAMPLE_PRICE, all);
  if (installments === "debit") {
    return all.debitRate < 100 ? `1 pago de $${o.debit!.total.toLocaleString("es-AR")}` : "—";
  }
  const plan = all.plans.find((p) => p.installments === installments)!;
  if (all.creditFixedRate + plan.variableRate >= 100) return "—";
  const c = o.credit.find((x) => x.installments === installments)!;
  return `${installments} × $${c.amount.toLocaleString("es-AR")}`;
}

const fmtRate = (n: number) => (Number.isFinite(n) ? `${+n.toFixed(3)}%` : "—");

const card: React.CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  border: "1px solid rgba(0,0,0,.06)",
  padding: 24,
  marginBottom: 20,
};

function RateInput({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <div style={{ position: "relative", width: 110 }}>
      <input
        aria-label={label}
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "9px 28px 9px 12px",
          borderRadius: 8,
          border: "1px solid rgba(0,0,0,.15)",
          fontSize: 14,
          fontFamily: "inherit",
          background: "#fff",
        }}
      />
      <span style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "rgba(0,0,0,.45)" }}>
        %
      </span>
    </div>
  );
}

export default function AdminInstallmentsPage() {
  const [form, setForm] = useState<FormState | null>(null);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await adminFetch(`${API_URL}/api/v1/admin/installments`);
        if (!res.ok) throw new Error();
        setForm(toForm(await res.json()));
      } catch (err) {
        if (err instanceof AdminSessionExpiredError) return;
        setLoadError("No se pudo cargar la configuración de cuotas. Verificá que el backend esté activo.");
      }
    })();
  }, []);

  const update = (patch: Partial<FormState>) => {
    setForm((f) => (f ? { ...f, ...patch } : f));
    setSaved(false);
  };
  const updatePlan = (installments: number, patch: Partial<FormState["plans"][number]>) => {
    setForm((f) =>
      f ? { ...f, plans: f.plans.map((p) => (p.installments === installments ? { ...p, ...patch } : p)) } : f
    );
    setSaved(false);
  };

  const save = async () => {
    if (!form) return;
    const body = fromForm(form);
    const rates = [body.creditFixedRate, body.debitRate, ...body.plans.map((p) => p.variableRate)];
    if (rates.some((r) => !Number.isFinite(r))) {
      setErrors(["Todos los porcentajes tienen que ser números (podés usar coma o punto)."]);
      return;
    }
    setSaving(true);
    setErrors([]);
    try {
      const res = await adminFetch(`${API_URL}/api/v1/admin/installments`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status === 400) {
        const data = await res.json().catch(() => null);
        setErrors(data?.errors ?? ["Los datos no son válidos."]);
        return;
      }
      if (!res.ok) throw new Error();
      setForm(toForm(await res.json()));
      setSaved(true);
    } catch (err) {
      if (err instanceof AdminSessionExpiredError) return;
      setErrors(["No se pudo guardar. Probá de nuevo."]);
    } finally {
      setSaving(false);
    }
  };

  if (loadError) {
    return (
      <div style={{ padding: 32, color: "#b91c1c", display: "flex", gap: 8, alignItems: "center" }}>
        <AlertCircle size={18} /> {loadError}
      </div>
    );
  }
  if (!form) return <div style={{ padding: 32, color: "rgba(0,0,0,.5)" }}>Cargando…</div>;

  const parsed = fromForm(form);

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8" style={{ maxWidth: 760 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-.02em", margin: 0 }}>Cuotas</h1>
      <p style={{ fontSize: 14, color: "rgba(0,0,0,.55)", marginTop: 6, marginBottom: 24 }}>
        Comisiones del procesador de pagos. Se aplican solo a las impresoras: el precio publicado es el de
        efectivo/transferencia y con tarjeta se cobra <code>precio ÷ (1 − tasa)</code>, redondeado a la centena.
        La vista previa usa un precio de ejemplo de ${EXAMPLE_PRICE.toLocaleString("es-AR")}.
      </p>

      {/* Débito */}
      <section style={card}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Switch checked={form.debitActive} onCheckedChange={(v) => update({ debitActive: v })} aria-label="Débito activo" />
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>Débito</div>
              <div style={{ fontSize: 12, color: "rgba(0,0,0,.5)" }}>Un solo pago</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <RateInput label="% débito" value={form.debitRate} onChange={(v) => update({ debitRate: v })} />
            <span style={{ fontSize: 13, color: "rgba(0,0,0,.55)", minWidth: 150 }}>{preview(parsed, "debit")}</span>
          </div>
        </div>
      </section>

      {/* Crédito */}
      <section style={card}>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>Crédito</div>
            <div style={{ fontSize: 12, color: "rgba(0,0,0,.5)" }}>El % fijo se suma al variable de cada plan</div>
          </div>
          <div className="flex items-center gap-3">
            <span style={{ fontSize: 13, color: "rgba(0,0,0,.6)" }}>% fijo</span>
            <RateInput label="% fijo crédito" value={form.creditFixedRate} onChange={(v) => update({ creditFixedRate: v })} />
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(0,0,0,.06)" }}>
          {form.plans.map((p) => {
            const plan = parsed.plans.find((x) => x.installments === p.installments)!;
            return (
              <div
                key={p.installments}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                style={{ borderBottom: "1px solid rgba(0,0,0,.06)", opacity: p.active ? 1 : 0.55 }}
              >
                <div className="flex items-center gap-3" style={{ minWidth: 140 }}>
                  <Switch
                    checked={p.active}
                    onCheckedChange={(v) => updatePlan(p.installments, { active: v })}
                    aria-label={`${p.installments} cuotas activo`}
                  />
                  <span style={{ fontWeight: 600, fontSize: 14 }}>
                    {p.installments} {p.installments === 1 ? "cuota" : "cuotas"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span style={{ fontSize: 12, color: "rgba(0,0,0,.5)" }}>variable</span>
                  <RateInput
                    label={`% variable ${p.installments} cuotas`}
                    value={p.variableRate}
                    onChange={(v) => updatePlan(p.installments, { variableRate: v })}
                  />
                  <span style={{ fontSize: 12, color: "rgba(0,0,0,.5)", minWidth: 80 }}>
                    tasa {fmtRate(parsed.creditFixedRate + plan.variableRate)}
                  </span>
                  <span style={{ fontSize: 13, color: "rgba(0,0,0,.65)", minWidth: 120 }}>{preview(parsed, p.installments)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {errors.length > 0 && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", borderRadius: 10, padding: "12px 16px", fontSize: 14, marginBottom: 16 }}>
          {errors.map((e) => (
            <div key={e}>{e}</div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          onClick={save}
          disabled={saving}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: PRIMARY,
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "12px 22px",
            fontSize: 14,
            fontWeight: 600,
            cursor: saving ? "default" : "pointer",
            opacity: saving ? 0.7 : 1,
            fontFamily: "inherit",
          }}
        >
          <Save size={16} />
          {saving ? "Guardando…" : "Guardar"}
        </button>
        {saved && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#16a34a", fontSize: 14 }}>
            <CheckCircle2 size={16} /> Guardado
          </span>
        )}
      </div>
    </div>
  );
}
