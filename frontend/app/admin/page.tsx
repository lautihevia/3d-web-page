"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Trash2, Pencil, AlertCircle } from "lucide-react";
import { adminHeaders, getAdminToken } from "@/lib/adminAuth";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const PRIMARY = "#3b82f6";

interface AdminProduct {
  id: number;
  name: string;
  description?: string;
  brand?: string;
  mainImageUrl?: string;
  isActive: boolean;
  price?: number;
  stock?: number;
  variantCount: number;
}

function formatPrice(n?: number) {
  if (!n) return "—";
  return "$" + n.toLocaleString("es-AR");
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);
  const router = useRouter();

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/products`, {
        headers: adminHeaders(),
      });
      if (res.status === 401 || res.status === 403) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) throw new Error("Error al cargar");
      setProducts(await res.json());
    } catch {
      setError("No se pudieron cargar los productos. Verificá que el backend esté activo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!getAdminToken()) { router.push("/admin/login"); return; }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleActive = async (p: AdminProduct) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/products/${p.id}`, {
        method: "PUT",
        headers: { ...adminHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !p.isActive }),
      });
      if (res.ok) setProducts((prev) => prev.map((x) => x.id === p.id ? { ...x, isActive: !p.isActive } : x));
    } catch { /* silent */ }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("¿Eliminás este producto? La acción no se puede deshacer.")) return;
    setDeleting(id);
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/products/${id}`, {
        method: "DELETE",
        headers: adminHeaders(),
      });
      if (res.ok) setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch { /* silent */ }
    setDeleting(null);
  };

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, color: "#0b0d12", letterSpacing: "-.02em" }}>
            Productos
          </h1>
          <p style={{ fontSize: 13, color: "rgba(0,0,0,.5)", marginTop: 4 }}>
            {products.length} producto{products.length !== 1 ? "s" : ""} en catálogo
          </p>
        </div>
        <Link
          href="/admin/products/new"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: PRIMARY,
            color: "#fff",
            padding: "11px 18px",
            borderRadius: 12,
            fontWeight: 600,
            fontSize: 14,
            textDecoration: "none",
          }}
        >
          <Plus size={16} />
          Nuevo producto
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.2)", borderRadius: 12, padding: "16px 20px", display: "flex", gap: 12, alignItems: "center", marginBottom: 20, color: "#dc2626" }}>
          <AlertCircle size={18} />
          <span style={{ fontSize: 14 }}>{error}</span>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(0,0,0,.4)", fontSize: 14 }}>
          Cargando productos...
        </div>
      )}

      {/* Product list */}
      {!loading && !error && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {products.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(0,0,0,.4)", background: "#fff", borderRadius: 16, border: "1px solid rgba(0,0,0,.06)" }}>
              <p style={{ fontSize: 16 }}>No hay productos. ¡Cargá el primero!</p>
              <Link href="/admin/products/new" style={{ color: PRIMARY, fontSize: 14, fontWeight: 600 }}>
                Crear producto →
              </Link>
            </div>
          )}

          {products.map((p) => (
            <div
              key={p.id}
              style={{
                background: "#fff",
                borderRadius: 14,
                border: "1px solid rgba(0,0,0,.06)",
                padding: "14px 20px",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              {/* Thumbnail */}
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 10,
                  background: "#f5f6fa",
                  flexShrink: 0,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {p.mainImageUrl ? (
                  <Image src={p.mainImageUrl} alt={p.name} fill className="object-contain p-1" />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "rgba(0,0,0,.3)" }}>
                    SIN IMG
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: "#0b0d12", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {p.name}
                </div>
                <div style={{ fontSize: 12, color: "rgba(0,0,0,.5)", marginTop: 2 }}>
                  {p.brand || "Sin marca"} · ID #{p.id}
                </div>
              </div>

              {/* Price */}
              <div style={{ textAlign: "right", flexShrink: 0, minWidth: 100 }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: PRIMARY }}>{formatPrice(p.price)}</div>
                <div style={{ fontSize: 12, color: "rgba(0,0,0,.4)", marginTop: 1 }}>
                  Stock: {p.stock ?? "—"}
                </div>
              </div>

              {/* Active toggle */}
              <div
                onClick={() => toggleActive(p)}
                title={p.isActive ? "Activo — click para desactivar" : "Inactivo — click para activar"}
                style={{
                  width: 40,
                  height: 22,
                  borderRadius: 999,
                  background: p.isActive ? "#22c55e" : "rgba(0,0,0,.12)",
                  position: "relative",
                  cursor: "pointer",
                  flexShrink: 0,
                  transition: "background .2s",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 3,
                    left: p.isActive ? 21 : 3,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "#fff",
                    transition: "left .2s",
                    boxShadow: "0 1px 4px rgba(0,0,0,.2)",
                  }}
                />
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <Link
                  href={`/admin/products/edit/${p.id}`}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    border: "1px solid rgba(0,0,0,.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(0,0,0,.5)",
                    textDecoration: "none",
                    background: "#fff",
                  }}
                >
                  <Pencil size={15} />
                </Link>
                <button
                  onClick={() => deleteProduct(p.id)}
                  disabled={deleting === p.id}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    border: "1px solid rgba(239,68,68,.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ef4444",
                    background: "rgba(239,68,68,.06)",
                    cursor: "pointer",
                  }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
