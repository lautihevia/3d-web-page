"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";

const PRIMARY = "#3b82f6";

const CONTACT_INFO = [
  {
    icon: <Mail size={18} />,
    label: "Email",
    value: "contacto@3dencasa.com",
  },
  {
    icon: <Phone size={18} />,
    label: "Teléfono",
    value: "+54 11 1234-5678",
  },
  {
    icon: <MapPin size={18} />,
    label: "Showroom",
    value: "Buenos Aires, Argentina",
  },
  {
    icon: <span style={{ fontSize: 18 }}>◷</span>,
    label: "Horarios",
    value: "Lun-Vie 9-18 · Sáb 10-14",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    asunto: "consulta",
    mensaje: "",
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const valid =
    form.nombre.length >= 2 &&
    form.email.includes("@") &&
    form.mensaje.length > 4;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  };

  return (
    <div
      style={{
        background: "#f7f6f1",
        minHeight: "100vh",
        fontFamily: "inherit",
        color: "#0b0d12",
      }}
    >
      {/* Dark page hero */}
      <div
        style={{
          background: "#0a0d18",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at 15% 100%, ${PRIMARY}55, transparent 55%), radial-gradient(circle at 90% 0%, ${PRIMARY}33, transparent 45%)`,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "relative",
            padding: "32px 56px 48px",
            maxWidth: 1400,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              color: "rgba(255,255,255,.55)",
            }}
          >
            <span>Inicio</span>
            <span>›</span>
            <span style={{ color: "#fff" }}>Contacto</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <section
        style={{
          padding: "48px 56px 80px",
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: 64,
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        {/* Left: Info */}
        <div>
          <div
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: 11,
              letterSpacing: ".18em",
              textTransform: "uppercase",
              color: "rgba(0,0,0,.5)",
              marginBottom: 18,
            }}
          >
            ── Contacto · respondemos en menos de 24h
          </div>
          <h1
            style={{
              fontSize: "clamp(48px, 5vw, 72px)",
              fontWeight: 700,
              letterSpacing: "-.03em",
              lineHeight: 1,
              margin: 0,
            }}
          >
            ¿Tenés una idea?
            <br />
            <span style={{ color: PRIMARY }}>La imprimimos.</span>
          </h1>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.55,
              color: "rgba(0,0,0,.65)",
              maxWidth: 540,
              marginTop: 24,
            }}
          >
            Mandanos tu consulta — pedido a medida, asesoramiento técnico,
            presupuestos o lo que necesites. Hablamos como personas, no como
            bots.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              gap: 16,
              marginTop: 40,
            }}
          >
            {CONTACT_INFO.map((c) => (
              <div
                key={c.label}
                style={{
                  background: "#fff",
                  padding: 20,
                  borderRadius: 14,
                  border: "1px solid rgba(0,0,0,.05)",
                  display: "flex",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: `${PRIMARY}15`,
                    color: PRIMARY,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {c.icon}
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "rgba(0,0,0,.55)" }}>
                    {c.label}
                  </div>
                  <div style={{ fontWeight: 600, marginTop: 2 }}>{c.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Form */}
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: 32,
            border: "1px solid rgba(0,0,0,.05)",
            boxShadow: "0 12px 40px rgba(0,0,0,.04)",
            alignSelf: "flex-start",
            position: "sticky",
            top: 16,
          }}
        >
          {sent ? (
            <div style={{ padding: "40px 0", textAlign: "center" }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: `${PRIMARY}15`,
                  color: PRIMARY,
                  fontSize: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                ✓
              </div>
              <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
                ¡Mensaje enviado!
              </h3>
              <p style={{ color: "rgba(0,0,0,.6)", marginTop: 8 }}>
                Te respondemos en menos de 24hs.
              </p>
              <button
                onClick={() => {
                  setSent(false);
                  setForm({
                    nombre: "",
                    email: "",
                    asunto: "consulta",
                    mensaje: "",
                  });
                }}
                style={{
                  background: PRIMARY,
                  color: "#fff",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: 10,
                  fontWeight: 600,
                  cursor: "pointer",
                  marginTop: 12,
                  fontFamily: "inherit",
                }}
              >
                Enviar otro
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h3 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700 }}>
                Mandanos un mensaje
              </h3>
              <p
                style={{
                  margin: "0 0 24px",
                  fontSize: 14,
                  color: "rgba(0,0,0,.55)",
                }}
              >
                * Campos requeridos
              </p>

              {(
                [
                  {
                    label: "Nombre *",
                    key: "nombre" as const,
                    placeholder: "Tu nombre completo",
                    type: "text",
                  },
                  {
                    label: "Email *",
                    key: "email" as const,
                    placeholder: "tu@email.com",
                    type: "email",
                  },
                ] as const
              ).map(({ label, key, placeholder, type }) => (
                <div key={key} style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 600,
                      marginBottom: 6,
                    }}
                  >
                    {label}
                  </label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                    placeholder={placeholder}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "1px solid rgba(0,0,0,.1)",
                      fontSize: 14,
                      fontFamily: "inherit",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              ))}

              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 6,
                  }}
                >
                  Asunto
                </label>
                <select
                  value={form.asunto}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, asunto: e.target.value }))
                  }
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid rgba(0,0,0,.1)",
                    background: "#fff",
                    fontSize: 14,
                    fontFamily: "inherit",
                    outline: "none",
                  }}
                >
                  <option value="consulta">Consulta general</option>
                  <option value="presupuesto">Pedido de presupuesto</option>
                  <option value="impresion">Impresión a medida</option>
                  <option value="soporte">Soporte técnico</option>
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 6,
                  }}
                >
                  Mensaje *
                </label>
                <textarea
                  value={form.mensaje}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, mensaje: e.target.value }))
                  }
                  rows={5}
                  placeholder="Contanos en qué te podemos ayudar…"
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: 10,
                    border: "1px solid rgba(0,0,0,.1)",
                    fontSize: 14,
                    fontFamily: "inherit",
                    resize: "vertical",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={!valid || loading}
                style={{
                  width: "100%",
                  background: valid && !loading ? PRIMARY : "rgba(0,0,0,.1)",
                  color: valid && !loading ? "#fff" : "rgba(0,0,0,.4)",
                  border: "none",
                  padding: "14px",
                  borderRadius: 12,
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: valid && !loading ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: ".2s",
                  fontFamily: "inherit",
                }}
              >
                {loading ? (
                  "Enviando..."
                ) : (
                  <>
                    Enviar mensaje <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
