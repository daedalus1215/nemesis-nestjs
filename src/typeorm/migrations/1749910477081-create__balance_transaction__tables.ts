import { MigrationInterface, QueryRunner } from 'typeorm';

export class Create_balanceTransaction_tables1749910477081
  implements MigrationInterface
{
  name = 'Create_balanceTransaction_tables1749910477081';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "balance" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "amount" decimal(20,8) NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "ownerId" integer NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" varchar PRIMARY KEY NOT NULL, "amount" decimal(20,8) NOT NULL, "description" varchar, "status" varchar(20) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "fromBalanceId" integer NOT NULL, "toBalanceId" integer NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_balance" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "amount" decimal(20,8) NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "ownerId" integer NOT NULL, CONSTRAINT "FK_37baee3c8cd8372a5909ff99d02" FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_balance"("id", "amount", "createdAt", "updatedAt", "ownerId") SELECT "id", "amount", "createdAt", "updatedAt", "ownerId" FROM "balance"`,
    );
    await queryRunner.query(`DROP TABLE "balance"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_balance" RENAME TO "balance"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_transaction" ("id" varchar PRIMARY KEY NOT NULL, "amount" decimal(20,8) NOT NULL, "description" varchar, "status" varchar(20) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "fromBalanceId" integer NOT NULL, "toBalanceId" integer NOT NULL, CONSTRAINT "FK_792883df0c85c8338c6776bcbf7" FOREIGN KEY ("fromBalanceId") REFERENCES "balance" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_f75fa7bf9087f261fe972928a60" FOREIGN KEY ("toBalanceId") REFERENCES "balance" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_transaction"("id", "amount", "description", "status", "createdAt", "updatedAt", "fromBalanceId", "toBalanceId") SELECT "id", "amount", "description", "status", "createdAt", "updatedAt", "fromBalanceId", "toBalanceId" FROM "transaction"`,
    );
    await queryRunner.query(`DROP TABLE "transaction"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_transaction" RENAME TO "transaction"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" RENAME TO "temporary_transaction"`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" varchar PRIMARY KEY NOT NULL, "amount" decimal(20,8) NOT NULL, "description" varchar, "status" varchar(20) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "fromBalanceId" integer NOT NULL, "toBalanceId" integer NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "transaction"("id", "amount", "description", "status", "createdAt", "updatedAt", "fromBalanceId", "toBalanceId") SELECT "id", "amount", "description", "status", "createdAt", "updatedAt", "fromBalanceId", "toBalanceId" FROM "temporary_transaction"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_transaction"`);
    await queryRunner.query(
      `ALTER TABLE "balance" RENAME TO "temporary_balance"`,
    );
    await queryRunner.query(
      `CREATE TABLE "balance" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "amount" decimal(20,8) NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "ownerId" integer NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "balance"("id", "amount", "createdAt", "updatedAt", "ownerId") SELECT "id", "amount", "createdAt", "updatedAt", "ownerId" FROM "temporary_balance"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_balance"`);
    await queryRunner.query(`DROP TABLE "transaction"`);
    await queryRunner.query(`DROP TABLE "balance"`);
  }
}
