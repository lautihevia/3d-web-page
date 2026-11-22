package com.tresdencasa.backend.course

import jakarta.persistence.*
import org.springframework.data.jpa.repository.JpaRepository

/** Un video del curso. Se guarda solo el id de YouTube; los links y la miniatura se arman desde ahí. */
@Entity
@Table(name = "course_videos")
class CourseVideo(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY) val id: Long? = null,
        @Column(name = "youtube_id", nullable = false, unique = true, length = 11) var youtubeId: String,
        @Column(length = 60) var label: String? = null,
        @Column(nullable = false, length = 200) var title: String,
        @Column(columnDefinition = "TEXT") var description: String? = null,
        @Column(name = "sort_order", nullable = false) var sortOrder: Int = 0,
        @Column(nullable = false) var active: Boolean = true
)

interface CourseVideoRepository : JpaRepository<CourseVideo, Long> {
    fun findAllByOrderBySortOrderAscIdAsc(): List<CourseVideo>
    fun findAllByActiveTrueOrderBySortOrderAscIdAsc(): List<CourseVideo>
    fun existsByYoutubeId(youtubeId: String): Boolean
}

data class CourseVideoDto(
        val id: Long,
        val youtubeId: String,
        val url: String,
        val thumbnailUrl: String,
        val label: String?,
        val title: String,
        val description: String?,
        val sortOrder: Int,
        val active: Boolean
)

/** Lo que manda el admin al crear o editar. En la edición el link no cambia. */
data class CourseVideoRequest(
        val url: String? = null,
        val label: String? = null,
        val title: String? = null,
        val description: String? = null,
        val active: Boolean = true
)

data class CourseVideoOrderRequest(val ids: List<Long> = emptyList())

data class CourseVideoLookupDto(val youtubeId: String, val title: String?, val thumbnailUrl: String)

fun CourseVideo.toDto() =
        CourseVideoDto(
                id = id!!,
                youtubeId = youtubeId,
                url = YoutubeIds.watchUrl(youtubeId),
                thumbnailUrl = thumbnailUrl(youtubeId),
                label = label,
                title = title,
                description = description,
                sortOrder = sortOrder,
                active = active
        )

fun thumbnailUrl(youtubeId: String) = "https://i.ytimg.com/vi/$youtubeId/hqdefault.jpg"
