import { create } from "zustand";

interface User {
    email: string;
    fullName: string;
    role?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    initialize: () => void;
}

/**
 * Store de autenticación con Zustand.
 * Sincroniza con localStorage y decodifica el rol del JWT.
 */
export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,

    login: (token: string, user: User) => {
        // Decodificar rol del JWT
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            user.role = payload.role;
        } catch {
            // Si falla el decode, continuar sin rol
        }

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        set({ user, isAuthenticated: true, isLoading: false });
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({ user: null, isAuthenticated: false });
    },

    initialize: () => {
        if (typeof window === "undefined") {
            set({ isLoading: false });
            return;
        }

        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");

        if (token && userStr) {
            try {
                const user = JSON.parse(userStr) as User;
                // Decodificar rol del JWT
                const payload = JSON.parse(atob(token.split(".")[1]));
                user.role = payload.role;

                set({ user, isAuthenticated: true, isLoading: false });
            } catch {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                set({ user: null, isAuthenticated: false, isLoading: false });
            }
        } else {
            set({ isLoading: false });
        }
    },
}));
