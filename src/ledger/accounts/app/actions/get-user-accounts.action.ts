import { Controller, Get } from '@nestjs/common';
import {
  AuthUser,
  GetAuthUser,
} from '../../../../auth/app/decorators/get-auth-user.decorator';
import { ProtectedAction } from '../../../../shared/shared-entities/application/protected-action-options';
import { AccountAggregator } from '../../domain/aggregators/account.aggregator';
import { UserAccountsResponseDto } from '../dtos/responses/user-accounts-response.dto';

@Controller('accounts')
export class GetUserAccountsAction {
  constructor(private readonly accountAggregator: AccountAggregator) {}

  @Get()
  @ProtectedAction({
    tag: 'Account',
    summary: 'Get user accounts',
  })
  async handle(@GetAuthUser() user: AuthUser): Promise<UserAccountsResponseDto> {
    const accounts = await this.accountAggregator.getUserAccounts(user.userId);

    //@TODO: Move to a Responder.
    return {
      accounts: accounts.map(account => ({
        id: account.id,
        name: account.name,
        accountType: account.accountType,
        isDefault: account.isDefault,
        createdAt: account.createdAt,
      })),
      success: true,
    };
  }
}