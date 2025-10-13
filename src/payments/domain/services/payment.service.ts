import { Injectable } from '@nestjs/common';
import {
  PaymentAggregator,
  CreatePaymentCommand,
} from '../aggregators/payment.aggregator';
import { Payment, PaymentCategory } from '../entities/payment.entity';
import { AccountAggregator } from '../../../ledger/accounts/domain/aggregators/account.aggregator';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentAggregator: PaymentAggregator,
    private readonly accountAggregator: AccountAggregator,
  ) { }

  async createValidatedPayment(
    data: CreatePaymentCommand,
  ): Promise<Payment> {
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

    const currentBalance = await this.paymentAggregator.getAccountBalance(
      data.debitAccountId,
    );
    if (currentBalance < data.amount) {
      throw new Error(
        `Insufficient funds. Current balance: ${currentBalance}, Required: ${data.amount}`,
      );
    }

    return this.paymentAggregator.completePayment((await this.paymentAggregator.createInitialPayment(data)).id);
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

    return this.paymentAggregator.getAccountBalance(accountId);
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
  ): Promise<Payment> {
    //@TODO: Move to using the nestJS emitter to retrieve this data
    const [fromAccount, toAccount] = await Promise.all([
      this.accountAggregator.getAccountById(fromAccountId, initiatingUserId),
      this.accountAggregator.getAccountByIdWithoutOwnershipCheck(toAccountId),
    ]);

    if (!fromAccount || !toAccount) {
      throw new Error('One or both accounts not found');
    }

    //@TODO: Move to using the nestJS emitter to retrieve this data
    const hasPermission = await this.accountAggregator.verifyAccountOwnership(
      fromAccountId,
      initiatingUserId,
    );

    if (!hasPermission) {
      throw new Error('Unauthorized: You do not own the source account');
    }

    return this.createValidatedPayment({
      debitAccountId: fromAccountId,
      creditAccountId: toAccountId,
      amount,
      description:
        description ||
        `Transfer from account ${fromAccountId} to account ${toAccountId}`,
      category: PaymentCategory.POS,
      initiatingUserId,
      counterpartyUserId: toAccount.ownerId,
    });
  }
}
