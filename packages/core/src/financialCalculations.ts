// Pure financial calculation utilities — no UI dependencies.
// Referenced by apps/web, apps/mobile, and apps/api.

/**
 * Monthly free cash flow after expenses and debt obligations.
 */
export function calcFreeCashFlow(
  income: number,
  essentialExpenses: number,
  debtPayments: number,
): number {
  return income - essentialExpenses - debtPayments;
}

/**
 * Debt burden ratio = total monthly debt / monthly income (0–1).
 */
export function calcDebtBurdenRatio(debtPayments: number, income: number): number {
  if (income <= 0) return 1;
  return debtPayments / income;
}

/**
 * Maximum safe additional monthly payment before hitting the safety buffer.
 * Default safety threshold: keep 15% of income as free cash flow buffer.
 */
export function calcSafeAdditionalMonthlyPayment(
  freeCashFlow: number,
  income: number,
  safetyThresholdPct = 0.15,
): number {
  const safetyBuffer = income * safetyThresholdPct;
  return Math.max(0, freeCashFlow - safetyBuffer);
}

/**
 * Approximate total principal that can safely be borrowed.
 * Uses present value of annuity formula.
 */
export function calcSafeBorrowingCapacity(
  freeCashFlow: number,
  income: number,
  monthlyRate: number,
  termMonths: number,
  safetyThresholdPct = 0.15,
): number {
  const safePayment = calcSafeAdditionalMonthlyPayment(freeCashFlow, income, safetyThresholdPct);
  if (safePayment <= 0) return 0;
  if (monthlyRate === 0) return safePayment * termMonths;
  return safePayment * ((1 - Math.pow(1 + monthlyRate, -termMonths)) / monthlyRate);
}

/**
 * Standard amortization monthly payment formula.
 */
export function calcNewMonthlyPayment(
  principal: number,
  annualRate: number,
  termMonths: number,
): number {
  if (principal <= 0 || termMonths <= 0) return 0;
  if (annualRate === 0) return principal / termMonths;
  const r = annualRate / 12;
  return Math.round(((principal * r * Math.pow(1 + r, termMonths)) /
    (Math.pow(1 + r, termMonths) - 1)) * 100) / 100;
}

/** Format as USD currency. */
export function formatCurrency(value: number, locale = 'en-US', currency = 'USD'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/** Format ratio as percentage string (e.g. 0.35 → "35.0%"). */
export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}
