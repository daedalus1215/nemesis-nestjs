import { TransactionType } from 'src/ledger/balance/domain/transaction-scripts/get-all-transactions-for-user-TS/get-all-transactions-for-user.transaction.script';

type UserInfo = {
  id: number;
  username: string;
};

export type GetAllTransactionsForUserResponseDto = {
  id: string;
  amount: number;
  description: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
  type: (typeof TransactionType)[keyof typeof TransactionType];
  fromBalance?: { owner: UserInfo };
  toBalance?: { owner: UserInfo };
};
