import { UserExistsValidator } from './validators/user-exists.validatgor';
import { IsPasswordStrongValidator } from './validators/is-password-strong.validator';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/users/infrastructure/user.repository';
import { CreateUserDto } from 'src/users/app/dtos/create-user.dto';
import { User } from 'src/users/domain/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateUserTransactionScript {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userExistsValidator: UserExistsValidator,
    private readonly isPasswordStrongValidator: IsPasswordStrongValidator,
    private readonly configService: ConfigService,
  ) {}

  async apply(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;

    const existingUser = await this.userRepository.findByUsername(username);

    this.userExistsValidator.apply(existingUser);
    this.isPasswordStrongValidator.apply(password);

    const saltRounds = this.configService.get<number>('BCRYPT_SALT_ROUNDS', 12);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return await this.userRepository.create({
      username,
      password: hashedPassword,
    });
  }
}
