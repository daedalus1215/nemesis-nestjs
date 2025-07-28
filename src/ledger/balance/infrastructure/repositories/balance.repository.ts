import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Balance } from 'src/shared/shared-entities/entities/balance.entity';
import { BalanceRepositoryPort } from '../../domain/repositories/balance.repository';

export type TransactionWithTypeAndUser = {
  id: string;
  amount: number;
  description: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
  type: 'INCOMING' | 'OUTGOING';
  otherUserId: number;
  otherUsername: string;
};

@Injectable()
export class BalanceRepository implements BalanceRepositoryPort {
  constructor(
    @InjectRepository(Balance)
    private readonly repository: Repository<Balance>,
  ) {}

  async findByOwnerId(ownerId: number): Promise<Balance | null> {
    return this.repository.findOne({
      where: {
        owner: { id: ownerId },
      },
    });
  }

  async save(balance: Balance): Promise<Balance> {
    return this.repository.save(balance);
  }

  async saveMany(balances: Balance[]): Promise<Balance[]> {
    return this.repository.save(balances);
  }

  create(data: DeepPartial<Balance>): Balance {
    return this.repository.create(data);
  }

  async findByOwnerIdWithTransactions(
    ownerId: number,
  ): Promise<TransactionWithTypeAndUser[]> {
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
        END as otherUserId,
        CASE 
          WHEN fb.ownerId = ? THEN tu.username
          ELSE fu.username
        END as otherUsername
      FROM \`transaction\` t
      INNER JOIN balance fb ON t.fromBalanceId = fb.id
      INNER JOIN balance tb ON t.toBalanceId = tb.id
      INNER JOIN user fu ON fb.ownerId = fu.id
      INNER JOIN user tu ON tb.ownerId = tu.id
      WHERE (fb.ownerId = ? OR tb.ownerId = ?)
      ORDER BY t.createdAt DESC
    `;

    return this.repository.query(query, [
      ownerId,
      ownerId,
      ownerId,
      ownerId,
      ownerId,
    ]);
  }

  // Keep a simple method for just getting user's balance
  async getBalanceByOwnerId(ownerId: number): Promise<Balance | null> {
    return this.repository
      .createQueryBuilder('balance')
      .leftJoinAndSelect('balance.owner', 'owner')
      .where('balance.ownerId = :ownerId', { ownerId })
      .getOne();
  }
}
