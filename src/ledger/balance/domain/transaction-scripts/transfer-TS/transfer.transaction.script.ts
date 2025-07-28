import { Transaction } from 'src/shared/shared-entities/entities/transaction.entity';
import { Injectable } from '@nestjs/common';
import { BalanceRepository } from '../../../infrastructure/repositories/balance.repository';
import { TransactionRepository } from '../../../infrastructure/repositories/transaction.repository';
import { TransactionScriptFacade } from '../transaction-scripts-facade/transaction.script.facade';

@Injectable()
export class TransferTS {
  constructor(
    private readonly balanceRepository: BalanceRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly facade: TransactionScriptFacade,
  ) {}

  async apply(
    fromUserId: number,
    toUserId: number,
    amount: number,
    description?: string,
  ): Promise<Transaction> {
    const fromBalance = await this.facade.getBalance(fromUserId);
    const toBalance = await this.facade.getBalance(toUserId);

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

    fromBalance.amount -= amount;
    toBalance.amount += amount;

    await this.balanceRepository.saveMany([fromBalance, toBalance]);

    transaction.status = 'COMPLETED';
    await this.transactionRepository.save(transaction);

    return transaction;
  }
}
