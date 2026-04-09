import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User, UserJourneyService } from '@dcredit/backend-shared';
import type {
  AdminUserDetail,
  AdminUserSummary,
  LatestVerification,
} from '../../../domain/models/admin.models';
import type { AdminUsersReadPort } from '../../../application/ports/admin.ports';

@Injectable()
export class SharedAdminUsersReadAdapter implements AdminUsersReadPort {
  constructor(
    private readonly userJourneyService: UserJourneyService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  listUsers(): Promise<AdminUserSummary[]> {
    return this.userJourneyService.listUsers() as Promise<AdminUserSummary[]>;
  }

  getUserDetail(userId: string): Promise<AdminUserDetail> {
    return this.userJourneyService.getUserDetail(userId) as Promise<AdminUserDetail>;
  }

  async getLatestVerifications(limit: number): Promise<LatestVerification[]> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.verifiedAt IS NOT NULL')
      .orderBy('user.verifiedAt', 'DESC')
      .take(limit)
      .getMany();

    return users.map((user) => ({
      id: user.id,
      verifiedAt: user.verifiedAt as Date,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
    }));
  }
}
