import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { VerificationToken } from './verification-token.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(VerificationToken)
    private readonly verificationTokenRepository: Repository<VerificationToken>,
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async markEmailVerified(userId: string): Promise<void> {
    await this.userRepository.update(userId, { emailVerified: true });
  }

  countVerificationTokensForUser(userId: string): Promise<number> {
    return this.verificationTokenRepository.count({ where: { userId } });
  }
}
