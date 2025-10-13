import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AccountsModule } from './accounts/accounts.module';
import { TransactionsModule } from '../payments/payment.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LedgerTransaction } from './domain/entities/ledger.entity';
import { LedgerService } from './services/ledger.service';

@Module({
  imports: [
    UsersModule, 
    AccountsModule,
    TransactionsModule,
    TypeOrmModule.forFeature([LedgerTransaction]),
  ],
  providers: [
    LedgerService,
  ],
  controllers: [
  ],
  exports: [AccountsModule], // Export the accounts module which has all the endpoints
})
export class LedgerModule {}
