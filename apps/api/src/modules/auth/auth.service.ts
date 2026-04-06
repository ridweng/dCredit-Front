import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { randomBytes } from 'crypto';
import { EmailService } from '../email/email.service';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { RegisterRequestDto } from './dto/register-request.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { VerificationStatusDto } from './dto/verification-status.dto';

const PASSWORD_HASH_ROUNDS = 10;
const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const RESEND_RESPONSE_MESSAGE =
  'If the account exists and still needs verification, a new email has been sent.';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  async register(body: RegisterRequestDto) {
    const existingUser = await this.usersService.findByEmail(body.email);
    const passwordHash = await hash(body.password, PASSWORD_HASH_ROUNDS);

    if (existingUser) {
      if (existingUser.emailVerified || existingUser.isAdmin) {
        throw new ConflictException('Email is already registered.');
      }

      const reclaimedUser = await this.usersService.reclaimUnverifiedUser(existingUser, {
        email: body.email,
        passwordHash,
        fullName: body.fullName,
        preferredLanguage: body.preferredLanguage,
      });

      const verificationToken = await this.issueVerificationToken(reclaimedUser);
      await this.sendVerificationEmail(reclaimedUser, verificationToken.token);

      return {
        message:
          'An unverified registration already existed for this email. It has been replaced and a new verification email was sent.',
        user: this.usersService.toSafeUser(reclaimedUser),
      };
    }

    const user = await this.usersService.createUser({
      email: body.email,
      passwordHash,
      fullName: body.fullName,
      preferredLanguage: body.preferredLanguage,
    });

    const verificationToken = await this.issueVerificationToken(user);
    await this.sendVerificationEmail(user, verificationToken.token);

    return {
      message: 'Registration successful. Please verify your email before logging in.',
      user: this.usersService.toSafeUser(user),
    };
  }

  async login(body: LoginRequestDto) {
    const user = await this.usersService.findByEmail(body.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const passwordMatches = await compare(body.password, user.passwordHash);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (!user.emailVerified) {
      throw new ForbiddenException('Email verification is required before logging in.');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      isAdmin: user.isAdmin,
    });

    return {
      accessToken,
      user: this.usersService.toSafeUser(user),
    };
  }

  async verifyEmail(body: VerifyEmailDto) {
    return this.verifyEmailToken(body.token);
  }

  async verifyEmailToken(token: string) {
    const verificationToken = await this.usersService.findVerificationTokenWithUser(token);
    const now = new Date();

    if (!verificationToken || verificationToken.usedAt || verificationToken.expiresAt <= now) {
      throw new BadRequestException('Verification token is invalid or has expired.');
    }

    if (verificationToken.user.emailVerified || verificationToken.user.verifiedAt) {
      throw new BadRequestException('Email is already verified.');
    }

    await this.usersService.markVerificationTokenUsed(verificationToken.id, now);
    await this.usersService.invalidateOtherVerificationTokens(
      verificationToken.userId,
      verificationToken.id,
      now,
    );
    const user = await this.usersService.markEmailVerified(verificationToken.userId, now);

    return {
      message: 'Email verified successfully.',
      user: this.usersService.toSafeUser(user),
    };
  }

  async resendVerification(body: ResendVerificationDto) {
    const user = await this.usersService.findByEmail(body.email);

    if (!user || user.emailVerified) {
      return {
        message: RESEND_RESPONSE_MESSAGE,
      };
    }

    await this.usersService.invalidateVerificationTokens(user.id);
    const verificationToken = await this.issueVerificationToken(user);
    await this.sendVerificationEmail(user, verificationToken.token);

    return {
      message: RESEND_RESPONSE_MESSAGE,
    };
  }

  async getVerificationStatus(body: VerificationStatusDto) {
    const user = await this.usersService.findByEmail(body.email);

    return {
      verified: Boolean(user?.emailVerified),
    };
  }

  private async issueVerificationToken(user: User) {
    return this.usersService.createVerificationToken({
      userId: user.id,
      token: randomBytes(32).toString('base64url'),
      expiresAt: new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS),
    });
  }

  private async sendVerificationEmail(user: User, token: string): Promise<void> {
    await this.emailService.sendVerificationEmail({
      to: user.email,
      fullName: user.fullName,
      verificationUrl: this.buildVerificationUrl(token),
    });
  }

  private buildVerificationUrl(token: string): string {
    const baseUrl = this.configService
      .get<string>('app.apiUrl', 'http://localhost:3001')
      .replace(/\/+$/, '');

    return `${baseUrl}/verify-email?token=${encodeURIComponent(token)}`;
  }
}
