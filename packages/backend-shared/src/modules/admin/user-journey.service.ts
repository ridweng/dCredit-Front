import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from 'typeorm';
import { Account } from '../accounts/account.entity';
import { Credit } from '../credits/credit.entity';
import { FinancialSource } from '../financial-sources/financial-source.entity';
import { Transaction } from '../transactions/transaction.entity';
import { User } from '../users/user.entity';
import { VerificationToken } from '../users/verification-token.entity';
import {
  ActivationStage,
  ActivationStepStatus,
  AdminUserDetail,
  AdminUserSummary,
} from './admin.types';

@Injectable()
export class UserJourneyService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(VerificationToken)
    private readonly verificationTokenRepository: Repository<VerificationToken>,
    @InjectRepository(FinancialSource)
    private readonly financialSourceRepository: Repository<FinancialSource>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Credit)
    private readonly creditRepository: Repository<Credit>,
  ) {}

  /**
   * Activated = verified + at least one source + at least one account +
   * at least one transaction or at least one credit.
   */
  getActivationStage(input: {
    emailVerified: boolean;
    financialSourceCount: number;
    accountCount: number;
    transactionCount: number;
    creditCount: number;
  }): ActivationStage {
    if (!input.emailVerified) {
      return 'registered';
    }

    if (input.financialSourceCount === 0) {
      return 'email_verified';
    }

    if (input.accountCount === 0) {
      return 'source_connected';
    }

    if (input.transactionCount > 0 && input.creditCount > 0) {
      return 'activated';
    }

    if (input.transactionCount > 0) {
      return 'transaction_ready';
    }

    if (input.creditCount > 0) {
      return 'credit_ready';
    }

    return 'account_ready';
  }

  buildJourney(stage: ActivationStage): ActivationStepStatus[] {
    const order: ActivationStage[] = [
      'registered',
      'email_verified',
      'source_connected',
      'account_ready',
      'transaction_ready',
      'credit_ready',
      'activated',
    ];

    return order.map((key, index) => {
      const currentIndex = order.indexOf(stage);

      return {
        key,
        label: this.getStageLabel(key),
        completed: currentIndex >= index,
      };
    });
  }

  async listUsers(): Promise<AdminUserSummary[]> {
    const [
      users,
      verificationCounts,
      financialSourceCounts,
      accountCounts,
      transactionCounts,
      creditCounts,
      transactionActivity,
    ] = await Promise.all([
      this.userRepository.find({ order: { createdAt: 'DESC' } }),
      this.countByUser(this.verificationTokenRepository, 'userId'),
      this.countByUser(this.financialSourceRepository, 'userId'),
      this.countByUser(this.accountRepository, 'userId'),
      this.countByUser(this.transactionRepository, 'userId'),
      this.countByUser(this.creditRepository, 'userId'),
      this.lastTransactionByUser(),
    ]);

    return users.map((user) => {
      const financialSourceCount = financialSourceCounts.get(user.id) ?? 0;
      const accountCount = accountCounts.get(user.id) ?? 0;
      const transactionCount = transactionCounts.get(user.id) ?? 0;
      const creditCount = creditCounts.get(user.id) ?? 0;
      const verificationTokenCount = verificationCounts.get(user.id) ?? 0;

      return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        preferredLanguage: user.preferredLanguage,
        emailVerified: user.emailVerified,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        activationStage: this.getActivationStage({
          emailVerified: user.emailVerified,
          financialSourceCount,
          accountCount,
          transactionCount,
          creditCount,
        }),
        financialSourceCount,
        accountCount,
        transactionCount,
        creditCount,
        lastActivityAt:
          transactionActivity.get(user.id) ??
          user.updatedAt ??
          user.createdAt ??
          (verificationTokenCount > 0 ? user.createdAt : null),
      };
    });
  }

  async getUserDetail(userId: string): Promise<AdminUserDetail> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const [
      verificationTokenCount,
      financialSources,
      accounts,
      credits,
      recentTransactions,
      transactionCount,
    ] = await Promise.all([
      this.verificationTokenRepository.count({ where: { userId } }),
      this.financialSourceRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' },
      }),
      this.accountRepository.find({
        where: { userId },
        relations: { financialSource: true },
        order: { createdAt: 'DESC' },
      }),
      this.creditRepository.find({
        where: { userId },
        relations: { financialSource: true },
        order: { nextPaymentDate: 'ASC' },
      }),
      this.transactionRepository.find({
        where: { userId },
        relations: { account: true, category: true, credit: true },
        order: { date: 'DESC', createdAt: 'DESC' },
        take: 10,
      }),
      this.transactionRepository.count({ where: { userId } }),
    ]);

    const summary = this.toUserSummary(
      user,
      financialSources.length,
      accounts.length,
      transactionCount,
      credits.length,
      recentTransactions[0]?.createdAt ?? user.updatedAt ?? user.createdAt,
    );

    return {
      ...summary,
      counts: {
        verificationTokenCount,
        financialSourceCount: financialSources.length,
        accountCount: accounts.length,
        transactionCount,
        creditCount: credits.length,
      },
      journey: this.buildJourney(summary.activationStage),
      financialSources: financialSources.map((source) => ({
        id: source.id,
        providerName: source.providerName,
        providerType: source.providerType,
        status: source.status,
        credentialReference: source.credentialReference,
        createdAt: source.createdAt,
        updatedAt: source.updatedAt,
      })),
      accounts: accounts.map((account) => ({
        id: account.id,
        accountName: account.accountName,
        accountType: account.accountType,
        currency: account.currency,
        currentBalance: account.currentBalance,
        availableBalance: account.availableBalance,
        financialSourceId: account.financialSourceId,
        financialSourceName: account.financialSource.providerName,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
      })),
      credits: credits.map((credit) => ({
        id: credit.id,
        name: credit.name,
        creditType: credit.creditType,
        interestRate: credit.interestRate,
        monthlyPayment: credit.monthlyPayment,
        outstandingBalance: credit.outstandingBalance,
        nextPaymentDate: credit.nextPaymentDate,
        deferredPaymentDate: credit.deferredPaymentDate,
        financialSourceId: credit.financialSourceId,
        financialSourceName: credit.financialSource.providerName,
        createdAt: credit.createdAt,
        updatedAt: credit.updatedAt,
      })),
      recentTransactions: recentTransactions.map((transaction) => ({
        id: transaction.id,
        date: transaction.date,
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        merchant: transaction.merchant,
        accountName: transaction.account.accountName,
        categoryName: transaction.category?.name ?? null,
        creditName: transaction.credit?.name ?? null,
        createdAt: transaction.createdAt,
      })),
    };
  }

  private async countByUser<T extends ObjectLiteral>(
    repository: Repository<T>,
    userIdColumn: string,
  ): Promise<Map<string, number>> {
    const rows = await repository
      .createQueryBuilder('entity')
      .select(`entity.${userIdColumn}`, 'userId')
      .addSelect('COUNT(*)', 'count')
      .groupBy(`entity.${userIdColumn}`)
      .getRawMany<{ userId: string; count: string }>();

    return new Map(rows.map((row) => [row.userId, Number(row.count)]));
  }

  private async lastTransactionByUser(): Promise<Map<string, Date | null>> {
    const rows = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('transaction.userId', 'userId')
      .addSelect('MAX(transaction.date)', 'lastActivityAt')
      .groupBy('transaction.userId')
      .getRawMany<{ userId: string; lastActivityAt: string }>();

    return new Map(
      rows.map((row) => [row.userId, row.lastActivityAt ? new Date(row.lastActivityAt) : null]),
    );
  }

  private toUserSummary(
    user: User,
    financialSourceCount: number,
    accountCount: number,
    transactionCount: number,
    creditCount: number,
    lastActivityAt: Date | null,
  ): AdminUserSummary {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      preferredLanguage: user.preferredLanguage,
      emailVerified: user.emailVerified,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      activationStage: this.getActivationStage({
        emailVerified: user.emailVerified,
        financialSourceCount,
        accountCount,
        transactionCount,
        creditCount,
      }),
      financialSourceCount,
      accountCount,
      transactionCount,
      creditCount,
      lastActivityAt,
    };
  }

  private getStageLabel(stage: ActivationStage): string {
    switch (stage) {
      case 'registered':
        return 'Registered';
      case 'email_verified':
        return 'Email Verified';
      case 'source_connected':
        return 'Source Connected';
      case 'account_ready':
        return 'Account Ready';
      case 'transaction_ready':
        return 'Transaction Ready';
      case 'credit_ready':
        return 'Credit Ready';
      case 'activated':
        return 'Activated';
    }
  }
}
