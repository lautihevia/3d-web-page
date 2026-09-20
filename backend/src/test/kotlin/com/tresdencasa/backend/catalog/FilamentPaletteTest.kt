package com.tresdencasa.backend.catalog

import kotlin.test.assertEquals
import kotlin.test.assertTrue
import org.junit.jupiter.api.Test

/**
 * Los casos de abajo son los nombres de color que ya estaban cargados en
 * producción cuando se agregó el filtro por color. Si la deducción los rompe,
 * el backfill deja filamentos fuera del filtro sin avisar.
 */
class FilamentPaletteTest {

    private fun assertInfers(colorName: String, vararg expected: String) {
        assertEquals(
                expected.toSortedSet(),
                FilamentPalette.inferFrom(colorName).toSortedSet(),
                "colorName = '$colorName'"
        )
    }

    @Test
    fun `colores lisos, sin importar mayusculas ni acentos`() {
        assertInfers("Blanco", "blanco")
        assertInfers("Negro", "negro")
        assertInfers("amarillo", "amarillo")
        assertInfers("Azul", "azul")
        assertInfers("rojo", "rojo")
        assertInfers("Piel", "piel")
        assertInfers("Rosado", "rosado")
        assertInfers("Naranja", "naranja")
        assertInfers("Gris", "gris")
        assertInfers("Violeta", "violeta")
        assertInfers("Celeste", "celeste")
    }

    @Test
    fun `las variantes de tono caen en el color base`() {
        assertInfers("Verde Claro", "verde")
        assertInfers("Verde Oscuro", "verde")
        assertInfers("Marrón Oscuro", "marron")
        assertInfers("Marrón claro", "marron")
        assertInfers("Amarillo flúor", "amarillo")
        assertInfers("Verde jade", "verde")
    }

    @Test
    fun `un nombre puede caer en varios colores a la vez`() {
        assertInfers("Amarillo, Azul, Rojo", "amarillo", "azul", "rojo")
        assertInfers("Verde, Azul, Rojo", "verde", "azul", "rojo")
        assertInfers("Celeste glow", "celeste", "glow")
        assertInfers("Bronce", "amarillo", "marron")
    }

    @Test
    fun `los acabados quedan etiquetados como tales`() {
        assertInfers("Cristal", "cristal")
        assertInfers("Mármol", "marmol")
        assertInfers("Multicolor Silk", "multicolor")
        assertInfers("Multicolor Pastel", "multicolor")
        // El dorado y el plateado suman su color base para que también
        // aparezcan al filtrar por amarillo o gris.
        assertInfers("Dorado", "dorado", "amarillo")
        assertInfers("Plateado", "plateado", "gris")
    }

    @Test
    fun `un nombre irreconocible no inventa etiquetas`() {
        assertTrue(FilamentPalette.inferFrom("Edición limitada").isEmpty())
        assertTrue(FilamentPalette.inferFrom("").isEmpty())
    }

    @Test
    fun `sanitize descarta lo que no sea una clave valida`() {
        assertEquals(
                setOf("rojo", "azul"),
                FilamentPalette.sanitize(listOf("Rojo", "AZUL", "turquesa-raro", ""))
        )
    }

    @Test
    fun `toda clave deducida existe en la paleta`() {
        val names = listOf(
                "Blanco", "Negro", "amarillo", "Celeste glow", "Azul", "rojo", "Piel",
                "Verde Claro", "Rosado", "Naranja", "Marrón Oscuro", "Gris", "Verde Oscuro",
                "Marrón claro", "Violeta", "Cristal", "Celeste", "Mármol", "Plateado",
                "Amarillo flúor", "Multicolor Silk", "Multicolor Pastel",
                "Amarillo, Azul, Rojo", "Verde, Azul, Rojo", "verde", "azul", "Dorado",
                "Verde jade"
        )
        for (name in names) {
            val keys = FilamentPalette.inferFrom(name)
            assertTrue(keys.isNotEmpty(), "'$name' quedaría sin etiquetar")
            assertTrue(
                    FilamentPalette.KEYS.containsAll(keys),
                    "'$name' produjo claves fuera de la paleta: $keys"
            )
        }
    }
}
