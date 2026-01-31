import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Producto básico para el carrito (sin variantes).
 */
export interface CartProduct {
    id: number;
    name: string;
    brand?: string;
    mainImageUrl?: string;
}

/**
 * Variante seleccionada del producto.
 */
export interface CartVariant {
    id: number;
    sku: string;
    price: number;
    attributes: Record<string, string>;
}

/**
 * Item del carrito = Producto + Variante + Cantidad.
 */
export interface CartItem {
    product: CartProduct;
    variant: CartVariant;
    quantity: number;
}

/**
 * Estado y acciones del store.
 */
interface CartState {
    items: CartItem[];

    // Acciones
    addItem: (product: CartProduct, variant: CartVariant, quantity?: number) => void;
    removeItem: (variantId: number) => void;
    updateQuantity: (variantId: number, quantity: number) => void;
    clearCart: () => void;

    // Computed (getters)
    getTotal: () => number;
    getItemCount: () => number;
}

/**
 * Store global del carrito con persistencia en localStorage.
 */
export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            /**
             * Agrega un item al carrito.
             * Si ya existe la misma variante, suma la cantidad.
             */
            addItem: (product, variant, quantity = 1) => {
                set((state) => {
                    const existingIndex = state.items.findIndex(
                        (item) => item.variant.id === variant.id
                    );

                    if (existingIndex >= 0) {
                        // Variante ya existe, sumar cantidad
                        const newItems = [...state.items];
                        newItems[existingIndex] = {
                            ...newItems[existingIndex],
                            quantity: newItems[existingIndex].quantity + quantity,
                        };
                        return { items: newItems };
                    }

                    // Nueva variante, agregar al carrito
                    return {
                        items: [...state.items, { product, variant, quantity }],
                    };
                });
            },

            /**
             * Elimina un item del carrito por ID de variante.
             */
            removeItem: (variantId) => {
                set((state) => ({
                    items: state.items.filter((item) => item.variant.id !== variantId),
                }));
            },

            /**
             * Actualiza la cantidad de un item.
             * Si la cantidad es 0 o menor, elimina el item.
             */
            updateQuantity: (variantId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(variantId);
                    return;
                }

                set((state) => ({
                    items: state.items.map((item) =>
                        item.variant.id === variantId
                            ? { ...item, quantity }
                            : item
                    ),
                }));
            },

            /**
             * Vacía el carrito.
             */
            clearCart: () => {
                set({ items: [] });
            },

            /**
             * Calcula el total del carrito.
             */
            getTotal: () => {
                return get().items.reduce(
                    (total, item) => total + item.variant.price * item.quantity,
                    0
                );
            },

            /**
             * Cuenta el número total de items.
             */
            getItemCount: () => {
                return get().items.reduce((count, item) => count + item.quantity, 0);
            },
        }),
        {
            name: "3dencasa-cart", // Key en localStorage
        }
    )
);
