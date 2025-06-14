import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../../app/dtos/create-user.dto';
import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '../../../shared/shared-entities/entities/user.entity';
import { UserRepository } from 'src/users/infrastructure/user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;

    const existingUser = await this.userRepository.findByUsername(username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.userRepository.create({
      username,
      password: hashedPassword,
    });
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
