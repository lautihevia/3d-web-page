package com.tresdencasa.backend.auth.dto

/** Request para cambiar contraseña. */
data class ChangePasswordRequest(val currentPassword: String, val newPassword: String)
