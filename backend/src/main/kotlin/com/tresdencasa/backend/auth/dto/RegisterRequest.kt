package com.tresdencasa.backend.auth.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

/** Request para registro de usuario. */
data class RegisterRequest(
        @field:Email(message = "Email debe ser válido")
        @field:NotBlank(message = "Email es requerido")
        val email: String = "",
        @field:NotBlank(message = "Contraseña es requerida")
        @field:Size(min = 6, message = "Contraseña debe tener al menos 6 caracteres")
        val password: String = "",
        @field:NotBlank(message = "Nombre completo es requerido")
        @field:Size(min = 2, message = "Nombre debe tener al menos 2 caracteres")
        val fullName: String = ""
)
