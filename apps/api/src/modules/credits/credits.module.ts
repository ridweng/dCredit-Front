import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Credit } from './credit.entity';
import { Installment } from './installment.entity';
import { CreditsService } from './credits.service';

@Module({
  imports: [TypeOrmModule.forFeature([Credit, Installment])],
  providers: [CreditsService],
  exports: [CreditsService, TypeOrmModule],
})
export class CreditsModule {}
