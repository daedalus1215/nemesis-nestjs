import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './domain/services/users.service';
import { UsersController } from './app/controllers/users.controller';
import { User, UserSchema } from './infra/user.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb:`
          + `//${configService.get<string>("DATABASE_HOST")}`
          + `:${configService.get<string>("DATABASE_PORT")}`
          + `/${configService.get<string>("DATABASE_NAME")}`,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService, MongooseModule],
})
export class UsersModule { }
