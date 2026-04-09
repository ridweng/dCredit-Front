import type {
  ActivationFunnelEntry,
  ActivationStage,
  AdminUserSummary,
} from '../models/admin.models';

export class ActivationOverviewService {
  buildFunnel(users: AdminUserSummary[]): ActivationFunnelEntry[] {
    const totalUsers = users.length;
    const stageCounts = new Map<ActivationStage, number>();

    for (const user of users) {
      stageCounts.set(user.activationStage, (stageCounts.get(user.activationStage) ?? 0) + 1);
    }

    const countAtLeast = (stages: ActivationStage[]) =>
      stages.reduce((sum, stage) => sum + (stageCounts.get(stage) ?? 0), 0);

    const entries: Array<{ key: ActivationStage; label: string; count: number }> = [
      { key: 'registered', label: 'Registered', count: totalUsers },
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

  calculateSignupTrend(users: Array<Pick<AdminUserSummary, 'createdAt'>>): {
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

  activationDefinition(): string {
    return 'Activated = verified user with at least one financial source, one account, and either transaction data or a detected credit.';
  }
}
