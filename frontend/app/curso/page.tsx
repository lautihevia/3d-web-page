import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, Play } from "lucide-react";
import { CHANNEL_URL, fetchCourseVideos } from "@/lib/courseVideos";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const PRIMARY = "#3b82f6";
const YT_RED = "#ff0033";
const SUBSCRIBE_URL = `${CHANNEL_URL}?sub_confirmation=1`;

export const metadata: Metadata = {
  title: "Curso de impresión 3D gratis | 3D en Casa",
  description: "Curso de impresión 3D desde cero, en videos y totalmente gratis.",
};

const mono: React.CSSProperties = {
  fontFamily: "var(--font-geist-mono), monospace",
  fontSize: 11,
  letterSpacing: ".18em",
  color: PRIMARY,
  textTransform: "uppercase",
};

export default async function CoursePage() {
  const videos = await fetchCourseVideos(API_URL);

  return (
    <div style={{ background: "#0a0d18", color: "#fff", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Brillo azul de fondo, como en "Sobre nosotros" */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 900px 650px at 100% 0%, ${PRIMARY}30, transparent 70%), radial-gradient(ellipse 700px 500px at 0% 60%, ${PRIMARY}18, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Hero */}
      <section
        className="rsp-section-pad"
        style={{ position: "relative", padding: "40px 56px 56px", maxWidth: 1400, margin: "0 auto" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,.5)", marginBottom: 40 }}>
          <Link href="/" style={{ color: "rgba(255,255,255,.5)", textDecoration: "none" }}>
            Inicio
          </Link>
          <span>›</span>
          <span style={{ color: "#fff" }}>Curso</span>
        </div>

        <div className="rsp-2col course-hero" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 64, alignItems: "start" }}>
          <div>
            <div style={{ ...mono, marginBottom: 24 }}>{"// Curso de impresión 3D · Gratis"}</div>
            <h1
              style={{
                fontSize: "clamp(52px, 6.5vw, 88px)",
                lineHeight: 0.95,
                fontWeight: 700,
                letterSpacing: "-.04em",
                margin: 0,
              }}
            >
              Aprendé a imprimir en 3D{" "}
              <em style={{ fontStyle: "italic", fontWeight: 400, color: PRIMARY }}>desde cero.</em>
            </h1>
          </div>

          <div>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: "rgba(255,255,255,.75)", margin: 0 }}>
              Un curso en videos, paso a paso: qué es una impresora 3D, cuál elegir, qué filamentos usar y mucho más.
              Las clases están en nuestro canal de YouTube.
            </p>

            <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
              <a
                href={SUBSCRIBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: YT_RED,
                  color: "#fff",
                  padding: "13px 22px",
                  borderRadius: 999,
                  fontWeight: 600,
                  fontSize: 14,
                  textDecoration: "none",
                }}
              >
                <Play size={15} fill="#fff" color="#fff" />
                Suscribite al canal
              </a>
              <a
                href={CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  border: "1px solid rgba(255,255,255,.25)",
                  color: "#fff",
                  padding: "13px 22px",
                  borderRadius: 999,
                  fontWeight: 600,
                  fontSize: 14,
                  textDecoration: "none",
                }}
              >
                Ver el canal
                <ArrowUpRight size={15} />
              </a>
            </div>

            {/* Temario desplegable */}
            {videos.length > 0 && (
              <details className="course-syllabus" style={{ marginTop: 24 }}>
                <summary
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "14px 18px",
                    borderRadius: 12,
                    background: "rgba(255,255,255,.05)",
                    border: "1px solid rgba(255,255,255,.1)",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  <span>
                    Temario del curso{" "}
                    <span style={{ color: "rgba(255,255,255,.5)", fontWeight: 400 }}>
                      · {videos.length} {videos.length === 1 ? "video" : "videos"}
                    </span>
                  </span>
                  <ChevronDown size={18} className="course-syllabus-chevron" />
                </summary>
                <ol
                  style={{
                    listStyle: "none",
                    margin: "8px 0 0",
                    padding: 6,
                    borderRadius: 12,
                    background: "rgba(255,255,255,.03)",
                    border: "1px solid rgba(255,255,255,.08)",
                  }}
                >
                  {videos.map((v) => (
                    <li key={v.id}>
                      <a
                        href={v.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="course-syllabus-item"
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          gap: 12,
                          padding: "10px 12px",
                          borderRadius: 8,
                          color: "#fff",
                          textDecoration: "none",
                          fontSize: 14,
                        }}
                      >
                        <span style={{ ...mono, fontSize: 10, letterSpacing: ".12em", minWidth: 92, flexShrink: 0 }}>
                          {v.label ?? ""}
                        </span>
                        <span style={{ flex: 1, color: "rgba(255,255,255,.85)" }}>{v.title}</span>
                        <ArrowUpRight size={14} style={{ flexShrink: 0, opacity: 0.5 }} />
                      </a>
                    </li>
                  ))}
                </ol>
              </details>
            )}
          </div>
        </div>
      </section>

      {/* Clases */}
      <section
        className="rsp-section-pad"
        style={{
          position: "relative",
          padding: "48px 56px 100px",
          maxWidth: 1400,
          margin: "0 auto",
          borderTop: "1px solid rgba(255,255,255,.08)",
        }}
      >
        <div style={{ ...mono, marginBottom: 24 }}>{"// Clases"}</div>

        {videos.length > 0 ? (
          <div className="rsp-3col-to-1" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {videos.map((v) => (
              <a
                key={v.id}
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                className="course-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "rgba(255,255,255,.04)",
                  borderRadius: 16,
                  border: "1px solid rgba(255,255,255,.08)",
                  overflow: "hidden",
                  textDecoration: "none",
                  color: "#fff",
                }}
              >
                <div style={{ position: "relative", aspectRatio: "16 / 9", background: "#000", overflow: "hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- miniatura liviana de YouTube */}
                  <img
                    src={v.thumbnailUrl}
                    alt={v.title}
                    loading="lazy"
                    className="course-thumb"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: 60,
                      height: 42,
                      borderRadius: 12,
                      background: YT_RED,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 6px 20px rgba(0,0,0,.35)",
                    }}
                  >
                    <Play size={20} fill="#fff" color="#fff" />
                  </span>
                </div>
                <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
                  {v.label && <div style={{ ...mono, letterSpacing: ".14em", fontWeight: 600, marginBottom: 8 }}>{v.label}</div>}
                  <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-.01em", lineHeight: 1.25 }}>{v.title}</div>
                  {v.description && (
                    <p style={{ fontSize: 14, color: "rgba(255,255,255,.6)", lineHeight: 1.5, margin: "8px 0 0" }}>{v.description}</p>
                  )}
                  <div
                    style={{
                      marginTop: "auto",
                      paddingTop: 16,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 13,
                      fontWeight: 600,
                      color: "rgba(255,255,255,.7)",
                    }}
                  >
                    Ver en YouTube <ArrowUpRight size={15} />
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: 60,
              textAlign: "center",
              background: "rgba(255,255,255,.04)",
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: 16,
              color: "rgba(255,255,255,.6)",
            }}
          >
            Pronto vas a encontrar acá las clases del curso.
          </div>
        )}
      </section>
    </div>
  );
}
