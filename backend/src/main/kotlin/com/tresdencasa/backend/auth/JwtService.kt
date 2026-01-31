package com.tresdencasa.backend.auth

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.io.Decoders
import io.jsonwebtoken.security.Keys
import java.util.Date
import javax.crypto.SecretKey
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service

/** Servicio para generación y validación de tokens JWT. */
@Service
class JwtService(
        @Value("\${jwt.secret}") private val secretKey: String,
        @Value("\${jwt.expiration:86400000}") private val jwtExpiration: Long
) {

    /** Genera un token JWT para el usuario. */
    fun generateToken(userDetails: UserDetails): String {
        return generateToken(emptyMap(), userDetails)
    }

    /** Genera un token JWT con claims adicionales. */
    fun generateToken(extraClaims: Map<String, Any>, userDetails: UserDetails): String {
        return Jwts.builder()
                .claims(extraClaims)
                .subject(userDetails.username)
                .issuedAt(Date())
                .expiration(Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSigningKey())
                .compact()
    }

    /** Extrae el email (subject) del token. */
    fun extractEmail(token: String): String? {
        return extractClaim(token, Claims::getSubject)
    }

    /** Verifica si el token es válido para el usuario. */
    fun isTokenValid(token: String, userDetails: UserDetails): Boolean {
        val email = extractEmail(token)
        return email == userDetails.username && !isTokenExpired(token)
    }

    /** Extrae un claim específico del token. */
    private fun <T> extractClaim(token: String, claimsResolver: (Claims) -> T): T {
        val claims = extractAllClaims(token)
        return claimsResolver(claims)
    }

    /** Extrae todos los claims del token. */
    private fun extractAllClaims(token: String): Claims {
        return Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token).payload
    }

    /** Verifica si el token ha expirado. */
    private fun isTokenExpired(token: String): Boolean {
        return extractClaim(token, Claims::getExpiration).before(Date())
    }

    /** Obtiene la clave de firma. */
    private fun getSigningKey(): SecretKey {
        val keyBytes = Decoders.BASE64.decode(secretKey)
        return Keys.hmacShaKeyFor(keyBytes)
    }
}
