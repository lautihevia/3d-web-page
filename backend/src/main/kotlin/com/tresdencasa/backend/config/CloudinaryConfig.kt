package com.tresdencasa.backend.config

import com.cloudinary.Cloudinary
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

/** Configuración de Cloudinary para subida de imágenes. */
@Configuration
class CloudinaryConfig(
        @Value("\${cloudinary.cloud-name}") private val cloudName: String,
        @Value("\${cloudinary.api-key}") private val apiKey: String,
        @Value("\${cloudinary.api-secret}") private val apiSecret: String
) {

    @Bean
    fun cloudinary(): Cloudinary {
        val config =
                mapOf(
                        "cloud_name" to cloudName,
                        "api_key" to apiKey,
                        "api_secret" to apiSecret,
                        "secure" to true
                )
        return Cloudinary(config)
    }
}
