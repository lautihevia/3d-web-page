"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "@/lib/validators/auth";
import { register as registerUser } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Página de registro de usuario.
 */
export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        setError(null);
        setIsLoading(true);

        try {
            await registerUser(data.email, data.password, data.fullName);
            router.push("/");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al registrar usuario");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        Crear Cuenta
                    </CardTitle>
                    <CardDescription className="text-center">
                        Registrate para realizar compras
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                        {/* Error general */}
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                                {error}
                            </div>
                        )}

                        {/* Nombre completo */}
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Nombre completo</Label>
                            <Input
                                id="fullName"
                                type="text"
                                placeholder="Juan Pérez"
                                {...register("fullName")}
                                aria-invalid={errors.fullName ? "true" : "false"}
                            />
                            {errors.fullName && (
                                <p className="text-sm text-red-600">{errors.fullName.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="tu@email.com"
                                {...register("email")}
                                aria-invalid={errors.email ? "true" : "false"}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...register("password")}
                                aria-invalid={errors.password ? "true" : "false"}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
                        </Button>

                        <p className="text-sm text-muted-foreground text-center">
                            ¿Ya tenés cuenta?{" "}
                            <Link href="/auth/login" className="text-primary hover:underline">
                                Iniciá sesión
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </main>
    );
}
