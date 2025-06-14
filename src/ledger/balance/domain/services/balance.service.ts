import { Injectable } from '@nestjs/common';
import { Transaction } from 'src/shared/shared-entities/entities/transaction.entity';
import { TransferTS } from '../transaction-scripts/transfer-TS/transfer.transaction.script';
import { GetBalanceTS } from '../transaction-scripts/get-balance-TS/get-balance.transaction.script';
import { Balance } from 'src/shared/shared-entities/entities/balance.entity';
import { GetAllTransactionsForUserTS } from '../transaction-scripts/get-all-transactions-for-user-TS/get-all-transactions-for-user.transaction.script';

@Injectable()
export class BalanceService {
  constructor(
    private readonly transferTransactionScript: TransferTS,
    private readonly getBalanceTransactionScript: GetBalanceTS,
    private readonly getAllTransactionsForUserTS: GetAllTransactionsForUserTS,
  ) {}

  async transfer(
    fromUserId: number,
    toUserId: number,
    amount: number,
    description?: string,
  ): Promise<Transaction> {
    return this.transferTransactionScript.apply(
      fromUserId,
      toUserId,
      amount,
      description,
    );
  }

  async getBalanceByUserId(userId: number): Promise<Balance> {
    return this.getBalanceTransactionScript.apply(userId);
  }

  async getAllTransactionsForUser(userId: number): Promise<Transaction[]> {
    return this.getAllTransactionsForUserTS.apply(userId);
  }
}
