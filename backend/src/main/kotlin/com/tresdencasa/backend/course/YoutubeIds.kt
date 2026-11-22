package com.tresdencasa.backend.course

import java.net.URI

/** Saca el id de 11 caracteres de un link de YouTube. Devuelve null si no es un video. */
object YoutubeIds {
    private val ID = Regex("^[A-Za-z0-9_-]{11}$")
    private val HOSTS = setOf("youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com")
    private val PATH_PREFIXES = listOf("/shorts/", "/embed/", "/live/")

    fun parse(input: String): String? {
        val raw = input.trim()
        if (ID.matches(raw)) return raw
        val uri =
                runCatching { URI(if (raw.contains("://")) raw else "https://$raw") }.getOrNull()
                        ?: return null
        val host = uri.host?.lowercase() ?: return null
        val path = uri.path ?: ""
        val candidate =
                when {
                    host == "youtu.be" -> path.removePrefix("/").substringBefore("/")
                    host in HOSTS && path == "/watch" ->
                            uri.rawQuery
                                    ?.split("&")
                                    ?.firstOrNull { it.startsWith("v=") }
                                    ?.removePrefix("v=")
                    host in HOSTS ->
                            PATH_PREFIXES.firstOrNull { path.startsWith(it) }
                                    ?.let { path.removePrefix(it).substringBefore("/") }
                    else -> null
                }
        return candidate?.takeIf { ID.matches(it) }
    }

    fun watchUrl(id: String) = "https://www.youtube.com/watch?v=$id"
}
