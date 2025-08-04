import { Body, Controller, Post } from '@nestjs/common';
import { LedgerService } from '../../../services/ledger.service';
import { CreateAccountDto } from '../dtos/requests/create-account.dto';
import { AccountResponseDto } from '../dtos/responses/account-response.dto';
import {
  AuthUser,
  GetAuthUser,
} from '../../../../auth/app/decorators/get-auth-user.decorator';
import { ProtectedAction } from '../../../../shared/shared-entities/application/protected-action-options';

@Controller('accounts')
export class CreateAccountAction {
  constructor(private readonly ledgerService: LedgerService) {}

  @Post()
  @ProtectedAction({
    tag: 'Account',
    summary: 'Create an account',
  })
  async handle(
    @Body() createAccountDto: CreateAccountDto,
    @GetAuthUser() user: AuthUser,
  ): Promise<AccountResponseDto> {
    const result = await this.ledgerService.createAccountForUser(
      user.userId,
      createAccountDto.name,
      createAccountDto.accountType,
    );

    return {
      id: result.accountId,
      name: createAccountDto.name,
      accountType: createAccountDto.accountType,
      isDefault: result.isDefault,
      success: true,
    };
  }
}
