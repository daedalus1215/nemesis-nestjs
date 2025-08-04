export type UserAccountDto = {
  id: number;
  name: string;
  accountType: string;
  isDefault: boolean;
  createdAt: Date;
};

export type UserAccountsResponseDto = {
  accounts: UserAccountDto[];
  success: boolean;
};