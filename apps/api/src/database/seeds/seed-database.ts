import { hash } from 'bcryptjs';
import { DataSource } from 'typeorm';
import { User } from '../../modules/users/user.entity';
import { VerificationToken } from '../../modules/users/verification-token.entity';
import { FinancialSource } from '../../modules/financial-sources/financial-source.entity';
import { Account } from '../../modules/accounts/account.entity';
import { Category } from '../../modules/categories/category.entity';
import { Credit } from '../../modules/credits/credit.entity';
import { Installment } from '../../modules/credits/installment.entity';
import { Transaction } from '../../modules/transactions/transaction.entity';
import {
  demoAccountSeed,
  demoCategoriesSeed,
  demoCreditSeed,
  demoFinancialSourceSeed,
  demoInstallmentsSeed,
  demoTransactionsSeed,
  demoUserSeed,
} from './seed-data';

async function seedUser(dataSource: DataSource): Promise<User> {
  const userRepository = dataSource.getRepository(User);
  const passwordHash = await hash(demoUserSeed.password, 10);

  await userRepository.upsert(
    {
      email: demoUserSeed.email,
      passwordHash,
      fullName: demoUserSeed.fullName,
      emailVerified: demoUserSeed.emailVerified,
      preferredLanguage: demoUserSeed.preferredLanguage,
    },
    ['email'],
  );

  return userRepository.findOneByOrFail({ email: demoUserSeed.email });
}

async function seedVerificationToken(dataSource: DataSource, user: User): Promise<void> {
  const repository = dataSource.getRepository(VerificationToken);

  await repository.upsert(
    {
      userId: user.id,
      token: 'demo-verification-token',
      expiresAt: new Date('2026-12-31T23:59:59.000Z'),
      usedAt: new Date('2026-04-01T09:05:00.000Z'),
    },
    ['token'],
  );
}

async function seedFinancialSource(
  dataSource: DataSource,
  user: User,
): Promise<FinancialSource> {
  const repository = dataSource.getRepository(FinancialSource);
  let source = await repository.findOne({
    where: {
      userId: user.id,
      providerName: demoFinancialSourceSeed.providerName,
      providerType: demoFinancialSourceSeed.providerType,
    },
  });

  if (!source) {
    source = repository.create({
      userId: user.id,
      ...demoFinancialSourceSeed,
    });
  } else {
    repository.merge(source, demoFinancialSourceSeed);
  }

  return repository.save(source);
}

async function seedAccount(
  dataSource: DataSource,
  user: User,
  financialSource: FinancialSource,
): Promise<Account> {
  const repository = dataSource.getRepository(Account);
  let account = await repository.findOne({
    where: {
      userId: user.id,
      financialSourceId: financialSource.id,
      accountName: demoAccountSeed.accountName,
    },
  });

  if (!account) {
    account = repository.create({
      userId: user.id,
      financialSourceId: financialSource.id,
      ...demoAccountSeed,
    });
  } else {
    repository.merge(account, demoAccountSeed);
  }

  return repository.save(account);
}

async function seedCategories(dataSource: DataSource): Promise<Map<string, Category>> {
  const repository = dataSource.getRepository(Category);

  await repository.upsert(demoCategoriesSeed, ['key']);

  const categories = await repository.find();
  return new Map(categories.map((category) => [category.key, category]));
}

async function seedCredit(
  dataSource: DataSource,
  user: User,
  financialSource: FinancialSource,
): Promise<Credit> {
  const repository = dataSource.getRepository(Credit);
  let credit = await repository.findOne({
    where: {
      userId: user.id,
      financialSourceId: financialSource.id,
      name: demoCreditSeed.name,
    },
  });

  if (!credit) {
    credit = repository.create({
      userId: user.id,
      financialSourceId: financialSource.id,
      ...demoCreditSeed,
    });
  } else {
    repository.merge(credit, demoCreditSeed);
  }

  return repository.save(credit);
}

async function seedInstallments(dataSource: DataSource, credit: Credit): Promise<void> {
  const repository = dataSource.getRepository(Installment);

  for (const installmentSeed of demoInstallmentsSeed) {
    let installment = await repository.findOne({
      where: {
        creditId: credit.id,
        installmentNumber: installmentSeed.installmentNumber,
      },
    });

    if (!installment) {
      installment = repository.create({
        creditId: credit.id,
        ...installmentSeed,
      });
    } else {
      repository.merge(installment, installmentSeed);
    }

    await repository.save(installment);
  }
}

async function seedTransactions(
  dataSource: DataSource,
  user: User,
  account: Account,
  credit: Credit,
  categories: Map<string, Category>,
): Promise<void> {
  const repository = dataSource.getRepository(Transaction);

  for (const transactionSeed of demoTransactionsSeed) {
    const category = categories.get(transactionSeed.categoryKey);

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
        creditId: transactionSeed.type === 'payment' ? credit.id : null,
        categoryId: category?.id ?? null,
        date: transactionSeed.date,
        description: transactionSeed.description,
        amount: transactionSeed.amount,
        type: transactionSeed.type,
        merchant: transactionSeed.merchant,
      });
    } else {
      repository.merge(transaction, {
        creditId: transactionSeed.type === 'payment' ? credit.id : null,
        categoryId: category?.id ?? null,
        amount: transactionSeed.amount,
        type: transactionSeed.type,
        merchant: transactionSeed.merchant,
      });
    }

    await repository.save(transaction);
  }
}

export async function runSeeds(dataSource: DataSource): Promise<void> {
  const user = await seedUser(dataSource);
  await seedVerificationToken(dataSource, user);

  const financialSource = await seedFinancialSource(dataSource, user);
  const account = await seedAccount(dataSource, user, financialSource);
  const categories = await seedCategories(dataSource);
  const credit = await seedCredit(dataSource, user, financialSource);

  await seedInstallments(dataSource, credit);
  await seedTransactions(dataSource, user, account, credit, categories);
}
