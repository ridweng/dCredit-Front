export interface UserProfile {
  name: string;
  monthlyIncome: number;
  incomeSource: string;
  linkedInstitutions: string[];
}

export type DebtType = 'credit_card' | 'personal_loan' | 'auto_loan';
export type PriorityLevel = 'high' | 'medium' | 'low';
export type RiskStatus = 'safe' | 'caution' | 'risky';
export type TrendDirection = 'improving' | 'stable' | 'tightening';
export type ConfidenceLevel = 'high' | 'medium' | 'needs_review';

export interface DebtProduct {
  id: string;
  name: string;
  type: DebtType;
  balance: number;
  monthlyPayment: number;
  apr: number;
  priority: PriorityLevel;
  priorityExplanation: string;
}

export interface Institution {
  id: string;
  name: string;
  logo: string;
  connected: boolean;
  lastSync: string;
}

export interface MonthlySnapshot {
  month: string;
  income: number;
  expenses: number;
  debtPayments: number;
  freeCashFlow: number;
  debtBurdenRatio: number;
}

export interface FinancialProfile {
  user: UserProfile;
  debts: DebtProduct[];
  institutions: Institution[];
  monthlyHistory: MonthlySnapshot[];
  currentSnapshot: MonthlySnapshot;
}

export interface SimulatorInput {
  loanAmount: number;
  interestRate: number;
  termMonths: number;
}

export interface SimulatorResult {
  newMonthlyPayment: number;
  newFreeCashFlow: number;
  newDebtBurdenRatio: number;
  riskStatus: RiskStatus;
  explanation: string;
}

export interface RecommendationOutput {
  priorityDebt: DebtProduct | null;
  whyPriority: string;
  trend: TrendDirection;
  alerts: string[];
  actionChecklist: string[];
}
