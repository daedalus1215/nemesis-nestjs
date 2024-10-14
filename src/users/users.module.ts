// src/users/users.module.ts

import { Module, Logger } from '@nestjs/common';
import { UsersService } from './domain/users.service';
import { UsersController } from './app/controllers/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './infra/user.schema';
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
