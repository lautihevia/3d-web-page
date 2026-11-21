package com.tresdencasa.backend.installments

import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

class InvalidInstallmentsException(val errors: List<String>) : RuntimeException(errors.joinToString(" "))

@Service
class InstallmentsService(
        private val settingsRepository: InstallmentSettingsRepository,
        private val planRepository: InstallmentPlanRepository
) {

    @Transactional(readOnly = true)
    fun get(): InstallmentsDto {
        val settings =
                settingsRepository.findById(InstallmentSettings.SINGLETON_ID).orElse(null)
                        ?: return InstallmentsDefaults.dto()
        return InstallmentsDto(
                creditFixedRate = settings.creditFixedRate,
                debitRate = settings.debitRate,
                debitActive = settings.debitActive,
                plans =
                        planRepository.findAll().sortedBy { it.installments }.map {
                            InstallmentPlanDto(it.installments, it.variableRate, it.active)
                        }
        )
    }

    @Transactional
    fun update(dto: InstallmentsDto): InstallmentsDto {
        val errors = InstallmentsValidator.validate(dto)
        if (errors.isNotEmpty()) throw InvalidInstallmentsException(errors)
        save(dto)
        return get()
    }

    /** Carga los valores iniciales solo si la tabla está vacía; nunca pisa lo del admin. */
    @Transactional
    fun seedIfEmpty(): Boolean {
        if (settingsRepository.existsById(InstallmentSettings.SINGLETON_ID)) return false
        save(InstallmentsDefaults.dto())
        return true
    }

    private fun save(dto: InstallmentsDto) {
        val settings =
                settingsRepository.findById(InstallmentSettings.SINGLETON_ID).orElse(null)
                        ?: InstallmentSettings(creditFixedRate = dto.creditFixedRate, debitRate = dto.debitRate)
        settings.creditFixedRate = dto.creditFixedRate
        settings.debitRate = dto.debitRate
        settings.debitActive = dto.debitActive
        settingsRepository.save(settings)

        val existing = planRepository.findAll().associateBy { it.installments }
        planRepository.saveAll(
                dto.plans.map { p ->
                    (existing[p.installments] ?: InstallmentPlan(p.installments, p.variableRate)).apply {
                        variableRate = p.variableRate
                        active = p.active
                    }
                }
        )
    }
}

@Component
class InstallmentsSeeder(private val service: InstallmentsService) : CommandLineRunner {
    override fun run(vararg args: String) {
        if (service.seedIfEmpty()) println("💳 Cuotas: valores iniciales cargados")
    }
}
