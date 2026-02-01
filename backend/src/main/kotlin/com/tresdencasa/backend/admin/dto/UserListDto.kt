package com.tresdencasa.backend.admin.dto

import com.tresdencasa.backend.auth.Role
import java.util.UUID

/** DTO para listar usuarios en el panel admin. */
data class UserListDto(val id: UUID, val email: String, val fullName: String, val role: Role)
