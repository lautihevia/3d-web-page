package com.tresdencasa.backend.course

import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.client.RestClient
import org.springframework.web.util.UriComponentsBuilder

class InvalidCourseVideoException(message: String) : RuntimeException(message)

class CourseVideoNotFoundException : RuntimeException("Video no encontrado")

@Service
class CourseVideoService(private val repository: CourseVideoRepository) {

    private val youtube = RestClient.create()

    @Transactional(readOnly = true)
    fun listPublic(): List<CourseVideoDto> = repository.findAllByActiveTrueOrderBySortOrderAscIdAsc().map { it.toDto() }

    @Transactional(readOnly = true)
    fun listAll(): List<CourseVideoDto> = repository.findAllByOrderBySortOrderAscIdAsc().map { it.toDto() }

    @Transactional
    fun create(req: CourseVideoRequest): CourseVideoDto {
        val youtubeId = YoutubeIds.parse(req.url ?: "") ?: throw InvalidCourseVideoException("El link no es un video de YouTube.")
        if (repository.existsByYoutubeId(youtubeId)) throw InvalidCourseVideoException("Ese video ya está cargado.")
        val title = req.title?.trim()?.takeIf { it.isNotEmpty() } ?: fetchTitle(youtubeId)
                ?: throw InvalidCourseVideoException("Falta el título.")
        val nextOrder = (repository.findAllByOrderBySortOrderAscIdAsc().maxOfOrNull { it.sortOrder } ?: -1) + 1
        return repository
                .save(
                        CourseVideo(
                                youtubeId = youtubeId,
                                label = req.label.clean(),
                                title = title.take(200),
                                description = req.description.clean(),
                                sortOrder = nextOrder,
                                active = req.active
                        )
                )
                .toDto()
    }

    @Transactional
    fun update(id: Long, req: CourseVideoRequest): CourseVideoDto {
        val video = repository.findById(id).orElseThrow { CourseVideoNotFoundException() }
        val title = req.title?.trim()?.takeIf { it.isNotEmpty() } ?: throw InvalidCourseVideoException("Falta el título.")
        video.label = req.label.clean()
        video.title = title.take(200)
        video.description = req.description.clean()
        video.active = req.active
        return repository.save(video).toDto()
    }

    @Transactional
    fun delete(id: Long) {
        if (!repository.existsById(id)) throw CourseVideoNotFoundException()
        repository.deleteById(id)
    }

    /** Reordena según la lista de ids; los que no vengan quedan al final en su orden actual. */
    @Transactional
    fun reorder(ids: List<Long>): List<CourseVideoDto> {
        val all = repository.findAllByOrderBySortOrderAscIdAsc()
        val byId = all.associateBy { it.id!! }
        val ordered = ids.distinct().mapNotNull { byId[it] } + all.filter { it.id !in ids }
        ordered.forEachIndexed { i, v -> v.sortOrder = i }
        repository.saveAll(ordered)
        return listAll()
    }

    fun lookup(url: String): CourseVideoLookupDto {
        val youtubeId = YoutubeIds.parse(url) ?: throw InvalidCourseVideoException("El link no es un video de YouTube.")
        return CourseVideoLookupDto(youtubeId, fetchTitle(youtubeId), thumbnailUrl(youtubeId))
    }

    /** Título público del video vía oEmbed de YouTube (no requiere API key). Si falla, null. */
    private fun fetchTitle(youtubeId: String): String? =
            runCatching {
                        val uri =
                                UriComponentsBuilder.fromUriString("https://www.youtube.com/oembed")
                                        .queryParam("url", YoutubeIds.watchUrl(youtubeId))
                                        .queryParam("format", "json")
                                        .build()
                                        .toUri()
                        youtube.get().uri(uri).retrieve().body(Map::class.java)?.get("title") as? String
                    }
                    .getOrNull()

    @Transactional
    fun seedIfEmpty(): Boolean {
        if (repository.count() > 0) return false
        SEED.forEachIndexed { i, (id, label, title) ->
            repository.save(CourseVideo(youtubeId = id, label = label, title = title, sortOrder = i))
        }
        return true
    }

    private fun String?.clean() = this?.trim()?.takeIf { it.isNotEmpty() }

    companion object {
        val SEED =
                listOf(
                        Triple("tnds14uuIxA", "Introducción", "Curso de impresión 3D desde cero, totalmente gratis"),
                        Triple("nTEq_dpQvmc", "Clase 1", "¿Qué es una impresora 3D?"),
                        Triple("jcNfxU-czT8", "Clase 2", "¿Qué impresora comprar?"),
                        Triple("gsOfib-vbaA", "Clase 3", "Tipos de filamentos")
                )
    }
}

@Component
class CourseVideoSeeder(private val service: CourseVideoService) : CommandLineRunner {
    override fun run(vararg args: String) {
        if (service.seedIfEmpty()) println("🎬 Curso: videos iniciales cargados")
    }
}
