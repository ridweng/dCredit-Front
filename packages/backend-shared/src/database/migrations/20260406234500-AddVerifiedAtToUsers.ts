import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVerifiedAtToUsers20260406234500 implements MigrationInterface {
  name = 'AddVerifiedAtToUsers20260406234500';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "verifiedAt" TIMESTAMPTZ NULL',
    );

    await queryRunner.query(`
      UPDATE "users" AS "user"
      SET "verifiedAt" = verification."latestUsedAt"
      FROM (
        SELECT "userId", MAX("usedAt") AS "latestUsedAt"
        FROM "verification_tokens"
        WHERE "usedAt" IS NOT NULL
        GROUP BY "userId"
      ) AS verification
      WHERE "user"."id" = verification."userId"
        AND "user"."verifiedAt" IS NULL
    `);

    await queryRunner.query(`
      UPDATE "users"
      SET "verifiedAt" = COALESCE("verifiedAt", "updatedAt", "createdAt")
      WHERE "emailVerified" = true
        AND "verifiedAt" IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "users" DROP COLUMN IF EXISTS "verifiedAt"',
    );
  }
}
