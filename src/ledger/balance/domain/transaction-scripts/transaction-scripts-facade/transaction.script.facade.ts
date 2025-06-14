import { Injectable } from '@nestjs/common';
import { GetBalanceHelper } from './get-balance.helper';
import { Balance } from 'src/shared/shared-entities/entities/balance.entity';

@Injectable()
export class TransactionScriptFacade {
  constructor(private readonly getBalanceHelper: GetBalanceHelper) {}

  async getBalance(userId: number): Promise<Balance> {
    return this.getBalanceHelper.apply(userId);
  }
}
