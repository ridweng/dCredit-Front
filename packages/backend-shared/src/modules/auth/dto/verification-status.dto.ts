import { IsEmail } from 'class-validator';

export class VerificationStatusDto {
  @IsEmail()
  email!: string;
}
