// Debt health score calculation — no React/DOM dependencies.
// Reusable in React Native without modification.

import type { MonthlySnapshot, TrendDirection } from '../types/financial';

export type HealthLabel = 'excellent' | 'good' | 'fair' | 'needs_attention';

export interface HealthScore {
  score: number;
  label: HealthLabel;
}

/**
 * Calculate a 0–100 debt health score based on:
 * - Debt burden ratio (40% weight): lower is better (0% = 100 pts, 50%+ = 0 pts)
 * - Free cash flow ratio (35% weight): FCF / income, higher is better
 * - Trend (25% weight): improving = 100, stable = 60, tightening = 10
 */
export function calcDebtHealthScore(
  snapshot: MonthlySnapshot,
  trend: TrendDirection,
): HealthScore {
  // Component 1: Debt burden ratio score (40 pts max)
  // 0% burden → 40, 40%+ burden → 0
  const burdenPct = snapshot.debtBurdenRatio;
  const burdenScore = Math.max(0, 40 - (burdenPct / 0.4) * 40);

  // Component 2: FCF ratio score (35 pts max)
  // FCF / income: >25% → 35, 0% → 0
  const fcfRatio = snapshot.income > 0 ? snapshot.freeCashFlow / snapshot.income : 0;
  const fcfScore = Math.min(35, Math.max(0, (fcfRatio / 0.25) * 35));

  // Component 3: Trend score (25 pts max)
  const trendScore =
    trend === 'improving' ? 25 : trend === 'stable' ? 15 : 5;

  const total = Math.round(burdenScore + fcfScore + trendScore);
  const score = Math.min(100, Math.max(0, total));

  let label: HealthLabel;
  if (score >= 75) label = 'excellent';
  else if (score >= 55) label = 'good';
  else if (score >= 35) label = 'fair';
  else label = 'needs_attention';

  return { score, label };
}
