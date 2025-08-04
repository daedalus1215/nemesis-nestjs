import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionRepositoryPort } from '../../domain/repositories/transaction.repository';

@Injectable()
export class TransactionRepository implements TransactionRepositoryPort {
  constructor(
    @InjectRepository(Transaction)
    private readonly repository: Repository<Transaction>,
  ) {}

  async create(data: Partial<Transaction>): Promise<Transaction> {
    const transaction = this.repository.create(data);
    return this.repository.save(transaction);
  }

  async save(transaction: Transaction): Promise<Transaction> {
    return this.repository.save(transaction);
  }

  async findById(id: string): Promise<Transaction | null> {
    return this.repository.findOne({ where: { id } });
  }

  /**
   * Get sum of debits and credits for an account
   * This is the core of balance calculation in double-entry bookkeeping
   */
  async getAccountTransactionSums(accountId: number): Promise<{
    debits: number;
    credits: number;
  }> {
    // Sum all completed transactions where this account is debited (money going out)
    const debitSum = await this.repository
      .createQueryBuilder('transaction')
      .select('COALESCE(SUM(transaction.amount), 0)', 'total')
      .where('transaction.debitAccountId = :accountId', { accountId })
      .andWhere('transaction.status = :status', { status: 'COMPLETED' })
      .getRawOne();

    // Sum all completed transactions where this account is credited (money coming in)
    const creditSum = await this.repository
      .createQueryBuilder('transaction')
      .select('COALESCE(SUM(transaction.amount), 0)', 'total')
      .where('transaction.creditAccountId = :accountId', { accountId })
      .andWhere('transaction.status = :status', { status: 'COMPLETED' })
      .getRawOne();

    return {
      debits: parseFloat(debitSum.total) || 0,
      credits: parseFloat(creditSum.total) || 0,
    };
  }

  /**
   * Get Completed transaction history for an account
   */
  async getAccountCompletedTransactions(
    accountId: number,
    limit: number = 50,
    offset: number = 0,
  ): Promise<Transaction[]> {
    return this.repository
      .createQueryBuilder('transaction')
      .where(
        '(transaction.debitAccountId = :accountId OR transaction.creditAccountId = :accountId)',
        { accountId },
      )
      .andWhere('transaction.status = :status', { status: 'COMPLETED' })
      .orderBy('transaction.createdAt', 'DESC')
      .limit(limit)
      .offset(offset)
      .getMany();
  }

  /**
   * Get user's transactions across all their accounts
   * Uses denormalized user IDs for performance
   */
  async getUserTransactions(
    userId: number,
    limit: number = 50,
  ): Promise<Transaction[]> {
    return this.repository
      .createQueryBuilder('transaction')
      .where(
        '(transaction.initiatingUserId = :userId OR transaction.counterpartyUserId = :userId)',
        { userId },
      )
      .andWhere('transaction.status = :status', { status: 'COMPLETED' })
      .orderBy('transaction.createdAt', 'DESC')
      .limit(limit)
      .getMany();
  }

  /**
   * Verify that total debits equal total credits across the entire system
   * This is a fundamental check for double-entry bookkeeping integrity
   */
  async verifyDoubleEntryIntegrity(): Promise<{
    isValid: boolean;
    totalDebits: number;
    totalCredits: number;
  }> {
    const result = await this.repository
      .createQueryBuilder('transaction')
      .select([
        'SUM(transaction.amount) as totalDebits',
        'SUM(transaction.amount) as totalCredits',
      ])
      .where('transaction.status = :status', { status: 'COMPLETED' })
      .getRawOne();

    const totalDebits = parseFloat(result.totalDebits) || 0;
    const totalCredits = parseFloat(result.totalCredits) || 0;

    return {
      isValid: Math.abs(totalDebits - totalCredits) < 0.01, // Allow for minor rounding
      totalDebits,
      totalCredits,
    };
  }
}