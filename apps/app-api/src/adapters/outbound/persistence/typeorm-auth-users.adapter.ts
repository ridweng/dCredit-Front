import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import {
  PreferredLanguage,
  User,
  VerificationToken,
} from '@dcredit/backend-shared';
import type {
  AuthUserRecord,
  AuthUsersPort,
  CreateAuthUserInput,
  CreateVerificationTokenInput,
  VerificationTokenRecord,
} from '../../../application/ports/auth.ports';

@Injectable()
export class TypeOrmAuthUsersAdapter implements AuthUsersPort {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(VerificationToken)
    private readonly verificationTokenRepository: Repository<VerificationToken>,
  ) {}

  async findById(id: string): Promise<AuthUserRecord | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    return user ? this.toAuthUserRecord(user) : null;
  }

  async findByEmail(email: string): Promise<AuthUserRecord | null> {
    const user = await this.userRepository.findOne({
      where: { email: this.normalizeEmail(email) },
    });

    return user ? this.toAuthUserRecord(user) : null;
  }

  async createUser(input: CreateAuthUserInput): Promise<AuthUserRecord> {
    const user = this.userRepository.create({
      email: this.normalizeEmail(input.email),
      passwordHash: input.passwordHash,
      fullName: input.fullName.trim(),
      emailVerified: false,
      verifiedAt: null,
      isAdmin: input.isAdmin ?? false,
      preferredLanguage: input.preferredLanguage as PreferredLanguage,
    });

    return this.toAuthUserRecord(await this.userRepository.save(user));
  }

  async reclaimUnverifiedUser(
    existingUser: AuthUserRecord,
    input: CreateAuthUserInput,
  ): Promise<AuthUserRecord> {
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
        preferredLanguage: input.preferredLanguage as PreferredLanguage,
      });

      return this.toAuthUserRecord(await manager.getRepository(User).save(replacementUser));
    });
  }

  async createVerificationToken(
    input: CreateVerificationTokenInput,
  ): Promise<VerificationTokenRecord> {
    const verificationToken = this.verificationTokenRepository.create({
      userId: input.userId,
      token: input.token,
      expiresAt: input.expiresAt,
      usedAt: null,
    });

    return this.toVerificationTokenRecord(
      await this.verificationTokenRepository.save(verificationToken),
    );
  }

  async findVerificationTokenWithUser(token: string): Promise<VerificationTokenRecord | null> {
    const verificationToken = await this.verificationTokenRepository.findOne({
      where: { token },
      relations: { user: true },
    });

    return verificationToken ? this.toVerificationTokenRecord(verificationToken) : null;
  }

  async invalidateVerificationTokens(userId: string): Promise<void> {
    await this.verificationTokenRepository.update(
      { userId, usedAt: IsNull() },
      { usedAt: new Date() },
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

  async markEmailVerified(userId: string, verifiedAt: Date): Promise<AuthUserRecord> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error(`Unable to load verified user ${userId}`);
    }

    if (!user.emailVerified) {
      user.emailVerified = true;
    }

    if (!user.verifiedAt) {
      user.verifiedAt = verifiedAt;
    }

    return this.toAuthUserRecord(await this.userRepository.save(user));
  }

  async updatePreferredLanguage(
    userId: string,
    preferredLanguage: string,
  ): Promise<AuthUserRecord> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error(`Unable to load user ${userId}`);
    }

    user.preferredLanguage = preferredLanguage as PreferredLanguage;
    return this.toAuthUserRecord(await this.userRepository.save(user));
  }

  private toAuthUserRecord(user: User): AuthUserRecord {
    return {
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      fullName: user.fullName,
      emailVerified: user.emailVerified,
      verifiedAt: user.verifiedAt,
      isAdmin: user.isAdmin,
      preferredLanguage: user.preferredLanguage,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private toVerificationTokenRecord(token: VerificationToken): VerificationTokenRecord {
    return {
      id: token.id,
      userId: token.userId,
      token: token.token,
      expiresAt: token.expiresAt,
      usedAt: token.usedAt,
      user: token.user ? this.toAuthUserRecord(token.user) : undefined,
    };
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}
