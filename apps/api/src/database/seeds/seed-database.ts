import { hash } from 'bcryptjs';
import { DataSource } from 'typeorm';
import { AccountType } from '../../common/enums/account-type.enum';
import { CreditType } from '../../common/enums/credit-type.enum';
import { FinancialSourceStatus } from '../../common/enums/financial-source-status.enum';
import { InstallmentStatus } from '../../common/enums/installment-status.enum';
import { ProviderType } from '../../common/enums/provider-type.enum';
import { TransactionType } from '../../common/enums/transaction-type.enum';
import { Account } from '../../modules/accounts/account.entity';
import { Category } from '../../modules/categories/category.entity';
import { Credit } from '../../modules/credits/credit.entity';
import { Installment } from '../../modules/credits/installment.entity';
import { FinancialSource } from '../../modules/financial-sources/financial-source.entity';
import { Transaction } from '../../modules/transactions/transaction.entity';
import { User } from '../../modules/users/user.entity';
import { VerificationToken } from '../../modules/users/verification-token.entity';
import {
  activationJourneyUserSeeds,
  demoAccountsSeed,
  demoAdminUserSeed,
  demoCategoriesSeed,
  demoCreditsSeed,
  demoFinancialSourcesSeed,
  demoVerificationHistorySeeds,
  demoInstallmentsSeed,
  demoTransactionsSeed,
  demoUnverifiedUserSeed,
  demoUnverifiedVerificationTokenSeed,
  demoVerifiedUserSeed,
} from './seed-data';

async function seedUser(
  dataSource: DataSource,
  input: {
    email: string;
    password: string;
    fullName: string;
    emailVerified: boolean;
    verifiedAt: Date | null;
    preferredLanguage: User['preferredLanguage'];
    isAdmin?: boolean;
  },
): Promise<User> {
  const userRepository = dataSource.getRepository(User);
  const passwordHash = await hash(input.password, 10);

  await userRepository.upsert(
    {
      email: input.email,
      passwordHash,
      fullName: input.fullName,
      emailVerified: input.emailVerified,
      verifiedAt: input.verifiedAt,
      isAdmin: input.isAdmin ?? false,
      preferredLanguage: input.preferredLanguage,
    },
    ['email'],
  );

  return userRepository.findOneByOrFail({ email: input.email });
}

async function syncVerificationTokens(
  dataSource: DataSource,
  user: User,
  tokenSeed:
    | {
        token: string;
        expiresAt: Date;
      }
    | null,
): Promise<void> {
  const repository = dataSource.getRepository(VerificationToken);

  await repository.delete({ userId: user.id });

  if (!tokenSeed) {
    return;
  }

  await repository.save(
    repository.create({
      userId: user.id,
      token: tokenSeed.token,
      expiresAt: tokenSeed.expiresAt,
      usedAt: null,
    }),
  );
}

async function seedVerificationHistory(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository(User);
  const verificationTokenRepository = dataSource.getRepository(VerificationToken);

  for (const seed of demoVerificationHistorySeeds) {
    const user = await userRepository.findOneBy({ email: seed.email });

    if (!user) {
      continue;
    }

    await verificationTokenRepository.upsert(
      {
        userId: user.id,
        token: seed.token,
        expiresAt: seed.expiresAt,
        usedAt: seed.usedAt,
      },
      ['token'],
    );
  }
}

async function seedFinancialSources(
  dataSource: DataSource,
  user: User,
): Promise<Map<string, FinancialSource>> {
  const repository = dataSource.getRepository(FinancialSource);
  const sources = new Map<string, FinancialSource>();

  for (const sourceSeed of demoFinancialSourcesSeed) {
    let source = await repository.findOne({
      where: {
        userId: user.id,
        providerName: sourceSeed.providerName,
        providerType: sourceSeed.providerType,
      },
    });

    if (!source) {
      source = repository.create({
        userId: user.id,
        providerName: sourceSeed.providerName,
        providerType: sourceSeed.providerType,
        status: sourceSeed.status,
        credentialReference: sourceSeed.credentialReference,
      });
    } else {
      repository.merge(source, {
        status: sourceSeed.status,
        credentialReference: sourceSeed.credentialReference,
      });
    }

    sources.set(sourceSeed.key, await repository.save(source));
  }

  return sources;
}

async function seedAccounts(
  dataSource: DataSource,
  user: User,
  financialSources: Map<string, FinancialSource>,
): Promise<Map<string, Account>> {
  const repository = dataSource.getRepository(Account);
  const accounts = new Map<string, Account>();

  for (const accountSeed of demoAccountsSeed) {
    const financialSource = financialSources.get(accountSeed.sourceKey);

    if (!financialSource) {
      throw new Error(`Missing financial source ${accountSeed.sourceKey} for account seed.`);
    }

    let account = await repository.findOne({
      where: {
        userId: user.id,
        financialSourceId: financialSource.id,
        accountName: accountSeed.accountName,
      },
    });

    if (!account) {
      account = repository.create({
        userId: user.id,
        financialSourceId: financialSource.id,
        accountName: accountSeed.accountName,
        accountType: accountSeed.accountType,
        currency: accountSeed.currency,
        currentBalance: accountSeed.currentBalance,
        availableBalance: accountSeed.availableBalance,
      });
    } else {
      repository.merge(account, {
        accountType: accountSeed.accountType,
        currency: accountSeed.currency,
        currentBalance: accountSeed.currentBalance,
        availableBalance: accountSeed.availableBalance,
      });
    }

    accounts.set(accountSeed.key, await repository.save(account));
  }

  return accounts;
}

async function seedCategories(dataSource: DataSource): Promise<Map<string, Category>> {
  const repository = dataSource.getRepository(Category);

  await repository.upsert(demoCategoriesSeed, ['key']);

  const categories = await repository.find();
  return new Map(categories.map((category) => [category.key, category]));
}

async function seedCredits(
  dataSource: DataSource,
  user: User,
  financialSources: Map<string, FinancialSource>,
): Promise<Map<string, Credit>> {
  const repository = dataSource.getRepository(Credit);
  const credits = new Map<string, Credit>();

  for (const creditSeed of demoCreditsSeed) {
    const financialSource = financialSources.get(creditSeed.sourceKey);

    if (!financialSource) {
      throw new Error(`Missing financial source ${creditSeed.sourceKey} for credit seed.`);
    }

    let credit = await repository.findOne({
      where: {
        userId: user.id,
        financialSourceId: financialSource.id,
        name: creditSeed.name,
      },
    });

    if (!credit) {
      credit = repository.create({
        userId: user.id,
        financialSourceId: financialSource.id,
        name: creditSeed.name,
        creditType: creditSeed.creditType,
        originalAmount: creditSeed.originalAmount,
        outstandingBalance: creditSeed.outstandingBalance,
        interestRate: creditSeed.interestRate,
        monthlyPayment: creditSeed.monthlyPayment,
        nextPaymentDate: creditSeed.nextPaymentDate,
        deferredPaymentDate: creditSeed.deferredPaymentDate,
        totalInstallments: creditSeed.totalInstallments,
        remainingInstallments: creditSeed.remainingInstallments,
      });
    } else {
      repository.merge(credit, {
        creditType: creditSeed.creditType,
        originalAmount: creditSeed.originalAmount,
        outstandingBalance: creditSeed.outstandingBalance,
        interestRate: creditSeed.interestRate,
        monthlyPayment: creditSeed.monthlyPayment,
        nextPaymentDate: creditSeed.nextPaymentDate,
        deferredPaymentDate: creditSeed.deferredPaymentDate,
        totalInstallments: creditSeed.totalInstallments,
        remainingInstallments: creditSeed.remainingInstallments,
      });
    }

    credits.set(creditSeed.key, await repository.save(credit));
  }

  return credits;
}

async function seedInstallments(
  dataSource: DataSource,
  credits: Map<string, Credit>,
): Promise<void> {
  const repository = dataSource.getRepository(Installment);

  for (const installmentSeed of demoInstallmentsSeed) {
    const credit = credits.get(installmentSeed.creditKey);

    if (!credit) {
      throw new Error(`Missing credit ${installmentSeed.creditKey} for installment seed.`);
    }

    let installment = await repository.findOne({
      where: {
        creditId: credit.id,
        installmentNumber: installmentSeed.installmentNumber,
      },
    });

    if (!installment) {
      installment = repository.create({
        creditId: credit.id,
        installmentNumber: installmentSeed.installmentNumber,
        dueDate: installmentSeed.dueDate,
        amount: installmentSeed.amount,
        principalPortion: installmentSeed.principalPortion,
        interestPortion: installmentSeed.interestPortion,
        status: installmentSeed.status,
      });
    } else {
      repository.merge(installment, {
        dueDate: installmentSeed.dueDate,
        amount: installmentSeed.amount,
        principalPortion: installmentSeed.principalPortion,
        interestPortion: installmentSeed.interestPortion,
        status: installmentSeed.status,
      });
    }

    await repository.save(installment);
  }
}

async function seedTransactions(
  dataSource: DataSource,
  user: User,
  accounts: Map<string, Account>,
  credits: Map<string, Credit>,
  categories: Map<string, Category>,
): Promise<void> {
  const repository = dataSource.getRepository(Transaction);

  for (const transactionSeed of demoTransactionsSeed) {
    const account = accounts.get(transactionSeed.accountKey);
    const credit = transactionSeed.creditKey ? credits.get(transactionSeed.creditKey) : null;
    const category = categories.get(transactionSeed.categoryKey);

    if (!account) {
      throw new Error(`Missing account ${transactionSeed.accountKey} for transaction seed.`);
    }

    let transaction = await repository.findOne({
      where: {
        userId: user.id,
        accountId: account.id,
        description: transactionSeed.description,
        date: transactionSeed.date,
      },
    });

    if (!transaction) {
      transaction = repository.create({
        userId: user.id,
        accountId: account.id,
        creditId: credit?.id ?? null,
        categoryId: category?.id ?? null,
        date: transactionSeed.date,
        description: transactionSeed.description,
        amount: transactionSeed.amount,
        type: transactionSeed.type,
        merchant: transactionSeed.merchant,
      });
    } else {
      repository.merge(transaction, {
        creditId: credit?.id ?? null,
        categoryId: category?.id ?? null,
        amount: transactionSeed.amount,
        type: transactionSeed.type,
        merchant: transactionSeed.merchant,
      });
    }

    await repository.save(transaction);
  }
}

async function seedActivationJourneyUsers(
  dataSource: DataSource,
  categories: Map<string, Category>,
): Promise<void> {
  const sourceRepository = dataSource.getRepository(FinancialSource);
  const accountRepository = dataSource.getRepository(Account);
  const creditRepository = dataSource.getRepository(Credit);
  const installmentRepository = dataSource.getRepository(Installment);
  const transactionRepository = dataSource.getRepository(Transaction);

  for (const seed of activationJourneyUserSeeds) {
    const user = await seedUser(dataSource, seed);

    await syncVerificationTokens(
      dataSource,
      user,
      seed.emailVerified
        ? null
        : {
            token: `${seed.key}-verification-token`,
            expiresAt: new Date('2026-12-31T23:59:59.000Z'),
          },
    );

    if (seed.stage === 'registered' || seed.stage === 'email_verified') {
      continue;
    }

    const financialSource = await sourceRepository.save(
      sourceRepository.create({
        userId: user.id,
        providerName: `${seed.fullName} Source`,
        providerType:
          seed.stage === 'source_connected' ? ProviderType.MANUAL : ProviderType.BANK_API,
        status: FinancialSourceStatus.ACTIVE,
        credentialReference: `vault://sources/${seed.key}`,
      }),
    );

    if (seed.stage === 'source_connected') {
      continue;
    }

    const account = await accountRepository.save(
      accountRepository.create({
        userId: user.id,
        financialSourceId: financialSource.id,
        accountName: `${seed.fullName} Checking`,
        accountType: AccountType.CHECKING,
        currency: 'USD',
        currentBalance: 950,
        availableBalance: 900,
      }),
    );

    if (seed.stage === 'account_ready') {
      continue;
    }

    if (seed.stage === 'transaction_ready') {
      await transactionRepository.save(
        transactionRepository.create({
          userId: user.id,
          accountId: account.id,
          categoryId: categories.get('groceries')?.id ?? null,
          date: new Date('2026-04-05T10:00:00.000Z'),
          description: 'Starter grocery import',
          amount: -54.4,
          type: TransactionType.EXPENSE,
          merchant: 'Neighborhood Market',
        }),
      );
      continue;
    }

    const credit = await creditRepository.save(
      creditRepository.create({
        userId: user.id,
        financialSourceId: financialSource.id,
        name: `${seed.fullName} Credit Line`,
        creditType: CreditType.PERSONAL_LOAN,
        originalAmount: 1800,
        outstandingBalance: 920,
        interestRate: 18.75,
        monthlyPayment: 120,
        nextPaymentDate: '2026-04-20',
        deferredPaymentDate: null,
        totalInstallments: 12,
        remainingInstallments: 8,
      }),
    );

    await installmentRepository.save(
      installmentRepository.create({
        creditId: credit.id,
        installmentNumber: 5,
        dueDate: '2026-04-20',
        amount: 120,
        principalPortion: 88,
        interestPortion: 32,
        status: InstallmentStatus.PENDING,
      }),
    );
  }
}

export async function runSeeds(dataSource: DataSource): Promise<void> {
  await seedUser(dataSource, demoAdminUserSeed);
  const verifiedUser = await seedUser(dataSource, demoVerifiedUserSeed);
  const unverifiedUser = await seedUser(dataSource, demoUnverifiedUserSeed);

  await syncVerificationTokens(dataSource, verifiedUser, null);
  await syncVerificationTokens(dataSource, unverifiedUser, demoUnverifiedVerificationTokenSeed);

  const financialSources = await seedFinancialSources(dataSource, verifiedUser);
  const accounts = await seedAccounts(dataSource, verifiedUser, financialSources);
  const categories = await seedCategories(dataSource);
  const credits = await seedCredits(dataSource, verifiedUser, financialSources);

  await seedInstallments(dataSource, credits);
  await seedTransactions(dataSource, verifiedUser, accounts, credits, categories);
  await seedActivationJourneyUsers(dataSource, categories);
  await seedVerificationHistory(dataSource);
}
