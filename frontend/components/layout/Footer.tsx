import Link from "next/link";
import { Github, Instagram, Linkedin, Mail } from "lucide-react";

/**
 * Footer global de la aplicación.
 * Visible en todas las páginas con 3 columnas: Marca, Navegación y Redes Sociales.
 */
export function Footer() {
    return (
        <footer className="border-t bg-slate-950 text-slate-200">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Columna 1: Marca */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-white">3dencasa</h3>
                        <p className="text-sm text-slate-400 max-w-xs">
                            Materializa tus ideas con tecnología de impresión 3D profesional.
                            Calidad, innovación y servicio personalizado.
                        </p>
                    </div>

                    {/* Columna 2: Navegación */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                            Navegación
                        </h4>
                        <nav className="flex flex-col space-y-2">
                            <Link
                                href="/"
                                className="text-sm text-slate-400 hover:text-white transition-colors"
                            >
                                Inicio
                            </Link>
                            <Link
                                href="/store"
                                className="text-sm text-slate-400 hover:text-white transition-colors"
                            >
                                Tienda
                            </Link>
                            <Link
                                href="/login"
                                className="text-sm text-slate-400 hover:text-white transition-colors"
                            >
                                Login
                            </Link>
                        </nav>
                    </div>

                    {/* Columna 3: Redes Sociales */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                            Síguenos
                        </h4>
                        <div className="flex space-x-4">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-400 hover:text-white transition-colors"
                                aria-label="GitHub"
                            >
                                <Github className="h-5 w-5" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-400 hover:text-white transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-400 hover:text-white transition-colors"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a
                                href="mailto:contacto@3dencasa.com"
                                className="text-slate-400 hover:text-white transition-colors"
                                aria-label="Email"
                            >
                                <Mail className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-8 border-t border-slate-800 text-center">
                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} 3dencasa. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
