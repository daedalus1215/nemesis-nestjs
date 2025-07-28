import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Balance } from 'src/shared/shared-entities/entities/balance.entity';
import { BalanceService } from './balance/domain/services/balance.service';
import { GetBalanceAction } from './balance/app/controllers/get-balance-action/get-balance.action';
import { TransferAction } from './balance/app/controllers/transfer-action/transfer.action';
import { BalanceRepository } from './balance/infrastructure/repositories/balance.repository';
import { TransactionRepository } from './balance/infrastructure/repositories/transaction.repository';
import { Transaction } from 'src/shared/shared-entities/entities/transaction.entity';
import { GetBalanceOrCreateZeroBalanceHelper } from './balance/domain/transaction-scripts/transaction-scripts-facade/get-balance-or-create-zero-balance.helper';
import { TransactionScriptFacade } from './balance/domain/transaction-scripts/transaction-scripts-facade/transaction.script.facade';
import { GetAllTransactionsForUserTS } from './balance/domain/transaction-scripts/get-all-transactions-for-user-TS/get-all-transactions-for-user.transaction.script';
import { TransferTS } from './balance/domain/transaction-scripts/transfer-TS/transfer.transaction.script';
import { ConvertTransactionToDto } from './balance/app/controllers/transfer-action/convert-transaction-to-dto.converter';
import { BalanceAggregator } from './balance/domain/aggregators/balance.aggregator';
import { GetBalanceTS } from './balance/domain/transaction-scripts/get-balance-TS/get-balance.transaction.script';
import { GetAllTransactionsForUserAction } from './balance/app/controllers/get-all-transactions-for-user-action/get-all-transactions-for-user.action';
import { GetTransactionsPaginatedAction } from './balance/app/controllers/get-transactions-paginated-action/get-transactions-paginated.action';
import { UserAggregator } from 'src/users/domain/user.aggregator';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Balance, Transaction]), UsersModule],
  controllers: [
    GetBalanceAction,
    TransferAction,
    GetAllTransactionsForUserAction,
    GetTransactionsPaginatedAction,
  ],
  providers: [
    BalanceService,
    BalanceRepository,
    { provide: 'BalanceRepositoryPort', useClass: BalanceRepository },
    TransactionRepository,
    { provide: 'TransactionRepositoryPort', useClass: TransactionRepository },
    TransactionScriptFacade,
    GetBalanceOrCreateZeroBalanceHelper,
    GetAllTransactionsForUserTS,
    TransferTS,
    ConvertTransactionToDto,
    BalanceAggregator,
    GetBalanceTS,
    UserAggregator,
  ],
  exports: [BalanceAggregator],
})
export class LedgerModule {}
