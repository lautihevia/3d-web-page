"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Hero Carousel para la página principal.
 * Carrusel de 4 imágenes con auto-avance y controles manuales.
 */
export function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = 4;

    // Placeholder images (por ahora usamos colores de fondo)
    const slides = [
        { id: 1, bg: "bg-gradient-to-r from-slate-900 to-slate-800" },
        { id: 2, bg: "bg-gradient-to-r from-slate-800 to-slate-900" },
        { id: 3, bg: "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900" },
        { id: 4, bg: "bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800" },
    ];

    // Auto-avance cada 3 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % totalSlides);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const goToPrevious = () => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    const goToNext = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    return (
        <section className="relative w-full h-[500px] overflow-hidden">
            {/* Slides */}
            <div className="relative w-full h-full">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${index === currentSlide ? "opacity-100" : "opacity-0"
                            } ${slide.bg}`}
                    >
                        {/* Aquí irán las imágenes reales cuando las tengas */}
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-white text-4xl font-bold opacity-20">
                                Slide {slide.id}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Controles: Flechas */}
            <button
                onClick={goToPrevious}
                aria-label="Slide anterior"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
                <ChevronLeft className="h-6 w-6" />
            </button>
            <button
                onClick={goToNext}
                aria-label="Slide siguiente"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
                <ChevronRight className="h-6 w-6" />
            </button>

            {/* Indicadores (Dots) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        aria-label={`Ir a slide ${index + 1}`}
                        className={`w-3 h-3 rounded-full transition-all ${index === currentSlide
                                ? "bg-white w-8"
                                : "bg-white/50 hover:bg-white/75"
                            }`}
                    />
                ))}
            </div>
        </section>
    );
}
