package com.tresdencasa.backend.config

import org.springframework.beans.factory.annotation.Value
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

    @Value("\${FRONTEND_URL:http://localhost:3000}")
    private lateinit var frontendUrl: String

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration().apply {
            allowedOriginPatterns = listOf(
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "https://*.vercel.app",
                frontendUrl,
                "https://www.3dencasastore.com",
                "https://3dencasastore.com"
            )
            allowedMethods = listOf("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
            allowedHeaders = listOf("*")
            allowCredentials = true
            maxAge = 3600L
        }

        return UrlBasedCorsConfigurationSource().apply {
            registerCorsConfiguration("/api/**", configuration)
        }
    }
}
