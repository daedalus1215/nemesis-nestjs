import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './domain/entities/payment.entity';
import { PaymentAggregator } from './domain/aggregators/payment.aggregator';
import { PaymentService } from './domain/services/payment.service';
import { PaymentRepository } from './infra/repositories/payment.repository';
import { AccountsModule } from '../ledger/accounts/accounts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    AccountsModule, 
  ],
  providers: [
    PaymentAggregator,
    PaymentService,
    PaymentRepository,
    { provide: 'PaymentRepositoryPort', useClass: PaymentRepository },
  ],
  exports: [PaymentAggregator], 
})
export class TransactionsModule {}
