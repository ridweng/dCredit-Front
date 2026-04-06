import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema20260406193000 implements MigrationInterface {
  name = 'InitialSchema20260406193000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

    await queryRunner.query(
      `CREATE TYPE "preferred_language_enum" AS ENUM ('en', 'es')`,
    );
    await queryRunner.query(
      `CREATE TYPE "provider_type_enum" AS ENUM ('bank_api', 'manual', 'csv', 'open_banking')`,
    );
    await queryRunner.query(
      `CREATE TYPE "financial_source_status_enum" AS ENUM ('pending', 'active', 'error', 'disconnected')`,
    );
    await queryRunner.query(
      `CREATE TYPE "account_type_enum" AS ENUM ('checking', 'savings', 'credit_card', 'loan', 'investment', 'wallet')`,
    );
    await queryRunner.query(
      `CREATE TYPE "category_type_enum" AS ENUM ('income', 'expense', 'transfer', 'credit_payment')`,
    );
    await queryRunner.query(
      `CREATE TYPE "credit_type_enum" AS ENUM ('credit_card', 'personal_loan', 'auto_loan', 'student_loan', 'mortgage', 'other')`,
    );
    await queryRunner.query(
      `CREATE TYPE "installment_status_enum" AS ENUM ('pending', 'paid', 'overdue', 'deferred')`,
    );
    await queryRunner.query(
      `CREATE TYPE "transaction_type_enum" AS ENUM ('income', 'expense', 'transfer', 'payment')`,
    );

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "email" varchar(255) NOT NULL,
        "passwordHash" varchar(255) NOT NULL,
        "fullName" varchar(255) NOT NULL,
        "emailVerified" boolean NOT NULL DEFAULT false,
        "preferredLanguage" "preferred_language_enum" NOT NULL DEFAULT 'en',
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "verification_tokens" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "userId" uuid NOT NULL,
        "token" varchar(255) NOT NULL,
        "expiresAt" TIMESTAMPTZ NOT NULL,
        "usedAt" TIMESTAMPTZ NULL,
        CONSTRAINT "PK_verification_tokens_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_verification_tokens_token" UNIQUE ("token"),
        CONSTRAINT "FK_verification_tokens_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "financial_sources" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "userId" uuid NOT NULL,
        "providerName" varchar(150) NOT NULL,
        "providerType" "provider_type_enum" NOT NULL,
        "status" "financial_source_status_enum" NOT NULL DEFAULT 'pending',
        "credentialReference" varchar(255) NOT NULL,
        CONSTRAINT "PK_financial_sources_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_financial_sources_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "accounts" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "userId" uuid NOT NULL,
        "financialSourceId" uuid NOT NULL,
        "accountName" varchar(255) NOT NULL,
        "accountType" "account_type_enum" NOT NULL,
        "currency" varchar(3) NOT NULL,
        "currentBalance" numeric(14,2) NOT NULL,
        "availableBalance" numeric(14,2) NULL,
        CONSTRAINT "PK_accounts_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_accounts_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_accounts_financial_source" FOREIGN KEY ("financialSourceId") REFERENCES "financial_sources"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "categories" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "key" varchar(100) NOT NULL,
        "name" varchar(150) NOT NULL,
        "type" "category_type_enum" NOT NULL,
        CONSTRAINT "PK_categories_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_categories_key" UNIQUE ("key")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "credits" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "userId" uuid NOT NULL,
        "financialSourceId" uuid NOT NULL,
        "name" varchar(255) NOT NULL,
        "creditType" "credit_type_enum" NOT NULL,
        "originalAmount" numeric(14,2) NOT NULL,
        "outstandingBalance" numeric(14,2) NOT NULL,
        "interestRate" numeric(5,2) NOT NULL,
        "monthlyPayment" numeric(14,2) NOT NULL,
        "nextPaymentDate" date NOT NULL,
        "deferredPaymentDate" date NULL,
        "totalInstallments" integer NULL,
        "remainingInstallments" integer NULL,
        CONSTRAINT "PK_credits_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_credits_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_credits_financial_source" FOREIGN KEY ("financialSourceId") REFERENCES "financial_sources"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "installments" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "creditId" uuid NOT NULL,
        "installmentNumber" integer NOT NULL,
        "dueDate" date NOT NULL,
        "amount" numeric(14,2) NOT NULL,
        "principalPortion" numeric(14,2) NULL,
        "interestPortion" numeric(14,2) NULL,
        "status" "installment_status_enum" NOT NULL DEFAULT 'pending',
        CONSTRAINT "PK_installments_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_installments_credit" FOREIGN KEY ("creditId") REFERENCES "credits"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "transactions" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "userId" uuid NOT NULL,
        "accountId" uuid NOT NULL,
        "creditId" uuid NULL,
        "categoryId" uuid NULL,
        "date" TIMESTAMPTZ NOT NULL,
        "description" varchar(255) NOT NULL,
        "amount" numeric(14,2) NOT NULL,
        "type" "transaction_type_enum" NOT NULL,
        "merchant" varchar(255) NULL,
        CONSTRAINT "PK_transactions_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_transactions_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_transactions_account" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_transactions_credit" FOREIGN KEY ("creditId") REFERENCES "credits"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_transactions_category" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_financial_sources_user_provider" ON "financial_sources" ("userId", "providerName", "providerType")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_accounts_user_financial_source_name" ON "accounts" ("userId", "financialSourceId", "accountName")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_credits_user_financial_source_name" ON "credits" ("userId", "financialSourceId", "name")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_installments_credit_installment_number" ON "installments" ("creditId", "installmentNumber")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_transactions_user_date" ON "transactions" ("userId", "date")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_transactions_account_date" ON "transactions" ("accountId", "date")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_transactions_account_date"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_transactions_user_date"`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "UQ_installments_credit_installment_number"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_credits_user_financial_source_name"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_accounts_user_financial_source_name"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_financial_sources_user_provider"`,
    );

    await queryRunner.query(`DROP TABLE IF EXISTS "transactions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "installments"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "credits"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "categories"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "accounts"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "financial_sources"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "verification_tokens"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);

    await queryRunner.query(`DROP TYPE IF EXISTS "transaction_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "installment_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "credit_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "category_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "account_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "financial_source_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "provider_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "preferred_language_enum"`);
  }
}
