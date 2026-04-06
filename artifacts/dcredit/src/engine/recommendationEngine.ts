// Recommendation engine — no React/DOM dependencies.
// Reusable in React Native without modification.

import type {
  DebtProduct,
  FinancialProfile,
  MonthlySnapshot,
  RecommendationOutput,
  RiskStatus,
  SimulatorInput,
  SimulatorResult,
  TrendDirection,
} from '../types/financial';
import {
  calcDebtBurdenRatio,
  calcFreeCashFlow,
  calcNewMonthlyPayment,
} from './financialCalculations';

const SAFE_THRESHOLD_PCT = 0.15;
const CAUTION_THRESHOLD_PCT = 0.05;

/**
 * Determine trend by comparing the last 2 months of monthly history.
 */
export function detectTrend(history: MonthlySnapshot[]): TrendDirection {
  if (history.length < 2) return 'stable';
  const recent = history[history.length - 1];
  const prev = history[history.length - 2];
  const delta = recent.freeCashFlow - prev.freeCashFlow;
  const threshold = prev.income * 0.02; // 2% of income = meaningful change
  if (delta > threshold) return 'improving';
  if (delta < -threshold) return 'tightening';
  return 'stable';
}

/**
 * Assess risk of a new loan payment given current free cash flow.
 * Returns risk status and explanation key.
 */
export function assessRisk(
  freeCashFlow: number,
  newPayment: number,
  income: number,
): { status: RiskStatus } {
  const remainingFcf = freeCashFlow - newPayment;
  const remainingRatio = income > 0 ? remainingFcf / income : 0;

  if (remainingRatio >= SAFE_THRESHOLD_PCT) return { status: 'safe' };
  if (remainingRatio >= CAUTION_THRESHOLD_PCT) return { status: 'caution' };
  return { status: 'risky' };
}

/**
 * Prioritize debts: sort by a score that rewards high APR and manageable balance.
 * Score = APR * (balance / totalBalance) — high APR and proportionally large balance = highest priority.
 */
export function prioritizeDebts(debts: DebtProduct[]): DebtProduct[] {
  const totalBalance = debts.reduce((sum, d) => sum + d.balance, 0);
  if (totalBalance === 0) return [...debts];

  return [...debts].sort((a, b) => {
    const scoreA = a.apr * (a.balance / totalBalance);
    const scoreB = b.apr * (b.balance / totalBalance);
    return scoreB - scoreA;
  });
}

/**
 * Generate a full recommendation output from the financial profile.
 */
export function generateRecommendations(profile: FinancialProfile): RecommendationOutput {
  const { currentSnapshot, debts, monthlyHistory } = profile;
  const trend = detectTrend(monthlyHistory);
  const prioritized = prioritizeDebts(debts);
  const priorityDebt = prioritized[0] ?? null;

  const alerts: string[] = [];
  if (currentSnapshot.debtBurdenRatio > 0.4) {
    alerts.push('Your debt burden exceeds 40% of income. This limits your borrowing options.');
  }
  if (currentSnapshot.freeCashFlow < currentSnapshot.income * 0.1) {
    alerts.push('Your free cash flow is below 10% of income. Build an emergency buffer before taking on new debt.');
  }
  if (trend === 'tightening') {
    alerts.push('Your cash flow is tightening. Monthly obligations are growing relative to income.');
  }

  const actionChecklist: string[] = [];
  if (priorityDebt) {
    actionChecklist.push(`Put any extra monthly savings toward your ${priorityDebt.name} first.`);
  }
  actionChecklist.push('Avoid new credit card debt until your highest-APR balance is cleared.');
  if (currentSnapshot.debtBurdenRatio > 0.35) {
    actionChecklist.push('Aim to reduce total debt burden below 35% of monthly income.');
  }
  actionChecklist.push('Review your recurring subscriptions — even $50/mo freed up helps.');
  if (trend !== 'improving') {
    actionChecklist.push('Set up automatic transfers on payday to lock in debt payments before spending.');
  }

  const whyPriority = priorityDebt
    ? `This debt has a ${priorityDebt.apr}% APR, which means it costs more per dollar carried than your other debts. Eliminating it first saves the most money over time.`
    : 'All debts are at similar cost. Focus on the smallest balance for a quick win.';

  return { priorityDebt, whyPriority, trend, alerts, actionChecklist };
}

/**
 * Simulate a new loan and return the impact on financial health.
 */
export function simulateLoan(
  profile: FinancialProfile,
  input: SimulatorInput,
): SimulatorResult {
  const { currentSnapshot } = profile;
  const newPayment = calcNewMonthlyPayment(input.loanAmount, input.interestRate / 100, input.termMonths);
  const newDebtPayments = currentSnapshot.debtPayments + newPayment;
  const newFreeCashFlow = calcFreeCashFlow(
    currentSnapshot.income,
    currentSnapshot.expenses,
    newDebtPayments,
  );
  const newDebtBurdenRatio = calcDebtBurdenRatio(newDebtPayments, currentSnapshot.income);
  const { status: riskStatus } = assessRisk(currentSnapshot.freeCashFlow, newPayment, currentSnapshot.income);

  return {
    newMonthlyPayment: newPayment,
    newFreeCashFlow,
    newDebtBurdenRatio,
    riskStatus,
    explanation: riskStatus,
  };
}
