import { Controller, Get } from '@nestjs/common';
import {
  AuthUser,
  GetAuthUser,
} from '../../../../auth/app/decorators/get-auth-user.decorator';
import { ProtectedAction } from '../../../../shared/application/protected-action-options';
import { LedgerService } from '../../../services/ledger.service';
import { FinancialSummaryResponseDto } from '../dtos/responses/financial-summary-response.dto';

@Controller('accounts')
export class GetFinancialSummaryAction {
  constructor(private readonly ledgerService: LedgerService) {}

  @Get('summary')
  @ProtectedAction({
    tag: 'Account',
    summary: 'Get financial summary',
  })
  async handle(
    @GetAuthUser() user: AuthUser,
  ): Promise<FinancialSummaryResponseDto> {
    const summary = await this.ledgerService.getUserFinancialSummary(
      user.userId,
    );

    return {
      ...summary,
      success: true,
    };
  }
}
