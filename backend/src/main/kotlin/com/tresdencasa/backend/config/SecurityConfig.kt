package com.tresdencasa.backend.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.SecurityFilterChain
import org.springframework.web.cors.CorsConfigurationSource

/**
 * Configuración de Spring Security para API REST.
 * - Endpoints de productos son públicos
 * - API Stateless (sin sesiones)
 * - CSRF deshabilitado para API REST
 */
@Configuration
@EnableWebSecurity
class SecurityConfig(
    private val corsConfigurationSource: CorsConfigurationSource
) {

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            // Habilitar CORS usando la configuración definida en CorsConfig
            .cors { it.configurationSource(corsConfigurationSource) }
            
            // Deshabilitar CSRF ya que es una API Stateless
            .csrf { it.disable() }
            
            // Configurar sesión como STATELESS
            .sessionManagement { session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            }
            
            // Configurar autorización de endpoints
            .authorizeHttpRequests { auth ->
                auth
                    // Endpoints públicos del catálogo
                    .requestMatchers("/api/v1/products/**").permitAll()
                    // Endpoint de health check
                    .requestMatchers("/ping").permitAll()
                    // Todo lo demás requiere autenticación
                    .anyRequest().authenticated()
            }
            
            // Deshabilitar form login (no aplica para API REST)
            .formLogin { it.disable() }
            
            // Deshabilitar HTTP Basic (usaremos JWT más adelante)
            .httpBasic { it.disable() }

        return http.build()
    }
}
