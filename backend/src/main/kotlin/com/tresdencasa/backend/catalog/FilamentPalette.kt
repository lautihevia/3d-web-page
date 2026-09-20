package com.tresdencasa.backend.catalog

import java.text.Normalizer

/**
 * Paleta canónica de colores de filamento. Las claves viven acá y en
 * `frontend/lib/filamentColors.ts`; si cambiás una, cambiala en los dos lados.
 *
 * Un color de producto se etiqueta con varias claves a la vez: un "Bronce" es
 * amarillo + marron y aparece al filtrar por cualquiera de los dos.
 */
object FilamentPalette {

    /** Colores lisos, los que se dibujan como círculos en el filtro. */
    val SOLID = listOf(
            "blanco", "negro", "gris", "rojo", "naranja", "amarillo", "verde",
            "celeste", "azul", "violeta", "rosado", "marron", "piel"
    )

    /** Acabados, que en el filtro van como chips de texto. */
    val SPECIAL = listOf("dorado", "plateado", "cristal", "marmol", "multicolor", "glow")

    val KEYS: Set<String> = (SOLID + SPECIAL).toSet()

    /**
     * Sinónimos para deducir la paleta a partir del nombre escrito a mano.
     * Se busca por subcadena sobre el nombre normalizado, así "Amarillo, Azul,
     * Rojo" cae en las tres y "Celeste glow" en celeste + glow.
     */
    private val SYNONYMS: List<Pair<String, List<String>>> = listOf(
            "blanco" to listOf("blanco"),
            "negro" to listOf("negro"),
            "gris" to listOf("gris"),
            "rojo" to listOf("rojo"),
            "naranja" to listOf("naranja"),
            "amarillo" to listOf("amarillo"),
            "verde" to listOf("verde"),
            "celeste" to listOf("celeste"),
            "azul" to listOf("azul"),
            "violeta" to listOf("violeta", "lila", "morado", "purpura"),
            "rosado" to listOf("rosa", "fucsia"),
            "marron" to listOf("marron", "cafe", "chocolate"),
            "piel" to listOf("piel", "beige"),
            "dorado" to listOf("dorado", "oro", "gold"),
            "plateado" to listOf("plateado", "plata", "silver"),
            "cristal" to listOf("cristal", "transparente"),
            "marmol" to listOf("marmol"),
            "multicolor" to listOf("multicolor", "tricolor", "arcoiris", "rainbow"),
            "glow" to listOf("glow", "fosforescente")
    )

    /** Combinaciones: el nombre no nombra un color liso pero implica varios. */
    private val COMPOUNDS: List<Pair<String, List<String>>> = listOf(
            "bronce" to listOf("amarillo", "marron"),
            "cobre" to listOf("marron", "naranja"),
            "turquesa" to listOf("celeste", "verde"),
            "jade" to listOf("verde"),
            "dorado" to listOf("amarillo"),
            "plateado" to listOf("gris")
    )

    /** minúsculas y sin acentos, para comparar sin sorpresas. */
    fun normalize(text: String): String =
            Normalizer.normalize(text.trim().lowercase(), Normalizer.Form.NFD)
                    .replace(Regex("\\p{M}+"), "")

    /** Deja solo claves válidas de la paleta, normalizadas y sin repetidos. */
    fun sanitize(raw: Collection<String>?): MutableSet<String> =
            raw.orEmpty()
                    .map { normalize(it) }
                    .filter { it in KEYS }
                    .toMutableSet()

    /**
     * Deduce las claves de paleta a partir del nombre del color.
     * Devuelve vacío si no reconoce nada, para no inventar etiquetas.
     */
    fun inferFrom(colorName: String): MutableSet<String> {
        val name = normalize(colorName)
        if (name.isBlank()) return mutableSetOf()

        val hits = linkedSetOf<String>()
        for ((key, words) in SYNONYMS) {
            if (words.any { name.contains(it) }) hits.add(key)
        }
        for ((word, keys) in COMPOUNDS) {
            if (name.contains(word)) hits.addAll(keys)
        }
        return hits
    }
}
