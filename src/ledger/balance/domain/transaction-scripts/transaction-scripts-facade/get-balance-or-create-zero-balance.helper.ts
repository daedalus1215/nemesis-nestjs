import { Injectable } from '@nestjs/common';
import { BalanceRepository } from '../../../infrastructure/repositories/balance.repository';
import { Balance } from 'src/shared/shared-entities/entities/balance.entity';

@Injectable()
export class GetBalanceOrCreateZeroBalanceHelper {
  constructor(private readonly balanceRepository: BalanceRepository) {}

  async apply(userId: number): Promise<Balance> {
    const balance = await this.balanceRepository.findByOwnerId(userId);

    if (balance) {
      return balance;
    }

    await this.balanceRepository.save(
      await this.balanceRepository.create({
        owner: {
          id: userId,
        },
        amount: 0,
      }),
    );
  }
}
