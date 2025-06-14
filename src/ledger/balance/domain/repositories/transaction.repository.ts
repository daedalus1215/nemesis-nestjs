import { Transaction } from 'src/shared/shared-entities/entities/transaction.entity';

export type TransactionRepositoryPort = {
  save(transaction: Transaction): Promise<Transaction>;
  create(data: Partial<Transaction>): Transaction;
};
