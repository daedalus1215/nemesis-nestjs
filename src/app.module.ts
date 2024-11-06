import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
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
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
