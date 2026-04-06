import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Credit } from './credit.entity';
import { Installment } from './installment.entity';
import { FinancialInsightsService } from '../shared/financial-insights.service';

@Injectable()
export class CreditsService {
  constructor(
    @InjectRepository(Credit)
    private readonly creditRepository: Repository<Credit>,
    @InjectRepository(Installment)
    private readonly installmentRepository: Repository<Installment>,
    private readonly financialInsightsService: FinancialInsightsService,
  ) {}

  listForUser(userId: string): Promise<Credit[]> {
    return this.creditRepository.find({
      where: { userId },
      relations: { installments: true, financialSource: true },
      order: { createdAt: 'DESC' },
    });
  }

  async listCreditsView(userId: string) {
    const credits = await this.listForUser(userId);
    const obligations = this.financialInsightsService.buildMonthlyCreditObligations(credits);
    const highInterestIds = new Set(obligations.highInterestCredits.map((credit) => credit.id));

    return {
      summary: {
        totalCredits: credits.length,
        totalOutstandingBalance: credits.reduce(
          (sum, credit) => Math.round((sum + credit.outstandingBalance) * 100) / 100,
          0,
        ),
        totalMonthlyPayment: obligations.totalMonthlyPayment,
        nextUpcomingPayment: obligations.nextUpcomingPayment,
        highInterestCount: obligations.highInterestCredits.length,
      },
      credits: credits.map((credit) => ({
        id: credit.id,
        name: credit.name,
        creditType: credit.creditType,
        originalAmount: credit.originalAmount,
        outstandingBalance: credit.outstandingBalance,
        interestRate: credit.interestRate,
        monthlyPayment: credit.monthlyPayment,
        nextPaymentDate: credit.nextPaymentDate,
        deferredPaymentDate: credit.deferredPaymentDate,
        totalInstallments: credit.totalInstallments,
        remainingInstallments: credit.remainingInstallments,
        highInterest: highInterestIds.has(credit.id),
        financialSource: {
          id: credit.financialSource.id,
          providerName: credit.financialSource.providerName,
          providerType: credit.financialSource.providerType,
        },
      })),
    };
  }

  async getCreditDetails(userId: string, creditId: string) {
    const credit = await this.creditRepository.findOne({
      where: { id: creditId, userId },
      relations: { installments: true, financialSource: true },
    });

    if (!credit) {
      throw new NotFoundException('Credit not found.');
    }

    const timeline = this.financialInsightsService.buildCreditTimeline([credit]);
    const effectiveNextDate = credit.deferredPaymentDate ?? credit.nextPaymentDate;

    return {
      credit: {
        id: credit.id,
        name: credit.name,
        creditType: credit.creditType,
        originalAmount: credit.originalAmount,
        outstandingBalance: credit.outstandingBalance,
        interestRate: credit.interestRate,
        monthlyPayment: credit.monthlyPayment,
        nextPaymentDate: credit.nextPaymentDate,
        deferredPaymentDate: credit.deferredPaymentDate,
        effectiveNextPaymentDate: effectiveNextDate,
        totalInstallments: credit.totalInstallments,
        remainingInstallments: credit.remainingInstallments,
        financialSource: {
          id: credit.financialSource.id,
          providerName: credit.financialSource.providerName,
          providerType: credit.financialSource.providerType,
          status: credit.financialSource.status,
        },
        installments: [...credit.installments].sort((left, right) =>
          left.dueDate.localeCompare(right.dueDate),
        ),
        timeline: timeline.credits[0] ?? null,
      },
    };
  }

  async getTimeline(userId: string) {
    const credits = await this.listForUser(userId);
    return this.financialInsightsService.buildCreditTimeline(credits);
  }

  countInstallmentsForCredit(creditId: string): Promise<number> {
    return this.installmentRepository.count({ where: { creditId } });
  }
}
