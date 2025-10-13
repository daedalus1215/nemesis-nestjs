import { Body, Controller, Post } from '@nestjs/common';
import {
  AuthUser,
  GetAuthUser,
} from '../../../../auth/app/decorators/get-auth-user.decorator';
import { LedgerService } from '../../../services/ledger.service';
import { ProtectedAction } from '../../../../shared/application/protected-action-options';
import { TransferBetweenAccountsDto } from '../dtos/requests/transfer-between-accounts.dto';
import { TransferResponseDto } from '../dtos/responses/transfer-response.dto';

@Controller('accounts')
export class TransferBetweenInternalAccountsAction {
  constructor(private readonly ledgerService: LedgerService) {}

  @Post('transfer-internal')
  @ProtectedAction({
    tag: 'Account',
    summary: 'Transfer between internal accounts',
  })
  async handle(
    @Body() transferDto: TransferBetweenAccountsDto,
    @GetAuthUser() user: AuthUser,
  ): Promise<TransferResponseDto> {
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
