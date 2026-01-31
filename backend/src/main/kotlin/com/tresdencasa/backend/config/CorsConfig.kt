package com.tresdencasa.backend.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

/**
 * Configuración de CORS para permitir peticiones desde el frontend Next.js.
 */
@Configuration
class CorsConfig {

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration().apply {
            // Orígenes permitidos (frontend Next.js en desarrollo)
            allowedOrigins = listOf(
                "http://localhost:3000",
                "http://127.0.0.1:3000"
            )
            
            // Métodos HTTP permitidos
            allowedMethods = listOf("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
            
            // Headers permitidos
            allowedHeaders = listOf("*")
            
            // Permitir envío de credenciales (cookies, Authorization headers)
            allowCredentials = true
            
            // Tiempo de cache para preflight requests (1 hora)
            maxAge = 3600L
        }

        return UrlBasedCorsConfigurationSource().apply {
            registerCorsConfiguration("/api/**", configuration)
        }
    }
}
