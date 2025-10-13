import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './domain/entities/account.entity';
import { Payment } from '../../payments/domain/entities/payment.entity';
import { AccountRepository } from './infra/repositories/account.repository';
import { AccountService } from './domain/services/account-service/account.service';
import { AccountAggregator } from './domain/aggregators/account.aggregator';
import { AccountBalanceService } from './domain/services/account-balance.service';
import { SystemAccountService } from './domain/services/system-account.service';
import { UsersModule } from '../../users/users.module';
import { PaymentAggregator } from '../../payments/domain/aggregators/payment.aggregator';
import { PaymentRepository } from '../../payments/infra/repositories/payment.repository';
import { PaymentService } from '../../payments/domain/services/payment.service';
import { CreateAccountAction } from './app/actions/create-account-action/create-account.action';
import { GetUserAccountsAction } from './app/actions/fetch-user-accounts-action/fetch-user-accounts.action';
import { SetDefaultAccountAction } from './app/actions/set-default-account-action/set-default-account.action';
import { GetUserBalanceAction } from './app/actions/fetch-user-balance-action/get-user-balance.action';
import { FetchAccountBalanceAction } from './app/actions/fetch-account-balance-action/fetch-account-balance.action';
import { TransferBetweenExternalAccountsAction } from './app/actions/transfer-between-external-accounts-action/transfer-between-external-accounts.action';
import { FetchAccountPaymentHistoryAction } from './app/actions/fetch-account-payment-history-action/fetch-account-payment-history.action';
import { LedgerService } from '../services/ledger.service';
// Transaction Scripts
import { GetUserAccountsTransactionScript } from './domain/transaction-scripts/get-user-accounts-TS/get-user-accounts.transaction.script';
import { GetAccountByIdTransactionScript } from './domain/transaction-scripts/get-account-by-id-TS/get-account-by-id.transaction.script';
import { CreateAccountTransactionScript } from './domain/transaction-scripts/create-account-TS/create-account.transaction.script';
import { SetDefaultAccountTransactionScript } from './domain/transaction-scripts/set-default-account-TS/set-default-account.transaction.script';
import { EnsureUserHasDefaultAccountInvariant } from './domain/invariants/ensure-user-has-default-account-invariant/ensure-user-has-default-account.invariant';
import { GetAccountByIdWithoutOwnershipTransactionScript } from './domain/transaction-scripts/get-account-by-id-without-ownership-TS/get-account-by-id-without-ownership.transaction.script';
import { FetchUserAccountByIdAction } from './app/actions/fetch-account-by-id-action/fetch-account-by-id.action';
import { TransferBetweenInternalAccountsAction } from './app/actions/transfer-between-internal-accounts-action/transfer-between-internal-accounts.action';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Payment]),
    UsersModule, // For UserAggregator
  ],
  providers: [
    AccountRepository,
    { provide: 'AccountRepositoryPort', useClass: AccountRepository },
    PaymentRepository,
    { provide: 'PaymentRepositoryPort', useClass: PaymentRepository },
    GetUserAccountsTransactionScript,
    GetAccountByIdTransactionScript,
    CreateAccountTransactionScript,
    SetDefaultAccountTransactionScript,
    EnsureUserHasDefaultAccountInvariant,
    GetAccountByIdWithoutOwnershipTransactionScript,
    AccountService,
    AccountAggregator,
    PaymentAggregator,
    PaymentService, // Added for SeedMoneyAction
    AccountBalanceService,
    SystemAccountService, // Added for system account management
    LedgerService,
  ],
  controllers: [
    CreateAccountAction,
    GetUserAccountsAction,
    SetDefaultAccountAction,
    GetUserBalanceAction,
    FetchAccountBalanceAction,
    FetchUserAccountByIdAction,
    TransferBetweenExternalAccountsAction,
    TransferBetweenInternalAccountsAction,
    FetchAccountPaymentHistoryAction,
  ],
  exports: [AccountAggregator, LedgerService],
})
export class AccountsModule {}
