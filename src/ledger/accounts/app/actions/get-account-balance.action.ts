import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import {
  AuthUser,
  GetAuthUser,
} from '../../../../auth/app/decorators/get-auth-user.decorator';
import { ProtectedAction } from '../../../../shared/application/protected-action-options';
import { AccountBalanceResponseDto } from '../dtos/responses/account-balance-response.dto';
import { AccountBalanceService } from '../../domain/services/account-balance.service';

@Controller('accounts')
export class GetAccountBalanceAction {
  constructor(private readonly accountBalanceService: AccountBalanceService) {}

  @Get(':accountId/balance')
  @ProtectedAction({
    tag: 'Account',
    summary: 'Get account balance',
  })
  async handle(
    @Param('accountId', ParseIntPipe) accountId: number,
    @GetAuthUser() user: AuthUser,
  ): Promise<AccountBalanceResponseDto> {
    const balance = await this.accountBalanceService.getValidatedAccountBalance(
      accountId,
      user.userId,
    );

    return {
      accountId,
      balance,
      success: true,
    };
  }
}
