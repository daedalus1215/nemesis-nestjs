import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Balance } from 'src/shared/shared-entities/entities/balance.entity';
import { Invoice } from 'src/shared/shared-entities/entities/invoice.entity';
import { BalanceService } from './balance/domain/services/balance.service';
import { GetBalanceAction } from './balance/app/controllers/get-balance-action/get-balance.action';
import { TransferAction } from './balance/app/controllers/transfer-action/transfer.action';
import { BalanceRepository } from './balance/infrastructure/repositories/balance.repository';
import { TransactionRepository } from './balance/infrastructure/repositories/transaction.repository';
import { Transaction } from 'src/shared/shared-entities/entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Balance, Transaction, Invoice])],
  controllers: [GetBalanceAction, TransferAction],
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
  ],
  exports: [BalanceService],
})
export class LedgerModule {}
