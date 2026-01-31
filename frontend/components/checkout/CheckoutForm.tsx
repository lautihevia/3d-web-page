"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/store/cart";
import { useRouter } from "next/navigation";
import { Package, Store, Loader2 } from "lucide-react";

// Schema de validación con Zod
const checkoutSchema = z.object({
    email: z.string().email("Email inválido"),
    newsletter: z.boolean().optional(),
    deliveryMethod: z.enum(["shipping", "pickup"]),
    firstName: z.string().min(2, "Nombre requerido"),
    lastName: z.string().min(2, "Apellido requerido"),
    company: z.string().optional(),
    address: z.string().min(5, "Dirección requerida"),
    apartment: z.string().optional(),
    postalCode: z.string().min(4, "Código postal requerido"),
    city: z.string().min(2, "Ciudad requerida"),
    province: z.string().min(2, "Provincia requerida"),
    phone: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

/**
 * Formulario de checkout estilo Shopify.
 * Secciones: Contacto, Entrega, Dirección.
 */
export function CheckoutForm() {
    const router = useRouter();
    const { items, getTotal, clearCart } = useCartStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            deliveryMethod: "shipping",
            newsletter: false,
        },
    });

    const deliveryMethod = watch("deliveryMethod");

    const onSubmit = async (data: CheckoutFormData) => {
        setIsSubmitting(true);

        try {
            // Construir objeto de orden
            const orderData = {
                shippingAddress: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phone: data.phone,
                    address: data.address,
                    apartment: data.apartment,
                    city: data.city,
                    province: data.province,
                    postalCode: data.postalCode,
                },
                items: items.map(item => ({
                    variantId: item.variant.id,
                    quantity: item.quantity,
                    price: item.variant.price,
                })),
                total: getTotal(),
                deliveryMethod: data.deliveryMethod,
            };

            console.log("Order data:", orderData);

            // TODO: Enviar a backend
            // const res = await fetch("/api/v1/orders", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(orderData),
            // });

            // Simular delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Limpiar carrito y redirigir
            clearCart();
            router.push("/checkout/success");
        } catch (error) {
            console.error("Error creating order:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Sección: Contacto */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">Contacto</h2>
                    <a href="/auth/login" className="text-sm text-blue-600 hover:underline">
                        Iniciar sesión
                    </a>
                </div>

                <div className="space-y-3">
                    <div>
                        <input
                            {...register("email")}
                            type="email"
                            placeholder="Correo electrónico"
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <label className="flex items-center gap-2 text-sm text-slate-600">
                        <input
                            {...register("newsletter")}
                            type="checkbox"
                            className="rounded border-slate-300"
                        />
                        Enviarme novedades y ofertas por correo electrónico
                    </label>
                </div>
            </section>

            {/* Sección: Entrega */}
            <section>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Entrega</h2>

                <RadioGroup
                    value={deliveryMethod}
                    onValueChange={(value) => setValue("deliveryMethod", value as "shipping" | "pickup")}
                    className="space-y-0"
                >
                    {/* Opción: Envío */}
                    <div className={`flex items-center justify-between p-4 border rounded-t-lg cursor-pointer transition ${deliveryMethod === "shipping"
                            ? "border-blue-500 bg-blue-50/50"
                            : "border-slate-300"
                        }`}>
                        <div className="flex items-center gap-3">
                            <RadioGroupItem value="shipping" id="shipping" />
                            <Label htmlFor="shipping" className="cursor-pointer font-medium">
                                Envío
                            </Label>
                        </div>
                        <Package className="h-5 w-5 text-slate-400" />
                    </div>

                    {/* Opción: Retiro */}
                    <div className={`flex items-center justify-between p-4 border border-t-0 rounded-b-lg cursor-pointer transition ${deliveryMethod === "pickup"
                            ? "border-blue-500 bg-blue-50/50"
                            : "border-slate-300"
                        }`}>
                        <div className="flex items-center gap-3">
                            <RadioGroupItem value="pickup" id="pickup" />
                            <Label htmlFor="pickup" className="cursor-pointer font-medium">
                                Retiro
                            </Label>
                        </div>
                        <Store className="h-5 w-5 text-slate-400" />
                    </div>
                </RadioGroup>
            </section>

            {/* Sección: Dirección (solo si es envío) */}
            {deliveryMethod === "shipping" && (
                <section>
                    <div className="border border-slate-300 rounded-lg overflow-hidden">
                        {/* País */}
                        <div className="p-4 border-b border-slate-200">
                            <label className="block text-xs text-slate-500 mb-1">País / Región</label>
                            <select className="w-full text-sm font-medium bg-transparent outline-none">
                                <option>Argentina</option>
                            </select>
                        </div>

                        {/* Nombre y Apellido */}
                        <div className="grid grid-cols-2 border-b border-slate-200">
                            <div className="p-4 border-r border-slate-200">
                                <input
                                    {...register("firstName")}
                                    placeholder="Nombre"
                                    className="w-full bg-transparent outline-none text-sm"
                                />
                            </div>
                            <div className="p-4">
                                <input
                                    {...register("lastName")}
                                    placeholder="Apellidos"
                                    className="w-full bg-transparent outline-none text-sm"
                                />
                            </div>
                        </div>

                        {/* Empresa */}
                        <div className="p-4 border-b border-slate-200">
                            <input
                                {...register("company")}
                                placeholder="Empresa (opcional)"
                                className="w-full bg-transparent outline-none text-sm"
                            />
                        </div>

                        {/* Dirección */}
                        <div className="p-4 border-b border-slate-200">
                            <input
                                {...register("address")}
                                placeholder="Dirección"
                                className="w-full bg-transparent outline-none text-sm"
                            />
                        </div>

                        {/* Apartamento */}
                        <div className="p-4 border-b border-slate-200">
                            <input
                                {...register("apartment")}
                                placeholder="Casa, apartamento, etc. (opcional)"
                                className="w-full bg-transparent outline-none text-sm"
                            />
                        </div>

                        {/* CP, Ciudad, Provincia */}
                        <div className="grid grid-cols-3 border-b border-slate-200">
                            <div className="p-4 border-r border-slate-200">
                                <input
                                    {...register("postalCode")}
                                    placeholder="Código postal"
                                    className="w-full bg-transparent outline-none text-sm"
                                />
                            </div>
                            <div className="p-4 border-r border-slate-200">
                                <input
                                    {...register("city")}
                                    placeholder="Ciudad"
                                    className="w-full bg-transparent outline-none text-sm"
                                />
                            </div>
                            <div className="p-4">
                                <label className="block text-xs text-slate-500 mb-1">Provincia / Estado</label>
                                <select
                                    {...register("province")}
                                    className="w-full text-sm bg-transparent outline-none"
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="Buenos Aires">Buenos Aires</option>
                                    <option value="CABA">CABA</option>
                                    <option value="Córdoba">Córdoba</option>
                                    <option value="Santa Fe">Santa Fe</option>
                                    <option value="Mendoza">Mendoza</option>
                                </select>
                            </div>
                        </div>

                        {/* Teléfono */}
                        <div className="p-4">
                            <input
                                {...register("phone")}
                                placeholder="Teléfono (opcional)"
                                className="w-full bg-transparent outline-none text-sm"
                            />
                        </div>
                    </div>

                    {/* Mostrar errores */}
                    {(errors.firstName || errors.lastName || errors.address || errors.postalCode || errors.city || errors.province) && (
                        <p className="text-red-500 text-sm mt-2">
                            Por favor complete todos los campos requeridos
                        </p>
                    )}
                </section>
            )}

            {/* Botón Submit */}
            <Button
                type="submit"
                disabled={isSubmitting || items.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-semibold rounded-lg"
            >
                {isSubmitting ? (
                    <span className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Procesando...
                    </span>
                ) : (
                    "Finalizar el pedido"
                )}
            </Button>

            {/* Links legales */}
            <div className="flex flex-wrap gap-4 text-xs text-blue-600">
                <a href="#" className="hover:underline">Política de reembolso</a>
                <a href="#" className="hover:underline">Política de privacidad</a>
                <a href="#" className="hover:underline">Términos del servicio</a>
            </div>
        </form>
    );
}
