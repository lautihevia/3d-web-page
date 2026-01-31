const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface AuthResponse {
    token: string;
    email: string;
    fullName: string;
}

export interface AuthError {
    error: string;
}

/**
 * Registra un nuevo usuario.
 */
export async function register(
    email: string,
    password: string,
    fullName: string
): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, fullName }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Error al registrar usuario");
    }

    // Guardar token en localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify({ email: data.email, fullName: data.fullName }));

    return data;
}

/**
 * Inicia sesión con email y contraseña.
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Email o contraseña incorrectos");
    }

    // Guardar token en localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify({ email: data.email, fullName: data.fullName }));

    return data;
}

/**
 * Cierra la sesión del usuario.
 */
export function logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}

/**
 * Obtiene el token almacenado.
 */
export function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
}

/**
 * Verifica si hay un usuario autenticado.
 */
export function isAuthenticated(): boolean {
    return !!getToken();
}

/**
 * Obtiene la información del usuario almacenado.
 */
export function getUser(): { email: string; fullName: string } | null {
    if (typeof window === "undefined") return null;
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}
