package com.tresdencasa.backend.auth

import java.util.UUID
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

/** Repository para operaciones de base de datos con usuarios. */
@Repository
interface UserRepository : JpaRepository<User, UUID> {

    /** Busca un usuario por email. */
    fun findByEmail(email: String): User?

    /** Verifica si existe un usuario con el email dado. */
    fun existsByEmail(email: String): Boolean
}
