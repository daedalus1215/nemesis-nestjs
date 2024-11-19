import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from 'src/users/domain/services/users.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { JwtAuthGuard } from 'src/auth/app/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);
    return user;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers(): Promise<any> {
    return await this.usersService.getUsers();
  }
}
