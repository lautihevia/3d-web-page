package com.tresdencasa.backend.auth.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank

/** Request para login de usuario. */
data class AuthRequest(
        @field:Email(message = "Email debe ser válido")
        @field:NotBlank(message = "Email es requerido")
        val email: String = "",
        @field:NotBlank(message = "Contraseña es requerida") val password: String = ""
)
