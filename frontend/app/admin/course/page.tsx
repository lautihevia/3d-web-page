"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, ExternalLink, Pencil, Plus, Trash2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { adminFetch, AdminSessionExpiredError } from "@/lib/adminAuth";
import type { CourseVideo } from "@/lib/courseVideos";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const BASE = `${API_URL}/api/v1/admin/course-videos`;
const PRIMARY = "#3b82f6";

interface FormState {
  url: string;
  label: string;
  title: string;
  description: string;
  active: boolean;
}

const EMPTY_FORM: FormState = { url: "", label: "", title: "", description: "", active: true };

const card: React.CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  border: "1px solid rgba(0,0,0,.06)",
  padding: 24,
  marginBottom: 20,
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: 8,
  border: "1px solid rgba(0,0,0,.15)",
  fontSize: 14,
  fontFamily: "inherit",
  boxSizing: "border-box",
};

const fieldLabel: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: "rgba(0,0,0,.6)", marginBottom: 6, display: "block" };

const iconBtn: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 8,
  border: "1px solid rgba(0,0,0,.12)",
  background: "#fff",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "rgba(0,0,0,.7)",
};

/** Mensaje de error del backend ({errors: [...]}) o uno genérico. */
async function errorsOf(res: Response): Promise<string[]> {
  const data = await res.json().catch(() => null);
  return data?.errors ?? ["No se pudo guardar. Probá de nuevo."];
}

export default function AdminCoursePage() {
  const [videos, setVideos] = useState<CourseVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [lookingUp, setLookingUp] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  async function run<T>(fn: () => Promise<T>): Promise<T | undefined> {
    try {
      return await fn();
    } catch (err) {
      if (err instanceof AdminSessionExpiredError) return;
      setErrors(["No se pudo conectar con el servidor."]);
    }
  }

  async function load() {
    await run(async () => {
      const res = await adminFetch(BASE);
      if (res.ok) setVideos(await res.json());
    });
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await adminFetch(BASE);
        if (res.ok) setVideos(await res.json());
      } catch (err) {
        if (!(err instanceof AdminSessionExpiredError)) setErrors(["No se pudo cargar la lista. Verificá que el backend esté activo."]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const flash = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 2500);
  };

  /** Al pegar un link nuevo se completa el título desde YouTube (si todavía está vacío). */
  async function lookup(url: string) {
    if (!url.trim() || editingId !== null) return;
    setLookingUp(true);
    setErrors([]);
    await run(async () => {
      const res = await adminFetch(`${BASE}/lookup?url=${encodeURIComponent(url.trim())}`);
      if (!res.ok) {
        setPreview(null);
        setErrors(await errorsOf(res));
        return;
      }
      const data: { title?: string; thumbnailUrl: string } = await res.json();
      setPreview(data.thumbnailUrl);
      setForm((f) => (f.title.trim() ? f : { ...f, title: data.title ?? "" }));
    });
    setLookingUp(false);
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setPreview(null);
    setErrors([]);
  }

  function startEdit(v: CourseVideo) {
    setEditingId(v.id);
    setForm({ url: v.url, label: v.label ?? "", title: v.title, description: v.description ?? "", active: v.active });
    setPreview(v.thumbnailUrl);
    setErrors([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save() {
    if (!form.title.trim()) {
      setErrors(["Falta el título."]);
      return;
    }
    setSaving(true);
    setErrors([]);
    await run(async () => {
      const res = await adminFetch(editingId === null ? BASE : `${BASE}/${editingId}`, {
        method: editingId === null ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        setErrors(await errorsOf(res));
        return;
      }
      flash(editingId === null ? "Video agregado" : "Cambios guardados");
      resetForm();
      await load();
    });
    setSaving(false);
  }

  async function move(index: number, delta: number) {
    const next = [...videos];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item);
    setVideos(next);
    await run(async () => {
      const res = await adminFetch(`${BASE}/order`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: next.map((v) => v.id) }),
      });
      if (res.ok) setVideos(await res.json());
    });
  }

  async function toggleActive(v: CourseVideo) {
    await run(async () => {
      const res = await adminFetch(`${BASE}/${v.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: v.label, title: v.title, description: v.description, active: !v.active }),
      });
      if (res.ok) await load();
    });
  }

  async function remove(id: number) {
    setConfirmDeleteId(null);
    await run(async () => {
      const res = await adminFetch(`${BASE}/${id}`, { method: "DELETE" });
      if (res.ok) {
        if (editingId === id) resetForm();
        flash("Video borrado");
        await load();
      }
    });
  }

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8" style={{ maxWidth: 900 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-.02em", margin: "0 0 6px" }}>Curso</h1>
      <p style={{ fontSize: 14, color: "rgba(0,0,0,.55)", margin: "0 0 24px" }}>
        Videos de YouTube que se muestran en la página <strong>/curso</strong>. Pegá el link y el título se completa solo.
      </p>

      {/* Formulario */}
      <div style={card}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>
          {editingId === null ? "Agregar video" : "Editar video"}
        </div>
        <div className="rsp-admin-grid" style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <label>
              <span style={fieldLabel}>Link de YouTube</span>
              <input
                style={{ ...input, background: editingId !== null ? "rgba(0,0,0,.04)" : "#fff" }}
                placeholder="https://www.youtube.com/watch?v=..."
                value={form.url}
                disabled={editingId !== null}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                onBlur={(e) => lookup(e.target.value)}
                onPaste={(e) => lookup(e.clipboardData.getData("text"))}
              />
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 12 }}>
              <label>
                <span style={fieldLabel}>Etiqueta</span>
                <input
                  style={input}
                  placeholder={`Clase ${videos.length}`}
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                />
              </label>
              <label>
                <span style={fieldLabel}>Título {lookingUp && <span style={{ fontWeight: 400 }}>· buscando…</span>}</span>
                <input style={input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </label>
            </div>
            <label>
              <span style={fieldLabel}>Descripción (opcional)</span>
              <textarea
                style={{ ...input, minHeight: 70, resize: "vertical" }}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
              <Switch checked={form.active} onCheckedChange={(active) => setForm({ ...form, active })} />
              Visible en la página
            </label>
          </div>
          <div>
            <span style={fieldLabel}>Vista previa</span>
            <div
              style={{
                aspectRatio: "16 / 9",
                borderRadius: 10,
                background: "rgba(0,0,0,.05)",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                color: "rgba(0,0,0,.4)",
              }}
            >
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                "Sin video"
              )}
            </div>
          </div>
        </div>

        {errors.length > 0 && (
          <div style={{ marginTop: 16, display: "flex", gap: 8, color: "#b91c1c", fontSize: 13, alignItems: "flex-start" }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>{errors.join(" ")}</div>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 20, alignItems: "center" }}>
          <button
            onClick={save}
            disabled={saving || lookingUp}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: PRIMARY,
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "10px 18px",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              opacity: saving || lookingUp ? 0.6 : 1,
              fontFamily: "inherit",
            }}
          >
            {editingId === null && <Plus size={16} />}
            {editingId === null ? "Agregar video" : "Guardar cambios"}
          </button>
          {editingId !== null && (
            <button
              onClick={resetForm}
              style={{ background: "none", border: "none", color: "rgba(0,0,0,.6)", fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}
            >
              Cancelar
            </button>
          )}
          {notice && (
            <span style={{ display: "inline-flex", gap: 6, alignItems: "center", color: "#15803d", fontSize: 13 }}>
              <CheckCircle2 size={16} /> {notice}
            </span>
          )}
        </div>
      </div>

      {/* Lista */}
      <div style={card}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Videos ({videos.length})</div>
        <div style={{ fontSize: 13, color: "rgba(0,0,0,.5)", marginBottom: 16 }}>
          Se muestran en este orden. Usá las flechas para moverlos.
        </div>
        {loading ? (
          <div style={{ fontSize: 14, color: "rgba(0,0,0,.5)" }}>Cargando…</div>
        ) : videos.length === 0 ? (
          <div style={{ fontSize: 14, color: "rgba(0,0,0,.5)" }}>Todavía no hay videos.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {videos.map((v, i) => (
              <div
                key={v.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: 10,
                  borderRadius: 12,
                  border: `1px solid ${editingId === v.id ? PRIMARY : "rgba(0,0,0,.08)"}`,
                  flexWrap: "wrap",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={v.thumbnailUrl}
                  alt=""
                  style={{ width: 112, aspectRatio: "16 / 9", objectFit: "cover", borderRadius: 8, opacity: v.active ? 1 : 0.45 }}
                />
                <div style={{ flex: 1, minWidth: 180 }}>
                  {v.label && (
                    <div style={{ fontSize: 11, fontWeight: 700, color: PRIMARY, textTransform: "uppercase", letterSpacing: ".08em" }}>
                      {v.label}
                    </div>
                  )}
                  <div style={{ fontSize: 14, fontWeight: 600, opacity: v.active ? 1 : 0.55 }}>{v.title}</div>
                  {!v.active && <div style={{ fontSize: 12, color: "rgba(0,0,0,.5)" }}>Oculto</div>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <button style={iconBtn} aria-label="Subir" disabled={i === 0} onClick={() => move(i, -1)}>
                    <ArrowUp size={15} opacity={i === 0 ? 0.3 : 1} />
                  </button>
                  <button style={iconBtn} aria-label="Bajar" disabled={i === videos.length - 1} onClick={() => move(i, 1)}>
                    <ArrowDown size={15} opacity={i === videos.length - 1 ? 0.3 : 1} />
                  </button>
                  <span title={v.active ? "Visible" : "Oculto"} style={{ display: "inline-flex", margin: "0 4px" }}>
                    <Switch checked={v.active} onCheckedChange={() => toggleActive(v)} aria-label="Visible" />
                  </span>
                  <a href={v.url} target="_blank" rel="noopener noreferrer" style={iconBtn} aria-label="Abrir en YouTube">
                    <ExternalLink size={15} />
                  </a>
                  <button style={iconBtn} aria-label="Editar" onClick={() => startEdit(v)}>
                    <Pencil size={15} />
                  </button>
                  {confirmDeleteId === v.id ? (
                    <span style={{ display: "inline-flex", gap: 6, alignItems: "center", fontSize: 13 }}>
                      ¿Borrar?
                      <button
                        onClick={() => remove(v.id)}
                        style={{ ...iconBtn, width: "auto", padding: "0 10px", color: "#fff", background: "#ef4444", border: "none" }}
                      >
                        Sí
                      </button>
                      <button onClick={() => setConfirmDeleteId(null)} style={{ ...iconBtn, width: "auto", padding: "0 10px" }}>
                        No
                      </button>
                    </span>
                  ) : (
                    <button style={iconBtn} aria-label="Borrar" onClick={() => setConfirmDeleteId(v.id)}>
                      <Trash2 size={15} color="#ef4444" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
