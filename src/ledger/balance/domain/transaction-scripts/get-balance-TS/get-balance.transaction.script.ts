import { Injectable } from '@nestjs/common';
import { TransactionScriptFacade } from '../transaction-scripts-facade/transaction.script.facade';
import { Balance } from 'src/shared/shared-entities/entities/balance.entity';

@Injectable()
export class GetBalanceTS {
  constructor(private readonly facade: TransactionScriptFacade) {}

  async apply(userId: number): Promise<Balance> {
    return this.facade.getBalance(userId);
  }
}