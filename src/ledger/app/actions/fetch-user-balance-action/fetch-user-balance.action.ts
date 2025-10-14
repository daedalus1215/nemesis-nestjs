import { Controller, Get } from '@nestjs/common';
import {
  AuthUser,
  GetAuthUser,
} from '../../../../auth/app/decorators/get-auth-user.decorator';
import { ProtectedAction } from '../../../../shared/application/protected-action-options';
import { LedgerService } from '../../../services/ledger.service';
import { FetchUserBalanceResponseDto } from './fetch-user-balance.response.dto';
import { FetchUserBalanceSwagger } from './fetch-user-balance.swagger';

@Controller('accounts')
export class FetchUserBalanceAction {
  constructor(private readonly ledgerService: LedgerService) {}

  @Get('balance')
  @ProtectedAction({
    tag: 'Account',
    summary: 'Get user balance',
  })
  @FetchUserBalanceSwagger()
  async handle(@GetAuthUser() user: AuthUser): Promise<FetchUserBalanceResponseDto> {
    const totalBalance = await this.ledgerService.getUserTotalBalance(
      user.userId,
    );

    return {
      totalBalance,
      userId: user.userId,
      success: true,
    };
  }
}