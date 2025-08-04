import { Transaction } from '../entities/transaction.entity';

export type TransactionRepositoryPort = {
  create(data: Partial<Transaction>): Promise<Transaction>;
  save(transaction: Transaction): Promise<Transaction>;
  findById(id: string): Promise<Transaction | null>;
  getAccountTransactionSums(accountId: number): Promise<{ debits: number; credits: number }>;
  getAccountCompletedTransactions(accountId: number, limit?: number, offset?: number): Promise<Transaction[]>;
  getUserTransactions(userId: number, limit?: number): Promise<Transaction[]>;
  verifyDoubleEntryIntegrity(): Promise<{ isValid: boolean; totalDebits: number; totalCredits: number }>;
};