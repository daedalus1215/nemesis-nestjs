import { CreateUserDto } from '../../app/dtos/create-user.dto';
import { User } from '../../../shared/shared-entities/entities/user.entity';
import { UserRepository } from 'src/users/infrastructure/user.repository';
import { Injectable } from '@nestjs/common';
import { CreateUserTransactionScript } from '../transaction-scripts/create-user-ts/create-user.transaction.script';
import { BalanceAggregator } from 'src/ledger/balance/domain/aggregators/balance.aggregator';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly createUserTransactionScript: CreateUserTransactionScript,
    private readonly balanceAggregator: BalanceAggregator,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.createUserTransactionScript.apply(createUserDto);
    await this.balanceAggregator.createNewBalance(user.id);
    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findByUsername(username);
  }

  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  async update(id: number, user: User): Promise<User> {
    return await this.userRepository.update(id, user);
  }

  async getUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}
