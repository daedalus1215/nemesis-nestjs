import { Controller, Get } from '@nestjs/common';
import { AuthUser } from 'src/auth/app/decorators/get-auth-user.decorator';
import { GetAuthUser } from 'src/auth/app/decorators/get-auth-user.decorator';
import { BalanceService } from 'src/ledger/balance/domain/services/balance.service';
import { Transaction } from 'src/shared/shared-entities/entities/transaction.entity';

@Controller('balances')
export class GetAllTransactionsForUserAction {
  constructor(private readonly balanceService: BalanceService) {}

  @Get('/transactions/for-user')
  async execute(@GetAuthUser() user: AuthUser): Promise<Transaction[]> {
    return this.balanceService.getAllTransactionsForUser(user.userId);
  }
}
