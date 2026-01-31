import { OrderSummary } from "@/components/checkout/OrderSummary";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import Link from "next/link";

/**
 * Página de Checkout - Estilo Shopify.
 * Layout split-screen: Form (izquierda) / Summary (derecha sticky).
 */
export default function CheckoutPage() {
    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Columna Izquierda: Formulario (fondo blanco) */}
            <div className="flex-1 lg:w-[55%]">
                <div className="max-w-lg mx-auto px-6 py-12">
                    {/* Logo */}
                    <Link href="/" className="text-xl font-bold text-slate-900 mb-12 block">
                        3dENCASA
                    </Link>

                    {/* Formulario de Checkout */}
                    <CheckoutForm />
                </div>
            </div>

            {/* Columna Derecha: Resumen de Orden (fondo gris) */}
            <div className="lg:w-[45%] bg-gray-50 border-l border-slate-200">
                <div className="sticky top-0 max-w-md px-6 py-12">
                    <OrderSummary />
                </div>
            </div>

            {/* Mobile: Resumen colapsable (se muestra primero en mobile) */}
            <details className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg">
                <summary className="p-4 cursor-pointer flex justify-between items-center">
                    <span className="text-sm font-medium">Ver resumen del pedido</span>
                    <span className="text-lg font-bold">$ --</span>
                </summary>
                <div className="p-4 bg-gray-50 max-h-60 overflow-y-auto">
                    <OrderSummary />
                </div>
            </details>
        </div>
    );
}
