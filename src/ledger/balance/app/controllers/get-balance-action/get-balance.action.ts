import { Controller, Get } from '@nestjs/common';
import { BalanceService } from '../../../domain/services/balance.service';
import { Balance } from 'src/shared/shared-entities/entities/balance.entity';
import {
  AuthUser,
  GetAuthUser,
} from 'src/auth/app/decorators/get-auth-user.decorator';

@Controller('balances')
export class GetBalanceAction {
  constructor(private readonly balanceService: BalanceService) {}

  @Get('/for-user')
  async execute(@GetAuthUser() user: AuthUser): Promise<Balance> {
    return this.balanceService.getBalanceByUserId(user.userId);
  }
}
