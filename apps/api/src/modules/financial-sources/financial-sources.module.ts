import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialSource } from './financial-source.entity';
import { FinancialSourcesService } from './financial-sources.service';

@Module({
  imports: [TypeOrmModule.forFeature([FinancialSource])],
  providers: [FinancialSourcesService],
  exports: [FinancialSourcesService, TypeOrmModule],
})
export class FinancialSourcesModule {}
