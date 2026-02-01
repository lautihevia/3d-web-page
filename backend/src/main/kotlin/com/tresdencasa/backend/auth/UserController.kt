package com.tresdencasa.backend.auth

import com.tresdencasa.backend.auth.dto.ChangePasswordRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException

/** Controller para operaciones del usuario autenticado. */
@RestController
@RequestMapping("/api/v1/users")
class UserController(
        private val userRepository: UserRepository,
        private val passwordEncoder: PasswordEncoder
) {

    /** Cambiar contraseña del usuario autenticado. */
    @PutMapping("/change-password")
    fun changePassword(
            @AuthenticationPrincipal user: User,
            @RequestBody request: ChangePasswordRequest
    ): ResponseEntity<Map<String, String>> {
        // Verificar contraseña actual
        if (!passwordEncoder.matches(request.currentPassword, user.password)) {
            throw ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La contraseña actual es incorrecta"
            )
        }

        // Crear usuario con nueva contraseña (Kotlin data class workaround)
        val updatedUser =
                User(
                        id = user.id,
                        email = user.email,
                        passwordHash = passwordEncoder.encode(request.newPassword),
                        fullName = user.fullName,
                        role = user.role
                )

        userRepository.save(updatedUser)

        return ResponseEntity.ok(mapOf("message" to "Contraseña actualizada correctamente"))
    }
}
