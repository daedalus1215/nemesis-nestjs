import { Body, Controller, Post } from '@nestjs/common';
import { LedgerService } from 'src/ledger/services/ledger.service';
import { ProtectedAction } from 'src/shared/application/protected-action-options';
import { TransferBetweenExternalAccountsResponseDto } from '../transfer-between-external-accounts-action/transfer-between-external-accounts.response.dto';
import { TransferBetweenExternalAccountsRequestDto } from '../transfer-between-external-accounts-action/transfer-between-external-accounts.request.dto';
import { AuthUser, GetAuthUser } from 'src/auth/app/decorators/get-auth-user.decorator';

@Controller('accounts')
export class TransferBetweenInternalAccountsAction {
  constructor(private readonly ledgerService: LedgerService) { }

  @Post('transfer-internal')
  @ProtectedAction({
    tag: 'Account',
    summary: 'Transfer between internal accounts',
  })
  async handle(
    @Body() transferDto: TransferBetweenExternalAccountsRequestDto,
    @GetAuthUser() user: AuthUser,
  ): Promise<TransferBetweenExternalAccountsResponseDto> {
    const result = await this.ledgerService.transferBetweenInternalAccounts(
      transferDto.fromAccountId,
      transferDto.toAccountId,
      transferDto.amount,
      user.userId,
      transferDto.description,
    );

    return {
      transactionId: result.paymentId,
      fromAccountId: transferDto.fromAccountId,
      toAccountId: transferDto.toAccountId,
      amount: transferDto.amount,
      description: transferDto.description,
      success: result.success,
    };
  }
}
