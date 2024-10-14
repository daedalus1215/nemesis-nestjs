import { Module } from '@nestjs/common';
import { AppController } from './app/app.controller';
import { AppService } from './domain/app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return process.env.NODE_ENV === "development"
          ? {
              uri: `mongodb://${configService.get<string>("DATABASE_HOST")}:${configService.get<string>("DATABASE_PORT")}/${configService.get<string>("DATABASE_NAME")}`,
            }
          : {
              uri: `mongodb://${configService.get<string>("DATABASE_USER")}:${configService.get<string>("DATABASE_PASSWORD")}@${configService.get<string>("DATABASE_HOST")}:${configService.get<string>("DATABASE_PORT")}/${configService.get<string>("DATABASE_NAME")}`,
            };
      },
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
