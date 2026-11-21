// Correr con: node --test lib/installments.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { ceil100, computeOptions, type InstallmentSettings } from "./installments.ts";

const seed: InstallmentSettings = {
  creditFixedRate: 4.28,
  debitRate: 3.06,
  debitActive: true,
  plans: [
    { installments: 1, variableRate: 0, active: true },
    { installments: 2, variableRate: 7.79, active: true },
    { installments: 3, variableRate: 10.5, active: true },
    { installments: 6, variableRate: 18.7, active: true },
    { installments: 9, variableRate: 26.5, active: true },
    { installments: 12, variableRate: 32.3, active: true },
  ],
};

test("A1 Mini a $999.990 con los valores iniciales", () => {
  const o = computeOptions(999990, seed);
  assert.deepEqual(o.debit, { total: 1031600 });
  assert.deepEqual(
    o.credit.map((c) => [c.installments, c.amount, c.total]),
    [
      [1, 1044800, 1044800],
      [2, 568700, 1137400],
      [3, 391200, 1173600],
      [6, 216400, 1298400],
      [9, 160600, 1445400],
      [12, 131400, 1576800],
    ],
  );
});

test("ceil100 redondea a la centena hacia arriba y tolera error de flotante", () => {
  assert.equal(ceil100(391140.58), 391200);
  assert.equal(ceil100(391200), 391200);
  assert.equal(ceil100(391200.0000001), 391200);
  assert.equal(ceil100(391201), 391300);
});

test("solo muestra lo activo; todo inactivo no deja opciones", () => {
  const some = computeOptions(999990, {
    ...seed,
    debitActive: false,
    plans: seed.plans.map((p) => ({ ...p, active: p.installments === 3 })),
  });
  assert.equal(some.debit, null);
  assert.deepEqual(some.credit.map((c) => c.installments), [3]);

  const none = computeOptions(999990, {
    ...seed,
    debitActive: false,
    plans: seed.plans.map((p) => ({ ...p, active: false })),
  });
  assert.equal(none.debit, null);
  assert.deepEqual(none.credit, []);
});
