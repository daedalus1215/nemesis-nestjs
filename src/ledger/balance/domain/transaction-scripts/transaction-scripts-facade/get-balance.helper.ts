import { Injectable } from '@nestjs/common';
import { BalanceRepository } from '../../../infrastructure/repositories/balance.repository';
import { Balance } from 'src/shared/shared-entities/entities/balance.entity';

@Injectable()
export class GetBalanceHelper {
  constructor(private readonly balanceRepository: BalanceRepository) {}

  async apply(userId: number): Promise<Balance> {
    let balance = await this.balanceRepository.findByOwnerId(userId);

    if (!balance) {
      balance = this.balanceRepository.create({
        owner: balance.owner,
        amount: 0,
      });
      await this.balanceRepository.save(balance);
    }

    return balance;
  }
}
