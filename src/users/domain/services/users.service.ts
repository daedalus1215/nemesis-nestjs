import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../../app/dtos/create-user.dto';
import { UserConverter } from '../../app/controllers/get-user-action/get-user.converter';
import { GetUserDto } from '../../app/controllers/get-user-action/dtos/responses/get-user.dto';
import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity.';
import { UserRepository } from 'src/users/infrastructure/user.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly userConverter: UserConverter,
    private readonly userRepository: UserRepository,
  ) {}

//   async createUser(
//     createUserDto: CreateUserDto,
//   ): Promise<Omit<User, 'password'>> {
//     const { username, password } = createUserDto;

//     const existingUser = await this.userModel.findOne({ username });
//     if (existingUser) {
//       throw new ConflictException('Username already exists');
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const createdUser = new this.userModel({
//       username,
//       password: hashedPassword,
//     });

//     const savedUser = await createdUser.save();

//     const { password: _, ...result } = savedUser.toObject();
//     return result;
//   }

//   async findByUsername(username: string): Promise<UserDocument | null> {
//     return this.userModel.findOne({ username });
//   }

//   async findById(id: string): Promise<UserDocument | null> {
//     return this.userModel.findById(id);
//   }

//   async update(
//     id: string,
//     user: UserDocument,
//   ): Promise<UpdateWriteOpResult | null> {
//     return await this.userModel.updateOne({ _id: id }, user);
//   }

  async getUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}
