import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './domain/entities/account.entity';
import { Transaction } from '../../transactions/domain/entities/transaction.entity';
import { AccountRepository } from './infra/repositories/account.repository';
import { AccountService } from './domain/services/account-service/account.service';
import { AccountAggregator } from './domain/aggregators/account.aggregator';
import { AccountBalanceService } from './domain/services/account-balance.service';
import { SystemAccountService } from './domain/services/system-account.service';
import { UsersModule } from '../../users/users.module';
import { TransactionAggregator } from '../../transactions/domain/aggregators/transaction.aggregator';
import { TransactionRepository } from '../../transactions/infra/repositories/transaction.repository';
import { TransactionService } from '../../transactions/domain/services/transaction.service';
import { CreateAccountAction } from './app/actions/create-account.action';
import { GetUserAccountsAction } from './app/actions/get-user-accounts.action';
import { SetDefaultAccountAction } from './app/actions/set-default-account.action';
import { GetUserBalanceAction } from './app/actions/get-user-balance.action';
import { GetAccountBalanceAction } from './app/actions/get-account-balance.action';
import { GetFinancialSummaryAction } from './app/actions/get-financial-summary.action';
import { TransferBetweenAccountsAction } from './app/actions/transfer-between-accounts.action';
import { GetAccountTransactionHistoryAction } from './app/actions/get-account-transaction-history.action';
import { SeedMoneyAction } from './app/actions/seed-money.action';
import { LedgerService } from '../services/ledger.service';
// Transaction Scripts
import { GetUserAccountsTransactionScript } from './domain/transaction-scripts/get-user-accounts-TS/get-user-accounts.transaction.script';
import { GetAccountByIdTransactionScript } from './domain/transaction-scripts/get-account-by-id-TS/get-account-by-id.transaction.script';
import { CreateAccountTransactionScript } from './domain/transaction-scripts/create-account-TS/create-account.transaction.script';
import { SetDefaultAccountTransactionScript } from './domain/transaction-scripts/set-default-account-TS/set-default-account.transaction.script';
import { EnsureUserHasDefaultAccountInvariant } from './domain/invariants/ensure-user-has-default-account-invariant/ensure-user-has-default-account.invariant';
import { GetAccountByIdWithoutOwnershipTransactionScript } from './domain/transaction-scripts/get-account-by-id-without-ownership-TS/get-account-by-id-without-ownership.transaction.script';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Transaction]),
    UsersModule, // For UserAggregator
  ],
  providers: [
    AccountRepository,
    { provide: 'AccountRepositoryPort', useClass: AccountRepository },
    TransactionRepository,
    { provide: 'TransactionRepositoryPort', useClass: TransactionRepository },
    GetUserAccountsTransactionScript,
    GetAccountByIdTransactionScript,
    CreateAccountTransactionScript,
    SetDefaultAccountTransactionScript,
    EnsureUserHasDefaultAccountInvariant,
    GetAccountByIdWithoutOwnershipTransactionScript,
    AccountService,
    AccountAggregator,
    TransactionAggregator,
    TransactionService, // Added for SeedMoneyAction
    AccountBalanceService, 
    SystemAccountService, // Added for system account management
    LedgerService, 
  ],
  controllers: [
    CreateAccountAction,
    GetUserAccountsAction,
    SetDefaultAccountAction,
    GetUserBalanceAction,
    GetAccountBalanceAction,
    GetFinancialSummaryAction,
    TransferBetweenAccountsAction,
    GetAccountTransactionHistoryAction,
    SeedMoneyAction,
  ],
  exports: [AccountAggregator, LedgerService],
})
export class AccountsModule {}
