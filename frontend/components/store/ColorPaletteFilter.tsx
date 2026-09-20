"use client";

import { SOLID_COLORS, SPECIAL_COLORS, type PaletteColor } from "@/lib/filamentColors";

const PRIMARY = "#3b82f6";

interface ColorPaletteFilterProps {
    selected: string[];
    onToggle: (key: string) => void;
}

function Swatch({
    color,
    active,
    onClick,
    size,
}: {
    color: PaletteColor;
    active: boolean;
    onClick: () => void;
    size: number;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={color.label}
            aria-label={color.label}
            aria-pressed={active}
            style={{
                width: size,
                height: size,
                borderRadius: "50%",
                background: color.swatch,
                border: color.needsBorder ? "1px solid rgba(0,0,0,.18)" : "1px solid rgba(0,0,0,.08)",
                // El anillo va por fuera para no comerle color al círculo.
                boxShadow: active ? `0 0 0 2px #fff, 0 0 0 4px ${PRIMARY}` : "none",
                cursor: "pointer",
                padding: 0,
                flexShrink: 0,
                transition: "box-shadow .15s",
            }}
        />
    );
}

/**
 * Paleta de colores de filamento, multi-selección. Los lisos van como círculos
 * y los acabados como chips con etiqueta, porque un "Mármol" o un "Cristal" no
 * se reconocen en un círculo de 26px.
 */
export function ColorPaletteFilter({ selected, onToggle }: ColorPaletteFilterProps) {
    return (
        <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
                {SOLID_COLORS.map((c) => (
                    <Swatch
                        key={c.key}
                        color={c}
                        size={26}
                        active={selected.includes(c.key)}
                        onClick={() => onToggle(c.key)}
                    />
                ))}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
                {SPECIAL_COLORS.map((c) => {
                    const active = selected.includes(c.key);
                    return (
                        <button
                            key={c.key}
                            type="button"
                            onClick={() => onToggle(c.key)}
                            aria-pressed={active}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "4px 10px 4px 5px",
                                borderRadius: 999,
                                border: `1px solid ${active ? PRIMARY : "rgba(0,0,0,.12)"}`,
                                background: active ? `${PRIMARY}12` : "transparent",
                                color: active ? PRIMARY : "rgba(0,0,0,.65)",
                                fontSize: 12,
                                fontWeight: active ? 600 : 400,
                                fontFamily: "inherit",
                                cursor: "pointer",
                                transition: "all .15s",
                            }}
                        >
                            <span
                                style={{
                                    width: 15,
                                    height: 15,
                                    borderRadius: "50%",
                                    background: c.swatch,
                                    border: c.needsBorder
                                        ? "1px solid rgba(0,0,0,.18)"
                                        : "1px solid rgba(0,0,0,.08)",
                                    flexShrink: 0,
                                }}
                            />
                            {c.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
