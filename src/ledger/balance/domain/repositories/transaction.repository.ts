import { Transaction } from '../entities/transaction.entity';

export type TransactionRepositoryPort = {
  save(transaction: Transaction): Promise<Transaction>;
  create(data: Partial<Transaction>): Transaction;
};
