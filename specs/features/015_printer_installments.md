# Feature 015: Planes de cuotas en impresoras

## Objetivo
En el detalle de producto de las **impresoras** (categoría `Impresoras`, cualquier
marca) mostrar cuánto sale pagar con tarjeta de **débito** o de **crédito** en
cuotas. El precio publicado es el de efectivo/transferencia; los pagos con tarjeta
suman la comisión del procesador de pagos para que a la tienda le quede limpio el
precio publicado.

El admin puede editar los porcentajes y activar/desactivar cada plan sin deploy.

**No-objetivos:** cuotas en filamentos/electrónica/repuestos, cuotas en la grilla
o tarjetas del listado, checkout real con tarjeta, descuento extra por
transferencia, cantidades de cuotas distintas de 1/2/3/6/9/12.

## Cálculo (gross-up)
```
tasa      = fijo + variable(n)               # crédito, ej x3: 4,28% + 10,5% = 14,78%
          = débito                           # débito: 3,06%
total     = precio / (1 - tasa)              # 999.990 / 0,8522 = 1.173.421,7
cuota     = ceil100(total / n)               # 391.140,6 → 391.200
total     = cuota × n                        # 1.173.600 (lo que se muestra)
```
* `precio` = `salePrice` si el producto está en oferta, si no el precio de la variante.
* `ceil100`: redondeo **hacia arriba a la centena** (391.141 → 391.200). Se redondea
  la cuota y el total mostrado es `cuota × n`, para que cierre la cuenta.
* Validación: cada % ≥ 0 y la tasa total < 100% (si no, la fórmula divide por ≤ 0).

### Valores iniciales (seed) y ejemplo con $999.990
| Plan | Fijo | Variable | Tasa | Cuota | Total |
|---|---|---|---|---|---|
| Débito | — | — | 3,06% | — | $1.031.600 |
| Crédito x1  | 4,28% | 0%    | 4,28%  | $1.044.800 | $1.044.800 |
| Crédito x2  | 4,28% | 7,79% | 12,07% | $568.700 | $1.137.400 |
| Crédito x3  | 4,28% | 10,5% | 14,78% | $391.200 | $1.173.600 |
| Crédito x6  | 4,28% | 18,7% | 22,98% | $216.400 | $1.298.400 |
| Crédito x9  | 4,28% | 26,5% | 30,78% | $160.600 | $1.445.400 |
| Crédito x12 | 4,28% | 32,3% | 36,58% | $131.400 | $1.576.800 |

## Enfoques considerados
1. **Configuración de cuotas propia (elegido).** Tablas tipadas con % fijo, % débito
   y planes de crédito. Simple y validable.
2. Tabla genérica clave/valor de "ajustes del sitio": más flexible pero sin tipos
   ni validación. Se puede migrar a esto si aparecen más ajustes globales.
3. Hardcodear en el código: descartado, el admin tiene que poder editarlo.

## Backend
* Entidades (Hibernate crea las tablas con `ddl-auto=update`):
  * `InstallmentSettings` — fila única: `creditFixedRate` (ej `4.28`),
    `debitRate` (ej `3.06`), `debitActive: Boolean`. Los % son `BigDecimal`
    expresados en puntos porcentuales.
  * `InstallmentPlan` — `installments: Int` (PK: 1,2,3,6,9,12),
    `variableRate: BigDecimal`, `active: Boolean`.
* Seeder: si no hay datos, inserta los valores de la tabla de arriba.
* `GET /api/v1/installments` (público, agregar a `permitAll`) →
  `{ creditFixedRate, debitRate, debitActive, plans: [{ installments, variableRate, active }] }`
  con planes ordenados por cuotas.
* `PUT /api/v1/admin/installments` (ADMIN) — mismo body; valida y guarda. Las
  cantidades de cuotas son fijas (no se agregan ni borran planes), solo se editan
  % y `active`.
* Test unitario de la validación.

## Frontend — detalle de impresora (`app/products/[id]/page.tsx`)
* Junto a "Precio de referencia"/"Precio de oferta": ícono ⓘ con tooltip
  **"Precio en efectivo o transferencia"**. Abre con hover en desktop y con tap en
  mobile (no solo hover).
* Solo si `category === "Impresoras"` y hay al menos un plan activo (débito o
  crédito): enlace **"› Ver planes de cuotas"** que **despliega inline**
  (acordeón, chevron rota) debajo del precio:

```
 Precio de referencia ⓘ
 $999.990
 Consultá disponibilidad y formas de pago.
 › Ver planes de cuotas
 ┌──────────────────────────────────────────┐
 │ DÉBITO                                   │
 │ 1 pago de $1.031.600                     │
 │ CRÉDITO                                  │
 │ 1 cuota de $1.044.800                    │
 │ 2 cuotas de $568.700   Total $1.137.400  │
 │ 3 cuotas de $391.200   Total $1.173.600  │
 │ …                                        │
 └──────────────────────────────────────────┘
 [ Consultar por email ] [ Por WhatsApp ]
```
* Un grupo sin planes activos no se muestra. En mobile el total pasa debajo del
  monto de la cuota.
* La función de cálculo vive en `lib/installments.ts` (pura).
* Si el fetch de cuotas falla, la sección no se muestra (la página sigue andando).

## Frontend — admin
* Nuevo ítem **"Cuotas"** en el menú lateral → `/admin/installments`.
* Formulario:
  * **Débito:** switch activo/inactivo + campo **%** (3,06).
  * **Crédito:** campo **% fijo** (4,28); por cada plan (1, 2, 3, 6, 9, 12) un
    switch activo/inactivo y un campo **% variable**.
  * Vista previa por fila de la tasa total y de la cuota sobre un precio de
    ejemplo ($1.000.000), con el mismo cálculo y redondeo que la tienda.
* Botón Guardar → `PUT`; errores de validación se muestran en el campo.
* Responsive: en mobile cada plan es una fila apilada.

## Queda a criterio del implementador
Estilos exactos (siguiendo la estética inline actual de la página), copy de
mensajes de error, estructura interna de componentes.
