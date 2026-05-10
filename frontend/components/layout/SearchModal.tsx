"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const PRIMARY = "#3b82f6";

interface SearchResult {
  id: number;
  name: string;
  brand?: string;
  variants: { price: number }[];
}

interface SearchModalProps {
  onClose: () => void;
}

export function SearchModal({ onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_URL}/api/v1/products?name=${encodeURIComponent(query)}&size=8`
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data.content || []);
        }
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 280);
    return () => clearTimeout(t);
  }, [query]);

  const go = (id: number) => {
    router.push(`/products/${id}`);
    onClose();
  };

  const showResults = query.length >= 2;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,.72)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: 100,
      }}
      onClick={onClose}
    >
      <div
        style={{ width: "100%", maxWidth: 620, margin: "0 24px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div
          style={{
            background: "#0e1222",
            border: "1px solid rgba(255,255,255,.18)",
            borderRadius: 16,
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            boxShadow: "0 24px 80px rgba(0,0,0,.5)",
          }}
        >
          <Search size={20} color={PRIMARY} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar productos..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: 18,
              color: "#fff",
              fontFamily: "inherit",
            }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              style={{
                background: "rgba(255,255,255,.08)",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                color: "rgba(255,255,255,.6)",
                display: "flex",
                padding: 4,
              }}
            >
              <X size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(255,255,255,.4)",
              display: "flex",
              fontSize: 12,
              fontFamily: "inherit",
            }}
          >
            ESC
          </button>
        </div>

        {/* Results panel */}
        {showResults && (
          <div
            style={{
              background: "#0e1222",
              border: "1px solid rgba(255,255,255,.1)",
              borderRadius: 14,
              marginTop: 8,
              overflow: "hidden",
              boxShadow: "0 24px 80px rgba(0,0,0,.4)",
            }}
          >
            {loading && (
              <div
                style={{
                  padding: "24px",
                  color: "rgba(255,255,255,.45)",
                  textAlign: "center",
                  fontSize: 14,
                }}
              >
                Buscando...
              </div>
            )}

            {!loading && results.length > 0 && (
              <>
                <div
                  style={{
                    padding: "10px 20px 8px",
                    fontSize: 11,
                    letterSpacing: ".12em",
                    color: "rgba(255,255,255,.35)",
                    fontFamily: "var(--font-geist-mono), monospace",
                    textTransform: "uppercase",
                    borderBottom: "1px solid rgba(255,255,255,.06)",
                  }}
                >
                  {results.length} resultado{results.length !== 1 ? "s" : ""}
                </div>
                {results.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => go(r.id)}
                    onMouseEnter={() => setHoveredId(r.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      width: "100%",
                      padding: "14px 20px",
                      background:
                        hoveredId === r.id
                          ? "rgba(255,255,255,.05)"
                          : "transparent",
                      border: "none",
                      borderBottom: "1px solid rgba(255,255,255,.05)",
                      cursor: "pointer",
                      textAlign: "left",
                      color: "#fff",
                      fontFamily: "inherit",
                      transition: "background .12s",
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        background: `${PRIMARY}18`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Search size={14} color={PRIMARY} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{r.name}</div>
                      {r.brand && (
                        <div
                          style={{
                            fontSize: 12,
                            color: "rgba(255,255,255,.45)",
                            marginTop: 2,
                          }}
                        >
                          {r.brand}
                        </div>
                      )}
                    </div>
                    {r.variants[0]?.price && (
                      <div
                        style={{
                          fontSize: 15,
                          color: PRIMARY,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        ${r.variants[0].price.toLocaleString("es-AR")}
                      </div>
                    )}
                  </button>
                ))}
              </>
            )}

            {!loading && results.length === 0 && (
              <div
                style={{
                  padding: "28px 20px",
                  textAlign: "center",
                  color: "rgba(255,255,255,.45)",
                  fontSize: 14,
                }}
              >
                Sin resultados para &ldquo;{query}&rdquo;
              </div>
            )}
          </div>
        )}

        {!showResults && (
          <p
            style={{
              textAlign: "center",
              fontSize: 13,
              color: "rgba(255,255,255,.25)",
              marginTop: 16,
            }}
          >
            Escribí al menos 2 caracteres para buscar
          </p>
        )}
      </div>
    </div>
  );
}
