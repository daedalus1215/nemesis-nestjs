import { Body, Controller, Post } from '@nestjs/common';
import { BalanceService } from '../../../domain/services/balance.service';
import {
  AuthUser,
  GetAuthUser,
} from 'src/auth/app/decorators/get-auth-user.decorator';
import {
  ConvertTransactionToDto,
  TransferResponse,
} from './convert-transaction-to-dto.converter';
import { ProtectedAction } from 'src/shared/shared-entities/application/protected-action-options';

type TransferDto = {
  toUserId: number;
  amount: number;
  description?: string;
};

@Controller('balances')
export class TransferAction {
  constructor(
    private readonly balanceService: BalanceService,
    private readonly convertTransactionToDto: ConvertTransactionToDto,
  ) {}

  @Post('transfer')
  @ProtectedAction({
    tag: 'Balance',
    summary: 'Transfer balance between users',
  })
  async apply(
    @Body() dto: TransferDto,
    @GetAuthUser() user: AuthUser,
  ): Promise<TransferResponse> {
    return this.convertTransactionToDto.apply(
      await this.balanceService.transfer(
        user.userId,
        dto.toUserId,
        dto.amount,
        dto.description,
      ),
    );
  }
}
