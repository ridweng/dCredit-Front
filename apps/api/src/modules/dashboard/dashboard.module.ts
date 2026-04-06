import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../accounts/account.entity';
import { Credit } from '../credits/credit.entity';
import { Transaction } from '../transactions/transaction.entity';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Credit, Transaction])],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
