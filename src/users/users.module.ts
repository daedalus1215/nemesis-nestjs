import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './domain/services/users.service';
import { UsersController } from './app/controllers/users.controller';
import { User, UserSchema } from './domain/entities/user.entity.';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserConverter } from './app/controllers/get-user-action/get-user.converter';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri:
          `${configService.get<string>('DATABASE_TYPE')}:` +
          `//${configService.get<string>('DATABASE_HOST')}` +
          `:${configService.get<string>('DATABASE_PORT')}` +
          `/${configService.get<string>('DATABASE_NAME')}`,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [UsersService, UserConverter],
  controllers: [UsersController],
  exports: [UsersService, UserConverter, MongooseModule],
})
export class UsersModule {}
