"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const passwordSchema = z
    .object({
        currentPassword: z.string().min(1, "La contraseña actual es requerida"),
        newPassword: z
            .string()
            .min(6, "La contraseña debe tener al menos 6 caracteres"),
        confirmPassword: z.string().min(1, "Confirma tu nueva contraseña"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    });

type PasswordFormData = z.infer<typeof passwordSchema>;

/**
 * Página de configuración del admin - Cambio de contraseña.
 */
export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
    });

    const onSubmit = async (data: PasswordFormData) => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/v1/users/change-password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword,
                }),
            });

            if (!res.ok) {
                const result = await res.json();
                throw new Error(result.message || "Error al cambiar la contraseña");
            }

            setSuccess(true);
            reset();

            // Ocultar mensaje de éxito después de 5 segundos
            setTimeout(() => setSuccess(false), 5000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cambiar la contraseña");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Configuración</h1>
                <p className="text-muted-foreground">
                    Gestiona la seguridad de tu cuenta.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg">
                            <Lock className="h-5 w-5 text-slate-600" />
                        </div>
                        <div>
                            <CardTitle>Cambiar Contraseña</CardTitle>
                            <CardDescription>
                                Actualiza tu contraseña para mantener tu cuenta segura.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {success && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <p className="text-green-800 text-sm font-medium">
                                Contraseña actualizada correctamente.
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            <p className="text-red-800 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Contraseña Actual */}
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Contraseña Actual</Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                placeholder="••••••••"
                                {...register("currentPassword")}
                                className={errors.currentPassword ? "border-red-500" : ""}
                            />
                            {errors.currentPassword && (
                                <p className="text-sm text-red-500">
                                    {errors.currentPassword.message}
                                </p>
                            )}
                        </div>

                        {/* Nueva Contraseña */}
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">Nueva Contraseña</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                placeholder="••••••••"
                                {...register("newPassword")}
                                className={errors.newPassword ? "border-red-500" : ""}
                            />
                            {errors.newPassword && (
                                <p className="text-sm text-red-500">
                                    {errors.newPassword.message}
                                </p>
                            )}
                        </div>

                        {/* Confirmar Contraseña */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                {...register("confirmPassword")}
                                className={errors.confirmPassword ? "border-red-500" : ""}
                            />
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-500">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                "Guardar Cambios"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
