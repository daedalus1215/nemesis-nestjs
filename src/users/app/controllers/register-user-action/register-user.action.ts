import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from 'src/users/domain/services/users.service';
import { RegisterUserDto } from './dtos/requests/register-user.dto';
import { RegisterUserResponseDto } from './dtos/responses/register-user-response.dto';
import { RegisterUserSwagger } from './register-user.swagger';
import { RegisterUserConverter } from './register-user.converter';

@Controller('users')
export class RegisterUserAction {
  constructor(
    private readonly usersService: UsersService,
    private readonly converter: RegisterUserConverter,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @RegisterUserSwagger()
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<RegisterUserResponseDto> {
    return this.converter.toResponse(
      await this.usersService.createUser(registerUserDto),
    );
  }
}
