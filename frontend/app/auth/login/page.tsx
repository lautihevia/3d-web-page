"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/validators/auth";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/**
 * Página de inicio de sesión.
 */
export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuthStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/v1/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: data.email, password: data.password }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Email o contraseña incorrectos");
            }

            // Actualizar el store de Zustand (esto actualiza el Navbar)
            login(result.token, { email: result.email, fullName: result.fullName });

            // Redirigir a la URL especificada o a home
            const redirectTo = searchParams.get("redirect") || "/";
            router.push(redirectTo);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al iniciar sesión");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        Iniciar Sesión
                    </CardTitle>
                    <CardDescription className="text-center">
                        Ingresá tu email y contraseña para acceder
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
                            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                        </Button>

                        <p className="text-sm text-muted-foreground text-center">
                            ¿No tenés cuenta?{" "}
                            <Link href="/auth/register" className="text-primary hover:underline">
                                Registrate
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </main>
    );
}
