import { Controller, Get, Param } from '@nestjs/common';
import { BalanceService } from '../../../domain/services/balance.service';
import { Balance } from '../../../domain/entities/balance.entity';
import { AuthUser, GetAuthUser } from '../../../../../auth/app/decorators/get-auth-user.decorator';

@Controller('balances')
export class GetBalanceAction {
  constructor(private readonly balanceService: BalanceService) {}

  @Get()
  async execute(@GetAuthUser() user: AuthUser): Promise<Balance> {
    return this.balanceService.getBalance(user.userId);
  }
}
