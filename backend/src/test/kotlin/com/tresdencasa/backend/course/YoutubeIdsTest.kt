package com.tresdencasa.backend.course

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Test

class YoutubeIdsTest {
    @Test
    fun `parses the usual link shapes`() {
        listOf(
                        "https://www.youtube.com/watch?v=nTEq_dpQvmc",
                        "https://youtube.com/watch?feature=share&v=nTEq_dpQvmc&t=30s",
                        "https://m.youtube.com/watch?v=nTEq_dpQvmc",
                        "https://youtu.be/nTEq_dpQvmc?si=abc",
                        "https://www.youtube.com/shorts/nTEq_dpQvmc",
                        "https://www.youtube.com/embed/nTEq_dpQvmc",
                        "https://www.youtube.com/live/nTEq_dpQvmc",
                        "  www.youtube.com/watch?v=nTEq_dpQvmc  ",
                        "nTEq_dpQvmc"
                )
                .forEach { assertEquals("nTEq_dpQvmc", YoutubeIds.parse(it), it) }
    }

    @Test
    fun `rejects anything that is not a youtube video`() {
        listOf(
                        "",
                        "https://www.youtube.com/@3Dencasa",
                        "https://vimeo.com/watch?v=nTEq_dpQvmc",
                        "https://www.youtube.com/watch?v=short",
                        "hola"
                )
                .forEach { assertNull(YoutubeIds.parse(it), it) }
    }
}
