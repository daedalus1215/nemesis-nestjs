import { Controller, Get } from '@nestjs/common';
import {
  AuthUser,
  GetAuthUser,
} from '../../../../auth/app/decorators/get-auth-user.decorator';
import { ProtectedAction } from '../../../../shared/shared-entities/application/protected-action-options';
import { LedgerService } from '../../../services/ledger.service';
import { UserBalanceResponseDto } from '../dtos/responses/user-balance-response.dto';

@Controller('accounts')
export class GetUserBalanceAction {
  constructor(private readonly ledgerService: LedgerService) {}

  @Get('balance')
  @ProtectedAction({
    tag: 'Account',
    summary: 'Get user balance',
  })
  async handle(@GetAuthUser() user: AuthUser): Promise<UserBalanceResponseDto> {
    const totalBalance = await this.ledgerService.getUserTotalBalance(user.userId);

    return {
      totalBalance,
      userId: user.userId,
      success: true,
    };
  }
}