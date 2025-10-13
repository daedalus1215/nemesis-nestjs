
export type FetchUserAccountsResponseDto = {
  accounts: UserAccountDto[];
  success: boolean;
};

type UserAccountDto = {
  id: number;
  name: string;
  accountType: string;
  isDefault: boolean;
  createdAt: Date;
};


