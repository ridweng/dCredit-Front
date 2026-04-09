import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import type {
  AccessTokenPayload,
  AccessTokenPort,
  ClockPort,
  PasswordHasherPort,
} from '../../../application/ports/auth.ports';

const PASSWORD_HASH_ROUNDS = 10;

@Injectable()
export class BcryptPasswordHasherAdapter implements PasswordHasherPort {
  compare(plainText: string, passwordHash: string): Promise<boolean> {
    return compare(plainText, passwordHash);
  }

  hash(password: string): Promise<string> {
    return hash(password, PASSWORD_HASH_ROUNDS);
  }
}

@Injectable()
export class JwtAccessTokenAdapter implements AccessTokenPort {
  constructor(private readonly jwtService: JwtService) {}

  signAccessToken(payload: AccessTokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}

@Injectable()
export class SystemClockAdapter implements ClockPort {
  now(): Date {
    return new Date();
  }
}
