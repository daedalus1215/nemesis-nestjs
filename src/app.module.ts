import { Module } from '@nestjs/common';
import { AppController } from './app/app.controller';
import { AppService } from './domain/app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://<username>:<password>@<cluster-endpoint>:<port>/<dbname>?ssl=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false',
    ),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
