import { Controller, Get } from '@nestjs/common';
import { BalanceService } from '../../../domain/services/balance.service';
import { Balance } from 'src/shared/shared-entities/entities/balance.entity';
import {
  AuthUser,
  GetAuthUser,
} from 'src/auth/app/decorators/get-auth-user.decorator';
import { ProtectedAction } from 'src/shared/shared-entities/application/protected-action-options';

@Controller('balances')
export class GetBalanceAction {
  constructor(private readonly balanceService: BalanceService) {}

  @Get('/for-user')
  @ProtectedAction({
    tag: 'Balance',
    summary: 'Get balance for a user',
  })
  async apply(@GetAuthUser() user: AuthUser): Promise<Balance> {
    console.log('AuthUser', user);
    return await this.balanceService.getBalanceByUserId(user.userId);
  }
}
