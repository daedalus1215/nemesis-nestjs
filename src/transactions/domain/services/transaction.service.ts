import { Injectable } from '@nestjs/common';
import {
  TransactionAggregator,
  CreateTransactionData,
} from '../aggregators/transaction.aggregator';
import { Transaction } from '../entities/transaction.entity';
import { AccountAggregator } from '../../../ledger/accounts/domain/aggregators/account.aggregator';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionAggregator: TransactionAggregator,
    private readonly accountAggregator: AccountAggregator, // ✅ Service can use external aggregators
  ) {}

  /**
   * Create a validated double-entry transaction
   * This service adds cross-context validation that the aggregator cannot do
   */
  async createValidatedTransaction(
    data: CreateTransactionData,
  ): Promise<Transaction> {
    // 1. Validate both accounts exist (cross-context validation)
    const [debitAccount, creditAccount] = await Promise.all([
      this.accountAggregator.getAccountByIdWithoutOwnershipCheck(
        data.debitAccountId,
      ),
      this.accountAggregator.getAccountByIdWithoutOwnershipCheck(
        data.creditAccountId,
      ),
    ]);

    if (!debitAccount) {
      throw new Error(`Debit account ${data.debitAccountId} not found`);
    }

    if (!creditAccount) {
      throw new Error(`Credit account ${data.creditAccountId} not found`);
    }

    const currentBalance = await this.transactionAggregator.getAccountBalance(
      data.debitAccountId,
    );
    if (currentBalance < data.amount) {
      throw new Error(
        `Insufficient funds. Current balance: ${currentBalance}, Required: ${data.amount}`,
      );
    }

    // 3. Create the transaction (delegation to aggregator)
    const transaction =
      await this.transactionAggregator.createDoubleEntryTransaction(data);

    // 4. Complete the transaction immediately (for simple transfers)
    return this.transactionAggregator.completeTransaction(transaction.id);
  }

  async getValidatedAccountBalance(
    accountId: number,
    userId: number,
  ): Promise<number> {
    const account = await this.accountAggregator.getAccountById(
      accountId,
      userId,
    );
    if (!account) {
      throw new Error(
        `Account ${accountId} not found or does not belong to user`,
      );
    }

    return this.transactionAggregator.getAccountBalance(accountId);
  }

  /**
   * Transfer between accounts with full validation
   */
  async transferBetweenAccounts(
    fromAccountId: number,
    toAccountId: number,
    amount: number,
    initiatingUserId: number,
    description?: string,
  ): Promise<Transaction> {
    // Get account details for additional validation
    const [fromAccount, toAccount] = await Promise.all([
      this.accountAggregator.getAccountById(fromAccountId, initiatingUserId),
      this.accountAggregator.getAccountByIdWithoutOwnershipCheck(toAccountId),
    ]);

    if (!fromAccount || !toAccount) {
      throw new Error('One or both accounts not found');
    }

    // Verify ownership of source account
    const hasPermission = await this.accountAggregator.verifyAccountOwnership(
      fromAccountId,
      initiatingUserId,
    );

    if (!hasPermission) {
      throw new Error('Unauthorized: You do not own the source account');
    }

    // Create the validated transaction
    return this.createValidatedTransaction({
      debitAccountId: fromAccountId,
      creditAccountId: toAccountId,
      amount,
      description:
        description ||
        `Transfer from account ${fromAccountId} to account ${toAccountId}`,
      category: 'transfer',
      initiatingUserId,
      counterpartyUserId: toAccount.ownerId,
    });
  }
}
