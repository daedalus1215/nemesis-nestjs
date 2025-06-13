import { Body, Controller, Post } from '@nestjs/common';
import { BalanceService } from '../../../domain/services/balance.service';
import { Transaction } from '../../../domain/entities/transaction.entity';
import {
  AuthUser,
  GetAuthUser,
} from 'src/auth/app/decorators/get-auth-user.decorator';

type TransferRequest = {
  toUserId: number;
  amount: number;
  description?: string;
};

@Controller('transfers')
export class TransferAction {
  constructor(private readonly balanceService: BalanceService) {}

  @Post()
  async execute(
    @Body() request: TransferRequest,
    @GetAuthUser() user: AuthUser,
  ): Promise<Transaction> {
    return this.balanceService.transfer(
      user.userId,
      request.toUserId,
      request.amount,
      request.description,
    );
  }
}
