package com.tresdencasa.backend.installments

import java.math.BigDecimal

data class InstallmentPlanDto(
        val installments: Int,
        val variableRate: BigDecimal,
        val active: Boolean
)

data class InstallmentsDto(
        val creditFixedRate: BigDecimal,
        val debitRate: BigDecimal,
        val debitActive: Boolean,
        val plans: List<InstallmentPlanDto>
)

/** Valores del procesador de pagos al momento de crear la feature. */
object InstallmentsDefaults {
    /** Las únicas cantidades de cuotas que ofrece la tienda. */
    val INSTALLMENT_COUNTS = listOf(1, 2, 3, 6, 9, 12)

    private val variableRates =
            mapOf(1 to "0", 2 to "7.79", 3 to "10.5", 6 to "18.7", 9 to "26.5", 12 to "32.3")

    fun dto() =
            InstallmentsDto(
                    creditFixedRate = BigDecimal("4.28"),
                    debitRate = BigDecimal("3.06"),
                    debitActive = true,
                    plans =
                            INSTALLMENT_COUNTS.map {
                                InstallmentPlanDto(it, BigDecimal(variableRates.getValue(it)), true)
                            }
            )
}

/**
 * El precio con tarjeta se calcula como precio / (1 - tasa), así que una tasa de
 * 100% o más rompe la cuenta. Devuelve los errores en español para mostrarlos tal
 * cual en el admin; lista vacía = válido.
 */
object InstallmentsValidator {
    private val HUNDRED = BigDecimal(100)

    fun validate(dto: InstallmentsDto): List<String> {
        val errors = mutableListOf<String>()

        if (dto.creditFixedRate.signum() < 0) errors += "El % fijo de crédito no puede ser negativo."
        if (dto.debitRate.signum() < 0) errors += "El % de débito no puede ser negativo."
        if (dto.debitRate >= HUNDRED) errors += "El % de débito tiene que ser menor a 100."

        val counts = dto.plans.map { it.installments }
        if (counts.sorted() != InstallmentsDefaults.INSTALLMENT_COUNTS) {
            errors += "Los planes tienen que ser exactamente 1, 2, 3, 6, 9 y 12 cuotas."
        }

        for (plan in dto.plans) {
            if (plan.variableRate.signum() < 0) {
                errors += "El % variable de ${plan.installments} cuotas no puede ser negativo."
            } else if (dto.creditFixedRate + plan.variableRate >= HUNDRED) {
                errors += "En ${plan.installments} cuotas, fijo + variable tiene que ser menor a 100%."
            }
        }
        return errors
    }
}
