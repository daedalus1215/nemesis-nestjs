import { Injectable } from '@nestjs/common';
import { Transaction } from 'src/shared/shared-entities/entities/transaction.entity';
import { TransferTS } from '../transaction-scripts/transfer-TS/transfer.transaction.script';
import { GetBalanceTS } from '../transaction-scripts/get-balance-TS/get-balance.transaction.script';
import { Balance } from 'src/shared/shared-entities/entities/balance.entity';

@Injectable()
export class BalanceService {
  constructor(
    private readonly transferTransactionScript: TransferTS,
    private readonly getBalanceTransactionScript: GetBalanceTS,
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

  async getBalance(userId: number): Promise<Balance> {
    return this.getBalanceTransactionScript.apply(userId);
  }
}
