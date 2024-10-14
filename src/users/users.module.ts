import { Module } from '@nestjs/common';
import { UsersService } from './domain/users.service';
import { UsersController } from './app/users.controller';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
