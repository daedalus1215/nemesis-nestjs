import { Controller, Get, Query } from '@nestjs/common';
import {
  AuthUser,
  GetAuthUser,
} from 'src/auth/app/decorators/get-auth-user.decorator';
import { BalanceService } from 'src/ledger/balance/domain/services/balance.service';
import { ProtectedAction } from 'src/shared/shared-entities/application/protected-action-options';
import { GetTransactionsPaginatedDto } from '../get-all-transactions-for-user-action/dtos/requests/get-transactions-paginated.dto';

@Controller('balances')
export class GetTransactionsPaginatedAction {
  constructor(private readonly balanceService: BalanceService) {}

  @Get('/transactions/paginated')
  @ProtectedAction({
    tag: 'Balance',
    summary: 'Get paginated transactions for a user',
  })
  async execute(
    @GetAuthUser() user: AuthUser,
    @Query() query: GetTransactionsPaginatedDto,
  ) {
    return this.balanceService.getTransactionsPaginated(
      user.userId,
      query.limit,
      query.cursor,
    );
  }
}
