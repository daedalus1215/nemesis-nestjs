import { MigrationInterface, QueryRunner } from 'typeorm';

export class Test1749864384486 implements MigrationInterface {
  name = 'Test1749864384486';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "balance" ("id" varchar PRIMARY KEY NOT NULL, "amount" decimal(20,8) NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "ownerId" integer NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" varchar PRIMARY KEY NOT NULL, "amount" decimal(20,8) NOT NULL, "description" varchar, "status" varchar(20) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "fromBalanceId" varchar NOT NULL, "toBalanceId" varchar NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE TABLE "invoice" ("id" varchar PRIMARY KEY NOT NULL, "amount" decimal(20,8) NOT NULL, "currency" varchar(3) NOT NULL, "description" varchar, "status" varchar(20) NOT NULL, "rejectionReason" varchar, "dueDate" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "issuerId" integer NOT NULL, "recipientId" integer NOT NULL, "fromBalanceId" varchar NOT NULL, "toBalanceId" varchar NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_balance" ("id" varchar PRIMARY KEY NOT NULL, "amount" decimal(20,8) NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "ownerId" integer NOT NULL, CONSTRAINT "FK_37baee3c8cd8372a5909ff99d02" FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_balance"("id", "amount", "createdAt", "updatedAt", "ownerId") SELECT "id", "amount", "createdAt", "updatedAt", "ownerId" FROM "balance"`,
    );
    await queryRunner.query(`DROP TABLE "balance"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_balance" RENAME TO "balance"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_transaction" ("id" varchar PRIMARY KEY NOT NULL, "amount" decimal(20,8) NOT NULL, "description" varchar, "status" varchar(20) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "fromBalanceId" varchar NOT NULL, "toBalanceId" varchar NOT NULL, CONSTRAINT "FK_792883df0c85c8338c6776bcbf7" FOREIGN KEY ("fromBalanceId") REFERENCES "balance" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_f75fa7bf9087f261fe972928a60" FOREIGN KEY ("toBalanceId") REFERENCES "balance" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_transaction"("id", "amount", "description", "status", "createdAt", "updatedAt", "fromBalanceId", "toBalanceId") SELECT "id", "amount", "description", "status", "createdAt", "updatedAt", "fromBalanceId", "toBalanceId" FROM "transaction"`,
    );
    await queryRunner.query(`DROP TABLE "transaction"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_transaction" RENAME TO "transaction"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_invoice" ("id" varchar PRIMARY KEY NOT NULL, "amount" decimal(20,8) NOT NULL, "currency" varchar(3) NOT NULL, "description" varchar, "status" varchar(20) NOT NULL, "rejectionReason" varchar, "dueDate" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "issuerId" integer NOT NULL, "recipientId" integer NOT NULL, "fromBalanceId" varchar NOT NULL, "toBalanceId" varchar NOT NULL, CONSTRAINT "FK_098e2b1653b00e9cfd9af43703e" FOREIGN KEY ("issuerId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_d2ed2157b656774df5dae689ecc" FOREIGN KEY ("recipientId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_64767ae4262aabfaecbc004ac31" FOREIGN KEY ("fromBalanceId") REFERENCES "balance" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_4b231f8f0dbcaa5fd48094b868e" FOREIGN KEY ("toBalanceId") REFERENCES "balance" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_invoice"("id", "amount", "currency", "description", "status", "rejectionReason", "dueDate", "createdAt", "updatedAt", "issuerId", "recipientId", "fromBalanceId", "toBalanceId") SELECT "id", "amount", "currency", "description", "status", "rejectionReason", "dueDate", "createdAt", "updatedAt", "issuerId", "recipientId", "fromBalanceId", "toBalanceId" FROM "invoice"`,
    );
    await queryRunner.query(`DROP TABLE "invoice"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_invoice" RENAME TO "invoice"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoice" RENAME TO "temporary_invoice"`,
    );
    await queryRunner.query(
      `CREATE TABLE "invoice" ("id" varchar PRIMARY KEY NOT NULL, "amount" decimal(20,8) NOT NULL, "currency" varchar(3) NOT NULL, "description" varchar, "status" varchar(20) NOT NULL, "rejectionReason" varchar, "dueDate" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "issuerId" integer NOT NULL, "recipientId" integer NOT NULL, "fromBalanceId" varchar NOT NULL, "toBalanceId" varchar NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "invoice"("id", "amount", "currency", "description", "status", "rejectionReason", "dueDate", "createdAt", "updatedAt", "issuerId", "recipientId", "fromBalanceId", "toBalanceId") SELECT "id", "amount", "currency", "description", "status", "rejectionReason", "dueDate", "createdAt", "updatedAt", "issuerId", "recipientId", "fromBalanceId", "toBalanceId" FROM "temporary_invoice"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_invoice"`);
    await queryRunner.query(
      `ALTER TABLE "transaction" RENAME TO "temporary_transaction"`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" varchar PRIMARY KEY NOT NULL, "amount" decimal(20,8) NOT NULL, "description" varchar, "status" varchar(20) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "fromBalanceId" varchar NOT NULL, "toBalanceId" varchar NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "transaction"("id", "amount", "description", "status", "createdAt", "updatedAt", "fromBalanceId", "toBalanceId") SELECT "id", "amount", "description", "status", "createdAt", "updatedAt", "fromBalanceId", "toBalanceId" FROM "temporary_transaction"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_transaction"`);
    await queryRunner.query(
      `ALTER TABLE "balance" RENAME TO "temporary_balance"`,
    );
    await queryRunner.query(
      `CREATE TABLE "balance" ("id" varchar PRIMARY KEY NOT NULL, "amount" decimal(20,8) NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "ownerId" integer NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "balance"("id", "amount", "createdAt", "updatedAt", "ownerId") SELECT "id", "amount", "createdAt", "updatedAt", "ownerId" FROM "temporary_balance"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_balance"`);
    await queryRunner.query(`DROP TABLE "invoice"`);
    await queryRunner.query(`DROP TABLE "transaction"`);
    await queryRunner.query(`DROP TABLE "balance"`);
  }
}
