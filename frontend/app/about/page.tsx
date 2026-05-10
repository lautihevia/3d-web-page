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
    title: "Empezamos en un garage",
    desc: "Una Ender 3 prestada, mucha curiosidad y cero plan de negocios. Imprimíamos piezas para amigos.",
  },
  {
    year: "2022",
    title: "Abrimos el primer showroom",
    desc: "Buenos Aires. Probamos cada equipo antes de incorporarlo al catálogo. La filosofía no cambió.",
  },
  {
    year: "2024",
    title: "Sumamos electrónica y filamentos",
    desc: "Porque imprimir es solo el principio. Los makers necesitan stack completo: material, sensores, soporte.",
  },
  {
    year: "2026",
    title: "Hoy somos referentes",
    desc: "Pero seguimos pensando como en 2020. Recomendamos lo que probamos, hablamos como personas.",
  },
];

const PRINCIPLES = [
  {
    n: "01",
    t: "Curamos",
    d: "Probamos cada equipo antes de incorporarlo. Si no lo recomendaríamos a un amigo, no entra al catálogo.",
  },
  {
    n: "02",
    t: "Acompañamos",
    d: "Desde la primera consulta hasta la décima impresión, te ayudamos a sacarle todo el jugo a tu equipo.",
  },
  {
    n: "03",
    t: "Resolvemos",
    d: "Soporte técnico real con humanos. Sin tickets, sin chatbots. Hablamos como makers porque lo somos.",
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
              Pensamos
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
              vendemos
              <br />
              como tales.
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
              No somos una tienda más. Somos un equipo de gente que imprime,
              repara, modifica y rompe cosas todos los días — y comparte lo que
              aprendió.
            </p>
            <p
              style={{
                fontSize: 19,
                lineHeight: 1.6,
                color: "rgba(255,255,255,.75)",
                marginTop: 20,
              }}
            >
              Recomendamos solo lo que nos llevaríamos a casa. Cobramos lo justo.
              Respondemos como personas. Es así de simple.
            </p>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section
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
              De un garage
              <br />a un showroom.
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
              Cuatro momentos que nos definen. Sin atajos, sin marketing — solo
              cosas que pasaron.
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

      {/* CTA strip */}
      <section
        style={{ padding: "0 56px 100px", maxWidth: 1400, margin: "0 auto" }}
      >
        <div
          style={{
            background: PRIMARY,
            color: "#fff",
            borderRadius: 24,
            padding: "56px 48px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 32,
          }}
        >
          <div>
            <h3
              style={{
                fontSize: 44,
                fontWeight: 700,
                letterSpacing: "-.03em",
                margin: 0,
                lineHeight: 1,
              }}
            >
              ¿Querés conocer
              <br />
              el showroom?
            </h3>
            <p
              style={{ fontSize: 16, marginTop: 16, opacity: 0.85, maxWidth: 500 }}
            >
              Visitanos en Buenos Aires y probá los equipos en vivo. Atención
              personalizada con turno previo.
            </p>
          </div>
          <a
            href="/contact"
            style={{
              background: "#fff",
              color: PRIMARY,
              border: "none",
              padding: "16px 28px",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              flexShrink: 0,
              textDecoration: "none",
            }}
          >
            Pedir un turno →
          </a>
        </div>
      </section>
    </div>
  );
}
