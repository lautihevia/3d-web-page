import { Fragment } from "react";

const PRIMARY = "#3b82f6";

const STATS = [
  ["+5000", "clientes felices"],
  ["+12K", "piezas impresas"],
  ["5", "marcas curadas"],
  ["100%", "soporte humano"],
];

const TIMELINE = [
  {
    year: "2020",
    title: "Nace la primera chispa",
    desc: "Una sola Ender 3, un filamento PLA blanco y ganas infinitas de experimentar y aprender.",
  },
  {
    year: "2022",
    title: "Ampliamos el taller",
    desc: "Sumamos nuevas máquinas al ecosistema y empezamos a dominar diferentes materiales e insumos.",
  },
  {
    year: "2024",
    title: "Compartimos la solución",
    desc: "Empezamos a distribuir repuestos y filamentos en baja escala para ayudar a otros makers.",
  },
  {
    year: "2026",
    title: "Abastecemos a la comunidad",
    desc: "Escalamos a nivel nacional con stock permanente de impresoras, componentes y soporte técnico real.",
  },
];

const PRINCIPLES = [
  {
    n: "01",
    t: "Testeamos",
    d: "No vendemos cajas cerradas a ciegas. Pasamos horas probando cada impresora y filamento; si no supera nuestras exigencias en el taller, no entra a la tienda.",
  },
  {
    n: "02",
    t: "Acompañamos",
    d: "Estamos con vos ante cualquier duda, desde la calibración inicial hasta tu impresión más compleja. Te ayudamos a resolver problemas de maker a maker, sin vueltas.",
  },
  {
    n: "03",
    t: "Respondemos",
    d: "Olvidate de los catálogos vacíos. Si necesitás un repuesto urgente o te quedás sin insumos a mitad de un proyecto, tenemos stock real y permanente en todo el país.",
  },
];

export default function AboutPage() {
  return (
    <div
      style={{
        background: "#0a0d18",
        color: "#fff",
        minHeight: "100vh",
        fontFamily: "inherit",
      }}
    >
      {/* Manifesto hero */}
      <section
        className="rsp-section-pad"
        style={{
          position: "relative",
          padding: "88px 56px 100px",
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 900px 650px at 100% 0%, ${PRIMARY}30, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
        <div
          className="rsp-2col"
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "flex-end",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: 11,
                letterSpacing: ".18em",
                color: PRIMARY,
                marginBottom: 24,
                textTransform: "uppercase",
              }}
            >
              // Manifesto · Desde 2020
            </div>
            <h1
              style={{
                fontSize: "clamp(64px, 7vw, 96px)",
                lineHeight: 0.92,
                fontWeight: 700,
                letterSpacing: "-.04em",
                margin: 0,
              }}
            >
              Creamos
              <br />
              como{" "}
              <em
                style={{
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: PRIMARY,
                }}
              >
                makers,
              </em>
              <br />
              respaldamos
              <br />
              como profesionales.
            </h1>
          </div>
          <div>
            <p
              style={{
                fontSize: 19,
                lineHeight: 1.6,
                color: "rgba(255,255,255,.75)",
                margin: 0,
              }}
            >
              No abrimos una tienda tradicional. Pasamos por todas las fallas,
              pruebas y frustraciones que trae la impresión 3D en el día a día —
              y acumulamos el conocimiento necesario para guiarte.
            </p>
            <p
              style={{
                fontSize: 19,
                lineHeight: 1.6,
                color: "rgba(255,255,255,.75)",
                marginTop: 20,
              }}
            >
              Elegimos traer solo los insumos que superaron nuestras exigencias.
              Valores transparentes. Te ayudamos a resolver cualquier problema
              de maker a maker. Garantizado.
            </p>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section
        className="rsp-stats-4col"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          borderTop: "1px solid rgba(255,255,255,.08)",
          borderBottom: "1px solid rgba(255,255,255,.08)",
        }}
      >
        {STATS.map(([n, l], i) => (
          <div
            key={l}
            style={{
              padding: "36px 32px",
              borderRight: i < 3 ? "1px solid rgba(255,255,255,.08)" : "none",
            }}
          >
            <div
              style={{
                fontSize: 56,
                fontWeight: 700,
                color: PRIMARY,
                letterSpacing: "-.03em",
                lineHeight: 1,
              }}
            >
              {n}
            </div>
            <div
              style={{ fontSize: 14, color: "rgba(255,255,255,.6)", marginTop: 8 }}
            >
              {l}
            </div>
          </div>
        ))}
      </section>

      {/* Timeline */}
      <section
        className="rsp-section-pad"
        style={{ padding: "100px 56px 80px", maxWidth: 1400, margin: "0 auto" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: 56,
            marginBottom: 60,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: 11,
                letterSpacing: ".18em",
                color: PRIMARY,
                marginBottom: 16,
                textTransform: "uppercase",
              }}
            >
              // Línea de tiempo
            </div>
            <h2
              style={{
                fontSize: 52,
                fontWeight: 700,
                letterSpacing: "-.03em",
                margin: 0,
                lineHeight: 1,
              }}
            >
              De la primera pieza
              <br />a todo el país.
            </h2>
          </div>
          <div style={{ alignSelf: "flex-end" }}>
            <p
              style={{
                fontSize: 17,
                color: "rgba(255,255,255,.65)",
                margin: 0,
                lineHeight: 1.6,
                maxWidth: 500,
              }}
            >
              Cuatro hitos de nuestro camino. Sin vueltas, sin misterios — solo
              nuestra historia real.
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 32 }}>
          {TIMELINE.map((step, i) => (
            <Fragment key={step.year}>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: 32,
                    fontWeight: 700,
                    color: PRIMARY,
                    letterSpacing: "-.02em",
                  }}
                >
                  {step.year}
                </div>
                {i < TIMELINE.length - 1 && (
                  <div
                    style={{
                      position: "absolute",
                      top: 48,
                      bottom: -32,
                      left: 12,
                      width: 1,
                      background: "rgba(255,255,255,.15)",
                    }}
                  />
                )}
              </div>
              <div
                style={{
                  paddingBottom: 32,
                  borderBottom:
                    i < TIMELINE.length - 1
                      ? "1px solid rgba(255,255,255,.08)"
                      : "none",
                  marginBottom: i < TIMELINE.length - 1 ? 32 : 0,
                }}
              >
                <h3
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    letterSpacing: "-.02em",
                    margin: "0 0 12px",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: 16,
                    color: "rgba(255,255,255,.65)",
                    lineHeight: 1.6,
                    margin: 0,
                    maxWidth: 600,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            </Fragment>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section
        className="rsp-section-pad"
        style={{ padding: "40px 56px 100px", maxWidth: 1400, margin: "0 auto" }}
      >
        <div
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: 11,
            letterSpacing: ".18em",
            color: PRIMARY,
            marginBottom: 16,
            textTransform: "uppercase",
          }}
        >
          // Cómo trabajamos
        </div>
        <h2
          style={{
            fontSize: 52,
            fontWeight: 700,
            letterSpacing: "-.03em",
            margin: "0 0 48px",
            maxWidth: 700,
            lineHeight: 1,
          }}
        >
          Tres reglas. Sin asteriscos.
        </h2>
        <div
          className="rsp-3col-to-1"
          style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}
        >
          {PRINCIPLES.map((s) => (
            <div
              key={s.n}
              style={{
                background: "rgba(255,255,255,.03)",
                border: "1px solid rgba(255,255,255,.08)",
                borderRadius: 18,
                padding: 28,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: 13,
                  color: PRIMARY,
                  marginBottom: 18,
                }}
              >
                {s.n} ──
              </div>
              <h3
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  letterSpacing: "-.02em",
                  margin: "0 0 12px",
                }}
              >
                {s.t}
              </h3>
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,.65)",
                  margin: 0,
                }}
              >
                {s.d}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
