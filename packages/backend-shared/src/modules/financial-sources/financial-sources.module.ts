import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialSource } from './financial-source.entity';
import { FinancialSourcesService } from './financial-sources.service';
import { FinancialSourcesController } from './financial-sources.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FinancialSource])],
  controllers: [FinancialSourcesController],
  providers: [FinancialSourcesService],
  exports: [FinancialSourcesService, TypeOrmModule],
})
export class FinancialSourcesModule {}
