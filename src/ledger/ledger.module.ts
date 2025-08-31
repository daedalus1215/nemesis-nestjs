import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AccountsModule } from './accounts/accounts.module';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [
    UsersModule, // For UserAggregator
    AccountsModule, // For AccountAggregator and controllers
    TransactionsModule, // For TransactionAggregator
  ],
  controllers: [
    // Controllers are now in AccountsModule
  ],
  exports: [AccountsModule], // Export the accounts module which has all the endpoints
})
export class LedgerModule {}
