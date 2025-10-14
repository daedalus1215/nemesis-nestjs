export type TransferBetweenExternalAccountsResponseDto = {
  transactionId: string;
  fromAccountId: number;
  toAccountId: number;
  amount: number;
  description?: string;
  success: boolean;
};