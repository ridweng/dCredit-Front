import { createContext, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { FinancialProfile, MonthlySnapshot } from '../types/financial';
import { mockFinancialProfile, mockExpenseCategories } from '../data/mockData';
import { calcFreeCashFlow, calcDebtBurdenRatio } from '../engine/financialCalculations';

interface Overrides {
  income: number;
  expenses: number;
}

interface FinancialContextValue {
  profile: FinancialProfile;
  overrides: Overrides;
  expenseCategories: Record<string, number>;
  setOverrides: (overrides: Overrides) => void;
  resetOverrides: () => void;
  currentSnapshot: MonthlySnapshot;
}

export const FinancialContext = createContext<FinancialContextValue>({
  profile: mockFinancialProfile,
  overrides: {
    income: mockFinancialProfile.user.monthlyIncome,
    expenses: mockFinancialProfile.currentSnapshot.expenses,
  },
  expenseCategories: mockExpenseCategories,
  setOverrides: () => {},
  resetOverrides: () => {},
  currentSnapshot: mockFinancialProfile.currentSnapshot,
});

const defaultOverrides: Overrides = {
  income: mockFinancialProfile.user.monthlyIncome,
  expenses: mockFinancialProfile.currentSnapshot.expenses,
};

export function FinancialProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverridesState] = useState<Overrides>(defaultOverrides);

  const setOverrides = useCallback((o: Overrides) => {
    setOverridesState(o);
  }, []);

  const resetOverrides = useCallback(() => {
    setOverridesState(defaultOverrides);
  }, []);

  const currentSnapshot = useMemo<MonthlySnapshot>(() => {
    const debtPayments = mockFinancialProfile.currentSnapshot.debtPayments;
    const freeCashFlow = calcFreeCashFlow(overrides.income, overrides.expenses, debtPayments);
    const debtBurdenRatio = calcDebtBurdenRatio(debtPayments, overrides.income);
    return {
      ...mockFinancialProfile.currentSnapshot,
      income: overrides.income,
      expenses: overrides.expenses,
      freeCashFlow,
      debtBurdenRatio,
    };
  }, [overrides]);

  const profile = useMemo<FinancialProfile>(() => ({
    ...mockFinancialProfile,
    user: {
      ...mockFinancialProfile.user,
      monthlyIncome: overrides.income,
    },
    currentSnapshot,
  }), [currentSnapshot, overrides.income]);

  return (
    <FinancialContext.Provider value={{
      profile,
      overrides,
      expenseCategories: mockExpenseCategories,
      setOverrides,
      resetOverrides,
      currentSnapshot,
    }}>
      {children}
    </FinancialContext.Provider>
  );
}
