package com.tresdencasa.backend.config

import com.tresdencasa.backend.auth.JwtAuthenticationFilter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.authentication.dao.DaoAuthenticationProvider
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfigurationSource

/** Configuración de Spring Security para API REST con JWT. */
@Configuration
@EnableWebSecurity
class SecurityConfig(
        private val corsConfigurationSource: CorsConfigurationSource,
        private val jwtAuthenticationFilter: JwtAuthenticationFilter,
        private val userDetailsService: UserDetailsService
) {

    @Bean fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()

    @Bean
    fun authenticationProvider(): AuthenticationProvider {
        // Spring Security 7: DaoAuthenticationProvider requires UserDetailsService in constructor
        val authProvider = DaoAuthenticationProvider(userDetailsService)
        authProvider.setPasswordEncoder(passwordEncoder())
        return authProvider
    }

    @Bean
    fun authenticationManager(config: AuthenticationConfiguration): AuthenticationManager {
        return config.authenticationManager
    }

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
                .cors { it.configurationSource(corsConfigurationSource) }
                .csrf { it.disable() }
                .sessionManagement { session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                }
                .authorizeHttpRequests { auth ->
                    auth.requestMatchers("/api/v1/auth/**")
                            .permitAll()
                            .requestMatchers("/api/v1/products/**")
                            .permitAll()
                            .requestMatchers("/ping")
                            .permitAll()
                            .anyRequest()
                            .authenticated()
                }
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter::class.java
                )
                .formLogin { it.disable() }
                .httpBasic { it.disable() }

        return http.build()
    }
}
