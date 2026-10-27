import test from "node:test";
import assert from "node:assert/strict";
import {
  estimateReferenceTax,
  parseReferenceNumber,
} from "../../lib/reference/calculator.ts";

test("reference company example and period/adjustment retain the supplied working", () => {
  const result = estimateReferenceTax({
    turnover: 4500000,
    profit: 1800000,
    structure: "company",
    period: 1,
    adjustment: 0,
  });
  assert.equal(result.total, 450000);
  assert.equal(result.formula, "NPR 18,00,000 × 25%");
  const monthly = estimateReferenceTax({
    turnover: 4500000,
    profit: 1800000,
    structure: "company",
    period: 12,
    adjustment: 20,
  });
  assert.equal(monthly.total, 45000);
  assert.deepEqual(monthly.rows[2], ["Change applied", "+20%"]);
});

test("illustrative sole proprietor slabs preserve all six supplied bands", () => {
  assert.equal(
    estimateReferenceTax({
      turnover: 6000000,
      profit: 6000000,
      structure: "sole",
      period: 1,
      adjustment: 0,
    }).total,
    1855000,
  );
  assert.equal(
    estimateReferenceTax({
      turnover: 0,
      profit: 0,
      structure: "sole",
      period: 1,
      adjustment: 0,
    }).total,
    0,
  );
});

test("invalid numbers and profit greater than turnover are rejected", () => {
  assert.equal(parseReferenceNumber("45,00,000"), 4500000);
  assert.ok(Number.isNaN(parseReferenceNumber("")));
  assert.throws(
    () =>
      estimateReferenceTax({
        turnover: 10,
        profit: 11,
        structure: "company",
        period: 1,
        adjustment: 0,
      }),
    /Profit cannot/,
  );
});
