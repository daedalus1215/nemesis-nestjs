import { Injectable } from '@nestjs/common';
import { Transaction } from 'src/shared/shared-entities/entities/transaction.entity';
import { TransferTS } from '../transaction-scripts/transfer-TS/transfer.transaction.script';
import { GetBalanceTS } from '../transaction-scripts/get-balance-TS/get-balance.transaction.script';
import { Balance } from 'src/shared/shared-entities/entities/balance.entity';
import { GetAllTransactionsForUserTS } from '../transaction-scripts/get-all-transactions-for-user-TS/get-all-transactions-for-user.transaction.script';
import { GetAllTransactionsForUserResponseDto } from '../../app/controllers/get-all-transactions-for-user-action/dtos/responses/get-all-transactions-for-user.dto';
import {
  TransactionRepository,
  TransactionWithType,
} from '../../infrastructure/repositories/transaction.repository';
import { UserAggregator } from 'src/users/domain/user.aggregator';

@Injectable()
export class BalanceService {
  constructor(
    private readonly transferTransactionScript: TransferTS,
    private readonly getBalanceTransactionScript: GetBalanceTS,
    private readonly getAllTransactionsForUserTS: GetAllTransactionsForUserTS,
    private readonly transactionRepository: TransactionRepository,
    private readonly userAggregator: UserAggregator,
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

  async getAllTransactionsForUser(
    userId: number,
  ): Promise<GetAllTransactionsForUserResponseDto[]> {
    return this.getAllTransactionsForUserTS.apply(userId);
  }

  /**
   * We know this is a performance hit to fetch the users from a separate domain like this.
   * But we are paginating the transactions, so it should not be too expensive. We also do not need to filter by user or anything.
   * THis design could allow us to comfortable break user domain out of project and into it's own service.
   *
   *    * @param userId - The ID of the user to get transactions for
   * @param limit - The number of transactions to return
   * @param cursor - The cursor to use for pagination
   * @returns The transactions for the user
   */
  async getTransactionsPaginated(
    userId: number,
    limit?: number,
    cursor?: string,
  ): Promise<TransactionWithType[]> {
    const transactions =
      await this.transactionRepository.getUserTransactionsPaginated(
        userId,
        limit,
        cursor,
      );

    const userIds = [...new Set(transactions.map((t) => t.otherUserId))];

    const users = await this.userAggregator.getUsersByIds(userIds);

    // @TODO: Move this into a converter
    const userMap = new Map(users.map((user) => [user.id, user.username]));

    return transactions.map((transaction) => ({
      ...transaction,
      otherUsername: userMap.get(transaction.otherUserId) || 'Unknown User',
    }));
  }
}
