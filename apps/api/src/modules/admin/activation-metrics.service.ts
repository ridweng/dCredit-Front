import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerificationToken } from '../users/verification-token.entity';
import { ActivationFunnelEntry, ActivationStage } from './admin.types';
import { UserJourneyService } from './user-journey.service';

@Injectable()
export class ActivationMetricsService {
  constructor(
    private readonly userJourneyService: UserJourneyService,
    @InjectRepository(VerificationToken)
    private readonly verificationTokenRepository: Repository<VerificationToken>,
  ) {}

  async getOverview() {
    const users = await this.userJourneyService.listUsers();
    const totalUsers = users.length;
    const stageCounts = this.buildStageCounts(users.map((user) => user.activationStage));
    const latestSignups = users.slice(0, 8).map((user) => ({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      activationStage: user.activationStage,
      createdAt: user.createdAt,
      emailVerified: user.emailVerified,
      isAdmin: user.isAdmin,
    }));

    const latestVerifications = await this.verificationTokenRepository
      .createQueryBuilder('verificationToken')
      .leftJoinAndSelect('verificationToken.user', 'user')
      .where('verificationToken.usedAt IS NOT NULL')
      .orderBy('verificationToken.usedAt', 'DESC')
      .take(8)
      .getMany();

    const recentSignupTrend = this.calculateSignupTrend(users);
    const verifiedUsers = users.filter((user) => user.emailVerified).length;
    const usersWithSources = users.filter((user) => user.financialSourceCount > 0).length;
    const usersWithAccounts = users.filter((user) => user.accountCount > 0).length;
    const usersWithTransactions = users.filter((user) => user.transactionCount > 0).length;
    const usersWithCredits = users.filter((user) => user.creditCount > 0).length;
    const activatedUsers = users.filter((user) => user.activationStage === 'activated').length;

    return {
      kpis: {
        totalUsers,
        verifiedUsers,
        unverifiedUsers: totalUsers - verifiedUsers,
        usersWithSources,
        usersWithAccounts,
        usersWithTransactions,
        usersWithCredits,
        activatedUsers,
      },
      funnel: this.buildFunnel(stageCounts, totalUsers),
      activationDefinition:
        'Activated = verified user with at least one financial source, one account, and either transaction data or a detected credit.',
      latestSignups,
      latestVerifications: latestVerifications.map((token) => ({
        id: token.id,
        usedAt: token.usedAt,
        user: {
          id: token.user.id,
          fullName: token.user.fullName,
          email: token.user.email,
        },
      })),
      trends: recentSignupTrend,
    };
  }

  private buildStageCounts(stages: ActivationStage[]) {
    const stageCounts = new Map<ActivationStage, number>();

    for (const stage of stages) {
      stageCounts.set(stage, (stageCounts.get(stage) ?? 0) + 1);
    }

    return stageCounts;
  }

  private buildFunnel(
    stageCounts: Map<ActivationStage, number>,
    totalUsers: number,
  ): ActivationFunnelEntry[] {
    const countAtLeast = (stages: ActivationStage[]) =>
      stages.reduce((sum, stage) => sum + (stageCounts.get(stage) ?? 0), 0);

    const entries: Array<{ key: ActivationStage; label: string; count: number }> = [
      {
        key: 'registered',
        label: 'Registered',
        count: totalUsers,
      },
      {
        key: 'email_verified',
        label: 'Email Verified',
        count: countAtLeast([
          'email_verified',
          'source_connected',
          'account_ready',
          'transaction_ready',
          'credit_ready',
          'activated',
        ]),
      },
      {
        key: 'source_connected',
        label: 'First Source Connected',
        count: countAtLeast([
          'source_connected',
          'account_ready',
          'transaction_ready',
          'credit_ready',
          'activated',
        ]),
      },
      {
        key: 'account_ready',
        label: 'First Account Present',
        count: countAtLeast([
          'account_ready',
          'transaction_ready',
          'credit_ready',
          'activated',
        ]),
      },
      {
        key: 'transaction_ready',
        label: 'First Transaction Imported',
        count: countAtLeast(['transaction_ready', 'activated']),
      },
      {
        key: 'credit_ready',
        label: 'First Credit Detected',
        count: countAtLeast(['credit_ready', 'activated']),
      },
      {
        key: 'activated',
        label: 'Activated',
        count: countAtLeast(['activated']),
      },
    ];

    return entries.map((entry) => ({
      ...entry,
      percentage: totalUsers === 0 ? 0 : Number(((entry.count / totalUsers) * 100).toFixed(1)),
    }));
  }

  private calculateSignupTrend(
    users: Array<{ createdAt: Date }>,
  ): {
    last7Days: number;
    previous7Days: number;
    delta: number;
  } {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const last7Days = users.filter((user) => user.createdAt >= sevenDaysAgo).length;
    const previous7Days = users.filter(
      (user) => user.createdAt >= fourteenDaysAgo && user.createdAt < sevenDaysAgo,
    ).length;

    return {
      last7Days,
      previous7Days,
      delta: last7Days - previous7Days,
    };
  }
}
