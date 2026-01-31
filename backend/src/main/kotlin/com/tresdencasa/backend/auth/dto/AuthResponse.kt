package com.tresdencasa.backend.auth.dto

/** Response con el token JWT. */
data class AuthResponse(val token: String, val email: String, val fullName: String)
