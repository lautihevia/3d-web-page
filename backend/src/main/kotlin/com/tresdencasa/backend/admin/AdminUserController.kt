package com.tresdencasa.backend.admin

import com.tresdencasa.backend.admin.dto.UserListDto
import com.tresdencasa.backend.auth.UserRepository
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/** Controller para gestión de usuarios en el panel admin. Requiere rol ADMIN. */
@RestController
@RequestMapping("/api/v1/admin/users")
class AdminUserController(private val userRepository: UserRepository) {

    /** Lista todos los usuarios registrados. */
    @GetMapping
    fun listUsers(): List<UserListDto> {
        return userRepository.findAll().map { user ->
            UserListDto(
                    id = user.id!!,
                    email = user.email,
                    fullName = user.fullName,
                    role = user.role
            )
        }
    }
}
