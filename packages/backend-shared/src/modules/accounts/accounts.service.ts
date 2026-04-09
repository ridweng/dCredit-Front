import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  listForUser(userId: string): Promise<Account[]> {
    return this.accountRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}
