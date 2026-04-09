export const APP_API_TOKENS = {
  authUsersPort: Symbol('APP_API_AUTH_USERS_PORT'),
  passwordHasherPort: Symbol('APP_API_PASSWORD_HASHER_PORT'),
  accessTokenPort: Symbol('APP_API_ACCESS_TOKEN_PORT'),
  verificationMailerPort: Symbol('APP_API_VERIFICATION_MAILER_PORT'),
  clockPort: Symbol('APP_API_CLOCK_PORT'),
  dashboardReadPort: Symbol('APP_API_DASHBOARD_READ_PORT'),
  creditsReadPort: Symbol('APP_API_CREDITS_READ_PORT'),
  financialSourcesPort: Symbol('APP_API_FINANCIAL_SOURCES_PORT'),
} as const;
