"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";
import { FilterSidebar } from "./FilterSidebar";

const PRIMARY = "#3b82f6";

interface MobileFilterDrawerProps {
  brand: string;
}

export function MobileFilterDrawer({ brand }: MobileFilterDrawerProps) {
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

          {/* Drawer panel */}
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
            {/* Drawer header */}
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

            {/* Filter content */}
            <div style={{ padding: "16px 16px 32px" }}>
              <FilterSidebar brand={brand} compact />
            </div>

            {/* Apply button */}
            <div
              style={{
                position: "sticky",
                bottom: 0,
                background: "#fff",
                padding: "12px 16px 20px",
                borderTop: "1px solid rgba(0,0,0,.06)",
              }}
            >
              <button
                onClick={() => setOpen(false)}
                style={{
                  width: "100%",
                  background: PRIMARY,
                  color: "#fff",
                  border: "none",
                  padding: "13px",
                  borderRadius: 12,
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Ver resultados
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
