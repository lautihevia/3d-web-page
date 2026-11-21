package com.tresdencasa.backend.installments

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

/** Lectura pública: el detalle de impresora la necesita sin login. */
@RestController
@RequestMapping("/api/v1/installments")
class InstallmentsController(private val service: InstallmentsService) {
    @GetMapping fun get(): InstallmentsDto = service.get()
}

@RestController
@RequestMapping("/api/v1/admin/installments")
class AdminInstallmentsController(private val service: InstallmentsService) {

    @GetMapping fun get(): InstallmentsDto = service.get()

    @PutMapping
    fun update(@RequestBody dto: InstallmentsDto): ResponseEntity<Any> =
            try {
                ResponseEntity.ok(service.update(dto))
            } catch (e: InvalidInstallmentsException) {
                ResponseEntity.badRequest().body(mapOf("errors" to e.errors))
            }
}
