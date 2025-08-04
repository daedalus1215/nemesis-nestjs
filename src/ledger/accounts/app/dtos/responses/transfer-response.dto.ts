export type TransferResponseDto = {
  transactionId: string;
  fromAccountId: number;
  toAccountId: number;
  amount: number;
  description?: string;
  success: boolean;
};