"use client";

import Image from "next/image";
import { useCartStore } from "@/store/cart";

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
 * Resumen de la orden para el checkout (columna derecha).
 * Estilo Shopify: thumbnails con badge de cantidad.
 */
export function OrderSummary() {
    const { items, getTotal } = useCartStore();
    const subtotal = getTotal();
    const shipping = 0; // Gratis por ahora
    const total = subtotal + shipping;

    return (
        <div className="space-y-6">
            {/* Lista de items */}
            <div className="space-y-4">
                {items.map((item) => {
                    const imageUrl = item.product.mainImageUrl || "https://via.placeholder.com/64x64?text=Img";

                    // Formatear atributos de la variante
                    const variantStr = Object.values(item.variant.attributes).join(" / ");

                    return (
                        <div key={item.variant.id} className="flex gap-4 items-start">
                            {/* Imagen con badge de cantidad */}
                            <div className="relative flex-shrink-0">
                                <div className="w-16 h-16 rounded-lg border border-slate-200 bg-white overflow-hidden">
                                    <Image
                                        src={imageUrl}
                                        alt={item.product.name}
                                        width={64}
                                        height={64}
                                        className="object-contain p-1"
                                    />
                                </div>
                                {/* Badge de cantidad */}
                                <span className="absolute -top-2 -right-2 bg-slate-500 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                                    {item.quantity}
                                </span>
                            </div>

                            {/* Info del producto */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">
                                    {item.product.name}
                                </p>
                                {variantStr && (
                                    <p className="text-xs text-slate-500 truncate">
                                        {variantStr}
                                    </p>
                                )}
                            </div>

                            {/* Precio */}
                            <p className="text-sm font-medium text-slate-900 whitespace-nowrap">
                                {formatPrice(item.variant.price * item.quantity)}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Divider */}
            <div className="border-t border-slate-200 pt-4 space-y-3">
                {/* Subtotal */}
                <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-medium text-slate-900">{formatPrice(subtotal)}</span>
                </div>

                {/* Envío */}
                <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Envío</span>
                    <span className="text-slate-500">
                        {shipping === 0 ? "Gratis" : formatPrice(shipping)}
                    </span>
                </div>

                {/* Total */}
                <div className="flex justify-between pt-3 border-t border-slate-200">
                    <span className="text-base font-medium text-slate-900">Total</span>
                    <div className="text-right">
                        <span className="text-xs text-slate-500 mr-2">ARS</span>
                        <span className="text-xl font-bold text-slate-900">{formatPrice(total)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
