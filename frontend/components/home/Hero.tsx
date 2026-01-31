"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Hero Carousel para la página principal.
 * Carrusel de 4 imágenes con auto-avance y controles manuales.
 */
export function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = 4;

    // Imágenes locales hardcodeadas
    const slides = [
        { id: 1, src: "/banners/banner-1.jpeg", alt: "Banner Promocional 1" },
        { id: 2, src: "/banners/banner-2.jpeg", alt: "Banner Promocional 2" },
        { id: 3, src: "/banners/banner-3.jpeg", alt: "Banner Promocional 3" },
        { id: 4, src: "/banners/banner-4.jpeg", alt: "Banner Promocional 4" },
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
        <section className="relative w-full h-[400px] md:h-[600px] lg:h-[700px] overflow-hidden bg-slate-900">
            {/* Slides */}
            <div className="relative w-full h-full">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${index === currentSlide ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        <Image
                            src={slide.src}
                            alt={slide.alt}
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />
                    </div>
                ))}
            </div>

            {/* Controles: Flechas */}
            <button
                onClick={goToPrevious}
                aria-label="Slide anterior"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors backdrop-blur-sm z-10"
            >
                <ChevronLeft className="h-6 w-6" />
            </button>
            <button
                onClick={goToNext}
                aria-label="Slide siguiente"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors backdrop-blur-sm z-10"
            >
                <ChevronRight className="h-6 w-6" />
            </button>

            {/* Indicadores (Dots) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        aria-label={`Ir a slide ${index + 1}`}
                        className={`h-2 rounded-full transition-all shadow-sm ${index === currentSlide
                            ? "bg-white w-8"
                            : "bg-white/50 hover:bg-white/80 w-2"
                            }`}
                    />
                ))}
            </div>
        </section>
    );
}
