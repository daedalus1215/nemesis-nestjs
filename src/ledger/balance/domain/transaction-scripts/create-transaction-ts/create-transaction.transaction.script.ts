import { TransactionRepository } from 'src/ledger/balance/infrastructure/repositories/transaction.repository';
import { BalanceRepository } from 'src/ledger/balance/infrastructure/repositories/balance.repository';
import { Balance } from '../../entities/balance.entity';
import { Transaction } from '../../entities/transaction.entity';

export class CreateTransactionTS {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly balanceRepository: BalanceRepository,
  ) {}

  async apply(
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
    const savedTransaction = await this.transactionRepository.save(transaction);

    return savedTransaction;
  }

  async getBalance(userId: number): Promise<Balance> {
    const balance = await this.balanceRepository.findByOwnerId(userId);

    if (!balance) {
      const newBalance = this.balanceRepository.create({
        owner: balance.owner,
        amount: 0,
      });
      await this.balanceRepository.save(newBalance);
      return newBalance;
    } else {
      return balance;
    }
  }
}
