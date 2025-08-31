import { Injectable } from '@nestjs/common';
import { AccountAggregator } from '../accounts/domain/aggregators/account.aggregator';
import { TransactionAggregator } from '../../transactions/domain/aggregators/transaction.aggregator';
import { AccountType } from '../accounts/constant';

@Injectable()
export class LedgerService {
  constructor(
    private readonly accountAggregator: AccountAggregator,
    private readonly transactionAggregator: TransactionAggregator,
  ) {}

  async transferBetweenExternalAccounts(
    fromAccountId: number,
    toAccountId: number,
    amount: number,
    initiatingUserId: number,
    description?: string,
  ): Promise<{ transactionId: string; success: boolean }> {
    const [fromAccount, toAccount] = await Promise.all([
      this.accountAggregator.getAccountById(fromAccountId, initiatingUserId),
      this.accountAggregator.getAccountByIdWithoutOwnershipCheck(toAccountId),
    ]);

    if (!fromAccount || !toAccount) {
      throw new Error('One or both accounts not found');
    }

    const hasPermission = await this.accountAggregator.verifyAccountOwnership(
      fromAccountId,
      initiatingUserId,
    );
    if (!hasPermission) {
      throw new Error('Unauthorized: You do not own the source account');
    }

    if (fromAccountId === toAccountId) {
      throw new Error('Cannot transfer to the same account');
    }

    const currentBalance =
      await this.transactionAggregator.getAccountBalance(fromAccountId);
    if (currentBalance < amount) {
      throw new Error(
        `Insufficient funds. Current balance: ${currentBalance}, Required: ${amount}`,
      );
    }

    const transaction =
      await this.transactionAggregator.createDoubleEntryTransaction({
        debitAccountId: fromAccountId,
        creditAccountId: toAccountId,
        amount,
        description:
          description ||
          `Transfer from account ${fromAccountId} to ${toAccountId}`,
        category: 'transfer',
        initiatingUserId,
        counterpartyUserId: toAccount.ownerId,
      });

    const completedTransaction =
      await this.transactionAggregator.completeTransaction(transaction.id);

    return {
      transactionId: completedTransaction.id,
      success: true,
    };
  }

  async transferBetweenUsers(
    fromUserId: number,
    toUserId: number,
    amount: number,
    initiatingUserId: number,
    description?: string,
  ): Promise<{
    transactionId: string;
    success: boolean;
    fromAccountId: number;
    toAccountId: number;
  }> {
    // Get the sender's default account (creating one if needed)
    const fromAccount =
      await this.accountAggregator.getDefaultAccountForUser(fromUserId);

    // Get the recipient's default account (creating one if needed)
    const toAccount =
      await this.accountAggregator.getDefaultAccountForUser(toUserId);

    // Call the existing transferBetweenExternalAccounts method
    const result = await this.transferBetweenExternalAccounts(
      fromAccount.id,
      toAccount.id,
      amount,
      initiatingUserId,
      description,
    );

    return {
      ...result,
      fromAccountId: fromAccount.id,
      toAccountId: toAccount.id,
    };
  }

  async transferBetweenInternalAccounts(
    fromAccountId: number,
    toAccountId: number,
    amount: number,
    initiatingUserId: number,
    description?: string,
  ): Promise<{ transactionId: string; success: boolean }> {
    const [fromAccount, toAccount] = await Promise.all([
      this.accountAggregator.getAccountById(fromAccountId, initiatingUserId),
      this.accountAggregator.getAccountById(toAccountId, initiatingUserId),
    ]);

    if (!fromAccount || !toAccount) {
      throw new Error('One or both accounts not found');
    }

    const currentBalance =
      await this.transactionAggregator.getAccountBalance(fromAccountId);
    if (currentBalance < amount) {
      throw new Error(
        `Insufficient funds. Current balance: ${currentBalance}, Required: ${amount}`,
      );
    }

    const transaction =
      await this.transactionAggregator.createDoubleEntryTransaction({
        debitAccountId: fromAccountId,
        creditAccountId: toAccountId,
        amount,
        description:
          description ||
          `Transfer from account ${fromAccountId} to ${toAccountId}`,
        category: 'transfer',
        initiatingUserId,
        counterpartyUserId: toAccount.ownerId,
      });

    const completedTransaction =
      await this.transactionAggregator.completeTransaction(transaction.id);

    return {
      transactionId: completedTransaction.id,
      success: true,
    };
  }

  /**
   * Calculate total balance for a user across all their accounts
   * Direct orchestration
   */
  async getUserTotalBalance(userId: number): Promise<number> {
    const accounts = await this.accountAggregator.getUserAccounts(userId);

    const balances = await Promise.all(
      accounts.map((account) =>
        this.transactionAggregator.getAccountBalance(account.id),
      ),
    );
    const totalBalance = balances.reduce((sum, balance) => sum + balance, 0);

    return totalBalance;
  }

  async createAccountForUser(
    userId: number,
    accountName: string,
    accountType: AccountType = 'ASSET',
  ): Promise<{ accountId: number; isDefault: boolean }> {
    const existingAccounts =
      await this.accountAggregator.getUserAccounts(userId);
    const isFirstAccount = existingAccounts.length === 0;

    const account = await this.accountAggregator.create({
      ownerId: userId,
      name: accountName,
      accountType,
      isDefault: isFirstAccount,
    });

    return {
      accountId: account.id,
      isDefault: isFirstAccount,
    };
  }

  async getAccountTransactionHistory(
    accountId: number,
    userId: number,
    limit: number = 50,
    offset: number = 0,
  ): Promise<{
    transactions: any[];
    currentBalance: number;
    accountInfo: { id: number; name: string; accountType: string };
  }> {
    const account = await this.accountAggregator.getAccountById(
      accountId,
      userId,
    );
    if (!account) {
      throw new Error('Account not found or does not belong to user');
    }

    const transactions =
      await this.transactionAggregator.getAccountTransactions(
        accountId,
        limit,
        offset,
      );

    const currentBalance =
      await this.transactionAggregator.getAccountBalance(accountId);

    return {
      transactions,
      currentBalance,
      accountInfo: {
        id: account.id,
        name: account.name,
        accountType: account.accountType,
      },
    };
  }

  /**
   * Get user's financial summary
   */
  async getUserFinancialSummary(userId: number): Promise<{
    totalBalance: number;
    accountCount: number;
    accounts: Array<{
      id: number;
      name: string;
      accountType: string;
      balance: number;
      isDefault: boolean;
    }>;
    recentTransactions: any[];
  }> {
    const accounts = await this.accountAggregator.getUserAccounts(userId);

    const accountsWithBalances = await Promise.all(
      accounts.map(async (account) => ({
        id: account.id,
        name: account.name,
        accountType: account.accountType,
        balance: await this.transactionAggregator.getAccountBalance(account.id),
        isDefault: account.isDefault,
      })),
    );

    const recentTransactions =
      await this.transactionAggregator.getUserRecentTransactions(userId, 10);

    const totalBalance = accountsWithBalances.reduce(
      (sum, account) => sum + account.balance,
      0,
    );

    return {
      totalBalance,
      accountCount: accounts.length,
      accounts: accountsWithBalances,
      recentTransactions,
    };
  }

  /**
   * Verify system integrity (double-entry bookkeeping check)
   */
  async verifySystemIntegrity(): Promise<{
    isValid: boolean;
    totalDebits: number;
    totalCredits: number;
    message: string;
  }> {
    const integrity = await this.transactionAggregator.verifySystemIntegrity();

    return {
      ...integrity,
      message: integrity.isValid
        ? 'Double-entry bookkeeping integrity verified ✅'
        : 'Double-entry bookkeeping integrity violation detected ⚠️',
    };
  }
}
