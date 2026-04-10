import type { SafeUser } from '@dcredit/types';

export interface ClientSession {
  token: string;
  user: SafeUser;
}
