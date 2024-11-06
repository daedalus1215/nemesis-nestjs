import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './app/jwt.strategy';
import { AuthService } from './domain/auth.service';
import { AuthController } from './app/auth.controller';
import { UsersService } from 'src/users/domain/services/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '1h' },
            }),
            inject: [ConfigService],
        }),
        UsersModule,
    ],
    providers: [AuthService, JwtStrategy, UsersService],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule { }
