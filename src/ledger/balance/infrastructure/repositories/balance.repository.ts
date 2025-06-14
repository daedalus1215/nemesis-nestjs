import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Balance } from 'src/shared/shared-entities/entities/balance.entity';
import { BalanceRepositoryPort } from '../../domain/repositories/balance.repository';

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

  create(data: Partial<Balance>): Balance {
    return this.repository.create(data);
  }

  async findByOwnerIdWithTransactions(
    ownerId: number,
  ): Promise<Balance | null> {
    return this.repository.findOne({
      where: { owner: { id: ownerId } },
      relations: ['incomingTransactions', 'outgoingTransactions'],
    });
  }
}
