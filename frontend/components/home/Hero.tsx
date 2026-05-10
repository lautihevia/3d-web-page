"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const PRIMARY = "#3b82f6";

const SLIDES = [
  {
    id: 1,
    title: "Nuestro taller",
    desc: "Donde imprimimos, testeamos y aprendemos todos los días.",
    src: "/banners/NuestroTaller.mp4",
  },
  {
    id: 2,
    title: "Equipos en acción",
    desc: "Máquinas corriendo, piezas saliendo, makers trabajando.",
    src: "/banners/EquiposEnAccion.mp4",
  },
  {
    id: 3,
    title: "Hecho acá",
    desc: "Tecnología que probamos antes de recomendarla.",
    src: "/banners/HechoAca.mp4",
  },
  {
    id: 4,
    title: "Confiabilidad probada",
    desc: "Equipos que usamos nosotros antes de recomendarte.",
    src: "/banners/ConfiabilidadMOV.mp4",
  },
];

function isVideo(src: string) {
  return /\.(mp4|webm|ogg)$/i.test(src);
}

export function Hero() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 4500);
    return () => clearInterval(id);
  }, [paused]);

  // Control video play/pause when slide changes or paused state changes
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === idx && !paused) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [idx, paused]);

  const slide = SLIDES[idx];

  return (
    <section
      style={{
        background: "#0a0d18",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Radial glow background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 20% 100%, ${PRIMARY}55, transparent 50%), radial-gradient(circle at 90% 0%, ${PRIMARY}33, transparent 40%)`,
          pointerEvents: "none",
        }}
      />
      {/* Grid pattern */}
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
        className="rsp-hero-grid"
        style={{
          position: "relative",
          padding: "110px 48px 130px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "center",
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        {/* Left: Text content */}
        <div>
          <h1
            style={{
              fontSize: "clamp(40px, 5.5vw, 84px)",
              lineHeight: 0.96,
              margin: 0,
              fontWeight: 700,
              letterSpacing: "-.03em",
            }}
          >
            Hardware{" "}
            <span style={{ color: PRIMARY }}>para hacer</span>
            <br />
            cosas reales.
          </h1>

          <p
            style={{
              fontSize: 18,
              color: "rgba(255,255,255,.65)",
              maxWidth: 460,
              marginTop: 28,
              lineHeight: 1.55,
            }}
          >
            Curamos las mejores marcas de impresión 3D y electrónica. Mirá los
            productos, consultá precios y recibí asesoramiento técnico real.
          </p>

          <div style={{ display: "flex", gap: 12, marginTop: 36, flexWrap: "wrap" }}>
            <Link
              href="/#productos"
              style={{
                background: PRIMARY,
                color: "#fff",
                padding: "14px 22px",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 14,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                textDecoration: "none",
              }}
            >
              Ver productos <ArrowRight size={16} />
            </Link>
            <Link
              href="/contact"
              style={{
                background: "transparent",
                color: "#fff",
                border: "1px solid rgba(255,255,255,.2)",
                padding: "14px 22px",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
              }}
            >
              Contactanos
            </Link>
          </div>
        </div>

        {/* Right: Featured Carousel */}
        <div
          style={{ position: "relative" }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Glow behind carousel */}
          <div
            style={{
              position: "absolute",
              inset: -20,
              background: `radial-gradient(circle, ${PRIMARY}33, transparent 70%)`,
              filter: "blur(40px)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "relative",
              background: "rgba(255,255,255,.04)",
              border: "1px solid rgba(255,255,255,.1)",
              borderRadius: 18,
              padding: 12,
              overflow: "hidden",
            }}
          >
            {/* Slides container */}
            <div style={{ position: "relative", aspectRatio: "4/3" }}>
              {SLIDES.map((s, i) => (
                <div
                  key={s.id}
                  style={{
                    position: i === 0 ? "relative" : "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    opacity: i === idx ? 1 : 0,
                    transition: "opacity .6s ease",
                    pointerEvents: i === idx ? "auto" : "none",
                    borderRadius: 10,
                    overflow: "hidden",
                  }}
                >
                  {isVideo(s.src) ? (
                    <video
                      ref={(el) => { videoRefs.current[i] = el; }}
                      src={s.src}
                      autoPlay={i === 0}
                      loop
                      muted
                      playsInline
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  ) : (
                    <Image
                      src={s.src}
                      alt={s.title}
                      fill
                      className="object-cover"
                      priority={i === 0}
                    />
                  )}
                </div>
              ))}

              {/* Slide counter */}
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: 10,
                  letterSpacing: ".12em",
                  color: "rgba(255,255,255,.8)",
                  background: "rgba(0,0,0,.5)",
                  padding: "4px 8px",
                  borderRadius: 6,
                  backdropFilter: "blur(4px)",
                  zIndex: 10,
                }}
              >
                {String(idx + 1).padStart(2, "0")} /{" "}
                {String(SLIDES.length).padStart(2, "0")}
              </div>

              {/* Prev arrow */}
              <button
                onClick={() => setIdx((i) => (i - 1 + SLIDES.length) % SLIDES.length)}
                style={{
                  position: "absolute", top: "50%", left: 12,
                  transform: "translateY(-50%)",
                  width: 36, height: 36, borderRadius: "50%",
                  border: "none", cursor: "pointer",
                  background: "rgba(0,0,0,.55)", color: "#fff",
                  fontSize: 22, lineHeight: 1,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  backdropFilter: "blur(8px)", zIndex: 10,
                }}
              >
                ‹
              </button>

              {/* Next arrow */}
              <button
                onClick={() => setIdx((i) => (i + 1) % SLIDES.length)}
                style={{
                  position: "absolute", top: "50%", right: 12,
                  transform: "translateY(-50%)",
                  width: 36, height: 36, borderRadius: "50%",
                  border: "none", cursor: "pointer",
                  background: "rgba(0,0,0,.55)", color: "#fff",
                  fontSize: 22, lineHeight: 1,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  backdropFilter: "blur(8px)", zIndex: 10,
                }}
              >
                ›
              </button>
            </div>

            {/* Caption */}
            <div style={{ padding: "18px 8px 6px" }}>
              <div style={{ fontWeight: 700, fontSize: 20, letterSpacing: "-.02em" }}>
                {slide.title}
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.55)", marginTop: 4 }}>
                {slide.desc}
              </div>
            </div>

            {/* Dot indicators */}
            <div style={{ display: "flex", gap: 6, padding: "8px 8px 4px" }}>
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  style={{
                    flex: i === idx ? "0 0 28px" : "0 0 14px",
                    height: 4, borderRadius: 999,
                    border: "none", cursor: "pointer",
                    background: i === idx ? PRIMARY : "rgba(255,255,255,.2)",
                    transition: ".3s", padding: 0,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
