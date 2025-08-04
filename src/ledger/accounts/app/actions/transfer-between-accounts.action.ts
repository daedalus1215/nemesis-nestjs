import { Body, Controller, Post } from '@nestjs/common';
import {
  AuthUser,
  GetAuthUser,
} from '../../../../auth/app/decorators/get-auth-user.decorator';
import { LedgerService } from '../../../services/ledger.service';
import { ProtectedAction } from '../../../../shared/shared-entities/application/protected-action-options';
import { TransferBetweenAccountsDto } from '../dtos/requests/transfer-between-accounts.dto';
import { TransferResponseDto } from '../dtos/responses/transfer-response.dto';

@Controller('accounts')
export class TransferBetweenAccountsAction {
  constructor(private readonly ledgerService: LedgerService) {}

  @Post('transfer')
  @ProtectedAction({
    tag: 'Account',
    summary: 'Transfer between accounts',
  })
  async handle(
    @Body() transferDto: TransferBetweenAccountsDto,
    @GetAuthUser() user: AuthUser,
  ): Promise<TransferResponseDto> {
    const result = await this.ledgerService.transferBetweenAccounts(
      transferDto.fromAccountId,
      transferDto.toAccountId,
      transferDto.amount,
      user.userId,
      transferDto.description,
    );

    return {
      transactionId: result.transactionId,
      fromAccountId: transferDto.fromAccountId,
      toAccountId: transferDto.toAccountId,
      amount: transferDto.amount,
      description: transferDto.description,
      success: result.success,
    };
  }
}
