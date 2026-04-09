export const ADMIN_SESSION_COOKIE = 'dcredit_admin_session';

/**
 * Activation is inferred from current relational data, not product analytics events.
 * A user is considered "activated" when they are verified, have a financial source,
 * have an account, and have either transaction data or a detected credit.
 */
export const ACTIVATION_STAGE_ORDER = [
  'registered',
  'email_verified',
  'source_connected',
  'account_ready',
  'transaction_ready',
  'credit_ready',
  'activated',
] as const;

export type ActivationStage = (typeof ACTIVATION_STAGE_ORDER)[number];
