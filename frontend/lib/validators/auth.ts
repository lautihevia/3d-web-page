import { z } from "zod";

/**
 * Schema de validación para login.
 */
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "El email es requerido")
        .email("Ingresa un email válido"),
    password: z
        .string()
        .min(1, "La contraseña es requerida")
        .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

/**
 * Schema de validación para registro.
 */
export const registerSchema = z.object({
    email: z
        .string()
        .min(1, "El email es requerido")
        .email("Ingresa un email válido"),
    password: z
        .string()
        .min(1, "La contraseña es requerida")
        .min(6, "La contraseña debe tener al menos 6 caracteres"),
    fullName: z
        .string()
        .min(1, "El nombre es requerido")
        .min(2, "El nombre debe tener al menos 2 caracteres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
