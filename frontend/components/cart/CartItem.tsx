"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore, type CartItem as CartItemType } from "@/store/cart";

interface CartItemProps {
    item: CartItemType;
}

/**
 * Formatea un precio en pesos argentinos.
 */
function formatPrice(price: number): string {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

/**
 * Tarjeta individual de un item en el carrito.
 * Muestra imagen, nombre, variantes, precio, cantidad y botón eliminar.
 */
export function CartItem({ item }: CartItemProps) {
    const { updateQuantity, removeItem } = useCartStore();
    const { product, variant, quantity } = item;

    const imageUrl = product.mainImageUrl || "https://via.placeholder.com/100x100?text=Sin+Imagen";

    // Formatear atributos de la variante
    const attributesStr = Object.entries(variant.attributes)
        .map(([key, value]) => `${key}: ${value}`)
        .join(" / ");

    return (
        <div className="flex gap-4 py-4 border-b border-slate-200 last:border-b-0">
            {/* Imagen */}
            <div className="relative h-20 w-20 flex-shrink-0 bg-slate-50 rounded-lg overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    sizes="80px"
                    className="object-contain p-1"
                />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-slate-900 truncate">
                    {product.name}
                </h4>
                {attributesStr && (
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                        {attributesStr}
                    </p>
                )}
                <p className="text-sm font-semibold text-slate-900 mt-1">
                    {formatPrice(variant.price)}
                </p>

                {/* Cantidad */}
                <div className="flex items-center gap-2 mt-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(variant.id, quantity - 1)}
                    >
                        <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-medium w-6 text-center">
                        {quantity}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(variant.id, quantity + 1)}
                    >
                        <Plus className="h-3 w-3" />
                    </Button>
                </div>
            </div>

            {/* Subtotal + Eliminar */}
            <div className="flex flex-col items-end justify-between">
                <button
                    onClick={() => removeItem(variant.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                    aria-label="Eliminar"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
                <p className="text-sm font-semibold text-slate-700">
                    {formatPrice(variant.price * quantity)}
                </p>
            </div>
        </div>
    );
}
