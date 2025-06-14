import { Injectable } from '@nestjs/common';
import { BalanceRepository } from '../../infrastructure/repositories/balance.repository';
import { Balance } from 'src/shared/shared-entities/entities/balance.entity';

@Injectable()
export class BalanceAggregator {
  constructor(private readonly balanceRepository: BalanceRepository) {}

  async createNewBalance(userId: number): Promise<Balance> {
    return await this.balanceRepository.create({
      owner: {
        id: userId,
      },
      amount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
