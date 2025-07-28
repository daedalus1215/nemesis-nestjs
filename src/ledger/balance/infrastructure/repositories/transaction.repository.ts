import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from 'src/shared/shared-entities/entities/transaction.entity';
import { TransactionRepositoryPort } from '../../domain/repositories/transaction.repository';

export type TransactionWithType = Transaction & {
  type: 'INCOMING' | 'OUTGOING';
  otherUserId: number;
  otherUsername?: string; // Optional since we add this in the service layer
};

@Injectable()
export class TransactionRepository implements TransactionRepositoryPort {
  constructor(
    @InjectRepository(Transaction)
    private readonly repository: Repository<Transaction>,
  ) {}

  create(transaction: Partial<Transaction>): Transaction {
    return this.repository.create(transaction);
  }

  async save(transaction: Transaction): Promise<Transaction> {
    return this.repository.save(transaction);
  }

  async getUserTransactionsPaginated(
    userId: number,
    limit: number = 20,
    cursor?: string,
  ): Promise<TransactionWithType[]> {
    const query = `
      SELECT 
        t.id,
        t.amount,
        t.description,
        t.status,
        t.createdAt,
        t.updatedAt,
        CASE 
          WHEN fb.ownerId = ? THEN 'OUTGOING'
          ELSE 'INCOMING'
        END as type,
        CASE 
          WHEN fb.ownerId = ? THEN tb.ownerId
          ELSE fb.ownerId
        END as otherUserId
      FROM \`transaction\` t
      INNER JOIN balance fb ON t.fromBalanceId = fb.id
      INNER JOIN balance tb ON t.toBalanceId = tb.id
      WHERE (fb.ownerId = ? OR tb.ownerId = ?)
      ${cursor ? 'AND t.createdAt < (SELECT createdAt FROM \`transaction\` WHERE id = ?)' : ''}
      ORDER BY t.createdAt DESC
      LIMIT ?
    `;

    const params = cursor
      ? [userId, userId, userId, userId, cursor, limit]
      : [userId, userId, userId, userId, limit];

    return this.repository.query(query, params);
  }
}
