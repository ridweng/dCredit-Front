import { Module } from '@nestjs/common';
import { AdminModule } from './modules/admin/admin.module';
import { buildBackendRootImports } from './root-imports';

@Module({
  imports: [...buildBackendRootImports(), AdminModule],
})
export class AdminApiModule {}
