package com.tresdencasa.backend.auth

import com.tresdencasa.backend.auth.dto.AuthRequest
import com.tresdencasa.backend.auth.dto.AuthResponse
import com.tresdencasa.backend.auth.dto.RegisterRequest
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.*

/** Controller para endpoints de autenticación. */
@RestController
@RequestMapping("/api/v1/auth")
class AuthController(
        private val userRepository: UserRepository,
        private val passwordEncoder: PasswordEncoder,
        private val jwtService: JwtService,
        private val authenticationManager: AuthenticationManager
) {

        /** Registra un nuevo usuario. POST /api/v1/auth/register */
        @PostMapping("/register")
        fun register(@Valid @RequestBody request: RegisterRequest): ResponseEntity<Any> {
                // Verificar si el email ya existe
                if (userRepository.existsByEmail(request.email)) {
                        return ResponseEntity.status(HttpStatus.CONFLICT)
                                .body(mapOf("error" to "El email ya está registrado"))
                }

                // Crear usuario con password hasheado
                val user =
                        User(
                                email = request.email,
                                passwordHash = passwordEncoder.encode(request.password)!!,
                                fullName = request.fullName,
                                role = Role.CUSTOMER
                        )

                val savedUser = userRepository.save(user)

                // Generar token con role
                val token =
                        jwtService.generateToken(mapOf("role" to savedUser.role.name), savedUser)

                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(
                                AuthResponse(
                                        token = token,
                                        email = savedUser.email,
                                        fullName = savedUser.fullName
                                )
                        )
        }

        /** Autentica un usuario existente. POST /api/v1/auth/login */
        @PostMapping("/login")
        fun login(@Valid @RequestBody request: AuthRequest): ResponseEntity<Any> {
                try {
                        authenticationManager.authenticate(
                                UsernamePasswordAuthenticationToken(request.email, request.password)
                        )
                } catch (e: BadCredentialsException) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(mapOf("error" to "Email o contraseña incorrectos"))
                }

                val user =
                        userRepository.findByEmail(request.email)
                                ?: return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                        .body(mapOf("error" to "Usuario no encontrado"))

                // Generar token con role
                val token = jwtService.generateToken(mapOf("role" to user.role.name), user)

                return ResponseEntity.ok(
                        AuthResponse(token = token, email = user.email, fullName = user.fullName)
                )
        }
}
