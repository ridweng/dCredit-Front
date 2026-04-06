import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Credit } from './credit.entity';
import { Installment } from './installment.entity';

@Injectable()
export class CreditsService {
  constructor(
    @InjectRepository(Credit)
    private readonly creditRepository: Repository<Credit>,
    @InjectRepository(Installment)
    private readonly installmentRepository: Repository<Installment>,
  ) {}

  listForUser(userId: string): Promise<Credit[]> {
    return this.creditRepository.find({
      where: { userId },
      relations: { installments: true },
      order: { createdAt: 'DESC' },
    });
  }

  countInstallmentsForCredit(creditId: string): Promise<number> {
    return this.installmentRepository.count({ where: { creditId } });
  }
}
