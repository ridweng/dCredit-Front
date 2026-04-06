import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinancialSource } from './financial-source.entity';

@Injectable()
export class FinancialSourcesService {
  constructor(
    @InjectRepository(FinancialSource)
    private readonly financialSourceRepository: Repository<FinancialSource>,
  ) {}

  listForUser(userId: string): Promise<FinancialSource[]> {
    return this.financialSourceRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}
