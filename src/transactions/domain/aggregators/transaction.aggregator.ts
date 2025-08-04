import { Injectable } from '@nestjs/common';
import { Transaction } from '../entities/transaction.entity';
import { TransactionRepository } from '../../infra/repositories/transaction.repository';

export type CreateTransactionData = {
  debitAccountId: number;
  creditAccountId: number;
  amount: number;
  description?: string;
  category?: string;
  initiatingUserId?: number;
  counterpartyUserId?: number;
};

@Injectable()
export class TransactionAggregator {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    // ✅ NO other aggregators - keeps this aggregator pure
  ) {}

  /**
   * Create a double-entry transaction
   */
  async createDoubleEntryTransaction(
    data: CreateTransactionData,
  ): Promise<Transaction> {
    // Validate business rules within this context
    if (data.debitAccountId === data.creditAccountId) {
      throw new Error('Cannot transfer to the same account');
    }

    if (data.amount <= 0) {
      throw new Error('Transaction amount must be positive');
    }

    return this.transactionRepository.create({
      debitAccountId: data.debitAccountId,
      creditAccountId: data.creditAccountId,
      amount: data.amount,
      description: data.description || 'Transfer',
      category: data.category || 'transfer',
      status: 'PENDING',
      initiatingUserId: data.initiatingUserId,
      counterpartyUserId: data.counterpartyUserId,
    });
  }

  async getAccountBalance(accountId: number): Promise<number> {
    const { credits, debits } =
      await this.transactionRepository.getAccountTransactionSums(accountId);

    return credits - debits;
  }

  /**
   * Get transaction history for an account
   */
  async getAccountTransactions(
    accountId: number,
    limit: number = 50,
    offset: number = 0,
  ): Promise<Transaction[]> {
    return this.transactionRepository.getAccountCompletedTransactions(
      accountId,
      limit,
      offset,
    );
  }

  /**
   * Get recent transactions for a user across all their accounts
   */
  async getUserRecentTransactions(
    userId: number,
    limit: number = 10,
  ): Promise<Transaction[]> {
    return this.transactionRepository.getUserTransactions(userId, limit);
  }

  /**
   * Complete a pending transaction
   */
  async completeTransaction(transactionId: string): Promise<Transaction> {
    const transaction =
      await this.transactionRepository.findById(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.status !== 'PENDING') {
      throw new Error(
        `Cannot complete transaction with status: ${transaction.status}`,
      );
    }

    transaction.status = 'COMPLETED';
    transaction.updatedAt = new Date();

    return this.transactionRepository.save(transaction);
  }

  /**
   * Get transaction by ID
   */
  async getById(transactionId: string): Promise<Transaction | null> {
    return this.transactionRepository.findById(transactionId);
  }

  /**
   * Verify double-entry integrity for the entire system
   */
  async verifySystemIntegrity(): Promise<{
    isValid: boolean;
    totalDebits: number;
    totalCredits: number;
  }> {
    return this.transactionRepository.verifyDoubleEntryIntegrity();
  }
}
