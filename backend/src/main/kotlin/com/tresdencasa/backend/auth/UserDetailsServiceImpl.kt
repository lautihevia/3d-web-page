package com.tresdencasa.backend.auth

import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

/** Implementación de UserDetailsService para cargar usuarios desde la base de datos. */
@Service
class UserDetailsServiceImpl(private val userRepository: UserRepository) : UserDetailsService {

    override fun loadUserByUsername(username: String): UserDetails {
        return userRepository.findByEmail(username)
                ?: throw UsernameNotFoundException("Usuario no encontrado: $username")
    }
}
