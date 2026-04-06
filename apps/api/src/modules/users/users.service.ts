import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { PreferredLanguage } from '../../common/enums/preferred-language.enum';
import { User } from './user.entity';
import { SafeUserDto } from './dto/safe-user.dto';
import { VerificationToken } from './verification-token.entity';

interface CreateUserInput {
  email: string;
  passwordHash: string;
  fullName: string;
  preferredLanguage: PreferredLanguage;
  isAdmin?: boolean;
}

interface CreateVerificationTokenInput {
  userId: string;
  token: string;
  expiresAt: Date;
}

interface UpdateCurrentUserInput {
  preferredLanguage?: PreferredLanguage;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(VerificationToken)
    private readonly verificationTokenRepository: Repository<VerificationToken>,
  ) {}

  findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email: this.normalizeEmail(email) } });
  }

  async createUser(input: CreateUserInput): Promise<User> {
    const user = this.userRepository.create({
      email: this.normalizeEmail(input.email),
      passwordHash: input.passwordHash,
      fullName: input.fullName.trim(),
      emailVerified: false,
      verifiedAt: null,
      isAdmin: input.isAdmin ?? false,
      preferredLanguage: input.preferredLanguage,
    });

    return this.userRepository.save(user);
  }

  async reclaimUnverifiedUser(
    existingUser: User,
    input: CreateUserInput,
  ): Promise<User> {
    return this.userRepository.manager.transaction(async (manager) => {
      await manager.getRepository(VerificationToken).delete({ userId: existingUser.id });
      await manager.getRepository(User).delete(existingUser.id);

      const replacementUser = manager.getRepository(User).create({
        email: this.normalizeEmail(input.email),
        passwordHash: input.passwordHash,
        fullName: input.fullName.trim(),
        emailVerified: false,
        verifiedAt: null,
        isAdmin: input.isAdmin ?? false,
        preferredLanguage: input.preferredLanguage,
      });

      return manager.getRepository(User).save(replacementUser);
    });
  }

  async createVerificationToken(
    input: CreateVerificationTokenInput,
  ): Promise<VerificationToken> {
    const verificationToken = this.verificationTokenRepository.create({
      userId: input.userId,
      token: input.token,
      expiresAt: input.expiresAt,
      usedAt: null,
    });

    return this.verificationTokenRepository.save(verificationToken);
  }

  findVerificationTokenWithUser(token: string): Promise<VerificationToken | null> {
    return this.verificationTokenRepository.findOne({
      where: { token },
      relations: { user: true },
    });
  }

  async invalidateVerificationTokens(userId: string): Promise<void> {
    await this.verificationTokenRepository.update(
      {
        userId,
        usedAt: IsNull(),
      },
      {
        usedAt: new Date(),
      },
    );
  }

  async invalidateOtherVerificationTokens(
    userId: string,
    excludeTokenId: string,
    usedAt: Date,
  ): Promise<void> {
    await this.verificationTokenRepository
      .createQueryBuilder()
      .update(VerificationToken)
      .set({ usedAt })
      .where('"userId" = :userId', { userId })
      .andWhere('id != :excludeTokenId', { excludeTokenId })
      .andWhere('"usedAt" IS NULL')
      .execute();
  }

  async markVerificationTokenUsed(tokenId: string, usedAt: Date): Promise<void> {
    await this.verificationTokenRepository.update(tokenId, { usedAt });
  }

  async markEmailVerified(userId: string, verifiedAt: Date): Promise<User> {
    const user = await this.findById(userId);

    if (!user) {
      throw new Error(`Unable to load verified user ${userId}`);
    }

    if (!user.emailVerified) {
      user.emailVerified = true;
    }

    if (!user.verifiedAt) {
      user.verifiedAt = verifiedAt;
    }

    return this.userRepository.save(user);
  }

  async updateCurrentUser(userId: string, input: UpdateCurrentUserInput): Promise<User> {
    const user = await this.findById(userId);

    if (!user) {
      throw new Error(`Unable to load user ${userId}`);
    }

    if (input.preferredLanguage !== undefined) {
      user.preferredLanguage = input.preferredLanguage;
    }

    return this.userRepository.save(user);
  }

  countVerificationTokensForUser(userId: string): Promise<number> {
    return this.verificationTokenRepository.count({ where: { userId } });
  }

  toSafeUser(user: User): SafeUserDto {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      emailVerified: user.emailVerified,
      isAdmin: user.isAdmin,
      preferredLanguage: user.preferredLanguage,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}
