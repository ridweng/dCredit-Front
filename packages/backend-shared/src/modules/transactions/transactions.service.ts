import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { FinancialInsightsService } from '../shared/financial-insights.service';
import { ListTransactionsQueryDto } from './dto/list-transactions-query.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly financialInsightsService: FinancialInsightsService,
  ) {}

  listForUser(userId: string): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { userId },
      relations: { account: true, credit: true, category: true },
      order: { date: 'DESC' },
    });
  }

  async listRecentForUser(userId: string, query: ListTransactionsQueryDto) {
    const limit = query.limit ?? 12;
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.account', 'account')
      .leftJoinAndSelect('account.financialSource', 'financialSource')
      .leftJoinAndSelect('transaction.credit', 'credit')
      .leftJoinAndSelect('transaction.category', 'category')
      .where('transaction.userId = :userId', { userId })
      .orderBy('transaction.date', 'DESC')
      .addOrderBy('transaction.createdAt', 'DESC')
      .take(limit);

    if (query.categoryKey) {
      queryBuilder.andWhere('category.key = :categoryKey', {
        categoryKey: query.categoryKey,
      });
    }

    const transactions = await queryBuilder.getMany();

    return {
      transactions: transactions.map((transaction) => ({
        id: transaction.id,
        date: transaction.date,
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        merchant: transaction.merchant,
        createdAt: transaction.createdAt,
        account: {
          id: transaction.account.id,
          accountName: transaction.account.accountName,
          accountType: transaction.account.accountType,
          currency: transaction.account.currency,
          financialSource: {
            id: transaction.account.financialSource.id,
            providerName: transaction.account.financialSource.providerName,
            providerType: transaction.account.financialSource.providerType,
          },
        },
        credit: transaction.credit
          ? {
              id: transaction.credit.id,
              name: transaction.credit.name,
              interestRate: transaction.credit.interestRate,
            }
          : null,
        category: transaction.category
          ? {
              id: transaction.category.id,
              key: transaction.category.key,
              name: transaction.category.name,
              type: transaction.category.type,
            }
          : null,
      })),
    };
  }

  async getCategoriesSummary(userId: string) {
    const transactions = await this.transactionRepository.find({
      where: { userId },
      relations: { category: true },
      order: { date: 'ASC' },
    });

    return this.financialInsightsService.buildCategoryPercentageSummary(transactions);
  }
}
