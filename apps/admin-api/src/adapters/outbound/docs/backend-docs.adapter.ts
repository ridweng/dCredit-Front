import { Injectable } from '@nestjs/common';
import { BackendDocsService } from '@dcredit/backend-shared';
import type { BackendDocsPort } from '../../../application/ports/admin.ports';

@Injectable()
export class BackendDocsAdapter implements BackendDocsPort {
  constructor(private readonly backendDocsService: BackendDocsService) {}

  getDocs(): unknown {
    return this.backendDocsService.getDocs();
  }
}
