import type {
  AdminUserDetail,
  AdminUserSummary,
  LatestVerification,
} from '../../domain/models/admin.models';

export interface AdminUsersReadPort {
  listUsers(): Promise<AdminUserSummary[]>;
  getUserDetail(userId: string): Promise<AdminUserDetail>;
  getLatestVerifications(limit: number): Promise<LatestVerification[]>;
}

export interface SchemaReferencePort {
  getSchemaReference(): Promise<unknown>;
}

export interface BackendDocsPort {
  getDocs(): unknown;
}
