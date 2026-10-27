/** Illustrative preview rates, deliberately separate from the existing tax engine. */
export const REFERENCE_TAX = {
  companyRate: 0.25,
  slabs: [
    [500000, 0.01],
    [200000, 0.1],
    [300000, 0.2],
    [1000000, 0.3],
    [3000000, 0.36],
    [Infinity, 0.39],
  ],
} as const;
export const formatReferenceNumber = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
export function parseReferenceNumber(value: string) {
  const clean = String(value).replace(/[,\s]/g, "");
  return clean !== "" && /^\d+(\.\d+)?$/.test(clean) ? parseFloat(clean) : NaN;
}
export type EstimateInput = {
  turnover: number;
  profit: number;
  structure: "company" | "sole";
  period: 1 | 4 | 12;
  adjustment: number;
};
export function estimateReferenceTax(input: EstimateInput) {
  if (!Number.isFinite(input.turnover) || input.turnover < 0)
    throw new Error("Enter your annual turnover as a number.");
  if (!Number.isFinite(input.profit) || input.profit < 0)
    throw new Error("Enter your taxable profit as a number (0 if none).");
  if (input.profit > input.turnover)
    throw new Error("Profit cannot be higher than turnover.");
  const turnover = Math.round(input.turnover * (1 + input.adjustment / 100));
  const profit = Math.round(input.profit * (1 + input.adjustment / 100));
  const fmt = formatReferenceNumber;
  const rows: [string, string][] = [
    ["Turnover", "NPR " + fmt(turnover)],
    ["Taxable profit", "NPR " + fmt(profit)],
  ];
  let annualTax = 0;
  if (input.structure === "company") {
    annualTax = profit * REFERENCE_TAX.companyRate;
    rows.push(["General company rate", "25%"]);
  } else {
    let left = profit;
    REFERENCE_TAX.slabs.forEach(([limit, rate], index) => {
      if (left <= 0) return;
      const part = Math.min(left, limit),
        amount = part * rate;
      rows.push([
        (index === 0 ? "First" : "Next") +
          " NPR " +
          fmt(part) +
          " @ " +
          rate * 100 +
          "%",
        "NPR " + fmt(amount),
      ]);
      annualTax += amount;
      left -= part;
    });
  }
  if (input.adjustment)
    rows.splice(2, 0, [
      "Change applied",
      (input.adjustment > 0 ? "+" : "−") + Math.abs(input.adjustment) + "%",
    ]);
  if (input.period > 1) rows.push(["Annual tax", "NPR " + fmt(annualTax)]);
  return {
    total: Math.round(annualTax / input.period),
    rows,
    formula:
      "NPR " +
      fmt(profit) +
      (input.structure === "company" ? " × 25%" : " · slab rates") +
      (input.period > 1 ? " ÷ " + input.period : ""),
    label:
      "Estimated income tax" +
      (input.period === 4
        ? " · per quarter"
        : input.period === 12
          ? " · per month"
          : ""),
  };
}
