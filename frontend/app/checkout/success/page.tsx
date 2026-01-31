import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Página de éxito después de completar el checkout.
 */
export default function CheckoutSuccessPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md mx-auto text-center px-6 py-16">
                {/* Ícono de éxito */}
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>

                {/* Mensaje */}
                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                    ¡Gracias por tu compra!
                </h1>
                <p className="text-slate-600 mb-8">
                    Tu pedido ha sido confirmado. Te enviaremos un email con los detalles
                    y el seguimiento de tu envío.
                </p>

                {/* Número de orden (simulado) */}
                <div className="bg-white rounded-lg border border-slate-200 p-4 mb-8">
                    <p className="text-sm text-slate-500">Número de orden</p>
                    <p className="text-lg font-mono font-bold text-slate-900">
                        #3DEC-{Math.random().toString(36).substring(2, 8).toUpperCase()}
                    </p>
                </div>

                {/* Botón para volver */}
                <Link href="/">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6">
                        Seguir comprando
                    </Button>
                </Link>
            </div>
        </div>
    );
}
