import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './domain/entities/transaction.entity';
import { TransactionAggregator } from './domain/aggregators/transaction.aggregator';
import { TransactionService } from './domain/services/transaction.service';
import { TransactionRepository } from './infra/repositories/transaction.repository';
import { AccountsModule } from '../ledger/accounts/accounts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    AccountsModule, 
  ],
  providers: [
    TransactionAggregator,
    TransactionService,
    TransactionRepository,
    { provide: 'TransactionRepositoryPort', useClass: TransactionRepository },
  ],
  exports: [TransactionAggregator], 
})
export class TransactionsModule {}
