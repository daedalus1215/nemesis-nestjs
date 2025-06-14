import { Body, Controller, Post } from '@nestjs/common';
import { BalanceService } from '../../../domain/services/balance.service';
import {
  AuthUser,
  GetAuthUser,
} from 'src/auth/app/decorators/get-auth-user.decorator';
import { TransferConverter, TransferResponse } from './transfer.converter';

type TransferDto = {
  toUserId: number;
  amount: number;
  description?: string;
};

@Controller('balances')
export class TransferAction {
  constructor(
    private readonly balanceService: BalanceService,
    private readonly transferConverter: TransferConverter,
  ) {}

  @Post('transfer')
  async apply(
    @Body() dto: TransferDto,
    @GetAuthUser() user: AuthUser,
  ): Promise<TransferResponse> {
    return this.transferConverter.toResponse(
      await this.balanceService.transfer(
        user.userId,
        dto.toUserId,
        dto.amount,
        dto.description,
      ),
    );
  }
}
