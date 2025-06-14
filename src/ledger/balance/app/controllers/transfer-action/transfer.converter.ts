import { Injectable } from '@nestjs/common';
import { Transaction } from 'src/shared/shared-entities/entities/transaction.entity';

export type TransferResponse = {
  fromBalanceId: string;
  toBalanceId: string;
  id: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
};

@Injectable()
export class TransferConverter {
  toResponse(transaction: Transaction): TransferResponse {
    return {
      fromBalanceId: transaction.fromBalance.id,
      toBalanceId: transaction.toBalance.id,
      id: transaction.id,
      amount: transaction.amount,
      status: transaction.status,
    };
  }
}
