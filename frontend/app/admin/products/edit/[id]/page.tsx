"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ImageIcon } from "lucide-react";
import { adminHeaders, getAdminToken } from "@/lib/adminAuth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const PRIMARY = "#3b82f6";

const BRANDS = ["Bambu Lab", "Creality", "Anycubic", "W3D", "Arduino", "Filamentos", "Electrónica", "Otro"];
const CATEGORIES = ["Impresoras", "Filamentos", "Electrónica", "Repuestos", "Accesorios"];

const IMAGE_SLOTS = [
  { key: "imageUrl" as const, label: "Imagen principal" },
  { key: "imageUrl2" as const, label: "Imagen 2" },
  { key: "imageUrl3" as const, label: "Imagen 3" },
  { key: "imageUrl4" as const, label: "Imagen 4" },
];

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "",
    brand: "Bambu Lab",
    customBrand: "",
    category: "Impresoras",
    description: "",
    imageUrl: "",
    imageUrl2: "",
    imageUrl3: "",
    imageUrl4: "",
    price: "",
    stock: "0",
    isActive: true,
  });

  const set = (key: string, val: string | boolean) =>
    setForm((f) => ({ ...f, [key]: val }));

  useEffect(() => {
    if (!getAdminToken()) { router.push("/admin/login"); return; }

    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/products/${id}`);
        if (!res.ok) throw new Error("Not found");
        const p = await res.json();
        const knownBrand = BRANDS.includes(p.brand) ? p.brand : "Otro";
        const knownCategory = CATEGORIES.includes(p.category) ? p.category : "Impresoras";
        setForm({
          name: p.name || "",
          brand: knownBrand,
          customBrand: knownBrand === "Otro" ? (p.brand || "") : "",
          category: knownCategory,
          description: p.description || "",
          imageUrl: p.mainImageUrl || "",
          imageUrl2: p.imageUrl2 || "",
          imageUrl3: p.imageUrl3 || "",
          imageUrl4: p.imageUrl4 || "",
          price: p.variants?.[0]?.price?.toString() || "",
          stock: p.variants?.[0]?.stockQuantity?.toString() || "0",
          isActive: p.isActive,
        });
      } catch {
        setError("Producto no encontrado");
      } finally {
        setFetching(false);
      }
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!getAdminToken()) { router.push("/admin/login"); return; }
    setError("");
    setLoading(true);

    const brand = form.brand === "Otro" ? form.customBrand : form.brand;

    try {
      const res = await fetch(`${API_URL}/api/v1/admin/products/${id}`, {
        method: "PUT",
        headers: { ...adminHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          brand: brand?.trim() || null,
          category: form.category || null,
          description: form.description.trim() || null,
          imageUrl: form.imageUrl.trim() || null,
          imageUrl2: form.imageUrl2.trim() || null,
          imageUrl3: form.imageUrl3.trim() || null,
          imageUrl4: form.imageUrl4.trim() || null,
          price: form.price ? parseFloat(form.price) : null,
          stock: parseInt(form.stock) || 0,
          isActive: form.isActive,
        }),
      });
      if (res.status === 401 || res.status === 403) { router.push("/admin/login"); return; }
      if (!res.ok) throw new Error("Error al actualizar");
      setSuccess(true);
      setTimeout(() => router.push("/admin"), 1200);
    } catch {
      setError("No se pudo actualizar el producto.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div style={{ padding: "60px 40px", color: "rgba(0,0,0,.4)", fontSize: 14 }}>Cargando...</div>;

  if (success) {
    return (
      <div style={{ padding: "80px 40px", textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#dcfce7", color: "#16a34a", fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>✓</div>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>Producto actualizado</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px 40px", maxWidth: 820 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
        <Link href="/admin" style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid rgba(0,0,0,.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(0,0,0,.5)", textDecoration: "none" }}>
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "#0b0d12" }}>Editar producto</h1>
          <p style={{ fontSize: 13, color: "rgba(0,0,0,.45)", marginTop: 2 }}>ID #{id}</p>
        </div>
      </div>

      {error && (
        <div style={{ background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.2)", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#dc2626", marginBottom: 20 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

          {/* Name */}
          <div style={{ gridColumn: "1 / -1" }}>
            <Field label="Nombre *">
              <input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Nombre del producto" style={inputStyle} />
            </Field>
          </div>

          {/* Brand */}
          <div>
            <Field label="Marca">
              <select value={form.brand} onChange={(e) => set("brand", e.target.value)} style={inputStyle}>
                {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </Field>
          </div>

          {/* Category */}
          <div>
            <Field label="Categoría">
              <select value={form.category} onChange={(e) => set("category", e.target.value)} style={inputStyle}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
          </div>

          {/* Custom brand */}
          {form.brand === "Otro" && (
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Nombre de marca personalizada">
                <input value={form.customBrand} onChange={(e) => set("customBrand", e.target.value)} placeholder="Ej: Prusa" style={inputStyle} />
              </Field>
            </div>
          )}

          {/* Price */}
          <div>
            <Field label="Precio (ARS)">
              <input type="number" min="0" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="0" style={inputStyle} />
            </Field>
          </div>

          {/* Stock */}
          <div>
            <Field label="Stock">
              <input type="number" min="0" value={form.stock} onChange={(e) => set("stock", e.target.value)} placeholder="0" style={inputStyle} />
            </Field>
          </div>

          {/* Images section */}
          <div style={{ gridColumn: "1 / -1" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(0,0,0,.65)", marginBottom: 12 }}>
              Imágenes del producto — pegá URLs de Cloudinary
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {IMAGE_SLOTS.map(({ key, label }) => {
                const val = form[key] as string;
                const url = val.trim().startsWith("http") ? val.trim() : null;
                return (
                  <div key={key} style={{ display: "flex", gap: 12, alignItems: "center", background: "#f9fafb", border: "1px solid rgba(0,0,0,.07)", borderRadius: 12, padding: "10px 14px" }}>
                    <div style={{ width: 60, height: 60, borderRadius: 8, background: "#fff", border: "1px solid rgba(0,0,0,.08)", overflow: "hidden", position: "relative", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {url ? (
                        <Image src={url} alt={label} fill className="object-contain p-1" />
                      ) : (
                        <ImageIcon size={18} color="rgba(0,0,0,.2)" />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(0,0,0,.4)", letterSpacing: ".04em", textTransform: "uppercase", marginBottom: 5 }}>{label}</div>
                      <input
                        value={val}
                        onChange={(e) => set(key, e.target.value)}
                        placeholder="https://res.cloudinary.com/..."
                        style={{ ...inputStyle, background: "#fff" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div style={{ gridColumn: "1 / -1" }}>
            <Field label="Descripción">
              <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} placeholder="Describí el producto..." style={{ ...inputStyle, resize: "vertical" }} />
            </Field>
          </div>

          {/* Active toggle */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
              <div onClick={() => set("isActive", !form.isActive)} style={{ width: 44, height: 24, borderRadius: 999, background: form.isActive ? PRIMARY : "rgba(0,0,0,.15)", position: "relative", cursor: "pointer", transition: "background .2s", flexShrink: 0 }}>
                <div style={{ position: "absolute", top: 4, left: form.isActive ? 23 : 4, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left .2s", boxShadow: "0 1px 4px rgba(0,0,0,.2)" }} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#0b0d12" }}>Producto activo</div>
                <div style={{ fontSize: 12, color: "rgba(0,0,0,.45)", marginTop: 2 }}>{form.isActive ? "Visible en el catálogo" : "Oculto del catálogo"}</div>
              </div>
            </label>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
          <button type="submit" disabled={loading} style={{ background: loading ? "rgba(0,0,0,.15)" : PRIMARY, color: "#fff", border: "none", padding: "13px 28px", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
          <Link href="/admin" style={{ padding: "13px 20px", borderRadius: 12, border: "1px solid rgba(0,0,0,.1)", fontSize: 14, color: "rgba(0,0,0,.6)", textDecoration: "none", fontWeight: 500 }}>
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(0,0,0,.65)", marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 13px", borderRadius: 10,
  border: "1px solid rgba(0,0,0,.1)", fontSize: 14, fontFamily: "inherit",
  outline: "none", boxSizing: "border-box", color: "#0b0d12", background: "#fff",
};
