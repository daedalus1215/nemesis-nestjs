import { Injectable } from '@nestjs/common';
import { AccountAggregator } from '../aggregators/account.aggregator';
import { TransactionAggregator } from '../../../../transactions/domain/aggregators/transaction.aggregator';

@Injectable()
export class AccountBalanceService {
  constructor(
    private readonly accountAggregator: AccountAggregator,
    private readonly transactionAggregator: TransactionAggregator,
  ) {}

  /**
   * Get validated account balance with ownership check
   * This service orchestrates between the Account and Transaction domains
   */
  async getValidatedAccountBalance(
    accountId: number,
    userId: number,
  ): Promise<number> {
    // 1. Validate account ownership using AccountAggregator
    const account = await this.accountAggregator.getAccountById(accountId, userId);
    if (!account) {
      throw new Error(
        `Account ${accountId} not found or does not belong to user`,
      );
    }

    // 2. Get balance from TransactionAggregator
    return this.transactionAggregator.getAccountBalance(accountId);
  }
}
