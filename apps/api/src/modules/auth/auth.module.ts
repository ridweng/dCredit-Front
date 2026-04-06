import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationToken } from '../users/verification-token.entity';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([VerificationToken]), UsersModule, EmailModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
