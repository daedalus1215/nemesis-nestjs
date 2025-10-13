import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import {
  AuthUser,
  GetAuthUser,
} from '../../../../../auth/app/decorators/get-auth-user.decorator';
import { ProtectedAction } from '../../../../../shared/application/protected-action-options';
import { LedgerService } from '../../../../services/ledger.service';
import { FetchPaymentHistoryRequestDto } from './fetch-account-payment-history.request.dto';
import { AccountTransactionHistoryResponseDto } from './fetch-account-payment-history.response.dto';
import { FetchAccountPaymentHistorySwagger } from './fetch-account-payment-history.swagger';

@Controller('accounts')
export class FetchAccountPaymentHistoryAction {
  constructor(private readonly ledgerService: LedgerService) {}


  @Get(':accountId/payments')
  @ProtectedAction({
    tag: 'Account',
    summary: 'Get account transaction history',
  })
  @FetchAccountPaymentHistorySwagger()
  async handle(
    @Param('accountId', ParseIntPipe) accountId: number,
    @Query() query: FetchPaymentHistoryRequestDto,
    @GetAuthUser() user: AuthUser,
  ): Promise<AccountTransactionHistoryResponseDto> {
    const result = await this.ledgerService.getAccountPaymentHistory(
      accountId,
      user.userId,
      query.limit || 50,
      query.offset || 0,
    );

    return {
     ...result,
      transactions: result.payments,
      success: true,
    };
  }

}
