package com.tresdencasa.backend.config

import com.tresdencasa.backend.auth.Role
import com.tresdencasa.backend.auth.User
import com.tresdencasa.backend.auth.UserRepository
import org.slf4j.LoggerFactory
import org.springframework.boot.CommandLineRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.crypto.password.PasswordEncoder

/** Inicializa datos por defecto al arrancar la aplicación. */
@Configuration
class AdminInitializer(
        private val userRepository: UserRepository,
        private val passwordEncoder: PasswordEncoder
) {

    private val logger = LoggerFactory.getLogger(AdminInitializer::class.java)

    @Bean
    fun initAdminUser(): CommandLineRunner = CommandLineRunner {
        val adminEmail = "admin@3dencasa.com"

        if (!userRepository.existsByEmail(adminEmail)) {
            val adminUser =
                    User(
                            email = adminEmail,
                            passwordHash = passwordEncoder.encode("admin123")!!,
                            fullName = "Administrador",
                            role = Role.ADMIN
                    )
            userRepository.save(adminUser)
            logger.info("✅ Usuario admin creado: $adminEmail")
        } else {
            logger.info("ℹ️ Usuario admin ya existe: $adminEmail")
        }
    }
}
