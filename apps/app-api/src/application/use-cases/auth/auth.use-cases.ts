import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ResendVerificationResponse,
  VerificationStatusResponse,
  VerifyEmailResponse,
} from '@dcredit/types';
import { randomBytes } from 'crypto';
import { APP_API_TOKENS } from '../../ports/app-api.tokens';
import {
  type AccessTokenPort,
  type AuthUsersPort,
  type ClockPort,
  type PasswordHasherPort,
  type VerificationMailerPort,
  toSafeUser,
} from '../../ports/auth.ports';
import { AuthPolicyService } from '../../../domain/services/auth-policy.service';

const RESEND_RESPONSE_MESSAGE =
  'If the account exists and still needs verification, a new email has been sent.';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(APP_API_TOKENS.authUsersPort)
    private readonly authUsersPort: AuthUsersPort,
    @Inject(APP_API_TOKENS.passwordHasherPort)
    private readonly passwordHasherPort: PasswordHasherPort,
    @Inject(APP_API_TOKENS.verificationMailerPort)
    private readonly verificationMailerPort: VerificationMailerPort,
    @Inject(APP_API_TOKENS.clockPort)
    private readonly clockPort: ClockPort,
    private readonly authPolicyService: AuthPolicyService,
  ) {}

  async execute(command: RegisterRequest): Promise<RegisterResponse> {
    const existingUser = await this.authUsersPort.findByEmail(command.email);
    const passwordHash = await this.passwordHasherPort.hash(command.password);

    if (existingUser) {
      if (!this.authPolicyService.canReclaimExistingRegistration(existingUser)) {
        throw new ConflictException('Email is already registered.');
      }

      const reclaimedUser = await this.authUsersPort.reclaimUnverifiedUser(existingUser, {
        email: command.email,
        passwordHash,
        fullName: command.fullName,
        preferredLanguage: command.preferredLanguage,
      });

      const verificationToken = await this.issueVerificationToken(reclaimedUser.id);
      await this.verificationMailerPort.sendVerificationEmail({
        to: reclaimedUser.email,
        fullName: reclaimedUser.fullName,
        token: verificationToken.token,
      });

      return {
        message:
          'An unverified registration already existed for this email. It has been replaced and a new verification email was sent.',
        user: toSafeUser(reclaimedUser),
      };
    }

    const user = await this.authUsersPort.createUser({
      email: command.email,
      passwordHash,
      fullName: command.fullName,
      preferredLanguage: command.preferredLanguage,
    });

    const verificationToken = await this.issueVerificationToken(user.id);
    await this.verificationMailerPort.sendVerificationEmail({
      to: user.email,
      fullName: user.fullName,
      token: verificationToken.token,
    });

    return {
      message: 'Registration successful. Please verify your email before logging in.',
      user: toSafeUser(user),
    };
  }

  private issueVerificationToken(userId: string) {
    const now = this.clockPort.now();

    return this.authUsersPort.createVerificationToken({
      userId,
      token: randomBytes(32).toString('base64url'),
      expiresAt: this.authPolicyService.buildVerificationExpiry(now),
    });
  }
}

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(APP_API_TOKENS.authUsersPort)
    private readonly authUsersPort: AuthUsersPort,
    @Inject(APP_API_TOKENS.passwordHasherPort)
    private readonly passwordHasherPort: PasswordHasherPort,
    @Inject(APP_API_TOKENS.accessTokenPort)
    private readonly accessTokenPort: AccessTokenPort,
  ) {}

  async execute(command: LoginRequest): Promise<LoginResponse> {
    const user = await this.authUsersPort.findByEmail(command.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const passwordMatches = await this.passwordHasherPort.compare(
      command.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (!user.emailVerified) {
      throw new ForbiddenException('Email verification is required before logging in.');
    }

    return {
      accessToken: await this.accessTokenPort.signAccessToken({
        sub: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
        isAdmin: user.isAdmin,
      }),
      user: toSafeUser(user),
    };
  }
}

@Injectable()
export class VerifyEmailUseCase {
  constructor(
    @Inject(APP_API_TOKENS.authUsersPort)
    private readonly authUsersPort: AuthUsersPort,
    @Inject(APP_API_TOKENS.clockPort)
    private readonly clockPort: ClockPort,
    private readonly authPolicyService: AuthPolicyService,
  ) {}

  async execute(token: string): Promise<VerifyEmailResponse> {
    const verificationToken = await this.authUsersPort.findVerificationTokenWithUser(token);
    const now = this.clockPort.now();

    if (!this.authPolicyService.isVerificationTokenUsable(verificationToken, now)) {
      throw new BadRequestException('Verification token is invalid or has expired.');
    }

    if (!verificationToken?.user) {
      throw new BadRequestException('Verification token is invalid or has expired.');
    }

    if (verificationToken.user.emailVerified || verificationToken.user.verifiedAt) {
      throw new BadRequestException('Email is already verified.');
    }

    await this.authUsersPort.markVerificationTokenUsed(verificationToken.id, now);
    await this.authUsersPort.invalidateOtherVerificationTokens(
      verificationToken.userId,
      verificationToken.id,
      now,
    );
    const user = await this.authUsersPort.markEmailVerified(verificationToken.userId, now);

    return {
      message: 'Email verified successfully.',
      user: toSafeUser(user),
    };
  }
}

@Injectable()
export class ResendVerificationUseCase {
  constructor(
    @Inject(APP_API_TOKENS.authUsersPort)
    private readonly authUsersPort: AuthUsersPort,
    @Inject(APP_API_TOKENS.verificationMailerPort)
    private readonly verificationMailerPort: VerificationMailerPort,
    @Inject(APP_API_TOKENS.clockPort)
    private readonly clockPort: ClockPort,
    private readonly authPolicyService: AuthPolicyService,
  ) {}

  async execute(email: string): Promise<ResendVerificationResponse> {
    const user = await this.authUsersPort.findByEmail(email);

    if (!user || user.emailVerified) {
      return { message: RESEND_RESPONSE_MESSAGE };
    }

    await this.authUsersPort.invalidateVerificationTokens(user.id);
    const verificationToken = await this.authUsersPort.createVerificationToken({
      userId: user.id,
      token: randomBytes(32).toString('base64url'),
      expiresAt: this.authPolicyService.buildVerificationExpiry(this.clockPort.now()),
    });

    await this.verificationMailerPort.sendVerificationEmail({
      to: user.email,
      fullName: user.fullName,
      token: verificationToken.token,
    });

    return { message: RESEND_RESPONSE_MESSAGE };
  }
}

@Injectable()
export class GetVerificationStatusUseCase {
  constructor(
    @Inject(APP_API_TOKENS.authUsersPort)
    private readonly authUsersPort: AuthUsersPort,
  ) {}

  async execute(email: string): Promise<VerificationStatusResponse> {
    const user = await this.authUsersPort.findByEmail(email);
    return { verified: Boolean(user?.emailVerified) };
  }
}
