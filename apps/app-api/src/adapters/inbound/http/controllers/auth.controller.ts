import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  GetVerificationStatusUseCase,
  LoginUserUseCase,
  RegisterUserUseCase,
  ResendVerificationUseCase,
  VerifyEmailUseCase,
} from '../../../../application/use-cases/auth/auth.use-cases';
import {
  LoginRequestDto,
  RegisterRequestDto,
  ResendVerificationDto,
  VerificationStatusDto,
  VerifyEmailDto,
} from '../dtos/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
    private readonly resendVerificationUseCase: ResendVerificationUseCase,
    private readonly getVerificationStatusUseCase: GetVerificationStatusUseCase,
  ) {}

  @Post('register')
  register(@Body() body: RegisterRequestDto) {
    return this.registerUserUseCase.execute(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() body: LoginRequestDto) {
    return this.loginUserUseCase.execute(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify-email')
  verifyEmail(@Body() body: VerifyEmailDto) {
    return this.verifyEmailUseCase.execute(body.token);
  }

  @HttpCode(HttpStatus.OK)
  @Post('resend-verification')
  resendVerification(@Body() body: ResendVerificationDto) {
    return this.resendVerificationUseCase.execute(body.email);
  }

  @HttpCode(HttpStatus.OK)
  @Post('verification-status')
  getVerificationStatus(@Body() body: VerificationStatusDto) {
    return this.getVerificationStatusUseCase.execute(body.email);
  }
}
