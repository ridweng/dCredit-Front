// Debt health score — shared across web, mobile, and API.

import type { MonthlySnapshot, TrendDirection } from '@dcredit/types';

export type HealthLabel = 'excellent' | 'good' | 'fair' | 'needs_attention';

export interface HealthScore {
  score: number;
  label: HealthLabel;
}

/**
 * Score 0–100:
 * - Debt burden ratio: 40 pts (lower burden = higher score)
 * - FCF ratio: 35 pts (higher FCF = higher score)
 * - Trend: 25 pts (improving = 25, stable = 15, tightening = 5)
 */
export function calcDebtHealthScore(
  snapshot: MonthlySnapshot,
  trend: TrendDirection,
): HealthScore {
  const burdenScore = Math.max(0, 40 - (snapshot.debtBurdenRatio / 0.4) * 40);
  const fcfRatio = snapshot.income > 0 ? snapshot.freeCashFlow / snapshot.income : 0;
  const fcfScore = Math.min(35, Math.max(0, (fcfRatio / 0.25) * 35));
  const trendScore = trend === 'improving' ? 25 : trend === 'stable' ? 15 : 5;

  const score = Math.min(100, Math.max(0, Math.round(burdenScore + fcfScore + trendScore)));
  const label: HealthLabel =
    score >= 75 ? 'excellent' : score >= 55 ? 'good' : score >= 35 ? 'fair' : 'needs_attention';

  return { score, label };
}
