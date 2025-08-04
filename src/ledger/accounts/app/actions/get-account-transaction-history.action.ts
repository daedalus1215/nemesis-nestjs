import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import {
  AuthUser,
  GetAuthUser,
} from '../../../../auth/app/decorators/get-auth-user.decorator';
import { ProtectedAction } from '../../../../shared/shared-entities/application/protected-action-options';
import { LedgerService } from '../../../services/ledger.service';
import { GetTransactionHistoryQueryDto } from '../dtos/requests/get-transaction-history-query.dto';
import { AccountTransactionHistoryResponseDto } from '../dtos/responses/account-transaction-history-response.dto';

@Controller('accounts')
export class GetAccountTransactionHistoryAction {
  constructor(private readonly ledgerService: LedgerService) {}

  @Get(':accountId/transactions')
  @ProtectedAction({
    tag: 'Account',
    summary: 'Get account transaction history',
  })
  async handle(
    @Param('accountId', ParseIntPipe) accountId: number,
    @Query() query: GetTransactionHistoryQueryDto,
    @GetAuthUser() user: AuthUser,
  ): Promise<AccountTransactionHistoryResponseDto> {
    const result = await this.ledgerService.getAccountTransactionHistory(
      accountId,
      user.userId,
      query.limit || 50,
      query.offset || 0,
    );

    return {
      ...result,
      success: true,
    };
  }
}