import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BalanceService } from './domain/services/balance.service';
import { BalanceRepository } from './infrastructure/repositories/balance.repository';
import { TransactionRepository } from './infrastructure/repositories/transaction.repository';
import { GetBalanceAction } from './app/controllers/get-balance-action/get-balance.action';
import { TransferAction } from './app/controllers/transfer-action/transfer.action';
import { Balance } from 'src/shared/shared-entities/entities/balance.entity';
import { Transaction } from 'src/shared/shared-entities/entities/transaction.entity';
import { Invoice } from 'src/shared/shared-entities/entities/invoice.entity';
import { GetAllTransactionsForUserAction } from './app/controllers/get-all-transactions-for-user-action/get-all-transactions-for-user.action';
import { TransactionScriptFacade } from './domain/transaction-scripts/transaction-scripts-facade/transaction.script.facade';
import { GetBalanceHelper } from './domain/transaction-scripts/transaction-scripts-facade/get-balance.helper';
import { GetAllTransactionsForUserTS } from './domain/transaction-scripts/get-all-transactions-for-user-TS/get-all-transactions-for-user.transaction.script';
import { TransferTS } from './domain/transaction-scripts/transfer-TS/transfer.transaction.script';
import { TransferConverter } from './app/controllers/transfer-action/transfer.converter';

@Module({
  imports: [TypeOrmModule.forFeature([Balance, Transaction, Invoice])],
  controllers: [
    GetBalanceAction,
    TransferAction,
    GetAllTransactionsForUserAction,
  ],
  providers: [
    BalanceService,
    {
      provide: 'BalanceRepositoryPort',
      useClass: BalanceRepository,
    },
    {
      provide: 'TransactionRepositoryPort',
      useClass: TransactionRepository,
    },
    TransactionScriptFacade,
    GetBalanceHelper,
    GetAllTransactionsForUserTS,
    TransferTS,
    TransferConverter,
  ],
  exports: [BalanceService],
})
export class BalanceModule {}
