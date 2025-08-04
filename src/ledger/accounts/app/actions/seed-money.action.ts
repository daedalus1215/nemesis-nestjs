import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AccountAggregator } from '../../domain/aggregators/account.aggregator';
import { TransactionService } from '../../../../transactions/domain/services/transaction.service';
import { SystemAccountService } from '../../domain/services/system-account.service';
import { SeedMoneyDto } from '../dtos/requests/seed-money.dto';

@Controller('maintenance/accounts')
export class SeedMoneyAction {
  constructor(
    private readonly accountAggregator: AccountAggregator,
    private readonly transactionService: TransactionService,
    private readonly systemAccountService: SystemAccountService,
  ) {}

  @Post('seed-money')
  @HttpCode(HttpStatus.OK)

  async handle(@Body() dto: SeedMoneyDto) {
    const { userId, amount, description = 'Initial seed money' } = dto;

    const userAccount = await this.accountAggregator.getDefaultAccountForUser(userId);

    const transaction = await this.transactionService.createValidatedTransaction({
      debitAccountId: this.systemAccountService.getSystemAccountId(), 
      creditAccountId: userAccount.id, 
      amount,
      description,
      category: 'adjustment', // Use valid category for seed money
      initiatingUserId: userId,
    });

    return {
      success: true,
      message: `Successfully seeded ${amount} to user ${userId}`,
      transaction: {
        id: transaction.id,
        amount: transaction.amount,
        description: transaction.description,
        userAccountId: userAccount.id,
        userAccountName: userAccount.name,
      },
    };
  }
}
