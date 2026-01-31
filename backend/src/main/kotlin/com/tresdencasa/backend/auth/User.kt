package com.tresdencasa.backend.auth

import jakarta.persistence.*
import java.util.UUID
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

/**
 * Entidad de usuario para autenticación. Implementa UserDetails para integración con Spring
 * Security.
 */
@Entity
@Table(name = "users")
class User(
        @Id @GeneratedValue(strategy = GenerationType.UUID) val id: UUID? = null,
        @Column(unique = true, nullable = false) val email: String,
        @Column(name = "password_hash", nullable = false) private val passwordHash: String,
        @Column(name = "full_name", nullable = false) val fullName: String,
        @Enumerated(EnumType.STRING) @Column(nullable = false) val role: Role = Role.CUSTOMER
) : UserDetails {

    override fun getAuthorities(): Collection<GrantedAuthority> {
        return listOf(SimpleGrantedAuthority("ROLE_${role.name}"))
    }

    override fun getPassword(): String = passwordHash

    override fun getUsername(): String = email

    override fun isAccountNonExpired(): Boolean = true

    override fun isAccountNonLocked(): Boolean = true

    override fun isCredentialsNonExpired(): Boolean = true

    override fun isEnabled(): Boolean = true
}
