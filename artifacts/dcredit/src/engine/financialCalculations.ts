// Pure financial calculation utilities — no React/DOM dependencies.
// This module can be reused in React Native without modification.

/**
 * Calculate monthly free cash flow.
 */
export function calcFreeCashFlow(
  income: number,
  essentialExpenses: number,
  debtPayments: number,
): number {
  return income - essentialExpenses - debtPayments;
}

/**
 * Debt burden ratio = total monthly debt payments / monthly income.
 * Returns a value between 0 and 1 (e.g., 0.35 = 35%).
 */
export function calcDebtBurdenRatio(
  debtPayments: number,
  income: number,
): number {
  if (income <= 0) return 1;
  return debtPayments / income;
}

/**
 * Safe borrowing capacity expressed as a monthly payment amount.
 * Rule: Safe additional monthly payment = max(0, freeCashFlow - (income * safetyThreshold))
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
 * Approximate maximum additional loan principal based on safe monthly payment.
 * Uses simplified present value of annuity formula.
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
  // PV of annuity
  return safePayment * ((1 - Math.pow(1 + monthlyRate, -termMonths)) / monthlyRate);
}

/**
 * Standard amortization formula for monthly payment.
 * @param principal Loan amount
 * @param annualRate Annual interest rate as decimal (e.g., 0.12 for 12%)
 * @param termMonths Loan term in months
 */
export function calcNewMonthlyPayment(
  principal: number,
  annualRate: number,
  termMonths: number,
): number {
  if (principal <= 0 || termMonths <= 0) return 0;
  if (annualRate === 0) return principal / termMonths;
  const monthlyRate = annualRate / 12;
  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);
  return Math.round(payment * 100) / 100;
}

/**
 * Format a number as currency (USD).
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a ratio as a percentage string (e.g., 0.35 → "35%").
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}
