import { Controller, Put, Param, ParseIntPipe } from '@nestjs/common';
import {
  AuthUser,
  GetAuthUser,
} from '../../../../auth/app/decorators/get-auth-user.decorator';
import { ProtectedAction } from '../../../../shared/shared-entities/application/protected-action-options';
import { AccountAggregator } from '../../domain/aggregators/account.aggregator';
import { SuccessResponseDto } from '../dtos/responses/success-response.dto';

@Controller('accounts')
export class SetDefaultAccountAction {
  constructor(private readonly accountAggregator: AccountAggregator) {}

  @Put(':accountId/default')
  @ProtectedAction({
    tag: 'Account',
    summary: 'Set default account',
  })
  async handle(
    @Param('accountId', ParseIntPipe) accountId: number,
    @GetAuthUser() user: AuthUser,
  ): Promise<SuccessResponseDto> {
    await this.accountAggregator.setAsDefault(accountId, user.userId);

    return {
      success: true,
      message: 'Default account updated successfully',
    };
  }
}
