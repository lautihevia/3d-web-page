package com.tresdencasa.backend.admin.dto

import java.math.BigDecimal

/** DTO con estadísticas del dashboard. */
data class DashboardStats(
        val totalRevenue: BigDecimal,
        val pendingOrders: Long,
        val totalOrders: Long,
        val activeProducts: Long
)
