import { Controller, Get } from '@nestjs/common';
import { AuthUser } from 'src/auth/app/decorators/get-auth-user.decorator';
import { GetAuthUser } from 'src/auth/app/decorators/get-auth-user.decorator';
import { BalanceService } from 'src/ledger/balance/domain/services/balance.service';
import { ProtectedAction } from 'src/shared/shared-entities/application/protected-action-options';
import { GetAllTransactionsForUserResponseDto } from './dtos/responses/get-all-transactions-for-user.dto';

@Controller('balances')
export class GetAllTransactionsForUserAction {
  constructor(private readonly balanceService: BalanceService) {}

  @Get('/transactions/for-user')
  @ProtectedAction({
    tag: 'Balance',
    summary: 'Get all transactions for a user',
  })
  async execute(
    @GetAuthUser() user: AuthUser,
  ): Promise<GetAllTransactionsForUserResponseDto[]> {
    return this.balanceService.getAllTransactionsForUser(user.userId);
  }
}
