import { Module } from '@nestjs/common';
import { UsersService } from './domain/users.service';
import { UsersController } from './app/controllers/users.controller';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
