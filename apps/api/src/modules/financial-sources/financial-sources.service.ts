import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinancialSource } from './financial-source.entity';
import { CreateFinancialSourceDto } from './dto/create-financial-source.dto';
import { UpdateFinancialSourceDto } from './dto/update-financial-source.dto';
import { FinancialInsightsService } from '../shared/financial-insights.service';

@Injectable()
export class FinancialSourcesService {
  constructor(
    @InjectRepository(FinancialSource)
    private readonly financialSourceRepository: Repository<FinancialSource>,
    private readonly financialInsightsService: FinancialInsightsService,
  ) {}

  listForUser(userId: string): Promise<FinancialSource[]> {
    return this.financialSourceRepository.find({
      where: { userId },
      relations: { accounts: true, credits: true },
      order: { createdAt: 'DESC' },
    });
  }

  async listViewForUser(userId: string) {
    const sources = await this.listForUser(userId);

    return {
      financialSources: sources.map((source) => {
        const liquidBalance = this.financialInsightsService.buildLiquidBalanceSummary(
          source.accounts.map((account) => ({
            ...account,
            financialSource: source,
          })),
        );

        return {
          id: source.id,
          providerName: source.providerName,
          providerType: source.providerType,
          status: source.status,
          credentialReference: source.credentialReference,
          accountCount: source.accounts.length,
          creditCount: source.credits.length,
          liquidBalance: liquidBalance.totalLiquidBalance,
          outstandingCreditBalance: Math.round(
            source.credits.reduce((sum, credit) => sum + credit.outstandingBalance, 0) * 100,
          ) / 100,
          accounts: source.accounts.map((account) => ({
            id: account.id,
            accountName: account.accountName,
            accountType: account.accountType,
            currency: account.currency,
            currentBalance: account.currentBalance,
            availableBalance: account.availableBalance,
          })),
        };
      }),
    };
  }

  async createForUser(userId: string, dto: CreateFinancialSourceDto) {
    const existing = await this.financialSourceRepository.findOne({
      where: {
        userId,
        providerName: dto.providerName.trim(),
        providerType: dto.providerType,
      },
    });

    if (existing) {
      throw new ConflictException('A financial source with this provider already exists.');
    }

    const financialSource = this.financialSourceRepository.create({
      userId,
      providerName: dto.providerName.trim(),
      providerType: dto.providerType,
      status: dto.status,
      credentialReference: dto.credentialReference.trim(),
    });

    return this.financialSourceRepository.save(financialSource);
  }

  async updateForUser(userId: string, financialSourceId: string, dto: UpdateFinancialSourceDto) {
    const source = await this.financialSourceRepository.findOne({
      where: { id: financialSourceId, userId },
    });

    if (!source) {
      throw new NotFoundException('Financial source not found.');
    }

    if (dto.providerName !== undefined) {
      source.providerName = dto.providerName.trim();
    }

    if (dto.providerType !== undefined) {
      source.providerType = dto.providerType;
    }

    if (dto.status !== undefined) {
      source.status = dto.status;
    }

    if (dto.credentialReference !== undefined) {
      source.credentialReference = dto.credentialReference.trim();
    }

    return this.financialSourceRepository.save(source);
  }
}
