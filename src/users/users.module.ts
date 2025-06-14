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

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UsersService,
    UserRepository,
    GetProfileConverter,
    GetUserConverter,
    RegisterUserConverter,
  ],
  controllers: [GetProfileAction, GetUserAction, RegisterUserAction],
  exports: [UsersService, UserRepository],
})
export class UsersModule {}
