"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";
import { CatalogFilters } from "./CatalogFilters";

/**
 * Acceso a los filtros del catálogo en pantallas chicas, donde la barra
 * lateral se oculta. Mismo patrón que MobileFilterDrawer de las páginas de
 * marca, para que todas las categorías tengan filtros en el celular.
 */
export function CatalogFilterDrawer({ category }: { category?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "#fff",
          border: "1px solid rgba(0,0,0,.12)",
          borderRadius: 10,
          padding: "10px 18px",
          fontSize: 14,
          fontWeight: 600,
          color: "#0b0d12",
          cursor: "pointer",
          fontFamily: "inherit",
          boxShadow: "0 1px 4px rgba(0,0,0,.06)",
        }}
      >
        <Filter size={15} />
        Filtros
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              background: "rgba(0,0,0,.45)",
              zIndex: 400,
            }}
          />

          {/* Panel */}
          <div
            style={{
              position: "fixed",
              top: 0, left: 0, bottom: 0,
              width: 300,
              maxWidth: "88vw",
              background: "#fff",
              zIndex: 401,
              overflowY: "auto",
              overflowX: "hidden",
              boxShadow: "6px 0 32px rgba(0,0,0,.18)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 20px 16px",
                borderBottom: "1px solid rgba(0,0,0,.08)",
                position: "sticky",
                top: 0,
                background: "#fff",
                zIndex: 1,
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 700, color: "#0b0d12" }}>
                Filtros
              </span>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: "rgba(0,0,0,.06)",
                  border: "none",
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#0b0d12",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* "Aplicar filtros" navega y cierra el drawer. */}
            <div style={{ padding: "16px 16px 32px" }}>
              <CatalogFilters
                category={category}
                compact
                onApplied={() => setOpen(false)}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
