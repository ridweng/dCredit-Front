// Mock financial data for the dCredit MVP demo.
// Replace this module with real API calls when integrating with bank connections.

import type { FinancialProfile, MonthlySnapshot } from '../types/financial';

const MONTHLY_INCOME = 5200;
const RENT = 1400;
const UTILITIES = 120;
const GROCERIES = 350;
const TRANSPORT = 90;
const INSURANCE = 95;
const SUBSCRIPTIONS = 45;
const ESSENTIAL_EXPENSES = RENT + UTILITIES + GROCERIES + TRANSPORT + INSURANCE + SUBSCRIPTIONS; // 2100

const CREDIT_CARD_PAYMENT = 180;
const PERSONAL_LOAN_PAYMENT = 340;
const AUTO_LOAN_PAYMENT = 380;
const TOTAL_DEBT_PAYMENTS = CREDIT_CARD_PAYMENT + PERSONAL_LOAN_PAYMENT + AUTO_LOAN_PAYMENT; // 900

const FREE_CASH_FLOW = MONTHLY_INCOME - ESSENTIAL_EXPENSES - TOTAL_DEBT_PAYMENTS; // 2200

function buildSnapshot(income: number, expenseVariance: number, debtVariance: number): MonthlySnapshot {
  const expenses = ESSENTIAL_EXPENSES + expenseVariance;
  const debtPayments = TOTAL_DEBT_PAYMENTS + debtVariance;
  const freeCashFlow = income - expenses - debtPayments;
  return {
    month: '',
    income,
    expenses,
    debtPayments,
    freeCashFlow,
    debtBurdenRatio: debtPayments / income,
  };
}

const months = ['Oct 2024', 'Nov 2024', 'Dec 2024', 'Jan 2025', 'Feb 2025', 'Mar 2025'];

const monthlyHistory: MonthlySnapshot[] = [
  { ...buildSnapshot(5200, 40, 0), month: months[0] },
  { ...buildSnapshot(5200, 60, 20), month: months[1] },
  { ...buildSnapshot(5200, 80, 20), month: months[2] },
  { ...buildSnapshot(5200, 100, 20), month: months[3] },
  { ...buildSnapshot(5200, 120, 20), month: months[4] },
  { ...buildSnapshot(5200, 140, 20), month: months[5] },
];

export const mockFinancialProfile: FinancialProfile = {
  user: {
    name: 'Alex Rivera',
    monthlyIncome: MONTHLY_INCOME,
    incomeSource: 'Software Engineer — TechCorp Inc.',
    linkedInstitutions: ['chase', 'capital-one', 'toyota-financial'],
  },
  institutions: [
    {
      id: 'chase',
      name: 'Chase Bank',
      logo: 'C',
      connected: true,
      lastSync: 'Apr 5, 2025',
    },
    {
      id: 'capital-one',
      name: 'Capital One',
      logo: 'CO',
      connected: true,
      lastSync: 'Apr 5, 2025',
    },
    {
      id: 'toyota-financial',
      name: 'Toyota Financial',
      logo: 'TF',
      connected: true,
      lastSync: 'Apr 4, 2025',
    },
  ],
  debts: [
    {
      id: 'chase-sapphire',
      name: 'Chase Sapphire Card',
      type: 'credit_card',
      balance: 4200,
      monthlyPayment: 180,
      apr: 22.99,
      priority: 'high',
      priorityExplanation:
        'This debt has the highest interest rate, making it the most expensive to carry. Every extra dollar paid here saves the most over time.',
    },
    {
      id: 'sofi-personal',
      name: 'SoFi Personal Loan',
      type: 'personal_loan',
      balance: 12000,
      monthlyPayment: 340,
      apr: 11.5,
      priority: 'medium',
      priorityExplanation:
        'The interest rate is moderate and the balance is significant, but it costs less per dollar than your credit card. Worth targeting after the card.',
    },
    {
      id: 'toyota-auto',
      name: 'Toyota Auto Loan',
      type: 'auto_loan',
      balance: 18500,
      monthlyPayment: 380,
      apr: 6.9,
      priority: 'low',
      priorityExplanation:
        'Low interest rate relative to your other debts. Paying the minimum here is the right strategy while focusing on higher-cost debt.',
    },
  ],
  monthlyHistory,
  currentSnapshot: {
    month: 'Apr 2025',
    income: MONTHLY_INCOME,
    expenses: ESSENTIAL_EXPENSES,
    debtPayments: TOTAL_DEBT_PAYMENTS,
    freeCashFlow: FREE_CASH_FLOW,
    debtBurdenRatio: TOTAL_DEBT_PAYMENTS / MONTHLY_INCOME,
  },
};

export const mockExpenseCategories: Record<string, number> = {
  rent: RENT,
  utilities: UTILITIES,
  groceries: GROCERIES,
  transport: TRANSPORT,
  insurance: INSURANCE,
  subscriptions: SUBSCRIPTIONS,
};
