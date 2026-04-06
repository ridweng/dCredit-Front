import { Global, Module } from '@nestjs/common';
import { FinancialInsightsService } from './financial-insights.service';

@Global()
@Module({
  providers: [FinancialInsightsService],
  exports: [FinancialInsightsService],
})
export class SharedModule {}
