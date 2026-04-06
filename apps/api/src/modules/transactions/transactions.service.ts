import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { FinancialInsightsService } from '../shared/financial-insights.service';

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

  async getCategoriesSummary(userId: string) {
    const transactions = await this.transactionRepository.find({
      where: { userId },
      relations: { category: true },
      order: { date: 'ASC' },
    });

    return this.financialInsightsService.buildCategoryPercentageSummary(transactions);
  }
}
