import { Balance } from 'src/shared/shared-entities/entities/balance.entity';

export type BalanceRepositoryPort = {
  findByOwnerId(owner: number): Promise<Balance | null>;
  save(balance: Balance): Promise<Balance>;
  saveMany(balances: Balance[]): Promise<Balance[]>;
  create(data: Partial<Balance>): Balance;
};
