"use client";

import Link from "next/link";
import { Search, ChevronDown } from "lucide-react";
import { useState, useRef } from "react";
import { SearchModal } from "./SearchModal";

const PRIMARY = "#3b82f6";

const IMPRESORAS = [
  { label: "Bambu Lab", href: "/store/bambu lab", tag: "Premium" },
  { label: "Creality", href: "/store/creality", tag: "Profesional" },
  { label: "Anycubic", href: "/store/anycubic", tag: "Accesible" },
];

const INSUMOS = [
  { label: "Filamentos", href: "/store/filamentos" },
  { label: "Electrónica", href: "/store/electronica" },
  { label: "Herramientas", href: "/store/herramientas" },
];

interface DropdownProps {
  label: string;
  items: { label: string; href: string; tag?: string }[];
}

function NavDropdown({ label, items }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const enter = () => {
    clearTimeout(timer.current);
    setOpen(true);
  };

  const leave = () => {
    timer.current = setTimeout(() => setOpen(false), 180);
  };

  return (
    <div style={{ position: "relative" }} onMouseEnter={enter} onMouseLeave={leave}>
      <button
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 500,
          color: open ? "#fff" : "rgba(255,255,255,.75)",
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontFamily: "inherit",
          padding: 0,
          transition: "color .15s",
        }}
      >
        {label}
        <ChevronDown
          size={14}
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform .2s",
            opacity: 0.6,
          }}
        />
      </button>

      {/* Invisible bridge between button and panel so hover doesn't break */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "max(100%, 220px)",
            paddingTop: 10,
            zIndex: 100,
          }}
          onMouseEnter={enter}
          onMouseLeave={leave}
        >
          {/* Arrow notch */}
          <div
            style={{
              width: 12,
              height: 6,
              margin: "0 auto",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                background: "#0c0f1e",
                border: "1px solid rgba(255,255,255,.1)",
                transform: "rotate(45deg)",
                margin: "3px auto 0",
              }}
            />
          </div>

          <div
            style={{
              background: "#0c0f1e",
              border: "1px solid rgba(255,255,255,.1)",
              borderRadius: 14,
              padding: 8,
              boxShadow: "0 20px 60px rgba(0,0,0,.6)",
            }}
          >
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderRadius: 8,
                  color: "rgba(255,255,255,.8)",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.07)";
                  (e.currentTarget as HTMLElement).style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,.8)";
                }}
              >
                {item.label}
                {item.tag && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: PRIMARY,
                      background: `${PRIMARY}18`,
                      padding: "2px 6px",
                      borderRadius: 999,
                      letterSpacing: ".04em",
                    }}
                  >
                    {item.tag}
                  </span>
                )}
              </Link>
            ))}

            <div style={{ borderTop: "1px solid rgba(255,255,255,.06)", margin: "6px 0 2px" }} />
            <Link
              href="/catalog"
              style={{
                display: "block",
                padding: "9px 14px",
                borderRadius: 8,
                color: PRIMARY,
                textDecoration: "none",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Ver todo →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "#0a0d18",
          borderBottom: "1px solid rgba(255,255,255,.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 48px",
          fontFamily: "inherit",
        }}
      >
        <Link
          href="/"
          style={{
            fontWeight: 800,
            fontSize: 18,
            letterSpacing: "-.02em",
            color: "#fff",
            textDecoration: "none",
          }}
        >
          3d<span style={{ color: PRIMARY }}>EN</span>CASA
        </Link>

        <nav style={{ display: "flex", gap: 32, alignItems: "center" }}>
          <NavDropdown label="Impresoras" items={IMPRESORAS} />
          <NavDropdown label="Insumos" items={INSUMOS} />
          <Link
            href="/about"
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "rgba(255,255,255,.75)",
              textDecoration: "none",
            }}
          >
            Sobre nosotros
          </Link>
          <Link
            href="/contact"
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "rgba(255,255,255,.75)",
              textDecoration: "none",
            }}
          >
            Contacto
          </Link>
        </nav>

        <button
          onClick={() => setSearchOpen(true)}
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,.2)",
            color: "#fff",
            padding: "8px 14px",
            borderRadius: 999,
            fontSize: 13,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "inherit",
          }}
        >
          <Search size={14} />
          Buscar
        </button>
      </header>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </>
  );
}
