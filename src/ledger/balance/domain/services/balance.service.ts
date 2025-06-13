import { Inject, Injectable } from '@nestjs/common';
import { Balance } from '../entities/balance.entity';
import { Transaction } from '../entities/transaction.entity';
import { BalanceRepositoryPort } from '../repositories/balance.repository';
import { TransactionRepositoryPort } from '../repositories/transaction.repository';

@Injectable()
export class BalanceService {
  constructor(
    @Inject('BalanceRepositoryPort')
    private readonly balanceRepository: BalanceRepositoryPort,
    @Inject('TransactionRepositoryPort')
    private readonly transactionRepository: TransactionRepositoryPort,
  ) {}

  async getBalance(userId: number): Promise<Balance> {
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

  async transfer(
    fromUserId: number,
    toUserId: number,
    amount: number,
    description?: string,
  ): Promise<Transaction> {
    const fromBalance = await this.getBalance(fromUserId);
    const toBalance = await this.getBalance(toUserId);

    if (fromBalance.amount < amount) {
      throw new Error('Insufficient balance');
    }

    const transaction = this.transactionRepository.create({
      fromBalance,
      toBalance,
      amount,
      description,
      status: 'PENDING',
    });

    await this.transactionRepository.save(transaction);

    // Update balances
    fromBalance.amount -= amount;
    toBalance.amount += amount;

    await this.balanceRepository.saveMany([fromBalance, toBalance]);

    transaction.status = 'COMPLETED';
    await this.transactionRepository.save(transaction);

    return transaction;
  }
}
