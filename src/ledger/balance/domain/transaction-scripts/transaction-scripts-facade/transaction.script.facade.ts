import { Injectable } from '@nestjs/common';
import { GetBalanceOrCreateZeroBalanceHelper } from './get-balance-or-create-zero-balance.helper';
import { Balance } from 'src/shared/shared-entities/entities/balance.entity';

@Injectable()
export class TransactionScriptFacade {
  constructor(
    private readonly getBalanceHelper: GetBalanceOrCreateZeroBalanceHelper,
  ) {}

  async getBalance(userId: number): Promise<Balance> {
    return this.getBalanceHelper.apply(userId);
  }
}
