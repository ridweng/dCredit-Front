import { Injectable } from '@nestjs/common';
import { SchemaDocumentationService } from '@dcredit/backend-shared';
import type { SchemaReferencePort } from '../../../application/ports/admin.ports';

@Injectable()
export class SchemaReferenceAdapter implements SchemaReferencePort {
  constructor(private readonly schemaDocumentationService: SchemaDocumentationService) {}

  getSchemaReference(): Promise<unknown> {
    return this.schemaDocumentationService.getSchemaReference();
  }
}
