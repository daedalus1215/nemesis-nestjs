import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../users/domain/entities/user.entity';
import { Account } from '../../ledger/accounts/domain/entities/account.entity';
import { Transaction } from '../../transactions/domain/entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Account, Transaction])],
  exports: [TypeOrmModule],
})
export class SharedEntitiesModule {}
