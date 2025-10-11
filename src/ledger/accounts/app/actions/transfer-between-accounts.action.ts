import { Body, Controller, Post } from '@nestjs/common';
import {
  AuthUser,
  GetAuthUser,
} from '../../../../auth/app/decorators/get-auth-user.decorator';
import { LedgerService } from '../../../services/ledger.service';
import { ProtectedAction } from '../../../../shared/application/protected-action-options';
import { TransferBetweenUsersDto } from '../dtos/requests/transfer-between-users.dto';
import { TransferResponseDto } from '../dtos/responses/transfer-response.dto';

@Controller('accounts')
export class TransferBetweenExternalAccountsAction {
  constructor(private readonly ledgerService: LedgerService) {}

  @Post('transfer')
  @ProtectedAction({
    tag: 'Account',
    summary: 'Transfer between users default accounts',
  })
  async handle(
    @Body() transferDto: TransferBetweenUsersDto,
    @GetAuthUser() user: AuthUser,
  ): Promise<TransferResponseDto> {
    const result = await this.ledgerService.transferBetweenUsers(
      user.userId,
      transferDto.toUserId,
      transferDto.amount,
      user.userId,
      transferDto.description,
    );

    return {
      transactionId: result.transactionId,
      fromAccountId: result.fromAccountId,
      toAccountId: result.toAccountId,
      amount: transferDto.amount,
      description: transferDto.description,
      success: result.success,
    };
  }
}
