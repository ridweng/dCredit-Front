import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerificationToken } from '../users/verification-token.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(VerificationToken)
    private readonly verificationTokenRepository: Repository<VerificationToken>,
  ) {}

  findVerificationToken(token: string): Promise<VerificationToken | null> {
    return this.verificationTokenRepository.findOne({ where: { token } });
  }
}
