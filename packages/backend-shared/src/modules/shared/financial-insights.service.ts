import { Injectable } from '@nestjs/common';
import { Account } from '../accounts/account.entity';
import { Credit } from '../credits/credit.entity';
import { Installment } from '../credits/installment.entity';
import { Transaction } from '../transactions/transaction.entity';
import { AccountType } from '../../common/enums/account-type.enum';
import { TransactionType } from '../../common/enums/transaction-type.enum';

type CreditWithInstallments = Credit & { installments?: Installment[] };

@Injectable()
export class FinancialInsightsService {
  private readonly liquidAccountTypes = new Set<AccountType>([
    AccountType.CHECKING,
    AccountType.SAVINGS,
    AccountType.WALLET,
  ]);

  buildLiquidBalanceSummary(accounts: Account[]) {
    const liquidAccounts = accounts.filter((account) =>
      this.liquidAccountTypes.has(account.accountType),
    );

    const sourcesMap = new Map<
      string,
      {
        financialSourceId: string;
        providerName: string;
        providerType: string;
        status: string;
        liquidBalance: number;
        accounts: Array<{
          accountId: string;
          accountName: string;
          accountType: string;
          currency: string;
          currentBalance: number;
          availableBalance: number | null;
          liquidBalance: number;
        }>;
      }
    >();

    for (const account of liquidAccounts) {
      const balance = account.availableBalance ?? account.currentBalance;
      const existingSource = sourcesMap.get(account.financialSourceId) ?? {
        financialSourceId: account.financialSourceId,
        providerName: account.financialSource.providerName,
        providerType: account.financialSource.providerType,
        status: account.financialSource.status,
        liquidBalance: 0,
        accounts: [],
      };

      existingSource.liquidBalance = this.round(existingSource.liquidBalance + balance);
      existingSource.accounts.push({
        accountId: account.id,
        accountName: account.accountName,
        accountType: account.accountType,
        currency: account.currency,
        currentBalance: account.currentBalance,
        availableBalance: account.availableBalance,
        liquidBalance: balance,
      });

      sourcesMap.set(account.financialSourceId, existingSource);
    }

    const sources = Array.from(sourcesMap.values()).sort((left, right) =>
      right.liquidBalance - left.liquidBalance,
    );

    return {
      totalLiquidBalance: this.round(
        sources.reduce((sum, source) => sum + source.liquidBalance, 0),
      ),
      sourceCount: sources.length,
      accountCount: liquidAccounts.length,
      sources,
    };
  }

  buildWeeklySpendingSummary(transactions: Transaction[]) {
    const spendingTransactions = this.getSpendingTransactions(transactions);
    const referenceDate =
      spendingTransactions.length > 0
        ? new Date(
            Math.max(...spendingTransactions.map((transaction) => transaction.date.getTime())),
          )
        : new Date();
    const currentWeekStart = this.startOfWeek(referenceDate);
    const currentWeekEnd = this.endOfWeek(referenceDate);
    const previousWeekStart = this.addDays(currentWeekStart, -7);
    const previousWeekEnd = this.addDays(currentWeekEnd, -7);

    const currentWeekTransactions = spendingTransactions.filter(
      (transaction) =>
        transaction.date >= currentWeekStart && transaction.date <= currentWeekEnd,
    );
    const previousWeekTransactions = spendingTransactions.filter(
      (transaction) =>
        transaction.date >= previousWeekStart && transaction.date <= previousWeekEnd,
    );

    const currentWeekTotal = this.sumSpending(currentWeekTransactions);
    const previousWeekTotal = this.sumSpending(previousWeekTransactions);

    return {
      referenceDate: this.toDateString(referenceDate),
      currentWeek: {
        startDate: this.toDateString(currentWeekStart),
        endDate: this.toDateString(currentWeekEnd),
        total: currentWeekTotal,
        groupedByDay: this.groupTransactionsByDay(currentWeekTransactions),
        groupedByCategory: this.groupTransactionsByCategory(currentWeekTransactions),
      },
      previousWeek: {
        startDate: this.toDateString(previousWeekStart),
        endDate: this.toDateString(previousWeekEnd),
        total: previousWeekTotal,
      },
      comparison: {
        absoluteChange: this.round(currentWeekTotal - previousWeekTotal),
        percentageChange:
          previousWeekTotal === 0
            ? null
            : this.round(((currentWeekTotal - previousWeekTotal) / previousWeekTotal) * 100),
      },
    };
  }

  buildCategoryPercentageSummary(transactions: Transaction[]) {
    const grouped = this.groupTransactionsByCategory(this.getSpendingTransactions(transactions));
    const total = this.round(grouped.reduce((sum, entry) => sum + entry.total, 0));

    return {
      totalClassifiedSpending: total,
      categories: grouped.map((entry) => ({
        ...entry,
        percentage: total === 0 ? 0 : this.round((entry.total / total) * 100),
      })),
    };
  }

  buildMonthlyCreditObligations(credits: CreditWithInstallments[]) {
    const totalMonthlyPayment = this.round(
      credits.reduce((sum, credit) => sum + credit.monthlyPayment, 0),
    );
    const sortedCredits = [...credits].sort((left, right) => {
      return (
        this.resolveNextCreditDate(left).getTime() - this.resolveNextCreditDate(right).getTime()
      );
    });
    const nextCredit = sortedCredits[0] ?? null;

    return {
      totalMonthlyPayment,
      nextPaymentDate: nextCredit ? this.toDateString(this.resolveNextCreditDate(nextCredit)) : null,
      nextUpcomingPayment: nextCredit
        ? {
            creditId: nextCredit.id,
            name: nextCredit.name,
            amount: nextCredit.monthlyPayment,
            nextPaymentDate: nextCredit.nextPaymentDate,
            deferredPaymentDate: nextCredit.deferredPaymentDate,
            effectiveDate: this.toDateString(this.resolveNextCreditDate(nextCredit)),
            interestRate: nextCredit.interestRate,
          }
        : null,
      highInterestCredits: this.identifyHighInterestCredits(credits),
    };
  }

  identifyHighInterestCredits(credits: Credit[]) {
    return credits
      .filter((credit) => credit.interestRate >= 20)
      .sort((left, right) => right.interestRate - left.interestRate)
      .map((credit) => ({
        id: credit.id,
        name: credit.name,
        creditType: credit.creditType,
        interestRate: credit.interestRate,
        outstandingBalance: credit.outstandingBalance,
        monthlyPayment: credit.monthlyPayment,
      }));
  }

  buildCreditTimeline(credits: CreditWithInstallments[]) {
    const creditsWithItems = credits.map((credit) => {
      const items = [...(credit.installments ?? [])]
        .sort((left, right) => left.dueDate.localeCompare(right.dueDate))
        .map((installment) => ({
          installmentId: installment.id,
          installmentNumber: installment.installmentNumber,
          dueDate: installment.dueDate,
          amount: installment.amount,
          principalPortion: installment.principalPortion,
          interestPortion: installment.interestPortion,
          status: installment.status,
        }));

      const startDate = items[0]?.dueDate ?? credit.nextPaymentDate;
      const endDate = items[items.length - 1]?.dueDate ?? credit.nextPaymentDate;

      return {
        creditId: credit.id,
        name: credit.name,
        creditType: credit.creditType,
        interestRate: credit.interestRate,
        monthlyPayment: credit.monthlyPayment,
        outstandingBalance: credit.outstandingBalance,
        financialSource: credit.financialSource
          ? {
              id: credit.financialSource.id,
              providerName: credit.financialSource.providerName,
              providerType: credit.financialSource.providerType,
            }
          : null,
        startDate,
        endDate,
        items,
      };
    });

    const allDates = creditsWithItems.flatMap((credit) => [credit.startDate, credit.endDate]);

    return {
      timelineRange: {
        startDate: allDates.length > 0 ? allDates.sort()[0] : null,
        endDate: allDates.length > 0 ? [...allDates].sort().reverse()[0] : null,
      },
      credits: creditsWithItems,
    };
  }

  private getSpendingTransactions(transactions: Transaction[]) {
    return transactions.filter(
      (transaction) =>
        transaction.type === TransactionType.EXPENSE ||
        transaction.type === TransactionType.PAYMENT,
    );
  }

  private sumSpending(transactions: Transaction[]) {
    return this.round(
      transactions.reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0),
    );
  }

  private groupTransactionsByDay(transactions: Transaction[]) {
    const grouped = new Map<string, number>();

    for (const transaction of transactions) {
      const key = this.toDateString(transaction.date);
      grouped.set(key, this.round((grouped.get(key) ?? 0) + Math.abs(transaction.amount)));
    }

    return Array.from(grouped.entries())
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([date, total]) => ({ date, total }));
  }

  private groupTransactionsByCategory(transactions: Transaction[]) {
    const grouped = new Map<
      string,
      {
        categoryId: string | null;
        categoryKey: string;
        categoryName: string;
        total: number;
        transactionCount: number;
      }
    >();

    for (const transaction of transactions) {
      const key = transaction.category?.key ?? 'uncategorized';
      const current = grouped.get(key) ?? {
        categoryId: transaction.category?.id ?? null,
        categoryKey: key,
        categoryName: transaction.category?.name ?? 'Uncategorized',
        total: 0,
        transactionCount: 0,
      };

      current.total = this.round(current.total + Math.abs(transaction.amount));
      current.transactionCount += 1;
      grouped.set(key, current);
    }

    return Array.from(grouped.values()).sort((left, right) => right.total - left.total);
  }

  private resolveNextCreditDate(credit: Credit) {
    return new Date(credit.deferredPaymentDate ?? credit.nextPaymentDate);
  }

  private startOfWeek(date: Date) {
    const result = new Date(date);
    result.setUTCHours(0, 0, 0, 0);
    const day = result.getUTCDay();
    const diff = day === 0 ? -6 : 1 - day;
    result.setUTCDate(result.getUTCDate() + diff);
    return result;
  }

  private endOfWeek(date: Date) {
    const result = this.startOfWeek(date);
    result.setUTCDate(result.getUTCDate() + 6);
    result.setUTCHours(23, 59, 59, 999);
    return result;
  }

  private addDays(date: Date, days: number) {
    const result = new Date(date);
    result.setUTCDate(result.getUTCDate() + days);
    return result;
  }

  private toDateString(value: Date) {
    return value.toISOString().slice(0, 10);
  }

  private round(value: number) {
    return Math.round(value * 100) / 100;
  }
}
