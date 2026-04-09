// @dcredit/types — shared TypeScript types across API, web, and mobile
// These types are the single source of truth for the dCredit domain model.
// No dependencies — pure TypeScript interfaces and enums only.

// ──────────────────────────────────────────
// Enums
// ──────────────────────────────────────────

export type DebtType = 'credit_card' | 'personal_loan' | 'auto_loan' | 'student_loan' | 'mortgage' | 'other';
export type PriorityLevel = 'high' | 'medium' | 'low';
export type RiskStatus = 'safe' | 'caution' | 'risky';
export type TrendDirection = 'improving' | 'stable' | 'tightening';
export type ConfidenceLevel = 'high' | 'medium' | 'needs_review';

// ──────────────────────────────────────────
// User & Auth
// ──────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  userId: string;
  name: string;
  monthlyIncome: number;
  incomeSource: string;
  currency: string; // ISO 4217, e.g. 'USD'
  locale: string;   // e.g. 'en-US', 'es-MX'
}

// ──────────────────────────────────────────
// Financial Core
// ──────────────────────────────────────────

export interface DebtProduct {
  id: string;
  userId: string;
  name: string;
  type: DebtType;
  balance: number;
  originalBalance: number;
  monthlyPayment: number;
  apr: number;
  priority: PriorityLevel;
  priorityExplanation: string;
  institutionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Institution {
  id: string;
  name: string;
  logo?: string;
  connected: boolean;
  lastSync?: Date;
}

export interface MonthlySnapshot {
  id?: string;
  userId?: string;
  month: string; // 'YYYY-MM'
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

// ──────────────────────────────────────────
// Simulator
// ──────────────────────────────────────────

export interface SimulatorInput {
  loanAmount: number;
  interestRate: number; // annual %, e.g. 8.5
  termMonths: number;
}

export interface SimulatorResult {
  newMonthlyPayment: number;
  newFreeCashFlow: number;
  newDebtBurdenRatio: number;
  riskStatus: RiskStatus;
  explanation: string;
}

// ──────────────────────────────────────────
// Recommendations
// ──────────────────────────────────────────

export interface RecommendationOutput {
  priorityDebt: DebtProduct | null;
  whyPriority: string;
  trend: TrendDirection;
  alerts: string[];
  actionChecklist: string[];
}

// ──────────────────────────────────────────
// API contracts (request/response shapes)
// ──────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
  };
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

export interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
}

export * from './app-api';
