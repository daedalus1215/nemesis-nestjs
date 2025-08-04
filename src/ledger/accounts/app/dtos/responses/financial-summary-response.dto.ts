export type AccountSummaryDto = {
  id: number;
  name: string;
  accountType: string;
  balance: number;
  isDefault: boolean;
};

export type FinancialSummaryResponseDto = {
  totalBalance: number;
  accountCount: number;
  accounts: AccountSummaryDto[];
  recentTransactions: any[];
  success: boolean;
};