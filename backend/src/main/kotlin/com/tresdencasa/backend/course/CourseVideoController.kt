package com.tresdencasa.backend.course

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

/** Lectura pública para la página /curso. */
@RestController
@RequestMapping("/api/v1/course-videos")
class CourseVideoController(private val service: CourseVideoService) {
    @GetMapping fun list(): List<CourseVideoDto> = service.listPublic()
}

@RestController
@RequestMapping("/api/v1/admin/course-videos")
class AdminCourseVideoController(private val service: CourseVideoService) {

    @GetMapping fun list(): List<CourseVideoDto> = service.listAll()

    @GetMapping("/lookup") fun lookup(@RequestParam url: String) = handle { service.lookup(url) }

    @PostMapping fun create(@RequestBody req: CourseVideoRequest) = handle { service.create(req) }

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @RequestBody req: CourseVideoRequest) = handle { service.update(id, req) }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long) = handle { service.delete(id); null }

    @PutMapping("/order")
    fun reorder(@RequestBody req: CourseVideoOrderRequest) = handle { service.reorder(req.ids) }

    private fun handle(block: () -> Any?): ResponseEntity<Any> =
            try {
                val body = block()
                if (body == null) ResponseEntity.noContent().build() else ResponseEntity.ok(body)
            } catch (e: InvalidCourseVideoException) {
                ResponseEntity.badRequest().body(mapOf("errors" to listOf(e.message)))
            } catch (e: CourseVideoNotFoundException) {
                ResponseEntity.notFound().build()
            }
}
