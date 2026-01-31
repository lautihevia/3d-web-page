"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { CartItem } from "./CartItem";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet";
import { ShoppingCart, ShoppingBag } from "lucide-react";

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
 * Panel lateral del carrito de compras.
 * Se abre desde el navbar con el ícono del carrito.
 */
export function CartSheet() {
    const { items, getTotal, getItemCount } = useCartStore();
    const itemCount = getItemCount();
    const total = getTotal();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <button
                    aria-label="Carrito de compras"
                    className="text-slate-300 hover:text-white transition-colors relative"
                >
                    <ShoppingCart className="h-5 w-5" />
                    {itemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-violet-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                            {itemCount > 99 ? "99+" : itemCount}
                        </span>
                    )}
                </button>
            </SheetTrigger>

            <SheetContent className="w-full sm:max-w-md flex flex-col">
                <SheetHeader>
                    <SheetTitle>
                        Tu Carrito ({itemCount} {itemCount === 1 ? "ítem" : "ítems"})
                    </SheetTitle>
                </SheetHeader>

                {/* Lista de items o estado vacío */}
                {items.length > 0 ? (
                    <>
                        {/* Contenido scrollable */}
                        <div className="flex-1 overflow-y-auto py-4 -mx-6 px-6">
                            {items.map((item) => (
                                <CartItem key={item.variant.id} item={item} />
                            ))}
                        </div>

                        {/* Footer con total y checkout */}
                        <SheetFooter className="flex-col gap-4 border-t border-slate-200 pt-4 mt-auto">
                            <div className="flex justify-between items-center w-full">
                                <span className="text-sm text-slate-600">Subtotal</span>
                                <span className="text-xl font-bold text-slate-900">
                                    {formatPrice(total)}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500">
                                Envío e impuestos calculados en el checkout.
                            </p>
                            <SheetClose asChild>
                                <Link href="/checkout">
                                    <Button
                                        className="w-full bg-violet-600 hover:bg-violet-700 text-white py-6 text-base font-semibold rounded-xl"
                                    >
                                        Iniciar Compra
                                    </Button>
                                </Link>
                            </SheetClose>
                        </SheetFooter>
                    </>
                ) : (
                    /* Estado vacío */
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                        <ShoppingBag className="h-16 w-16 text-slate-300 mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 mb-2">
                            Tu carrito está vacío
                        </h3>
                        <p className="text-sm text-slate-500 max-w-[200px]">
                            Explorá nuestros productos y agregá lo que te guste.
                        </p>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
