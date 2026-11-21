package com.tresdencasa.backend.installments

import jakarta.persistence.*
import java.math.BigDecimal
import org.springframework.data.jpa.repository.JpaRepository

/**
 * Configuración global de pagos con tarjeta. Es una única fila (id = 1).
 * Los porcentajes se guardan en puntos porcentuales: 4.28 significa 4,28%.
 */
@Entity
@Table(name = "installment_settings")
class InstallmentSettings(
        @Id val id: Long = SINGLETON_ID,
        @Column(name = "credit_fixed_rate", nullable = false, precision = 6, scale = 3)
        var creditFixedRate: BigDecimal,
        @Column(name = "debit_rate", nullable = false, precision = 6, scale = 3)
        var debitRate: BigDecimal,
        @Column(name = "debit_active", nullable = false) var debitActive: Boolean = true
) {
    companion object {
        const val SINGLETON_ID = 1L
    }
}

/** Un plan de crédito: la cantidad de cuotas es la clave (1, 2, 3, 6, 9, 12). */
@Entity
@Table(name = "installment_plans")
class InstallmentPlan(
        @Id val installments: Int,
        @Column(name = "variable_rate", nullable = false, precision = 6, scale = 3)
        var variableRate: BigDecimal,
        @Column(nullable = false) var active: Boolean = true
)

interface InstallmentSettingsRepository : JpaRepository<InstallmentSettings, Long>

interface InstallmentPlanRepository : JpaRepository<InstallmentPlan, Int>
