// Shared recommendation engine — no UI dependencies.
// Used by apps/web, apps/mobile, and apps/api for consistent results.

import type {
  DebtProduct,
  FinancialProfile,
  MonthlySnapshot,
  RecommendationOutput,
  RiskStatus,
  SimulatorInput,
  SimulatorResult,
  TrendDirection,
} from '@dcredit/types';
import { calcDebtBurdenRatio, calcFreeCashFlow, calcNewMonthlyPayment } from './financialCalculations';

const SAFE_THRESHOLD_PCT = 0.15;
const CAUTION_THRESHOLD_PCT = 0.05;

export function detectTrend(history: MonthlySnapshot[]): TrendDirection {
  if (history.length < 2) return 'stable';
  const recent = history[history.length - 1];
  const prev = history[history.length - 2];
  const delta = recent.freeCashFlow - prev.freeCashFlow;
  const threshold = prev.income * 0.02;
  if (delta > threshold) return 'improving';
  if (delta < -threshold) return 'tightening';
  return 'stable';
}

export function assessRisk(
  freeCashFlow: number,
  newPayment: number,
  income: number,
): { status: RiskStatus } {
  const remaining = freeCashFlow - newPayment;
  const ratio = income > 0 ? remaining / income : 0;
  if (ratio >= SAFE_THRESHOLD_PCT) return { status: 'safe' };
  if (ratio >= CAUTION_THRESHOLD_PCT) return { status: 'caution' };
  return { status: 'risky' };
}

export function prioritizeDebts(debts: DebtProduct[]): DebtProduct[] {
  const total = debts.reduce((s, d) => s + d.balance, 0);
  if (total === 0) return [...debts];
  return [...debts].sort((a, b) => {
    const scoreA = a.apr * (a.balance / total);
    const scoreB = b.apr * (b.balance / total);
    return scoreB - scoreA;
  });
}

export function generateRecommendations(profile: FinancialProfile): RecommendationOutput {
  const { currentSnapshot, debts, monthlyHistory } = profile;
  const trend = detectTrend(monthlyHistory);
  const prioritized = prioritizeDebts(debts);
  const priorityDebt = prioritized[0] ?? null;

  const alerts: string[] = [];
  if (currentSnapshot.debtBurdenRatio > 0.4)
    alerts.push('Your debt burden exceeds 40% of income. This limits borrowing options.');
  if (currentSnapshot.freeCashFlow < currentSnapshot.income * 0.1)
    alerts.push('Free cash flow is below 10% of income. Build a buffer before new debt.');
  if (trend === 'tightening')
    alerts.push('Your cash flow is tightening month over month.');

  const checklist: string[] = [];
  if (priorityDebt)
    checklist.push(`Put any extra savings toward your ${priorityDebt.name} first.`);
  checklist.push('Avoid new credit card debt until your highest-APR balance is cleared.');
  if (currentSnapshot.debtBurdenRatio > 0.35)
    checklist.push('Aim to reduce total debt burden below 35% of monthly income.');
  checklist.push('Review recurring subscriptions — small savings compound.');
  if (trend !== 'improving')
    checklist.push('Set up automatic transfers on payday to lock in debt payments first.');

  return {
    priorityDebt,
    whyPriority: priorityDebt
      ? `This debt has a ${priorityDebt.apr}% APR — the highest cost per dollar carried. Eliminating it first saves the most money over time.`
      : 'All debts are at similar cost. Focus on the smallest balance for a quick win.',
    trend,
    alerts,
    actionChecklist: checklist,
  };
}

export function simulateLoan(profile: FinancialProfile, input: SimulatorInput): SimulatorResult {
  const { currentSnapshot } = profile;
  const newPayment = calcNewMonthlyPayment(input.loanAmount, input.interestRate / 100, input.termMonths);
  const newDebtPayments = currentSnapshot.debtPayments + newPayment;
  const newFreeCashFlow = calcFreeCashFlow(currentSnapshot.income, currentSnapshot.expenses, newDebtPayments);
  const newDebtBurdenRatio = calcDebtBurdenRatio(newDebtPayments, currentSnapshot.income);
  const { status: riskStatus } = assessRisk(currentSnapshot.freeCashFlow, newPayment, currentSnapshot.income);
  return { newMonthlyPayment: newPayment, newFreeCashFlow, newDebtBurdenRatio, riskStatus, explanation: riskStatus };
}
