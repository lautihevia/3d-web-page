# Planes de cuotas en impresoras — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mostrar débito y crédito en cuotas (con gross-up de comisión) en el detalle de impresoras, editable desde el admin.

**Architecture:** Backend Kotlin guarda la config (1 fila de settings + 6 planes) y la expone por GET público / PUT admin. El frontend calcula montos con una función pura en `lib/installments.ts` y los muestra en un desplegable client-side.

**Tech Stack:** Spring Boot 4 / Kotlin / JPA, Next.js 16 / React 19, `node --test` (Node 25 strip-types) para el test de la función pura.

**Spec:** `specs/features/015_printer_installments.md`

## Global Constraints
- Solo productos con `category === "Impresoras"`.
- Cuotas fijas: 1, 2, 3, 6, 9, 12. Seed: fijo 4.28; variables 0, 7.79, 10.5, 18.7, 26.5, 32.3; débito 3.06; todo activo.
- `total = precio / (1 - tasa/100)`; `cuota = ceil a la centena (total / n)`; total mostrado = `cuota × n`.
- Precio base: `salePrice` si `onSale`, si no `variants[0].price`.
- Tooltip: "Precio en efectivo o transferencia". Enlace: "Ver planes de cuotas".
- Código en inglés, UI en español.

## Review Focus
- Tasa ≥ 100% o negativa enviada al PUT → 400 con mensaje, no guarda (test en Task 1).
- Error de flotante en ceil100 (ej. 391200.0000001 → 391300) → se tolera epsilon (test en Task 2).
- Backend de cuotas caído → la página de impresora renderiza igual, sin sección (Task 3: fetch con try/catch → null).
- Todos los planes desactivados → no aparece el enlace (test en Task 2: `computeOptions` devuelve vacío).
- Tooltip en mobile (sin hover) → abre con tap (verificación manual Task 3).

---

### Task 1: Backend — config de cuotas

**Files:**
- Create: `backend/src/main/kotlin/com/tresdencasa/backend/installments/{InstallmentSettings,InstallmentPlan,InstallmentRepositories,InstallmentsDto,InstallmentsValidator,InstallmentsService,InstallmentsSeeder,InstallmentsController}.kt`
- Modify: `backend/src/main/kotlin/com/tresdencasa/backend/config/SecurityConfig.kt` (permitAll `/api/v1/installments`)
- Test: `backend/src/test/kotlin/com/tresdencasa/backend/installments/InstallmentsValidatorTest.kt`

**Interfaces — Produces:**
- `GET /api/v1/installments` → `InstallmentsDto(creditFixedRate: BigDecimal, debitRate: BigDecimal, debitActive: Boolean, plans: List<InstallmentPlanDto(installments: Int, variableRate: BigDecimal, active: Boolean)>)`, planes ordenados.
- `PUT /api/v1/admin/installments` body `InstallmentsDto` → 200 `InstallmentsDto` | 400 `{ errors: List<String> }`.
- `InstallmentsValidator.validate(dto): List<String>` (vacía = válido).

- [ ] Test: válido con seed; negativo → error; `fijo + variable >= 100` → error; `debitRate >= 100` → error; set de cuotas ≠ {1,2,3,6,9,12} → error.
- [ ] Run `./gradlew test --tests '*InstallmentsValidatorTest'` → FAIL.
- [ ] Implementar entidades (`installment_settings` id=1, `installment_plans` PK installments), repos, validator, service (get/update transaccional), seeder idempotente (`CommandLineRunner`, solo si vacío), controllers, security.
- [ ] Run tests → PASS; `./gradlew build` → OK.
- [ ] Commit `feat(cuotas): configuración de cuotas en el backend`.

### Task 2: Frontend — cálculo puro

**Files:** Create `frontend/lib/installments.ts`, `frontend/lib/installments.test.ts`

**Interfaces — Produces:**
- types `InstallmentSettings` (espejo del DTO, números).
- `ceil100(n: number): number`
- `grossUp(price: number, ratePct: number): number`
- `computeOptions(price: number, s: InstallmentSettings): { debit: { total: number } | null; credit: { installments: number; amount: number; total: number }[] }` — solo activos.
- `fetchInstallments(apiUrl: string): Promise<InstallmentSettings | null>`

- [ ] Test con precio 999990 y seed: débito 1031600; crédito `[1,1044800,1044800],[2,568700,1137400],[3,391200,1173600],[6,216400,1298400],[9,160600,1445400],[12,131400,1576800]`; `ceil100(391200.0000001) === 391200`; todo inactivo → `debit null`, `credit []`.
- [ ] Run `node --test lib/installments.test.ts` → FAIL; implementar; → PASS.
- [ ] Commit `feat(cuotas): cálculo de cuotas en el frontend`.

### Task 3: Frontend — detalle de impresora

**Files:** Create `frontend/components/products/InstallmentPlans.tsx`, `frontend/components/products/PriceInfoTooltip.tsx`; Modify `frontend/app/products/[id]/page.tsx`

- [ ] `PriceInfoTooltip` (client): ícono `Info` junto a la etiqueta de precio, abre con hover y con click/tap, cierra al tocar afuera.
- [ ] `InstallmentPlans({ price, settings })` (client): enlace "› Ver planes de cuotas" con chevron que rota, despliega grupos DÉBITO / CRÉDITO; en mobile el total pasa abajo.
- [ ] page.tsx: tooltip en la etiqueta de precio (todas las categorías); si `category === "Impresoras"` y hay opciones, render de `InstallmentPlans` debajo de "Consultá disponibilidad…". Fetch de settings en paralelo con el producto.
- [ ] `npm run lint` y `npm run build` → OK. Commit `feat(cuotas): planes de cuotas en el detalle de impresoras`.

### Task 4: Frontend — admin de cuotas

**Files:** Create `frontend/app/admin/installments/page.tsx`; Modify `frontend/app/admin/layout.tsx` (ítem "Cuotas", ícono `CreditCard`)

- [ ] Form: débito (switch + %), crédito (% fijo; por plan switch + % variable), preview por fila sobre $1.000.000 usando `computeOptions`/`grossUp`, Guardar → PUT con `adminFetch`, muestra errores del 400 y confirmación.
- [ ] `npm run lint` y `npm run build` → OK. Commit `feat(cuotas): sección de cuotas en el admin`.

### Task 5: Verificación local
- [ ] Levantar Postgres (docker compose), backend y frontend; mockear una impresora; verificar desktop + mobile y edición desde el admin.
