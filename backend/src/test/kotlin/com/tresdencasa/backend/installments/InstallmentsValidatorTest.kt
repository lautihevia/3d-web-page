package com.tresdencasa.backend.installments

import java.math.BigDecimal
import kotlin.test.assertEquals
import kotlin.test.assertTrue
import org.junit.jupiter.api.Test

class InstallmentsValidatorTest {

    private val valid = InstallmentsDefaults.dto()

    private fun withPlan(installments: Int, rate: String) =
            valid.copy(
                    plans =
                            valid.plans.map {
                                if (it.installments == installments) it.copy(variableRate = BigDecimal(rate))
                                else it
                            }
            )

    @Test
    fun `los valores iniciales son validos`() {
        assertEquals(emptyList(), InstallmentsValidator.validate(valid))
    }

    @Test
    fun `los valores iniciales son los de la tabla del procesador`() {
        assertEquals(BigDecimal("4.28"), valid.creditFixedRate)
        assertEquals(BigDecimal("3.06"), valid.debitRate)
        assertEquals(
                listOf(1 to "0", 2 to "7.79", 3 to "10.5", 6 to "18.7", 9 to "26.5", 12 to "32.3"),
                valid.plans.map { it.installments to it.variableRate.toPlainString() }
        )
        assertTrue(valid.debitActive && valid.plans.all { it.active })
    }

    @Test
    fun `rechaza porcentajes negativos`() {
        assertTrue(InstallmentsValidator.validate(valid.copy(creditFixedRate = BigDecimal("-1"))).isNotEmpty())
        assertTrue(InstallmentsValidator.validate(valid.copy(debitRate = BigDecimal("-0.5"))).isNotEmpty())
        assertTrue(InstallmentsValidator.validate(withPlan(6, "-2")).isNotEmpty())
    }

    @Test
    fun `rechaza tasas de 100 por ciento o mas porque la formula divide por cero`() {
        assertTrue(InstallmentsValidator.validate(withPlan(12, "95.72")).isNotEmpty())
        assertTrue(InstallmentsValidator.validate(valid.copy(debitRate = BigDecimal("100"))).isNotEmpty())
        assertEquals(emptyList(), InstallmentsValidator.validate(withPlan(12, "95.71")))
    }

    @Test
    fun `rechaza cantidades de cuotas distintas de 1 2 3 6 9 12`() {
        val missing = valid.copy(plans = valid.plans.filter { it.installments != 9 })
        assertTrue(InstallmentsValidator.validate(missing).isNotEmpty())
        val extra = valid.copy(plans = valid.plans + InstallmentPlanDto(18, BigDecimal("40"), true))
        assertTrue(InstallmentsValidator.validate(extra).isNotEmpty())
    }
}
