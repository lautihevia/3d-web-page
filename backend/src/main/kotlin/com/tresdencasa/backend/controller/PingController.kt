package com.tresdencasa.backend.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import java.time.Instant

@RestController
class PingController {

    @GetMapping("/ping")
    fun ping(): Map<String, Any> {
        return mapOf(
            "status" to "ok",
            "message" to "pong",
            "timestamp" to Instant.now().toString()
        )
    }
}
