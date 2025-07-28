import { Injectable } from '@nestjs/common';
import {
  BalanceRepository,
  TransactionWithTypeAndUser,
} from 'src/ledger/balance/infrastructure/repositories/balance.repository';
import { GetAllTransactionsForUserResponseDto } from 'src/ledger/balance/app/controllers/get-all-transactions-for-user-action/dtos/responses/get-all-transactions-for-user.dto';

export const TransactionType = {
  INCOMING: 'INCOMING',
  OUTGOING: 'OUTGOING',
} as const;

@Injectable()
export class GetAllTransactionsForUserTS {
  constructor(private readonly balanceRepository: BalanceRepository) {}

  async apply(userId: number): Promise<GetAllTransactionsForUserResponseDto[]> {
    const transactions =
      await this.balanceRepository.findByOwnerIdWithTransactions(userId);

    // Convert to DTO format - now we have usernames directly from the query!
    return transactions.map((transaction: TransactionWithTypeAndUser) => ({
      id: transaction.id,
      amount: transaction.amount,
      description: transaction.description,
      status: transaction.status,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
      type: transaction.type,
      fromBalance:
        transaction.type === 'OUTGOING'
          ? undefined
          : {
              owner: {
                id: transaction.otherUserId,
                username: transaction.otherUsername,
              },
            },
      toBalance:
        transaction.type === 'INCOMING'
          ? undefined
          : {
              owner: {
                id: transaction.otherUserId,
                username: transaction.otherUsername,
              },
            },
    }));
  }
}
