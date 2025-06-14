import { Module } from '@nestjs/common';
import { UsersService } from './domain/services/users.service';
import { GetProfileAction } from './app/controllers/get-profile-action/get-profile.action';
import { User } from '../shared/shared-entities/entities/user.entity';
import { GetUserAction } from './app/controllers/get-user-action/get-user.action';
import { RegisterUserAction } from './app/controllers/register-user-action/register-user.action';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './infrastructure/user.repository';
import { GetProfileConverter } from './app/controllers/get-profile-action/get-profile.converter';
import { GetUserConverter } from './app/controllers/get-user-action/get-user.converter';
import { RegisterUserConverter } from './app/controllers/register-user-action/register-user.converter';
import { CreateUserTransactionScript } from './domain/transaction-scripts/create-user-ts/create-user.transaction.script';
import { UserExistsValidator } from './domain/transaction-scripts/create-user-ts/validators/user-exists.validatgor';
import { IsPasswordStrongValidator } from './domain/transaction-scripts/create-user-ts/validators/is-password-strong.validator';
import { ConfigModule } from '@nestjs/config';
import { LedgerModule } from 'src/ledger/ledger.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ConfigModule, LedgerModule],
  providers: [
    UsersService,
    UserRepository,
    GetProfileConverter,
    GetUserConverter,
    RegisterUserConverter,
    CreateUserTransactionScript,
    UserExistsValidator,
    IsPasswordStrongValidator,
  ],
  controllers: [GetProfileAction, GetUserAction, RegisterUserAction],
  exports: [UsersService, UserRepository],
})
export class UsersModule {}
