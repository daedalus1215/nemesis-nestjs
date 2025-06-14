import { Injectable } from '@nestjs/common';
import { Transaction } from 'src/shared/shared-entities/entities/transaction.entity';
import { BalanceRepository } from 'src/ledger/balance/infrastructure/repositories/balance.repository';

@Injectable()
export class GetAllTransactionsForUserTS {
  constructor(private readonly balanceRepository: BalanceRepository) {}

  async apply(userId: number): Promise<Transaction[]> {
    const balance =
      await this.balanceRepository.findByOwnerIdWithTransactions(userId);

    if (!balance) return [];

    return [
      ...(balance.incomingTransactions || []),
      ...(balance.outgoingTransactions || []),
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}
