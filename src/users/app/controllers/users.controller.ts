import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from 'src/users/domain/users.service';
import { CreateUserDto } from '../dtos/create-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() createUserDto: CreateUserDto) {
      const user = await this.usersService.createUser(createUserDto);
      return user;
    }

}
